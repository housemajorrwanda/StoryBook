"use client";

import { useEffect, useRef } from "react";
import { VirtualTourAudioRegion } from "@/types/tour";

interface AudioNode_ {
  source: AudioBufferSourceNode;
  gainNode: GainNode;
  panner?: PannerNode;
  region: VirtualTourAudioRegion;
}

export function useSpatialAudio(
  audioRegions: VirtualTourAudioRegion[],
  audioEnabled: boolean
) {
  const ctxRef = useRef<AudioContext | null>(null);
  const nodesRef = useRef<AudioNode_[]>([]);

  const fadeVolume = (
    gainNode: GainNode,
    targetVolume: number,
    durationSec: number
  ) => {
    const ctx = ctxRef.current;
    if (!ctx) return;
    gainNode.gain.cancelScheduledValues(ctx.currentTime);
    gainNode.gain.setValueAtTime(gainNode.gain.value, ctx.currentTime);
    gainNode.gain.linearRampToValueAtTime(
      targetVolume,
      ctx.currentTime + durationSec
    );
  };

  // Resume / suspend based on audioEnabled toggle
  useEffect(() => {
    const ctx = ctxRef.current;
    if (!ctx) return;
    if (audioEnabled) {
      ctx.resume();
      nodesRef.current.forEach(({ gainNode, region }) => {
        const fadeIn = region.fadeInDuration ?? 0.5;
        fadeVolume(gainNode, region.volume, fadeIn);
      });
    } else {
      nodesRef.current.forEach(({ gainNode }) => {
        fadeVolume(gainNode, 0, 0.3);
      });
      setTimeout(() => ctx.suspend(), 400);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [audioEnabled]);

  // Bootstrap audio regions
  useEffect(() => {
    if (!audioRegions.length) return;

    const autoPlayRegions = audioRegions.filter((r) => r.autoPlay && r.audioUrl);
    if (!autoPlayRegions.length) return;

    let ctx: AudioContext;
    try {
      ctx = new AudioContext();
      ctxRef.current = ctx;
    } catch {
      return;
    }

    const loadAndPlay = async (region: VirtualTourAudioRegion) => {
      try {
        const res = await fetch(region.audioUrl);
        const arrayBuffer = await res.arrayBuffer();
        const audioBuffer = await ctx.decodeAudioData(arrayBuffer);

        const source = ctx.createBufferSource();
        source.buffer = audioBuffer;
        source.loop = region.loop;

        const gainNode = ctx.createGain();
        gainNode.gain.setValueAtTime(0, ctx.currentTime);

        let destination: AudioNode = gainNode;

        if (region.spatialAudio) {
          const panner = ctx.createPanner();
          panner.panningModel = "HRTF";
          panner.distanceModel = "inverse";
          panner.refDistance = region.minDistance ?? 1;
          panner.maxDistance = region.maxDistance ?? 100;
          panner.rolloffFactor = 1;
          panner.setPosition(region.centerX, region.centerY, region.centerZ);
          gainNode.connect(panner);
          panner.connect(ctx.destination);

          nodesRef.current.push({ source, gainNode, panner, region });
        } else {
          gainNode.connect(ctx.destination);
          nodesRef.current.push({ source, gainNode, region });
        }

        source.connect(gainNode);
        source.start(0);

        const fadeIn = region.fadeInDuration ?? 0.5;
        fadeVolume(gainNode, audioEnabled ? region.volume : 0, fadeIn);
      } catch {
        // silently skip if audio fails to load
      }
    };

    autoPlayRegions.forEach((region) => {
      loadAndPlay(region);
    });

    return () => {
      nodesRef.current.forEach(({ source, gainNode }) => {
        try {
          gainNode.gain.setValueAtTime(0, ctx.currentTime);
          source.stop();
        } catch {
          // already stopped
        }
      });
      nodesRef.current = [];
      ctx.close();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [audioRegions]);
}
