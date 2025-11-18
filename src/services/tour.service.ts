import { CreateAudioRegionRequest, CreateEffectRequest, CreateHotspotRequest, CreateVirtualTourRequest, UpdateAudioRegionRequest, UpdateEffectRequest, UpdateHotspotRequest, UpdateVirtualTourRequest, VirtualTour, VirtualTourAudioRegion, VirtualTourEffect, VirtualTourFilters, VirtualTourHotspot, VirtualToursResponse } from "@/types/tour";
import axiosInstance from "@/config/axiosInstance";
class VirtualTourService {
  private baseUrl = '/virtual-tours';

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

    const response = await axiosInstance.get<VirtualToursResponse>(this.baseUrl, { params });
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

    const response = await axiosInstance.get<VirtualToursResponse>(`${this.baseUrl}/my-tours`, { params });
    return response.data;
  }

  // GET /virtual-tours/{id} - Get a virtual tour by ID with all interactive elements
  async getTourById(id: number): Promise<VirtualTour> {
    const response = await axiosInstance.get<VirtualTour>(`${this.baseUrl}/${id}`);
    return response.data;
  }

  // POST /virtual-tours - Create a new virtual tour (Admin only)
  async createTour(tourData: CreateVirtualTourRequest): Promise<VirtualTour> {
    const formData = new FormData();
    
    formData.append('title', tourData.title);
    formData.append('description', tourData.description);
    formData.append('location', tourData.location);
    formData.append('tourType', tourData.tourType);
    
    if (tourData.embedUrl) formData.append('embedUrl', tourData.embedUrl);
    if (tourData.image360File) formData.append('image360File', tourData.image360File);
    if (tourData.video360File) formData.append('video360File', tourData.video360File);
    if (tourData.model3dFile) formData.append('model3dFile', tourData.model3dFile);

    const response = await axiosInstance.post<VirtualTour>(this.baseUrl, formData);
    return response.data;
  }

  // PATCH /virtual-tours/{id} - Update a virtual tour (Admin only)
  async updateTour(id: number, tourData: UpdateVirtualTourRequest): Promise<VirtualTour> {
    const formData = new FormData();
    
    if (tourData.title !== undefined) formData.append('title', tourData.title);
    if (tourData.description !== undefined) formData.append('description', tourData.description);
    if (tourData.location !== undefined) formData.append('location', tourData.location);
    if (tourData.tourType !== undefined) formData.append('tourType', tourData.tourType);
    if (tourData.embedUrl !== undefined) formData.append('embedUrl', tourData.embedUrl);
    if (tourData.status !== undefined) formData.append('status', tourData.status);
    if (tourData.isPublished !== undefined) formData.append('isPublished', tourData.isPublished.toString());
    
    if (tourData.image360File) formData.append('image360File', tourData.image360File);
    if (tourData.video360File) formData.append('video360File', tourData.video360File);
    if (tourData.model3dFile) formData.append('model3dFile', tourData.model3dFile);

    const response = await axiosInstance.patch<VirtualTour>(`${this.baseUrl}/${id}`, formData);
    return response.data;
  }

  // DELETE /virtual-tours/{id} - Delete a virtual tour (Admin only)
  async deleteTour(id: number): Promise<void> {
    await axiosInstance.delete(`${this.baseUrl}/${id}`);
  }

  // PATCH /virtual-tours/{id}/publish - Publish a virtual tour (Admin only)
  async publishTour(id: number): Promise<VirtualTour> {
    const response = await axiosInstance.patch<VirtualTour>(`${this.baseUrl}/${id}/publish`);
    return response.data;
  }

  // PATCH /virtual-tours/{id}/unpublish - Unpublish a virtual tour (Admin only)
  async unpublishTour(id: number): Promise<VirtualTour> {
    const response = await axiosInstance.patch<VirtualTour>(`${this.baseUrl}/${id}/unpublish`);
    return response.data;
  }

  // PATCH /virtual-tours/{id}/archive - Archive a virtual tour (Admin only)
  async archiveTour(id: number): Promise<VirtualTour> {
    const response = await axiosInstance.patch<VirtualTour>(`${this.baseUrl}/${id}/archive`);
    return response.data;
  }

  // POST /virtual-tours/{id}/view - Increment tour view count
  async incrementViewCount(id: number): Promise<void> {
    await axiosInstance.post(`/virtual-tours/${id}/view`);
  }

  // Hotspot Management
  async createHotspot(tourId: number, hotspotData: CreateHotspotRequest): Promise<VirtualTourHotspot> {
    const formData = new FormData();
    
    formData.append('type', hotspotData.type);
    if (hotspotData.positionX !== undefined) formData.append('positionX', hotspotData.positionX.toString());
    if (hotspotData.positionY !== undefined) formData.append('positionY', hotspotData.positionY.toString());
    if (hotspotData.positionZ !== undefined) formData.append('positionZ', hotspotData.positionZ.toString());
    if (hotspotData.pitch !== undefined) formData.append('pitch', hotspotData.pitch.toString());
    if (hotspotData.yaw !== undefined) formData.append('yaw', hotspotData.yaw.toString());
    if (hotspotData.title) formData.append('title', hotspotData.title);
    if (hotspotData.description) formData.append('description', hotspotData.description);
    if (hotspotData.icon) formData.append('icon', hotspotData.icon);
    if (hotspotData.actionUrl) formData.append('actionUrl', hotspotData.actionUrl);
    if (hotspotData.actionEffect) formData.append('actionEffect', hotspotData.actionEffect);
    if (hotspotData.triggerDistance !== undefined) formData.append('triggerDistance', hotspotData.triggerDistance.toString());
    if (hotspotData.autoTrigger !== undefined) formData.append('autoTrigger', hotspotData.autoTrigger.toString());
    if (hotspotData.showOnHover !== undefined) formData.append('showOnHover', hotspotData.showOnHover.toString());
    if (hotspotData.color) formData.append('color', hotspotData.color);
    if (hotspotData.size !== undefined) formData.append('size', hotspotData.size.toString());
    if (hotspotData.order !== undefined) formData.append('order', hotspotData.order.toString());
    
    if (hotspotData.actionAudioFile) formData.append('actionAudioFile', hotspotData.actionAudioFile);
    if (hotspotData.actionVideoFile) formData.append('actionVideoFile', hotspotData.actionVideoFile);
    if (hotspotData.actionImageFile) formData.append('actionImageFile', hotspotData.actionImageFile);

    const response = await axiosInstance.post<VirtualTourHotspot>(`${this.baseUrl}/${tourId}/hotspots`, formData);
    return response.data;
  }

  async updateHotspot(tourId: number, hotspotId: number, hotspotData: UpdateHotspotRequest): Promise<VirtualTourHotspot> {
    const formData = new FormData();
    
    if (hotspotData.type !== undefined) formData.append('type', hotspotData.type);
    if (hotspotData.positionX !== undefined) formData.append('positionX', hotspotData.positionX.toString());
    if (hotspotData.positionY !== undefined) formData.append('positionY', hotspotData.positionY.toString());
    if (hotspotData.positionZ !== undefined) formData.append('positionZ', hotspotData.positionZ.toString());
    if (hotspotData.pitch !== undefined) formData.append('pitch', hotspotData.pitch.toString());
    if (hotspotData.yaw !== undefined) formData.append('yaw', hotspotData.yaw.toString());
    if (hotspotData.title !== undefined) formData.append('title', hotspotData.title);
    if (hotspotData.description !== undefined) formData.append('description', hotspotData.description);
    if (hotspotData.icon !== undefined) formData.append('icon', hotspotData.icon);
    if (hotspotData.actionUrl !== undefined) formData.append('actionUrl', hotspotData.actionUrl);
    if (hotspotData.actionEffect !== undefined) formData.append('actionEffect', hotspotData.actionEffect);
    if (hotspotData.triggerDistance !== undefined) formData.append('triggerDistance', hotspotData.triggerDistance.toString());
    if (hotspotData.autoTrigger !== undefined) formData.append('autoTrigger', hotspotData.autoTrigger.toString());
    if (hotspotData.showOnHover !== undefined) formData.append('showOnHover', hotspotData.showOnHover.toString());
    if (hotspotData.color !== undefined) formData.append('color', hotspotData.color);
    if (hotspotData.size !== undefined) formData.append('size', hotspotData.size.toString());
    if (hotspotData.order !== undefined) formData.append('order', hotspotData.order.toString());
    
    if (hotspotData.actionAudioFile) formData.append('actionAudioFile', hotspotData.actionAudioFile);
    if (hotspotData.actionVideoFile) formData.append('actionVideoFile', hotspotData.actionVideoFile);
    if (hotspotData.actionImageFile) formData.append('actionImageFile', hotspotData.actionImageFile);

    const response = await axiosInstance.patch<VirtualTourHotspot>(`${this.baseUrl}/${tourId}/hotspots/${hotspotId}`, formData);
    return response.data;
  }

  async deleteHotspot(tourId: number, hotspotId: number): Promise<void> {
    await axiosInstance.delete(`${this.baseUrl}/${tourId}/hotspots/${hotspotId}`);
  }

  // Audio Region Management
  async createAudioRegion(tourId: number, audioRegionData: CreateAudioRegionRequest): Promise<VirtualTourAudioRegion> {
    const formData = new FormData();
    
    formData.append('regionType', audioRegionData.regionType);
    formData.append('centerX', audioRegionData.centerX.toString());
    formData.append('centerY', audioRegionData.centerY.toString());
    formData.append('centerZ', audioRegionData.centerZ.toString());
    formData.append('audioFile', audioRegionData.audioFile);
    
    if (audioRegionData.radius !== undefined) formData.append('radius', audioRegionData.radius.toString());
    if (audioRegionData.width !== undefined) formData.append('width', audioRegionData.width.toString());
    if (audioRegionData.height !== undefined) formData.append('height', audioRegionData.height.toString());
    if (audioRegionData.depth !== undefined) formData.append('depth', audioRegionData.depth.toString());
    if (audioRegionData.volume !== undefined) formData.append('volume', audioRegionData.volume.toString());
    if (audioRegionData.loop !== undefined) formData.append('loop', audioRegionData.loop.toString());
    if (audioRegionData.fadeInDuration !== undefined) formData.append('fadeInDuration', audioRegionData.fadeInDuration.toString());
    if (audioRegionData.fadeOutDuration !== undefined) formData.append('fadeOutDuration', audioRegionData.fadeOutDuration.toString());
    if (audioRegionData.spatialAudio !== undefined) formData.append('spatialAudio', audioRegionData.spatialAudio.toString());
    if (audioRegionData.minDistance !== undefined) formData.append('minDistance', audioRegionData.minDistance.toString());
    if (audioRegionData.maxDistance !== undefined) formData.append('maxDistance', audioRegionData.maxDistance.toString());
    if (audioRegionData.autoPlay !== undefined) formData.append('autoPlay', audioRegionData.autoPlay.toString());
    if (audioRegionData.playOnce !== undefined) formData.append('playOnce', audioRegionData.playOnce.toString());
    if (audioRegionData.title) formData.append('title', audioRegionData.title);
    if (audioRegionData.description) formData.append('description', audioRegionData.description);
    if (audioRegionData.order !== undefined) formData.append('order', audioRegionData.order.toString());

    const response = await axiosInstance.post<VirtualTourAudioRegion>(`${this.baseUrl}/${tourId}/audio-regions`, formData);
    return response.data;
  }

  async updateAudioRegion(tourId: number, audioRegionId: number, audioRegionData: UpdateAudioRegionRequest): Promise<VirtualTourAudioRegion> {
    const formData = new FormData();
    
    if (audioRegionData.regionType !== undefined) formData.append('regionType', audioRegionData.regionType);
    if (audioRegionData.centerX !== undefined) formData.append('centerX', audioRegionData.centerX.toString());
    if (audioRegionData.centerY !== undefined) formData.append('centerY', audioRegionData.centerY.toString());
    if (audioRegionData.centerZ !== undefined) formData.append('centerZ', audioRegionData.centerZ.toString());
    
    if (audioRegionData.audioFile) formData.append('audioFile', audioRegionData.audioFile);
    if (audioRegionData.radius !== undefined) formData.append('radius', audioRegionData.radius.toString());
    if (audioRegionData.width !== undefined) formData.append('width', audioRegionData.width.toString());
    if (audioRegionData.height !== undefined) formData.append('height', audioRegionData.height.toString());
    if (audioRegionData.depth !== undefined) formData.append('depth', audioRegionData.depth.toString());
    if (audioRegionData.volume !== undefined) formData.append('volume', audioRegionData.volume.toString());
    if (audioRegionData.loop !== undefined) formData.append('loop', audioRegionData.loop.toString());
    if (audioRegionData.fadeInDuration !== undefined) formData.append('fadeInDuration', audioRegionData.fadeInDuration.toString());
    if (audioRegionData.fadeOutDuration !== undefined) formData.append('fadeOutDuration', audioRegionData.fadeOutDuration.toString());
    if (audioRegionData.spatialAudio !== undefined) formData.append('spatialAudio', audioRegionData.spatialAudio.toString());
    if (audioRegionData.minDistance !== undefined) formData.append('minDistance', audioRegionData.minDistance.toString());
    if (audioRegionData.maxDistance !== undefined) formData.append('maxDistance', audioRegionData.maxDistance.toString());
    if (audioRegionData.autoPlay !== undefined) formData.append('autoPlay', audioRegionData.autoPlay.toString());
    if (audioRegionData.playOnce !== undefined) formData.append('playOnce', audioRegionData.playOnce.toString());
    if (audioRegionData.title !== undefined) formData.append('title', audioRegionData.title);
    if (audioRegionData.description !== undefined) formData.append('description', audioRegionData.description);
    if (audioRegionData.order !== undefined) formData.append('order', audioRegionData.order.toString());

    const response = await axiosInstance.patch<VirtualTourAudioRegion>(`${this.baseUrl}/${tourId}/audio-regions/${audioRegionId}`, formData);
    return response.data;
  }

  async deleteAudioRegion(tourId: number, audioRegionId: number): Promise<void> {
    await axiosInstance.delete(`${this.baseUrl}/${tourId}/audio-regions/${audioRegionId}`);
  }

  // Effect Management
  async createEffect(tourId: number, effectData: CreateEffectRequest): Promise<VirtualTourEffect> {
    const formData = new FormData();
    
    formData.append('effectType', effectData.effectType);
    formData.append('triggerType', effectData.triggerType);
    formData.append('effectName', effectData.effectName);
    
    if (effectData.positionX !== undefined) formData.append('positionX', effectData.positionX.toString());
    if (effectData.positionY !== undefined) formData.append('positionY', effectData.positionY.toString());
    if (effectData.positionZ !== undefined) formData.append('positionZ', effectData.positionZ.toString());
    if (effectData.pitch !== undefined) formData.append('pitch', effectData.pitch.toString());
    if (effectData.yaw !== undefined) formData.append('yaw', effectData.yaw.toString());
    if (effectData.triggerDistance !== undefined) formData.append('triggerDistance', effectData.triggerDistance.toString());
    if (effectData.triggerDelay !== undefined) formData.append('triggerDelay', effectData.triggerDelay.toString());
    if (effectData.intensity !== undefined) formData.append('intensity', effectData.intensity.toString());
    if (effectData.duration !== undefined) formData.append('duration', effectData.duration.toString());
    if (effectData.color) formData.append('color', effectData.color);
    if (effectData.particleCount !== undefined) formData.append('particleCount', effectData.particleCount.toString());
    if (effectData.opacity !== undefined) formData.append('opacity', effectData.opacity.toString());
    if (effectData.size !== undefined) formData.append('size', effectData.size.toString());
    if (effectData.animationType) formData.append('animationType', effectData.animationType);
    if (effectData.animationSpeed !== undefined) formData.append('animationSpeed', effectData.animationSpeed.toString());
    if (effectData.title) formData.append('title', effectData.title);
    if (effectData.description) formData.append('description', effectData.description);
    if (effectData.order !== undefined) formData.append('order', effectData.order.toString());
    
    if (effectData.soundFile) formData.append('soundFile', effectData.soundFile);

    const response = await axiosInstance.post<VirtualTourEffect>(`${this.baseUrl}/${tourId}/effects`, formData);
    return response.data;
  }

  async updateEffect(tourId: number, effectId: number, effectData: UpdateEffectRequest): Promise<VirtualTourEffect> {
    const formData = new FormData();
    
    if (effectData.effectType !== undefined) formData.append('effectType', effectData.effectType);
    if (effectData.triggerType !== undefined) formData.append('triggerType', effectData.triggerType);
    if (effectData.effectName !== undefined) formData.append('effectName', effectData.effectName);
    if (effectData.positionX !== undefined) formData.append('positionX', effectData.positionX.toString());
    if (effectData.positionY !== undefined) formData.append('positionY', effectData.positionY.toString());
    if (effectData.positionZ !== undefined) formData.append('positionZ', effectData.positionZ.toString());
    if (effectData.pitch !== undefined) formData.append('pitch', effectData.pitch.toString());
    if (effectData.yaw !== undefined) formData.append('yaw', effectData.yaw.toString());
    if (effectData.triggerDistance !== undefined) formData.append('triggerDistance', effectData.triggerDistance.toString());
    if (effectData.triggerDelay !== undefined) formData.append('triggerDelay', effectData.triggerDelay.toString());
    if (effectData.intensity !== undefined) formData.append('intensity', effectData.intensity.toString());
    if (effectData.duration !== undefined) formData.append('duration', effectData.duration.toString());
    if (effectData.color !== undefined) formData.append('color', effectData.color);
    if (effectData.particleCount !== undefined) formData.append('particleCount', effectData.particleCount.toString());
    if (effectData.opacity !== undefined) formData.append('opacity', effectData.opacity.toString());
    if (effectData.size !== undefined) formData.append('size', effectData.size.toString());
    if (effectData.animationType !== undefined) formData.append('animationType', effectData.animationType);
    if (effectData.animationSpeed !== undefined) formData.append('animationSpeed', effectData.animationSpeed.toString());
    if (effectData.title !== undefined) formData.append('title', effectData.title);
    if (effectData.description !== undefined) formData.append('description', effectData.description);
    if (effectData.order !== undefined) formData.append('order', effectData.order.toString());
    
    if (effectData.soundFile) formData.append('soundFile', effectData.soundFile);

    const response = await axiosInstance.patch<VirtualTourEffect>(`${this.baseUrl}/${tourId}/effects/${effectId}`, formData);
    return response.data;
  }

  async deleteEffect(tourId: number, effectId: number): Promise<void> {
    await axiosInstance.delete(`${this.baseUrl}/${tourId}/effects/${effectId}`);
  }
}

export const virtualTourService = new VirtualTourService();