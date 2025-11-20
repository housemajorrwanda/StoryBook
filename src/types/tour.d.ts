export interface CreateVirtualTourRequest {
  title: string;
  description: string;
  location: string;
  tourType: "360_image" | "360_video" | "3d_model" | "embed";
  embedUrl?: string;
  status?: "draft" | "published" | "archived";
  isPublished?: boolean;
  image360File?: File;
  video360File?: File;
  model3dFile?: File;
  tourFile?: File;
}


export type UpdateVirtualTourRequest = Partial<CreateVirtualTourRequest>;

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



export type UpdateHotspotRequest = Partial<CreateHotspotData>

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


export interface UpdateAudioRegionRequest extends Partial<Omit<CreateAudioRegionData, 'audioFile'>> {
  audioFile?: File;
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



export interface UpdateEffectRequest extends Partial<Omit<CreateEffectData, 'soundFile'>> {
  soundFile?: File;
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
  triggerDelay: number;
  effectName: string;
  intensity: number;
  duration: number | null;
  color: string | null;
  soundUrl: string | null;
  particleCount: number | null;
  opacity: number;
  size: number;
  animationType: string | null;
  animationSpeed: number;
  title: string | null;
  description: string | null;
  order: number;
  createdAt: string;
  updatedAt: string;
}




export interface CreateHotspotData {
  id?: string;
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
  actionEffect?: string;
  triggerDistance?: number;
  autoTrigger?: boolean;
  showOnHover?: boolean;
  color?: string;
  size?: number;
  order?: number;
  file?: File;
  tourFile?: File;
  actionAudioFile?: File;
  actionVideoFile?: File;
  actionImageFile?: File;
  actionEffect?: string;
}

export interface CreateAudioRegionData {
  id?: string;
  regionType: 'sphere' | 'box';
  centerX: number;
  centerY: number;
  centerZ: number;
  radius?: number;
  width?: number;
  height?: number;
  depth?: number;
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
  file?: File;
  tourFile?: File;
  audioFile?: File;
  actionAudioFile?: File;
  actionVideoFile?: File;
  actionImageFile?: File;
  actionEffect?: string;
}

export interface CreateEffectData {
  id?: string;
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
  particleCount?: number;
  opacity?: number;
  size?: number;
  animationType?: string;
  animationSpeed?: number;
  title?: string;
  description?: string;
  order?: number;
  file?: File;
  tourFile?: File;
  soundFile?: File;
  actionAudioFile?: File;
  actionVideoFile?: File;
  actionImageFile?: File;
  actionEffect?: string;
}

