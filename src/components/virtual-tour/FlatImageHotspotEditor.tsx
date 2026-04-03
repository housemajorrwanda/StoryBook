"use client";

import { useRef, useState } from "react";
import { MousePointerClick } from "lucide-react";

export interface PlacedMarker {
  id: string;
  /** 0–1 normalized X position */
  normalizedX: number;
  /** 0–1 normalized Y position */
  normalizedY: number;
  label?: string;
  color?: string;
}

interface FlatImageHotspotEditorProps {
  imageUrl: string;
  markers: PlacedMarker[];
  onPlace: (normalizedX: number, normalizedY: number) => void;
  activeMarkerId?: string | null;
  placingLabel?: string;
}

export default function FlatImageHotspotEditor({
  imageUrl,
  markers,
  onPlace,
  activeMarkerId,
  placingLabel,
}: FlatImageHotspotEditorProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hint, setHint] = useState(true);

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = Math.round(((e.clientX - rect.left) / rect.width) * 1000) / 1000;
    const y = Math.round(((e.clientY - rect.top) / rect.height) * 1000) / 1000;
    onPlace(
      Math.max(0, Math.min(1, x)),
      Math.max(0, Math.min(1, y)),
    );
    setHint(false);
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full rounded-2xl overflow-hidden bg-gray-950 cursor-crosshair select-none h-[220px] sm:h-[300px] md:h-[360px]"
      onClick={handleClick}
    >
      {/* Background image */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={imageUrl}
        alt="Tour media"
        className="w-full h-full object-contain pointer-events-none"
        draggable={false}
      />

      {/* Hint */}
      {hint && (
        <div className="absolute top-3 left-3 right-3 z-20 flex items-center justify-center pointer-events-none">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-black/60 backdrop-blur-sm rounded-full text-white text-xs font-medium border border-white/10 max-w-full">
            <MousePointerClick className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">{placingLabel ?? "Click anywhere to place"}</span>
          </div>
        </div>
      )}

      {/* Render markers */}
      {markers.map((m, i) => (
        <div
          key={m.id}
          className="absolute z-10 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
          style={{ left: `${m.normalizedX * 100}%`, top: `${m.normalizedY * 100}%` }}
        >
          <div
            className={`w-7 h-7 rounded-full border-2 border-white shadow-lg flex items-center justify-center text-[11px] font-bold text-white ${
              m.id === activeMarkerId ? "ring-4 ring-white/40 scale-125" : ""
            } transition-transform`}
            style={{ background: m.color ?? "rgba(59,130,246,0.9)" }}
          >
            {i + 1}
          </div>
          {m.label && (
            <div className="absolute top-8 left-1/2 -translate-x-1/2 bg-black/70 backdrop-blur-sm text-white text-[10px] px-2 py-0.5 rounded-full whitespace-nowrap">
              {m.label}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
