import { BookOpen, Video, Zap, Clock, Play, Sparkles, Eye } from "lucide-react";
import { EducationContent } from "@/types/education";
import Image from "next/image";
import { useState, useRef, useCallback } from "react";
import Link from "next/link";

interface EducationCardProps {
  content: EducationContent;
}

const typeIcons = {
  article: BookOpen,
  video: Video,
  interactive: Zap,
  timeline: Clock,
  audio: Play,
} as const;

const typeLabels = {
  article: "Articles & Documents",
  video: "Video Stories",
  interactive: "Interactive Learning",
  timeline: "Historical Timelines",
  audio: "Audio Testimonies",
} as const;

const isValidContentType = (type: string): type is keyof typeof typeIcons => {
  return type in typeIcons;
};

const getActionLabel = (type: string) => {
  switch (type) {
    case "video":
      return "Watch";
    case "article":
      return "Read";
    case "audio":
      return "Listen";
    default:
      return "Explore";
  }
};

export default function EducationCard({ content }: EducationCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const IconComponent = isValidContentType(content.type)
    ? typeIcons[content.type]
    : BookOpen;

  const hasMedia =
    content.imageUrl || (content.type === "video" && content.videoUrl);
  const isVideoContent = content.type === "video" && content.videoUrl;

  const handleMouseEnter = useCallback(async () => {
    if (isVideoContent && videoRef.current) {
      try {
        await videoRef.current.play();
        setIsPlaying(true);
      } catch (error) {
        console.error("Failed to play video:", error);
      }
    }
  }, [isVideoContent]);

  const handleMouseLeave = useCallback(() => {
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
      setIsPlaying(false);
    }
  }, []);

  const handleVideoClick = useCallback(
    async (e: React.MouseEvent) => {
      e.preventDefault();
      if (videoRef.current) {
        try {
          if (isPlaying) {
            videoRef.current.pause();
            setIsPlaying(false);
          } else {
            await videoRef.current.play();
            setIsPlaying(true);
          }
        } catch (error) {
          console.error("Failed to toggle video playback:", error);
        }
      }
    },
    [isPlaying]
  );

  const handleVideoPlay = useCallback(() => {
    setIsPlaying(true);
  }, []);

  const handleVideoPause = useCallback(() => {
    setIsPlaying(false);
  }, []);

  const handleVideoEnded = useCallback(() => {
    setIsPlaying(false);
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
    }
  }, []);

  return (
    <Link href={`/education/content/${content.id}`} className="block">
      <div
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="group rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 hover:shadow-gray-400/20 cursor-pointer h-full bg-white/60 hover:border-gray-400"
      >
        {/* Media Container */}
        <div className="relative aspect-video overflow-hidden bg-gray-100">
          {hasMedia ? (
            <>
              {isVideoContent ? (
                <div className="relative w-full h-full">
                  <video
                    ref={videoRef}
                    src={content.videoUrl!}
                    className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-300"
                    muted
                    loop
                    playsInline
                    preload="metadata"
                    onPlay={handleVideoPlay}
                    onPause={handleVideoPause}
                    onEnded={handleVideoEnded}
                  />
                  <div
                    className={`absolute inset-0 bg-black/20 flex items-center justify-center transition-opacity duration-300 ${
                      isPlaying ? "opacity-0" : "opacity-100"
                    }`}
                  >
                    <button
                      onClick={handleVideoClick}
                      className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center group-hover:scale-110 transition-transform hover:bg-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black/20"
                    >
                      <Play className="w-6 h-6 text-gray-900 ml-1" />
                    </button>
                  </div>
                </div>
              ) : content.imageUrl ? (
                <div className="relative w-full h-full">
                  <Image
                    src={content.imageUrl}
                    alt={content.title}
                    fill
                    className={`object-cover group-hover:scale-110 transition-transform duration-300 ${
                      imageLoaded ? "opacity-100" : "opacity-0"
                    }`}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    onLoad={() => setImageLoaded(true)}
                    loading="lazy"
                  />
                  {!imageLoaded && (
                    <div className="absolute inset-0 flex items-center justify-center bg-linear-to-br from-gray-100 to-gray-200">
                      <Sparkles className="w-8 h-8 text-gray-400 animate-pulse" />
                    </div>
                  )}
                </div>
              ) : null}
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-linear-to-br from-gray-100 to-gray-200">
              <div className="text-center p-6">
                <IconComponent className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-sm text-gray-500 font-medium">
                  {isValidContentType(content.type)
                    ? typeLabels[content.type]
                    : "Educational Content"}
                </p>
              </div>
            </div>
          )}

          {/* Completion Badge */}
          {content.isCompleted && (
            <div className="absolute top-3 right-3 bg-green-100 text-green-800 rounded-full px-3 py-1 text-xs font-medium backdrop-blur-sm border border-green-200">
              ✓ Completed
            </div>
          )}

          {/* Content Type Badge */}
          <div className="absolute top-3 left-3 bg-black/70 text-white rounded-full px-3 py-1 flex items-center gap-1 text-xs font-semibold backdrop-blur-sm border border-white/20">
            <IconComponent className="h-3 w-3" />
            {isValidContentType(content.type)
              ? typeLabels[content.type]
              : "Content"}
          </div>

          {/* Hover Overlay for non-video content */}
          {!isVideoContent && (
            <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          )}
        </div>

        {/* Content */}
        <div className="flex-1 p-6 space-y-3">
          <div className="space-y-2">
            <h3 className="font-semibold text-lg text-gray-900 group-hover:text-gray-700 transition-colors line-clamp-2">
              {content.title}
            </h3>
            <p className="text-xs text-gray-700 font-medium">
              By {content.user.fullName}
            </p>
          </div>

          <p className="text-sm text-gray-700 line-clamp-2 leading-relaxed">
            {content.description}
          </p>

          {/* Metadata */}
          <div className="flex items-center gap-4 text-sm text-gray-600">
            {content.duration && (
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>{content.duration} min</span>
              </div>
            )}

            {content.views !== undefined && (
              <div className="flex items-center gap-1">
                <Eye className="h-4 w-4" />
                <span>{content.views.toLocaleString()} views</span>
              </div>
            )}
          </div>

          {/* Tags */}
          {content.tags && content.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 pt-2">
              {content.tags.slice(0, 2).map((tag) => (
                <span
                  key={tag}
                  className="text-xs bg-gray-100 text-gray-700 rounded-full px-2 py-1 border border-gray-200"
                >
                  {tag}
                </span>
              ))}
              {content.tags.length > 2 && (
                <span className="text-xs text-gray-500 rounded-full px-2 py-1">
                  +{content.tags.length - 2} more
                </span>
              )}
            </div>
          )}
        </div>

        {/* Action Button */}
        <div className="px-6 pb-6">
          <button className="w-full px-4 py-3 bg-gray-600 text-white rounded-lg font-medium hover:bg-gray-700 flex items-center justify-center gap-2 group-hover:bg-gray-700 group-hover:scale-105 transition-transform duration-200 focus:outline-none focus:ring-2 focus:ring-gray-600 focus:ring-offset-2">
            {getActionLabel(content.type)}
            {content.type === "video" && <Play className="h-4 w-4" />}
            {content.type === "article" && <BookOpen className="h-4 w-4" />}
            {content.type === "audio" && <Play className="h-4 w-4" />}
          </button>
        </div>
      </div>
    </Link>
  );
}
