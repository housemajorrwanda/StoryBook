"use client";

import { useState, useRef, useEffect } from "react";
import {
  LuVideo,
  LuPlay,
  LuPause,
  LuVolume2,
  LuVolumeX,
  LuSkipBack,
  LuSkipForward,
  LuMaximize,
  LuMinimize,
} from "react-icons/lu";

interface VideoPlayerProps {
  src: string;
  duration?: number;
}

export default function VideoPlayer({ src, duration }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [totalDuration, setTotalDuration] = useState(duration || 0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const updateTime = () => setCurrentTime(video.currentTime);
    const updateDuration = () => setTotalDuration(video.duration);
    const handleEnded = () => setIsPlaying(false);

    video.addEventListener("timeupdate", updateTime);
    video.addEventListener("loadedmetadata", updateDuration);
    video.addEventListener("ended", handleEnded);

    return () => {
      video.removeEventListener("timeupdate", updateTime);
      video.removeEventListener("loadedmetadata", updateDuration);
      video.removeEventListener("ended", handleEnded);
    };
  }, []);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
    } else {
      video.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const video = videoRef.current;
    if (!video) return;
    const time = parseFloat(e.target.value);
    video.currentTime = time;
    setCurrentTime(time);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const video = videoRef.current;
    if (!video) return;
    const newVolume = parseFloat(e.target.value);
    video.volume = newVolume;
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;
    if (isMuted) {
      video.volume = volume || 0.5;
      setIsMuted(false);
    } else {
      video.volume = 0;
      setIsMuted(true);
    }
  };

  const changePlaybackRate = (rate: number) => {
    const video = videoRef.current;
    if (!video) return;
    video.playbackRate = rate;
    setPlaybackRate(rate);
  };

  const skip = (seconds: number) => {
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = Math.max(0, Math.min(video.currentTime + seconds, totalDuration));
  };

  const toggleFullscreen = () => {
    const container = containerRef.current;
    if (!container) return;

    if (!isFullscreen) {
      if (container.requestFullscreen) {
        container.requestFullscreen();
      }
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
      setIsFullscreen(false);
    }
  };

  const formatTime = (time: number) => {
    if (!time || isNaN(time) || !isFinite(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const progress = totalDuration > 0 && isFinite(totalDuration) ? (currentTime / totalDuration) * 100 : 0;

  return (
    <div ref={containerRef} className="bg-black rounded-2xl overflow-hidden shadow-2xl">
      <div className="relative group">
        <video
          ref={videoRef}
          src={src}
          className="w-full aspect-video bg-black"
          preload="metadata"
          onClick={togglePlay}
        />

        {/* Overlay Controls */}
        <div className="absolute inset-0 bg-linear-to-br from-black/80 via-transparent to-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          {/* Top Bar */}
          <div className="absolute top-0 left-0 right-0 p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center">
                <LuVideo className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-white">Video Testimony</h3>
                <p className="text-gray-300 text-sm">{formatTime(totalDuration)}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {[0.5, 1, 1.5, 2].map((rate) => (
                <button
                  key={rate}
                  onClick={() => changePlaybackRate(rate)}
                  className={`px-3 py-1 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                    playbackRate === rate
                      ? "bg-white text-black"
                      : "bg-white/10 backdrop-blur-sm text-white hover:bg-white/20"
                  }`}
                >
                  {rate}×
                </button>
              ))}
            </div>
          </div>

          {/* Center Play Button */}
          {!isPlaying && (
            <div className="absolute inset-0 flex items-center justify-center">
              <button
                onClick={togglePlay}
                className="w-20 h-20 flex items-center justify-center bg-white/90 backdrop-blur-sm hover:bg-white rounded-full transition-all shadow-2xl hover:scale-110 cursor-pointer"
              >
                <LuPlay className="w-10 h-10 text-black ml-2" />
              </button>
            </div>
          )}

          {/* Bottom Controls */}
          <div className="absolute bottom-0 left-0 right-0 p-4 space-y-3">
            {/* Progress Bar */}
            <input
              type="range"
              min="0"
              max={totalDuration || 0}
              value={currentTime}
              onChange={handleSeek}
              className="w-full h-1.5 bg-white/20 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:cursor-pointer [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:shadow-lg"
              style={{
                background: `linear-gradient(to right, #ffffff ${progress}%, rgba(255,255,255,0.2) ${progress}%)`,
              }}
            />

            {/* Control Buttons */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => skip(-10)}
                  className="w-9 h-9 flex items-center justify-center text-white hover:bg-white/10 backdrop-blur-sm rounded-full transition-colors cursor-pointer"
                  title="Rewind 10s"
                >
                  <LuSkipBack className="w-5 h-5" />
                </button>

                <button
                  onClick={togglePlay}
                  className="w-11 h-11 flex items-center justify-center bg-white text-black hover:bg-gray-100 rounded-full transition-all shadow-lg cursor-pointer"
                  title="Play/Pause"
                >
                  {isPlaying ? (
                    <LuPause className="w-5 h-5" />
                  ) : (
                    <LuPlay className="w-5 h-5 ml-0.5" />
                  )}
                </button>

                <button
                  onClick={() => skip(10)}
                  className="w-9 h-9 flex items-center justify-center text-white hover:bg-white/10 backdrop-blur-sm rounded-full transition-colors cursor-pointer"
                  title="Forward 10s"
                >
                  <LuSkipForward className="w-5 h-5" />
                </button>

                <span className="text-white text-sm font-medium ml-2">
                  {formatTime(currentTime)} / {formatTime(totalDuration)}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={toggleMute}
                  className="w-9 h-9 flex items-center justify-center text-white hover:bg-white/10 backdrop-blur-sm rounded-full transition-colors cursor-pointer"
                  title="Toggle Mute"
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
                  className="w-20 h-1 bg-white/20 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:cursor-pointer [&::-moz-range-thumb]:w-3 [&::-moz-range-thumb]:h-3 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:border-0"
                />

                <button
                  onClick={toggleFullscreen}
                  className="w-9 h-9 flex items-center justify-center text-white hover:bg-white/10 backdrop-blur-sm rounded-full transition-colors cursor-pointer"
                  title="Toggle Fullscreen"
                >
                  {isFullscreen ? (
                    <LuMinimize className="w-5 h-5" />
                  ) : (
                    <LuMaximize className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

