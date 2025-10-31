import axios from "axios";
import {
  Testimony,
  ImageUploadResponse,
  AudioUploadResponse,
} from "@/types/testimonies";

const publicApi = axios.create({
  baseURL:
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    "https://storybook-backend-production-574d.up.railway.app",
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

const uploadApi = axios.create({
  baseURL:
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    "https://storybook-backend-production-574d.up.railway.app",
  timeout: 120000,
  headers: {
    "Content-Type": "multipart/form-data",
  },
});

// Public API error handler (no auth redirect)
publicApi.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(error)
);

// Upload API error handler with retry logic
uploadApi.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(error)
);

// Helper function to test server connectivity
async function testServerConnectivity(): Promise<boolean> {
  try {
    await publicApi.get("/health", { timeout: 5000 });

    return true;
  } catch {
    return false;
  }
}

// Testimonies API Service
export const testimoniesService = {
  // Create testimony via single multipart endpoint
  async createTestimonyMultipart(fd: FormData): Promise<Testimony> {
    try {
      const response = await uploadApi.post<Testimony>("/testimonies", fd, {
        timeout: 300000,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get all published testimonies
  async getTestimonies(): Promise<Testimony[]> {
    const response = await publicApi.get<Testimony[]>("/testimonies");
    return response.data.filter((testimony) => testimony.isPublished);
  },

  // Get a single testimony by ID
  async getTestimonyById(id: number): Promise<Testimony> {
    const response = await publicApi.get<Testimony>(`/testimonies/${id}`);
    return response.data;
  },

  // Upload single image to Cloudinary with retry logic
  async uploadImage(file: File, retryCount = 0): Promise<ImageUploadResponse> {
    const maxRetries = 3;
    const maxSize = 10 * 1024 * 1024; // 10MB limit

    // Validate file size
    if (file.size > maxSize) {
      const error = new Error(
        `File too large: ${(file.size / 1024 / 1024).toFixed(2)}MB. Max: 10MB`
      );
      throw error;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await uploadApi.post<ImageUploadResponse>(
        "/upload/images",
        formData,
        {
          timeout: 120000,
          onUploadProgress: () => {},
        }
      );
      return response.data;
    } catch (error: unknown) {
      const errorCode =
        error && typeof error === "object" && "code" in error
          ? error.code
          : null;

      if (errorCode === "ECONNABORTED") {
        await testServerConnectivity();
      }

      // Retry logic for timeout or network errors
      if (
        retryCount < maxRetries &&
        (errorCode === "ECONNABORTED" || errorCode === "NETWORK_ERROR")
      ) {
        await new Promise((resolve) =>
          setTimeout(resolve, (retryCount + 1) * 2000)
        );
        return this.uploadImage(file, retryCount + 1);
      }

      if (
        errorCode === "ECONNABORTED" &&
        error &&
        typeof error === "object" &&
        "response" in error &&
        error.response
      ) {
        const axiosError = error as {
          response?: { data?: ImageUploadResponse };
        };
        if (axiosError.response?.data) {
          return axiosError.response.data;
        }
      }

      throw error;
    }
  },

  // Upload audio to Cloudinary
  async uploadAudio(file: File): Promise<AudioUploadResponse> {
    const maxSize = 50 * 1024 * 1024; // 50MB limit for audio

    // Validate file size
    if (file.size > maxSize) {
      const error = new Error(
        `Audio file too large: ${(file.size / 1024 / 1024).toFixed(
          2
        )}MB. Max: 50MB`
      );
      throw error;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await uploadApi.post<AudioUploadResponse>(
        "/upload/audio",
        formData,
        {
          timeout: 180000,
          onUploadProgress: () => {},
        }
      );
      return response.data;
    } catch (error: unknown) {
      const errorCode =
        error && typeof error === "object" && "code" in error
          ? error.code
          : null;

      if (
        errorCode === "ECONNABORTED" &&
        error &&
        typeof error === "object" &&
        "response" in error &&
        error.response
      ) {
        const axiosError = error as {
          response?: { data?: AudioUploadResponse };
        };
        if (axiosError.response?.data) {
          return axiosError.response.data;
        }
      }

      throw error;
    }
  },

  // Upload video
  async uploadVideo(file: File): Promise<AudioUploadResponse> {
    const maxSize = 100 * 1024 * 1024; // 100MB limit for video

    // Validate file size
    if (file.size > maxSize) {
      const error = new Error(
        `Video file too large: ${(file.size / 1024 / 1024).toFixed(
          2
        )}MB. Max: 100MB`
      );
      throw error;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await uploadApi.post<AudioUploadResponse>(
        "/upload/video",
        formData,
        {
          timeout: 300000, // 5 minutes for video
          onUploadProgress: () => {},
        }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Batch upload multiple images (individual calls)
  async uploadMultipleImages(files: File[]): Promise<ImageUploadResponse[]> {
    if (files.length === 0) {
      return [];
    }
    const uploadPromises = files.map((file) => this.uploadImage(file));

    const results = await Promise.allSettled(uploadPromises);

    const successfulUploads: ImageUploadResponse[] = [];
    const failedUploads: Array<{ fileName: string; error: unknown }> = [];

    results.forEach((result, index) => {
      if (result.status === "fulfilled") {
        successfulUploads.push(result.value);
      } else {
        failedUploads.push({
          fileName: files[index].name,
          error: result.reason,
        });
        console.error(`Failed to upload ${files[index].name}:`, result.reason);
      }
    });

    if (successfulUploads.length === 0 && failedUploads.length > 0) {
      const error = new Error(
        `Failed to upload all images: ${failedUploads
          .map((f) => f.fileName)
          .join(", ")}`
      );
      throw error;
    }

    return successfulUploads;
  },
};

export default testimoniesService;
