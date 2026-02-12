"use client";

import Link from "next/link";
import { useState, useCallback } from "react";
import { ArrowLeftIcon, HomeIcon, SearchIcon } from "lucide-react";

export default function NotFoundPage() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [particles] = useState(() =>
    Array.from({ length: 30 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
      delay: Math.random() * 5,
      duration: Math.random() * 10 + 10,
    }))
  );

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({
      x: ((e.clientX - rect.left) / rect.width - 0.5) * 2,
      y: ((e.clientY - rect.top) / rect.height - 0.5) * 2,
    });
  }, []);

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
          background:
            "radial-gradient(circle, rgba(255,255,255,0.03) 0%, transparent 70%)",
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
        {/* Glitchy 404 */}
        <div className="relative mb-6 select-none">
          <h1
            className="text-[10rem] sm:text-[14rem] font-black leading-none tracking-tighter text-transparent"
            style={{
              WebkitTextStroke: "1px rgba(255,255,255,0.08)",
              transform: `translate(${mousePos.x * -5}px, ${mousePos.y * -5}px)`,
              transition: "transform 0.3s ease-out",
            }}
          >
            404
          </h1>
          <h1
            className="absolute inset-0 text-[10rem] sm:text-[14rem] font-black leading-none tracking-tighter text-white/6"
            style={{
              transform: `translate(${mousePos.x * 8}px, ${mousePos.y * 8}px)`,
              transition: "transform 0.5s ease-out",
            }}
          >
            404
          </h1>
          <h1
            className="absolute inset-0 text-[10rem] sm:text-[14rem] font-black leading-none tracking-tighter text-white/90"
            style={{
              transform: `translate(${mousePos.x * 2}px, ${mousePos.y * 2}px)`,
              transition: "transform 0.15s ease-out",
            }}
          >
            404
          </h1>
        </div>

        {/* Divider line */}
        <div className="flex items-center justify-center gap-4 mb-8">
          <div className="h-px w-16 bg-linear-to-r from-transparent to-white/20" />
          <span className="text-xs text-white/30 uppercase tracking-[0.3em] font-medium">
            Lost in memory
          </span>
          <div className="h-px w-16 bg-linear-to-l from-transparent to-white/20" />
        </div>

        {/* Message */}
        <p className="text-gray-400 text-base sm:text-lg leading-relaxed mb-4 max-w-md mx-auto">
          This page doesn&apos;t exist, but every story does.
        </p>
        <p className="text-gray-500 text-sm mb-12 max-w-sm mx-auto">
          The page you&apos;re looking for may have been moved or no longer
          exists. Let&apos;s get you back to preserving history.
        </p>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/"
            className="group flex items-center gap-2.5 px-6 py-3 bg-white text-black rounded-xl font-semibold text-sm hover:bg-gray-100 transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(255,255,255,0.1)] w-full sm:w-auto justify-center"
          >
            <HomeIcon className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            Go Home
          </Link>

          <Link
            href="/#testimonies"
            className="group flex items-center gap-2.5 px-6 py-3 border border-white/10 text-gray-300 rounded-xl font-semibold text-sm hover:bg-white/5 hover:border-white/20 transition-all duration-300 w-full sm:w-auto justify-center"
          >
            <SearchIcon className="w-4 h-4" />
            Browse Testimonies
          </Link>
        </div>

        {/* Back link */}
        <button
          type="button"
          onClick={() => {
            if (typeof window !== "undefined") {
              window.history.back();
            }
          }}
          className="inline-flex items-center gap-1.5 text-xs text-gray-500 hover:text-white transition-colors mt-8 cursor-pointer"
        >
          <ArrowLeftIcon className="w-3.5 h-3.5" />
          Go back to previous page
        </button>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-linear-to-t from-[#0a0a0a] to-transparent pointer-events-none" />

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
      `}</style>
    </div>
  );
}
