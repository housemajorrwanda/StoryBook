import { CreateHotspotData, CreateAudioRegionData, CreateEffectData } from "@/types/tour";

const hotspotBase = { type: "info" as const, positionX: 0, positionY: 0, positionZ: 0, icon: "", actionUrl: "", color: "", size: 1, triggerDistance: 5, autoTrigger: false, showOnHover: false };

export const SAMPLE_HOTSPOTS: CreateHotspotData[] = [
  { ...hotspotBase, title: "Memorial Garden", description: "The garden of remembrance where over 250,000 victims are buried. A place of reflection and peace.", pitch: -10, yaw: 45, order: 0 },
  { ...hotspotBase, title: "Wall of Names", description: "The wall inscribed with the names of victims — a powerful reminder of the lives lost during the genocide.", pitch: 5, yaw: -60, order: 1 },
  { ...hotspotBase, title: "Reflection Pool", description: "A serene water feature symbolizing tears shed and the cleansing of wounds through memory and justice.", pitch: -20, yaw: 150, order: 2 },
];

export const SAMPLE_AUDIO_REGIONS: CreateAudioRegionData[] = [
  { title: "Ambient Remembrance", description: "Soft solemn ambient audio playing throughout the memorial space.", regionType: "sphere", centerX: 0, centerY: 0, centerZ: 0, radius: 50, width: 0, height: 0, depth: 0, volume: 0.4, loop: true, fadeInDuration: 2, fadeOutDuration: 2, spatialAudio: false, minDistance: 1, maxDistance: 50, autoPlay: true, playOnce: false, order: 0 },
];

export const SAMPLE_EFFECTS: CreateEffectData[] = [
  { effectType: "visual", effectName: "vignette", triggerType: "always", positionX: 0, positionY: 0, positionZ: 0, pitch: 0, yaw: 0, triggerDistance: 0, triggerDelay: 0, intensity: 0.4, duration: 0, color: "", particleCount: 0, opacity: 0.4, size: 1, animationType: "", animationSpeed: 1, title: "Vignette", description: "Subtle dark vignette to create a solemn atmosphere.", order: 0 },
];
