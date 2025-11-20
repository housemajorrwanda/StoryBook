import {
  useQuery,
  useMutation,
  useQueryClient,
  UseQueryResult,
  UseMutationResult,
  keepPreviousData,
} from "@tanstack/react-query";
import { toast } from "react-hot-toast";
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
import { virtualTourService } from "@/services/tour.service";



// Query keys
export const virtualTourKeys = {
  all: ["virtual-tours"] as const,
  lists: () => [...virtualTourKeys.all, "list"] as const,
  list: (filters: VirtualTourFilters) => [...virtualTourKeys.lists(), filters] as const,
  details: () => [...virtualTourKeys.all, "detail"] as const,
  detail: (id: number) => [...virtualTourKeys.details(), id] as const,
  myTours: (filters: Omit<VirtualTourFilters, "userId">) => [...virtualTourKeys.all, "my-tours", filters] as const,
  hotspots: (tourId: number) => [...virtualTourKeys.detail(tourId), "hotspots"] as const,
  audioRegions: (tourId: number) => [...virtualTourKeys.detail(tourId), "audio-regions"] as const,
  effects: (tourId: number) => [...virtualTourKeys.detail(tourId), "effects"] as const,
};

// Virtual Tours Queries
export const useVirtualTours = (
  filters: VirtualTourFilters = {}
): UseQueryResult<VirtualToursResponse, Error> => {
  return useQuery({
    queryKey: virtualTourKeys.list(filters),
    queryFn: () => virtualTourService.getAllTours(filters),
    placeholderData: keepPreviousData,
  });
};

export const useMyVirtualTours = (
  filters: Omit<VirtualTourFilters, "userId"> = {}
): UseQueryResult<VirtualToursResponse, Error> => {
  return useQuery({
    queryKey: virtualTourKeys.myTours(filters),
    queryFn: () => virtualTourService.getMyTours(filters),
    placeholderData: keepPreviousData,
  });
};

export const useVirtualTour = (
  id: number
): UseQueryResult<VirtualTour, Error> => {
  return useQuery({
    queryKey: virtualTourKeys.detail(id),
    queryFn: () => virtualTourService.getTourById(id),
    enabled: !!id,
  });
};

// Virtual Tours Mutations

export const useCreateVirtualTour = (): UseMutationResult<
  VirtualTour,
  Error,
  FormData
> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (formData: FormData) => virtualTourService.createTour(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: virtualTourKeys.lists() });
      queryClient.invalidateQueries({ queryKey: virtualTourKeys.myTours({}) });
      
      toast.success("Virtual tour created successfully");
    },
    onError: (error) => {
      toast.error(`Failed to create virtual tour: ${error.message}`);
    },
  });
};

export const useUpdateVirtualTour = (): UseMutationResult<
  VirtualTour,
  Error,
  { id: number; data: UpdateVirtualTourRequest }
> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => virtualTourService.updateTour(id, data),
    onSuccess: (updatedTour, variables) => {
      queryClient.setQueryData(
        virtualTourKeys.detail(variables.id),
        updatedTour
      );
      queryClient.invalidateQueries({ queryKey: virtualTourKeys.lists() });
      queryClient.invalidateQueries({ queryKey: virtualTourKeys.myTours({}) });
      toast.success("Virtual tour updated successfully");
    },
    onError: (error) => {
      toast.error(`Failed to update virtual tour: ${error.message}`);
    },
  });
};

export const useDeleteVirtualTour = (): UseMutationResult<
  void,
  Error,
  number
> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: virtualTourService.deleteTour,
    onSuccess: (_, deletedId) => {
      queryClient.removeQueries({ queryKey: virtualTourKeys.detail(deletedId) });
      queryClient.invalidateQueries({ queryKey: virtualTourKeys.lists() });
      queryClient.invalidateQueries({ queryKey: virtualTourKeys.myTours({}) });
      toast.success("Virtual tour deleted successfully");
    },
    onError: (error) => {
      toast.error(`Failed to delete virtual tour: ${error.message}`);
    },
  });
};

export const usePublishVirtualTour = (): UseMutationResult<
  VirtualTour,
  Error,
  number
> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: virtualTourService.publishTour,
    onSuccess: (updatedTour, tourId) => {
      queryClient.setQueryData(virtualTourKeys.detail(tourId), updatedTour);
      queryClient.invalidateQueries({ queryKey: virtualTourKeys.lists() });
      toast.success("Virtual tour published successfully");
    },
    onError: (error) => {
      toast.error(`Failed to publish virtual tour: ${error.message}`);
    },
  });
};

