"use client";

import { useEffect, useRef, useState } from "react";
import { VirtualTourEffect } from "@/types/tour";

interface EffectsLayerProps {
  effects: VirtualTourEffect[];
  audioEnabled: boolean;
}

interface ActiveEffect {
  effect: VirtualTourEffect;
  id: string;
}

export default function EffectsLayer({ effects, audioEnabled }: EffectsLayerProps) {
  const [activeEffects, setActiveEffects] = useState<ActiveEffect[]>([]);
  const audioNodes = useRef<{ ctx: AudioContext; source: AudioBufferSourceNode }[]>([]);

  const triggerEffect = (effect: VirtualTourEffect) => {
    const id = `${effect.id}-${Date.now()}`;
    setActiveEffects((prev) => [...prev, { effect, id }]);

    // Play sound effects
    if (effect.effectType === "sound" && effect.soundUrl && audioEnabled) {
      playSoundEffect(effect.soundUrl, effect.volume ?? effect.intensity);
    }

    // Remove effect after duration
    if (effect.duration) {
      setTimeout(() => {
        setActiveEffects((prev) => prev.filter((e) => e.id !== id));
      }, effect.duration * 1000);
    }
  };

  const playSoundEffect = async (url: string, volume: number) => {
    try {
      const ctx = new AudioContext();
      const res = await fetch(url);
      const buf = await res.arrayBuffer();
      const decoded = await ctx.decodeAudioData(buf);
      const source = ctx.createBufferSource();
      source.buffer = decoded;
      const gain = ctx.createGain();
      gain.gain.value = Math.min(1, Math.max(0, volume));
      source.connect(gain).connect(ctx.destination);
      source.start();
      audioNodes.current.push({ ctx, source });
    } catch {
      // audio may not be available
    }
  };

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];

    effects.forEach((effect) => {
      const shouldAutoTrigger =
        effect.triggerType === "always" || effect.triggerType === "on_enter";

      if (shouldAutoTrigger) {
        const delay = (effect.triggerDelay ?? 0) * 1000;
        const t = setTimeout(() => triggerEffect(effect), delay);
        timers.push(t);
      } else if (effect.triggerType === "on_timer") {
        const delay = (effect.triggerDelay ?? 0) * 1000;
        const t = setTimeout(() => triggerEffect(effect), delay);
        timers.push(t);
      }
    });

    return () => {
      timers.forEach(clearTimeout);
      audioNodes.current.forEach(({ ctx, source }) => {
        try {
          source.stop();
          ctx.close();
        } catch {
          // ignore
        }
      });
      audioNodes.current = [];
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [effects]);

  if (!activeEffects.length) return null;

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-20">
      {activeEffects.map(({ effect, id }) => (
        <EffectRenderer key={id} effect={effect} />
      ))}
    </div>
  );
}

function EffectRenderer({ effect }: { effect: VirtualTourEffect }) {
  if (effect.effectType === "visual") {
    return <VisualEffect effect={effect} />;
  }
  if (effect.effectType === "particle") {
    return <ParticleEffect effect={effect} />;
  }
  if (effect.effectType === "animation") {
    return <AnimationEffect effect={effect} />;
  }
  return null;
}

function VisualEffect({ effect }: { effect: VirtualTourEffect }) {
  const name = effect.effectName?.toLowerCase() ?? "";
  const color = effect.color ?? "#ffffff";
  const opacity = Math.min(1, effect.intensity * 0.6);

  if (name.includes("fog") || name.includes("mist")) {
    return (
      <div
        className="absolute inset-0 animate-pulse"
        style={{
          background: `radial-gradient(ellipse at center, transparent 20%, ${color}${Math.round(opacity * 255).toString(16).padStart(2, "0")} 100%)`,
          animationDuration: "4s",
        }}
      />
    );
  }

  if (name.includes("vignette") || name.includes("dark")) {
    return (
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,${opacity}) 100%)`,
        }}
      />
    );
  }

  if (name.includes("glow") || name.includes("light")) {
    return (
      <div
        className="absolute inset-0 animate-pulse"
        style={{
          background: `radial-gradient(ellipse at center, ${color}${Math.round(opacity * 100).toString(16).padStart(2, "0")} 0%, transparent 70%)`,
          animationDuration: "2s",
        }}
      />
    );
  }

  if (name.includes("flash")) {
    return (
      <div
        className="absolute inset-0"
        style={{
          background: `rgba(255,255,255,${opacity})`,
          animation: `flash ${(effect.duration ?? 0.5)}s ease-out forwards`,
        }}
      />
    );
  }

  // Generic overlay
  return (
    <div
      className="absolute inset-0"
      style={{
        background: `${color}${Math.round(opacity * 60).toString(16).padStart(2, "0")}`,
      }}
    />
  );
}

function ParticleEffect({ effect }: { effect: VirtualTourEffect }) {
  const count = Math.min(effect.particleCount ?? 20, 60);
  const color = effect.color ?? "#ffffff";
  const particles = Array.from({ length: count }, (_, i) => i);

  return (
    <div className="absolute inset-0">
      {particles.map((i) => {
        const left = Math.random() * 100;
        const delay = Math.random() * 3;
        const duration = 3 + Math.random() * 4;
        const size = (effect.size ?? 1) * (4 + Math.random() * 6);

        return (
          <div
            key={i}
            className="absolute rounded-full"
            style={{
              left: `${left}%`,
              bottom: "-10px",
              width: `${size}px`,
              height: `${size}px`,
              background: color,
              opacity: effect.opacity ?? 0.8,
              animation: `floatUp ${duration}s ${delay}s infinite ease-in`,
            }}
          />
        );
      })}
      <style>{`
        @keyframes floatUp {
          0% { transform: translateY(0) scale(1); opacity: ${effect.opacity ?? 0.8}; }
          100% { transform: translateY(-110vh) scale(0.2); opacity: 0; }
        }
        @keyframes flash {
          0% { opacity: 1; }
          100% { opacity: 0; }
        }
      `}</style>
    </div>
  );
}

function AnimationEffect({ effect }: { effect: VirtualTourEffect }) {
  const animType = effect.animationType?.toLowerCase() ?? "fade";
  const speed = effect.animationSpeed ?? 1;
  const color = effect.color ?? "#ffffff";

  const animMap: Record<string, string> = {
    fade: `fadeInOut ${2 / speed}s ease-in-out infinite`,
    pulse: `pulse ${1.5 / speed}s ease-in-out infinite`,
    shake: `shake ${0.5 / speed}s ease-in-out infinite`,
    zoom: `zoom ${2 / speed}s ease-in-out infinite`,
  };

  const animation = animMap[animType] ?? animMap.fade;

  return (
    <div
      className="absolute inset-0 flex items-center justify-center"
      style={{ animation }}
    >
      <div
        className="w-32 h-32 rounded-full"
        style={{ background: color, opacity: effect.opacity ?? 0.3 }}
      />
      <style>{`
        @keyframes fadeInOut {
          0%, 100% { opacity: 0; }
          50% { opacity: ${effect.opacity ?? 0.3}; }
        }
        @keyframes zoom {
          0%, 100% { transform: scale(0.8); }
          50% { transform: scale(1.2); }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
      `}</style>
    </div>
  );
}
