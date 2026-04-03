"use client";

import { useEffect, useRef, useState } from "react";
import { VirtualTourEffect } from "@/types/tour";
import "./effects-layer.css";

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

    if (effect.effectType === "sound" && effect.soundUrl && audioEnabled) {
      playSoundEffect(effect.soundUrl, effect.intensity);
    }

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
        effect.triggerType === "always" ||
        effect.triggerType === "on_enter" ||
        effect.triggerType === "on_timer";

      if (shouldAutoTrigger) {
        const delay = (effect.triggerDelay ?? 0) * 1000;
        const t = setTimeout(() => triggerEffect(effect), delay);
        timers.push(t);
      }
    });

    return () => {
      timers.forEach(clearTimeout);
      audioNodes.current.forEach(({ ctx, source }) => {
        try { source.stop(); ctx.close(); } catch { /* ignore */ }
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

// ── Positioning ──────────────────────────────────────────────────────────────
// Returns className + style (only left/top/width/height — non-dynamic structural
// values are in the CSS file, dynamic values use CSS custom properties).

function useEffectPlacement(effect: VirtualTourEffect) {
  const x = effect.positionX;
  const y = effect.positionY;
  const isPositioned = x != null && y != null && (x !== 0 || y !== 0);
  const size = Math.round((effect.size ?? 1) * 160);

  if (isPositioned) {
    return {
      className: "vt-effect vt-effect-positioned",
      placement: {
        left: `${x! * 100}%`,
        top: `${y! * 100}%`,
        width: `${size}px`,
        height: `${size}px`,
      } as React.CSSProperties,
    };
  }
  return {
    className: "vt-effect vt-effect-fullscreen",
    placement: {} as React.CSSProperties,
  };
}

// ── Renderers ────────────────────────────────────────────────────────────────

function EffectRenderer({ effect }: { effect: VirtualTourEffect }) {
  if (effect.effectType === "visual")    return <VisualEffect effect={effect} />;
  if (effect.effectType === "particle")  return <ParticleEffect effect={effect} />;
  if (effect.effectType === "animation") return <AnimationEffect effect={effect} />;
  return null;
}

function VisualEffect({ effect }: { effect: VirtualTourEffect }) {
  const name    = effect.effectName?.toLowerCase() ?? "";
  const color   = effect.color ?? "#ffffff";
  const opacity = Math.min(1, effect.intensity * 0.6);
  const { className, placement } = useEffectPlacement(effect);

  // Convert hex/named color + alpha to rgba for CSS custom properties
  const alphaHex = Math.round(opacity * 255).toString(16).padStart(2, "0");
  const dimHex   = Math.round(opacity * 100).toString(16).padStart(2, "0");

  if (name.includes("fog") || name.includes("mist")) {
    const vars = {
      "--vt-color-alpha":  `${color}${alphaHex}`,
      "--vt-opacity-hi":   String(opacity),
      "--vt-opacity-lo":   String(opacity * 0.4),
    } as React.CSSProperties;
    return <div className={`${className} vt-fog`} style={{ ...placement, ...vars }} />;
  }

  if (name.includes("vignette") || name.includes("dark")) {
    const vars = {
      "--vt-shadow": `rgba(0,0,0,${opacity})`,
    } as React.CSSProperties;
    return <div className={`${className} vt-vignette`} style={{ ...placement, ...vars }} />;
  }

  if (name.includes("glow") || name.includes("light")) {
    const vars = {
      "--vt-color-dim":   `${color}${dimHex}`,
      "--vt-opacity-lo":  String(opacity * 0.6),
      "--vt-opacity-hi":  String(opacity),
    } as React.CSSProperties;
    return <div className={`${className} vt-glow`} style={{ ...placement, ...vars }} />;
  }

  if (name.includes("flash")) {
    const vars = {
      "--vt-flash-color": `rgba(255,255,255,${opacity})`,
      "--vt-duration":    `${effect.duration ?? 0.5}s`,
    } as React.CSSProperties;
    return <div className={`${className} vt-flash`} style={{ ...placement, ...vars }} />;
  }

  // Generic overlay
  const vars = {
    "--vt-overlay-color": `${color}${Math.round(opacity * 60).toString(16).padStart(2, "0")}`,
  } as React.CSSProperties;
  return <div className={`${className} vt-overlay`} style={{ ...placement, ...vars }} />;
}

function ParticleEffect({ effect }: { effect: VirtualTourEffect }) {
  const count = Math.min(effect.particleCount ?? 20, 60);
  const color = effect.color ?? "#ffffff";
  const { className, placement } = useEffectPlacement(effect);

  const [particles] = useState(() =>
    Array.from({ length: count }, (_, i) => ({
      id: i,
      left:     Math.random() * 100,
      delay:    Math.random() * 3,
      duration: 3 + Math.random() * 4,
      size:     (effect.size ?? 1) * (4 + Math.random() * 6),
    })),
  );

  return (
    <div className={`${className} vt-particle-container`} style={placement}>
      {particles.map((p) => (
        <div
          key={p.id}
          className="vt-particle"
          style={{
            left:                        `${p.left}%`,
            bottom:                      "-10px",
            width:                       `${p.size}px`,
            height:                      `${p.size}px`,
            background:                  color,
            "--vt-opacity":              String(effect.opacity ?? 0.8),
            "--vt-particle-duration":    `${p.duration}s`,
            "--vt-particle-delay":       `${p.delay}s`,
          } as React.CSSProperties}
        />
      ))}
    </div>
  );
}

function AnimationEffect({ effect }: { effect: VirtualTourEffect }) {
  const animType = effect.animationType?.toLowerCase() ?? "fade";
  const speed    = effect.animationSpeed ?? 1;
  const durationMap: Record<string, number> = {
    fade: 2, pulse: 1.5, shake: 0.5, zoom: 2,
  };
  const baseDuration = durationMap[animType] ?? 2;
  const { className, placement } = useEffectPlacement(effect);

  const animClass = `vt-anim-${["fade", "pulse", "shake", "zoom"].includes(animType) ? animType : "fade"}`;

  const vars = {
    "--vt-color":    effect.color ?? "#ffffff",
    "--vt-opacity":  String(effect.opacity ?? 0.3),
    "--vt-duration": `${baseDuration / speed}s`,
  } as React.CSSProperties;

  return (
    <div className={`${className} vt-animation-wrapper`} style={{ ...placement, ...vars }}>
      <div className={`vt-animation-orb ${animClass}`} />
    </div>
  );
}
