"use client";

import { useState, ChangeEvent, FormEvent, useRef } from "react";
import { useCreateEducation } from "@/hooks/education/use-education-content";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Link from "next/link";
import { Select, Checkbox, RichTextEditor } from "@/components/shared";
import {
  LuArrowLeft,
  LuUpload,
  LuX,
  LuPlus,
  LuImage,
  LuVideo,
  LuMic,
  LuFileText,
  LuSend,
  LuSave,
  LuTag,
} from "react-icons/lu";

interface EducationFormData {
  title: string;
  description: string;
  content: string;
  type: string;
  category: string;
  tags: string[];
  status: string;
  isPublished: boolean;
  image?: File | null;
  video?: File | null;
  audio?: File | null;
}

// ─── File Drop Zone ──────────────────────────────────────────────────────────

function FileDropZone({
  onFileSelect,
  accept,
  currentFile,
  type,
  label,
  hint,
}: {
  onFileSelect: (file: File) => void;
  accept: string;
  currentFile?: File | null;
  type: "image" | "video" | "audio";
  label: string;
  hint: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  const icon = {
    image: <LuImage className="w-6 h-6 text-gray-400" />,
    video: <LuVideo className="w-6 h-6 text-blue-400" />,
    audio: <LuMic className="w-6 h-6 text-amber-400" />,
  }[type];

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) onFileSelect(file);
  };

  return (
    <div
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
      onClick={() => inputRef.current?.click()}
      className="group relative flex flex-col items-center justify-center gap-2 border-2 border-dashed border-gray-200 rounded-xl p-5 text-center cursor-pointer hover:border-gray-400 hover:bg-gray-50 transition-all"
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(e: ChangeEvent<HTMLInputElement>) => {
          const file = e.target.files?.[0];
          if (file) onFileSelect(file);
        }}
      />

      {currentFile ? (
        <>
          <div className="w-10 h-10 rounded-xl bg-gray-900 flex items-center justify-center">
            <LuUpload className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900 truncate max-w-40">
              {currentFile.name}
            </p>
            <p className="text-xs text-gray-400 mt-0.5">
              {(currentFile.size / 1024 / 1024).toFixed(1)} MB · Click to change
            </p>
          </div>
        </>
      ) : (
        <>
          {icon}
          <div>
            <p className="text-sm font-semibold text-gray-700">{label}</p>
            <p className="text-xs text-gray-400 mt-0.5">{hint}</p>
          </div>
        </>
      )}
    </div>
  );
}

// ─── Section wrapper ─────────────────────────────────────────────────────────

function Section({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 flex flex-col gap-4">
      <div>
        <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
        {description && (
          <p className="text-xs text-gray-400 mt-0.5">{description}</p>
        )}
      </div>
      {children}
    </div>
  );
}

function Field({
  label,
  required,
  children,
  hint,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
  hint?: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
        {label}
        {required && <span className="text-red-400 ml-0.5">*</span>}
      </label>
      {children}
      {hint && <p className="text-[11px] text-gray-400">{hint}</p>}
    </div>
  );
}

const inputCls =
  "w-full px-3.5 py-2.5 rounded-xl bg-white border border-gray-200 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all";

// ─── Page ────────────────────────────────────────────────────────────────────

