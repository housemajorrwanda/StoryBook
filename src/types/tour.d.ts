export interface VirtualTourHotspot {
  id: number;
  virtualTourId: number;
  positionX: number | null;
  positionY: number | null;
  positionZ: number | null;
  pitch: number | null;
  yaw: number | null;
  type: 'info' | 'link' | 'audio' | 'video' | 'image' | 'effect';
  title: string | null;
  description: string | null;
  icon: string | null;
  actionUrl: string | null;
  actionAudioUrl: string | null;
  actionVideoUrl: string | null;
  actionImageUrl: string | null;
  actionEffect: string | null;
  triggerDistance: number | null;
  autoTrigger: boolean;
  showOnHover: boolean;
  color: string | null;
  size: number | null;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface VirtualTourAudioRegion {
  id: number;
  virtualTourId: number;
  regionType: 'sphere' | 'box';
  centerX: number;
  centerY: number;
  centerZ: number;
  radius: number | null;
  width: number | null;
  height: number | null;
  depth: number | null;
  audioUrl: string;
  audioFileName: string;
  volume: number;
  loop: boolean;
  fadeInDuration: number | null;
  fadeOutDuration: number | null;
  spatialAudio: boolean;
  minDistance: number | null;
  maxDistance: number | null;
  autoPlay: boolean;
  playOnce: boolean;
  title: string | null;
  description: string | null;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface VirtualTourEffect {
  id: number;
  virtualTourId: number;
  effectType: 'visual' | 'sound' | 'particle' | 'animation';
  positionX: number | null;
  positionY: number | null;
  positionZ: number | null;
  pitch: number | null;
  yaw: number | null;
  triggerType: 'on_enter' | 'on_look' | 'on_click' | 'on_timer' | 'always';
  triggerDistance: number | null;
  triggerDelay: number | null;
  effectName: string;
  intensity: number | null;
  duration: number | null;
  color: string | null;
  soundUrl: string | null;
  particleCount: number | null;
  opacity: number | null;
  size: number | null;
  animationType: string | null;
  animationSpeed: number | null;
  title: string | null;
  description: string | null;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface VirtualTour {
  id: number;
  title: string;
  description: string;
  location: string;
  tourType: '360_image' | '360_video' | '3d_model' | 'embed';
  embedUrl: string | null;
  image360Url: string | null;
  video360Url: string | null;
  model3dUrl: string | null;
  fileName: string | null;
  status: 'draft' | 'published' | 'archived';
  isPublished: boolean;
  isArchived: boolean;
  impressions: number;
  userId: number;
  createdAt: string;
  updatedAt: string;
  user: {
    id: number;
    fullName: string;
    email: string;
  };
  hotspots: VirtualTourHotspot[];
  audioRegions: VirtualTourAudioRegion[];
  effects: VirtualTourEffect[];
  _count?: {
    hotspots: number;
    audioRegions: number;
    effects: number;
  };
}

export interface VirtualToursResponse {
  data: VirtualTour[];
  meta: {
    total: number;
    skip: number;
    limit: number;
    hasMore: boolean;
  };
}

export interface CreateVirtualTourRequest {
  title: string;
  description: string;
  location: string;
  tourType: '360_image' | '360_video' | '3d_model' | 'embed';
  embedUrl?: string;
  image360File?: File;
  video360File?: File;
  model3dFile?: File;
}

export interface UpdateVirtualTourRequest {
  title?: string;
  description?: string;
  location?: string;
  tourType?: '360_image' | '360_video' | '3d_model' | 'embed';
  embedUrl?: string;
  image360File?: File;
  video360File?: File;
  model3dFile?: File;
  status?: 'draft' | 'published' | 'archived';
  isPublished?: boolean;
}

export interface VirtualTourFilters {
  skip?: number;
  limit?: number;
  search?: string;
  tourType?: string;
  status?: string;
  userId?: number;
  isPublished?: boolean;
  isArchived?: boolean;
}

// Interactive Elements Interfaces
export interface CreateHotspotRequest {
  positionX?: number;
  positionY?: number;
  positionZ?: number;
  pitch?: number;
  yaw?: number;
  type: 'info' | 'link' | 'audio' | 'video' | 'image' | 'effect';
  title?: string;
  description?: string;
  icon?: string;
  actionUrl?: string;
  actionAudioFile?: File;
  actionVideoFile?: File;
  actionImageFile?: File;
  actionEffect?: string;
  triggerDistance?: number;
  autoTrigger?: boolean;
  showOnHover?: boolean;
  color?: string;
  size?: number;
  order?: number;
}

export type UpdateHotspotRequest = Partial<CreateHotspotRequest>

export interface CreateAudioRegionRequest {
  regionType: 'sphere' | 'box';
  centerX: number;
  centerY: number;
  centerZ: number;
  radius?: number;
  width?: number;
  height?: number;
  depth?: number;
  audioFile: File;
  volume?: number;
  loop?: boolean;
  fadeInDuration?: number;
  fadeOutDuration?: number;
  spatialAudio?: boolean;
  minDistance?: number;
  maxDistance?: number;
  autoPlay?: boolean;
  playOnce?: boolean;
  title?: string;
  description?: string;
  order?: number;
}

export interface UpdateAudioRegionRequest extends Partial<CreateAudioRegionRequest> {
  audioFile?: File;
}

export interface CreateEffectRequest {
  effectType: 'visual' | 'sound' | 'particle' | 'animation';
  positionX?: number;
  positionY?: number;
  positionZ?: number;
  pitch?: number;
  yaw?: number;
  triggerType: 'on_enter' | 'on_look' | 'on_click' | 'on_timer' | 'always';
  triggerDistance?: number;
  triggerDelay?: number;
  effectName: string;
  intensity?: number;
  duration?: number;
  color?: string;
  soundFile?: File;
  particleCount?: number;
  opacity?: number;
  size?: number;
  animationType?: string;
  animationSpeed?: number;
  title?: string;
  description?: string;
  order?: number;
}

export interface UpdateEffectRequest extends Partial<CreateEffectRequest> {
  soundFile?: File;
}