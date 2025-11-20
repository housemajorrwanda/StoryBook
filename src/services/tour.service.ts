import {
  CreateAudioRegionData,
  CreateEffectData,
  CreateHotspotData,
  UpdateAudioRegionRequest,
  UpdateEffectRequest,
  UpdateHotspotRequest,
  UpdateVirtualTourRequest,
  VirtualTour,
  VirtualTourAudioRegion,
  VirtualTourEffect,
  VirtualTourFilters,
  VirtualTourHotspot,
  VirtualToursResponse,
} from "@/types/tour";
import axiosInstance from "@/config/axiosInstance";

class VirtualTourService {

  // GET /virtual-tours - Get all virtual tours with optional filters
  async getAllTours(filters: VirtualTourFilters = {}): Promise<VirtualToursResponse> {
    const params: Record<string, string> = {};

    if (filters.skip !== undefined) params.skip = filters.skip.toString();
    if (filters.limit !== undefined) params.limit = filters.limit.toString();
    if (filters.search) params.search = filters.search;
    if (filters.tourType) params.tourType = filters.tourType;
    if (filters.status) params.status = filters.status;
    if (filters.userId !== undefined) params.userId = filters.userId.toString();
    if (filters.isPublished !== undefined) params.isPublished = filters.isPublished.toString();

    const response = await axiosInstance.get<VirtualToursResponse>('/virtual-tours', { params });
    return response.data;
  }

  // GET /virtual-tours/my-tours - Get current user's virtual tours
  async getMyTours(filters: Omit<VirtualTourFilters, 'userId'> = {}): Promise<VirtualToursResponse> {
    const params: Record<string, string> = {};

    if (filters.skip !== undefined) params.skip = filters.skip.toString();
    if (filters.limit !== undefined) params.limit = filters.limit.toString();
    if (filters.search) params.search = filters.search;
    if (filters.tourType) params.tourType = filters.tourType;
    if (filters.status) params.status = filters.status;
    if (filters.isPublished !== undefined) params.isPublished = filters.isPublished.toString();

    const response = await axiosInstance.get<VirtualToursResponse>(`/virtual-tours/my-tours`, { params });
    return response.data;
  }

  // GET /virtual-tours/{id} - Get a virtual tour by ID with all interactive elements
  async getTourById(id: number): Promise<VirtualTour> {
    const response = await axiosInstance.get<VirtualTour>(`/virtual-tours/${id}`);
    return response.data;
  }

  // POST /virtual-tours 

  async createTour(formData: FormData): Promise<VirtualTour> {
  const response = await axiosInstance.post<VirtualTour>('/virtual-tours', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
}

  // PATCH /virtual-tours/{id} - Update a virtual tour
  async updateTour(id: number, tourData: UpdateVirtualTourRequest): Promise<VirtualTour> {
    const response = await axiosInstance.patch<VirtualTour>(`/virtual-tours/${id}`, tourData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }

  // DELETE /virtual-tours/{id} - Delete a virtual tour
  async deleteTour(id: number): Promise<void> {
    await axiosInstance.delete(`/virtual-tours/${id}`);
  }

  // PATCH /virtual-tours/{id}/publish - Publish a virtual tour
  async publishTour(id: number): Promise<VirtualTour> {
    const response = await axiosInstance.patch<VirtualTour>(`/virtual-tours/${id}/publish`);
    return response.data;
  }

  // PATCH /virtual-tours/{id}/unpublish - Unpublish a virtual tour
  async unpublishTour(id: number): Promise<VirtualTour> {
    const response = await axiosInstance.patch<VirtualTour>(`/virtual-tours/${id}/unpublish`);
    return response.data;
  }

  // PATCH /virtual-tours/{id}/archive - Archive a virtual tour
  async archiveTour(id: number): Promise<VirtualTour> {
    const response = await axiosInstance.patch<VirtualTour>(`/virtual-tours/${id}/archive`);
    return response.data;
  }

  // POST /virtual-tours/{id}/view - Increment tour view count
  async incrementViewCount(id: number): Promise<void> {
    await axiosInstance.post(`/virtual-tours/${id}/view`);
  }

  // Hotspot Management
  async createHotspot(tourId: number, hotspotData: CreateHotspotData): Promise<VirtualTourHotspot> {
    const response = await axiosInstance.post<VirtualTourHotspot>(`/virtual-tours/${tourId}/hotspots`, hotspotData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }

  async updateHotspot(tourId: number, hotspotId: number, hotspotData: UpdateHotspotRequest): Promise<VirtualTourHotspot> {
    const response = await axiosInstance.patch<VirtualTourHotspot>(`/virtual-tours/${tourId}/hotspots/${hotspotId}`, hotspotData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }

  async deleteHotspot(tourId: number, hotspotId: number): Promise<void> {
    await axiosInstance.delete(`/virtual-tours/${tourId}/hotspots/${hotspotId}`);
  }

  // Audio Region Management
  async createAudioRegion(tourId: number, audioRegionData: CreateAudioRegionData): Promise<VirtualTourAudioRegion> {
    const response = await axiosInstance.post<VirtualTourAudioRegion>(`/virtual-tours/${tourId}/audio-regions`, audioRegionData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }

  async updateAudioRegion(tourId: number, audioRegionId: number, audioRegionData: UpdateAudioRegionRequest): Promise<VirtualTourAudioRegion> {
    const response = await axiosInstance.patch<VirtualTourAudioRegion>(`/virtual-tours/${tourId}/audio-regions/${audioRegionId}`, audioRegionData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }

  async deleteAudioRegion(tourId: number, audioRegionId: number): Promise<void> {
    await axiosInstance.delete(`/virtual-tours/${tourId}/audio-regions/${audioRegionId}`);
  }

  // Effect Management
  async createEffect(tourId: number, effectData: CreateEffectData): Promise<VirtualTourEffect> {
    const response = await axiosInstance.post<VirtualTourEffect>(`/virtual-tours/${tourId}/effects`, effectData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }

  async updateEffect(tourId: number, effectId: number, effectData: UpdateEffectRequest): Promise<VirtualTourEffect> {
    const response = await axiosInstance.patch<VirtualTourEffect>(`/virtual-tours/${tourId}/effects/${effectId}`, effectData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }

  async deleteEffect(tourId: number, effectId: number): Promise<void> {
    await axiosInstance.delete(`/virtual-tours/${tourId}/effects/${effectId}`);
  }
}

export const virtualTourService = new VirtualTourService();