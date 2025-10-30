"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import {
  LuMic,
  LuSquare,
  LuPlay,
  LuPause,
  LuTrash2,
  LuDownload,
  LuX,
  LuInfo,
  LuSettings,
} from "react-icons/lu";

interface AudioRecorderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRecordingComplete: (audioBlob: Blob) => void;
}

export default function AudioRecorderModal({
  isOpen,
  onClose,
  onRecordingComplete,
}: AudioRecorderModalProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioURL, setAudioURL] = useState<string>("");
  const [isPlaying, setIsPlaying] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [error, setError] = useState<string>("");
  const [availableDevices, setAvailableDevices] = useState<MediaDeviceInfo[]>(
    []
  );
  const [selectedDeviceId, setSelectedDeviceId] = useState<string>("");
  const [isLoadingDevices, setIsLoadingDevices] = useState(false);
  const [showDeviceSelector, setShowDeviceSelector] = useState(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
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
    setAudioBlob(null);
    setAudioURL("");
    setIsPlaying(false);
    setRecordingTime(0);
    setError("");
    setShowDeviceSelector(false);
    stopTimer();
    stopAllTracks();
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current = null;
    }
  }, [stopTimer, stopAllTracks]);

  const getAudioDevices = useCallback(async () => {
    try {
      setIsLoadingDevices(true);
      setError("");

      await navigator.mediaDevices.getUserMedia({ audio: true });

      const devices = await navigator.mediaDevices.enumerateDevices();
      const audioDevices = devices.filter(
        (device) => device.kind === "audioinput"
      );

      setAvailableDevices(audioDevices);

      if (audioDevices.length > 0 && !selectedDeviceId) {
        setSelectedDeviceId(audioDevices[0].deviceId);
      }

      return audioDevices;
    } catch (err) {
      console.error("Failed to get audio devices:", err);
      setError(
        "Cannot access microphone devices. Please allow microphone permissions and try again."
      );
      return [];
    } finally {
      setIsLoadingDevices(false);
    }
  }, [selectedDeviceId]);

  const startRecording = async () => {
    try {
      setError("");

      const constraints = {
        audio: {
          deviceId: selectedDeviceId ? { exact: selectedDeviceId } : undefined,
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100,
        },
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: MediaRecorder.isTypeSupported("audio/webm")
          ? "audio/webm"
          : "audio/mp4",
      });

      chunksRef.current = [];
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        const url = URL.createObjectURL(blob);

        setAudioBlob(blob);
        setAudioURL(url);

        stopAllTracks();
      };

      mediaRecorder.start(1000);
      setIsRecording(true);
      setRecordingTime(0);
      startTimer();
    } catch (err) {
      setError("Could not access microphone. Please check permissions.");
      console.error("Error accessing microphone:", err);
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

  const playAudio = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  const handleSave = () => {
    if (audioBlob) {
      onRecordingComplete(audioBlob);
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

  const downloadAudio = () => {
    if (audioBlob) {
      const url = URL.createObjectURL(audioBlob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `testimony-audio-${Date.now()}.webm`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  const handleDeviceChange = (deviceId: string) => {
    setSelectedDeviceId(deviceId);
    setShowDeviceSelector(false);
    if (isRecording) {
      stopRecording();
    }
  };

  // Initialize devices when modal opens
  useEffect(() => {
    if (isOpen && availableDevices.length === 0) {
      getAudioDevices();
    }
  }, [isOpen, availableDevices.length, getAudioDevices]);

  // Handle escape key
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

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopAllTracks();
      stopTimer();
    };
  }, [stopAllTracks, stopTimer]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            Audio Recording
          </h2>
          <div className="flex items-center gap-2">
            {availableDevices.length > 1 && (
              <button
                onClick={() => setShowDeviceSelector(!showDeviceSelector)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200 cursor-pointer"
                title="Select microphone"
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
                ⚠️ Microphone Issue
              </p>
              <p className="text-red-700 text-sm">{error}</p>
              <div className="mt-3 flex gap-2">
                <button
                  onClick={getAudioDevices}
                  className="text-xs px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors cursor-pointer"
                >
                  Refresh Microphones
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

          {/* Microphone Selector Dropdown */}
          {showDeviceSelector && availableDevices.length > 1 && (
            <div className="mb-4 p-4 bg-white border border-gray-300 rounded-xl shadow-lg">
              <h3 className="text-sm font-medium text-gray-900 mb-3">
                Select Microphone
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
                        `Microphone ${device.deviceId.slice(0, 8)}...`}
                    </div>
                    {selectedDeviceId === device.deviceId && (
                      <div className="text-xs text-gray-500 mt-1">Selected</div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Recording Status */}
          <div className="text-center mb-6">
            {isRecording ? (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <div
                    className={`w-3 h-3 rounded-full ${
                      isPaused ? "bg-gray-500" : "bg-red-500"
                    } animate-pulse`}
                  ></div>
                  <span className="text-lg font-semibold text-red-800">
                    {isPaused ? "Recording Paused" : "Recording in Progress"}
                  </span>
                </div>
                <div className="text-2xl font-mono font-bold text-red-900">
                  {formatTime(recordingTime)}
                </div>
                <p className="text-sm text-red-600 mt-2">
                  {isPaused
                    ? "Click Resume to continue"
                    : "Click Stop when finished"}
                </p>
              </div>
            ) : audioBlob ? (
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
                  <span className="text-lg font-semibold text-gray-800">
                    Audio Recording Complete!
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
            ) : (
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-3">
                  <LuMic className="w-6 h-6 text-gray-600" />
                </div>
                <span className="text-lg font-semibold text-gray-700 block mb-2">
                  Ready to Record Audio
                </span>
                <p className="text-sm text-gray-600">
                  Click &quot;Start Recording&quot; to begin your audio
                  testimony
                </p>
              </div>
            )}
          </div>

          {/* Controls */}
          <div className="flex justify-center gap-3">
            {!isRecording && !audioBlob && (
              <button
                onClick={startRecording}
                disabled={isLoadingDevices}
                className="flex items-center gap-2 px-6 py-3 bg-black text-white rounded-xl font-semibold hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 cursor-pointer"
              >
                <LuMic className="w-5 h-5" />
                {isLoadingDevices ? "Loading..." : "Start Recording"}
              </button>
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

            {audioBlob && (
              <>
                <button
                  onClick={playAudio}
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
                  onClick={downloadAudio}
                  className="flex items-center gap-2 px-4 py-3 bg-gray-500 text-white rounded-xl font-semibold hover:bg-gray-600 transition-colors duration-200 cursor-pointer"
                >
                  <LuDownload className="w-4 h-4" />
                  Download
                </button>
                <button
                  onClick={() => {
                    setAudioBlob(null);
                    setAudioURL("");
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

          {/* Audio Player (Hidden) */}
          {audioURL && (
            <audio
              ref={audioRef}
              src={audioURL}
              onEnded={() => setIsPlaying(false)}
              className="hidden"
            />
          )}

          {/* Recording Tips */}
          {!isRecording && !audioBlob && (
            <div className="mt-4 p-3 bg-gray-50 rounded-lg flex items-center justify-center gap-2">
              <p className="text-xs text-gray-600 text-center flex items-center justify-center gap-2">
                <LuInfo className="w-4 h-4" />
                Find a quiet space and speak clearly into your microphone
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        {audioBlob ? (
          <div className="p-6 border-t border-gray-200 bg-gray-50 rounded-b-2xl">
            <div className="flex flex-col">
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
