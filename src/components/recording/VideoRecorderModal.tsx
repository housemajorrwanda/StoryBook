"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import {
  LuVideo,
  LuSquare,
  LuPlay,
  LuPause,
  LuTrash2,
  LuDownload,
  LuVideoOff,
  LuX,
  LuInfo,
  LuSettings,
} from "react-icons/lu";

interface VideoRecorderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRecordingComplete: (videoBlob: Blob) => void;
}

export default function VideoRecorderModal({
  isOpen,
  onClose,
  onRecordingComplete,
}: VideoRecorderModalProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [videoBlob, setVideoBlob] = useState<Blob | null>(null);
  const [videoURL, setVideoURL] = useState<string>("");
  const [isPlaying, setIsPlaying] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [error, setError] = useState<string>("");
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [availableDevices, setAvailableDevices] = useState<MediaDeviceInfo[]>(
    []
  );
  const [selectedDeviceId, setSelectedDeviceId] = useState<string>("");
  const [isLoadingDevices, setIsLoadingDevices] = useState(false);
  const [isStartingPreview, setIsStartingPreview] = useState(false);
  const [showDeviceSelector, setShowDeviceSelector] = useState(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const previewRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const startTimer = useCallback(() => {
    timerRef.current = setInterval(() => {
      setRecordingTime((prev) => prev + 1);
    }, 1000);
  }, []);

  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const formatTime = useCallback((seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  }, []);

  const stopAllTracks = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  }, []);

  const resetState = useCallback(() => {
    setIsRecording(false);
    setIsPaused(false);
    setVideoBlob(null);
    setVideoURL("");
    setIsPlaying(false);
    setRecordingTime(0);
    setError("");
    setIsPreviewMode(false);
    setShowDeviceSelector(false);
    stopTimer();
    stopAllTracks();
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current = null;
    }
  }, [stopTimer, stopAllTracks]);

  const getVideoDevices = useCallback(async () => {
    try {
      setIsLoadingDevices(true);
      setError("");

      await navigator.mediaDevices.getUserMedia({ video: true });

      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter(
        (device) => device.kind === "videoinput"
      );

      setAvailableDevices(videoDevices);

      if (videoDevices.length > 0 && !selectedDeviceId) {
        setSelectedDeviceId(videoDevices[0].deviceId);
      }

      return videoDevices;
    } catch (err) {
      console.error("Failed to get video devices:", err);
      setError(
        "Cannot access camera devices. Please allow camera permissions and try again."
      );
      return [];
    } finally {
      setIsLoadingDevices(false);
    }
  }, [selectedDeviceId]);

  const startPreview = useCallback(async () => {
    try {
      setError("");

      if (!selectedDeviceId && availableDevices.length === 0) {
        const devices = await getVideoDevices();
        if (devices.length === 0) {
          setError(
            "No camera devices found. Please connect a camera and try again."
          );
          return;
        }
      }

      const constraints = {
        video: {
          deviceId: selectedDeviceId ? { exact: selectedDeviceId } : undefined,
          width: { min: 640, ideal: 1280, max: 1920 },
          height: { min: 480, ideal: 720, max: 1080 },
          frameRate: { ideal: 30, max: 60 },
        },
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100,
        },
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;

      if (previewRef.current) {
        previewRef.current.srcObject = stream;
        previewRef.current.muted = true;
        previewRef.current.playsInline = true;

        await new Promise((resolve, reject) => {
          const video = previewRef.current!;
          const onLoadedMetadata = () => {
            video.play().then(resolve).catch(reject);
          };
          video.onloadedmetadata = onLoadedMetadata;
          video.onerror = reject;
          setTimeout(() => reject(new Error("Video loading timeout")), 10000);
        });
      }

      setIsPreviewMode(true);
    } catch (err: unknown) {
      let errorMessage = "Could not access camera. ";
      if (err instanceof Error) {
        if (err.name === "NotFoundError") {
          errorMessage +=
            "No camera found. Please connect a camera and try again.";
        } else if (err.name === "NotAllowedError") {
          errorMessage +=
            "Camera permission denied. Please allow camera access and try again.";
        } else if (err.name === "NotReadableError") {
          errorMessage +=
            "Camera is being used by another application. Please close other apps using the camera.";
        } else {
          errorMessage += `Error: ${err.message || "Unknown error"}`;
        }
      }
      setError(errorMessage);
    }
  }, [selectedDeviceId, availableDevices, getVideoDevices]);

  useEffect(() => {
    if (isOpen && availableDevices.length === 0) {
      getVideoDevices();
    }
  }, [isOpen, availableDevices.length, getVideoDevices]);

  useEffect(() => {
    if (
      isOpen &&
      selectedDeviceId &&
      !isPreviewMode &&
      !isRecording &&
      !isStartingPreview &&
      availableDevices.length > 0
    ) {
      setIsStartingPreview(true);
      setTimeout(() => {
        startPreview().finally(() => setIsStartingPreview(false));
      }, 500);
    }
  }, [
    isOpen,
    selectedDeviceId,
    isPreviewMode,
    isRecording,
    isStartingPreview,
    availableDevices,
    startPreview,
  ]);

  const startRecording = async () => {
    if (!streamRef.current) {
      await startPreview();
      return;
    }

    try {
      const mediaRecorder = new MediaRecorder(streamRef.current, {
        mimeType: MediaRecorder.isTypeSupported("video/webm")
          ? "video/webm"
          : "video/mp4",
      });

      chunksRef.current = [];
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "video/webm" });
        const url = URL.createObjectURL(blob);

        setVideoBlob(blob);
        setVideoURL(url);

        stopAllTracks();
        setIsPreviewMode(false);
      };

      mediaRecorder.start(1000);
      setIsRecording(true);
      setRecordingTime(0);
      startTimer();
    } catch (err) {
      console.error("Failed to start recording:", err);
      setError("Failed to start recording. Please try again.");
    }
  };

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setIsPaused(false);
      stopTimer();
    }
  }, [isRecording, stopTimer]);

  const pauseRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      if (isPaused) {
        mediaRecorderRef.current.resume();
        setIsPaused(false);
        startTimer();
      } else {
        mediaRecorderRef.current.pause();
        setIsPaused(true);
        stopTimer();
      }
    }
  };

  const playVideo = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  const handleSave = () => {
    if (videoBlob) {
      onRecordingComplete(videoBlob);
      onClose();
      resetState();
    }
  };

  const handleClose = useCallback(() => {
    if (isRecording) {
      stopRecording();
    }
    onClose();
    resetState();
  }, [isRecording, onClose, resetState, stopRecording]);

  const downloadVideo = () => {
    if (videoBlob) {
      const url = URL.createObjectURL(videoBlob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `testimony-video-${Date.now()}.webm`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  const stopPreview = () => {
    stopAllTracks();
    setIsPreviewMode(false);
  };

  const handleDeviceChange = (deviceId: string) => {
    setSelectedDeviceId(deviceId);
    setShowDeviceSelector(false);
    if (isPreviewMode) {
      stopPreview();
      setTimeout(() => startPreview(), 100);
    }
  };

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        handleClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, handleClose]);

  useEffect(() => {
    return () => {
      stopAllTracks();
      stopTimer();
    };
  }, [stopAllTracks, stopTimer]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            Video Recording
          </h2>
          <div className="flex items-center gap-2">
            {availableDevices.length > 1 && (isPreviewMode || isRecording) && (
              <button
                onClick={() => setShowDeviceSelector(!showDeviceSelector)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200 cursor-pointer"
                title="Switch camera"
              >
                <LuSettings className="w-5 h-5 text-gray-500" />
              </button>
            )}
            <button
              onClick={handleClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200 cursor-pointer"
            >
              <LuX className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Error Message */}
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 text-sm font-medium mb-2">
                ⚠️ Camera Issue
              </p>
              <p className="text-red-700 text-sm">{error}</p>
              <div className="mt-3 flex gap-2">
                <button
                  onClick={getVideoDevices}
                  className="text-xs px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors cursor-pointer"
                >
                  Refresh Cameras
                </button>
                <button
                  onClick={() => setError("")}
                  className="text-xs px-3 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors cursor-pointer"
                >
                  Dismiss
                </button>
              </div>
            </div>
          )}

          {/* Camera Selector Dropdown */}
          {showDeviceSelector && availableDevices.length > 1 && (
            <div className="mb-4 p-4 bg-white border border-gray-300 rounded-xl shadow-lg">
              <h3 className="text-sm font-medium text-gray-900 mb-3">
                Select Camera
              </h3>
              <div className="space-y-2">
                {availableDevices.map((device) => (
                  <button
                    key={device.deviceId}
                    onClick={() => handleDeviceChange(device.deviceId)}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-colors duration-200 cursor-pointer ${
                      selectedDeviceId === device.deviceId
                        ? "bg-gray-100 border border-gray-300"
                        : "hover:bg-gray-50"
                    }`}
                  >
                    <div className="text-sm font-medium text-gray-900">
                      {device.label ||
                        `Camera ${device.deviceId.slice(0, 8)}...`}
                    </div>
                    {selectedDeviceId === device.deviceId && (
                      <div className="text-xs text-gray-500 mt-1">
                        ✓ Selected
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Video Display Area */}
          <div className="aspect-video bg-gray-900 rounded-xl overflow-hidden mb-6 relative">
            {isPreviewMode || isRecording ? (
              <video
                ref={previewRef}
                autoPlay
                muted
                playsInline
                className="w-full h-full object-cover"
              />
            ) : videoBlob ? (
              <>
                <video
                  ref={videoRef}
                  src={videoURL}
                  controls={false}
                  playsInline
                  onEnded={() => setIsPlaying(false)}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 right-4 bg-gray-600 text-white px-3 py-1 rounded-lg text-sm font-medium">
                  ✓ Recording Ready
                </div>
              </>
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <div className="text-center">
                  <LuVideoOff className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                  <p className="text-gray-500">
                    Click &quot;Start Camera&quot; to begin
                  </p>
                  <p className="text-xs text-gray-400 mt-2">
                    Make sure to allow camera and microphone permissions
                  </p>
                </div>
              </div>
            )}

            {/* Recording Indicator */}
            {isRecording && (
              <div className="absolute top-4 left-4">
                <div className="flex items-center gap-2 bg-black/70 text-white px-3 py-2 rounded-lg">
                  <div
                    className={`w-3 h-3 rounded-full ${
                      isPaused ? "bg-gray-400" : "bg-red-500"
                    } animate-pulse`}
                  ></div>
                  <span className="text-sm font-medium">
                    {isPaused ? "Paused" : "REC"}
                  </span>
                  <span className="font-mono text-sm">
                    {formatTime(recordingTime)}
                  </span>
                </div>
              </div>
            )}

            {/* Play Button Overlay */}
            {videoBlob && !isPlaying && (
              <div className="absolute inset-0 flex items-center justify-center">
                <button
                  onClick={playVideo}
                  className="w-16 h-16 bg-black/70 hover:bg-black/80 text-white rounded-full flex items-center justify-center transition-colors duration-200 cursor-pointer"
                >
                  <LuPlay className="w-8 h-8 ml-1" />
                </button>
              </div>
            )}
          </div>

          {/* Status Display */}
          <div className="text-center mb-6">
            {videoBlob ? (
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
                  <span className="text-lg font-semibold text-gray-800">
                    Video Recording Complete!
                  </span>
                </div>
                <div className="text-sm text-gray-700 mb-2">
                  Duration: {formatTime(recordingTime)}
                </div>
                <p className="text-sm text-gray-600">
                  Click &quot;Use Recording&quot; below to add this to your
                  testimony
                </p>
              </div>
            ) : isRecording ? (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                  <span className="text-lg font-semibold text-red-800">
                    {isPaused ? "Recording Paused" : "Recording in Progress"}
                  </span>
                </div>
                <div className="text-xl font-mono font-bold text-red-900">
                  {formatTime(recordingTime)}
                </div>
                <p className="text-sm text-red-600 mt-2">
                  {isPaused
                    ? "Click Resume to continue"
                    : "Click Stop when finished"}
                </p>
              </div>
            ) : null}
          </div>

          {/* Control Buttons */}
          <div className="flex justify-center gap-3">
            {!isRecording && !videoBlob && !isPreviewMode && (
              <button
                onClick={startPreview}
                disabled={isLoadingDevices || isStartingPreview}
                className="flex items-center gap-2 px-6 py-3 bg-black text-white rounded-xl font-semibold hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 cursor-pointer"
              >
                <LuVideo className="w-5 h-5" />
                {isLoadingDevices ? "Loading Cameras..." : "Start Camera"}
              </button>
            )}

            {isPreviewMode && !isRecording && (
              <>
                <button
                  onClick={startRecording}
                  className="flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition-colors duration-200 cursor-pointer"
                >
                  <LuVideo className="w-5 h-5" />
                  Start Recording
                </button>
                <button
                  onClick={stopPreview}
                  className="flex items-center gap-2 px-4 py-3 bg-gray-500 text-white rounded-xl font-semibold hover:bg-gray-600 transition-colors duration-200 cursor-pointer"
                >
                  <LuVideoOff className="w-4 h-4" />
                  Stop Camera
                </button>
              </>
            )}

            {isRecording && (
              <>
                <button
                  onClick={pauseRecording}
                  className="flex items-center gap-2 px-4 py-3 bg-gray-500 text-white rounded-xl font-semibold hover:bg-gray-600 transition-colors duration-200 cursor-pointer"
                >
                  {isPaused ? (
                    <LuPlay className="w-4 h-4" />
                  ) : (
                    <LuPause className="w-4 h-4" />
                  )}
                  {isPaused ? "Resume" : "Pause"}
                </button>
                <button
                  onClick={stopRecording}
                  className="flex items-center gap-2 px-4 py-3 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition-colors duration-200 cursor-pointer"
                >
                  <LuSquare className="w-4 h-4" />
                  Stop
                </button>
              </>
            )}

            {videoBlob && (
              <>
                <button
                  onClick={playVideo}
                  className="flex items-center gap-2 px-4 py-3 bg-gray-600 text-white rounded-xl font-semibold hover:bg-gray-700 transition-colors duration-200 cursor-pointer"
                >
                  {isPlaying ? (
                    <LuPause className="w-4 h-4" />
                  ) : (
                    <LuPlay className="w-4 h-4" />
                  )}
                  {isPlaying ? "Pause" : "Play"}
                </button>
                <button
                  onClick={downloadVideo}
                  className="flex items-center gap-2 px-4 py-3 bg-gray-500 text-white rounded-xl font-semibold hover:bg-gray-600 transition-colors duration-200 cursor-pointer"
                >
                  <LuDownload className="w-4 h-4" />
                  Download
                </button>
                <button
                  onClick={() => {
                    setVideoBlob(null);
                    setVideoURL("");
                    setRecordingTime(0);
                    setIsPlaying(false);
                  }}
                  className="flex items-center gap-2 px-4 py-3 bg-gray-400 text-white rounded-xl font-semibold hover:bg-gray-500 transition-colors duration-200 cursor-pointer"
                >
                  <LuTrash2 className="w-4 h-4" />
                  Clear
                </button>
              </>
            )}
          </div>

          {/* Recording Tips */}
          {!isRecording && !videoBlob && (
            <div className="mt-4 p-3 bg-gray-50 rounded-lg flex items-center justify-center gap-2">
              <p className="text-xs text-gray-600 text-center flex items-center justify-center gap-2">
                <LuInfo className="w-4 h-4" />
                Ensure good lighting and speak clearly. Look directly at the
                camera for best results.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        {videoBlob ? (
          <div className="p-6 border-t border-gray-200 bg-gray-50 rounded-b-2xl">
            <div className="flex flex-col gap-4">
              <div>
                <p className="text-sm font-medium text-gray-800 mb-1">
                  🎉 Your video is ready!
                </p>
                <p className="text-xs text-gray-600">
                  This will be added to your testimony
                </p>
              </div>
              <div className="flex justify-end gap-3">
                <button
                  onClick={handleClose}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium transition-colors duration-200 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="px-8 py-3 bg-black text-white rounded-xl font-semibold hover:bg-gray-800 transition-all duration-200 transform hover:scale-105 shadow-lg cursor-pointer"
                >
                  Use This Recording
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-4 border-t border-gray-200 bg-gray-50 rounded-b-2xl">
            <div className="flex items-center justify-center">
              <button
                onClick={handleClose}
                className="px-6 py-2 text-gray-600 hover:text-gray-800 font-medium transition-colors duration-200 cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
