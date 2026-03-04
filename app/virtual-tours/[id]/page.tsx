"use client";

import { useState, useCallback, useRef, use, useEffect } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import {
  X,
  Volume2,
  VolumeX,
  Info,
  Maximize,
  Minimize,
  MapPin,
  Eye,
  Music,
  Zap,
  ChevronRight,
  Compass,
  Sparkles,
} from "lucide-react";
import { VirtualTourHotspot } from "@/types/tour";
import { useVirtualTour } from "@/hooks/virtual-tour/use-virtual-tours";
import { useSpatialAudio } from "@/hooks/virtual-tour/use-spatial-audio";
import HotspotPopup from "@/components/virtual-tour/HotspotPopup";
import EffectsLayer from "@/components/virtual-tour/EffectsLayer";

// Dynamic imports — no SSR for viewers that use browser APIs
const Panorama360Viewer = dynamic(
  () => import("@/components/virtual-tour/Panorama360Viewer"),
  { ssr: false }
);
const Video360Viewer = dynamic(
  () => import("@/components/virtual-tour/Video360Viewer"),
  { ssr: false }
);
const ModelViewerComponent = dynamic(
  () => import("@/components/virtual-tour/ModelViewer"),
  { ssr: false }
);
const EmbedViewer = dynamic(
  () => import("@/components/virtual-tour/EmbedViewer"),
  { ssr: false }
);

// ── Helpers ──────────────────────────────────────────────────────────────────

const TOUR_TYPE_LABELS: Record<string, string> = {
  "360_image": "360° Image",
  "360_video": "360° Video",
  "3d_model": "3D Model",
  embed: "Embedded",
};

const HOTSPOT_COLORS: Record<VirtualTourHotspot["type"], string> = {
  info: "bg-blue-500",
  audio: "bg-green-500",
  video: "bg-red-500",
  image: "bg-amber-500",
  link: "bg-purple-500",
  effect: "bg-pink-500",
};

// ── Main Component ────────────────────────────────────────────────────────────

