"use client";

import { Check } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { useCreateVirtualTour } from "@/hooks/virtual-tour/use-virtual-tours";
import { getAuthToken } from "@/lib/cookies";
import {
  CreateVirtualTourRequest,
  CreateAudioRegionData,
  CreateEffectData,
  CreateHotspotData,
} from "@/types/tour";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { StepIndicator } from "./_components/shared";
import { HotspotStep } from "./_components/HotspotStep";
import { AudioEffectsStep } from "./_components/AudioEffectsStep";
import {
  TourTypeStep,
  BasicInfoStep,
  MediaStep,
  TourType,
} from "./_components/TourSteps";

type SubmitPhase = "idle" | "uploading" | "saving";

interface CloudinarySignature {
  apiKey: string;
  timestamp: number;
  signature: string;
  folder: string;
  cloudName: string;
  resourceType: string;
}

async function fetchUploadSignature(
  tourType: string,
): Promise<CloudinarySignature> {
  const base = (process.env.NEXT_PUBLIC_API_BASE_URL ?? "").replace(/\/$/, "");
  const token = getAuthToken();
  const res = await fetch(
    `${base}/virtual-tours/upload-signature?tourType=${tourType}`,
    {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    },
  );
  if (!res.ok) {
    throw Object.assign(new Error("Failed to get upload signature"), {
      isUploadError: true,
    });
  }
  return res.json();
}

function uploadToCloudinaryWithProgress(
  file: File,
  sig: CloudinarySignature,
  onProgress: (pct: number) => void,
): Promise<{
  secure_url: string;
  public_id: string;
  original_filename: string;
}> {
  return new Promise((resolve, reject) => {
    const fd = new FormData();
    fd.append("file", file);
    fd.append("api_key", sig.apiKey);
    fd.append("timestamp", sig.timestamp.toString());
    fd.append("signature", sig.signature);
    fd.append("folder", sig.folder);

    const xhr = new XMLHttpRequest();
    xhr.open(
      "POST",
      `https://api.cloudinary.com/v1_1/${sig.cloudName}/${sig.resourceType}/upload`,
    );

    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable)
        onProgress(Math.round((e.loaded * 100) / e.total));
    };

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve(JSON.parse(xhr.responseText));
      } else {
        reject(
          Object.assign(new Error("Upload failed"), { isUploadError: true }),
        );
      }
    };

    xhr.onerror = () => {
      console.error("[Cloudinary] XHR error — likely CORS or network issue", {
        url: xhr.responseURL,
        status: xhr.status,
        response: xhr.responseText,
      });
      reject(
        Object.assign(new Error("Upload failed"), { isUploadError: true }),
      );
    };
    xhr.ontimeout = () =>
      reject(
        Object.assign(new Error("Upload timed out"), { isUploadError: true }),
      );

    xhr.send(fd);
  });
}

async function uploadFileWithProgress(
  file: File,
  tourType: string,
  onProgress: (pct: number) => void,
): Promise<{ image360Url: string; fileName: string; tourType: string }> {
  // Step 1: get signature from backend (fast, < 5ms, no file sent to server)
  const sig = await fetchUploadSignature(tourType);

  // Step 2: upload directly to Cloudinary (bypasses your server + Cloudflare entirely)
  const result = await uploadToCloudinaryWithProgress(file, sig, onProgress);

  return {
    image360Url: result.secure_url,
    fileName: result.original_filename ?? file.name,
    tourType,
  };
}

