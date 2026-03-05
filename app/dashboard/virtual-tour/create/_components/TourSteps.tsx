"use client";

import { Plus, Image, Video, Box, Globe, MapPin, Check } from "lucide-react";
import { Select, Checkbox } from "@/components/shared";
import { CreateVirtualTourRequest } from "@/types/tour";
import { Section, Field, FileUpload, inputCls } from "./shared";

const TOUR_TYPES = [
  { value: "360_image", label: "360° Image", description: "Panoramic photo tour with hotspots", icon: Image, accept: "image/*", hint: "JPG, PNG, WebP — equirectangular format" },
  { value: "360_video", label: "360° Video", description: "Immersive spherical video experience", icon: Video, accept: "video/*", hint: "MP4, WebM — equirectangular format" },
  { value: "3d_model", label: "3D Model", description: "Interactive 3D model viewer with AR", icon: Box, accept: ".glb,.gltf,.obj,.fbx", hint: "GLB, GLTF, OBJ, FBX" },
  { value: "embed", label: "Embed Tour", description: "Embed from Matterport, Google, etc.", icon: Globe, accept: "", hint: "Paste an embed URL" },
] as const;

export type TourType = (typeof TOUR_TYPES)[number]["value"];
export { TOUR_TYPES };

const MEDIA_HINTS: Record<string, string[]> = {
  "360_image": ["An equirectangular panoramic image (JPG/PNG/WebP)", "Ideally 4096×2048px or larger for best quality"],
  "360_video": ["An equirectangular 360° video (MP4/WebM)", "Recommended: 4K resolution for immersive quality"],
  "3d_model": ["A 3D model file (GLB is recommended)", "GLB/GLTF includes textures — preferred for web"],
  "embed": ["A public embed URL from your tour provider", "Matterport, Kuula, Google Street View supported"],
};
const MEDIA_OPTIONAL: Record<string, string> = {
  "360_image": "Optional: hotspot markers for points of interest",
  "360_video": "Optional: spatial audio regions along the video",
  "3d_model": "AR viewing supported on mobile browsers",
  "embed": "The URL must be publicly accessible",
};

// ─── Step 1: Tour Type ────────────────────────────────────────────────────────

export function TourTypeStep({ value, onChange }: { value: TourType; onChange: (v: TourType) => void }) {
  return (
    <Section title="Choose Your Tour Type" description="Select the type of experience you want to create. You can always change this later.">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {TOUR_TYPES.map((type) => {
          const Icon = type.icon;
          const active = value === type.value;
          return (
            <button
              key={type.value}
              type="button"
              onClick={() => onChange(type.value)}
              className={`text-left p-5 rounded-xl border-2 transition-all duration-150 ${active ? "border-gray-900 bg-gray-50" : "border-gray-100 bg-white hover:border-gray-300"}`}
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
                  <Check className="w-3 h-3" /> Selected
                </div>
              )}
            </button>
          );
        })}
      </div>
    </Section>
  );
}

// ─── Step 2: Basic Info ───────────────────────────────────────────────────────

export function BasicInfoStep({
  formData,
  onChange,
}: {
  formData: CreateVirtualTourRequest;
  onChange: (updates: Partial<CreateVirtualTourRequest>) => void;
}) {
  return (
    <Section title="Tour Details" description="Tell visitors what this tour is about.">
      <div className="space-y-5">
        <Field label="Tour Title" required>
          <input type="text" value={formData.title} onChange={(e) => onChange({ title: e.target.value })} placeholder="e.g., National Museum Virtual Tour" className={inputCls} required />
        </Field>

        <Field label="Description">
          <textarea value={formData.description} onChange={(e) => onChange({ description: e.target.value })} placeholder="Describe what visitors will experience..." rows={4} className={`${inputCls} resize-none`} />
        </Field>

        <Field label="Location" required>
          <div className="relative">
            <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            <input type="text" value={formData.location} onChange={(e) => onChange({ location: e.target.value })} placeholder="e.g., Kigali Genocide Memorial, Rwanda" className={`${inputCls} pl-10`} required />
          </div>
        </Field>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Status">
            <Select
              value={formData.status}
              onChange={(v) => onChange({ status: v as typeof formData.status })}
              options={[
                { value: "draft", label: "Draft", description: "Not visible to public" },
                { value: "published", label: "Published", description: "Visible to everyone" },
                { value: "archived", label: "Archived", description: "Hidden from listings" },
              ]}
            />
          </Field>
          <Field label="Visibility">
            <div className="h-10 flex items-center">
              <Checkbox checked={formData.isPublished} onChange={(v) => onChange({ isPublished: v })} label="Publish immediately" description="Goes live right away" />
            </div>
          </Field>
        </div>
      </div>
    </Section>
  );
}

// ─── Step 3: Media ────────────────────────────────────────────────────────────

export function MediaStep({
  formData,
  tourFile,
  onEmbedUrlChange,
  onFileSelect,
}: {
  formData: CreateVirtualTourRequest;
  tourFile: File | null;
  onEmbedUrlChange: (url: string) => void;
  onFileSelect: (f: File) => void;
}) {
  const tourType = TOUR_TYPES.find((t) => t.value === formData.tourType)!;
  const hints = MEDIA_HINTS[formData.tourType] ?? [];
  const optional = MEDIA_OPTIONAL[formData.tourType];

  return (
    <Section
      title={`Upload Your ${tourType.label}`}
      description={formData.tourType === "embed" ? "Paste the embed URL from your tour provider." : `Upload the main file for your tour. ${tourType.hint}.`}
    >
      {formData.tourType === "embed" ? (
        <Field label="Embed URL" required>
          <div className="relative">
            <Globe className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            <input type="url" value={formData.embedUrl} onChange={(e) => onEmbedUrlChange(e.target.value)} placeholder="https://my.matterport.com/show/?m=..." className={`${inputCls} pl-10`} required />
          </div>
          <p className="text-xs text-gray-400 mt-1">Supports Matterport, Google Street View, Kuula, and other embed providers.</p>
        </Field>
      ) : (
        <FileUpload
          onFileSelect={onFileSelect}
          accept={tourType.accept}
          label={`Click or drag to upload ${tourType.label}`}
          hint={tourType.hint}
          currentFile={tourFile || undefined}
          maxSizeMb={{ "360_image": 10, "3d_model": 10, "360_video": 10, "embed": undefined }[formData.tourType]}
        />
      )}

      <div className="mt-5 p-4 rounded-xl bg-gray-50 border border-gray-100">
        <p className="text-xs font-semibold text-gray-700 mb-2">What you need for this tour type:</p>
        <ul className="space-y-1.5">
          {hints.map((h) => (
            <li key={h} className="flex items-center gap-2 text-xs text-gray-500">
              <Check className="w-3.5 h-3.5 text-green-500 shrink-0" /> {h}
            </li>
          ))}
          {optional && (
            <li className="flex items-center gap-2 text-xs text-gray-400">
              <Plus className="w-3.5 h-3.5 shrink-0" /> {optional}
            </li>
          )}
        </ul>
      </div>
    </Section>
  );
}
