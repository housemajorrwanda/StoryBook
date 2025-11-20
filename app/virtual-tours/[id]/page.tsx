"use client";

import { useState } from "react";
import { use } from "react";
import { X, Volume2, VolumeX, Eye, Compass, Info, Link as Links, Music, Video, Image, Zap } from "lucide-react";
import Link from "next/link";
import ImageComponent from "next/image";
import PageLayout from "@/layout/PageLayout";
import { VirtualTourAudioRegion, VirtualTourEffect, VirtualTourHotspot } from "@/types/tour";
import { useVirtualTour } from "@/hooks/virtual-tour/use-virtual-tours";

// Helper function to convert 3D coordinates to 2D screen coordinates
const convert3DTo2D = (x: number | null, y: number | null, z: number | null) => {
  const safeX = x || 0;
  const safeY = y || 0;
  const safeZ = z || 0;
  
  // Simple projection: map 3D coordinates to 2D screen space
  return {
    x: 50 + (safeX * 5), // Adjust scaling as needed
    y: 50 + (safeZ * 5)  // Using Z for vertical position in 2D
  };
};

// Hotspot type icons mapping
const getHotspotIcon = (type: VirtualTourHotspot['type']) => {
  switch (type) {
    case 'info':
      return <Info className="w-3 h-3" />;
    case 'link':
      return <Links className="w-3 h-3" />;
    case 'audio':
      return <Music className="w-3 h-3" />;
    case 'video':
      return <Video className="w-3 h-3" />;
    case 'image':
      return <Image className="w-3 h-3" />;
    case 'effect':
      return <Zap className="w-3 h-3" />;
    default:
      return <Compass className="w-3 h-3" />;
  }
};

// Effect type display names
const getEffectDisplayName = (effect: VirtualTourEffect) => {
  if (effect.title) return effect.title;
  return `${effect.effectType} - ${effect.effectName}`;
};

// Audio region display names
const getAudioDisplayName = (audio: VirtualTourAudioRegion) => {
  if (audio.title) return audio.title;
  return `Audio Region ${audio.id}`;
};

