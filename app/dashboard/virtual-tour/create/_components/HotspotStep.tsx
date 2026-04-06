"use client";

import { Plus, X, FileText, MapPin } from "lucide-react";
import dynamic from "next/dynamic";
import { Select, Checkbox } from "@/components/shared";
import { CreateHotspotData } from "@/types/tour";
import { Section, Field, FileUpload, inputCls } from "./shared";
import type { PlacedMarker as PanoMarker } from "@/components/virtual-tour/PanoramaHotspotEditor";
import type { PlacedMarker as FlatMarker } from "@/components/virtual-tour/FlatImageHotspotEditor";

// Lazy-load heavy viewers (they use browser APIs / CDN scripts)
const PanoramaHotspotEditor = dynamic(
  () => import("@/components/virtual-tour/PanoramaHotspotEditor"),
  { ssr: false, loading: () => <EditorSkeleton /> },
);
const FlatImageHotspotEditor = dynamic(
  () => import("@/components/virtual-tour/FlatImageHotspotEditor"),
  { ssr: false, loading: () => <EditorSkeleton /> },
);

function EditorSkeleton() {
  return (
    <div className="w-full h-[340px] rounded-2xl bg-gray-100 animate-pulse flex items-center justify-center text-gray-400 text-sm">
      Loading preview…
    </div>
  );
}

// Hotspot type colours for the marker legend
const TYPE_COLORS: Record<string, string> = {
  info: "rgba(59,130,246,0.9)",
  link: "rgba(168,85,247,0.9)",
  audio: "rgba(34,197,94,0.9)",
  video: "rgba(239,68,68,0.9)",
  image: "rgba(245,158,11,0.9)",
  effect: "rgba(236,72,153,0.9)",
};

interface HotspotStepProps {
  tourType: string;
  mediaUrl?: string; // uploaded panorama / image URL
  hotspots: CreateHotspotData[];
  hotspotAudioFiles: (File | undefined)[];
  hotspotImageFiles: (File | undefined)[];
  hotspotVideoFiles: (File | undefined)[];
  editingHotspot: string | null;
  onSetEditingHotspot: (id: string | null) => void;
  onAdd: () => void;
  onRemove: (id: string) => void;
  onUpdate: (
    id: string,
    field: keyof CreateHotspotData,
    value: string | number | boolean,
  ) => void;
  onFileUpload: (
    idx: number,
    file: File,
    type: "audio" | "image" | "video",
  ) => void;
}

