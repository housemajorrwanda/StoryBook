"use client";

import { useEffect, useRef, useState } from "react";
import { MousePointerClick, Info } from "lucide-react";
import type { PannellumViewerBase } from "@/types/pannellum";

export interface PlacedMarker {
  id: string;
  pitch: number;
  yaw: number;
  label?: string;
  color?: string;
}

interface PanoramaHotspotEditorProps {
  imageUrl: string;
  markers: PlacedMarker[];
  /** Called when the user clicks on the panorama to place/move a marker */
  onPlace: (pitch: number, yaw: number) => void;
  /** If set, clicking the panorama moves this specific marker instead of placing a new one */
  activeMarkerId?: string | null;
  placingLabel?: string;
}

const PANNELLUM_CSS = "https://cdn.jsdelivr.net/npm/pannellum@2.5.6/build/pannellum.css";
const PANNELLUM_JS = "https://cdn.jsdelivr.net/npm/pannellum@2.5.6/build/pannellum.js";

function loadScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) { resolve(); return; }
    const s = document.createElement("script");
    s.src = src;
    s.onload = () => resolve();
    s.onerror = reject;
    document.head.appendChild(s);
  });
}

function loadStyle(href: string): void {
  if (document.querySelector(`link[href="${href}"]`)) return;
  const l = document.createElement("link");
  l.rel = "stylesheet";
  l.href = href;
  document.head.appendChild(l);
}

export default function PanoramaHotspotEditor({
  imageUrl,
  markers,
  onPlace,
  activeMarkerId,
  placingLabel,
}: PanoramaHotspotEditorProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<PannellumViewerBase | null>(null);
  const onPlaceRef = useRef(onPlace);
  const [hint, setHint] = useState(true);

  // Keep callback ref fresh without re-initialising viewer
  useEffect(() => { onPlaceRef.current = onPlace; }, [onPlace]);

  // Initialise Pannellum once
  useEffect(() => {
    if (!containerRef.current) return;
    let destroyed = false;

    const init = async () => {
      loadStyle(PANNELLUM_CSS);
      await loadScript(PANNELLUM_JS);
      if (destroyed || !containerRef.current || !window.pannellum) return;

      viewerRef.current = window.pannellum.viewer(containerRef.current, {
        type: "equirectangular",
        panorama: imageUrl,
        autoLoad: true,
        showControls: false,
        compass: false,
        hfov: 100,
        minHfov: 50,
        maxHfov: 130,
      });

      // Pannellum sometimes misses dimensions if the container just mounted —
      // resize after layout settles to ensure the canvas fills the container.
      const resizeTimer = setTimeout(() => {
        try { viewerRef.current?.resize(); } catch { /* ignore */ }
      }, 100);

      // Intercept clicks on the panorama container to get pitch/yaw
      const el = containerRef.current;
      const handleClick = (e: MouseEvent) => {
        if (!viewerRef.current) return;
        // pannellum exposes mouseEventToCoords([pitch, yaw])
        try {
          const coords = viewerRef.current.mouseEventToCoords(e);
          onPlaceRef.current(
            Math.round(coords[0] * 10) / 10,
            Math.round(coords[1] * 10) / 10,
          );
          setHint(false);
        } catch {
          // fallback: use current center
          const p = Math.round(viewerRef.current.getPitch() * 10) / 10;
          const y = Math.round(viewerRef.current.getYaw() * 10) / 10;
          onPlaceRef.current(p, y);
          setHint(false);
        }
      };

      el.addEventListener("click", handleClick);
      return () => { el.removeEventListener("click", handleClick); clearTimeout(resizeTimer); };
    };

    const cleanup = init();

    return () => {
      destroyed = true;
      cleanup.then((fn) => fn?.());
      if (viewerRef.current) {
        try { viewerRef.current.destroy(); } catch { /* ignore */ }
        viewerRef.current = null;
      }
    };
  }, [imageUrl]);

  const isPlacing = !!activeMarkerId || activeMarkerId === null;

  return (
    <div className="relative w-full rounded-2xl overflow-hidden bg-gray-900 h-[220px] sm:h-[300px] md:h-[360px]">
      {/* Panorama */}
      <style>{`
        /* Scope all pannellum overrides inside .pnlm-hotspot-editor */
        .pnlm-hotspot-editor .pnlm-controls-container { display: none !important; }
        .pnlm-hotspot-editor .pnlm-load-box { background: rgba(0,0,0,0.8) !important; border-radius: 12px !important; }
        .pnlm-hotspot-editor.pnlm-editor-placing .pnlm-render-container { cursor: crosshair !important; }
        /* Contain pannellum — prevent it from escaping the wrapper */
        .pnlm-hotspot-editor .pnlm-container { position: absolute !important; top: 0; left: 0; width: 100% !important; height: 100% !important; }
        .pnlm-editor-marker {
          width: 26px; height: 26px;
          border-radius: 50%;
          border: 2.5px solid white;
          box-shadow: 0 2px 10px rgba(0,0,0,0.5);
          display: flex; align-items: center; justify-content: center;
          font-size: 10px; font-weight: 700; color: white;
          animation: markerPop 0.25s ease;
          cursor: pointer;
        }
        .pnlm-editor-marker-active {
          box-shadow: 0 0 0 4px rgba(255,255,255,0.35), 0 2px 10px rgba(0,0,0,0.5) !important;
        }
        @keyframes markerPop {
          from { transform: scale(0.4); opacity: 0; }
          to   { transform: scale(1);   opacity: 1; }
        }
      `}</style>

      <div
        ref={containerRef}
        className={`pnlm-hotspot-editor w-full h-full${isPlacing ? " pnlm-editor-placing" : ""}`}
      />

      {/* Overlay markers rendered as Pannellum hot spots are CSS-based;
          we render a floating label strip below for the placed ones */}

      {/* Top hint bar */}
      {hint && (
        <div className="absolute top-3 left-3 right-3 z-20 flex items-center justify-center gap-2 pointer-events-none">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-black/60 backdrop-blur-sm rounded-full text-white text-xs font-medium border border-white/10 max-w-full truncate">
            <MousePointerClick className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">{placingLabel ?? "Click anywhere to place"}</span>
          </div>
        </div>
      )}

      {/* Placed markers legend strip — scrollable on mobile */}
      {markers.length > 0 && (
        <div className="absolute bottom-3 left-3 right-3 z-20 flex gap-1.5 overflow-x-auto pb-0.5 pointer-events-none no-scrollbar">
          {markers.map((m, i) => (
            <span
              key={m.id}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold text-white border border-white/20 backdrop-blur-sm ${
                m.id === activeMarkerId ? "ring-2 ring-white/60" : ""
              }`}
              style={{ background: m.color ?? "rgba(59,130,246,0.8)" }}
            >
              {i + 1}. {m.label || `Hotspot ${i + 1}`}
              <span className="opacity-70 font-mono text-[9px]">
                {m.pitch.toFixed(0)}°/{m.yaw.toFixed(0)}°
              </span>
            </span>
          ))}
        </div>
      )}

      {/* No-image placed indicator (bottom-right) */}
      {markers.length === 0 && !hint && (
        <div className="absolute bottom-3 right-3 z-20 flex items-center gap-1.5 px-3 py-1.5 bg-black/50 backdrop-blur-sm rounded-full text-white/60 text-xs pointer-events-none">
          <Info className="w-3 h-3" />
          No markers placed yet
        </div>
      )}
    </div>
  );
}