export const useUnpublishVirtualTour = (): UseMutationResult<
  VirtualTour,
  Error,
  number
> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: virtualTourService.unpublishTour,
    onSuccess: (updatedTour, tourId) => {
      queryClient.setQueryData(virtualTourKeys.detail(tourId), updatedTour);
      queryClient.invalidateQueries({ queryKey: virtualTourKeys.lists() });
      toast.success("Virtual tour unpublished successfully");
    },
    onError: (error) => {
      toast.error(`Failed to unpublish virtual tour: ${error.message}`);
    },
  });
};

export const useArchiveVirtualTour = (): UseMutationResult<
  VirtualTour,
  Error,
  number
> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: virtualTourService.archiveTour,
    onSuccess: (updatedTour, tourId) => {
      queryClient.setQueryData(virtualTourKeys.detail(tourId), updatedTour);
      queryClient.invalidateQueries({ queryKey: virtualTourKeys.lists() });
      toast.success("Virtual tour archived successfully");
    },
    onError: (error) => {
      toast.error(`Failed to archive virtual tour: ${error.message}`);
    },
  });
};

export const useIncrementViewCount = (): UseMutationResult<
  void,
  Error,
  number
> => {
  return useMutation({
    mutationFn: virtualTourService.incrementViewCount,
    onError: (error) => {
      console.error("Failed to increment view count:", error.message);
    },
  });
};

// Hotspots Mutations
export const useCreateHotspot = (tourId: number): UseMutationResult<
  VirtualTourHotspot,
  Error,
  CreateHotspotData
> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => virtualTourService.createHotspot(tourId, data),
    onSuccess: (newHotspot) => {
      queryClient.setQueryData<VirtualTour>(
        virtualTourKeys.detail(tourId),
        (old) => old ? {
          ...old,
          hotspots: [...old.hotspots, newHotspot],
        } : undefined
      );
      queryClient.invalidateQueries({ queryKey: virtualTourKeys.hotspots(tourId) });
      toast.success("Hotspot created successfully");
    },
    onError: (error) => {
      toast.error(`Failed to create hotspot: ${error.message}`);
    },
  });
};

export const useUpdateHotspot = (tourId: number): UseMutationResult<
  VirtualTourHotspot,
  Error,
  { hotspotId: number; data: UpdateHotspotRequest }
> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ hotspotId, data }) => virtualTourService.updateHotspot(tourId, hotspotId, data),
    onSuccess: (updatedHotspot, variables) => {
      queryClient.setQueryData<VirtualTour>(
        virtualTourKeys.detail(tourId),
        (old) => old ? {
          ...old,
          hotspots: old.hotspots.map(hotspot =>
            hotspot.id === variables.hotspotId ? updatedHotspot : hotspot
          ),
        } : undefined
      );
      queryClient.invalidateQueries({ queryKey: virtualTourKeys.hotspots(tourId) });
      toast.success("Hotspot updated successfully");
    },
    onError: (error) => {
      toast.error(`Failed to update hotspot: ${error.message}`);
    },
  });
};

export const useDeleteHotspot = (tourId: number): UseMutationResult<
  void,
  Error,
  number
> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (hotspotId) => virtualTourService.deleteHotspot(tourId, hotspotId),
    onSuccess: (_, deletedHotspotId) => {
      queryClient.setQueryData<VirtualTour>(
        virtualTourKeys.detail(tourId),
        (old) => old ? {
          ...old,
          hotspots: old.hotspots.filter(hotspot => hotspot.id !== deletedHotspotId),
        } : undefined
      );
      queryClient.invalidateQueries({ queryKey: virtualTourKeys.hotspots(tourId) });
      toast.success("Hotspot deleted successfully");
    },
    onError: (error) => {
      toast.error(`Failed to delete hotspot: ${error.message}`);
    },
  });
};

// Audio Regions Mutations
export const useCreateAudioRegion = (tourId: number): UseMutationResult<
  VirtualTourAudioRegion,
  Error,
  CreateAudioRegionData
> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => virtualTourService.createAudioRegion(tourId, data),
    onSuccess: (newAudioRegion) => {
      queryClient.setQueryData<VirtualTour>(
        virtualTourKeys.detail(tourId),
        (old) => old ? {
          ...old,
          audioRegions: [...old.audioRegions, newAudioRegion],
        } : undefined
      );
      queryClient.invalidateQueries({ queryKey: virtualTourKeys.audioRegions(tourId) });
      toast.success("Audio region created successfully");
    },
    onError: (error) => {
      toast.error(`Failed to create audio region: ${error.message}`);
    },
  });
};

export const useUpdateAudioRegion = (tourId: number): UseMutationResult<
  VirtualTourAudioRegion,
  Error,
  { audioRegionId: number; data: UpdateAudioRegionRequest }
> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ audioRegionId, data }) => virtualTourService.updateAudioRegion(tourId, audioRegionId, data),
    onSuccess: (updatedAudioRegion, variables) => {
      queryClient.setQueryData<VirtualTour>(
        virtualTourKeys.detail(tourId),
        (old) => old ? {
          ...old,
          audioRegions: old.audioRegions.map(region =>
            region.id === variables.audioRegionId ? updatedAudioRegion : region
          ),
        } : undefined
      );
      queryClient.invalidateQueries({ queryKey: virtualTourKeys.audioRegions(tourId) });
      toast.success("Audio region updated successfully");
    },
    onError: (error) => {
      toast.error(`Failed to update audio region: ${error.message}`);
    },
  });
};

export const useDeleteAudioRegion = (tourId: number): UseMutationResult<
  void,
  Error,
  number
> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (audioRegionId) => virtualTourService.deleteAudioRegion(tourId, audioRegionId),
    onSuccess: (_, deletedAudioRegionId) => {
      queryClient.setQueryData<VirtualTour>(
        virtualTourKeys.detail(tourId),
        (old) => old ? {
          ...old,
          audioRegions: old.audioRegions.filter(region => region.id !== deletedAudioRegionId),
        } : undefined
      );
      queryClient.invalidateQueries({ queryKey: virtualTourKeys.audioRegions(tourId) });
      toast.success("Audio region deleted successfully");
    },
    onError: (error) => {
      toast.error(`Failed to delete audio region: ${error.message}`);
    },
  });
};

// Effects Mutations
export const useCreateEffect = (tourId: number): UseMutationResult<
  VirtualTourEffect,
  Error,
  CreateEffectData
> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => virtualTourService.createEffect(tourId, data),
    onSuccess: (newEffect) => {
      queryClient.setQueryData<VirtualTour>(
        virtualTourKeys.detail(tourId),
        (old) => old ? {
          ...old,
          effects: [...old.effects, newEffect],
        } : undefined
      );
      queryClient.invalidateQueries({ queryKey: virtualTourKeys.effects(tourId) });
      toast.success("Effect created successfully");
    },
    onError: (error) => {
      toast.error(`Failed to create effect: ${error.message}`);
    },
  });
};

export const useUpdateEffect = (tourId: number): UseMutationResult<
  VirtualTourEffect,
  Error,
  { effectId: number; data: UpdateEffectRequest }
> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ effectId, data }) => virtualTourService.updateEffect(tourId, effectId, data),
    onSuccess: (updatedEffect, variables) => {
      queryClient.setQueryData<VirtualTour>(
        virtualTourKeys.detail(tourId),
        (old) => old ? {
          ...old,
          effects: old.effects.map(effect =>
            effect.id === variables.effectId ? updatedEffect : effect
          ),
        } : undefined
      );
      queryClient.invalidateQueries({ queryKey: virtualTourKeys.effects(tourId) });
      toast.success("Effect updated successfully");
    },
    onError: (error) => {
      toast.error(`Failed to update effect: ${error.message}`);
    },
  });
};

export const useDeleteEffect = (tourId: number): UseMutationResult<
  void,
  Error,
  number
> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (effectId) => virtualTourService.deleteEffect(tourId, effectId),
    onSuccess: (_, deletedEffectId) => {
      queryClient.setQueryData<VirtualTour>(
        virtualTourKeys.detail(tourId),
        (old) => old ? {
          ...old,
          effects: old.effects.filter(effect => effect.id !== deletedEffectId),
        } : undefined
      );
      queryClient.invalidateQueries({ queryKey: virtualTourKeys.effects(tourId) });
      toast.success("Effect deleted successfully");
    },
    onError: (error) => {
      toast.error(`Failed to delete effect: ${error.message}`);
    },
  });
};