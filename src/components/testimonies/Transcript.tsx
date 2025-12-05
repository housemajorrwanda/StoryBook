"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { LuFileText, LuLoaderCircle} from "react-icons/lu";
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
  const [segments, setSegments] = useState<Array<{ text: string; start: number; end: number; id: string }>>([]);
  const [words, setWords] = useState<Array<{ text: string; start: number; end: number; id: string; isSpace?: boolean }>>([]);
  const transcriptRef = useRef<HTMLDivElement>(null);
  const eventSourceRef = useRef<EventSource | null>(null);
  const highlightedWordRef = useRef<HTMLSpanElement | null>(null);
  const isUserScrollingRef = useRef(false);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Parse segments into words with approximate timing
  const parseSegmentsIntoWords = useCallback((segmentsToParse: Array<{ text: string; start: number; end: number; id: string }>) => {
    const allWords: Array<{ text: string; start: number; end: number; id: string; isSpace?: boolean }> = [];
    
    segmentsToParse.forEach((segment) => {
      // Split by spaces but keep track of spaces
      const parts = segment.text.split(/(\s+)/);
      const segmentDuration = segment.end - segment.start;
      
      
      const validParts = parts.filter(part => part.length > 0);
      const partDuration = segmentDuration / validParts.length;
      
      validParts.forEach((part, partIndex) => {
        const partStart = segment.start + (partIndex * partDuration);
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
  }, []);

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
          
          if (typeof text === "string" && typeof start === "number" && typeof end === "number") {
            const segmentId = `segment-${start}-${end}`;
            setSegments((prev) => {
              // Check if segment already exists
              const exists = prev.some((s) => s.id === segmentId);
              if (exists) return prev;
              
              // Add new segment
              const newSegment: { text: string; start: number; end: number; id: string } = {
                text: text,
                start: start,
                end: end,
                id: segmentId,
              };
              
              // Update full text
              const newText = prev.length > 0 
                ? prev.map(s => s.text).join(" ") + " " + text
                : text;
              setStreamedText(newText);
              
              // Sort segments by start time and return
              const updated = [...prev, newSegment].sort((a, b) => a.start - b.start);
              
              // Parse segments into words for word-by-word highlighting
              parseSegmentsIntoWords(updated);
              
              // Auto-scroll to latest segment only if user isn't scrolling
              if (!isUserScrollingRef.current) {
                setTimeout(() => {
                  if (transcriptRef.current && !isUserScrollingRef.current) {
                    transcriptRef.current.scrollTop = transcriptRef.current.scrollHeight;
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
      }
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
            // Create a single segment for the full transcript
            // Use actual duration if available, otherwise estimate
            const actualDuration = duration || 100;
            const fullSegment = {
              text: data.transcript,
              start: 0,
              end: actualDuration,
              id: "full-transcript",
            };
            setSegments([fullSegment]);
            // Parse into words for word-by-word highlighting
            parseSegmentsIntoWords([fullSegment]);
          } else {
            // If transcript is pending/processing, start streaming
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

  // Handle user scrolling - detect when user manually scrolls
  const handleScroll = useCallback(() => {
    isUserScrollingRef.current = true;
    
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }
    
    // Reset scroll detection after user stops scrolling
    scrollTimeoutRef.current = setTimeout(() => {
      isUserScrollingRef.current = false;
    }, 1500); // Increased timeout to give more time for manual scrolling
  }, []);

  // Scroll to current word when playing (only if user isn't scrolling)
  useEffect(() => {
    if (isPlaying && highlightedWordRef.current && !isUserScrollingRef.current) {
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
    const timeInSeconds = currentTime / 1000; // Convert ms to seconds
    
    return words.find(
      (word) => timeInSeconds >= word.start && timeInSeconds <= word.end
    ) || null;
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
    <div className={`bg-white rounded-2xl shadow-lg border border-gray-200 ${className}`}>
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
              <LuFileText className="w-5 h-5 text-gray-700" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-lg">Transcript</h3>
              <p className="text-sm text-gray-500">
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
            <div className="flex items-center gap-2 text-gray-500">
              <LuLoaderCircle className="w-4 h-4 animate-spin" />
              <span className="text-sm">Loading...</span>
            </div>
          ) : isStreaming || isProcessing ? (
            <div className="flex items-center gap-2 text-blue-600">
              <LuLoaderCircle className="w-4 h-4 animate-spin" />
              <span className="text-sm font-medium">Processing</span>
            </div>
          ) : isAvailable ? (
            <div className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
              Available
            </div>
          ) : (
            <div className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm font-medium">
              Not Available
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {error ? (
          <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
            <LuLoaderCircle className="w-5 h-5 text-red-600" />
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        ) : isLoading ? (
          <div className="flex items-center justify-center py-12">
            <LuLoaderCircle className="w-8 h-8 animate-spin text-gray-400" />
          </div>
        ) : isAvailable || streamedText || segments.length > 0 ? (
          <div
            ref={transcriptRef}
            onScroll={handleScroll}
            onWheel={() => {
              // Detect manual scrolling
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
            className="prose prose-sm max-w-none text-gray-700 leading-relaxed max-h-96 overflow-y-auto overscroll-contain"
            style={{
              scrollBehavior: "smooth",
              pointerEvents: "auto",
              userSelect: "text",
            }}
          >
            {words.length > 0 ? (
              <p className="text-base leading-7 whitespace-normal">
                {words.map((word, index) => {
                  const isHighlighted = highlightedWord?.id === word.id;
                  const isNewWord = index === words.length - 1 && (isStreaming || isProcessing);
                  const isRecentWord = index >= words.length - 10 && (isStreaming || isProcessing);
                  const isSpace = word.isSpace || word.text === " ";

                  // Don't style spaces, just render them
                  if (isSpace) {
                    return <span key={word.id}> </span>;
                  }

                  return (
                    <span
                      key={word.id}
                      ref={isHighlighted ? highlightedWordRef : null}
                      className={`inline transition-all duration-200 ${
                        isHighlighted
                          ? "bg-yellow-300 text-gray-900 font-bold px-1.5 py-0.5 rounded shadow-sm"
                          : isNewWord
                          ? "text-gray-900 font-semibold"
                          : isRecentWord
                          ? "text-gray-800 font-medium"
                          : "text-gray-700"
                      }`}
                      onClick={() => {
                        if (onSeek && !isSpace) {
                          onSeek(word.start * 1000); // Convert to milliseconds
                        }
                      }}
                      style={{
                        cursor: onSeek && !isSpace ? "pointer" : "default",
                        animation: isNewWord ? "fadeIn 0.3s ease-in" : undefined,
                      }}
                      title={onSeek && !isSpace ? `Jump to ${Math.floor(word.start)}s` : undefined}
                    >
                      {word.text}{" "}
                    </span>
                  );
                })}
                {/* Live typing cursor when streaming */}
                {(isStreaming || isProcessing) && (
                  <span className="inline-block w-0.5 h-5 bg-blue-500 ml-1 animate-pulse" />
                )}
              </p>
            ) : segments.length > 0 ? (
              <div className="space-y-2">
                {segments.map((segment, index) => {
                  const isNewSegment = index === segments.length - 1 && (isStreaming || isProcessing);
                  const isRecentSegment = index >= segments.length - 3 && (isStreaming || isProcessing);

                  return (
                    <span
                      key={segment.id}
                      className={`inline-block transition-all duration-300 mb-2 ${
                        isNewSegment
                          ? "text-gray-900 font-medium bg-blue-50 px-2 py-1 rounded-lg"
                          : isRecentSegment
                          ? "text-gray-800 bg-gray-50 px-2 py-1 rounded"
                          : "text-gray-700"
                      }`}
                      onClick={() => {
                        if (onSeek) {
                          onSeek(segment.start * 1000);
                        }
                      }}
                      style={{
                        cursor: onSeek ? "pointer" : "default",
                        animation: isNewSegment ? "fadeIn 0.5s ease-in" : undefined,
                      }}
                    >
                      {segment.text}{" "}
                    </span>
                  );
                })}
                {(isStreaming || isProcessing) && (
                  <span className="inline-block w-0.5 h-5 bg-blue-500 ml-2 animate-pulse" />
                )}
              </div>
            ) : streamedText ? (
              <p className="text-base leading-7 text-gray-700">{streamedText}</p>
            ) : (
              <p className="text-gray-500 italic">No transcript text available</p>
            )}
          </div>
        ) : isProcessing ? (
          <div className="text-center py-12">
            <LuLoaderCircle className="w-8 h-8 animate-spin text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">
              {transcript?.transcriptStatus || "Transcription is processing..."}
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Check back later. The transcript will appear here when ready.
            </p>
          </div>
        ) : (
          <div className="text-center py-12">
            <LuFileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600 font-medium">No transcript available</p>
            <p className="text-sm text-gray-500 mt-2">
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

