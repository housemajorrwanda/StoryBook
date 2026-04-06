// Shared Pannellum type declarations — single source of truth for window.pannellum

export interface PannellumHotSpotBase {
  pitch: number;
  yaw: number;
  type: "info" | "scene";
  text?: string;
  cssClass?: string;
  clickHandlerFunc?: (e: MouseEvent, args?: unknown) => void;
}

export interface PannellumConfigBase {
  type: "equirectangular";
  panorama: string;
  autoLoad: boolean;
  autoRotate?: number;
  compass?: boolean;
  showControls?: boolean;
  mouseZoom?: boolean;
  keyboardZoom?: boolean;
  hotSpots?: PannellumHotSpotBase[];
  hfov?: number;
  minHfov?: number;
  maxHfov?: number;
}

export interface PannellumViewerBase {
  destroy: () => void;
  getYaw: () => number;
  getPitch: () => number;
  setYaw: (yaw: number) => void;
  resize: () => void;
  mouseEventToCoords: (e: MouseEvent) => [number, number];
  on: (event: string, handler: () => void) => void;
}

declare global {
  interface Window {
    pannellum?: {
      viewer: (
        container: string | HTMLElement,
        config: PannellumConfigBase,
      ) => PannellumViewerBase;
    };
  }
}
