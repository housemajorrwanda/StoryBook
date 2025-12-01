import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { educationService } from "@/services/education.service";
import { 
  UseEducationContentParams, 
  EducationResponse, 
  EducationContent,
  EducationStatistics,
  UserProgressResponse
} from "@/types/education";


// =========================
// GET /education
// =========================
export function useEducationContent(params: UseEducationContentParams = {}) {
  return useQuery<EducationResponse>({
    queryKey: ["education-content", params],
    queryFn: () => educationService.getAll(params),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}


// =========================
// GET /education/published
// =========================
export function usePublishedEducation(params: { skip?: number; limit?: number; search?: string } = {}) {
  return useQuery<EducationResponse>({
    queryKey: ["education-published", params],
    queryFn: () => educationService.getPublished(params),
    staleTime: 5 * 60 * 1000,
  });
}


// =========================
// GET /education/category/{category}
// =========================
export function useEducationByCategory(
  category: "history" | "prevention" | "reconciliation" | "education",
  params: { skip?: number; limit?: number; search?: string } = {},
) {
  return useQuery<EducationResponse>({
    queryKey: ["education-category", category, params],
    queryFn: () => educationService.getByCategory(category, params),
    enabled: !!category,
    staleTime: 5 * 60 * 1000,
  });
}


// =========================
// GET /education/popular
// =========================
export function usePopularEducation(limit?: number) {
  return useQuery<EducationContent[]>({
    queryKey: ["education-popular", limit],
    queryFn: () => educationService.getPopular(limit),
    staleTime: 5 * 60 * 1000,
  });
}


// =========================
// GET /education/statistics
// =========================
export function useEducationStatistics() {
  return useQuery<EducationStatistics>({
    queryKey: ["education-statistics"],
    queryFn: () => educationService.getStatistics(),
    staleTime: 10 * 60 * 1000, // Longer cache for statistics
  });
}


// =========================
// GET /education/my-content
// =========================
export function useMyEducationContent(params: UseEducationContentParams = {}) {
  return useQuery<EducationResponse>({
    queryKey: ["education-my-content", params],
    queryFn: () => educationService.getMyContent(params),
    staleTime: 5 * 60 * 1000,
  });
}


// =========================
// GET /education/my-progress
// =========================
export function useMyEducationProgress() {
  return useQuery<UserProgressResponse>({
    queryKey: ["education-my-progress"],
    queryFn: () => educationService.getMyProgress(),
    staleTime: 2 * 60 * 1000, // Shorter cache for progress data
  });
}


// =========================
// GET /education/{id}
// =========================
export function useEducationById(id: number) {
  return useQuery<EducationContent>({
    queryKey: ["education-by-id", id],
    queryFn: () => educationService.getById(id),
    enabled: !!id,
  });
}


// =========================
// POST /education/{id}/view
// =========================
export function useIncrementViews() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => educationService.incrementViews(id),

    onSuccess: (_, id) => {
      // Invalidate specific content and popular content
      queryClient.invalidateQueries({ queryKey: ["education-by-id", id] });
      queryClient.invalidateQueries({ queryKey: ["education-popular"] });
      queryClient.invalidateQueries({ queryKey: ["education-content"] });
    },

    onError: (error: Error) => {
      console.error("Failed to increment view count:", error);
    },
  });
}

// =========================
// POST /education/{id}/progress
// =========================
export function useTrackProgress() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, completed = true }: { id: number; completed?: boolean }) => 
      educationService.trackProgress(id, completed),

    onSuccess: (_, { id }) => {
      // Invalidate progress-related queries
      queryClient.invalidateQueries({ queryKey: ["education-by-id", id] });
      queryClient.invalidateQueries({ queryKey: ["education-my-progress"] });
      queryClient.invalidateQueries({ queryKey: ["education-popular"] });
    },
  });
}


// =========================
// POST /education
// =========================
export function useCreateEducation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (formData: FormData) => educationService.create(formData),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["education-content"] });
      queryClient.invalidateQueries({ queryKey: ["education-my-content"] });
      queryClient.invalidateQueries({ queryKey: ["education-published"] });
      queryClient.invalidateQueries({ queryKey: ["education-statistics"] });
    },
  });
}


// =========================
// PATCH /education/{id}
// =========================
export function useUpdateEducation(id: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (formData: FormData) => educationService.update(id, formData),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["education-content"] });
      queryClient.invalidateQueries({ queryKey: ["education-by-id", id] });
      queryClient.invalidateQueries({ queryKey: ["education-my-content"] });
      queryClient.invalidateQueries({ queryKey: ["education-published"] });
      queryClient.invalidateQueries({ queryKey: ["education-statistics"] });
    },
  });
}


// =========================
// DELETE /education/{id}
// =========================
export function useDeleteEducation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => educationService.delete(id),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["education-content"] });
      queryClient.invalidateQueries({ queryKey: ["education-my-content"] });
      queryClient.invalidateQueries({ queryKey: ["education-published"] });
      queryClient.invalidateQueries({ queryKey: ["education-statistics"] });
    },
  });
}