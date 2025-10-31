import {
  useQuery,
  useMutation,
  useQueryClient,
  UseQueryResult,
  UseMutationResult,
} from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import {
  Testimony,
  CreateTestimonyRequest,
  ImageUploadResponse,
  AudioUploadResponse,
} from "@/types/testimonies";
import { testimoniesService } from "@/services/testimonies.service";

// Helper function to extract error message
const getErrorMessage = (error: unknown, defaultMessage: string): string => {
  if (
    error instanceof Error &&
    "response" in error &&
    typeof error.response === "object" &&
    error.response &&
    "data" in error.response &&
    typeof error.response.data === "object" &&
    error.response.data &&
    "message" in error.response.data
  ) {
    return String(error.response.data.message);
  }
  return defaultMessage;
};

// Query Keys
export const TESTIMONY_KEYS = {
  all: ["testimonies"] as const,
  lists: () => [...TESTIMONY_KEYS.all, "list"] as const,
  list: (filters: string) => [...TESTIMONY_KEYS.lists(), { filters }] as const,
  details: () => [...TESTIMONY_KEYS.all, "detail"] as const,
  detail: (id: number) => [...TESTIMONY_KEYS.details(), id] as const,
};

// Get all published testimonies
export function useTestimonies(): UseQueryResult<Testimony[], Error> {
  return useQuery({
    queryKey: TESTIMONY_KEYS.lists(),
    queryFn: testimoniesService.getTestimonies,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

// Get all testimonies
export function useAllTestimonies(): UseQueryResult<Testimony[], Error> {
  return useQuery({
    queryKey: [...TESTIMONY_KEYS.all, "admin"],
    queryFn: testimoniesService.getAllTestimonies,
    staleTime: 2 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
  });
}

// Get single testimony by ID
export function useTestimony(id: number): UseQueryResult<Testimony, Error> {
  return useQuery({
    queryKey: TESTIMONY_KEYS.detail(id),
    queryFn: () => testimoniesService.getTestimonyById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

// Create testimony mutation
export function useCreateTestimony(): UseMutationResult<
  Testimony,
  unknown,
  CreateTestimonyRequest
> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: testimoniesService.createTestimony,
    onSuccess: (data) => {
      // Invalidate testimonies list to refetch
      queryClient.invalidateQueries({
        queryKey: TESTIMONY_KEYS.lists(),
      });

      // Add the new testimony to the cache
      queryClient.setQueryData(TESTIMONY_KEYS.detail(data.id), data);

      toast.success(
        "Testimony submitted successfully! It will be reviewed before being published."
      );
    },
    onError: (error: unknown) => {
      const message = getErrorMessage(
        error,
        "Failed to submit testimony. Please try again."
      );
      toast.error(message);
    },
  });
}

// Create testimony via single multipart endpoint
export function useCreateTestimonyMultipart(): UseMutationResult<
  Testimony,
  unknown,
  FormData
> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (fd: FormData) =>
      testimoniesService.createTestimonyMultipart(fd),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: TESTIMONY_KEYS.lists(),
      });
      queryClient.setQueryData(TESTIMONY_KEYS.detail(data.id), data);
      toast.success(
        "Testimony submitted successfully! It will be reviewed before being published."
      );
    },
    onError: (error: unknown) => {
      const message = getErrorMessage(
        error,
        "Failed to submit testimony. Please try again."
      );
      toast.error(message);
    },
  });
}

// Update testimony mutation (admin use)
export function useUpdateTestimony(): UseMutationResult<
  Testimony,
  unknown,
  { id: number; data: Partial<CreateTestimonyRequest> }
> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => testimoniesService.updateTestimony(id, data),
    onSuccess: (data) => {
      // Update the specific testimony in cache
      queryClient.setQueryData(TESTIMONY_KEYS.detail(data.id), data);

      // Invalidate lists to refetch
      queryClient.invalidateQueries({
        queryKey: TESTIMONY_KEYS.lists(),
      });

      toast.success("Testimony updated successfully!");
    },
    onError: (error: unknown) => {
      const message = getErrorMessage(error, "Failed to update testimony.");
      toast.error(message);
    },
  });
}

