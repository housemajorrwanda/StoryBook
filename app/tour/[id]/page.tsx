"use client";

import { useState } from "react";
import { use } from "react";
import { X, Volume2, VolumeX, Eye, Compass } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import PageLayout from "@/layout/PageLayout";

interface Hotspot {
  id: number;
  title: string;
  description: string;
  x: number;
  y: number;
  type: string;
}

export default function TourViewer({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  use(params);
  const [selectedHotspot, setSelectedHotspot] = useState<Hotspot | null>(null);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [showInfo, setShowInfo] = useState(true);

  const hotspots: Hotspot[] = [
    {
      id: 1,
      title: "Living Room",
      description: "Spacious living area with panoramic city views",
      x: 30,
      y: 35,
      type: "",
    },
    {
      id: 2,
      title: "Kitchen",
      description: "Modern kitchen with premium appliances",
      x: 70,
      y: 45,
      type: "",
    },
    {
      id: 3,
      title: "Bedroom",
      description: "Master suite with ensuite bathroom",
      x: 50,
      y: 60,
      type: "",
    },
  ];

  return (
    <PageLayout showBackgroundEffects={true} variant="default">
      <div className="min-h-screen mt-10 bg-gray-50 flex flex-col">
        {/* Header */}
        <div className="border-b border-gray-200 bg-white/80 backdrop-blur-sm sticky top-0 z-40">
          <div className="container mx-auto px-6 py-4 flex items-center justify-between">
            <Link
              href="/tour"
              className="flex items-center gap-2 hover:text-gray-700 transition-colors text-gray-600"
            >
              <X className="w-5 h-5" />
              <span className="text-sm font-medium">Back to Tour</span>
            </Link>
            <div className="flex items-center gap-4">
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
          <div className="flex-1 relative bg-black overflow-hidden flex items-center justify-center">
            <Image
              src="/immersive-360-tour-environment.jpg"
              alt="Virtual Tour"
              className="w-full h-full object-cover"
              fill
              priority
            />

            {/* Hotspot Indicators */}
            {showInfo &&
              hotspots.map((spot) => (
                <button
                  key={spot.id}
                  onClick={() => setSelectedHotspot(spot)}
                  className="absolute w-8 h-8 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gray-900/80 hover:bg-gray-900 transition-all animate-pulse hover:animate-none group"
                  style={{ left: `${spot.x}%`, top: `${spot.y}%` }}
                  title={spot.title}
                >
                  <Compass className="w-4 h-4 absolute inset-2 text-white" />
                </button>
              ))}

            {/* Hotspot Detail Card */}
            {selectedHotspot && showInfo && (
              <div className="absolute bottom-6 left-6 bg-white/95 backdrop-blur-sm border border-gray-200 rounded-lg p-4 max-w-xs shadow-lg shadow-black/50">
                <h3 className="font-semibold text-gray-900 mb-2">
                  {selectedHotspot.title}
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  {selectedHotspot.description}
                </p>
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
              <button   onClick={() => setShowInfo(!showInfo)}  className="px-4 py-2 rounded-lg bg-gray-900 text-white hover:bg-gray-800 transition-colors text-sm font-medium">
               {
                  showInfo ? "Hide Fullscreen Info" : "Show Fullscreen Info"
               }
               
              </button>
            </div>
          </div>

          {/* Sidebar */}
          {showInfo && (
            <div className="w-96 border-l border-gray-200 bg-white/80 backdrop-blur-sm overflow-y-auto">
              <div className="p-6 space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Modern Downtown Loft
                  </h2>
                  <p className="text-gray-600 text-sm">New York, NY</p>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">
                    Tour Information
                  </h3>
                  <div className="space-y-2 text-sm text-gray-600">
                    <p>
                      Explore this stunning downtown loft with interactive
                      hotspots highlighting key features and additional
                      information.
                    </p>
                    <p className="pt-2">
                      Use the hotspots to learn more about each room and
                      discover premium details throughout the space.
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">
                    Points of Interest
                  </h3>
                  <div className="space-y-2">
                    {hotspots.map((spot) => (
                      <button
                        key={spot.id}
                        onClick={() => setSelectedHotspot(spot)}
                        className={`w-full text-left p-3 rounded-lg border transition-all ${
                          selectedHotspot?.id === spot.id
                            ? "bg-gray-100 border-gray-400 text-gray-900"
                            : "border-gray-200 hover:border-gray-400 text-gray-900"
                        }`}
                      >
                        <div className="font-medium">{spot.title}</div>
                        <div className="text-xs text-gray-600">
                          {spot.description}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">
                    Audio Regions
                  </h3>
                  <div className="space-y-2 text-sm">
                    {[
                      { name: "Ambient Background", status: "Playing" },
                      { name: "Room Narration", status: "Paused" },
                    ].map((audio, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between p-2 rounded bg-gray-50 border border-gray-200"
                      >
                        <span className="text-gray-600">
                          {audio.name}
                        </span>
                        <span className="text-xs text-gray-700 font-medium">
                          {audio.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">
                    Visual Effects
                  </h3>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    {["Lighting", "Particles", "Fog", "Shadows"].map(
                      (effect, i) => (
                        <div
                          key={i}
                          className="p-2 rounded border border-gray-200 text-gray-600 text-center"
                        >
                          {effect}
                        </div>
                      )
                    )}
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