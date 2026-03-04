"use client";

import { useState, useRef, useEffect, useId } from "react";
import { LuChevronDown, LuCheck } from "react-icons/lu";

export interface SelectOption {
  value: string;
  label: string;
  /** Optional description shown below label */
  description?: string;
  disabled?: boolean;
}

interface SelectProps {
  options: SelectOption[];
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  label?: string;
  /** Shown below the field */
  hint?: string;
  error?: string;
  disabled?: boolean;
  /** Visual size */
  size?: "sm" | "md" | "lg";
  className?: string;
}

const SIZE = {
  sm: "h-8 px-3 text-xs",
  md: "h-10 px-3.5 text-sm",
  lg: "h-12 px-4 text-sm",
};

export default function Select({
  options,
  value,
  onChange,
  placeholder = "Select an option",
  label,
  hint,
  error,
  disabled = false,
  size = "md",
  className = "",
}: SelectProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const id = useId();

  const selected = options.find((o) => o.value === value);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open]);

  const handleSelect = (option: SelectOption) => {
    if (option.disabled) return;
    onChange?.(option.value);
    setOpen(false);
  };

  return (
    <div className={`flex flex-col gap-1.5 ${className}`} ref={ref}>
      {label && (
        <label htmlFor={id} className="text-xs font-medium text-gray-700">
          {label}
        </label>
      )}

      {/* Trigger */}
      <button
        id={id}
        type="button"
        disabled={disabled}
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className={`relative flex items-center justify-between w-full rounded-xl border bg-white transition-all duration-150 focus:outline-none ${SIZE[size]} ${
          error
            ? "border-red-300 focus:border-red-400 focus:ring-2 focus:ring-red-100"
            : open
            ? "border-gray-300 ring-2 ring-gray-100"
            : "border-gray-200 hover:border-gray-300"
        } ${disabled ? "opacity-50 cursor-not-allowed bg-gray-50" : "cursor-pointer"}`}
      >
        <span
          className={`truncate font-medium ${
            selected ? "text-gray-900" : "text-gray-400"
          }`}
        >
          {selected?.label ?? placeholder}
        </span>
        <LuChevronDown
          className={`w-4 h-4 text-gray-400 shrink-0 ml-2 transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute z-50 mt-1 w-full" style={{ top: "100%" }}>
          {/* Use a portal-like positioning via parent relative */}
        </div>
      )}

      {/* Inline dropdown (simpler, no portal needed) */}
      {open && (
        <div
          role="listbox"
          className="relative z-50 w-full bg-white border border-gray-100 rounded-xl shadow-xl shadow-gray-200/50 overflow-hidden"
          style={{ marginTop: "-4px" }}
        >
          <div className="max-h-52 overflow-y-auto custom-scrollbar py-1">
            {options.length === 0 ? (
              <p className="px-4 py-3 text-sm text-gray-400 text-center">No options</p>
            ) : (
              options.map((option) => {
                const isSelected = option.value === value;
                return (
                  <button
                    key={option.value}
                    type="button"
                    role="option"
                    aria-selected={isSelected}
                    disabled={option.disabled}
                    onClick={() => handleSelect(option)}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 text-left transition-colors duration-100 ${
                      option.disabled
                        ? "opacity-40 cursor-not-allowed"
                        : isSelected
                        ? "bg-gray-50"
                        : "hover:bg-gray-50"
                    }`}
                  >
                    <div className="min-w-0">
                      <p
                        className={`text-sm truncate ${
                          isSelected ? "font-semibold text-gray-900" : "font-medium text-gray-700"
                        }`}
                      >
                        {option.label}
                      </p>
                      {option.description && (
                        <p className="text-[11px] text-gray-400 truncate mt-0.5">
                          {option.description}
                        </p>
                      )}
                    </div>
                    {isSelected && (
                      <LuCheck className="w-3.5 h-3.5 text-gray-900 shrink-0 ml-3" />
                    )}
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* Hint / error */}
      {error ? (
        <p className="text-xs text-red-500 font-medium">{error}</p>
      ) : hint ? (
        <p className="text-xs text-gray-400">{hint}</p>
      ) : null}
    </div>
  );
}