// Delete testimony mutation (admin use)
export function useDeleteTestimony(): UseMutationResult<void, unknown, number> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: testimoniesService.deleteTestimony,
    onSuccess: (_, deletedId) => {
      // Remove from cache
      queryClient.removeQueries({
        queryKey: TESTIMONY_KEYS.detail(deletedId),
      });

      // Invalidate lists to refetch
      queryClient.invalidateQueries({
        queryKey: TESTIMONY_KEYS.lists(),
      });

      toast.success("Testimony deleted successfully!");
    },
    onError: (error: unknown) => {
      const message = getErrorMessage(error, "Failed to delete testimony.");
      toast.error(message);
    },
  });
}

// Upload image mutation with progress support
export function useUploadImage(): UseMutationResult<
  ImageUploadResponse,
  unknown,
  { file: File; onProgress?: (progress: number) => void }
> {
  return useMutation({
    mutationFn: ({ file }) => testimoniesService.uploadImage(file),
    onError: (error: unknown) => {
      const message = getErrorMessage(error, "Failed to upload image.");
      toast.error(message);
    },
  });
}

// Upload multiple images mutation with progress support
export function useUploadMultipleImages(): UseMutationResult<
  ImageUploadResponse[],
  unknown,
  { files: File[]; onProgress?: (fileIndex: number, progress: number) => void }
> {
  return useMutation({
    mutationFn: ({ files }) => testimoniesService.uploadMultipleImages(files),
    onError: (error: unknown) => {
      const message = getErrorMessage(error, "Failed to upload images.");
      toast.error(message);
    },
  });
}

// Upload audio mutation with progress support
export function useUploadAudio(): UseMutationResult<
  AudioUploadResponse,
  unknown,
  { file: File; onProgress?: (progress: number) => void }
> {
  return useMutation({
    mutationFn: ({ file }) => testimoniesService.uploadAudio(file),
    onError: (error: unknown) => {
      const message = getErrorMessage(error, "Failed to upload audio.");
      toast.error(message);
    },
  });
}

// Upload video mutation with progress support
export function useUploadVideo(): UseMutationResult<
  AudioUploadResponse,
  unknown,
  { file: File; onProgress?: (progress: number) => void }
> {
  return useMutation({
    mutationFn: ({ file }) => testimoniesService.uploadVideo(file),
    onError: (error: unknown) => {
      const message = getErrorMessage(error, "Failed to upload video.");
      toast.error(message);
    },
  });
}

// Simplified upload hooks (without progress tracking)
export function useUploadImageSimple(): UseMutationResult<
  ImageUploadResponse,
  unknown,
  File
> {
  return useMutation({
    mutationFn: (file: File) => testimoniesService.uploadImage(file),
    onError: (error: unknown) => {
      const message = getErrorMessage(error, "Failed to upload image.");
      toast.error(message);
    },
  });
}

export function useUploadMultipleImagesSimple(): UseMutationResult<
  ImageUploadResponse[],
  unknown,
  File[]
> {
  return useMutation({
    mutationFn: (files: File[]) =>
      testimoniesService.uploadMultipleImages(files),
    onError: (error: unknown) => {
      const message = getErrorMessage(error, "Failed to upload images.");
      toast.error(message);
    },
  });
}

export function useUploadAudioSimple(): UseMutationResult<
  AudioUploadResponse,
  unknown,
  File
> {
  return useMutation({
    mutationFn: (file: File) => testimoniesService.uploadAudio(file),
    onError: (error: unknown) => {
      const message = getErrorMessage(error, "Failed to upload audio.");
      toast.error(message);
    },
  });
}

export function useUploadVideoSimple(): UseMutationResult<
  AudioUploadResponse,
  unknown,
  File
> {
  return useMutation({
    mutationFn: (file: File) => testimoniesService.uploadVideo(file),
    onError: (error: unknown) => {
      const message = getErrorMessage(error, "Failed to upload video.");
      toast.error(message);
    },
  });
}
