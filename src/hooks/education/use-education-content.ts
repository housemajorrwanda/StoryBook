import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { educationService } from "@/services/education.service";
import { 
  UseEducationContentParams, 
  EducationResponse, 
  EducationContent 
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
    },
  });
}
