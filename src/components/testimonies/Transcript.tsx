"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { LuFileText, LuLoaderCircle } from "react-icons/lu";
import { TranscriptResponse } from "@/types/testimonies";
import { testimoniesService } from "@/services/testimonies.service";

interface TranscriptProps {
  testimonyId: number;
  currentTime?: number;
  isPlaying?: boolean;
  onSeek?: (time: number) => void;
  className?: string;
  duration?: number;
}

export default function Transcript({
  testimonyId,
  currentTime = 0,
  isPlaying = false,
  onSeek,
  className = "",
  duration,
}: TranscriptProps) {
  const [transcript, setTranscript] = useState<TranscriptResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamedText, setStreamedText] = useState<string>("");
  const [segments, setSegments] = useState<
    Array<{ text: string; start: number; end: number; id: string }>
  >([]);
  const [words, setWords] = useState<
    Array<{
      text: string;
      start: number;
      end: number;
      id: string;
      isSpace?: boolean;
    }>
  >([]);
  const transcriptRef = useRef<HTMLDivElement>(null);
  const eventSourceRef = useRef<EventSource | null>(null);
  const highlightedWordRef = useRef<HTMLSpanElement | null>(null);
  const isUserScrollingRef = useRef(false);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Parse segments into words with approximate timing
  const parseSegmentsIntoWords = useCallback(
    (
      segmentsToParse: Array<{
        text: string;
        start: number;
        end: number;
        id: string;
      }>,
    ) => {
      const allWords: Array<{
        text: string;
        start: number;
        end: number;
        id: string;
        isSpace?: boolean;
      }> = [];

      segmentsToParse.forEach((segment) => {
        const parts = segment.text.split(/(\s+)/);
        const segmentDuration = segment.end - segment.start;

        const validParts = parts.filter((part) => part.length > 0);
        const partDuration = segmentDuration / validParts.length;

        validParts.forEach((part, partIndex) => {
          const partStart = segment.start + partIndex * partDuration;
          const partEnd = partStart + partDuration;
          const isSpace = /^\s+$/.test(part);

          allWords.push({
            text: isSpace ? " " : part,
            start: partStart,
            end: partEnd,
            id: `word-${segment.id}-${partIndex}`,
            isSpace: isSpace,
          });
        });
      });

      setWords(allWords);
    },
    [],
  );

  // Start streaming transcript
  const startStreaming = useCallback(() => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
    }

    setIsStreaming(true);
    setStreamedText("");
    setSegments([]);

    const eventSource = testimoniesService.streamTranscript(
      testimonyId,
      (data) => {
        // Handle SSE message types
        if (data.type === "start") {
          // Initialize stream
          console.log("Stream started", data);
        } else if (data.type === "segment") {
          // Add new segment
          const text = data.text;
          const start = data.start;
          const end = data.end;

          if (
            typeof text === "string" &&
            typeof start === "number" &&
            typeof end === "number"
          ) {
            const segmentId = `segment-${start}-${end}`;
            setSegments((prev) => {
              // Check if segment already exists
              const exists = prev.some((s) => s.id === segmentId);
              if (exists) return prev;

              // Add new segment
              const newSegment: {
                text: string;
                start: number;
                end: number;
                id: string;
              } = {
                text: text,
                start: start,
                end: end,
                id: segmentId,
              };

              // Update full text
              const newText =
                prev.length > 0
                  ? prev.map((s) => s.text).join(" ") + " " + text
                  : text;
              setStreamedText(newText);

              // Sort segments by start time and return
              const updated = [...prev, newSegment].sort(
                (a, b) => a.start - b.start,
              );

              parseSegmentsIntoWords(updated);

              // Auto-scroll to latest segment only if user isn't scrolling
              if (!isUserScrollingRef.current) {
                setTimeout(() => {
                  if (transcriptRef.current && !isUserScrollingRef.current) {
                    transcriptRef.current.scrollTop =
                      transcriptRef.current.scrollHeight;
                  }
                }, 100);
              }

              return updated;
            });
          }
        } else if (data.type === "complete") {
          // Stream completed
          setIsStreaming(false);
          console.log("Stream completed");
        }
      },
      (error) => {
        console.error("Stream error:", error);
        setIsStreaming(false);
      },
      () => {
        setIsStreaming(false);
        testimoniesService
          .getTranscript(testimonyId)
          .then((data) => {
            if (data.hasTranscript && data.transcript) {
              setStreamedText(data.transcript);
              setTranscript(data);
            }
          })
          .catch(console.error);
      },
    );

    eventSourceRef.current = eventSource;
  }, [testimonyId, parseSegmentsIntoWords]);

  // Fetch transcript
  useEffect(() => {
    let isMounted = true;

    const fetchTranscript = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await testimoniesService.getTranscript(testimonyId);

        if (isMounted) {
          setTranscript(data);

          // If transcript is available, set it
          if (data.hasTranscript && data.transcript) {
            setStreamedText(data.transcript);
            const actualDuration = duration || 100;
            const fullSegment = {
              text: data.transcript,
              start: 0,
              end: actualDuration,
              id: "full-transcript",
            };
            setSegments([fullSegment]);
            parseSegmentsIntoWords([fullSegment]);
          } else {
            if (
              data.canHaveTranscript &&
              data.hasMedia &&
              (data.transcriptStatus === "pending" ||
                data.transcriptStatus === "processing" ||
                data.transcriptStatus.includes("processing"))
            ) {
              startStreaming();
            }
          }
        }
      } catch (err) {
        console.error("Error fetching transcript:", err);
        if (isMounted) {
          setError("Failed to load transcript");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchTranscript();

    return () => {
      isMounted = false;
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
        eventSourceRef.current = null;
      }
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, [startStreaming, testimonyId, duration, parseSegmentsIntoWords]);

  const handleScroll = useCallback(() => {
    isUserScrollingRef.current = true;

    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }

    scrollTimeoutRef.current = setTimeout(() => {
      isUserScrollingRef.current = false;
    }, 1500);
  }, []);

  useEffect(() => {
    if (
      isPlaying &&
      highlightedWordRef.current &&
      !isUserScrollingRef.current
    ) {
      // Use requestAnimationFrame for smoother scrolling
      requestAnimationFrame(() => {
        if (highlightedWordRef.current && !isUserScrollingRef.current) {
          highlightedWordRef.current.scrollIntoView({
            behavior: "smooth",
            block: "center",
            inline: "nearest",
          });
        }
      });
    }
  }, [currentTime, isPlaying]);

  // Find which word should be highlighted based on current time
  const getHighlightedWord = () => {
    if (!isPlaying || currentTime <= 0) return null;
    const timeInSeconds = currentTime / 1000;

    return (
      words.find(
        (word) => timeInSeconds >= word.start && timeInSeconds <= word.end,
      ) || null
    );
  };

  const highlightedWord = getHighlightedWord();
  const status = transcript?.transcriptStatus || "unknown";

  // Determine if transcript is available
  const isAvailable =
    transcript?.hasTranscript &&
    transcript?.transcript &&
    status === "available";

  // Determine if transcript is processing
  const isProcessing =
    status === "pending" ||
    status === "processing" ||
    status.includes("processing");

  // Determine if transcript can be generated
  const canGenerate = transcript?.canHaveTranscript && transcript?.hasMedia;

  return (
    <div
      className={`bg-gray-900/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/10 ring-1 ring-white/5 ${className}`}
    >
      {/* Header */}
      <div className="px-6 py-5 border-b border-white/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
              <LuFileText className="w-5 h-5 text-gray-300" />
            </div>
            <div>
              <h3 className="font-semibold text-white text-lg tracking-tight">
                Transcript
              </h3>
              <p className="text-sm text-gray-400">
                {isAvailable
                  ? "Full transcript available"
                  : isProcessing
                    ? "Transcription in progress..."
                    : canGenerate
                      ? "Transcript will be available soon"
                      : "No transcript available"}
              </p>
            </div>
          </div>

          {/* Status Badge */}
          {isLoading ? (
            <div className="flex items-center gap-2 text-gray-400">
              <LuLoaderCircle className="w-4 h-4 animate-spin" />
              <span className="text-sm">Loading...</span>
            </div>
          ) : isStreaming || isProcessing ? (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-indigo-500/20 border border-indigo-500/30 rounded-full">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-indigo-500" />
              </span>
              <span className="text-sm font-medium text-indigo-300">
                Processing
              </span>
            </div>
          ) : isAvailable ? (
            <div className="px-3 py-1.5 bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 rounded-full text-sm font-medium">
              Available
            </div>
          ) : (
            <div className="px-3 py-1.5 bg-white/5 border border-white/10 text-gray-400 rounded-full text-sm font-medium">
              Not Available
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-6 pt-5">
        {error ? (
          <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
            <LuLoaderCircle className="w-5 h-5 text-red-400" />
            <p className="text-red-300 text-sm">{error}</p>
          </div>
        ) : isLoading ? (
          <div className="flex flex-col items-center justify-center py-16 gap-4">
            <div className="relative">
              <div className="w-12 h-12 rounded-full border-2 border-white/10" />
              <div className="absolute inset-0 w-12 h-12 rounded-full border-2 border-transparent border-t-indigo-400 animate-spin" />
            </div>
            <p className="text-sm text-gray-500">Loading transcript...</p>
          </div>
        ) : isAvailable || streamedText || segments.length > 0 ? (
          <div
            ref={transcriptRef}
            onScroll={handleScroll}
            onWheel={() => {
              isUserScrollingRef.current = true;
              if (scrollTimeoutRef.current) {
                clearTimeout(scrollTimeoutRef.current);
              }
              scrollTimeoutRef.current = setTimeout(() => {
                isUserScrollingRef.current = false;
              }, 1500);
            }}
            onTouchMove={() => {
              // Detect touch scrolling
              isUserScrollingRef.current = true;
              if (scrollTimeoutRef.current) {
                clearTimeout(scrollTimeoutRef.current);
              }
              scrollTimeoutRef.current = setTimeout(() => {
                isUserScrollingRef.current = false;
              }, 1500);
            }}
            className="max-w-none leading-relaxed max-h-80 lg:max-h-112 xl:max-h-128 overflow-y-auto overscroll-contain scrollbar-thin"
            style={{
              scrollBehavior: "smooth",
              pointerEvents: "auto",
              userSelect: "text",
              scrollbarWidth: "thin",
              scrollbarColor: "rgba(255,255,255,0.15) transparent",
            }}
          >
            {words.length > 0 ? (
              <p className="text-base leading-8 whitespace-normal tracking-wide">
                {(() => {
                  const timeInSeconds = currentTime / 1000;
                  return words.map((word, index) => {
                    const isHighlighted = highlightedWord?.id === word.id;
                    const isPast = isPlaying && word.end < timeInSeconds;
                    const isNewWord =
                      index === words.length - 1 &&
                      (isStreaming || isProcessing);
                    const isRecentWord =
                      index >= words.length - 10 &&
                      (isStreaming || isProcessing);
                    const isSpace = word.isSpace || word.text === " ";
                    if (isSpace) {
                      return <span key={word.id}> </span>;
                    }

                    return (
                      <span
                        key={word.id}
                        ref={isHighlighted ? highlightedWordRef : null}
                        className={`inline-block transition-all duration-300 ease-out rounded-sm ${
                          isHighlighted
                            ? "text-white font-bold px-1.5 py-0.5 bg-indigo-500/30 scale-105"
                            : isPast
                              ? "text-gray-200"
                              : isNewWord
                                ? "text-white font-semibold"
                                : isRecentWord
                                  ? "text-gray-300 font-medium"
                                  : "text-gray-500"
                        } ${onSeek && !isSpace ? "hover:text-white hover:bg-white/10 hover:rounded cursor-pointer" : ""}`}
                        onClick={() => {
                          if (onSeek && !isSpace) {
                            onSeek(word.start * 1000);
                          }
                        }}
                        style={{
                          cursor: onSeek && !isSpace ? "pointer" : "default",
                          animation: isHighlighted
                            ? "karaoke-glow 1.5s ease-in-out infinite"
                            : isNewWord
                              ? "float-in 0.4s ease-out"
                              : undefined,
                          transformOrigin: "center bottom",
                        }}
                        title={
                          onSeek && !isSpace
                            ? `Jump to ${Math.floor(word.start / 60)}:${String(Math.floor(word.start % 60)).padStart(2, "0")}`
                            : undefined
                        }
                      >
                        {word.text}{" "}
                      </span>
                    );
                  });
                })()}
                {/* Live typing cursor when streaming */}
                {(isStreaming || isProcessing) && (
                  <span
                    className="inline-block w-0.5 h-5 bg-indigo-400 ml-1 rounded-full shadow-[0_0_8px_rgba(129,140,248,0.6)]"
                    style={{
                      animation: "cursor-blink 1s step-end infinite",
                    }}
                  />
                )}
              </p>
            ) : segments.length > 0 ? (
              <div className="space-y-2">
                {segments.map((segment, index) => {
                  const isNewSegment =
                    index === segments.length - 1 &&
                    (isStreaming || isProcessing);
                  const isRecentSegment =
                    index >= segments.length - 3 &&
                    (isStreaming || isProcessing);

                  return (
                    <span
                      key={segment.id}
                      className={`inline-block transition-all duration-300 mb-2 ${
                        isNewSegment
                          ? "text-white font-medium bg-indigo-500/20 px-2 py-1 rounded-lg border border-indigo-500/10"
                          : isRecentSegment
                            ? "text-gray-300 bg-white/5 px-2 py-1 rounded"
                            : "text-gray-400"
                      }`}
                      onClick={() => {
                        if (onSeek) {
                          onSeek(segment.start * 1000);
                        }
                      }}
                      style={{
                        cursor: onSeek ? "pointer" : "default",
                        animation: isNewSegment
                          ? "float-in 0.4s ease-out"
                          : undefined,
                      }}
                    >
                      {segment.text}{" "}
                    </span>
                  );
                })}
                {(isStreaming || isProcessing) && (
                  <span
                    className="inline-block w-0.5 h-5 bg-indigo-400 ml-2 rounded-full shadow-[0_0_8px_rgba(129,140,248,0.6)]"
                    style={{
                      animation: "cursor-blink 1s step-end infinite",
                    }}
                  />
                )}
              </div>
            ) : streamedText ? (
              <p className="text-base leading-8 text-gray-300 tracking-wide">
                {streamedText}
              </p>
            ) : (
              <p className="text-gray-500 italic text-sm">
                No transcript text available
              </p>
            )}
          </div>
        ) : isProcessing ? (
          <div className="text-center py-16">
            <div className="flex items-center justify-center gap-2 mb-6">
              <span
                className="w-2 h-2 rounded-full bg-indigo-400"
                style={{
                  animation: "dot-bounce 1.4s infinite ease-in-out both",
                  animationDelay: "0s",
                }}
              />
              <span
                className="w-2 h-2 rounded-full bg-indigo-400"
                style={{
                  animation: "dot-bounce 1.4s infinite ease-in-out both",
                  animationDelay: "0.16s",
                }}
              />
              <span
                className="w-2 h-2 rounded-full bg-indigo-400"
                style={{
                  animation: "dot-bounce 1.4s infinite ease-in-out both",
                  animationDelay: "0.32s",
                }}
              />
            </div>
            <p className="text-gray-300 font-medium">
              {transcript?.transcriptStatus || "Transcription is processing..."}
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Check back later. The transcript will appear here when ready.
            </p>
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
              <LuFileText className="w-8 h-8 text-gray-500" />
            </div>
            <p className="text-gray-300 font-medium">No transcript available</p>
            <p className="text-sm text-gray-500 mt-2 max-w-xs mx-auto">
              {canGenerate
                ? "Transcript generation may take some time. Please check back later."
                : "This testimony does not support transcript generation."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
