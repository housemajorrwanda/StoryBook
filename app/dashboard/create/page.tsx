'use client';

import { Upload, Plus, X, Volume2, Zap } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { useCreateVirtualTour } from "@/hooks/virtual-tour/use-virtual-tours";
import { CreateVirtualTourRequest, HotspotForm, AudioRegionForm, EffectForm } from "@/types/tour";

export default function CreateTour() {
  const createTourMutation = useCreateVirtualTour();

  const [formData, setFormData] = useState<CreateVirtualTourRequest>({
    title: "",
    description: "",
    location: "",
    tourType: "360_image",
    embedUrl: "",
    status: "draft",
    isPublished: false,
  });

  const [hotspots, setHotspots] = useState<HotspotForm[]>([
    {
      id: "1",
      title: "Hotspot 1",
      type: "info",
      autoTrigger: false,
      showOnHover: false,
      order: 0,
    },
  ]);

  const [audioRegions, setAudioRegions] = useState<AudioRegionForm[]>([
    {
      id: "1",
      title: "Ambient Background",
      regionType: "sphere",
      centerX: 0,
      centerY: 0,
      centerZ: 0,
      radius: 10,
      volume: 0.8,
      loop: true,
      spatialAudio: true,
      autoPlay: true,
      playOnce: false,
      order: 0,
    },
  ]);

  const [effects, setEffects] = useState<EffectForm[]>([
    {
      id: "1",
      effectType: "visual",
      effectName: "fog",
      triggerType: "on_enter",
      triggerDelay: 0,
      intensity: 0.5,
      opacity: 1,
      size: 1,
      animationSpeed: 1,
      order: 0,
    },
  ]);

  const [tourFile, setTourFile] = useState<File | null>(null);
  const [editingAudio, setEditingAudio] = useState<string | null>(null);
  const [editingEffect, setEditingEffect] = useState<string | null>(null);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  // Hotspot Management
  const addHotspot = () => {
    const newId = Date.now().toString();
    setHotspots([
      ...hotspots,
      {
        id: newId,
        title: `Hotspot ${hotspots.length + 1}`,
        type: "info",
        autoTrigger: false,
        showOnHover: false,
        order: hotspots.length,
      },
    ]);
  };

  const removeHotspot = (id: string) => {
    setHotspots(hotspots.filter((h) => h.id !== id));
  };

  const updateHotspot = (id: string, field: keyof HotspotForm, value: any) => {
    setHotspots(
      hotspots.map((h) => (h.id === id ? { ...h, [field]: value } : h))
    );
  };

  // Audio Region Management
  const addAudioRegion = () => {
    const newId = Date.now().toString();
    setAudioRegions([
      ...audioRegions,
      {
        id: newId,
        title: `Audio Region ${audioRegions.length + 1}`,
        regionType: "sphere",
        centerX: 0,
        centerY: 0,
        centerZ: 0,
        radius: 10,
        volume: 0.8,
        loop: true,
        spatialAudio: true,
        autoPlay: true,
        playOnce: false,
        order: audioRegions.length,
      },
    ]);
  };

  const removeAudioRegion = (id: string) => {
    setAudioRegions(audioRegions.filter((a) => a.id !== id));
  };

  const updateAudioRegion = (
    id: string,
    field: keyof AudioRegionForm,
    value: string | number | boolean
  ) => {
    setAudioRegions(
      audioRegions.map((a) => (a.id === id ? { ...a, [field]: value } : a))
    );
  };

  // Effects Management
  const addEffect = () => {
    const newId = Date.now().toString();
    setEffects([
      ...effects,
      {
        id: newId,
        effectType: "visual",
        effectName: "fog",
        triggerType: "on_enter",
        triggerDelay: 0,
        intensity: 0.5,
        opacity: 1,
        size: 1,
        animationSpeed: 1,
        order: effects.length,
      },
    ]);
  };

  const removeEffect = (id: string) => {
    setEffects(effects.filter((e) => e.id !== id));
  };

  const updateEffect = (
    id: string,
    field: keyof EffectForm,
    value: string | number | boolean
  ) => {
    setEffects(
      effects.map((e) => (e.id === id ? { ...e, [field]: value } : e))
    );
  };

  // File Handlers
  const handleTourFileUpload = (file: File) => {
    setTourFile(file);
  };

  const handleHotspotFileUpload = (
    hotspotId: string,
    file: File,
    type: "audio" | "image" | "video"
  ) => {
    setHotspots(
      hotspots.map((h) => (h.id === hotspotId ? { ...h, file, type } : h))
    );
  };

  const handleAudioRegionFileUpload = (regionId: string, file: File) => {
    setAudioRegions(
      audioRegions.map((a) => (a.id === regionId ? { ...a, file } : a))
    );
  };

  const handleEffectFileUpload = (effectId: string, file: File) => {
    setEffects(
      effects.map((e) => (e.id === effectId ? { ...e, file } : e))
    );
  };

  // Form Submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Prepare files arrays
    const audioFiles: File[] = [];
    const hotspotAudioFiles: File[] = [];
    const hotspotImageFiles: File[] = [];
    const hotspotVideoFiles: File[] = [];
    const effectSoundFiles: File[] = [];

    // Collect files from audio regions
    audioRegions.forEach(region => {
      if (region.file) {
        audioFiles.push(region.file);
      }
    });

    // Collect files from hotspots
    hotspots.forEach(hotspot => {
      if (hotspot.file) {
        if (hotspot.type === 'audio') {
          hotspotAudioFiles.push(hotspot.file);
        } else if (hotspot.type === 'image') {
          hotspotImageFiles.push(hotspot.file);
        } else if (hotspot.type === 'video') {
          hotspotVideoFiles.push(hotspot.file);
        }
      }
    });

    // Collect files from effects
    effects.forEach(effect => {
      if (effect.file && effect.effectType === 'sound') {
        effectSoundFiles.push(effect.file);
      }
    });

    // Prepare nested data without files
    const hotspotsData = hotspots.map((hotspot, index) => ({
      type: hotspot.type,
      title: hotspot.title,
      description: hotspot.description,
      positionX: hotspot.positionX || 0,
      positionY: hotspot.positionY || 0,
      positionZ: hotspot.positionZ || 0,
      pitch: hotspot.pitch,
      yaw: hotspot.yaw,
      icon: hotspot.icon,
      actionUrl: hotspot.actionUrl,
      color: hotspot.color,
      size: hotspot.size,
      triggerDistance: hotspot.triggerDistance,
      autoTrigger: hotspot.autoTrigger,
      showOnHover: hotspot.showOnHover,
      order: index,
    }));

    const audioRegionsData = audioRegions.map((region, index) => ({
      regionType: region.regionType,
      centerX: region.centerX,
      centerY: region.centerY,
      centerZ: region.centerZ,
      radius: region.radius,
      width: region.width,
      height: region.height,
      depth: region.depth,
      volume: region.volume,
      loop: region.loop,
      fadeInDuration: region.fadeInDuration,
      fadeOutDuration: region.fadeOutDuration,
      spatialAudio: region.spatialAudio,
      minDistance: region.minDistance,
      maxDistance: region.maxDistance,
      autoPlay: region.autoPlay,
      playOnce: region.playOnce,
      title: region.title,
      description: region.description,
      order: index,
    }));

    const effectsData = effects.map((effect, index) => ({
      effectType: effect.effectType,
      triggerType: effect.triggerType,
      effectName: effect.effectName,
      positionX: effect.positionX,
      positionY: effect.positionY,
      positionZ: effect.positionZ,
      pitch: effect.pitch,
      yaw: effect.yaw,
      triggerDistance: effect.triggerDistance,
      triggerDelay: effect.triggerDelay || 0,
      intensity: effect.intensity || 1.0,
      duration: effect.duration,
      color: effect.color,
      particleCount: effect.particleCount,
      opacity: effect.opacity || 1.0,
      size: effect.size || 1.0,
      animationType: effect.animationType,
      animationSpeed: effect.animationSpeed || 1.0,
      title: effect.title,
      description: effect.description,
      order: index,
    }));

    // Set tour file based on type - FIX: Use the correct field name
    const tourFileData: any = {};
    if (tourFile) {
      if (formData.tourType === '360_image') {
        tourFileData.image360File = tourFile;
      } else if (formData.tourType === '360_video') {
        tourFileData.video360File = tourFile;
      } else if (formData.tourType === '3d_model') {
        tourFileData.model3dFile = tourFile;
      }
    }

    try {
      await createTourMutation.mutateAsync({
        ...formData,
        ...tourFileData,
        hotspots: hotspotsData.length > 0 ? hotspotsData : undefined,
        audioRegions: audioRegionsData.length > 0 ? audioRegionsData : undefined,
        effects: effectsData.length > 0 ? effectsData : undefined,
        audioFiles: audioFiles.length > 0 ? audioFiles : undefined,
        hotspotAudioFiles: hotspotAudioFiles.length > 0 ? hotspotAudioFiles : undefined,
        hotspotImageFiles: hotspotImageFiles.length > 0 ? hotspotImageFiles : undefined,
        hotspotVideoFiles: hotspotVideoFiles.length > 0 ? hotspotVideoFiles : undefined,
        effectSoundFiles: effectSoundFiles.length > 0 ? effectSoundFiles : undefined,
      });
    } catch (error) {
      console.error("Failed to create tour:", error);
    }
  };

  // File Upload Component
  const FileUpload = ({
    onFileSelect,
    accept,
    label,
  }: {
    onFileSelect: (file: File) => void;
    accept: string;
    label: string;
  }) => {
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        onFileSelect(file);
      }
    };

    return (
      <div className="border-2 border-dashed border-gray-200 rounded-lg p-8 text-center">
        <Upload className="w-12 h-12 text-gray-500 mx-auto mb-4" />
        <p className="text-gray-900 font-medium mb-1">{label}</p>
        <p className="text-sm text-gray-500 mb-4">
          Drag and drop or click to browse
        </p>
        <input
          type="file"
          accept={accept}
          onChange={handleFileChange}
          className="hidden"
          id="file-upload"
        />
        <label
          htmlFor="file-upload"
          className="px-4 py-2 rounded-lg bg-gray-900 text-white hover:bg-gray-800 transition-colors font-medium cursor-pointer"
        >
          Browse Files
        </label>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-6 py-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">
          Create New Tour
        </h1>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Tour Information Section */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Tour Information
            </h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Tour Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="e.g., Downtown Loft"
                  className="w-full px-4 py-2 rounded-lg bg-white border border-gray-200 text-gray-900 placeholder-gray-500 focus:outline-none focus:border-gray-400"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Describe your tour..."
                  rows={4}
                  className="w-full px-4 py-2 rounded-lg bg-white border border-gray-200 text-gray-900 placeholder-gray-500 focus:outline-none focus:border-gray-400 resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Location *
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  placeholder="e.g., New York, NY"
                  className="w-full px-4 py-2 rounded-lg bg-white border border-gray-200 text-gray-900 placeholder-gray-500 focus:outline-none focus:border-gray-400"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Tour Type *
                </label>
                <select
                  name="tourType"
                  value={formData.tourType}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 rounded-lg bg-white border border-gray-200 text-gray-900 focus:outline-none focus:border-gray-400"
                >
                  <option value="360_image">360° Image</option>
                  <option value="360_video">360° Video</option>
                  <option value="3d_model">3D Model</option>
                  <option value="embed">Embedded Tour</option>
                </select>
              </div>

              {formData.tourType === "embed" && (
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Embed URL *
                  </label>
                  <input
                    type="url"
                    name="embedUrl"
                    value={formData.embedUrl}
                    onChange={handleInputChange}
                    placeholder="https://example.com/tour"
                    className="w-full px-4 py-2 rounded-lg bg-white border border-gray-200 text-gray-900 placeholder-gray-500 focus:outline-none focus:border-gray-400"
                    required
                  />
                </div>
              )}

              {formData.tourType !== "embed" && (
                <FileUpload
                  onFileSelect={handleTourFileUpload}
                  accept={
                    formData.tourType === "360_image"
                      ? "image/*"
                      : formData.tourType === "360_video"
                      ? "video/*"
                      : "model/*"
                  }
                  label={`Upload your ${formData.tourType.replace("_", " ")} file`}
                />
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Status
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 rounded-lg bg-white border border-gray-200 text-gray-900 focus:outline-none focus:border-gray-400"
                  >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>

                <div className="flex items-center">
                  <label className="flex items-center gap-2 cursor-pointer mt-6">
                    <input
                      type="checkbox"
                      name="isPublished"
                      checked={formData.isPublished}
                      onChange={handleInputChange}
                      className="w-4 h-4 rounded border-gray-300 cursor-pointer"
                    />
                    <span className="text-sm text-gray-900">
                      Publish immediately
                    </span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Hotspots Section */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                Interactive Hotspots
              </h2>
              <button
                type="button"
                onClick={addHotspot}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-900 text-white hover:bg-gray-800 transition-colors font-medium"
              >
                <Plus className="w-4 h-4" />
                Add Hotspot
              </button>
            </div>

            <div className="space-y-4">
              {hotspots.map((hotspot) => (
                <div
                  key={hotspot.id}
                  className="border border-gray-200 rounded-lg p-4 bg-white/50"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <input
                      type="text"
                      value={hotspot.title}
                      onChange={(e) =>
                        updateHotspot(hotspot.id, "title", e.target.value)
                      }
                      placeholder="Hotspot title"
                      className="flex-1 px-3 py-2 rounded bg-white border border-gray-200 text-gray-900 placeholder-gray-500 focus:outline-none focus:border-gray-400"
                    />
                    <select
                      value={hotspot.type}
                      onChange={(e) =>
                        updateHotspot(hotspot.id, "type", e.target.value)
                      }
                      className="px-3 py-2 rounded bg-white border border-gray-200 text-gray-900 focus:outline-none focus:border-gray-400"
                    >
                      <option value="info">Info</option>
                      <option value="link">Link</option>
                      <option value="audio">Audio</option>
                      <option value="image">Image</option>
                      <option value="video">Video</option>
                      <option value="effect">Effect</option>
                    </select>
                    <button
                      type="button"
                      onClick={() => removeHotspot(hotspot.id)}
                      className="p-2 rounded hover:bg-red-50 text-red-600 transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  {(hotspot.type === "audio" ||
                    hotspot.type === "image" ||
                    hotspot.type === "video") && (
                    <div className="mb-4">
                      <FileUpload
                        onFileSelect={(file) =>
                          handleHotspotFileUpload(
                            hotspot.id,
                            file,
                            hotspot.type as any
                          )
                        }
                        accept={
                          hotspot.type === "audio"
                            ? "audio/*"
                            : hotspot.type === "image"
                            ? "image/*"
                            : "video/*"
                        }
                        label={`Upload ${hotspot.type} file`}
                      />
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-2">
                        Position X
                      </label>
                      <input
                        type="number"
                        value={hotspot.positionX || 0}
                        onChange={(e) =>
                          updateHotspot(
                            hotspot.id,
                            "positionX",
                            parseFloat(e.target.value)
                          )
                        }
                        className="w-full px-3 py-2 rounded bg-white border border-gray-200 text-gray-900 focus:outline-none focus:border-gray-400"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-2">
                        Position Y
                      </label>
                      <input
                        type="number"
                        value={hotspot.positionY || 0}
                        onChange={(e) =>
                          updateHotspot(
                            hotspot.id,
                            "positionY",
                            parseFloat(e.target.value)
                          )
                        }
                        className="w-full px-3 py-2 rounded bg-white border border-gray-200 text-gray-900 focus:outline-none focus:border-gray-400"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Audio Regions Section */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                <Volume2 className="w-5 h-5 text-gray-900" />
                Audio Regions
              </h2>
              <button
                type="button"
                onClick={addAudioRegion}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-900 text-white hover:bg-gray-800 transition-colors font-medium"
              >
                <Plus className="w-4 h-4" />
                Add Audio Region
              </button>
            </div>

            <div className="space-y-4">
              {audioRegions.length === 0 ? (
                <div className="text-center py-8 px-4 rounded-lg border border-dashed border-gray-200">
                  <p className="text-gray-500">No audio regions configured</p>
                </div>
              ) : (
                audioRegions.map((region) => (
                  <div
                    key={region.id}
                    className="border border-gray-200 rounded-lg overflow-hidden bg-white/50"
                  >
                    <div
                      className="p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors"
                      onClick={() =>
                        setEditingAudio(
                          editingAudio === region.id ? null : region.id
                        )
                      }
                    >
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">
                          {region.title}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {region.regionType === "sphere"
                            ? "Spherical"
                            : "Box"}{" "}
                          • Radius: {region.radius}m • Volume:{" "}
                          {Math.round(region.volume * 100)}%
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeAudioRegion(region.id);
                        }}
                        className="p-2 rounded hover:bg-red-50 text-red-600 transition-colors"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    {editingAudio === region.id && (
                      <div className="border-t border-gray-200 p-4 space-y-4 bg-white">
                        <div>
                          <label className="block text-sm font-medium text-gray-900 mb-2">
                            Region Title
                          </label>
                          <input
                            type="text"
                            value={region.title}
                            onChange={(e) =>
                              updateAudioRegion(
                                region.id,
                                "title",
                                e.target.value
                              )
                            }
                            className="w-full px-3 py-2 rounded bg-white border border-gray-200 text-gray-900 focus:outline-none focus:border-gray-400"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-900 mb-2">
                              Region Type
                            </label>
                            <select
                              value={region.regionType}
                              onChange={(e) =>
                                updateAudioRegion(
                                  region.id,
                                  "regionType",
                                  e.target.value
                                )
                              }
                              className="w-full px-3 py-2 rounded bg-white border border-gray-200 text-gray-900 focus:outline-none focus:border-gray-400"
                            >
                              <option value="sphere">Sphere</option>
                              <option value="box">Box</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-900 mb-2">
                              Radius (meters)
                            </label>
                            <input
                              type="number"
                              value={region.radius}
                              onChange={(e) =>
                                updateAudioRegion(
                                  region.id,
                                  "radius",
                                  parseFloat(e.target.value)
                                )
                              }
                              className="w-full px-3 py-2 rounded bg-white border border-gray-200 text-gray-900 focus:outline-none focus:border-gray-400"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-900 mb-2">
                            Volume: {Math.round(region.volume * 100)}%
                          </label>
                          <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.1"
                            value={region.volume}
                            onChange={(e) =>
                              updateAudioRegion(
                                region.id,
                                "volume",
                                parseFloat(e.target.value)
                              )
                            }
                            className="w-full"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-900 mb-2">
                            Audio File
                          </label>
                          <FileUpload
                            onFileSelect={(file) =>
                              handleAudioRegionFileUpload(region.id, file)
                            }
                            accept="audio/*"
                            label="Upload audio file"
                          />
                        </div>

                        <div className="space-y-3">
                          <label className="flex items-center gap-3 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={region.spatialAudio}
                              onChange={(e) =>
                                updateAudioRegion(
                                  region.id,
                                  "spatialAudio",
                                  e.target.checked
                                )
                              }
                              className="w-4 h-4 rounded border-gray-300 cursor-pointer"
                            />
                            <span className="text-sm text-gray-900">
                              Enable Spatial Audio (3D positioning)
                            </span>
                          </label>

                          <label className="flex items-center gap-3 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={region.autoPlay}
                              onChange={(e) =>
                                updateAudioRegion(
                                  region.id,
                                  "autoPlay",
                                  e.target.checked
                                )
                              }
                              className="w-4 h-4 rounded border-gray-300 cursor-pointer"
                            />
                            <span className="text-sm text-gray-900">
                              Auto-play when entering region
                            </span>
                          </label>
                        </div>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Effects Section */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                <Zap className="w-5 h-5 text-gray-900" />
                Special Effects
              </h2>
              <button
                type="button"
                onClick={addEffect}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-900 text-white hover:bg-gray-800 transition-colors font-medium"
              >
                <Plus className="w-4 h-4" />
                Add Effect
              </button>
            </div>

            <div className="space-y-4">
              {effects.length === 0 ? (
                <div className="text-center py-8 px-4 rounded-lg border border-dashed border-gray-200">
                  <p className="text-gray-500">No effects configured</p>
                </div>
              ) : (
                effects.map((effect) => (
                  <div
                    key={effect.id}
                    className="border border-gray-200 rounded-lg overflow-hidden bg-white/50"
                  >
                    <div
                      className="p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors"
                      onClick={() =>
                        setEditingEffect(
                          editingEffect === effect.id ? null : effect.id
                        )
                      }
                    >
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">
                          {effect.effectName}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {effect.effectType} • {effect.triggerType} • Intensity: {effect.intensity}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeEffect(effect.id);
                        }}
                        className="p-2 rounded hover:bg-red-50 text-red-600 transition-colors"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    {editingEffect === effect.id && (
                      <div className="border-t border-gray-200 p-4 space-y-4 bg-white">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-900 mb-2">
                              Effect Type
                            </label>
                            <select
                              value={effect.effectType}
                              onChange={(e) =>
                                updateEffect(
                                  effect.id,
                                  "effectType",
                                  e.target.value
                                )
                              }
                              className="w-full px-3 py-2 rounded bg-white border border-gray-200 text-gray-900 focus:outline-none focus:border-gray-400"
                            >
                              <option value="visual">Visual</option>
                              <option value="sound">Sound</option>
                              <option value="particle">Particle</option>
                              <option value="animation">Animation</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-900 mb-2">
                              Effect Name
                            </label>
                            <input
                              type="text"
                              value={effect.effectName}
                              onChange={(e) =>
                                updateEffect(
                                  effect.id,
                                  "effectName",
                                  e.target.value
                                )
                              }
                              placeholder="e.g., fog, rain, sparkle"
                              className="w-full px-3 py-2 rounded bg-white border border-gray-200 text-gray-900 focus:outline-none focus:border-gray-400"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-900 mb-2">
                              Trigger Type
                            </label>
                            <select
                              value={effect.triggerType}
                              onChange={(e) =>
                                updateEffect(
                                  effect.id,
                                  "triggerType",
                                  e.target.value
                                )
                              }
                              className="w-full px-3 py-2 rounded bg-white border border-gray-200 text-gray-900 focus:outline-none focus:border-gray-400"
                            >
                              <option value="on_enter">On Enter</option>
                              <option value="on_look">On Look</option>
                              <option value="on_click">On Click</option>
                              <option value="on_timer">On Timer</option>
                              <option value="always">Always</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-900 mb-2">
                              Intensity: {effect.intensity}
                            </label>
                            <input
                              type="range"
                              min="0"
                              max="1"
                              step="0.1"
                              value={effect.intensity}
                              onChange={(e) =>
                                updateEffect(
                                  effect.id,
                                  "intensity",
                                  parseFloat(e.target.value)
                                )
                              }
                              className="w-full"
                            />
                          </div>
                        </div>

                        {effect.effectType === "sound" && (
                          <div>
                            <label className="block text-sm font-medium text-gray-900 mb-2">
                              Sound File
                            </label>
                            <FileUpload
                              onFileSelect={(file) =>
                                handleEffectFileUpload(effect.id, file)
                              }
                              accept="audio/*"
                              label="Upload sound file"
                            />
                          </div>
                        )}

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-900 mb-2">
                              Position X
                            </label>
                            <input
                              type="number"
                              value={effect.positionX || 0}
                              onChange={(e) =>
                                updateEffect(
                                  effect.id,
                                  "positionX",
                                  parseFloat(e.target.value)
                                )
                              }
                              className="w-full px-3 py-2 rounded bg-white border border-gray-200 text-gray-900 focus:outline-none focus:border-gray-400"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-900 mb-2">
                              Position Y
                            </label>
                            <input
                              type="number"
                              value={effect.positionY || 0}
                              onChange={(e) =>
                                updateEffect(
                                  effect.id,
                                  "positionY",
                                  parseFloat(e.target.value)
                                )
                              }
                              className="w-full px-3 py-2 rounded bg-white border border-gray-200 text-gray-900 focus:outline-none focus:border-gray-400"
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex gap-4 justify-end">
            <Link
              href="/gallery"
              className="px-6 py-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors font-medium text-gray-900"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={createTourMutation.isPending}
              className="px-6 py-3 rounded-lg bg-gray-900 text-white hover:bg-gray-800 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {createTourMutation.isPending ? "Creating..." : "Create Tour"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}