export default function CreateEducation() {
  const { mutate: createEducation, isPending } = useCreateEducation();
  const router = useRouter();

  const [formData, setFormData] = useState<EducationFormData>({
    title: "",
    description: "",
    content: "",
    type: "article",
    category: "history",
    tags: [],
    status: "draft",
    isPublished: false,
    image: null,
    video: null,
    audio: null,
  });

  const [tagInput, setTagInput] = useState("");

  const set = <K extends keyof EducationFormData>(
    key: K,
    val: EducationFormData[K]
  ) => setFormData((p) => ({ ...p, [key]: val }));

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => set(e.target.name as keyof EducationFormData, e.target.value as EducationFormData[keyof EducationFormData]);

  const addTag = () => {
    const t = tagInput.trim();
    if (t && !formData.tags.includes(t)) {
      set("tags", [...formData.tags, t]);
      setTagInput("");
    }
  };

  const removeTag = (i: number) =>
    set("tags", formData.tags.filter((_, idx) => idx !== i));

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    const payload = new FormData();
    payload.append("title", formData.title);
    payload.append("content", formData.content);
    payload.append("type", formData.type);
    payload.append("description", formData.description || "");
    payload.append("category", formData.category || "");
    payload.append("tags", JSON.stringify(formData.tags));
    payload.append("status", formData.status || "draft");
    payload.append("isPublished", formData.isPublished.toString());
    if (formData.image) payload.append("image", formData.image);
    if (formData.video) payload.append("video", formData.video);
    if (formData.audio) payload.append("audio", formData.audio);

    createEducation(payload, {
      onSuccess: () => {
        toast.success("Education content created!");
        router.push("/dashboard/education");
      },
      onError: () => {
        toast.error("Failed to create education content");
      },
    });
  };

  const showVideo =
    formData.type === "video" ||
    formData.type === "interactive" ||
    formData.type === "timeline";
  const showAudio = formData.type === "audio";

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-20">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard/education"
              className="p-2 rounded-xl hover:bg-gray-100 text-gray-400 hover:text-gray-900 transition-colors"
            >
              <LuArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <h1 className="text-base font-bold text-gray-900 leading-none">
                Create Education Content
              </h1>
              <p className="text-xs text-gray-400 mt-0.5">
                Fill in all required fields to publish
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/dashboard/education"
              className="px-4 py-2 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </Link>
            <button
              type="button"
              form="edu-form"
              onClick={() => {
                set("status", "draft");
                set("isPublished", false);
              }}
              disabled={isPending}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              <LuSave className="w-4 h-4" />
              Save Draft
            </button>
            <button
              type="submit"
              form="edu-form"
              disabled={isPending}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gray-900 text-white text-sm font-semibold hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <LuSend className="w-4 h-4" />
              {isPending ? "Publishing..." : "Publish"}
            </button>
          </div>
        </div>
      </div>

      {/* Body */}
      <form
        id="edu-form"
        onSubmit={handleSubmit}
        className="max-w-6xl mx-auto px-6 py-8"
      >
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
          {/* ── Left column — main content ── */}
          <div className="flex flex-col gap-6">
            {/* Title + description */}
            <Section title="Basic Info" description="Title and short description visible in listings.">
              <Field label="Title" required>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="e.g. The 1994 Genocide Against the Tutsi"
                  className={inputCls}
                  required
                />
              </Field>
              <Field label="Description" hint="A brief summary shown in search results and cards.">
                <RichTextEditor
                  value={formData.description}
                  onChange={(html) => set("description", html)}
                  placeholder="Provide a concise summary of this content…"
                  minHeight={120}
                />
              </Field>
            </Section>

            {/* Rich Text Content */}
            <Section
              title="Content"
              description="Main body of the educational material. Supports rich formatting."
            >
              <RichTextEditor
                value={formData.content}
                onChange={(html) => set("content", html)}
                placeholder="Start writing your educational content here…"
                minHeight={320}
              />
              <p className="text-[11px] text-gray-400 flex items-center gap-1">
                <LuFileText className="w-3 h-3" />
                Supports headings, lists, blockquotes, links, bold/italic and more.
              </p>
            </Section>
          </div>

          {/* ── Right column — settings ── */}
          <div className="flex flex-col gap-6">
            {/* Type & category */}
            <Section title="Classification">
              <Field label="Content Type" required>
                <Select
                  value={formData.type}
                  onChange={(v) => set("type", v)}
                  options={[
                    { value: "article",     label: "Article" },
                    { value: "interactive", label: "Interactive" },
                    { value: "timeline",    label: "Timeline" },
                    { value: "video",       label: "Video" },
                    { value: "audio",       label: "Audio" },
                  ]}
                />
              </Field>
              <Field label="Category">
                <Select
                  value={formData.category}
                  onChange={(v) => set("category", v)}
                  options={[
                    { value: "history",        label: "History" },
                    { value: "prevention",     label: "Prevention" },
                    { value: "reconciliation", label: "Reconciliation" },
                    { value: "education",      label: "Education" },
                    { value: "audio",          label: "Audio" },
                  ]}
                />
              </Field>
            </Section>

            {/* Tags */}
            <Section title="Tags" description="Help readers discover this content.">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  placeholder="Add a tag…"
                  className={`${inputCls} flex-1`}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addTag();
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={addTag}
                  className="p-2.5 rounded-xl bg-gray-900 text-white hover:bg-gray-700 transition-colors"
                >
                  <LuPlus className="w-4 h-4" />
                </button>
              </div>

              {formData.tags.length > 0 ? (
                <div className="flex flex-wrap gap-1.5">
                  {formData.tags.map((tag, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center gap-1 pl-2.5 pr-1.5 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium"
                    >
                      <LuTag className="w-3 h-3 text-gray-400" />
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(i)}
                        className="ml-0.5 hover:text-red-500 transition-colors"
                      >
                        <LuX className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-gray-400">
                  No tags yet — e.g. genocide, rwanda, memory
                </p>
              )}
            </Section>

            {/* Publishing */}
            <Section title="Publishing">
              <Field label="Status">
                <Select
                  value={formData.status}
                  onChange={(v) => set("status", v)}
                  options={[
                    { value: "draft",     label: "Draft" },
                    { value: "published", label: "Published" },
                    { value: "archived",  label: "Archived" },
                  ]}
                />
              </Field>
              <div className="p-3 rounded-xl bg-gray-50 border border-gray-100">
                <Checkbox
                  checked={formData.isPublished}
                  onChange={(v) => set("isPublished", v)}
                  label="Publish immediately"
                  description="Content will be publicly available upon save"
                />
              </div>
            </Section>

            {/* Media */}
            <Section
              title="Media"
              description="Upload a featured image and optional media files."
            >
              <Field label="Featured Image">
                <FileDropZone
                  onFileSelect={(f) => set("image", f)}
                  accept="image/*"
                  currentFile={formData.image}
                  type="image"
                  label="Drop an image here"
                  hint="PNG, JPG, WebP · max 10 MB"
                />
              </Field>

              {showVideo && (
                <Field label="Video File">
                  <FileDropZone
                    onFileSelect={(f) => set("video", f)}
                    accept="video/*"
                    currentFile={formData.video}
                    type="video"
                    label="Drop a video here"
                    hint="MP4, WebM · max 500 MB"
                  />
                </Field>
              )}

              {showAudio && (
                <Field label="Audio File">
                  <FileDropZone
                    onFileSelect={(f) => set("audio", f)}
                    accept="audio/*"
                    currentFile={formData.audio}
                    type="audio"
                    label="Drop an audio file here"
                    hint="MP3, WAV, M4A · max 100 MB"
                  />
                </Field>
              )}
            </Section>
          </div>
        </div>
      </form>
    </div>
  );
}
