import axiosInstance from "@/config/axiosInstance";
import {
  EducationResponse,
  EducationContent,
  UseEducationContentParams,
} from "@/types/education";

class EducationService {
  // GET /education - full filters
  async getAll(params: UseEducationContentParams = {}): Promise<EducationResponse> {
    const query: Record<string, string> = {};

    if (params.skip !== undefined) query.skip = params.skip.toString();
    if (params.limit !== undefined) query.limit = params.limit.toString();
    if (params.search) query.search = params.search;
    if (params.type && params.type !== "all") query.type = params.type;
    if (params.category && params.category !== "all") query.category = params.category;
    if (params.status) query.status = params.status;
    if (params.isPublished !== undefined) query.isPublished = params.isPublished.toString();

    const response = await axiosInstance.get<EducationResponse>("/education", { params: query });
    return response.data;
  }

  // GET /education/published - only these 3 params are allowed
  async getPublished(params: { skip?: number; limit?: number; search?: string } = {}): Promise<EducationResponse> {
    const query: Record<string, string> = {};

    if (params.skip !== undefined) query.skip = params.skip.toString();
    if (params.limit !== undefined) query.limit = params.limit.toString();
    if (params.search) query.search = params.search;

    const response = await axiosInstance.get<EducationResponse>("/education/published", {
      params: query,
    });
    return response.data;
  }

  // GET /education/category/{category}
  async getByCategory(
    category: "history" | "prevention" | "reconciliation" | "education",
    params: { skip?: number; limit?: number; search?: string } = {}
  ): Promise<EducationResponse> {
    const query: Record<string, string> = {};

    if (params.skip !== undefined) query.skip = params.skip.toString();
    if (params.limit !== undefined) query.limit = params.limit.toString();
    if (params.search) query.search = params.search;

    const response = await axiosInstance.get<EducationResponse>(
      `/education/category/${category}`,
      { params: query }
    );

    return response.data;
  }

  // GET /education/my-content
  async getMyContent(params: UseEducationContentParams = {}): Promise<EducationResponse> {
    const query: Record<string, string> = {};

    if (params.skip !== undefined) query.skip = params.skip.toString();
    if (params.limit !== undefined) query.limit = params.limit.toString();
    if (params.search) query.search = params.search;
    if (params.type && params.type !== "all") query.type = params.type;
    if (params.category && params.category !== "all") query.category = params.category;

    const response = await axiosInstance.get<EducationResponse>("/education/my-content", {
      params: query,
    });
    return response.data;
  }

  // GET /education/{id}
  async getById(id: number): Promise<EducationContent> {
    const response = await axiosInstance.get<EducationContent>(`/education/${id}`);
    return response.data;
  }

  // POST /education
  async create(formData: FormData): Promise<EducationContent> {
    const response = await axiosInstance.post<EducationContent>("/education", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  }

  // PATCH /education/{id}
  async update(id: number, payload: FormData): Promise<EducationContent> {
    const response = await axiosInstance.patch<EducationContent>(`/education/${id}`, payload, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  }

  // DELETE /education/{id}
  async delete(id: number): Promise<void> {
    await axiosInstance.delete(`/education/${id}`);
  }
}

export const educationService = new EducationService();
