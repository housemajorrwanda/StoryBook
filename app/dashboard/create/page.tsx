'use client';

import { Upload, Plus, X, Volume2, Zap, Image, Video, Box, Globe, MapPin, FileText, Check } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { Select, Checkbox } from "@/components/shared";
import { useCreateVirtualTour } from "@/hooks/virtual-tour/use-virtual-tours";
import { CreateVirtualTourRequest, CreateAudioRegionData, CreateEffectData, CreateHotspotData } from "@/types/tour";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

// ─── File Upload ──────────────────────────────────────────────────────────────

const FileUpload = ({
  onFileSelect,
  accept,
  label,
  hint,
  currentFile,
}: {
  onFileSelect: (file: File) => void;
  accept: string;
  label: string;
  hint?: string;
  currentFile?: File;
}) => {
  const inputId = `file-${label.replace(/\s+/g, '-')}`;
  return (
    <label
      htmlFor={inputId}
      className={`flex flex-col items-center justify-center gap-3 w-full p-8 rounded-xl border-2 border-dashed transition-colors cursor-pointer ${
        currentFile
          ? "border-gray-900 bg-gray-50"
          : "border-gray-200 bg-white hover:border-gray-400 hover:bg-gray-50"
      }`}
    >
      <input
        id={inputId}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(e) => { const f = e.target.files?.[0]; if (f) onFileSelect(f); }}
      />
      {currentFile ? (
        <>
          <div className="w-10 h-10 rounded-xl bg-gray-900 flex items-center justify-center">
            <Check className="w-5 h-5 text-white" />
          </div>
          <div className="text-center">
            <p className="text-sm font-semibold text-gray-900">{currentFile.name}</p>
            <p className="text-xs text-gray-400 mt-0.5">{(currentFile.size / 1024 / 1024).toFixed(2)} MB — click to change</p>
          </div>
        </>
      ) : (
        <>
          <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center">
            <Upload className="w-5 h-5 text-gray-400" />
          </div>
          <div className="text-center">
            <p className="text-sm font-semibold text-gray-700">{label}</p>
            {hint && <p className="text-xs text-gray-400 mt-0.5">{hint}</p>}
          </div>
        </>
      )}
    </label>
  );
};

// ─── Tour type config ─────────────────────────────────────────────────────────

const TOUR_TYPES = [
  {
    value: "360_image",
    label: "360° Image",
    description: "Panoramic photo tour with hotspots",
    icon: Image,
    accept: "image/*",
    hint: "JPG, PNG, WebP — equirectangular format",
  },
  {
    value: "360_video",
    label: "360° Video",
    description: "Immersive spherical video experience",
    icon: Video,
    accept: "video/*",
    hint: "MP4, WebM — equirectangular format",
  },
  {
    value: "3d_model",
    label: "3D Model",
    description: "Interactive 3D model viewer with AR",
    icon: Box,
    accept: ".glb,.gltf,.obj,.fbx",
    hint: "GLB, GLTF, OBJ, FBX",
  },
  {
    value: "embed",
    label: "Embed Tour",
    description: "Embed from Matterport, Google, etc.",
    icon: Globe,
    accept: "",
    hint: "Paste an embed URL",
  },
] as const;

type TourType = typeof TOUR_TYPES[number]["value"];

// ─── Step indicator ───────────────────────────────────────────────────────────

const STEPS = [
  { id: 1, label: "Tour Type" },
  { id: 2, label: "Basic Info" },
  { id: 3, label: "Media" },
  { id: 4, label: "Hotspots" },
  { id: 5, label: "Audio & Effects" },
];

