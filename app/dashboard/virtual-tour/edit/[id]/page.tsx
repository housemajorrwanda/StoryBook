"use client";

import { use, useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Check, ChevronLeft, Eye, Loader2, AlertTriangle } from "lucide-react";
import {
  useVirtualTour,
  useUpdateVirtualTour,
  useCreateHotspot,
  useUpdateHotspot,
  useDeleteHotspot,
  useCreateAudioRegion,
  useUpdateAudioRegion,
  useDeleteAudioRegion,
  useCreateEffect,
  useUpdateEffect,
  useDeleteEffect,
} from "@/hooks/virtual-tour/use-virtual-tours";
import {
  CreateVirtualTourRequest,
  CreateHotspotData,
  CreateAudioRegionData,
  CreateEffectData,
  VirtualTourHotspot,
  VirtualTourAudioRegion,
  VirtualTourEffect,
} from "@/types/tour";
import { BasicInfoStep } from "../../create/_components/TourSteps";
import { HotspotStep } from "../../create/_components/HotspotStep";
import { AudioEffectsStep } from "../../create/_components/AudioEffectsStep";

// ─── helpers ──────────────────────────────────────────────────────────────────

function hotspotToCreateData(h: VirtualTourHotspot): CreateHotspotData & { _savedId: number } {
  return {
    _savedId: h.id,
    id: String(h.id),
    type: h.type,
    title: h.title ?? "",
    description: h.description ?? "",
    positionX: h.positionX ?? 0,
    positionY: h.positionY ?? 0,
    positionZ: h.positionZ ?? 0,
    pitch: h.pitch ?? 0,
    yaw: h.yaw ?? 0,
    icon: h.icon ?? "",
    actionUrl: h.actionUrl ?? "",
    color: h.color ?? "",
    size: h.size ?? 1,
    triggerDistance: h.triggerDistance ?? 5,
    autoTrigger: h.autoTrigger,
    showOnHover: h.showOnHover,
    order: h.order,
  };
}

function audioToCreateData(a: VirtualTourAudioRegion): CreateAudioRegionData & { _savedId: number } {
  return {
    _savedId: a.id,
    id: String(a.id),
    title: a.title ?? "",
    description: a.description ?? "",
    regionType: a.regionType,
    centerX: a.centerX,
    centerY: a.centerY,
    centerZ: a.centerZ,
    radius: a.radius ?? 10,
    width: a.width ?? 0,
    height: a.height ?? 0,
    depth: a.depth ?? 0,
    volume: a.volume,
    loop: a.loop,
    fadeInDuration: a.fadeInDuration ?? 0,
    fadeOutDuration: a.fadeOutDuration ?? 0,
    spatialAudio: a.spatialAudio,
    minDistance: a.minDistance ?? 1,
    maxDistance: a.maxDistance ?? 50,
    autoPlay: a.autoPlay,
    playOnce: a.playOnce,
    order: a.order,
  };
}

function effectToCreateData(e: VirtualTourEffect): CreateEffectData & { _savedId: number } {
  return {
    _savedId: e.id,
    id: String(e.id),
    effectType: e.effectType,
    effectName: e.effectName,
    triggerType: e.triggerType,
    positionX: e.positionX ?? 0,
    positionY: e.positionY ?? 0,
    positionZ: e.positionZ ?? 0,
    pitch: e.pitch ?? 0,
    yaw: e.yaw ?? 0,
    triggerDistance: e.triggerDistance ?? 5,
    triggerDelay: e.triggerDelay,
    intensity: e.intensity,
    duration: e.duration ?? 0,
    color: e.color ?? "",
    particleCount: e.particleCount ?? 0,
    opacity: e.opacity,
    size: e.size,
    animationType: e.animationType ?? "",
    animationSpeed: e.animationSpeed,
    title: e.title ?? "",
    description: e.description ?? "",
    order: e.order,
  };
}

// Steps that are available in edit mode
const EDIT_STEPS = [
  { id: 1, label: "Basic Info" },
  { id: 2, label: "Hotspots" },
  { id: 3, label: "Audio & Effects" },
];

