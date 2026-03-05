"use client";

import { Upload, Check } from "lucide-react";

// ─── Input class ──────────────────────────────────────────────────────────────

export const inputCls =
  "w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-white text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-100 transition-all";

// ─── Section wrapper ──────────────────────────────────────────────────────────

export function Section({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-7">
      <div className="mb-6">
        <h2 className="text-base font-semibold text-gray-900">{title}</h2>
        {description && (
          <p className="text-sm text-gray-400 mt-1">{description}</p>
        )}
      </div>
      {children}
    </div>
  );
}

// ─── Field wrapper ────────────────────────────────────────────────────────────

export function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
        {label}
        {required && <span className="text-red-400 ml-0.5">*</span>}
      </label>
      {children}
    </div>
  );
}

// ─── File Upload ──────────────────────────────────────────────────────────────

export function FileUpload({
  onFileSelect,
  accept,
  label,
  hint,
  currentFile,
  maxSizeMb,
}: {
  onFileSelect: (file: File) => void;
  accept: string;
  label: string;
  hint?: string;
  currentFile?: File;
  maxSizeMb?: number;
}) {
  const inputId = `file-${label.replace(/\s+/g, "-")}`;
  const tooLarge = currentFile && maxSizeMb ? currentFile.size > maxSizeMb * 1024 * 1024 : false;

  return (
    <div className="space-y-2">
      <label
        htmlFor={inputId}
        className={`flex flex-col items-center justify-center gap-3 w-full p-8 rounded-xl border-2 border-dashed transition-colors cursor-pointer ${
          tooLarge
            ? "border-red-300 bg-red-50"
            : currentFile
              ? "border-gray-900 bg-gray-50"
              : "border-gray-200 bg-white hover:border-gray-400 hover:bg-gray-50"
        }`}
      >
        <input
          id={inputId}
          type="file"
          accept={accept}
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (!f) return;
            if (maxSizeMb && f.size > maxSizeMb * 1024 * 1024) {
              onFileSelect(f); // still set it so the error shows
              return;
            }
            onFileSelect(f);
          }}
        />
        {currentFile ? (
          <>
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${tooLarge ? "bg-red-500" : "bg-gray-900"}`}>
              <Check className="w-5 h-5 text-white" />
            </div>
            <div className="text-center">
              <p className={`text-sm font-semibold ${tooLarge ? "text-red-700" : "text-gray-900"}`}>
                {currentFile.name}
              </p>
              <p className={`text-xs mt-0.5 ${tooLarge ? "text-red-500" : "text-gray-400"}`}>
                {(currentFile.size / 1024 / 1024).toFixed(2)} MB — click to change
              </p>
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
      {tooLarge && maxSizeMb && (
        <p className="text-xs text-red-600 flex items-center gap-1.5">
          <span className="w-1 h-1 rounded-full bg-red-500 shrink-0 inline-block" />
          File exceeds the {maxSizeMb} MB limit. Please choose a smaller file.
        </p>
      )}
      {maxSizeMb && !tooLarge && (
        <p className="text-xs text-gray-400">Max size: {maxSizeMb} MB</p>
      )}
    </div>
  );
}

// ─── Step indicator ───────────────────────────────────────────────────────────

const STEPS = [
  { id: 1, label: "Tour Type" },
  { id: 2, label: "Basic Info" },
  { id: 3, label: "Media" },
  { id: 4, label: "Hotspots" },
  { id: 5, label: "Audio & Effects" },
];

export function StepIndicator({ current }: { current: number }) {
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
              <span
                className={`text-[10px] font-medium whitespace-nowrap ${active ? "text-gray-900" : "text-gray-400"}`}
              >
                {step.label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div
                className={`h-px w-10 mx-1 mb-4 ${done ? "bg-gray-900" : "bg-gray-200"}`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