export default function TourViewerPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const tourId = parseInt(resolvedParams.id);

  const { data: tour, isLoading, error } = useVirtualTour(tourId);

  const [selectedHotspot, setSelectedHotspot] = useState<VirtualTourHotspot | null>(null);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [showInfoPanel, setShowInfoPanel] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [currentYaw, setCurrentYaw] = useState(0);
  const [controlsVisible, setControlsVisible] = useState(true);
  const controlsTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Spatial audio
  useSpatialAudio(tour?.audioRegions ?? [], audioEnabled);

  // Auto-hide controls after inactivity
  const showControls = useCallback(() => {
    setControlsVisible(true);
    if (controlsTimerRef.current) clearTimeout(controlsTimerRef.current);
    controlsTimerRef.current = setTimeout(() => {
      setControlsVisible(false);
    }, 3500);
  }, []);

  useEffect(() => {
    showControls();
    return () => {
      if (controlsTimerRef.current) clearTimeout(controlsTimerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Keep controls visible when info panel is open
  useEffect(() => {
    if (showInfoPanel) {
      setControlsVisible(true);
      if (controlsTimerRef.current) clearTimeout(controlsTimerRef.current);
    } else {
      showControls();
    }
  }, [showInfoPanel, showControls]);

  // Fullscreen API
  const toggleFullscreen = useCallback(async () => {
    if (!document.fullscreenElement) {
      await containerRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      await document.exitFullscreen();
      setIsFullscreen(false);
    }
  }, []);

  useEffect(() => {
    const handler = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", handler);
    return () => document.removeEventListener("fullscreenchange", handler);
  }, []);

  // ── Loading ──────────────────────────────────────────────────────────────

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-gray-950 flex flex-col items-center justify-center z-50">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-white/10 border-t-white rounded-full animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center">
            <Compass className="w-6 h-6 text-white/60 animate-pulse" />
          </div>
        </div>
        <p className="mt-6 text-white/60 text-sm tracking-wide">Loading virtual tour…</p>
      </div>
    );
  }

  if (error || !tour) {
    return (
      <div className="fixed inset-0 bg-gray-950 flex flex-col items-center justify-center z-50 text-white">
        <Sparkles className="w-16 h-16 text-white/30 mb-6" />
        <h2 className="text-2xl font-bold mb-2">Tour Not Found</h2>
        <p className="text-white/50 mb-8 text-center max-w-sm">
          The virtual tour you&apos;re looking for doesn&apos;t exist or isn&apos;t available.
        </p>
        <Link
          href="/virtual-tours"
          className="px-6 py-3 bg-white text-gray-900 rounded-xl font-semibold hover:bg-gray-100 transition-colors"
        >
          Browse Tours
        </Link>
      </div>
    );
  }

  const mediaSource =
    tour.tourType === "360_video"
      ? tour.video360Url
      : tour.tourType === "360_image"
      ? tour.image360Url
      : tour.tourType === "3d_model"
      ? tour.model3dUrl
      : tour.embedUrl;

  const is360 = tour.tourType === "360_image" || tour.tourType === "360_video";

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 bg-gray-950 overflow-hidden"
      onMouseMove={showControls}
      onTouchStart={showControls}
    >
      {/* ── Viewer ─────────────────────────────────────────────────────── */}
      <div className="absolute inset-0">
        {tour.tourType === "360_image" && tour.image360Url && (
          <Panorama360Viewer
            imageUrl={tour.image360Url}
            hotspots={tour.hotspots}
            onHotspotClick={setSelectedHotspot}
            onYawChange={setCurrentYaw}
          />
        )}

        {tour.tourType === "360_video" && tour.video360Url && (
          <Video360Viewer
            videoUrl={tour.video360Url}
            hotspots={tour.hotspots}
            audioEnabled={audioEnabled}
            onHotspotClick={setSelectedHotspot}
            onYawChange={setCurrentYaw}
          />
        )}

        {tour.tourType === "3d_model" && tour.model3dUrl && (
          <ModelViewerComponent modelUrl={tour.model3dUrl} title={tour.title} />
        )}

        {tour.tourType === "embed" && tour.embedUrl && (
          <EmbedViewer embedUrl={tour.embedUrl} title={tour.title} />
        )}

        {!mediaSource && (
          <div className="w-full h-full flex flex-col items-center justify-center text-white/30">
            <Sparkles className="w-20 h-20 mb-4" />
            <p className="text-lg">No media available for this tour</p>
          </div>
        )}
      </div>

      {/* ── Effects overlay ────────────────────────────────────────────── */}
      {tour.effects.length > 0 && (
        <EffectsLayer effects={tour.effects} audioEnabled={audioEnabled} />
      )}

      {/* ── Top Controls Bar ───────────────────────────────────────────── */}
      <div
        className={`absolute top-0 left-0 right-0 z-30 transition-all duration-500 ${
          controlsVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4 pointer-events-none"
        }`}
      >
        <div className="flex items-center justify-between px-5 py-4 bg-black/50 backdrop-blur-md border-b border-white/5">
          {/* Back button */}
          <Link
            href="/virtual-tours"
            className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full text-white text-sm font-medium transition-all border border-white/10"
          >
            <X className="w-4 h-4" />
            <span>Back</span>
          </Link>

          {/* Tour title (desktop) */}
          <div className="hidden md:block text-center">
            <div className="text-white font-semibold text-sm truncate max-w-xs">
              {tour.title}
            </div>
            <div className="text-white/50 text-xs flex items-center justify-center gap-1 mt-0.5">
              <MapPin className="w-3 h-3" />
              {tour.location}
            </div>
          </div>

          {/* Right controls */}
          <div className="flex items-center gap-2">
            {/* Tour type badge */}
            <span className="hidden sm:inline-flex px-3 py-1.5 bg-white/10 backdrop-blur-sm rounded-full text-white/70 text-xs border border-white/10">
              {TOUR_TYPE_LABELS[tour.tourType] ?? tour.tourType}
            </span>

            {/* Audio toggle */}
            <button
              type="button"
              onClick={() => setAudioEnabled((p) => !p)}
              className="w-9 h-9 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white transition-all border border-white/10"
              title={audioEnabled ? "Mute audio" : "Unmute audio"}
            >
              {audioEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>

            {/* Info panel toggle */}
            <button
              type="button"
              onClick={() => setShowInfoPanel((p) => !p)}
              className={`w-9 h-9 backdrop-blur-sm rounded-full flex items-center justify-center text-white transition-all border ${
                showInfoPanel
                  ? "bg-white/30 border-white/30"
                  : "bg-white/10 hover:bg-white/20 border-white/10"
              }`}
              title="Tour information"
            >
              <Info className="w-4 h-4" />
            </button>

            {/* Fullscreen toggle */}
            <button
              type="button"
              onClick={toggleFullscreen}
              className="w-9 h-9 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white transition-all border border-white/10"
              title={isFullscreen ? "Exit fullscreen" : "Fullscreen"}
            >
              {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>

      {/* ── Compass HUD (360 tours only) ───────────────────────────────── */}
      {is360 && (
        <div
          className={`absolute bottom-8 left-1/2 -translate-x-1/2 z-30 transition-all duration-500 ${
            controlsVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
          }`}
        >
          <div className="flex flex-col items-center gap-1">
            <div
              className="w-12 h-12 rounded-full bg-black/40 backdrop-blur-md border border-white/20 flex items-center justify-center"
              style={{ transform: `rotate(${-currentYaw}deg)`, transition: "transform 0.1s linear" }}
            >
              <Compass className="w-6 h-6 text-white/80" />
            </div>
            <span className="text-white/40 text-xs tabular-nums">
              {Math.round(((currentYaw % 360) + 360) % 360)}°
            </span>
          </div>
        </div>
      )}

      {/* ── Hotspot popup ──────────────────────────────────────────────── */}
      {selectedHotspot && (
        <HotspotPopup
          hotspot={selectedHotspot}
          onClose={() => setSelectedHotspot(null)}
        />
      )}

      {/* ── Info Panel (slides in from right) ─────────────────────────── */}
      <div
        className={`absolute top-0 right-0 h-full w-96 max-w-full z-40 transition-transform duration-400 ease-in-out ${
          showInfoPanel ? "translate-x-0" : "translate-x-full"
        }`}
        style={{ transitionDuration: "350ms" }}
      >
        <div className="h-full bg-gray-900/95 backdrop-blur-xl border-l border-white/10 flex flex-col overflow-hidden">
          {/* Panel Header */}
          <div className="p-6 border-b border-white/10 shrink-0">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <h2 className="text-white font-bold text-xl leading-tight truncate">
                  {tour.title}
                </h2>
                <div className="flex items-center gap-1.5 mt-1 text-white/50 text-sm">
                  <MapPin className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">{tour.location}</span>
                </div>
                <div className="flex items-center gap-3 mt-2">
                  <span className="inline-flex items-center gap-1 text-xs text-white/40">
                    <Eye className="w-3 h-3" />
                    {(tour.impressions || 0).toLocaleString()} views
                  </span>
                  <span className="text-xs text-white/40">
                    {TOUR_TYPE_LABELS[tour.tourType] ?? tour.tourType}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowInfoPanel(false)}
                className="w-8 h-8 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white/60 hover:text-white transition-all shrink-0"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Panel Body */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Description */}
            {tour.description && (
              <section>
                <h3 className="text-white/50 text-xs uppercase tracking-widest font-semibold mb-2">
                  About
                </h3>
                <p className="text-white/80 text-sm leading-relaxed">
                  {tour.description}
                </p>
              </section>
            )}

            {/* Hotspots */}
            {tour.hotspots.length > 0 && (
              <section>
                <h3 className="text-white/50 text-xs uppercase tracking-widest font-semibold mb-3 flex items-center justify-between">
                  <span>Points of Interest</span>
                  <span className="bg-white/10 text-white/60 text-xs px-2 py-0.5 rounded-full">
                    {tour.hotspots.length}
                  </span>
                </h3>
                <div className="space-y-2">
                  {tour.hotspots.map((h) => (
                    <button
                      type="button"
                      key={h.id}
                      onClick={() => {
                        setSelectedHotspot(h);
                        setShowInfoPanel(false);
                      }}
                      className={`w-full text-left p-3 rounded-xl border transition-all ${
                        selectedHotspot?.id === h.id
                          ? "bg-white/15 border-white/20"
                          : "bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/15"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-2.5 h-2.5 rounded-full shrink-0 ${HOTSPOT_COLORS[h.type] ?? "bg-white"}`} />
                        <div className="flex-1 min-w-0">
                          <div className="text-white text-sm font-medium truncate">
                            {h.title || `Point ${h.id}`}
                          </div>
                          {h.description && (
                            <div className="text-white/40 text-xs truncate mt-0.5">
                              {h.description}
                            </div>
                          )}
                        </div>
                        <span className="text-white/30 text-xs capitalize shrink-0">
                          {h.type}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </section>
            )}

            {/* Audio Regions */}
            {tour.audioRegions.length > 0 && (
              <section>
                <h3 className="text-white/50 text-xs uppercase tracking-widest font-semibold mb-3 flex items-center justify-between">
                  <span>Audio Zones</span>
                  <span className="bg-white/10 text-white/60 text-xs px-2 py-0.5 rounded-full">
                    {tour.audioRegions.length}
                  </span>
                </h3>
                <div className="space-y-2">
                  {tour.audioRegions.map((a) => (
                    <div
                      key={a.id}
                      className="p-3 rounded-xl bg-white/5 border border-white/10"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                          audioEnabled ? "bg-green-500/20" : "bg-white/10"
                        }`}>
                          <Music className={`w-4 h-4 ${audioEnabled ? "text-green-400" : "text-white/30"}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-white/80 text-sm font-medium truncate">
                            {a.title || `Audio Zone ${a.id}`}
                          </div>
                          <div className="text-white/40 text-xs mt-0.5">
                            {a.spatialAudio ? "Spatial" : "Background"} •{" "}
                            {Math.round(a.volume * 100)}% vol •{" "}
                            {a.loop ? "Loop" : "Once"}
                          </div>
                        </div>
                        <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                          audioEnabled
                            ? "bg-green-500/20 text-green-400"
                            : "bg-white/10 text-white/30"
                        }`}>
                          {audioEnabled ? "Active" : "Muted"}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Effects */}
            {tour.effects.length > 0 && (
              <section>
                <h3 className="text-white/50 text-xs uppercase tracking-widest font-semibold mb-3 flex items-center justify-between">
                  <span>Effects</span>
                  <span className="bg-white/10 text-white/60 text-xs px-2 py-0.5 rounded-full">
                    {tour.effects.length}
                  </span>
                </h3>
                <div className="space-y-2">
                  {tour.effects.map((fx) => (
                    <div
                      key={fx.id}
                      className="p-3 rounded-xl bg-white/5 border border-white/10"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-pink-500/20 flex items-center justify-center shrink-0">
                          <Zap className="w-4 h-4 text-pink-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-white/80 text-sm font-medium truncate">
                            {fx.title || fx.effectName}
                          </div>
                          <div className="text-white/40 text-xs mt-0.5 capitalize">
                            {fx.effectType} • {fx.triggerType.replace("_", " ")}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Creator */}
            <section className="pt-2 border-t border-white/10">
              <h3 className="text-white/50 text-xs uppercase tracking-widest font-semibold mb-3">
                Created By
              </h3>
              <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10">
                <div className="w-9 h-9 bg-white/10 rounded-full flex items-center justify-center shrink-0 text-white font-bold text-sm border border-white/10">
                  {(tour.user.fullName ?? tour.user.email).charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <div className="text-white/80 text-sm font-medium truncate">
                    {tour.user.fullName || "Anonymous"}
                  </div>
                  <div className="text-white/40 text-xs truncate">{tour.user.email}</div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>

      {/* Click-outside overlay to close info panel */}
      {showInfoPanel && (
        <div
          className="absolute inset-0 z-35"
          onClick={() => setShowInfoPanel(false)}
        />
      )}
    </div>
  );
}
