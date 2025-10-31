import {
  useQuery,
  useMutation,
  useQueryClient,
  UseQueryResult,
  UseMutationResult,
} from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { Testimony } from "@/types/testimonies";
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
