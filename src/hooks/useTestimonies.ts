import {
  useQuery,
  useMutation,
  useQueryClient,
  UseQueryResult,
  UseMutationResult,
} from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { Testimony, CreateOrUpdateTestimonyRequest } from "@/types/testimonies";
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
  drafts: () => [...TESTIMONY_KEYS.all, "drafts"] as const,
};

// Get all testimonies with optional filters
export function useTestimonies(filters?: {
  search?: string;
  submissionType?: string;
  status?: string;
  isPublished?: boolean;
  dateFrom?: string;
  dateTo?: string;
  skip?: number;
  limit?: number;
}): UseQueryResult<{ data: Testimony[]; meta?: { skip: number; limit: number; total: number } }, Error> {
  return useQuery({
    queryKey: [...TESTIMONY_KEYS.lists(), filters],
    queryFn: () => testimoniesService.getTestimonies(filters),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
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

// Get user's draft testimonies (REQUIRES AUTH)
export function useDrafts(): UseQueryResult<Testimony[], Error> {
  return useQuery({
    queryKey: TESTIMONY_KEYS.drafts(),
    queryFn: () => testimoniesService.getDrafts(),
    staleTime: 2 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
    retry: 1,
  });
}

// Create testimony with new request format (REQUIRES AUTH)
export function useCreateTestimony(): UseMutationResult<
  Testimony,
  unknown,
  CreateOrUpdateTestimonyRequest
> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: CreateOrUpdateTestimonyRequest) =>
      testimoniesService.createTestimony(request),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: TESTIMONY_KEYS.lists(),
      });
      queryClient.setQueryData(TESTIMONY_KEYS.detail(data.id), data);

      if (variables.isDraft) {
        toast.success("Draft saved successfully!", {
          icon: "💾",
        });
        // Also invalidate drafts list
        queryClient.invalidateQueries({
          queryKey: TESTIMONY_KEYS.drafts(),
        });
      } else {
        toast.success(
          "Testimony submitted successfully! It will be reviewed before being published.",
          {
            duration: 6000,
            id: "testimony-submitted-success",
          }
        );
      }
    },
    onError: (error: unknown, variables) => {
      const message = getErrorMessage(
        error,
        variables.isDraft
          ? "Failed to save draft. Please try again."
          : "Failed to submit testimony. Please try again."
      );
      toast.error(message);
    },
  });
}

// Update testimony (REQUIRES AUTH)
export function useUpdateTestimony(): UseMutationResult<
  Testimony,
  unknown,
  { id: number; request: CreateOrUpdateTestimonyRequest }
> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      request,
    }: {
      id: number;
      request: CreateOrUpdateTestimonyRequest;
    }) => testimoniesService.updateTestimony(id, request),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: TESTIMONY_KEYS.lists(),
      });
      queryClient.setQueryData(TESTIMONY_KEYS.detail(data.id), data);

      if (variables.request.isDraft) {
        toast.success("Draft updated successfully!", {
          icon: "💾",
        });
        queryClient.invalidateQueries({
          queryKey: TESTIMONY_KEYS.drafts(),
        });
      } else {
        toast.success("Testimony updated successfully!");
      }
    },
    onError: (error: unknown, variables) => {
      const message = getErrorMessage(
        error,
        variables.request.isDraft
          ? "Failed to update draft. Please try again."
          : "Failed to update testimony. Please try again."
      );
      toast.error(message);
    },
  });
}

// Legacy method - accepts FormData directly (for backward compatibility)
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
