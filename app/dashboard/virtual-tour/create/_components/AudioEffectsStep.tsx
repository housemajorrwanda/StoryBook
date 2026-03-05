"use client";

import { Plus, X, Volume2, Zap } from "lucide-react";
import { Select, Checkbox } from "@/components/shared";
import { CreateAudioRegionData, CreateEffectData } from "@/types/tour";
import { Section, Field, FileUpload, inputCls } from "./shared";

// ─── Audio Regions ────────────────────────────────────────────────────────────

interface AudioRegionsSectionProps {
  audioRegions: CreateAudioRegionData[];
  audioFiles: (File | undefined)[];
  editingAudio: string | null;
  onSetEditingAudio: (id: string | null) => void;
  onAdd: () => void;
  onRemove: (id: string) => void;
  onUpdate: (id: string, field: keyof CreateAudioRegionData, value: string | number | boolean) => void;
  onFileUpload: (idx: number, file: File) => void;
}

function AudioRegionsSection({
  audioRegions,
  audioFiles,
  editingAudio,
  onSetEditingAudio,
  onAdd,
  onRemove,
  onUpdate,
  onFileUpload,
}: AudioRegionsSectionProps) {
  return (
    <Section
      title="Spatial Audio Regions"
      description="Add ambient or positional audio that plays when visitors enter an area. Optional."
    >
      {audioRegions.length === 0 ? (
        <div className="text-center py-8 border-2 border-dashed border-gray-100 rounded-xl">
          <Volume2 className="w-8 h-8 text-gray-300 mx-auto mb-2" />
          <p className="text-sm font-semibold text-gray-700">No audio regions</p>
          <p className="text-xs text-gray-400 mt-1 mb-4">
            Add spatial audio that plays as visitors explore.
          </p>
          <button
            type="button"
            onClick={onAdd}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-900 text-white text-sm font-medium hover:bg-gray-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Audio Region
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {audioRegions.map((region, index) => (
            <div
              key={region.id ?? index}
              className="border border-gray-100 rounded-xl overflow-hidden"
            >
              <div
                className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-gray-50"
                onClick={() =>
                  onSetEditingAudio(editingAudio === region.id ? null : region.id!)
                }
              >
                <div className="flex items-center gap-3">
                  <Volume2 className="w-4 h-4 text-gray-400" />
                  <span className="text-sm font-medium text-gray-900">{region.title}</span>
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemove(region.id!);
                  }}
                  className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              {editingAudio === region.id && (
                <div className="border-t border-gray-100 p-5 space-y-4 bg-gray-50/50">
                  <div className="grid grid-cols-2 gap-4">
                    <Field label="Title">
                      <input
                        value={region.title}
                        onChange={(e) => onUpdate(region.id!, "title", e.target.value)}
                        className={inputCls}
                      />
                    </Field>
                    <Field label="Region Type">
                      <Select
                        value={region.regionType}
                        onChange={(v) => onUpdate(region.id!, "regionType", v)}
                        options={[
                          { value: "sphere", label: "Sphere" },
                          { value: "box", label: "Box" },
                        ]}
                      />
                    </Field>
                  </div>

                  <Field label="Audio File">
                    <FileUpload
                      onFileSelect={(f) => onFileUpload(index, f)}
                      accept="audio/*"
                      label="Upload audio file"
                      hint="MP3, WAV, OGG"
                      currentFile={audioFiles[index]}
                      maxSizeMb={100}
                    />
                  </Field>

                  <div className="grid grid-cols-3 gap-4">
                    <Field label="Volume (0–1)">
                      <input
                        type="number"
                        step="0.1"
                        min="0"
                        max="1"
                        value={region.volume}
                        onChange={(e) => onUpdate(region.id!, "volume", parseFloat(e.target.value))}
                        className={inputCls}
                      />
                    </Field>
                    <Field label="Radius (m)">
                      <input
                        type="number"
                        step="0.1"
                        value={region.radius}
                        onChange={(e) => onUpdate(region.id!, "radius", parseFloat(e.target.value))}
                        className={inputCls}
                      />
                    </Field>
                    <Field label="Fade In (s)">
                      <input
                        type="number"
                        step="0.1"
                        value={region.fadeInDuration}
                        onChange={(e) => onUpdate(region.id!, "fadeInDuration", parseFloat(e.target.value))}
                        className={inputCls}
                      />
                    </Field>
                  </div>

                  <div className="flex flex-wrap gap-5">
                    <Checkbox
                      checked={region.spatialAudio ?? false}
                      onChange={(v) => onUpdate(region.id!, "spatialAudio", v)}
                      label="Spatial Audio"
                      description="3D HRTF positioning"
                    />
                    <Checkbox
                      checked={region.autoPlay ?? false}
                      onChange={(v) => onUpdate(region.id!, "autoPlay", v)}
                      label="Auto-play on enter"
                    />
                    <Checkbox
                      checked={region.loop ?? false}
                      onChange={(v) => onUpdate(region.id!, "loop", v)}
                      label="Loop"
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
            Add Another Audio Region
          </button>
        </div>
      )}
    </Section>
  );
}

// ─── Effects ──────────────────────────────────────────────────────────────────

interface EffectsSectionProps {
  effects: CreateEffectData[];
  effectSoundFiles: (File | undefined)[];
  editingEffect: string | null;
  onSetEditingEffect: (id: string | null) => void;
  onAdd: () => void;
  onRemove: (id: string) => void;
  onUpdate: (id: string, field: keyof CreateEffectData, value: string | number | boolean) => void;
  onFileUpload: (idx: number, file: File) => void;
}

function EffectsSection({
  effects,
  effectSoundFiles,
  editingEffect,
  onSetEditingEffect,
  onAdd,
  onRemove,
  onUpdate,
  onFileUpload,
}: EffectsSectionProps) {
  return (
    <Section
      title="Special Effects"
      description="Add visual or sound effects triggered by visitor actions. Optional."
    >
      {effects.length === 0 ? (
        <div className="text-center py-8 border-2 border-dashed border-gray-100 rounded-xl">
          <Zap className="w-8 h-8 text-gray-300 mx-auto mb-2" />
          <p className="text-sm font-semibold text-gray-700">No effects yet</p>
          <p className="text-xs text-gray-400 mt-1 mb-4">
            Add fog, particles, animations and more.
          </p>
          <button
            type="button"
            onClick={onAdd}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-900 text-white text-sm font-medium hover:bg-gray-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Effect
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {effects.map((effect, index) => (
            <div
              key={effect.id ?? index}
              className="border border-gray-100 rounded-xl overflow-hidden"
            >
              <div
                className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-gray-50"
                onClick={() =>
                  onSetEditingEffect(editingEffect === effect.id ? null : effect.id!)
                }
              >
                <div className="flex items-center gap-3">
                  <Zap className="w-4 h-4 text-gray-400" />
                  <span className="text-sm font-medium text-gray-900">
                    {effect.effectName || `Effect ${index + 1}`}
                  </span>
                  <span className="text-[10px] text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                    {effect.effectType}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemove(effect.id!);
                  }}
                  className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              {editingEffect === effect.id && (
                <div className="border-t border-gray-100 p-5 space-y-4 bg-gray-50/50">
                  <div className="grid grid-cols-2 gap-4">
                    <Field label="Effect Type">
                      <Select
                        value={effect.effectType}
                        onChange={(v) => onUpdate(effect.id!, "effectType", v)}
                        options={[
                          { value: "visual", label: "Visual" },
                          { value: "sound", label: "Sound" },
                          { value: "particle", label: "Particle" },
                          { value: "animation", label: "Animation" },
                        ]}
                      />
                    </Field>
                    <Field label="Trigger">
                      <Select
                        value={effect.triggerType}
                        onChange={(v) => onUpdate(effect.id!, "triggerType", v)}
                        options={[
                          { value: "on_enter", label: "On Enter" },
                          { value: "on_look", label: "On Look" },
                          { value: "on_click", label: "On Click" },
                          { value: "on_timer", label: "On Timer" },
                          { value: "always", label: "Always" },
                        ]}
                      />
                    </Field>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <Field label="Effect Name">
                      <input
                        value={effect.effectName}
                        onChange={(e) => onUpdate(effect.id!, "effectName", e.target.value)}
                        placeholder="e.g., fog, rain, sparkle"
                        className={inputCls}
                      />
                    </Field>
                    <Field label={`Intensity: ${effect.intensity}`}>
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.1"
                        value={effect.intensity}
                        onChange={(e) => onUpdate(effect.id!, "intensity", parseFloat(e.target.value))}
                        className="w-full mt-2"
                      />
                    </Field>
                  </div>

                  {effect.effectType === "sound" && (
                    <Field label="Sound File">
                      <FileUpload
                        onFileSelect={(f) => onFileUpload(index, f)}
                        accept="audio/*"
                        label="Upload sound file"
                        hint="MP3, WAV, OGG"
                        currentFile={effectSoundFiles[index]}
                        maxSizeMb={100}
                      />
                    </Field>
                  )}
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
            Add Another Effect
          </button>
        </div>
      )}
    </Section>
  );
}

// ─── Combined export ──────────────────────────────────────────────────────────

export interface AudioEffectsStepProps {
  audioRegions: CreateAudioRegionData[];
  audioFiles: (File | undefined)[];
  editingAudio: string | null;
  onSetEditingAudio: (id: string | null) => void;
  onAddAudioRegion: () => void;
  onRemoveAudioRegion: (id: string) => void;
  onUpdateAudioRegion: (id: string, field: keyof CreateAudioRegionData, value: string | number | boolean) => void;
  onAudioFileUpload: (idx: number, file: File) => void;

  effects: CreateEffectData[];
  effectSoundFiles: (File | undefined)[];
  editingEffect: string | null;
  onSetEditingEffect: (id: string | null) => void;
  onAddEffect: () => void;
  onRemoveEffect: (id: string) => void;
  onUpdateEffect: (id: string, field: keyof CreateEffectData, value: string | number | boolean) => void;
  onEffectFileUpload: (idx: number, file: File) => void;
}

export function AudioEffectsStep({
  audioRegions, audioFiles, editingAudio, onSetEditingAudio,
  onAddAudioRegion, onRemoveAudioRegion, onUpdateAudioRegion, onAudioFileUpload,
  effects, effectSoundFiles, editingEffect, onSetEditingEffect,
  onAddEffect, onRemoveEffect, onUpdateEffect, onEffectFileUpload,
}: AudioEffectsStepProps) {
  return (
    <div className="space-y-5">
      <AudioRegionsSection
        audioRegions={audioRegions}
        audioFiles={audioFiles}
        editingAudio={editingAudio}
        onSetEditingAudio={onSetEditingAudio}
        onAdd={onAddAudioRegion}
        onRemove={onRemoveAudioRegion}
        onUpdate={onUpdateAudioRegion}
        onFileUpload={onAudioFileUpload}
      />
      <EffectsSection
        effects={effects}
        effectSoundFiles={effectSoundFiles}
        editingEffect={editingEffect}
        onSetEditingEffect={onSetEditingEffect}
        onAdd={onAddEffect}
        onRemove={onRemoveEffect}
        onUpdate={onUpdateEffect}
        onFileUpload={onEffectFileUpload}
      />
    </div>
  );
}