function EditStepIndicator({ current }: { current: number }) {
  return (
    <div className="flex items-center gap-0">
      {EDIT_STEPS.map((step, i) => {
        const done = current > step.id;
        const active = current === step.id;
        return (
          <div key={step.id} className="flex items-center">
            <div className="flex flex-col items-center gap-1.5">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                done ? "bg-gray-900 text-white" : active ? "bg-gray-900 text-white ring-4 ring-gray-900/10" : "bg-gray-100 text-gray-400"
              }`}>
                {done ? <Check className="w-3.5 h-3.5" /> : step.id}
              </div>
              <span className={`text-[10px] font-medium whitespace-nowrap ${active ? "text-gray-900" : "text-gray-400"}`}>
                {step.label}
              </span>
            </div>
            {i < EDIT_STEPS.length - 1 && (
              <div className={`h-px w-10 mx-1 mb-4 ${done ? "bg-gray-900" : "bg-gray-200"}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function EditTourPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const tourId = parseInt(id);
  const router = useRouter();

  const { data: tour, isLoading, error } = useVirtualTour(tourId);

  // ── local state ──
  const [step, setStep] = useState(1);
  const [initialised, setInitialised] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [formData, setFormData] = useState<CreateVirtualTourRequest>({
    title: "", description: "", location: "",
    tourType: "360_image", embedUrl: "", status: "draft", isPublished: false,
  });

  // Hotspots — carry _savedId so we know whether to create or update
  const [hotspots, setHotspots] = useState<(CreateHotspotData & { _savedId?: number })[]>([]);
  const [audioRegions, setAudioRegions] = useState<(CreateAudioRegionData & { _savedId?: number })[]>([]);
  const [effects, setEffects] = useState<(CreateEffectData & { _savedId?: number })[]>([]);

  // File states (new uploads only — existing URLs stay on the server)
  const [hotspotAudioFiles, setHotspotAudioFiles] = useState<(File | undefined)[]>([]);
  const [hotspotImageFiles, setHotspotImageFiles] = useState<(File | undefined)[]>([]);
  const [hotspotVideoFiles, setHotspotVideoFiles] = useState<(File | undefined)[]>([]);
  const [audioFiles, setAudioFiles] = useState<(File | undefined)[]>([]);
  const [effectSoundFiles, setEffectSoundFiles] = useState<(File | undefined)[]>([]);

  const [editingHotspot, setEditingHotspot] = useState<string | null>(null);
  const [editingAudio, setEditingAudio] = useState<string | null>(null);
  const [editingEffect, setEditingEffect] = useState<string | null>(null);

  // Track which _savedIds were deleted so we can call DELETE
  const [deletedHotspotIds, setDeletedHotspotIds] = useState<number[]>([]);
  const [deletedAudioIds, setDeletedAudioIds] = useState<number[]>([]);
  const [deletedEffectIds, setDeletedEffectIds] = useState<number[]>([]);

  // ── mutations ──
  const updateTour = useUpdateVirtualTour();
  const createHotspot = useCreateHotspot(tourId);
  const updateHotspot = useUpdateHotspot(tourId);
  const deleteHotspot = useDeleteHotspot(tourId);
  const createAudioRegion = useCreateAudioRegion(tourId);
  const updateAudioRegion = useUpdateAudioRegion(tourId);
  const deleteAudioRegion = useDeleteAudioRegion(tourId);
  const createEffect = useCreateEffect(tourId);
  const updateEffect = useUpdateEffect(tourId);
  const deleteEffect = useDeleteEffect(tourId);

  // ── initialise form from loaded tour ──
  useEffect(() => {
    if (!tour || initialised) return;
    setFormData({
      title: tour.title,
      description: tour.description ?? "",
      location: tour.location,
      tourType: tour.tourType,
      embedUrl: tour.embedUrl ?? "",
      status: tour.status,
      isPublished: tour.isPublished,
    });
    setHotspots(tour.hotspots.map(hotspotToCreateData));
    setAudioRegions(tour.audioRegions.map(audioToCreateData));
    setEffects(tour.effects.map(effectToCreateData));
    setHotspotAudioFiles(new Array(tour.hotspots.length).fill(undefined));
    setHotspotImageFiles(new Array(tour.hotspots.length).fill(undefined));
    setHotspotVideoFiles(new Array(tour.hotspots.length).fill(undefined));
    setAudioFiles(new Array(tour.audioRegions.length).fill(undefined));
    setEffectSoundFiles(new Array(tour.effects.length).fill(undefined));
    setInitialised(true);
  }, [tour, initialised]);

  // ── hotspot management ──
  const addHotspot = useCallback(() => {
    const newId = `new-${Date.now()}`;
    setHotspots((p) => [...p, {
      id: newId, type: "info", title: `Hotspot ${p.length + 1}`,
      description: "", positionX: 0, positionY: 0, positionZ: 0,
      pitch: 0, yaw: 0, icon: "", actionUrl: "", color: "", size: 1,
      triggerDistance: 5, autoTrigger: false, showOnHover: false, order: p.length,
    }]);
    setHotspotAudioFiles((p) => [...p, undefined]);
    setHotspotImageFiles((p) => [...p, undefined]);
    setHotspotVideoFiles((p) => [...p, undefined]);
    setEditingHotspot(newId);
  }, []);

  const removeHotspot = useCallback((id: string) => {
    setHotspots((prev) => {
      const h = prev.find((x) => x.id === id);
      if (h?._savedId) setDeletedHotspotIds((d) => [...d, h._savedId!]);
      return prev.filter((x) => x.id !== id);
    });
  }, []);

  const updateHotspotField = useCallback((id: string, field: keyof CreateHotspotData, value: string | number | boolean) => {
    setHotspots((prev) => prev.map((h) => h.id === id ? { ...h, [field]: value } : h));
  }, []);

  // ── audio region management ──
  const addAudioRegion = useCallback(() => {
    const newId = `new-${Date.now()}`;
    setAudioRegions((p) => [...p, {
      id: newId, title: `Audio Region ${p.length + 1}`, description: "",
      regionType: "sphere", centerX: 0, centerY: 0, centerZ: 0,
      radius: 10, width: 0, height: 0, depth: 0, volume: 0.8, loop: true,
      fadeInDuration: 0, fadeOutDuration: 0, spatialAudio: true,
      minDistance: 1, maxDistance: 50, autoPlay: true, playOnce: false, order: p.length,
    }]);
    setAudioFiles((p) => [...p, undefined]);
    setEditingAudio(newId);
  }, []);

  const removeAudioRegion = useCallback((id: string) => {
    setAudioRegions((prev) => {
      const a = prev.find((x) => x.id === id);
      if (a?._savedId) setDeletedAudioIds((d) => [...d, a._savedId!]);
      return prev.filter((x) => x.id !== id);
    });
  }, []);

  const updateAudioRegionField = useCallback((id: string, field: keyof CreateAudioRegionData, value: string | number | boolean) => {
    setAudioRegions((prev) => prev.map((a) => a.id === id ? { ...a, [field]: value } : a));
  }, []);

  // ── effect management ──
  const addEffect = useCallback(() => {
    const newId = `new-${Date.now()}`;
    setEffects((p) => [...p, {
      id: newId, effectType: "visual", effectName: "fog", triggerType: "on_enter",
      positionX: 0, positionY: 0, positionZ: 0, pitch: 0, yaw: 0,
      triggerDistance: 5, triggerDelay: 0, intensity: 0.5, duration: 0,
      color: "", particleCount: 0, opacity: 1, size: 1, animationType: "",
      animationSpeed: 1, title: "", description: "", order: p.length,
    }]);
    setEffectSoundFiles((p) => [...p, undefined]);
    setEditingEffect(newId);
  }, []);

  const removeEffect = useCallback((id: string) => {
    setEffects((prev) => {
      const e = prev.find((x) => x.id === id);
      if (e?._savedId) setDeletedEffectIds((d) => [...d, e._savedId!]);
      return prev.filter((x) => x.id !== id);
    });
  }, []);

  const updateEffectField = useCallback((id: string, field: keyof CreateEffectData, value: string | number | boolean) => {
    setEffects((prev) => prev.map((e) => e.id === id ? { ...e, [field]: value } : e));
  }, []);

  // ── file handlers ──
  const handleHotspotFileUpload = useCallback((idx: number, file: File, type: "audio" | "image" | "video") => {
    if (type === "audio") setHotspotAudioFiles((p) => { const f = [...p]; f[idx] = file; return f; });
    else if (type === "image") setHotspotImageFiles((p) => { const f = [...p]; f[idx] = file; return f; });
    else setHotspotVideoFiles((p) => { const f = [...p]; f[idx] = file; return f; });
  }, []);

  const handleAudioFileUpload = useCallback((idx: number, file: File) => {
    setAudioFiles((p) => { const f = [...p]; f[idx] = file; return f; });
  }, []);

  const handleEffectFileUpload = useCallback((idx: number, file: File) => {
    setEffectSoundFiles((p) => { const f = [...p]; f[idx] = file; return f; });
  }, []);

  // ── save all changes ──
  const handleSave = async () => {
    setIsSaving(true);
    try {
      // 1. Update basic tour info
      await updateTour.mutateAsync({
        id: tourId,
        data: {
          title: formData.title,
          description: formData.description,
          location: formData.location,
          status: formData.status,
          isPublished: formData.isPublished,
        },
      });

      // 2. Delete removed hotspots
      await Promise.all(deletedHotspotIds.map((id) => deleteHotspot.mutateAsync(id)));
      setDeletedHotspotIds([]);

      // 3. Create new / update existing hotspots
      await Promise.all(
        hotspots.map((h) => {
          const payload = {
            type: h.type, title: h.title, description: h.description,
            positionX: h.positionX, positionY: h.positionY, positionZ: h.positionZ,
            pitch: h.pitch, yaw: h.yaw, icon: h.icon, actionUrl: h.actionUrl,
            color: h.color, size: h.size, triggerDistance: h.triggerDistance,
            autoTrigger: h.autoTrigger, showOnHover: h.showOnHover, order: h.order,
          };
          if (h._savedId) {
            return updateHotspot.mutateAsync({ hotspotId: h._savedId, data: payload });
          }
          return createHotspot.mutateAsync(payload as CreateHotspotData);
        })
      );

      // 4. Delete removed audio regions
      await Promise.all(deletedAudioIds.map((id) => deleteAudioRegion.mutateAsync(id)));
      setDeletedAudioIds([]);

      // 5. Create new / update existing audio regions
      await Promise.all(
        audioRegions.map((a) => {
          const payload = {
            title: a.title, description: a.description, regionType: a.regionType,
            centerX: a.centerX, centerY: a.centerY, centerZ: a.centerZ,
            radius: a.radius, width: a.width, height: a.height, depth: a.depth,
            volume: a.volume, loop: a.loop, fadeInDuration: a.fadeInDuration,
            fadeOutDuration: a.fadeOutDuration, spatialAudio: a.spatialAudio,
            minDistance: a.minDistance, maxDistance: a.maxDistance,
            autoPlay: a.autoPlay, playOnce: a.playOnce, order: a.order,
          };
          if (a._savedId) {
            return updateAudioRegion.mutateAsync({ audioRegionId: a._savedId, data: payload });
          }
          return createAudioRegion.mutateAsync(payload as CreateAudioRegionData);
        })
      );

      // 6. Delete removed effects
      await Promise.all(deletedEffectIds.map((id) => deleteEffect.mutateAsync(id)));
      setDeletedEffectIds([]);

      // 7. Create new / update existing effects
      await Promise.all(
        effects.map((e) => {
          const payload = {
            effectType: e.effectType, effectName: e.effectName, triggerType: e.triggerType,
            positionX: e.positionX, positionY: e.positionY, positionZ: e.positionZ,
            pitch: e.pitch, yaw: e.yaw, triggerDistance: e.triggerDistance,
            triggerDelay: e.triggerDelay, intensity: e.intensity, duration: e.duration,
            color: e.color, particleCount: e.particleCount, opacity: e.opacity,
            size: e.size, animationType: e.animationType, animationSpeed: e.animationSpeed,
            title: e.title, description: e.description, order: e.order,
          };
          if (e._savedId) {
            return updateEffect.mutateAsync({ effectId: e._savedId, data: payload });
          }
          return createEffect.mutateAsync(payload as CreateEffectData);
        })
      );

      toast.success("Tour saved successfully!");
      router.push("/dashboard/virtual-tour");
    } catch {
      toast.error("Failed to save tour. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  // ── existing media URL for visual editor ──
  const mediaUrl =
    tour?.tourType === "360_image" ? (tour.image360Url ?? undefined) :
    tour?.tourType === "360_video" ? (tour.video360Url ?? undefined) :
    tour?.tourType === "3d_model"  ? (tour.model3dUrl ?? undefined) :
    undefined;

  // ── loading / error states ──────────────────────────────────────────────────

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
        <p className="text-sm text-gray-500">Loading tour…</p>
      </div>
    );
  }

  if (error || !tour) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4 text-center px-4">
        <AlertTriangle className="w-10 h-10 text-amber-400" />
        <h2 className="text-lg font-semibold text-gray-900">Tour not found</h2>
        <p className="text-sm text-gray-500">This tour may have been deleted or you don&apos;t have permission to edit it.</p>
        <Link href="/dashboard/virtual-tour" className="mt-2 px-5 py-2.5 rounded-xl bg-gray-900 text-white text-sm font-semibold hover:bg-gray-700 transition-colors">
          Back to Tours
        </Link>
      </div>
    );
  }

  const canSave = formData.title.trim() !== "" && formData.location.trim() !== "";

  // ── render ──────────────────────────────────────────────────────────────────

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link
          href="/dashboard/virtual-tour"
          className="flex items-center justify-center w-9 h-9 rounded-xl border border-gray-200 bg-white text-gray-400 hover:text-gray-900 hover:border-gray-300 transition-colors shrink-0"
        >
          <ChevronLeft className="w-4 h-4" />
        </Link>
        <div className="flex-1 min-w-0">
          <p className="text-xs text-gray-400 font-medium">Virtual Tour Management</p>
          <h1 className="text-xl font-bold text-gray-900 leading-tight truncate">
            Edit: {tour.title}
          </h1>
        </div>
        {/* Quick-view link */}
        <Link
          href={`/virtual-tours/${tourId}`}
          target="_blank"
          className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 bg-white text-sm font-medium text-gray-600 hover:text-gray-900 hover:border-gray-300 transition-colors shrink-0"
        >
          <Eye className="w-4 h-4" />
          Preview
        </Link>
      </div>

      {/* Status banner */}
      <div className={`mb-5 px-4 py-3 rounded-xl border text-sm font-medium flex items-center gap-2 ${
        tour.isPublished
          ? "bg-emerald-50 border-emerald-200 text-emerald-700"
          : tour.isArchived
          ? "bg-gray-100 border-gray-200 text-gray-600"
          : "bg-amber-50 border-amber-200 text-amber-700"
      }`}>
        <span className={`w-2 h-2 rounded-full shrink-0 ${
          tour.isPublished ? "bg-emerald-500" : tour.isArchived ? "bg-gray-400" : "bg-amber-400"
        }`} />
        {tour.isPublished ? "This tour is live — changes save immediately." : tour.isArchived ? "This tour is archived." : "This tour is a draft — not visible to the public."}
      </div>

      {/* Step indicator */}
      <div className="bg-white rounded-2xl border border-gray-100 px-8 py-6 mb-6 flex items-center justify-center overflow-x-auto">
        <EditStepIndicator current={step} />
      </div>

      {/* Steps */}
      <div className="space-y-5">
        {step === 1 && (
          <BasicInfoStep
            formData={formData}
            onChange={(updates) => setFormData((p) => ({ ...p, ...updates }))}
          />
        )}

        {step === 2 && (
          <HotspotStep
            tourType={formData.tourType}
            mediaUrl={mediaUrl}
            hotspots={hotspots}
            hotspotAudioFiles={hotspotAudioFiles}
            hotspotImageFiles={hotspotImageFiles}
            hotspotVideoFiles={hotspotVideoFiles}
            editingHotspot={editingHotspot}
            onSetEditingHotspot={setEditingHotspot}
            onAdd={addHotspot}
            onRemove={removeHotspot}
            onUpdate={updateHotspotField}
            onFileUpload={handleHotspotFileUpload}
          />
        )}

        {step === 3 && (
          <AudioEffectsStep
            tourType={formData.tourType}
            mediaUrl={mediaUrl}
            audioRegions={audioRegions}
            audioFiles={audioFiles}
            editingAudio={editingAudio}
            onSetEditingAudio={setEditingAudio}
            onAddAudioRegion={addAudioRegion}
            onRemoveAudioRegion={removeAudioRegion}
            onUpdateAudioRegion={updateAudioRegionField}
            onAudioFileUpload={handleAudioFileUpload}
            effects={effects}
            effectSoundFiles={effectSoundFiles}
            editingEffect={editingEffect}
            onSetEditingEffect={setEditingEffect}
            onAddEffect={addEffect}
            onRemoveEffect={removeEffect}
            onUpdateEffect={updateEffectField}
            onEffectFileUpload={handleEffectFileUpload}
          />
        )}

        {/* Navigation */}
        <div className="flex items-center justify-between pt-2 pb-8">
          {/* Back */}
          <button
            type="button"
            onClick={() => setStep((s) => Math.max(1, s - 1))}
            disabled={isSaving}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl border border-gray-200 bg-white text-sm font-medium text-gray-700 hover:border-gray-300 hover:text-gray-900 transition-colors disabled:opacity-40 ${step === 1 ? "invisible" : ""}`}
          >
            <ChevronLeft className="w-4 h-4" />
            Back
          </button>

          <div className="flex items-center gap-3">
            {step < 3 ? (
              <button
                type="button"
                onClick={() => setStep((s) => s + 1)}
                disabled={step === 1 && !canSave}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gray-900 text-white text-sm font-semibold hover:bg-gray-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Continue
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSave}
                disabled={isSaving || !canSave}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gray-900 text-white text-sm font-semibold hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Saving…
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    Save Changes
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
