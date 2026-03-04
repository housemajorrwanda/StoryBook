"use client";

import { useId } from "react";
import { LuCheck } from "react-icons/lu";

interface CheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  description?: string;
  disabled?: boolean;
  className?: string;
}

export default function Checkbox({
  checked,
  onChange,
  label,
  description,
  disabled = false,
  className = "",
}: CheckboxProps) {
  const id = useId();

  return (
    <label
      htmlFor={id}
      className={`flex items-start gap-3 cursor-pointer group ${disabled ? "opacity-50 cursor-not-allowed" : ""} ${className}`}
    >
      {/* Hidden native checkbox for a11y */}
      <input
        id={id}
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={(e) => onChange(e.target.checked)}
        className="sr-only"
      />

      {/* Custom box */}
      <div
        className={`relative flex items-center justify-center w-5 h-5 rounded-md border-2 shrink-0 mt-0.5 transition-all duration-150 ${
          checked
            ? "bg-gray-900 border-gray-900"
            : "bg-white border-gray-200 group-hover:border-gray-400"
        }`}
      >
        {checked && (
          <LuCheck className="w-3 h-3 text-white" strokeWidth={3} />
        )}
      </div>

      {/* Text */}
      {(label || description) && (
        <div className="flex flex-col gap-0.5 min-w-0">
          {label && (
            <span className="text-sm font-medium text-gray-900 leading-tight">
              {label}
            </span>
          )}
          {description && (
            <span className="text-xs text-gray-400 leading-snug">{description}</span>
          )}
        </div>
      )}
    </label>
  );
}
