"use client";

import { Plus, X, Volume2, Zap, MapPin, Music } from "lucide-react";
import dynamic from "next/dynamic";
import { Select, Checkbox } from "@/components/shared";
import { CreateAudioRegionData, CreateEffectData } from "@/types/tour";
import { Section, Field, FileUpload, inputCls } from "./shared";

const PanoramaHotspotEditor = dynamic(
  () => import("@/components/virtual-tour/PanoramaHotspotEditor"),
  { ssr: false, loading: () => <div className="w-full h-[300px] rounded-2xl bg-gray-100 animate-pulse" /> },
);
const FlatImageHotspotEditor = dynamic(
  () => import("@/components/virtual-tour/FlatImageHotspotEditor"),
  { ssr: false, loading: () => <div className="w-full h-[300px] rounded-2xl bg-gray-100 animate-pulse" /> },
);

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
                  title="Remove audio region"
                  aria-label="Remove audio region"
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
                <div className="border-t border-gray-100 p-5 space-y-4 bg-gray-50/50" onClick={(e) => e.stopPropagation()}>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Field label="Title">
                      <input
                        value={region.title}
                        onChange={(e) => onUpdate(region.id!, "title", e.target.value)}
                        placeholder="Audio region title"
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
                      id={`audio-region-${region.id ?? index}`}
                      onFileSelect={(f) => onFileUpload(index, f)}
                      accept="audio/*"
                      label="Upload audio file"
                      hint="MP3, WAV, OGG"
                      currentFile={audioFiles[index]}
                      maxSizeMb={100}
                    />
                  </Field>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <Field label="Volume (0–1)">
                      <input
                        type="number"
                        step="0.1"
                        min="0"
                        max="1"
                        title="Volume between 0 and 1"
                        placeholder="0.8"
                        value={region.volume}
                        onChange={(e) => onUpdate(region.id!, "volume", parseFloat(e.target.value) || 0)}
                        className={inputCls}
                      />
                    </Field>
                    <Field label="Radius (m)">
                      <input
                        type="number"
                        step="0.1"
                        title="Radius in metres"
                        placeholder="10"
                        value={region.radius}
                        onChange={(e) => onUpdate(region.id!, "radius", parseFloat(e.target.value) || 0)}
                        className={inputCls}
                      />
                    </Field>
                    <Field label="Fade In (s)">
                      <input
                        type="number"
                        step="0.1"
                        title="Fade in duration in seconds"
                        placeholder="0"
                        value={region.fadeInDuration}
                        onChange={(e) => onUpdate(region.id!, "fadeInDuration", parseFloat(e.target.value) || 0)}
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
  tourType: string;
  mediaUrl?: string;
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
  tourType,
  mediaUrl,
  effects,
  effectSoundFiles,
  editingEffect,
  onSetEditingEffect,
  onAdd,
  onRemove,
  onUpdate,
  onFileUpload,
}: EffectsSectionProps) {
  const is360 = tourType === "360_image" || tourType === "360_video";
  const hasMedia = !!mediaUrl;

  // Build marker list for visual editor
  const panoMarkers = effects.map((ef) => ({
    id: ef.id!,
    pitch: ef.pitch ?? 0,
    yaw: ef.yaw ?? 0,
    label: ef.effectName || ef.title || undefined,
    color: "rgba(236,72,153,0.9)",
  }));
  const flatMarkers = effects.map((ef) => ({
    id: ef.id!,
    normalizedX: ef.positionX ?? 0.5,
    normalizedY: ef.positionY ?? 0.5,
    label: ef.effectName || ef.title || undefined,
    color: "rgba(236,72,153,0.9)",
  }));

  const handlePanoPlace = (pitch: number, yaw: number) => {
    if (editingEffect) {
      onUpdate(editingEffect, "pitch", pitch);
      onUpdate(editingEffect, "yaw", yaw);
    } else if (effects.length > 0) {
      const last = effects[effects.length - 1];
      onUpdate(last.id!, "pitch", pitch);
      onUpdate(last.id!, "yaw", yaw);
      onSetEditingEffect(last.id!);
    }
  };

  const handleFlatPlace = (nx: number, ny: number) => {
    if (editingEffect) {
      onUpdate(editingEffect, "positionX", nx);
      onUpdate(editingEffect, "positionY", ny);
    } else if (effects.length > 0) {
      const last = effects[effects.length - 1];
      onUpdate(last.id!, "positionX", nx);
      onUpdate(last.id!, "positionY", ny);
      onSetEditingEffect(last.id!);
    }
  };

  const placingLabel = editingEffect
    ? `Click to position "${effects.find((e) => e.id === editingEffect)?.effectName || "effect"}"`
    : effects.length > 0
    ? "Select an effect below, then click to place it"
    : "Add an effect below, then click to place it";

  return (
    <Section
      title="Special Effects"
      description="Add visual or sound effects triggered by visitor actions. Optional."
    >
      {/* Visual placement editor — shown when there are effects and media is available */}
      {hasMedia && effects.length > 0 && (
        <div className="mb-5">
          {is360 ? (
            <PanoramaHotspotEditor
              imageUrl={mediaUrl!}
              markers={panoMarkers}
              onPlace={handlePanoPlace}
              activeMarkerId={editingEffect}
              placingLabel={placingLabel}
            />
          ) : (
            <FlatImageHotspotEditor
              imageUrl={mediaUrl!}
              markers={flatMarkers}
              onPlace={handleFlatPlace}
              activeMarkerId={editingEffect}
              placingLabel={placingLabel}
            />
          )}
        </div>
      )}

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
              className={`border rounded-xl overflow-hidden transition-colors ${
                editingEffect === effect.id ? "border-gray-900" : "border-gray-100"
              }`}
            >
              <div
                className={`flex items-center justify-between px-4 py-3 cursor-pointer transition-colors ${
                  editingEffect === effect.id ? "bg-gray-900 text-white" : "hover:bg-gray-50"
                }`}
                onClick={() =>
                  onSetEditingEffect(editingEffect === effect.id ? null : effect.id!)
                }
              >
                <div className="flex items-center gap-3">
                  <Zap className={`w-4 h-4 ${editingEffect === effect.id ? "text-pink-400" : "text-gray-400"}`} />
                  <span className={`text-sm font-medium ${editingEffect === effect.id ? "text-white" : "text-gray-900"}`}>
                    {effect.effectName || `Effect ${index + 1}`}
                  </span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                    editingEffect === effect.id ? "bg-white/20 text-white" : "text-gray-400 bg-gray-100"
                  }`}>
                    {effect.effectType}
                  </span>

                  {/* Position badge */}
                  {is360 && (effect.pitch !== 0 || effect.yaw !== 0) && (
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono ${
                      editingEffect === effect.id ? "bg-white/10 text-white/70" : "bg-pink-50 text-pink-500"
                    }`}>
                      {effect.pitch?.toFixed(0)}°/{effect.yaw?.toFixed(0)}°
                    </span>
                  )}
                  {!is360 && (effect.positionX !== 0 || effect.positionY !== 0) && (
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono ${
                      editingEffect === effect.id ? "bg-white/10 text-white/70" : "bg-pink-50 text-pink-500"
                    }`}>
                      placed
                    </span>
                  )}
                </div>

                <button
                  type="button"
                  title="Remove effect"
                  aria-label="Remove effect"
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemove(effect.id!);
                  }}
                  className={`w-7 h-7 flex items-center justify-center rounded-lg transition-colors ${
                    editingEffect === effect.id
                      ? "text-white/60 hover:text-white hover:bg-white/20"
                      : "text-gray-400 hover:text-red-500 hover:bg-red-50"
                  }`}
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              {editingEffect === effect.id && (
                <div className="border-t border-gray-100 p-5 space-y-4 bg-gray-50/50" onClick={(e) => e.stopPropagation()}>
                  {/* Placement hint */}
                  {hasMedia && (
                    <div className="flex items-center gap-2 px-3 py-2 bg-pink-50 border border-pink-100 rounded-lg text-xs text-pink-700">
                      <MapPin className="w-3.5 h-3.5 shrink-0 text-pink-400" />
                      Click anywhere on the preview above to place this effect exactly where you want it.
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                        title="Effect intensity"
                        value={effect.intensity}
                        onChange={(e) => onUpdate(effect.id!, "intensity", parseFloat(e.target.value) || 0)}
                        className="w-full mt-2"
                      />
                    </Field>
                  </div>

                  {/* Manual position override for 360° */}
                  {is360 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Field label="Pitch (vertical °)">
                        <input
                          type="number"
                          step="0.1"
                          title="Pitch angle in degrees"
                          placeholder="0"
                          value={effect.pitch ?? 0}
                          onChange={(e) => onUpdate(effect.id!, "pitch", parseFloat(e.target.value) || 0)}
                          className={`${inputCls} font-mono text-xs`}
                        />
                      </Field>
                      <Field label="Yaw (horizontal °)">
                        <input
                          type="number"
                          step="0.1"
                          title="Yaw angle in degrees"
                          placeholder="0"
                          value={effect.yaw ?? 0}
                          onChange={(e) => onUpdate(effect.id!, "yaw", parseFloat(e.target.value) || 0)}
                          className={`${inputCls} font-mono text-xs`}
                        />
                      </Field>
                    </div>
                  )}

                  {effect.effectType === "sound" && (
                    <Field label="Sound File">
                      <FileUpload
                        id={`effect-sound-${effect.id ?? index}`}
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

// ─── Background Audio ─────────────────────────────────────────────────────────

interface BackgroundAudioSectionProps {
  backgroundAudioFile: File | null;
  backgroundAudioVolume: number;
  onFileSelect: (file: File | null) => void;
  onVolumeChange: (vol: number) => void;
}

function BackgroundAudioSection({
  backgroundAudioFile,
  backgroundAudioVolume,
  onFileSelect,
  onVolumeChange,
}: BackgroundAudioSectionProps) {
  return (
    <Section
      title="Background Audio"
      description="Optional ambient audio that plays in the background throughout the tour. Can be muted by visitors."
    >
      <div className="space-y-4">
        <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-xl border border-blue-100">
          <Music className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
          <p className="text-xs text-blue-700">
            Background audio loops automatically and includes a mute/unmute button for visitors.
          </p>
        </div>
        <Field label="Audio File">
          <FileUpload
            id="bg-audio-file"
            onFileSelect={(f) => onFileSelect(f ?? null)}
            accept="audio/*"
            label={backgroundAudioFile ? backgroundAudioFile.name : "Upload background audio"}
            hint="MP3, WAV, OGG — max 20 MB"
            currentFile={backgroundAudioFile ?? undefined}
            maxSizeMb={20}
          />
          {backgroundAudioFile && (
            <button
              type="button"
              onClick={() => onFileSelect(null)}
              className="mt-2 text-xs text-gray-400 hover:text-red-500 underline underline-offset-2 transition-colors"
            >
              Remove audio
            </button>
          )}
        </Field>
        {backgroundAudioFile && (
          <Field label={`Volume: ${Math.round(backgroundAudioVolume * 100)}%`}>
            <input
              type="range"
              min={0}
              max={1}
              step={0.05}
              value={backgroundAudioVolume}
              onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
              title="Background audio volume"
              className="w-full accent-gray-900"
            />
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>Quiet</span>
              <span>Loud</span>
            </div>
          </Field>
        )}
      </div>
    </Section>
  );
}

// ─── Combined export ──────────────────────────────────────────────────────────

export interface AudioEffectsStepProps {
  tourType: string;
  mediaUrl?: string;

  backgroundAudioFile: File | null;
  backgroundAudioVolume: number;
  onBackgroundAudioFileSelect: (file: File | null) => void;
  onBackgroundAudioVolumeChange: (vol: number) => void;

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
  tourType, mediaUrl,
  backgroundAudioFile, backgroundAudioVolume,
  onBackgroundAudioFileSelect, onBackgroundAudioVolumeChange,
  audioRegions, audioFiles, editingAudio, onSetEditingAudio,
  onAddAudioRegion, onRemoveAudioRegion, onUpdateAudioRegion, onAudioFileUpload,
  effects, effectSoundFiles, editingEffect, onSetEditingEffect,
  onAddEffect, onRemoveEffect, onUpdateEffect, onEffectFileUpload,
}: AudioEffectsStepProps) {
  return (
    <div className="space-y-5">
      <BackgroundAudioSection
        backgroundAudioFile={backgroundAudioFile}
        backgroundAudioVolume={backgroundAudioVolume}
        onFileSelect={onBackgroundAudioFileSelect}
        onVolumeChange={onBackgroundAudioVolumeChange}
      />
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
        tourType={tourType}
        mediaUrl={mediaUrl}
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