export default function TourViewer({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const tourId = parseInt(resolvedParams.id);
  
  const { data: virtualTour, isLoading, error } = useVirtualTour(tourId);
  const [selectedHotspot, setSelectedHotspot] = useState<VirtualTourHotspot | null>(null);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [showInfo, setShowInfo] = useState(true);

  if (isLoading) {
    return (
      <PageLayout showBackgroundEffects={true} variant="default">
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading virtual tour...</p>
          </div>
        </div>
      </PageLayout>
    );
  }

  if (error || !virtualTour) {
    return (
      <PageLayout showBackgroundEffects={true} variant="default">
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Tour Not Found</h2>
            <p className="text-gray-600 mb-4">The virtual tour you're looking for doesn't exist.</p>
            <Link
              href="/virtual-tours"
              className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
            >
              <X className="w-4 h-4" />
              Back to Tours
            </Link>
          </div>
        </div>
      </PageLayout>
    );
  }

  // Transform hotspots with proper 2D coordinates
  const uiHotspots = virtualTour.hotspots.map(hotspot => {
    const coords = convert3DTo2D(hotspot.positionX, hotspot.positionY, hotspot.positionZ);
    return {
      ...hotspot,
      x: coords.x,
      y: coords.y
    };
  });

  // Get appropriate media source based on tour type
  const getMediaSource = () => {
    switch (virtualTour.tourType) {
      case '360_video':
        return virtualTour.video360Url;
      case '360_image':
        return virtualTour.image360Url;
      case '3d_model':
        return virtualTour.model3dUrl;
      case 'embed':
        return virtualTour.embedUrl;
      default:
        return null;
    }
  };

  const mediaSource = getMediaSource();

  return (
    <PageLayout showBackgroundEffects={true} variant="default">
      <div className="min-h-screen mt-10 bg-gray-50 flex flex-col">
        {/* Header */}
        <div className="border-b border-gray-200 bg-white/80 backdrop-blur-sm sticky top-0 z-40">
          <div className="container mx-auto px-6 py-4 flex items-center justify-between">
            <Link
              href="/virtual-tours"
              className="flex items-center gap-2 hover:text-gray-700 transition-colors text-gray-600"
            >
              <X className="w-5 h-5" />
              <span className="text-sm font-medium">Back to Tours</span>
            </Link>
            <div className="flex items-center gap-4">
              <div className="text-sm text-gray-500 capitalize">
                {virtualTour.tourType.replace('_', ' ')} • {virtualTour.status}
              </div>
              <button
                onClick={() => setAudioEnabled(!audioEnabled)}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-500 hover:text-gray-700"
                title="Toggle Audio"
              >
                {audioEnabled ? (
                  <Volume2 className="w-5 h-5" />
                ) : (
                  <VolumeX className="w-5 h-5" />
                )}
              </button>
              <button
                onClick={() => setShowInfo(!showInfo)}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-500 hover:text-gray-700"
                title="Toggle Info"
              >
                <Eye className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Main Viewer */}
        <div className="flex-1 flex overflow-hidden container mx-auto px-6 py-8 gap-6">
          {/* Tour Display */}
          <div className="flex-1 relative bg-black overflow-hidden flex items-center justify-center rounded-lg">
            {/* Media Display based on tour type */}
            {virtualTour.tourType === '360_video' && mediaSource && (
              <video
                className="w-full h-full object-cover"
                controls
                autoPlay
                muted={!audioEnabled}
                loop
              >
                <source src={mediaSource} type="video/mp4" />
                Your browser does not support 360 videos.
              </video>
            )}

            {virtualTour.tourType === '360_image' && mediaSource && (
              <ImageComponent
                src={mediaSource}
                alt={virtualTour.title}
                className="w-full h-full object-cover"
                fill
                priority
              />
            )}

            {virtualTour.tourType === 'embed' && mediaSource && (
              <iframe
                src={mediaSource}
                className="w-full h-full border-0"
                allowFullScreen
                title={virtualTour.title}
              />
            )}

            {virtualTour.tourType === '3d_model' && !mediaSource && (
              <div className="text-white text-center p-8">
                <p>3D Model viewer would be embedded here</p>
                <p className="text-sm text-gray-400 mt-2">{virtualTour.model3dUrl}</p>
              </div>
            )}

            {!mediaSource && virtualTour.tourType !== '3d_model' && (
              <ImageComponent
                src="/immersive-360-tour-environment.jpg"
                alt={virtualTour.title}
                className="w-full h-full object-cover"
                fill
                priority
              />
            )}

            {/* Hotspot Indicators */}
            {showInfo &&
              uiHotspots.map((spot) => (
                <button
                  key={spot.id}
                  onClick={() => setSelectedHotspot(spot)}
                  className="absolute w-8 h-8 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gray-900/80 hover:bg-gray-900 transition-all animate-pulse hover:animate-none group"
                  style={{ 
                    left: `${spot.x}%`, 
                    top: `${spot.y}%`,
                    width: spot.size ? `${spot.size * 32}px` : '32px',
                    height: spot.size ? `${spot.size * 32}px` : '32px'
                  }}
                  title={spot.title || `Hotspot ${spot.id}`}
                >
                  <div className="w-full h-full flex items-center justify-center text-white">
                    {getHotspotIcon(spot.type)}
                  </div>
                </button>
              ))}

            {/* Hotspot Detail Card */}
            {selectedHotspot && showInfo && (
              <div className="absolute bottom-6 left-6 bg-white/95 backdrop-blur-sm border border-gray-200 rounded-lg p-4 max-w-xs shadow-lg shadow-black/50">
                <div className="flex items-center gap-2 mb-2">
                  {getHotspotIcon(selectedHotspot.type)}
                  <h3 className="font-semibold text-gray-900">
                    {selectedHotspot.title || `Hotspot ${selectedHotspot.id}`}
                  </h3>
                </div>
                {selectedHotspot.description && (
                  <p className="text-sm text-gray-600 mb-3">
                    {selectedHotspot.description}
                  </p>
                )}
                <div className="text-xs text-gray-500 space-y-1 mb-3">
                  <div>Type: {selectedHotspot.type}</div>
                  {selectedHotspot.triggerDistance && (
                    <div>Trigger Distance: {selectedHotspot.triggerDistance}m</div>
                  )}
                  <div>Auto-trigger: {selectedHotspot.autoTrigger ? 'Yes' : 'No'}</div>
                </div>
                <button
                  onClick={() => setSelectedHotspot(null)}
                  className="text-xs text-gray-700 hover:text-gray-900 transition-colors font-medium"
                >
                  Close
                </button>
              </div>
            )}

            {/* Controls Overlay */}
            <div className="absolute bottom-6 right-6 flex gap-2">
              <button
                onClick={() => setShowInfo(!showInfo)}
                className="px-4 py-2 rounded-lg bg-gray-900 text-white hover:bg-gray-800 transition-colors text-sm font-medium"
              >
                {showInfo ? "Hide Info Panel" : "Show Info Panel"}
              </button>
            </div>
          </div>

          {/* Sidebar */}
          {showInfo && (
            <div className="w-96 border-l border-gray-200 bg-white/80 backdrop-blur-sm overflow-y-auto">
              <div className="p-6 space-y-6">
                {/* Tour Header */}
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    {virtualTour.title}
                  </h2>
                  <p className="text-gray-600 text-sm">{virtualTour.location}</p>
                  <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                    <span className="capitalize">{virtualTour.tourType.replace('_', ' ')}</span>
                    <span>•</span>
                    <span className="capitalize">{virtualTour.status}</span>
                    <span>•</span>
                    <span>{virtualTour.impressions} views</span>
                  </div>
                </div>

                {/* Tour Description */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">
                    Description
                  </h3>
                  <p className="text-sm text-gray-600">
                    {virtualTour.description}
                  </p>
                </div>

                {/* Points of Interest */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-gray-900">
                      Points of Interest
                    </h3>
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                      {virtualTour.hotspots.length} hotspots
                    </span>
                  </div>
                  <div className="space-y-2">
                    {uiHotspots.map((spot) => (
                      <button
                        key={spot.id}
                        onClick={() => setSelectedHotspot(spot)}
                        className={`w-full text-left p-3 rounded-lg border transition-all ${
                          selectedHotspot?.id === spot.id
                            ? "bg-gray-100 border-gray-400 text-gray-900"
                            : "border-gray-200 hover:border-gray-400 text-gray-900"
                        }`}
                      >
                        <div className="font-medium flex items-center gap-2">
                          {getHotspotIcon(spot.type)}
                          {spot.title || `Hotspot ${spot.id}`}
                          {spot.autoTrigger && (
                            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                              Auto
                            </span>
                          )}
                        </div>
                        {spot.description && (
                          <div className="text-xs text-gray-600 mt-1">
                            {spot.description}
                          </div>
                        )}
                        <div className="text-xs text-gray-500 mt-2 flex gap-2">
                          <span>Type: {spot.type}</span>
                          {spot.triggerDistance && (
                            <span>• Distance: {spot.triggerDistance}m</span>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Audio Regions */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-gray-900">
                      Audio Regions
                    </h3>
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                      {virtualTour.audioRegions.length} regions
                    </span>
                  </div>
                  <div className="space-y-2 text-sm">
                    {virtualTour.audioRegions.map((audio) => (
                      <div
                        key={audio.id}
                        className="p-3 rounded bg-gray-50 border border-gray-200"
                      >
                        <div className="flex items-center justify-between">
                          <div className="font-medium text-gray-700">
                            {getAudioDisplayName(audio)}
                          </div>
                          <span className={`text-xs font-medium px-2 py-1 rounded ${
                            audioEnabled ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
                          }`}>
                            {audioEnabled ? "Active" : "Muted"}
                          </span>
                        </div>
                        <div className="text-xs text-gray-600 mt-2 space-y-1">
                          <div>Type: {audio.regionType} • Volume: {Math.round(audio.volume * 100)}%</div>
                          <div>
                            {audio.spatialAudio ? 'Spatial Audio' : 'Background'} • 
                            {audio.loop ? ' Looping' : ' Play once'} •
                            {audio.autoPlay ? ' Auto-play' : ' Manual'}
                          </div>
                          {audio.fadeInDuration && audio.fadeOutDuration && (
                            <div>Fade: {audio.fadeInDuration}s in, {audio.fadeOutDuration}s out</div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Visual Effects */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-gray-900">
                      Effects
                    </h3>
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                      {virtualTour.effects.length} effects
                    </span>
                  </div>
                  <div className="grid gap-2 text-sm">
                    {virtualTour.effects.map((effect) => (
                      <div
                        key={effect.id}
                        className="p-3 rounded border border-gray-200"
                      >
                        <div className="font-medium text-gray-700">
                          {getEffectDisplayName(effect)}
                        </div>
                        <div className="text-xs text-gray-600 mt-1 space-y-1">
                          <div>Type: {effect.effectType} • Trigger: {effect.triggerType}</div>
                          <div>Intensity: {effect.intensity} • Duration: {effect.duration || 'Continuous'}</div>
                          {effect.triggerDelay > 0 && (
                            <div>Delay: {effect.triggerDelay}s</div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Tour Creator */}
                <div className="pt-4 border-t border-gray-200">
                  <h3 className="font-semibold text-gray-900 mb-3">
                    Created By
                  </h3>
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 border border-gray-200">
                    <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                      <span className="text-xs font-medium text-gray-600">
                        {virtualTour.user.fullName?.charAt(0) || virtualTour.user.email.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {virtualTour.user.fullName || "Anonymous User"}
                      </div>
                      <div className="text-xs text-gray-600">
                        {virtualTour.user.email}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </PageLayout>
  );
}