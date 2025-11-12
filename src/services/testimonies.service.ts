import {
  Testimony,
  ImageUploadResponse,
  AudioUploadResponse,
  CreateOrUpdateTestimonyRequest,
} from "@/types/testimonies";
import { publicApi, uploadApi, authenticatedApi } from "@/config/apiInstances";

// Helper function to test server connectivity
async function testServerConnectivity(): Promise<boolean> {
  try {
    await publicApi.get("/health", { timeout: 5000 });

    return true;
  } catch {
    return false;
  }
}

function buildTestimonyFormData(
  request: CreateOrUpdateTestimonyRequest
): FormData {
  const fd = new FormData();

  // Required fields (*)
  if (request.submissionType !== null && request.submissionType !== undefined) {
    fd.append("submissionType", String(request.submissionType));
  }
  if (
    request.identityPreference !== null &&
    request.identityPreference !== undefined
  ) {
    fd.append("identityPreference", String(request.identityPreference));
  }
  fd.append("eventTitle", request.eventTitle);
  fd.append("agreedToTerms", String(request.agreedToTerms));

  // Optional string fields
  if (request.fullName) {
    fd.append("fullName", request.fullName);
  }
  if (request.relationToEvent) {
    fd.append("relationToEvent", request.relationToEvent);
  }
  if (request.location) {
    fd.append("location", request.location);
  }
  if (request.eventDescription) {
    fd.append("eventDescription", request.eventDescription);
  }
  if (request.fullTestimony) {
    fd.append("fullTestimony", request.fullTestimony);
  }

  // Date fields
  if (request.dateOfEventFrom) {
    fd.append("dateOfEventFrom", request.dateOfEventFrom);
  }
  if (request.dateOfEventTo) {
    fd.append("dateOfEventTo", request.dateOfEventTo);
  }

  // Boolean and number fields
  if (typeof request.isDraft === "boolean") {
    fd.append("isDraft", String(request.isDraft));
  }
  if (typeof request.draftCursorPosition === "number") {
    fd.append("draftCursorPosition", String(request.draftCursorPosition));
  }

  // Array of objects - relatives
  if (request.relatives && Array.isArray(request.relatives)) {
    fd.append("relatives", JSON.stringify(request.relatives));
  }

  // Images
  if (
    request.images &&
    Array.isArray(request.images) &&
    request.images.length > 0
  ) {
    request.images.forEach((image) => {
      fd.append("images", image as File | string);
    });
  }

  if (
    request.imageDescriptions &&
    Array.isArray(request.imageDescriptions) &&
    request.imageDescriptions.length > 0
  ) {
    fd.append("imageDescriptions", JSON.stringify(request.imageDescriptions));
  }

  // Binary files
  if (request.audio) {
    fd.append("audio", request.audio);
  }
  if (request.video) {
    fd.append("video", request.video);
  }

  return fd;
}

// Testimonies API Service
export const testimoniesService = {
  async createTestimony(
    request: CreateOrUpdateTestimonyRequest
  ): Promise<Testimony> {
    try {
      const fd = buildTestimonyFormData(request);
      const response = await authenticatedApi.post<Testimony>(
        "/testimonies",
        fd,
        {
          timeout: 300000,
        }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async createTestimonyMultipart(fd: FormData): Promise<Testimony> {
    try {
      const response = await authenticatedApi.post<Testimony>(
        "/testimonies",
        fd,
        {
          timeout: 300000,
        }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get all testimonies with optional filters
  async getTestimonies(filters?: {
    search?: string;
    submissionType?: string;
    status?: string;
    isPublished?: boolean;
    dateFrom?: string;
    dateTo?: string;
    skip?: number;
    limit?: number;
  }): Promise<{ data: Testimony[]; meta?: { skip: number; limit: number; total: number } }> {
    const params: Record<string, string | number | boolean> = {};
    
    if (filters?.search) params.search = filters.search;
    if (filters?.submissionType) params.submissionType = filters.submissionType;
    if (filters?.status) params.status = filters.status;
    if (filters?.isPublished !== undefined) params.isPublished = filters.isPublished;
    if (filters?.dateFrom) params.dateFrom = filters.dateFrom;
    if (filters?.dateTo) params.dateTo = filters.dateTo;
    if (filters?.skip !== undefined) params.skip = filters.skip;
    if (filters?.limit !== undefined) params.limit = filters.limit;

    const response = await publicApi.get<{ data: Testimony[]; meta?: { skip: number; limit: number; total: number } }>(
      "/testimonies",
      { params }
    );
    
    return response.data;
  },

  // Get a single testimony by ID
  async getTestimonyById(id: number): Promise<Testimony> {
    const response = await publicApi.get<Testimony>(`/testimonies/${id}`);
    return response.data;
  },

  // Get user's draft testimonies

  async getDrafts(): Promise<Testimony[]> {
    try {
      const response = await authenticatedApi.get<
        { data: Testimony[] } | Testimony[]
      >("/testimonies/drafts");

      const testimonies = Array.isArray(response.data)
        ? response.data
        : response.data.data || [];

      return testimonies.filter(
        (testimony: Testimony) => testimony.isDraft === true
      );
    } catch (error) {
      console.error("Failed to fetch drafts:", error);
      if (error && typeof error === "object" && "response" in error) {
        const axiosError = error as {
          response?: { data?: unknown; status?: number };
        };
        console.error("Error response:", axiosError.response?.data);
        console.error("Status:", axiosError.response?.status);
      }
      return [];
    }
  },

  // Update testimony with new request format (REQUIRES AUTH)
  async updateTestimony(
    id: number,
    request: CreateOrUpdateTestimonyRequest
  ): Promise<Testimony> {
    try {
      const fd = buildTestimonyFormData(request);
      const response = await authenticatedApi.patch<Testimony>(
        `/testimonies/${id}`,
        fd,
        {
          timeout: 300000,
        }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async updateTestimonyMultipart(id: number, fd: FormData): Promise<Testimony> {
    try {
      const response = await authenticatedApi.patch<Testimony>(
        `/testimonies/${id}`,
        fd,
        {
          timeout: 300000,
        }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

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
    formData.append("files", file);

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
    const maxSize = 50 * 1024 * 1024;

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
    formData.append("files", file);

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
    const maxSize = 100 * 1024 * 1024;

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
    formData.append("files", file);

    try {
      const response = await uploadApi.post<AudioUploadResponse>(
        "/upload/video",
        formData,
        {
          timeout: 300000,
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
