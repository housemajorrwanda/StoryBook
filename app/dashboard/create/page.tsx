'use client';

import { Upload, Plus, X, Volume2, Zap } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { useCreateVirtualTour } from "@/hooks/virtual-tour/use-virtual-tours";
import { CreateVirtualTourRequest , CreateAudioRegionData , CreateEffectData , CreateHotspotData } from "@/types/tour";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";


const FileUpload = ({
  onFileSelect,
  accept,
  label,
  currentFile,
}: {
  onFileSelect: (file: File) => void;
  accept: string;
  label: string;
  currentFile?: File;
}) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileSelect(file);
    }
  };

  return (
    <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center">
      <Upload className="w-8 h-8 text-gray-500 mx-auto mb-3" />
      <p className="text-gray-900 font-medium mb-1">{label}</p>
      <p className="text-sm text-gray-500 mb-3">
        {currentFile ? `Selected: ${currentFile.name}` : 'Drag and drop or click to browse'}
      </p>
      <input
        type="file"
        accept={accept}
        onChange={handleFileChange}
        className="hidden"
        id={`file-upload-${label.replace(/\s+/g, '-')}`}
      />
      <label
        htmlFor={`file-upload-${label.replace(/\s+/g, '-')}`}
        className="px-4 py-2 rounded-lg bg-gray-900 text-white hover:bg-gray-800 transition-colors font-medium cursor-pointer text-sm"
      >
        {currentFile ? 'Change File' : 'Browse Files'}
      </label>
    </div>
  );
};