export function HotspotStep({
  tourType,
  mediaUrl,
  hotspots,
  hotspotAudioFiles,
  hotspotImageFiles,
  hotspotVideoFiles,
  editingHotspot,
  onSetEditingHotspot,
  onAdd,
  onRemove,
  onUpdate,
  onFileUpload,
}: HotspotStepProps) {
  const is360 = tourType === "360_image" || tourType === "360_video";
  const hasMedia = !!mediaUrl;

  // Build marker list for the visual editor
  const panoMarkers: PanoMarker[] = hotspots.map((h, i) => ({
    id: h.id ?? `local-${i}`,
    pitch: h.pitch ?? 0,
    yaw: h.yaw ?? 0,
    label: h.title || undefined,
    color: TYPE_COLORS[h.type] ?? undefined,
  }));

  const flatMarkers: FlatMarker[] = hotspots.map((h, i) => ({
    id: h.id ?? `local-${i}`,
    normalizedX: h.positionX ?? 0.5,
    normalizedY: h.positionY ?? 0.5,
    label: h.title || undefined,
    color: TYPE_COLORS[h.type] ?? undefined,
  }));

  // When user clicks the panorama to place / move a hotspot
  const handlePanoPlace = (pitch: number, yaw: number) => {
    if (editingHotspot) {
      onUpdate(editingHotspot, "pitch", pitch);
      onUpdate(editingHotspot, "yaw", yaw);
    } else if (hotspots.length > 0) {
      // place on the last hotspot if none is selected
      const last = hotspots[hotspots.length - 1];
      onUpdate(last.id!, "pitch", pitch);
      onUpdate(last.id!, "yaw", yaw);
      onSetEditingHotspot(last.id!);
    }
  };

  // When user clicks a flat image
  const handleFlatPlace = (nx: number, ny: number) => {
    if (editingHotspot) {
      onUpdate(editingHotspot, "positionX", nx);
      onUpdate(editingHotspot, "positionY", ny);
    } else if (hotspots.length > 0) {
      const last = hotspots[hotspots.length - 1];
      onUpdate(last.id!, "positionX", nx);
      onUpdate(last.id!, "positionY", ny);
      onSetEditingHotspot(last.id!);
    }
  };

  const placingLabel = editingHotspot
    ? `Click to reposition "${hotspots.find((h) => h.id === editingHotspot)?.title || "hotspot"}"`
    : hotspots.length > 0
      ? "Click to position the selected hotspot"
      : "Add a hotspot below, then click to place it";

  return (
    <div className="space-y-5">
      {/* ── Visual placement editor ────────────────────────────────── */}
      <Section
        title="Place Hotspots Visually"
        description={
          hasMedia
            ? is360
              ? "Drag to look around, then click anywhere to drop a hotspot at that exact spot."
              : "Click anywhere on the image to drop a hotspot at that exact position."
            : "Upload your media in Step 3 to enable visual placement."
        }
      >
        {hasMedia ? (
          is360 ? (
            <PanoramaHotspotEditor
              imageUrl={mediaUrl!}
              markers={panoMarkers}
              onPlace={handlePanoPlace}
              activeMarkerId={editingHotspot}
              placingLabel={placingLabel}
            />
          ) : (
            <FlatImageHotspotEditor
              imageUrl={mediaUrl!}
              markers={flatMarkers}
              onPlace={handleFlatPlace}
              activeMarkerId={editingHotspot}
              placingLabel={placingLabel}
            />
          )
        ) : (
          <div className="w-full h-[220px] rounded-2xl bg-gray-50 border-2 border-dashed border-gray-200 flex flex-col items-center justify-center gap-2 text-gray-400 text-sm">
            <MapPin className="w-8 h-8 text-gray-300" />
            <p className="font-medium text-gray-500">No media uploaded yet</p>
            <p className="text-xs text-gray-400">
              Go back to Step 3 to upload your tour image or video
            </p>
          </div>
        )}
      </Section>

      {/* ── Hotspot list ───────────────────────────────────────────── */}
      <Section
        title="Interactive Hotspots"
        description="Add clickable points of interest. Select one to edit its details, then click on the preview above to position it."
      >
        {hotspots.length === 0 ? (
          <div className="text-center py-10 border-2 border-dashed border-gray-100 rounded-xl">
            <div className="w-12 h-12 bg-gray-100 rounded-xl mx-auto flex items-center justify-center mb-3">
              <FileText className="w-6 h-6 text-gray-400" />
            </div>
            <p className="text-sm font-semibold text-gray-700">
              No hotspots yet
            </p>
            <p className="text-xs text-gray-400 mt-1 mb-4">
              Hotspots let visitors click to learn more, hear audio, or open
              links.
            </p>
            <button
              type="button"
              onClick={onAdd}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-900 text-white text-sm font-medium hover:bg-gray-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add First Hotspot
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {hotspots.map((hotspot, index) => {
              const isEditing = editingHotspot === hotspot.id;
              return (
                <div
                  key={hotspot.id ?? index}
                  className={`border rounded-xl overflow-hidden transition-colors ${
                    isEditing ? "border-gray-900 shadow-sm" : "border-gray-100"
                  }`}
                >
                  {/* Row header */}
                  <div
                    className={`flex items-center justify-between px-4 py-3 cursor-pointer transition-colors ${
                      isEditing ? "bg-gray-900 text-white" : "hover:bg-gray-50"
                    }`}
                    onClick={() =>
                      onSetEditingHotspot(isEditing ? null : hotspot.id!)
                    }
                  >
                    <div className="flex items-center gap-3">
                      {/* Colour dot */}
                      <span
                        className={`w-5 h-5 rounded-full border-2 border-white/60 shadow shrink-0 flex items-center justify-center text-[9px] font-bold text-white ${
                          hotspot.type === "info"
                            ? "bg-blue-500"
                            : hotspot.type === "link"
                              ? "bg-purple-500"
                              : hotspot.type === "audio"
                                ? "bg-green-500"
                                : hotspot.type === "video"
                                  ? "bg-red-500"
                                  : hotspot.type === "image"
                                    ? "bg-amber-500"
                                    : hotspot.type === "effect"
                                      ? "bg-pink-500"
                                      : "bg-gray-500"
                        }`}
                      >
                        {index + 1}
                      </span>
                      <span
                        className={`text-sm font-medium ${isEditing ? "text-white" : "text-gray-900"}`}
                      >
                        {hotspot.title || `Hotspot ${index + 1}`}
                      </span>
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full capitalize ${
                          isEditing
                            ? "bg-white/20 text-white"
                            : "text-gray-400 bg-gray-100"
                        }`}
                      >
                        {hotspot.type}
                      </span>

                      {/* Position badge */}
                      {is360 && (hotspot.pitch !== 0 || hotspot.yaw !== 0) && (
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded-full font-mono ${
                            isEditing
                              ? "bg-white/10 text-white/70"
                              : "bg-blue-50 text-blue-500"
                          }`}
                        >
                          {hotspot.pitch?.toFixed(0)}° /{" "}
                          {hotspot.yaw?.toFixed(0)}°
                        </span>
                      )}
                      {!is360 &&
                        (hotspot.positionX !== 0 ||
                          hotspot.positionY !== 0) && (
                          <span
                            className={`text-[10px] px-2 py-0.5 rounded-full font-mono ${
                              isEditing
                                ? "bg-white/10 text-white/70"
                                : "bg-blue-50 text-blue-500"
                            }`}
                          >
                            placed
                          </span>
                        )}
                    </div>

                    <div className="flex items-center gap-2">
                      {/* Click to place shortcut */}
                      {!isEditing && hasMedia && (
                        <span className="hidden sm:inline text-[10px] text-gray-400">
                          Select to reposition
                        </span>
                      )}
                      <button
                        type="button"
                        title="Remove hotspot"
                        aria-label="Remove hotspot"
                        onClick={(e) => {
                          e.stopPropagation();
                          onRemove(hotspot.id!);
                        }}
                        className={`w-7 h-7 flex items-center justify-center rounded-lg transition-colors ${
                          isEditing
                            ? "text-white/60 hover:text-white hover:bg-white/20"
                            : "text-gray-400 hover:text-red-500 hover:bg-red-50"
                        }`}
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Expanded editor */}
                  {isEditing && (
                    <div
                      className="border-t border-gray-100 p-5 space-y-4 bg-gray-50/50"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {/* Placement hint */}
                      {hasMedia && (
                        <div className="flex items-center gap-2 px-3 py-2 bg-blue-50 border border-blue-100 rounded-lg text-xs text-blue-700">
                          <MapPin className="w-3.5 h-3.5 shrink-0 text-blue-500" />
                          Click anywhere on the preview above to place this
                          hotspot exactly where you want it.
                        </div>
                      )}

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Field label="Title">
                          <input
                            value={hotspot.title}
                            onChange={(e) =>
                              onUpdate(hotspot.id!, "title", e.target.value)
                            }
                            placeholder="Hotspot title"
                            className={inputCls}
                          />
                        </Field>
                        <Field label="Type">
                          <Select
                            value={hotspot.type}
                            onChange={(v) => onUpdate(hotspot.id!, "type", v)}
                            options={[
                              { value: "info", label: "Info" },
                              { value: "link", label: "Link" },
                              { value: "audio", label: "Audio" },
                              { value: "image", label: "Image" },
                              { value: "video", label: "Video" },
                              { value: "effect", label: "Effect" },
                            ]}
                          />
                        </Field>
                      </div>

                      <Field label="Description">
                        <textarea
                          value={hotspot.description}
                          onChange={(e) =>
                            onUpdate(hotspot.id!, "description", e.target.value)
                          }
                          rows={2}
                          placeholder="What is this hotspot about?"
                          className={`${inputCls} resize-none`}
                        />
                      </Field>

                      {/* Position display — read-only, set by clicking the viewer */}
                      {is360 && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <Field label="Pitch (vertical °)">
                            <input
                              type="number"
                              step="0.1"
                              title="Pitch angle in degrees"
                              placeholder="0"
                              value={hotspot.pitch ?? 0}
                              onChange={(e) =>
                                onUpdate(
                                  hotspot.id!,
                                  "pitch",
                                  parseFloat(e.target.value) || 0,
                                )
                              }
                              className={`${inputCls} font-mono text-xs`}
                            />
                          </Field>
                          <Field label="Yaw (horizontal °)">
                            <input
                              type="number"
                              step="0.1"
                              title="Yaw angle in degrees"
                              placeholder="0"
                              value={hotspot.yaw ?? 0}
                              onChange={(e) =>
                                onUpdate(
                                  hotspot.id!,
                                  "yaw",
                                  parseFloat(e.target.value) || 0,
                                )
                              }
                              className={`${inputCls} font-mono text-xs`}
                            />
                          </Field>
                        </div>
                      )}

                      {hotspot.type === "link" && (
                        <Field label="Action URL">
                          <input
                            type="url"
                            value={hotspot.actionUrl}
                            onChange={(e) =>
                              onUpdate(hotspot.id!, "actionUrl", e.target.value)
                            }
                            placeholder="https://..."
                            className={inputCls}
                          />
                        </Field>
                      )}

                      {hotspot.type === "audio" && (
                        <Field label="Audio File">
                          <FileUpload
                            id={`hotspot-audio-${hotspot.id ?? index}`}
                            onFileSelect={(f) =>
                              onFileUpload(index, f, "audio")
                            }
                            accept="audio/*"
                            label="Upload audio file"
                            hint="MP3, WAV, OGG"
                            currentFile={hotspotAudioFiles[index]}
                            maxSizeMb={100}
                          />
                        </Field>
                      )}
                      {hotspot.type === "image" && (
                        <Field label="Image File">
                          <FileUpload
                            id={`hotspot-image-${hotspot.id ?? index}`}
                            onFileSelect={(f) =>
                              onFileUpload(index, f, "image")
                            }
                            accept="image/*"
                            label="Upload image"
                            hint="JPG, PNG, WebP"
                            currentFile={hotspotImageFiles[index]}
                            maxSizeMb={5}
                          />
                        </Field>
                      )}
                      {hotspot.type === "video" && (
                        <Field label="Video File">
                          <FileUpload
                            id={`hotspot-video-${hotspot.id ?? index}`}
                            onFileSelect={(f) =>
                              onFileUpload(index, f, "video")
                            }
                            accept="video/*"
                            label="Upload video"
                            hint="MP4, WebM"
                            currentFile={hotspotVideoFiles[index]}
                          />
                        </Field>
                      )}

                      <div
                        className="flex gap-5"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Checkbox
                          checked={hotspot.autoTrigger ?? false}
                          onChange={(v) =>
                            onUpdate(hotspot.id!, "autoTrigger", v)
                          }
                          label="Auto-trigger when in range"
                        />
                        <Checkbox
                          checked={hotspot.showOnHover ?? false}
                          onChange={(v) =>
                            onUpdate(hotspot.id!, "showOnHover", v)
                          }
                          label="Show on hover only"
                        />
                      </div>
                    </div>
                  )}
                </div>
              );
            })}

            <button
              type="button"
              onClick={onAdd}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-dashed border-gray-200 text-sm font-medium text-gray-500 hover:border-gray-400 hover:text-gray-900 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Another Hotspot
            </button>
          </div>
        )}
      </Section>
    </div>
  );
}
