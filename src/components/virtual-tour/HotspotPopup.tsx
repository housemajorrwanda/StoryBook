"use client";

import { useRef, useEffect } from "react";
import {
  X,
  Info,
  Link,
  Music,
  Video,
  Image as ImageIcon,
  Zap,
  Compass,
  ExternalLink,
} from "lucide-react";
import { VirtualTourHotspot } from "@/types/tour";

const TYPE_ICON: Record<VirtualTourHotspot["type"], React.ReactNode> = {
  info: <Info className="w-5 h-5" />,
  link: <Link className="w-5 h-5" />,
  audio: <Music className="w-5 h-5" />,
  video: <Video className="w-5 h-5" />,
  image: <ImageIcon className="w-5 h-5" />,
  effect: <Zap className="w-5 h-5" />,
};

const TYPE_COLOR: Record<VirtualTourHotspot["type"], string> = {
  info: "bg-blue-500",
  link: "bg-purple-500",
  audio: "bg-green-500",
  video: "bg-red-500",
  image: "bg-amber-500",
  effect: "bg-pink-500",
};

interface HotspotPopupProps {
  hotspot: VirtualTourHotspot;
  onClose: () => void;
}

export default function HotspotPopup({ hotspot, onClose }: HotspotPopupProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Auto-play audio hotspots
  useEffect(() => {
    if (hotspot.type === "audio" && hotspot.actionAudioUrl && audioRef.current) {
      audioRef.current.play().catch(() => {});
    }
    const audio = audioRef.current;
    return () => {
      if (audio) {
        audio.pause();
      }
    };
  }, [hotspot]);

  return (
    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-50 w-[380px] max-w-[90vw] animate-in slide-in-from-bottom-4 duration-300">
      <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl shadow-black/40 border border-white/20 overflow-hidden">
        {/* Header */}
        <div className={`${TYPE_COLOR[hotspot.type]} p-4 flex items-center justify-between`}>
          <div className="flex items-center gap-3 text-white">
            <div className="w-9 h-9 bg-white/20 rounded-full flex items-center justify-center">
              {TYPE_ICON[hotspot.type]}
            </div>
            <div>
              <div className="font-semibold text-sm uppercase tracking-wider opacity-80">
                {hotspot.type}
              </div>
              <div className="font-bold text-lg leading-tight">
                {hotspot.title || `Point of Interest`}
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-4 space-y-3">
          {hotspot.description && (
            <p className="text-gray-700 text-sm leading-relaxed">
              {hotspot.description}
            </p>
          )}

          {/* Audio player */}
          {hotspot.type === "audio" && hotspot.actionAudioUrl && (
            <div className="bg-gray-50 rounded-xl p-3">
              <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                <Music className="w-3 h-3" />
                <span>Audio</span>
              </div>
              <audio
                ref={audioRef}
                controls
                className="w-full h-8"
                style={{ height: "32px" }}
              >
                <source src={hotspot.actionAudioUrl} />
              </audio>
            </div>
          )}

          {/* Video player */}
          {hotspot.type === "video" && hotspot.actionVideoUrl && (
            <div className="rounded-xl overflow-hidden bg-black">
              <video
                controls
                autoPlay
                className="w-full max-h-48 object-contain"
              >
                <source src={hotspot.actionVideoUrl} />
              </video>
            </div>
          )}

          {/* Image */}
          {hotspot.type === "image" && hotspot.actionImageUrl && (
            <div className="rounded-xl overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={hotspot.actionImageUrl}
                alt={hotspot.title || "Hotspot image"}
                className="w-full max-h-48 object-cover rounded-xl"
              />
            </div>
          )}

          {/* Link */}
          {hotspot.type === "link" && hotspot.actionUrl && (
            <a
              href={hotspot.actionUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 w-full px-4 py-3 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-xl transition-colors font-medium text-sm"
            >
              <ExternalLink className="w-4 h-4" />
              Open Link
            </a>
          )}

          {/* Meta */}
          <div className="flex flex-wrap gap-2 pt-1">
            {hotspot.autoTrigger && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full">
                <Zap className="w-3 h-3" /> Auto-trigger
              </span>
            )}
            {hotspot.triggerDistance != null && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                <Compass className="w-3 h-3" /> {hotspot.triggerDistance}m radius
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
