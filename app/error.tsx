"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { HomeIcon, ArrowLeftIcon, RefreshCwIcon } from "lucide-react";

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

interface Particle { id: number; x: number; y: number; size: number; delay: number; duration: number }

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [copied, setCopied] = useState(false);
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    setParticles(
      Array.from({ length: 30 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 3 + 1,
        delay: Math.random() * 5,
        duration: Math.random() * 10 + 10,
      }))
    );
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({
      x: ((e.clientX - rect.left) / rect.width - 0.5) * 2,
      y: ((e.clientY - rect.top) / rect.height - 0.5) * 2,
    });
  }, []);

  const handleCopyError = useCallback(() => {
    const text = error.digest
      ? `Error: ${error.message}\nDigest: ${error.digest}`
      : `Error: ${error.message}`;
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [error]);

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div
      className="min-h-screen bg-[#0a0a0a] flex items-center justify-center relative overflow-hidden"
      onMouseMove={handleMouseMove}
    >
      {/* Floating particles */}
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-full bg-white/3 animate-pulse"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
          }}
        />
      ))}

      {/* Spotlight glow that follows cursor */}
      <div
        className="absolute w-[600px] h-[600px] rounded-full pointer-events-none transition-transform duration-700 ease-out"
        style={{
          background: "radial-gradient(circle, rgba(255,255,255,0.03) 0%, transparent 70%)",
          left: "50%",
          top: "50%",
          transform: `translate(calc(-50% + ${mousePos.x * 80}px), calc(-50% + ${mousePos.y * 80}px))`,
        }}
      />

      {/* Subtle grid */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.3) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-2xl mx-auto">
        {/* Glitchy 500 */}
        <div className="relative mb-6 select-none">
          <h1
            className="text-[10rem] sm:text-[14rem] font-black leading-none tracking-tighter text-transparent"
            style={{
              WebkitTextStroke: "1px rgba(255,255,255,0.08)",
              transform: `translate(${mousePos.x * -5}px, ${mousePos.y * -5}px)`,
              transition: "transform 0.3s ease-out",
            }}
          >
            500
          </h1>
          <h1
            className="absolute inset-0 text-[10rem] sm:text-[14rem] font-black leading-none tracking-tighter text-white/6"
            style={{
              transform: `translate(${mousePos.x * 8}px, ${mousePos.y * 8}px)`,
              transition: "transform 0.5s ease-out",
            }}
          >
            500
          </h1>
          <h1
            className="absolute inset-0 text-[10rem] sm:text-[14rem] font-black leading-none tracking-tighter text-white/90"
            style={{
              transform: `translate(${mousePos.x * 2}px, ${mousePos.y * 2}px)`,
              transition: "transform 0.15s ease-out",
            }}
          >
            500
          </h1>
        </div>

        {/* Divider */}
        <div className="flex items-center justify-center gap-4 mb-8">
          <div className="h-px w-16 bg-white/10" />
          <span className="text-xs text-white/30 uppercase tracking-[0.3em] font-medium">
            Something broke
          </span>
          <div className="h-px w-16 bg-white/10" />
        </div>

        {/* Message */}
        <p className="text-gray-400 text-base sm:text-lg leading-relaxed mb-4 max-w-md mx-auto">
          An unexpected error occurred on our end.
        </p>
        <p className="text-gray-500 text-sm mb-8 max-w-sm mx-auto">
          The team has been notified. You can try again or return home while we
          look into this.
        </p>

        {/* Error digest — subtle, for developers */}
        {error.digest && (
          <button
            type="button"
            onClick={handleCopyError}
            className="group inline-flex items-center gap-2 px-3 py-1.5 mb-10 rounded-lg border border-white/8 bg-white/3 hover:bg-white/6 transition-colors cursor-pointer"
            title="Click to copy error details"
          >
            <span className="text-[11px] text-white/25 font-mono">
              {copied ? "Copied!" : `#${error.digest}`}
            </span>
          </button>
        )}

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            type="button"
            onClick={reset}
            className="group flex items-center gap-2.5 px-6 py-3 bg-white text-black rounded-xl font-semibold text-sm hover:bg-gray-100 transition-all duration-300 hover:scale-[1.02] w-full sm:w-auto justify-center"
          >
            <RefreshCwIcon className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" />
            Try again
          </button>

          <Link
            href="/"
            className="group flex items-center gap-2.5 px-6 py-3 border border-white/10 text-gray-300 rounded-xl font-semibold text-sm hover:bg-white/5 hover:border-white/20 transition-all duration-300 w-full sm:w-auto justify-center"
          >
            <HomeIcon className="w-4 h-4" />
            Go Home
          </Link>
        </div>

        {/* Back link */}
        <button
          type="button"
          onClick={() => window.history.back()}
          className="inline-flex items-center gap-1.5 text-xs text-gray-500 hover:text-white transition-colors mt-8 cursor-pointer"
        >
          <ArrowLeftIcon className="w-3.5 h-3.5" />
          Go back to previous page
        </button>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none"
        style={{ background: "linear-gradient(to top, #0a0a0a, transparent)" }}
      />
    </div>
  );
}