export default function CreateTour() {
  const createTourMutation = useCreateVirtualTour();
  const router = useRouter();

  const [formData, setFormData] = useState<CreateVirtualTourRequest>({
    title: "",
    description: "",
    location: "",
    tourType: "360_image",
    embedUrl: "",
    status: "draft",
    isPublished: false,
  });

  const [hotspots, setHotspots] = useState<CreateHotspotData[]>([]);
  const [audioRegions, setAudioRegions] = useState<CreateAudioRegionData[]>([]);
  const [effects, setEffects] = useState<CreateEffectData[]>([]);

  const [tourFile, setTourFile] = useState<File | null>(null);
  const [audioFiles, setAudioFiles] = useState<(File | undefined)[]>([]);
  const [hotspotAudioFiles, setHotspotAudioFiles] = useState<(File | undefined)[]>([]);
  const [hotspotImageFiles, setHotspotImageFiles] = useState<(File | undefined)[]>([]);
  const [hotspotVideoFiles, setHotspotVideoFiles] = useState<(File | undefined)[]>([]);
  const [effectSoundFiles, setEffectSoundFiles] = useState<(File | undefined)[]>([]);

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
    setHotspots([
      ...hotspots,
      {
        type: "info",
        title: `Hotspot ${hotspots.length + 1}`,
        description: "",
        positionX: 0,
        positionY: 0,
        positionZ: 0,
        pitch: 0,
        yaw: 0,
        icon: "",
        actionUrl: "",
        color: "",
        size: 1,
        triggerDistance: 5,
        autoTrigger: false,
        showOnHover: false,
        order: hotspots.length,
      },
    ]);
  };

  const removeHotspot = (id: string) => {
    setHotspots(hotspots.filter((h) => h.id !== id));
    // Clean up associated files (shift indices)
    setHotspotAudioFiles(hotspotAudioFiles.filter((_, i) => hotspots[i].id !== id));
    setHotspotImageFiles(hotspotImageFiles.filter((_, i) => hotspots[i].id !== id));
    setHotspotVideoFiles(hotspotVideoFiles.filter((_, i) => hotspots[i].id !== id));
  };

  const updateHotspot = (id: string, field: keyof CreateHotspotData, value: string | number | boolean) => {
    setHotspots(
      hotspots.map((h) => (h.id === id ? { ...h, [field]: value } : h))
    );
  };

  // Audio Region Management
  const addAudioRegion = () => {

    setAudioRegions([
      ...audioRegions,
      {
        title: `Audio Region ${audioRegions.length + 1}`,
        description: "",
        regionType: "sphere",
        centerX: 0,
        centerY: 0,
        centerZ: 0,
        radius: 10,
        width: 0,
        height: 0,
        depth: 0,
        volume: 0.8,
        loop: true,
        fadeInDuration: 0,
        fadeOutDuration: 0,
        spatialAudio: true,
        minDistance: 1,
        maxDistance: 50,
        autoPlay: true,
        playOnce: false,
        order: audioRegions.length,
      },
    ]);
  };

  const removeAudioRegion = (id: string) => {
    setAudioRegions(audioRegions.filter((a) => a.id !== id));
    setAudioFiles(audioFiles.filter((_, i) => audioRegions[i].id !== id));
  };

  const updateAudioRegion = (
    id: string,
    field: keyof CreateAudioRegionData,
    value: string | number | boolean
  ) => {
    setAudioRegions(
      audioRegions.map((a) => (a.id === id ? { ...a, [field]: value } : a))
    );
  };

  // Effects Management
  const addEffect = () => {
    setEffects([
      ...effects,
      {
        effectType: "visual",
        effectName: "fog",
        triggerType: "on_enter",
        positionX: 0,
        positionY: 0,
        positionZ: 0,
        pitch: 0,
        yaw: 0,
        triggerDistance: 5,
        triggerDelay: 0,
        intensity: 0.5,
        duration: 0,
        color: "",
        particleCount: 0,
        opacity: 1,
        size: 1,
        animationType: "",
        animationSpeed: 1,
        title: "",
        description: "",
        order: effects.length,
      },
    ]);
  };

  const removeEffect = (id: string) => {
    setEffects(effects.filter((e) => e.id !== id));
    setEffectSoundFiles(effectSoundFiles.filter((_, i) => effects[i].id !== id));
  };

  const updateEffect = (
    id: string,
    field: keyof CreateEffectData,
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

  const handleAudioRegionFileUpload = (regionIndex: number, file: File) => {
    const newAudioFiles = [...audioFiles];
    newAudioFiles[regionIndex] = file;
    setAudioFiles(newAudioFiles);
  };

  const handleHotspotFileUpload = (
    hotspotIndex: number,
    file: File,
    type: "audio" | "image" | "video"
  ) => {
    if (type === "audio") {
      const newFiles = [...hotspotAudioFiles];
      newFiles[hotspotIndex] = file;
      setHotspotAudioFiles(newFiles);
    } else if (type === "image") {
      const newFiles = [...hotspotImageFiles];
      newFiles[hotspotIndex] = file;
      setHotspotImageFiles(newFiles);
    } else if (type === "video") {
      const newFiles = [...hotspotVideoFiles];
      newFiles[hotspotIndex] = file;
      setHotspotVideoFiles(newFiles);
    }
  };

  const handleEffectFileUpload = (effectIndex: number, file: File) => {
    const newFiles = [...effectSoundFiles];
    newFiles[effectIndex] = file;
    setEffectSoundFiles(newFiles);
  };

  // Form Submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = new FormData();

    // Append basic fields
    payload.append('title', formData.title);
    payload.append('description', formData.description);
    payload.append('location', formData.location);
    payload.append('tourType', formData.tourType);
    if (formData.embedUrl) payload.append('embedUrl', formData.embedUrl);
    payload.append('status', formData.status);
    payload.append('isPublished', formData.isPublished.toString());

    // Append tour file if present
    if (tourFile) {
      payload.append('tourFile', tourFile);
    }

    // Append hotspots and related files
    if (hotspots.length > 0) {
      const hotspotsData = hotspots.map((hotspot, index) => ({
        type: hotspot.type,
        title: hotspot.title,
        description: hotspot.description,
        positionX: hotspot.positionX,
        positionY: hotspot.positionY,
        positionZ: hotspot.positionZ,
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
      payload.append('hotspots', JSON.stringify(hotspotsData));

      hotspotAudioFiles.forEach((file) => {
        if (file) payload.append('hotspotAudioFiles', file);
      });
      hotspotImageFiles.forEach((file) => {
        if (file) payload.append('hotspotImageFiles', file);
      });
      hotspotVideoFiles.forEach((file) => {
        if (file) payload.append('hotspotVideoFiles', file);
      });
    }

    // Append audio regions and files
    if (audioRegions.length > 0) {
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
      payload.append('audioRegions', JSON.stringify(audioRegionsData));

      audioFiles.forEach((file) => {
        if (file) payload.append('audioFiles', file);
      });
    }

    // Append effects and files
    if (effects.length > 0) {
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
        triggerDelay: effect.triggerDelay,
        intensity: effect.intensity,
        duration: effect.duration,
        color: effect.color,
        particleCount: effect.particleCount,
        opacity: effect.opacity,
        size: effect.size,
        animationType: effect.animationType,
        animationSpeed: effect.animationSpeed,
        title: effect.title,
        description: effect.description,
        order: index,
      }));
      payload.append('effects', JSON.stringify(effectsData));

      effectSoundFiles.forEach((file) => {
        if (file) payload.append('effectSoundFiles', file);
      });
    }

    try {
      await createTourMutation.mutateAsync(payload);
      router.push("/dashboard/virtual-tour");
    } catch (error) {
      console.error("Failed to create tour:", error);
      toast.error("Failed to create tour");
    }
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
                  placeholder="e.g., Museum Virtual Tour"
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
                  placeholder="e.g., National Museum, City Center"
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
                    placeholder="https://matterport.com/tour/123"
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
                      : ".glb,.gltf,.obj,.fbx"
                  }
                  label={`Upload ${formData.tourType.replace("_", " ")} file`}
                  currentFile={tourFile || undefined}
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
              {hotspots.map((hotspot, index) => (
                <div
                  key={hotspot.id}
                  className="border border-gray-200 rounded-lg p-6 bg-white/50"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <input
                      type="text"
                      value={hotspot.title}
                      onChange={(e) =>
                        updateHotspot(hotspot.id!, "title", e.target.value)
                      }
                      placeholder="Hotspot title"
                      className="flex-1 px-3 py-2 rounded bg-white border border-gray-200 text-gray-900 placeholder-gray-500 focus:outline-none focus:border-gray-400"
                    />
                    <select
                      value={hotspot.type}
                      onChange={(e) =>
                        updateHotspot(hotspot.id!, "type", e.target.value)
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
                      onClick={() => removeHotspot(hotspot.id!)}
                      className="p-2 rounded hover:bg-red-50 text-red-600 transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-2">
                        Position X
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        value={hotspot.positionX}
                        onChange={(e) =>
                          updateHotspot(
                            hotspot.id!,
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
                        step="0.1"
                        value={hotspot.positionY}
                        onChange={(e) =>
                          updateHotspot(
                            hotspot.id!,
                            "positionY",
                            parseFloat(e.target.value)
                          )
                        }
                        className="w-full px-3 py-2 rounded bg-white border border-gray-200 text-gray-900 focus:outline-none focus:border-gray-400"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-2">
                        Position Z
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        value={hotspot.positionZ}
                        onChange={(e) =>
                          updateHotspot(
                            hotspot.id!,
                            "positionZ",
                            parseFloat(e.target.value)
                          )
                        }
                        className="w-full px-3 py-2 rounded bg-white border border-gray-200 text-gray-900 focus:outline-none focus:border-gray-400"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-2">
                        Trigger Distance
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        value={hotspot.triggerDistance}
                        onChange={(e) =>
                          updateHotspot(
                            hotspot.id!,
                            "triggerDistance",
                            parseFloat(e.target.value)
                          )
                        }
                        className="w-full px-3 py-2 rounded bg-white border border-gray-200 text-gray-900 focus:outline-none focus:border-gray-400"
                      />
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      Description
                    </label>
                    <textarea
                      value={hotspot.description}
                      onChange={(e) =>
                        updateHotspot(hotspot.id!, "description", e.target.value)
                      }
                      placeholder="Hotspot description"
                      rows={2}
                      className="w-full px-3 py-2 rounded bg-white border border-gray-200 text-gray-900 placeholder-gray-500 focus:outline-none focus:border-gray-400 resize-none"
                    />
                  </div>

                  {(hotspot.type === "audio" ||
                    hotspot.type === "image" ||
                    hotspot.type === "video") && (
                    <div className="mb-4">
                      <FileUpload
                        onFileSelect={(file) =>
                          handleHotspotFileUpload(
                            index,
                            file,
                            hotspot.type as "audio" | "image" | "video"
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
                        currentFile={
                          hotspot.type === "audio" 
                            ? hotspotAudioFiles[index]
                            : hotspot.type === "image"
                            ? hotspotImageFiles[index]
                            : hotspotVideoFiles[index]
                        }
                      />
                    </div>
                  )}

                  <div className="space-y-3">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={hotspot.autoTrigger}
                        onChange={(e) =>
                          updateHotspot(hotspot.id!, "autoTrigger", e.target.checked)
                        }
                        className="w-4 h-4 rounded border-gray-300 cursor-pointer"
                      />
                      <span className="text-sm text-gray-900">
                        Auto-trigger when in range
                      </span>
                    </label>

                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={hotspot.showOnHover}
                        onChange={(e) =>
                          updateHotspot(hotspot.id!, "showOnHover", e.target.checked)
                        }
                        className="w-4 h-4 rounded border-gray-300 cursor-pointer"
                      />
                      <span className="text-sm text-gray-900">
                        Show on hover only
                      </span>
                    </label>
                  </div>
                </div>
              ))}

              {hotspots.length === 0 && (
                <div className="text-center py-8 px-4 rounded-lg border border-dashed border-gray-200">
                  <p className="text-gray-500">No hotspots configured</p>
                </div>
              )}
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
              {audioRegions.map((region, index) => (
                <div
                  key={region.id}
                  className="border border-gray-200 rounded-lg overflow-hidden bg-white/50"
                >
                  <div
                    className="p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors"
                    onClick={() =>
                      setEditingAudio(
                        editingAudio === region.id! ? null : region.id!
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
                        removeAudioRegion(region.id!);
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
                              region.id!,
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
                                region.id!,
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
                            step="0.1"
                            value={region.radius}
                            onChange={(e) =>
                              updateAudioRegion(
                                region.id!,
                                "radius",
                                parseFloat(e.target.value)
                              )
                            }
                            className="w-full px-3 py-2 rounded bg-white border border-gray-200 text-gray-900 focus:outline-none focus:border-gray-400"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-900 mb-2">
                            Center X
                          </label>
                          <input
                            type="number"
                            step="0.1"
                            value={region.centerX}
                            onChange={(e) =>
                              updateAudioRegion(
                                region.id!,
                                "centerX",
                                parseFloat(e.target.value)
                              )
                            }
                            className="w-full px-3 py-2 rounded bg-white border border-gray-200 text-gray-900 focus:outline-none focus:border-gray-400"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-900 mb-2">
                            Center Y
                          </label>
                          <input
                            type="number"
                            step="0.1"
                            value={region.centerY}
                            onChange={(e) =>
                              updateAudioRegion(
                                region.id!,
                                "centerY",
                                parseFloat(e.target.value)
                              )
                            }
                            className="w-full px-3 py-2 rounded bg-white border border-gray-200 text-gray-900 focus:outline-none focus:border-gray-400"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-900 mb-2">
                            Center Z
                          </label>
                          <input
                            type="number"
                            step="0.1"
                            value={region.centerZ}
                            onChange={(e) =>
                              updateAudioRegion(
                                region.id!,
                                "centerZ",
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
                              region.id!,
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
                            handleAudioRegionFileUpload(index, file)
                          }
                          accept="audio/*"
                          label="Upload audio file"
                          currentFile={audioFiles[index]}
                        />
                      </div>

                      <div className="space-y-3">
                        <label className="flex items-center gap-3 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={region.spatialAudio}
                            onChange={(e) =>
                              updateAudioRegion(
                                region.id!,
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
                                region.id!,
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

                        <label className="flex items-center gap-3 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={region.loop}
                            onChange={(e) =>
                              updateAudioRegion(
                                region.id!,
                                "loop",
                                e.target.checked
                              )
                            }
                            className="w-4 h-4 rounded border-gray-300 cursor-pointer"
                          />
                          <span className="text-sm text-gray-900">
                            Loop audio
                          </span>
                        </label>
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {audioRegions.length === 0 && (
                <div className="text-center py-8 px-4 rounded-lg border border-dashed border-gray-200">
                  <p className="text-gray-500">No audio regions configured</p>
                </div>
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
              {effects.map((effect, index) => (
                <div
                  key={effect.id}
                  className="border border-gray-200 rounded-lg overflow-hidden bg-white/50"
                >
                  <div
                    className="p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors"
                    onClick={() =>
                      setEditingEffect(
                        editingEffect === effect.id! ? null : effect.id!
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
                        removeEffect(effect.id!);
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
                                effect.id!,
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
                                effect.id!,
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
                                effect.id!,
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
                                effect.id!,
                                "intensity",
                                parseFloat(e.target.value)
                              )
                            }
                            className="w-full"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-900 mb-2">
                            Position X
                          </label>
                          <input
                            type="number"
                            step="0.1"
                            value={effect.positionX}
                            onChange={(e) =>
                              updateEffect(
                                effect.id!,
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
                            step="0.1"
                            value={effect.positionY}
                            onChange={(e) =>
                              updateEffect(
                                effect.id!,
                                "positionY",
                                parseFloat(e.target.value)
                              )
                            }
                            className="w-full px-3 py-2 rounded bg-white border border-gray-200 text-gray-900 focus:outline-none focus:border-gray-400"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-900 mb-2">
                            Position Z
                          </label>
                          <input
                            type="number"
                            step="0.1"
                            value={effect.positionZ}
                            onChange={(e) =>
                              updateEffect(
                                effect.id!,
                                "positionZ",
                                parseFloat(e.target.value)
                              )
                            }
                            className="w-full px-3 py-2 rounded bg-white border border-gray-200 text-gray-900 focus:outline-none focus:border-gray-400"
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
                              handleEffectFileUpload(index, file)
                            }
                            accept="audio/*"
                            label="Upload sound file"
                            currentFile={effectSoundFiles[index]}
                          />
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}

              {effects.length === 0 && (
                <div className="text-center py-8 px-4 rounded-lg border border-dashed border-gray-200">
                  <p className="text-gray-500">No effects configured</p>
                </div>
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