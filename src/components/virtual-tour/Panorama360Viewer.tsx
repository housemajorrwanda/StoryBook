"use client";

import { useEffect, useRef } from "react";
import { VirtualTourHotspot } from "@/types/tour";
import type { PannellumViewerBase, PannellumHotSpotBase } from "@/types/pannellum";

interface Panorama360ViewerProps {
  imageUrl: string;
  hotspots: VirtualTourHotspot[];
  onHotspotClick: (hotspot: VirtualTourHotspot) => void;
  onYawChange?: (yaw: number) => void;
}

const PANNELLUM_CSS = "https://cdn.jsdelivr.net/npm/pannellum@2.5.6/build/pannellum.css";
const PANNELLUM_JS = "https://cdn.jsdelivr.net/npm/pannellum@2.5.6/build/pannellum.js";

function loadScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) {
      resolve();
      return;
    }
    const script = document.createElement("script");
    script.src = src;
    script.onload = () => resolve();
    script.onerror = reject;
    document.head.appendChild(script);
  });
}

function loadStyle(href: string): void {
  if (document.querySelector(`link[href="${href}"]`)) return;
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = href;
  document.head.appendChild(link);
}

export default function Panorama360Viewer({
  imageUrl,
  hotspots,
  onHotspotClick,
  onYawChange,
}: Panorama360ViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<PannellumViewerBase | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    let destroyed = false;

    const init = async () => {
      loadStyle(PANNELLUM_CSS);
      await loadScript(PANNELLUM_JS);

      if (destroyed || !containerRef.current || !window.pannellum) return;

      // Map our hotspots to pannellum format
      const pannellumHotspots: PannellumHotSpotBase[] = hotspots.map((h) => ({
        pitch: h.pitch ?? 0,
        yaw: h.yaw ?? 0,
        type: "info",
        text: h.title ?? undefined,
        cssClass: `pnlm-hotspot-custom pnlm-hotspot-${h.type}`,
        clickHandlerFunc: () => onHotspotClick(h),
      }));

      viewerRef.current = window.pannellum.viewer(containerRef.current!, {
        type: "equirectangular",
        panorama: imageUrl,
        autoLoad: true,
        autoRotate: -2,
        compass: false,
        showControls: false,
        hotSpots: pannellumHotspots,
        hfov: 100,
        minHfov: 50,
        maxHfov: 120,
      });

      // Track yaw for compass
      if (onYawChange) {
        const tick = setInterval(() => {
          if (viewerRef.current) {
            onYawChange(viewerRef.current.getYaw());
          }
        }, 100);
        return () => clearInterval(tick);
      }
    };

    init();

    return () => {
      destroyed = true;
      if (viewerRef.current) {
        try {
          viewerRef.current.destroy();
        } catch {
          // ignore
        }
        viewerRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [imageUrl]);

  return (
    <>
      {/* Custom hotspot styles */}
      <style>{`
        .pnlm-hotspot-custom {
          background: rgba(255, 255, 255, 0.9) !important;
          border: 2px solid white !important;
          border-radius: 50% !important;
          width: 28px !important;
          height: 28px !important;
          box-shadow: 0 2px 12px rgba(0,0,0,0.4) !important;
          transition: transform 0.2s ease !important;
          animation: pnlmPulse 2s ease-in-out infinite;
        }
        .pnlm-hotspot-custom:hover {
          transform: scale(1.3) !important;
          animation: none !important;
        }
        .pnlm-hotspot-info { background: rgba(59, 130, 246, 0.9) !important; }
        .pnlm-hotspot-audio { background: rgba(34, 197, 94, 0.9) !important; }
        .pnlm-hotspot-video { background: rgba(239, 68, 68, 0.9) !important; }
        .pnlm-hotspot-image { background: rgba(245, 158, 11, 0.9) !important; }
        .pnlm-hotspot-link { background: rgba(168, 85, 247, 0.9) !important; }
        .pnlm-hotspot-effect { background: rgba(236, 72, 153, 0.9) !important; }
        @keyframes pnlmPulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(255,255,255,0.4), 0 2px 12px rgba(0,0,0,0.4); }
          50% { box-shadow: 0 0 0 8px rgba(255,255,255,0), 0 2px 12px rgba(0,0,0,0.4); }
        }
        /* Hide default pannellum controls */
        .pnlm-controls-container { display: none !important; }
        .pnlm-load-box {
          background: rgba(0,0,0,0.8) !important;
          border-radius: 12px !important;
        }
      `}</style>
      <div
        ref={containerRef}
        className="w-full h-full min-h-full"
      />
    </>
  );
}