function StepIndicator({ current }: { current: number }) {
  return (
    <div className="flex items-center gap-0">
      {STEPS.map((step, i) => {
        const done = current > step.id;
        const active = current === step.id;
        return (
          <div key={step.id} className="flex items-center">
            <div className="flex flex-col items-center gap-1.5">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                  done
                    ? "bg-gray-900 text-white"
                    : active
                    ? "bg-gray-900 text-white ring-4 ring-gray-900/10"
                    : "bg-gray-100 text-gray-400"
                }`}
              >
                {done ? <Check className="w-3.5 h-3.5" /> : step.id}
              </div>
              <span className={`text-[10px] font-medium whitespace-nowrap ${active ? "text-gray-900" : "text-gray-400"}`}>
                {step.label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div className={`h-px w-10 mx-1 mb-4 ${done ? "bg-gray-900" : "bg-gray-200"}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── Section wrapper ──────────────────────────────────────────────────────────

function Section({ title, description, children }: { title: string; description?: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-7">
      <div className="mb-6">
        <h2 className="text-base font-semibold text-gray-900">{title}</h2>
        {description && <p className="text-sm text-gray-400 mt-1">{description}</p>}
      </div>
      {children}
    </div>
  );
}

// ─── Field wrapper ────────────────────────────────────────────────────────────

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
        {label}{required && <span className="text-red-400 ml-0.5">*</span>}
      </label>
      {children}
    </div>
  );
}

const inputCls = "w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-white text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-100 transition-all";

// ─── Main page ────────────────────────────────────────────────────────────────

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
  const [hotspotAudioFiles, setHotspotAudioFiles] = useState<(File | undefined)[]>([]);
  const [hotspotImageFiles, setHotspotImageFiles] = useState<(File | undefined)[]>([]);
  const [hotspotVideoFiles, setHotspotVideoFiles] = useState<(File | undefined)[]>([]);
  const [effectSoundFiles, setEffectSoundFiles] = useState<(File | undefined)[]>([]);
  const [editingHotspot, setEditingHotspot] = useState<string | null>(null);
  const [editingAudio, setEditingAudio] = useState<string | null>(null);
  const [editingEffect, setEditingEffect] = useState<string | null>(null);

  const selectedTourType = TOUR_TYPES.find((t) => t.value === formData.tourType)!;

  // ── Hotspot management ──
  const addHotspot = () => {
    const h: CreateHotspotData = {
      type: "info", title: `Hotspot ${hotspots.length + 1}`, description: "",
      positionX: 0, positionY: 0, positionZ: 0, pitch: 0, yaw: 0,
      icon: "", actionUrl: "", color: "", size: 1, triggerDistance: 5,
      autoTrigger: false, showOnHover: false, order: hotspots.length,
    };
    setHotspots([...hotspots, h]);
  };
  const removeHotspot = (id: string) => {
    setHotspots(hotspots.filter((h) => h.id !== id));
    setHotspotAudioFiles(hotspotAudioFiles.filter((_, i) => hotspots[i].id !== id));
    setHotspotImageFiles(hotspotImageFiles.filter((_, i) => hotspots[i].id !== id));
    setHotspotVideoFiles(hotspotVideoFiles.filter((_, i) => hotspots[i].id !== id));
  };
  const updateHotspot = (id: string, field: keyof CreateHotspotData, value: string | number | boolean) =>
    setHotspots(hotspots.map((h) => (h.id === id ? { ...h, [field]: value } : h)));

  // ── Audio region management ──
  const addAudioRegion = () => {
    const a: CreateAudioRegionData = {
      title: `Audio Region ${audioRegions.length + 1}`, description: "",
      regionType: "sphere", centerX: 0, centerY: 0, centerZ: 0,
      radius: 10, width: 0, height: 0, depth: 0, volume: 0.8,
      loop: true, fadeInDuration: 0, fadeOutDuration: 0, spatialAudio: true,
      minDistance: 1, maxDistance: 50, autoPlay: true, playOnce: false,
      order: audioRegions.length,
    };
    setAudioRegions([...audioRegions, a]);
  };
  const removeAudioRegion = (id: string) => {
    setAudioRegions(audioRegions.filter((a) => a.id !== id));
    setAudioFiles(audioFiles.filter((_, i) => audioRegions[i].id !== id));
  };
  const updateAudioRegion = (id: string, field: keyof CreateAudioRegionData, value: string | number | boolean) =>
    setAudioRegions(audioRegions.map((a) => (a.id === id ? { ...a, [field]: value } : a)));

  // ── Effect management ──
  const addEffect = () => {
    const e: CreateEffectData = {
      effectType: "visual", effectName: "fog", triggerType: "on_enter",
      positionX: 0, positionY: 0, positionZ: 0, pitch: 0, yaw: 0,
      triggerDistance: 5, triggerDelay: 0, intensity: 0.5, duration: 0,
      color: "", particleCount: 0, opacity: 1, size: 1,
      animationType: "", animationSpeed: 1, title: "", description: "",
      order: effects.length,
    };
    setEffects([...effects, e]);
  };
  const removeEffect = (id: string) => {
    setEffects(effects.filter((e) => e.id !== id));
    setEffectSoundFiles(effectSoundFiles.filter((_, i) => effects[i].id !== id));
  };
  const updateEffect = (id: string, field: keyof CreateEffectData, value: string | number | boolean) =>
    setEffects(effects.map((e) => (e.id === id ? { ...e, [field]: value } : e)));

  // ── File handlers ──
  const handleHotspotFileUpload = (idx: number, file: File, type: "audio" | "image" | "video") => {
    if (type === "audio") { const f = [...hotspotAudioFiles]; f[idx] = file; setHotspotAudioFiles(f); }
    else if (type === "image") { const f = [...hotspotImageFiles]; f[idx] = file; setHotspotImageFiles(f); }
    else { const f = [...hotspotVideoFiles]; f[idx] = file; setHotspotVideoFiles(f); }
  };
  const handleEffectFileUpload = (idx: number, file: File) => {
    const f = [...effectSoundFiles]; f[idx] = file; setEffectSoundFiles(f);
  };
  const handleAudioRegionFileUpload = (idx: number, file: File) => {
    const f = [...audioFiles]; f[idx] = file; setAudioFiles(f);
  };

  // ── Submit ──
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = new FormData();
    payload.append('title', formData.title);
    payload.append('description', formData.description);
    payload.append('location', formData.location);
    payload.append('tourType', formData.tourType);
    if (formData.embedUrl) payload.append('embedUrl', formData.embedUrl);
    payload.append('status', formData.status);
    payload.append('isPublished', formData.isPublished.toString());
    if (tourFile) payload.append('tourFile', tourFile);

    if (hotspots.length > 0) {
      payload.append('hotspots', JSON.stringify(hotspots.map((h, i) => ({ ...h, order: i }))));
      hotspotAudioFiles.forEach((f) => f && payload.append('hotspotAudioFiles', f));
      hotspotImageFiles.forEach((f) => f && payload.append('hotspotImageFiles', f));
      hotspotVideoFiles.forEach((f) => f && payload.append('hotspotVideoFiles', f));
    }
    if (audioRegions.length > 0) {
      payload.append('audioRegions', JSON.stringify(audioRegions.map((a, i) => ({ ...a, order: i }))));
      audioFiles.forEach((f) => f && payload.append('audioFiles', f));
    }
    if (effects.length > 0) {
      payload.append('effects', JSON.stringify(effects.map((e, i) => ({ ...e, order: i }))));
      effectSoundFiles.forEach((f) => f && payload.append('effectSoundFiles', f));
    }

    try {
      await createTourMutation.mutateAsync(payload);
      router.push("/dashboard/virtual-tour");
    } catch {
      toast.error("Failed to create tour");
    }
  };

  // ── Step validation ──
  const canGoNext = () => {
    if (step === 1) return true;
    if (step === 2) return formData.title.trim() !== "" && formData.location.trim() !== "";
    if (step === 3) return formData.tourType === "embed" ? !!formData.embedUrl : !!tourFile;
    return true;
  };

  // ─────────────────────────────────────────────────────────────────────────────

  return (
    <div className="max-w-3xl mx-auto">

      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link
          href="/dashboard/virtual-tour"
          className="flex items-center justify-center w-9 h-9 rounded-xl border border-gray-200 bg-white text-gray-400 hover:text-gray-900 hover:border-gray-300 transition-colors shrink-0"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <div>
          <p className="text-xs text-gray-400 font-medium">Tour Management</p>
          <h1 className="text-xl font-bold text-gray-900 leading-tight">Create New Tour</h1>
        </div>
      </div>

      {/* Step indicator */}
      <div className="bg-white rounded-2xl border border-gray-100 px-8 py-6 mb-6 flex items-center justify-center overflow-x-auto">
        <StepIndicator current={step} />
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">

        {/* ── Step 1: Tour Type ── */}
        {step === 1 && (
          <Section title="Choose Your Tour Type" description="Select the type of experience you want to create. You can always change this later.">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {TOUR_TYPES.map((type) => {
                const Icon = type.icon;
                const active = formData.tourType === type.value;
                return (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() => setFormData((p) => ({ ...p, tourType: type.value as TourType }))}
                    className={`text-left p-5 rounded-xl border-2 transition-all duration-150 ${
                      active
                        ? "border-gray-900 bg-gray-50"
                        : "border-gray-100 bg-white hover:border-gray-300"
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${active ? "bg-gray-900" : "bg-gray-100"}`}>
                        <Icon className={`w-5 h-5 ${active ? "text-white" : "text-gray-500"}`} />
                      </div>
                      <div className="min-w-0">
                        <p className={`text-sm font-semibold ${active ? "text-gray-900" : "text-gray-700"}`}>{type.label}</p>
                        <p className="text-xs text-gray-400 mt-0.5 leading-snug">{type.description}</p>
                        <p className="text-[10px] text-gray-300 mt-1.5 font-mono">{type.hint}</p>
                      </div>
                    </div>
                    {active && (
                      <div className="mt-3 flex items-center gap-1.5 text-[10px] font-semibold text-gray-900 uppercase tracking-wide">
                        <Check className="w-3 h-3" />
                        Selected
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </Section>
        )}

        {/* ── Step 2: Basic Info ── */}
        {step === 2 && (
          <Section title="Tour Details" description="Tell visitors what this tour is about.">
            <div className="space-y-5">
              <Field label="Tour Title" required>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData((p) => ({ ...p, title: e.target.value }))}
                  placeholder="e.g., National Museum Virtual Tour"
                  className={inputCls}
                  required
                />
              </Field>

              <Field label="Description">
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData((p) => ({ ...p, description: e.target.value }))}
                  placeholder="Describe what visitors will experience..."
                  rows={4}
                  className={`${inputCls} resize-none`}
                />
              </Field>

              <Field label="Location" required>
                <div className="relative">
                  <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData((p) => ({ ...p, location: e.target.value }))}
                    placeholder="e.g., Kigali Genocide Memorial, Rwanda"
                    className={`${inputCls} pl-10`}
                    required
                  />
                </div>
              </Field>

              <div className="grid grid-cols-2 gap-4">
                <Field label="Status">
                  <Select
                    value={formData.status}
                    onChange={(v) => setFormData((p) => ({ ...p, status: v as typeof formData.status }))}
                    options={[
                      { value: "draft",     label: "Draft",     description: "Not visible to public" },
                      { value: "published", label: "Published", description: "Visible to everyone" },
                      { value: "archived",  label: "Archived",  description: "Hidden from listings" },
                    ]}
                  />
                </Field>

                <Field label="Visibility">
                  <div className="h-10 flex items-center">
                    <Checkbox
                      checked={formData.isPublished}
                      onChange={(v) => setFormData((p) => ({ ...p, isPublished: v }))}
                      label="Publish immediately"
                      description="Goes live right away"
                    />
                  </div>
                </Field>
              </div>
            </div>
          </Section>
        )}

        {/* ── Step 3: Media ── */}
        {step === 3 && (
          <Section
            title={`Upload Your ${selectedTourType.label}`}
            description={
              formData.tourType === "embed"
                ? "Paste the embed URL from your tour provider."
                : `Upload the main file for your tour. ${selectedTourType.hint}.`
            }
          >
            {formData.tourType === "embed" ? (
              <Field label="Embed URL" required>
                <div className="relative">
                  <Globe className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  <input
                    type="url"
                    value={formData.embedUrl}
                    onChange={(e) => setFormData((p) => ({ ...p, embedUrl: e.target.value }))}
                    placeholder="https://my.matterport.com/show/?m=..."
                    className={`${inputCls} pl-10`}
                    required
                  />
                </div>
                <p className="text-xs text-gray-400 mt-1">Supports Matterport, Google Street View, Kuula, and other embed providers.</p>
              </Field>
            ) : (
              <FileUpload
                onFileSelect={(f) => setTourFile(f)}
                accept={selectedTourType.accept}
                label={`Click or drag to upload ${selectedTourType.label}`}
                hint={selectedTourType.hint}
                currentFile={tourFile || undefined}
              />
            )}

            {/* What's needed callout */}
            <div className="mt-5 p-4 rounded-xl bg-gray-50 border border-gray-100">
              <p className="text-xs font-semibold text-gray-700 mb-2">What you need for this tour type:</p>
              <ul className="space-y-1.5">
                {formData.tourType === "360_image" && <>
                  <li className="flex items-center gap-2 text-xs text-gray-500"><Check className="w-3.5 h-3.5 text-green-500 shrink-0" /> An equirectangular panoramic image (JPG/PNG/WebP)</li>
                  <li className="flex items-center gap-2 text-xs text-gray-500"><Check className="w-3.5 h-3.5 text-green-500 shrink-0" /> Ideally 4096×2048px or larger for best quality</li>
                  <li className="flex items-center gap-2 text-xs text-gray-400"><Plus className="w-3.5 h-3.5 shrink-0" /> Optional: hotspot markers for points of interest</li>
                </>}
                {formData.tourType === "360_video" && <>
                  <li className="flex items-center gap-2 text-xs text-gray-500"><Check className="w-3.5 h-3.5 text-green-500 shrink-0" /> An equirectangular 360° video (MP4/WebM)</li>
                  <li className="flex items-center gap-2 text-xs text-gray-500"><Check className="w-3.5 h-3.5 text-green-500 shrink-0" /> Recommended: 4K resolution for immersive quality</li>
                  <li className="flex items-center gap-2 text-xs text-gray-400"><Plus className="w-3.5 h-3.5 shrink-0" /> Optional: spatial audio regions along the video</li>
                </>}
                {formData.tourType === "3d_model" && <>
                  <li className="flex items-center gap-2 text-xs text-gray-500"><Check className="w-3.5 h-3.5 text-green-500 shrink-0" /> A 3D model file (GLB is recommended)</li>
                  <li className="flex items-center gap-2 text-xs text-gray-500"><Check className="w-3.5 h-3.5 text-green-500 shrink-0" /> GLB/GLTF includes textures — preferred for web</li>
                  <li className="flex items-center gap-2 text-xs text-gray-400"><Plus className="w-3.5 h-3.5 shrink-0" /> AR viewing supported on mobile browsers</li>
                </>}
                {formData.tourType === "embed" && <>
                  <li className="flex items-center gap-2 text-xs text-gray-500"><Check className="w-3.5 h-3.5 text-green-500 shrink-0" /> A public embed URL from your tour provider</li>
                  <li className="flex items-center gap-2 text-xs text-gray-500"><Check className="w-3.5 h-3.5 text-green-500 shrink-0" /> Matterport, Kuula, Google Street View supported</li>
                  <li className="flex items-center gap-2 text-xs text-gray-400"><Plus className="w-3.5 h-3.5 shrink-0" /> The URL must be publicly accessible</li>
                </>}
              </ul>
            </div>
          </Section>
        )}

        {/* ── Step 4: Hotspots ── */}
        {step === 4 && (
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
                <p className="text-xs text-gray-400 mt-1 mb-4">Hotspots let visitors click to learn more, hear audio, or open links.</p>
                <button
                  type="button"
                  onClick={addHotspot}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-900 text-white text-sm font-medium hover:bg-gray-700 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Add First Hotspot
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {hotspots.map((hotspot, index) => (
                  <div key={hotspot.id ?? index} className="border border-gray-100 rounded-xl overflow-hidden">
                    {/* Hotspot header */}
                    <div
                      className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-gray-50 transition-colors"
                      onClick={() => setEditingHotspot(editingHotspot === hotspot.id ? null : hotspot.id!)}
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-6 h-6 rounded-lg bg-gray-100 text-gray-500 text-xs font-bold flex items-center justify-center shrink-0">
                          {index + 1}
                        </span>
                        <span className="text-sm font-medium text-gray-900">{hotspot.title || `Hotspot ${index + 1}`}</span>
                        <span className="text-[10px] text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full capitalize">{hotspot.type}</span>
                      </div>
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); removeHotspot(hotspot.id!); }}
                        className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Hotspot fields */}
                    {editingHotspot === hotspot.id && (
                      <div className="border-t border-gray-100 p-5 space-y-4 bg-gray-50/50">
                        <div className="grid grid-cols-2 gap-4">
                          <Field label="Title">
                            <input value={hotspot.title} onChange={(e) => updateHotspot(hotspot.id!, "title", e.target.value)} placeholder="Hotspot title" className={inputCls} />
                          </Field>
                          <Field label="Type">
                            <Select
                              value={hotspot.type}
                              onChange={(v) => updateHotspot(hotspot.id!, "type", v)}
                              options={[
                                { value: "info",   label: "Info"   },
                                { value: "link",   label: "Link"   },
                                { value: "audio",  label: "Audio"  },
                                { value: "image",  label: "Image"  },
                                { value: "video",  label: "Video"  },
                                { value: "effect", label: "Effect" },
                              ]}
                            />
                          </Field>
                        </div>

                        <Field label="Description">
                          <textarea value={hotspot.description} onChange={(e) => updateHotspot(hotspot.id!, "description", e.target.value)} rows={2} placeholder="What is this hotspot about?" className={`${inputCls} resize-none`} />
                        </Field>

                        <div className="grid grid-cols-2 gap-4">
                          <Field label="Pitch (vertical °)">
                            <input type="number" step="0.1" value={hotspot.pitch} onChange={(e) => updateHotspot(hotspot.id!, "pitch", parseFloat(e.target.value))} className={inputCls} />
                          </Field>
                          <Field label="Yaw (horizontal °)">
                            <input type="number" step="0.1" value={hotspot.yaw} onChange={(e) => updateHotspot(hotspot.id!, "yaw", parseFloat(e.target.value))} className={inputCls} />
                          </Field>
                        </div>

                        {hotspot.type === "link" && (
                          <Field label="Action URL">
                            <input type="url" value={hotspot.actionUrl} onChange={(e) => updateHotspot(hotspot.id!, "actionUrl", e.target.value)} placeholder="https://..." className={inputCls} />
                          </Field>
                        )}

                        {hotspot.type === "audio" && (
                          <Field label="Audio File">
                            <FileUpload onFileSelect={(f) => handleHotspotFileUpload(index, f, "audio")} accept="audio/*" label="Upload audio file" hint="MP3, WAV, OGG" currentFile={hotspotAudioFiles[index]} />
                          </Field>
                        )}
                        {hotspot.type === "image" && (
                          <Field label="Image File">
                            <FileUpload onFileSelect={(f) => handleHotspotFileUpload(index, f, "image")} accept="image/*" label="Upload image" hint="JPG, PNG, WebP" currentFile={hotspotImageFiles[index]} />
                          </Field>
                        )}
                        {hotspot.type === "video" && (
                          <Field label="Video File">
                            <FileUpload onFileSelect={(f) => handleHotspotFileUpload(index, f, "video")} accept="video/*" label="Upload video" hint="MP4, WebM" currentFile={hotspotVideoFiles[index]} />
                          </Field>
                        )}

                        <div className="flex gap-5">
                          <Checkbox checked={hotspot.autoTrigger ?? false} onChange={(v) => updateHotspot(hotspot.id!, "autoTrigger", v)} label="Auto-trigger when in range" />
                          <Checkbox checked={hotspot.showOnHover ?? false} onChange={(v) => updateHotspot(hotspot.id!, "showOnHover", v)} label="Show on hover only" />
                        </div>
                      </div>
                    )}
                  </div>
                ))}

                <button
                  type="button"
                  onClick={addHotspot}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-dashed border-gray-200 text-sm font-medium text-gray-500 hover:border-gray-400 hover:text-gray-900 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Add Another Hotspot
                </button>
              </div>
            )}
          </Section>
        )}

        {/* ── Step 5: Audio & Effects ── */}
        {step === 5 && (
          <div className="space-y-5">
            {/* Audio Regions */}
            <Section
              title="Spatial Audio Regions"
              description="Add ambient or positional audio that plays when visitors enter an area. Optional."
            >
              {audioRegions.length === 0 ? (
                <div className="text-center py-8 border-2 border-dashed border-gray-100 rounded-xl">
                  <Volume2 className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                  <p className="text-sm font-semibold text-gray-700">No audio regions</p>
                  <p className="text-xs text-gray-400 mt-1 mb-4">Add spatial audio that plays as visitors explore.</p>
                  <button type="button" onClick={addAudioRegion} className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-900 text-white text-sm font-medium hover:bg-gray-700 transition-colors">
                    <Plus className="w-4 h-4" />Add Audio Region
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {audioRegions.map((region, index) => (
                    <div key={region.id ?? index} className="border border-gray-100 rounded-xl overflow-hidden">
                      <div className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-gray-50" onClick={() => setEditingAudio(editingAudio === region.id ? null : region.id!)}>
                        <div className="flex items-center gap-3">
                          <Volume2 className="w-4 h-4 text-gray-400" />
                          <span className="text-sm font-medium text-gray-900">{region.title}</span>
                        </div>
                        <button type="button" onClick={(e) => { e.stopPropagation(); removeAudioRegion(region.id!); }} className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors">
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      {editingAudio === region.id && (
                        <div className="border-t border-gray-100 p-5 space-y-4 bg-gray-50/50">
                          <div className="grid grid-cols-2 gap-4">
                            <Field label="Title"><input value={region.title} onChange={(e) => updateAudioRegion(region.id!, "title", e.target.value)} className={inputCls} /></Field>
                            <Field label="Region Type">
                              <Select value={region.regionType} onChange={(v) => updateAudioRegion(region.id!, "regionType", v)} options={[{ value: "sphere", label: "Sphere" }, { value: "box", label: "Box" }]} />
                            </Field>
                          </div>
                          <Field label="Audio File">
                            <FileUpload onFileSelect={(f) => handleAudioRegionFileUpload(index, f)} accept="audio/*" label="Upload audio file" hint="MP3, WAV, OGG" currentFile={audioFiles[index]} />
                          </Field>
                          <div className="grid grid-cols-3 gap-4">
                            <Field label="Volume (0–1)"><input type="number" step="0.1" min="0" max="1" value={region.volume} onChange={(e) => updateAudioRegion(region.id!, "volume", parseFloat(e.target.value))} className={inputCls} /></Field>
                            <Field label="Radius (m)"><input type="number" step="0.1" value={region.radius} onChange={(e) => updateAudioRegion(region.id!, "radius", parseFloat(e.target.value))} className={inputCls} /></Field>
                            <Field label="Fade In (s)"><input type="number" step="0.1" value={region.fadeInDuration} onChange={(e) => updateAudioRegion(region.id!, "fadeInDuration", parseFloat(e.target.value))} className={inputCls} /></Field>
                          </div>
                          <div className="flex flex-wrap gap-5">
                            <Checkbox checked={region.spatialAudio ?? false} onChange={(v) => updateAudioRegion(region.id!, "spatialAudio", v)} label="Spatial Audio" description="3D HRTF positioning" />
                            <Checkbox checked={region.autoPlay ?? false} onChange={(v) => updateAudioRegion(region.id!, "autoPlay", v)} label="Auto-play on enter" />
                            <Checkbox checked={region.loop ?? false} onChange={(v) => updateAudioRegion(region.id!, "loop", v)} label="Loop" />
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                  <button type="button" onClick={addAudioRegion} className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-dashed border-gray-200 text-sm font-medium text-gray-500 hover:border-gray-400 hover:text-gray-900 transition-colors">
                    <Plus className="w-4 h-4" />Add Another Audio Region
                  </button>
                </div>
              )}
            </Section>

            {/* Effects */}
            <Section
              title="Special Effects"
              description="Add visual or sound effects triggered by visitor actions. Optional."
            >
              {effects.length === 0 ? (
                <div className="text-center py-8 border-2 border-dashed border-gray-100 rounded-xl">
                  <Zap className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                  <p className="text-sm font-semibold text-gray-700">No effects yet</p>
                  <p className="text-xs text-gray-400 mt-1 mb-4">Add fog, particles, animations and more.</p>
                  <button type="button" onClick={addEffect} className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-900 text-white text-sm font-medium hover:bg-gray-700 transition-colors">
                    <Plus className="w-4 h-4" />Add Effect
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {effects.map((effect, index) => (
                    <div key={effect.id ?? index} className="border border-gray-100 rounded-xl overflow-hidden">
                      <div className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-gray-50" onClick={() => setEditingEffect(editingEffect === effect.id ? null : effect.id!)}>
                        <div className="flex items-center gap-3">
                          <Zap className="w-4 h-4 text-gray-400" />
                          <span className="text-sm font-medium text-gray-900">{effect.effectName || `Effect ${index + 1}`}</span>
                          <span className="text-[10px] text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">{effect.effectType}</span>
                        </div>
                        <button type="button" onClick={(e) => { e.stopPropagation(); removeEffect(effect.id!); }} className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors">
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      {editingEffect === effect.id && (
                        <div className="border-t border-gray-100 p-5 space-y-4 bg-gray-50/50">
                          <div className="grid grid-cols-2 gap-4">
                            <Field label="Effect Type">
                              <Select value={effect.effectType} onChange={(v) => updateEffect(effect.id!, "effectType", v)} options={[{ value: "visual", label: "Visual" }, { value: "sound", label: "Sound" }, { value: "particle", label: "Particle" }, { value: "animation", label: "Animation" }]} />
                            </Field>
                            <Field label="Trigger">
                              <Select value={effect.triggerType} onChange={(v) => updateEffect(effect.id!, "triggerType", v)} options={[{ value: "on_enter", label: "On Enter" }, { value: "on_look", label: "On Look" }, { value: "on_click", label: "On Click" }, { value: "on_timer", label: "On Timer" }, { value: "always", label: "Always" }]} />
                            </Field>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <Field label="Effect Name"><input value={effect.effectName} onChange={(e) => updateEffect(effect.id!, "effectName", e.target.value)} placeholder="e.g., fog, rain, sparkle" className={inputCls} /></Field>
                            <Field label={`Intensity: ${effect.intensity}`}>
                              <input type="range" min="0" max="1" step="0.1" value={effect.intensity} onChange={(e) => updateEffect(effect.id!, "intensity", parseFloat(e.target.value))} className="w-full mt-2" />
                            </Field>
                          </div>
                          {effect.effectType === "sound" && (
                            <Field label="Sound File">
                              <FileUpload onFileSelect={(f) => handleEffectFileUpload(index, f)} accept="audio/*" label="Upload sound file" hint="MP3, WAV, OGG" currentFile={effectSoundFiles[index]} />
                            </Field>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                  <button type="button" onClick={addEffect} className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-dashed border-gray-200 text-sm font-medium text-gray-500 hover:border-gray-400 hover:text-gray-900 transition-colors">
                    <Plus className="w-4 h-4" />Add Another Effect
                  </button>
                </div>
              )}
            </Section>
          </div>
        )}

        {/* ── Navigation ── */}
        <div className="flex items-center justify-between pt-2 pb-8">
          <button
            type="button"
            onClick={() => setStep((s) => Math.max(1, s - 1))}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl border border-gray-200 bg-white text-sm font-medium text-gray-700 hover:border-gray-300 hover:text-gray-900 transition-colors ${step === 1 ? "invisible" : ""}`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
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
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
              </button>
            ) : (
              <button
                type="submit"
                disabled={createTourMutation.isPending}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gray-900 text-white text-sm font-semibold hover:bg-gray-700 transition-colors disabled:opacity-50"
              >
                {createTourMutation.isPending ? (
                  <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Creating…</>
                ) : (
                  <><Check className="w-4 h-4" />Create Tour</>
                )}
              </button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}
