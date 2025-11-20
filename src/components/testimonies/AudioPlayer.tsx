"use client";

import { useState, useRef, useEffect } from "react";
import {
  LuMic,
  LuClock,
  LuPlay,
  LuPause,
  LuVolume2,
  LuVolumeX,
  LuSkipBack,
  LuSkipForward,
} from "react-icons/lu";

interface AudioPlayerProps {
  src: string;
  duration?: number;
}

export default function AudioPlayer({ src, duration }: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number | undefined>(undefined);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const dataArrayRef = useRef<Uint8Array | null>(null);
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);
  const isSetupRef = useRef(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [totalDuration, setTotalDuration] = useState(duration || 0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [audioError, setAudioError] = useState<string | null>(null);

  // Update audio src when it changes
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !src) return;

    console.log("[AudioPlayer] Loading audio from:", src);
    setAudioError(null);
    setIsPlaying(false);
    
    // Ensure audio is not muted and volume is set
    audio.muted = false;
    audio.volume = isMuted ? 0 : volume;
    
    // Set src and load
    audio.src = src;
    try {
      audio.load();
    } catch (err) {
      console.error("[AudioPlayer] Load error:", err);
      setAudioError("Failed to load audio file");
    }
  }, [src, volume, isMuted]);
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.muted !== isMuted) {
      audio.muted = isMuted;
    }
    const targetVolume = isMuted ? 0 : volume;
    if (Math.abs(audio.volume - targetVolume) > 0.05) {
      audio.volume = targetVolume;
    }
  }, [volume, isMuted]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => {
      const time = audio.currentTime;
      setCurrentTime(time);
      // Log if audio is actually playing
      if (!audio.paused && time > 0) {
        console.log("[AudioPlayer] Audio playing, time:", time, "duration:", audio.duration);
      }
    };
    const updateDuration = () => {
      if (audio.duration && isFinite(audio.duration) && audio.duration > 0) {
        console.log("[AudioPlayer] Duration loaded:", audio.duration);
        setTotalDuration(audio.duration);
      } else if (duration && duration > 0) {
        // Fallback to prop duration if audio element doesn't provide it
        console.log("[AudioPlayer] Using prop duration:", duration);
        setTotalDuration(duration);
      }
    };
    const handleEnded = () => setIsPlaying(false);
    const handleError = (e: Event) => {
      console.error("[AudioPlayer] Audio error:", e);
      const error = (e.target as HTMLAudioElement).error;
      if (error) {
        let errorMessage = "Unknown error";
        switch (error.code) {
          case error.MEDIA_ERR_ABORTED:
            errorMessage = "Audio loading aborted";
            break;
          case error.MEDIA_ERR_NETWORK:
            errorMessage = "Network error loading audio";
            break;
          case error.MEDIA_ERR_DECODE:
            errorMessage = "Audio decoding error";
            break;
          case error.MEDIA_ERR_SRC_NOT_SUPPORTED:
            errorMessage = "Audio format not supported";
            break;
        }
        console.error("[AudioPlayer] Error code:", error.code, "Message:", errorMessage);
        setAudioError(errorMessage);
      }
    };
    const handleCanPlay = () => {
      if (audio.duration && isFinite(audio.duration) && audio.duration > 0) {
        console.log("[AudioPlayer] Can play, duration:", audio.duration);
        setTotalDuration(audio.duration);
      }
    };
    const handleLoadedData = () => {
      if (audio.duration && isFinite(audio.duration) && audio.duration > 0) {
        console.log("[AudioPlayer] Data loaded, duration:", audio.duration);
        setTotalDuration(audio.duration);
      }
    };

    audio.addEventListener("timeupdate", updateTime);
    audio.addEventListener("loadedmetadata", updateDuration);
    audio.addEventListener("canplay", handleCanPlay);
    audio.addEventListener("loadeddata", handleLoadedData);
    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("error", handleError);

    // Try to load the audio
    audio.load();

    return () => {
      audio.removeEventListener("timeupdate", updateTime);
      audio.removeEventListener("loadedmetadata", updateDuration);
      audio.removeEventListener("canplay", handleCanPlay);
      audio.removeEventListener("loadeddata", handleLoadedData);
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("error", handleError);
    };
  }, [src, duration]);

  // Initialize Web Audio API for frequency visualization
  useEffect(() => {
    const audio = audioRef.current;
    const canvas = canvasRef.current;
    if (!audio || !canvas) return;

    // Reset setup flag if audio src changes
    if (src) {
      isSetupRef.current = false;
      sourceRef.current = null;
    }

    const setupAudioContext = async () => {
      try {
        if (isSetupRef.current || sourceRef.current) {
          return;
        }

        // Wait for audio to be ready
        if (audio.readyState === 0) {
          console.log("[AudioPlayer] Waiting for audio to load before setting up visualization...");
          const handleCanPlay = () => {
            audio.removeEventListener("canplay", handleCanPlay);
            setupAudioContext();
          };
          audio.addEventListener("canplay", handleCanPlay, { once: true });
          return;
        }

        const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        const audioContext = new AudioContextClass();
        
        // Resume audio context if suspended (required for user interaction)
        if (audioContext.state === 'suspended') {
          await audioContext.resume();
        }
        
        const analyser = audioContext.createAnalyser();
        
        try {
          sourceRef.current = audioContext.createMediaElementSource(audio);
        } catch (error) {
          console.error("[AudioPlayer] Error creating audio source:", error);
          console.warn("[AudioPlayer] Audio element already connected. Skipping frequency visualization.");
          audioContext.close();
          return;
        }

        const source = sourceRef.current;
        if (!source) {
          console.error("[AudioPlayer] Failed to create audio source");
          return;
        }

        analyser.fftSize = 256;
        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);

        source.connect(analyser);
        analyser.connect(audioContext.destination);

        audioContextRef.current = audioContext;
        analyserRef.current = analyser;
        dataArrayRef.current = dataArray;
        isSetupRef.current = true;

        console.log("[AudioPlayer] Frequency visualization setup complete");

        // Start visualization loop
        const draw = () => {
          if (!analyserRef.current || !canvas || !dataArrayRef.current) {
            if (animationFrameRef.current) {
              cancelAnimationFrame(animationFrameRef.current);
            }
            return;
          }

          animationFrameRef.current = requestAnimationFrame(draw);

          analyserRef.current.getByteFrequencyData(dataArrayRef.current);

          const ctx = canvas.getContext("2d");
          if (!ctx) return;

          // Set canvas size if not set
          if (canvas.width === 0 || canvas.height === 0) {
            canvas.width = canvas.offsetWidth || 600;
            canvas.height = canvas.offsetHeight || 120;
          }

          const width = canvas.width;
          const height = canvas.height;

          // Clear canvas
          ctx.fillStyle = "rgba(17, 24, 39, 0.1)";
          ctx.fillRect(0, 0, width, height);

          const barWidth = (width / bufferLength) * 2.5;
          let barHeight;
          let x = 0;

          for (let i = 0; i < bufferLength; i++) {
            barHeight = (dataArrayRef.current[i] / 255) * height * 0.8;

            const gradient = ctx.createLinearGradient(0, height, 0, height - barHeight);
            gradient.addColorStop(0, "#ffffff");
            gradient.addColorStop(0.5, "#60a5fa");
            gradient.addColorStop(1, "#3b82f6");

            ctx.fillStyle = gradient;
            ctx.fillRect(x, height - barHeight, barWidth - 1, barHeight);

            x += barWidth + 1;
          }
        };

        draw();
      } catch (error) {
        console.error("[AudioPlayer] Error setting up audio context:", error);
        isSetupRef.current = false;
      }
    };

    setupAudioContext();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (audioContextRef.current && audioContextRef.current.state !== "closed") {
        audioContextRef.current.close().catch(console.error);
      }
      // Reset setup flag when src changes
      isSetupRef.current = false;
      sourceRef.current = null;
    };
  }, [src]);

  const togglePlay = async () => {
    const audio = audioRef.current;
    if (!audio) {
      console.error("[AudioPlayer] Audio element not found");
      return;
    }

    console.log("[AudioPlayer] Toggle play clicked, current state:", {
      isPlaying,
      readyState: audio.readyState,
      paused: audio.paused,
      src: audio.src,
      duration: audio.duration,
    });

    try {
      if (isPlaying) {
        audio.pause();
        setIsPlaying(false);
        console.log("[AudioPlayer] Audio paused");
      } else {
        // Resume audio context if it exists and is suspended
        if (audioContextRef.current && audioContextRef.current.state === 'suspended') {
          try {
            await audioContextRef.current.resume();
            console.log("[AudioPlayer] Audio context resumed");
          } catch (err) {
            console.warn("[AudioPlayer] Failed to resume audio context:", err);
          }
        }
        
        // Check if audio is ready to play
        if (audio.readyState >= 2) { // HAVE_CURRENT_DATA or higher
          console.log("[AudioPlayer] Audio ready, attempting to play...");
          try {
            const playPromise = audio.play();
            if (playPromise !== undefined) {
              await playPromise;
            }
            console.log("[AudioPlayer] Play successful, paused:", audio.paused, "currentTime:", audio.currentTime);
            // Don't set isPlaying here - let the onPlay event handler do it
          } catch (playError) {
            console.error("[AudioPlayer] Play promise rejected:", playError);
            setIsPlaying(false);
            // Check if it's an autoplay restriction
            if (playError instanceof Error && playError.name === "NotAllowedError") {
              setAudioError("Browser blocked autoplay. Please click play again.");
            } else {
              setAudioError("Unable to play audio. Please check your browser settings.");
            }
          }
        } else {
          console.warn("[AudioPlayer] Audio not ready (readyState:", audio.readyState, "), waiting for data...");
          // Wait for audio to be ready
          const handleCanPlay = () => {
            console.log("[AudioPlayer] Audio can now play, attempting playback...");
            audio.play()
              .then(() => {
                console.log("[AudioPlayer] Play successful after waiting");
                setIsPlaying(true);
                audio.removeEventListener("canplay", handleCanPlay);
              })
              .catch((err) => {
                console.error("[AudioPlayer] Play error after waiting:", err);
                if (err instanceof Error && err.name === "NotAllowedError") {
                  setAudioError("Browser blocked autoplay. Please click play again.");
                } else {
                  setAudioError("Unable to play audio. Please check your browser settings.");
                }
                audio.removeEventListener("canplay", handleCanPlay);
              });
          };
          audio.addEventListener("canplay", handleCanPlay, { once: true });
          // Force reload if needed
          if (audio.readyState === 0) {
            audio.load();
          }
        }
      }
    } catch (error) {
      console.error("[AudioPlayer] Play/pause error:", error);
      setAudioError("Unable to play audio. Please check your browser settings.");
      setIsPlaying(false);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    if (!audio) return;
    const time = parseFloat(e.target.value);
    audio.currentTime = time;
    setCurrentTime(time);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();
    const audio = audioRef.current;
    if (!audio) return;
    
    const newVolume = parseFloat(e.target.value);
    const wasPlaying = !audio.paused; // Check actual audio state, not React state
    
    // Update volume directly on audio element
    audio.volume = newVolume;
    audio.muted = false; // Don't mute, just set volume to 0
    
    // Update state
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
    
    // Volume changes should never pause audio - if it does, resume it
    if (wasPlaying && audio.paused) {
      console.log("[AudioPlayer] Audio paused during volume change, resuming...");
      audio.play().catch((err) => {
        console.warn("[AudioPlayer] Failed to resume after volume change:", err);
      });
    }
  };

  const toggleMute = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const audio = audioRef.current;
    if (!audio) return;
    
    const wasPlaying = !audio.paused;
    const newMutedState = !isMuted;
    
    if (newMutedState) {
      // Muting
      audio.muted = true;
      setIsMuted(true);
    } else {
      // Unmuting
      audio.muted = false;
      setIsMuted(false);
      // Restore volume if it was 0
      if (volume === 0) {
        const restoredVolume = 0.5;
        audio.volume = restoredVolume;
        setVolume(restoredVolume);
      }
    }
    
    // Ensure audio continues playing if it was playing
    if (wasPlaying && audio.paused) {
      console.log("[AudioPlayer] Resuming playback after mute toggle");
      audio.play().catch((err) => {
        console.warn("[AudioPlayer] Failed to resume after mute:", err);
      });
    }
  };

  const changePlaybackRate = (rate: number) => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.playbackRate = rate;
    setPlaybackRate(rate);
  };

  const skip = (seconds: number) => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = Math.max(0, Math.min(audio.currentTime + seconds, totalDuration));
  };

  const formatTime = (time: number) => {
    if (!time || isNaN(time) || !isFinite(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const progress = totalDuration > 0 && isFinite(totalDuration) ? (currentTime / totalDuration) * 100 : 0;

  return (
    <div className="bg-linear-to-br from-gray-900 via-gray-900 to-gray-900 rounded-2xl p-6 shadow-2xl">
      <audio 
        ref={audioRef} 
        src={src} 
        preload="auto"
        crossOrigin="anonymous"
        onError={(e) => {
          console.error("[AudioPlayer] Audio element error:", e);
          const audio = e.target as HTMLAudioElement;
          if (audio.error) {
            console.error("[AudioPlayer] Error code:", audio.error.code);
          }
        }}
        onPlay={() => {
          console.log("[AudioPlayer] Audio started playing, currentTime:", audioRef.current?.currentTime);
          setIsPlaying(true);
          // Resume audio context if suspended
          if (audioContextRef.current && audioContextRef.current.state === 'suspended') {
            audioContextRef.current.resume().catch(err => {
              console.warn("[AudioPlayer] Failed to resume context on play:", err);
            });
          }
        }}
        onPause={() => {
          console.log("[AudioPlayer] Audio paused, currentTime:", audioRef.current?.currentTime);
          setIsPlaying(false);
        }}
        onTimeUpdate={() => {
          // This helps ensure the audio is actually playing
          if (audioRef.current && !audioRef.current.paused && audioRef.current.currentTime > 0) {
            setIsPlaying(true);
          }
        }}
        onLoadedMetadata={() => {
          const duration = audioRef.current?.duration;
          console.log("[AudioPlayer] Metadata loaded, duration:", duration, "readyState:", audioRef.current?.readyState);
          if (duration && isFinite(duration) && duration > 0) {
            setTotalDuration(duration);
          } else {
            // If duration is still Infinity, wait for more data
            console.warn("[AudioPlayer] Duration not available yet, waiting for more data...");
          }
        }}
        onDurationChange={() => {
          const duration = audioRef.current?.duration;
          console.log("[AudioPlayer] Duration changed:", duration);
          if (duration && isFinite(duration) && duration > 0) {
            setTotalDuration(duration);
          }
        }}
        onCanPlay={() => {
          console.log("[AudioPlayer] Can play, readyState:", audioRef.current?.readyState);
        }}
        onWaiting={() => {
          console.log("[AudioPlayer] Waiting for data...");
        }}
        onStalled={() => {
          console.warn("[AudioPlayer] Audio stalled");
        }}
      />

      <div className="flex items-center gap-4 mb-6">
        <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center">
          <LuMic className="w-6 h-6 text-white" />
        </div>
        <div className="flex-1">
          <h3 className="font-bold text-white text-lg">Audio Testimony</h3>
          <p className="text-gray-400 text-sm">High-quality recording</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full">
          <LuClock className="w-4 h-4 text-gray-300" />
          <span className="text-sm text-gray-300">{formatTime(totalDuration)}</span>
        </div>
      </div>

      {/* Error Message */}
      {audioError && (
        <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg">
          <p className="text-red-300 text-sm">{audioError}</p>
        </div>
      )}

      {/* Audio Frequency Visualization */}
      <div className="mb-6">
        <canvas
          ref={canvasRef}
          width={600}
          height={120}
          className="w-full h-24 bg-gray-900/50 rounded-xl"
        />
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <input
          type="range"
          min="0"
          max={totalDuration && isFinite(totalDuration) ? totalDuration : 0}
          value={currentTime}
          onChange={handleSeek}
          className="w-full h-2 bg-white/20 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:cursor-pointer [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:shadow-lg [&::-moz-range-thumb]:cursor-pointer"
          style={{
            background: `linear-gradient(to right, #ffffff ${progress}%, rgba(255,255,255,0.2) ${progress}%)`,
          }}
        />
        <div className="flex justify-between mt-2 text-sm text-gray-400">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(totalDuration)}</span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between gap-4">
        {/* Left: Playback Controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => skip(-10)}
            className="w-10 h-10 flex items-center justify-center text-white hover:bg-white/10 rounded-full transition-colors cursor-pointer"
            title="Rewind 10s"
          >
            <LuSkipBack className="w-5 h-5" />
          </button>

          <button
            onClick={togglePlay}
            type="button"
            className="w-14 h-14 flex items-center justify-center bg-white text-gray-900 hover:bg-gray-100 rounded-full transition-all shadow-lg hover:shadow-xl cursor-pointer"
            disabled={!src || !!audioError}
            title={audioError ? "Audio error" : isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? (
              <LuPause className="w-6 h-6" />
            ) : (
              <LuPlay className="w-6 h-6 ml-1" />
            )}
          </button>

          <button
            onClick={() => skip(10)}
            className="w-10 h-10 flex items-center justify-center text-white hover:bg-white/10 rounded-full transition-colors cursor-pointer"
            title="Forward 10s"
          >
            <LuSkipForward className="w-5 h-5" />
          </button>
        </div>

        {/* Center: Playback Speed */}
        <div className="flex items-center gap-2">
          {[0.5, 0.75, 1, 1.25, 1.5, 2].map((rate) => (
            <button
              key={rate}
              onClick={() => changePlaybackRate(rate)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                playbackRate === rate
                  ? "bg-white text-gray-900 shadow-md"
                  : "text-gray-400 hover:text-white hover:bg-white/10"
              }`}
            >
              {rate}×
            </button>
          ))}
        </div>

        {/* Right: Volume Control */}
        <div 
          className="flex items-center gap-3"
          onClick={(e) => e.stopPropagation()}
          onMouseDown={(e) => e.stopPropagation()}
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleMute(e);
            }}
            type="button"
            className="w-10 h-10 flex items-center justify-center text-white hover:bg-white/10 rounded-full transition-colors cursor-pointer"
          >
            {isMuted || volume === 0 ? (
              <LuVolumeX className="w-5 h-5" />
            ) : (
              <LuVolume2 className="w-5 h-5" />
            )}
          </button>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={isMuted ? 0 : volume}
            onChange={handleVolumeChange}
            onClick={(e) => e.stopPropagation()}
            onMouseDown={(e) => e.stopPropagation()}
            onTouchStart={(e) => e.stopPropagation()}
            className="w-24 h-1.5 bg-white/20 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:cursor-pointer [&::-moz-range-thumb]:w-3 [&::-moz-range-thumb]:h-3 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:border-0"
          />
        </div>
      </div>
    </div>
  );
}

