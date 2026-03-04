"use client";

import { ReactNode } from "react";

// ─── Spinner ────────────────────────────────────────────────────────────────

interface SpinnerProps {
  size?: "xs" | "sm" | "md" | "lg";
  className?: string;
}

const SPINNER_SIZE = {
  xs: "w-4 h-4 border-2",
  sm: "w-6 h-6 border-2",
  md: "w-8 h-8 border-2",
  lg: "w-12 h-12 border-[3px]",
};

export function Spinner({ size = "md", className = "" }: SpinnerProps) {
  return (
    <div
      className={`${SPINNER_SIZE[size]} rounded-full border-gray-200 border-t-gray-800 animate-spin ${className}`}
    />
  );
}

// ─── Full-page loading (covers entire screen) ───────────────────────────────

export function PageLoadingState({ message = "Loading…" }: { message?: string }) {
  return (
    <div className="fixed inset-0 bg-white flex flex-col items-center justify-center z-50">
      <Spinner size="lg" />
      {message && <p className="mt-4 text-sm text-gray-500">{message}</p>}
    </div>
  );
}

// ─── Section loading (inside a page area) ───────────────────────────────────

export function SectionLoadingState({
  message,
  className = "",
}: {
  message?: string;
  className?: string;
}) {
  return (
    <div className={`flex flex-col items-center justify-center py-16 ${className}`}>
      <Spinner size="md" />
      {message && <p className="mt-3 text-sm text-gray-400">{message}</p>}
    </div>
  );
}

// ─── Table skeleton row ──────────────────────────────────────────────────────

export function TableSkeletonRow({ cols = 5 }: { cols?: number }) {
  return (
    <tr className="border-b border-gray-100 animate-pulse">
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className="px-6 py-4">
          <div className={`h-4 bg-gray-100 rounded-full ${i === 0 ? "w-40" : i === cols - 1 ? "w-16" : "w-24"}`} />
        </td>
      ))}
    </tr>
  );
}

// ─── Dashboard table skeleton (header + rows) ───────────────────────────────

export function TableLoadingState({
  cols = 5,
  rows = 5,
  className = "",
}: {
  cols?: number;
  rows?: number;
  className?: string;
}) {
  return (
    <div className={`animate-pulse ${className}`}>
      {/* Fake header row */}
      <div className="flex items-center gap-4 px-6 py-4 border-b border-gray-100">
        <div className="h-4 w-36 bg-gray-100 rounded-full" />
        <div className="h-4 w-52 bg-gray-100 rounded-full" />
        <div className="ml-auto h-9 w-28 bg-gray-100 rounded-lg" />
      </div>
      <table className="w-full">
        <tbody>
          {Array.from({ length: rows }).map((_, i) => (
            <TableSkeletonRow key={i} cols={cols} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ─── Card skeleton ───────────────────────────────────────────────────────────

export function CardSkeletonState({
  count = 3,
  className = "",
}: {
  count?: number;
  className?: string;
}) {
  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 ${className}`}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="rounded-xl border border-gray-100 bg-white overflow-hidden animate-pulse">
          <div className="aspect-video bg-gray-100" />
          <div className="p-5 space-y-3">
            <div className="h-4 bg-gray-100 rounded-full w-3/4" />
            <div className="h-3 bg-gray-100 rounded-full w-1/2" />
            <div className="flex gap-3 pt-1">
              <div className="h-3 bg-gray-100 rounded-full w-16" />
              <div className="h-3 bg-gray-100 rounded-full w-16" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Inline text skeleton lines ──────────────────────────────────────────────

export function TextSkeleton({ lines = 3, className = "" }: { lines?: number; className?: string }) {
  const widths = ["w-full", "w-5/6", "w-4/6", "w-3/4", "w-2/3"];
  return (
    <div className={`space-y-2 animate-pulse ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <div key={i} className={`h-3 bg-gray-100 rounded-full ${widths[i % widths.length]}`} />
      ))}
    </div>
  );
}

// ─── Stat card skeleton ──────────────────────────────────────────────────────

export function StatCardSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="rounded-xl border border-gray-100 bg-white p-5 animate-pulse">
          <div className="h-3 bg-gray-100 rounded-full w-20 mb-3" />
          <div className="h-7 bg-gray-100 rounded-lg w-16 mb-1" />
          <div className="h-2.5 bg-gray-100 rounded-full w-24" />
        </div>
      ))}
    </div>
  );
}

// ─── Generic "with loading" wrapper ──────────────────────────────────────────

export function WithLoading({
  loading,
  fallback,
  children,
}: {
  loading: boolean;
  fallback?: ReactNode;
  children: ReactNode;
}) {
  if (!loading) return <>{children}</>;
  return <>{fallback ?? <SectionLoadingState />}</>;
}