export default function CreateTour() {
  const createTourMutation = useCreateVirtualTour();
  const router = useRouter();
  const [step, setStep] = useState(1);

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
  const [hotspotAudioFiles, setHotspotAudioFiles] = useState<
    (File | undefined)[]
  >([]);
  const [hotspotImageFiles, setHotspotImageFiles] = useState<
    (File | undefined)[]
  >([]);
  const [hotspotVideoFiles, setHotspotVideoFiles] = useState<
    (File | undefined)[]
  >([]);
  const [effectSoundFiles, setEffectSoundFiles] = useState<
    (File | undefined)[]
  >([]);
  const [editingHotspot, setEditingHotspot] = useState<string | null>(null);
  const [editingAudio, setEditingAudio] = useState<string | null>(null);
  const [editingEffect, setEditingEffect] = useState<string | null>(null);

  // ── Upload progress state ──
  const [submitPhase, setSubmitPhase] = useState<SubmitPhase>("idle");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadFailed, setUploadFailed] = useState(false);

  // ── Hotspot management ──
  const addHotspot = () =>
    setHotspots((prev) => [
      ...prev,
      {
        type: "info",
        title: `Hotspot ${prev.length + 1}`,
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
        order: prev.length,
      },
    ]);

  const removeHotspot = (id: string) => {
    setHotspots((prev) => prev.filter((h) => h.id !== id));
    setHotspotAudioFiles((prev) =>
      prev.filter((_, i) => hotspots[i].id !== id),
    );
    setHotspotImageFiles((prev) =>
      prev.filter((_, i) => hotspots[i].id !== id),
    );
    setHotspotVideoFiles((prev) =>
      prev.filter((_, i) => hotspots[i].id !== id),
    );
  };

  const updateHotspot = (
    id: string,
    field: keyof CreateHotspotData,
    value: string | number | boolean,
  ) =>
    setHotspots((prev) =>
      prev.map((h) => (h.id === id ? { ...h, [field]: value } : h)),
    );

  // ── Audio region management ──
  const addAudioRegion = () =>
    setAudioRegions((prev) => [
      ...prev,
      {
        title: `Audio Region ${prev.length + 1}`,
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
        order: prev.length,
      },
    ]);

  const removeAudioRegion = (id: string) => {
    setAudioRegions((prev) => prev.filter((a) => a.id !== id));
    setAudioFiles((prev) => prev.filter((_, i) => audioRegions[i].id !== id));
  };

  const updateAudioRegion = (
    id: string,
    field: keyof CreateAudioRegionData,
    value: string | number | boolean,
  ) =>
    setAudioRegions((prev) =>
      prev.map((a) => (a.id === id ? { ...a, [field]: value } : a)),
    );

  // ── Effect management ──
  const addEffect = () =>
    setEffects((prev) => [
      ...prev,
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
        order: prev.length,
      },
    ]);

  const removeEffect = (id: string) => {
    setEffects((prev) => prev.filter((e) => e.id !== id));
    setEffectSoundFiles((prev) => prev.filter((_, i) => effects[i].id !== id));
  };

  const updateEffect = (
    id: string,
    field: keyof CreateEffectData,
    value: string | number | boolean,
  ) =>
    setEffects((prev) =>
      prev.map((e) => (e.id === id ? { ...e, [field]: value } : e)),
    );

  // ── File handlers ──
  const handleHotspotFileUpload = (
    idx: number,
    file: File,
    type: "audio" | "image" | "video",
  ) => {
    if (type === "audio")
      setHotspotAudioFiles((prev) => {
        const f = [...prev];
        f[idx] = file;
        return f;
      });
    else if (type === "image")
      setHotspotImageFiles((prev) => {
        const f = [...prev];
        f[idx] = file;
        return f;
      });
    else
      setHotspotVideoFiles((prev) => {
        const f = [...prev];
        f[idx] = file;
        return f;
      });
  };

  const handleEffectFileUpload = (idx: number, file: File) =>
    setEffectSoundFiles((prev) => {
      const f = [...prev];
      f[idx] = file;
      return f;
    });

  const handleAudioRegionFileUpload = (idx: number, file: File) =>
    setAudioFiles((prev) => {
      const f = [...prev];
      f[idx] = file;
      return f;
    });

  const FILE_SIZE_LIMITS: Record<string, number> = {
    "360_image": 10 * 1024 * 1024,
    "3d_model": 10 * 1024 * 1024,
    "360_video": 10 * 1024 * 1024,
  };
  const FILE_SIZE_LIMIT =
    FILE_SIZE_LIMITS[formData.tourType] ?? 10 * 1024 * 1024;

  // ── Submit logic (shared by form submit + retry button) ──
  const doSubmit = async () => {
    if (tourFile && tourFile.size > FILE_SIZE_LIMIT) {
      const limitMb = FILE_SIZE_LIMIT / (1024 * 1024);
      toast.error(`File exceeds ${limitMb} MB limit for this tour type.`);
      return;
    }
    setUploadFailed(false);
    sessionStorage.setItem("lastSubmissionTime", Date.now().toString());

    try {
      // Phase 1: upload file via XHR (bypasses axios, supports progress)
      let fileUrl: string | undefined;
      let fileName: string | undefined;
      if (tourFile && formData.tourType !== "embed") {
        setSubmitPhase("uploading");
        setUploadProgress(0);
        const result = await uploadFileWithProgress(
          tourFile,
          formData.tourType,
          (pct) => setUploadProgress(pct),
        );
        fileUrl = result.image360Url;
        fileName = result.fileName;
      }

      // Phase 2: create tour with URL (instant JSON request)
      setSubmitPhase("saving");
      await createTourMutation.mutateAsync({
        title: formData.title,
        description: formData.description,
        location: formData.location,
        tourType: formData.tourType,
        ...(formData.embedUrl ? { embedUrl: formData.embedUrl } : {}),
        ...(fileUrl ? { image360Url: fileUrl } : {}),
        ...(fileName ? { fileName } : {}),
        status: formData.status,
        isPublished: formData.isPublished,
        ...(hotspots.length > 0
          ? { hotspots: hotspots.map((h, i) => ({ ...h, order: i })) }
          : {}),
        ...(audioRegions.length > 0
          ? { audioRegions: audioRegions.map((a, i) => ({ ...a, order: i })) }
          : {}),
        ...(effects.length > 0
          ? { effects: effects.map((ef, i) => ({ ...ef, order: i })) }
          : {}),
      });

      router.push("/dashboard/virtual-tour");
    } catch (err) {
      const isUploadErr = (err as { isUploadError?: boolean })?.isUploadError;
      if (isUploadErr) {
        setUploadFailed(true);
        toast.error("File upload failed — your form data is still here");
      } else {
        toast.error("Failed to create tour");
      }
    } finally {
      setSubmitPhase("idle");
      setUploadProgress(0);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    doSubmit();
  };

  const canGoNext = () => {
    if (step === 1) return true;
    if (step === 2)
      return formData.title.trim() !== "" && formData.location.trim() !== "";
    if (step === 3)
      return formData.tourType === "embed" ? !!formData.embedUrl : !!tourFile;
    return true;
  };

  const isSubmitting = submitPhase !== "idle";
  const fileTooLarge = !!tourFile && tourFile.size > FILE_SIZE_LIMIT;

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link
          href="/dashboard/virtual-tour"
          className="flex items-center justify-center w-9 h-9 rounded-xl border border-gray-200 bg-white text-gray-400 hover:text-gray-900 hover:border-gray-300 transition-colors shrink-0"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </Link>
        <div className="flex-1">
          <p className="text-xs text-gray-400 font-medium">Tour Management</p>
          <h1 className="text-xl font-bold text-gray-900 leading-tight">
            Create New Tour
          </h1>
        </div>
      </div>

      {/* Step indicator */}
      <div className="bg-white rounded-2xl border border-gray-100 px-8 py-6 mb-6 flex items-center justify-center overflow-x-auto">
        <StepIndicator current={step} />
      </div>

      {/* Upload progress bar */}
      {isSubmitting && (
        <div className="bg-white rounded-2xl border border-gray-100 px-6 py-4 mb-5">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-gray-700">
              {submitPhase === "uploading" ? "Uploading file…" : "Saving tour…"}
            </p>
            {submitPhase === "uploading" && (
              <span className="text-xs font-mono text-gray-500">
                {uploadProgress}%
              </span>
            )}
          </div>
          <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gray-900 rounded-full transition-all duration-300"
              style={{
                width: submitPhase === "saving" ? "100%" : `${uploadProgress}%`,
              }}
            />
          </div>
          {submitPhase === "saving" && (
            <p className="text-xs text-gray-400 mt-1.5">Almost done…</p>
          )}
        </div>
      )}

      {/* Upload failed retry */}
      {uploadFailed && !isSubmitting && (
        <div className="bg-red-50 border border-red-100 rounded-2xl px-6 py-4 mb-5 flex items-center justify-between">
          <p className="text-sm text-red-600">
            Upload failed — your form data is still here.
          </p>
          <button
            type="button"
            onClick={doSubmit}
            className="text-xs font-semibold text-red-700 underline underline-offset-2"
          >
            Retry
          </button>
        </div>
      )}

      {/* File size feedback */}
      {tourFile &&
        !isSubmitting &&
        (() => {
          const mb = tourFile.size / (1024 * 1024);
          const limitMb = FILE_SIZE_LIMIT / (1024 * 1024);
          if (fileTooLarge)
            return (
              <div className="bg-red-50 border border-red-200 rounded-2xl px-6 py-3 mb-5 flex items-center gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
                <p className="text-xs text-red-700">
                  File too large ({mb.toFixed(1)} MB). Maximum allowed is{" "}
                  <strong>{limitMb} MB</strong> for this tour type. Please
                  compress or choose a smaller file.
                </p>
              </div>
            );
          if (mb > 7)
            return (
              <div className="bg-amber-50 border border-amber-100 rounded-2xl px-6 py-3 mb-5 flex items-center gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
                <p className="text-xs text-amber-700">
                  Large file ({mb.toFixed(1)} MB) — upload may take a moment.
                  Limit is {limitMb} MB.
                </p>
              </div>
            );
          return null;
        })()}

      <form onSubmit={handleSubmit} className="space-y-5">
        {step === 1 && (
          <TourTypeStep
            value={formData.tourType as TourType}
            onChange={(v) => setFormData((p) => ({ ...p, tourType: v }))}
          />
        )}

        {step === 2 && (
          <BasicInfoStep
            formData={formData}
            onChange={(updates) => setFormData((p) => ({ ...p, ...updates }))}
          />
        )}

        {step === 3 && (
          <MediaStep
            formData={formData}
            tourFile={tourFile}
            onEmbedUrlChange={(url) =>
              setFormData((p) => ({ ...p, embedUrl: url }))
            }
            onFileSelect={setTourFile}
          />
        )}

        {step === 4 && (
          <HotspotStep
            hotspots={hotspots}
            hotspotAudioFiles={hotspotAudioFiles}
            hotspotImageFiles={hotspotImageFiles}
            hotspotVideoFiles={hotspotVideoFiles}
            editingHotspot={editingHotspot}
            onSetEditingHotspot={setEditingHotspot}
            onAdd={addHotspot}
            onRemove={removeHotspot}
            onUpdate={updateHotspot}
            onFileUpload={handleHotspotFileUpload}
          />
        )}

        {step === 5 && (
          <AudioEffectsStep
            audioRegions={audioRegions}
            audioFiles={audioFiles}
            editingAudio={editingAudio}
            onSetEditingAudio={setEditingAudio}
            onAddAudioRegion={addAudioRegion}
            onRemoveAudioRegion={removeAudioRegion}
            onUpdateAudioRegion={updateAudioRegion}
            onAudioFileUpload={handleAudioRegionFileUpload}
            effects={effects}
            effectSoundFiles={effectSoundFiles}
            editingEffect={editingEffect}
            onSetEditingEffect={setEditingEffect}
            onAddEffect={addEffect}
            onRemoveEffect={removeEffect}
            onUpdateEffect={updateEffect}
            onEffectFileUpload={handleEffectFileUpload}
          />
        )}

        {/* Navigation */}
        <div className="flex items-center justify-between pt-2 pb-8">
          <button
            type="button"
            onClick={() => setStep((s) => Math.max(1, s - 1))}
            disabled={isSubmitting}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl border border-gray-200 bg-white text-sm font-medium text-gray-700 hover:border-gray-300 hover:text-gray-900 transition-colors disabled:opacity-40 ${step === 1 ? "invisible" : ""}`}
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back
          </button>

          <div className="flex items-center gap-2">
            {step < 5 ? (
              <button
                type="button"
                onClick={() => setStep((s) => s + 1)}
                disabled={!canGoNext()}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gray-900 text-white text-sm font-semibold hover:bg-gray-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Continue
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            ) : (
              <button
                type="submit"
                disabled={isSubmitting || fileTooLarge}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gray-900 text-white text-sm font-semibold hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    {submitPhase === "uploading" ? "Uploading…" : "Saving…"}
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    Create Tour
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}
