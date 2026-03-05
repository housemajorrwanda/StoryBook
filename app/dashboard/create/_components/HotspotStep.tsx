"use client";

import { Plus, X, FileText } from "lucide-react";
import { Select, Checkbox } from "@/components/shared";
import { CreateHotspotData } from "@/types/tour";
import { Section, Field, FileUpload, inputCls } from "./shared";

interface HotspotStepProps {
  hotspots: CreateHotspotData[];
  hotspotAudioFiles: (File | undefined)[];
  hotspotImageFiles: (File | undefined)[];
  hotspotVideoFiles: (File | undefined)[];
  editingHotspot: string | null;
  onSetEditingHotspot: (id: string | null) => void;
  onAdd: () => void;
  onRemove: (id: string) => void;
  onUpdate: (id: string, field: keyof CreateHotspotData, value: string | number | boolean) => void;
  onFileUpload: (idx: number, file: File, type: "audio" | "image" | "video") => void;
}

export function HotspotStep({
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
  return (
    <Section
      title="Interactive Hotspots"
      description="Add clickable points of interest inside your tour. These are optional — you can always add them later."
    >
      {hotspots.length === 0 ? (
        <div className="text-center py-10 border-2 border-dashed border-gray-100 rounded-xl">
          <div className="w-12 h-12 bg-gray-100 rounded-xl mx-auto flex items-center justify-center mb-3">
            <FileText className="w-6 h-6 text-gray-400" />
          </div>
          <p className="text-sm font-semibold text-gray-700">No hotspots yet</p>
          <p className="text-xs text-gray-400 mt-1 mb-4">
            Hotspots let visitors click to learn more, hear audio, or open links.
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
          {hotspots.map((hotspot, index) => (
            <div
              key={hotspot.id ?? index}
              className="border border-gray-100 rounded-xl overflow-hidden"
            >
              <div
                className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() =>
                  onSetEditingHotspot(editingHotspot === hotspot.id ? null : hotspot.id!)
                }
              >
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-lg bg-gray-100 text-gray-500 text-xs font-bold flex items-center justify-center shrink-0">
                    {index + 1}
                  </span>
                  <span className="text-sm font-medium text-gray-900">
                    {hotspot.title || `Hotspot ${index + 1}`}
                  </span>
                  <span className="text-[10px] text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full capitalize">
                    {hotspot.type}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemove(hotspot.id!);
                  }}
                  className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              {editingHotspot === hotspot.id && (
                <div className="border-t border-gray-100 p-5 space-y-4 bg-gray-50/50">
                  <div className="grid grid-cols-2 gap-4">
                    <Field label="Title">
                      <input
                        value={hotspot.title}
                        onChange={(e) => onUpdate(hotspot.id!, "title", e.target.value)}
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
                      onChange={(e) => onUpdate(hotspot.id!, "description", e.target.value)}
                      rows={2}
                      placeholder="What is this hotspot about?"
                      className={`${inputCls} resize-none`}
                    />
                  </Field>

                  <div className="grid grid-cols-2 gap-4">
                    <Field label="Pitch (vertical °)">
                      <input
                        type="number"
                        step="0.1"
                        value={hotspot.pitch}
                        onChange={(e) => onUpdate(hotspot.id!, "pitch", parseFloat(e.target.value))}
                        className={inputCls}
                      />
                    </Field>
                    <Field label="Yaw (horizontal °)">
                      <input
                        type="number"
                        step="0.1"
                        value={hotspot.yaw}
                        onChange={(e) => onUpdate(hotspot.id!, "yaw", parseFloat(e.target.value))}
                        className={inputCls}
                      />
                    </Field>
                  </div>

                  {hotspot.type === "link" && (
                    <Field label="Action URL">
                      <input
                        type="url"
                        value={hotspot.actionUrl}
                        onChange={(e) => onUpdate(hotspot.id!, "actionUrl", e.target.value)}
                        placeholder="https://..."
                        className={inputCls}
                      />
                    </Field>
                  )}

                  {hotspot.type === "audio" && (
                    <Field label="Audio File">
                      <FileUpload
                        onFileSelect={(f) => onFileUpload(index, f, "audio")}
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
                        onFileSelect={(f) => onFileUpload(index, f, "image")}
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
                        onFileSelect={(f) => onFileUpload(index, f, "video")}
                        accept="video/*"
                        label="Upload video"
                        hint="MP4, WebM"
                        currentFile={hotspotVideoFiles[index]}
                      />
                    </Field>
                  )}

                  <div className="flex gap-5">
                    <Checkbox
                      checked={hotspot.autoTrigger ?? false}
                      onChange={(v) => onUpdate(hotspot.id!, "autoTrigger", v)}
                      label="Auto-trigger when in range"
                    />
                    <Checkbox
                      checked={hotspot.showOnHover ?? false}
                      onChange={(v) => onUpdate(hotspot.id!, "showOnHover", v)}
                      label="Show on hover only"
                    />
                  </div>
                </div>
              )}
            </div>
          ))}

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
  );
}
