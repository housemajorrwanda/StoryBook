import {
  BookOpen,
  Video,
  Zap,
  Clock,
  Play,
  Eye,
  ArrowRight,
} from "lucide-react";
import { EducationContent } from "@/types/education";
import Image from "next/image";
import { useState, useRef, useCallback } from "react";
import Link from "next/link";
import { useIncrementViews } from "@/hooks/education/use-education-content";

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
  article: "Article",
  video: "Video",
  interactive: "Interactive",
  timeline: "Timeline",
  audio: "Audio",
} as const;

const typeColors = {
  article: "bg-gray-100 text-gray-600",
  video: "bg-blue-50 text-blue-600",
  interactive: "bg-purple-50 text-purple-600",
  timeline: "bg-amber-50 text-amber-600",
  audio: "bg-green-50 text-green-600",
} as const;

const isValidContentType = (type: string): type is keyof typeof typeIcons =>
  type in typeIcons;

export default function EducationCard({ content }: EducationCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { mutate: incrementViews } = useIncrementViews();

  const IconComponent = isValidContentType(content.type)
    ? typeIcons[content.type]
    : BookOpen;
  const typeLabel = isValidContentType(content.type)
    ? typeLabels[content.type]
    : "Content";
  const typeColor = isValidContentType(content.type)
    ? typeColors[content.type]
    : typeColors.article;

  const isVideoContent = content.type === "video" && content.videoUrl;

  const handleCardClick = useCallback(() => {
    incrementViews(content.id, {
      onError: (error) =>
        console.error("Failed to increment view count:", error),
    });
  }, [content.id, incrementViews]);

  const handleMouseEnter = useCallback(async () => {
    if (isVideoContent && videoRef.current) {
      try {
        await videoRef.current.play();
        setIsPlaying(true);
      } catch {}
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
      e.stopPropagation();
      if (!videoRef.current) return;
      try {
        if (isPlaying) {
          videoRef.current.pause();
          setIsPlaying(false);
        } else {
          await videoRef.current.play();
          setIsPlaying(true);
        }
      } catch {}
    },
    [isPlaying],
  );

  const plainDescription = content.description?.replace(/<[^>]*>/g, "") ?? "";

  return (
    <Link
      href={`/education/${content.id}`}
      onClick={handleCardClick}
      className="block group"
    >
      <div
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="h-full flex flex-col rounded-2xl border border-gray-100 bg-white overflow-hidden hover:border-gray-200 hover:shadow-sm transition-all duration-200"
      >
        {/* Media */}
        <div className="relative aspect-video overflow-hidden bg-gray-100 shrink-0">
          {isVideoContent ? (
            <>
              <video
                ref={videoRef}
                src={content.videoUrl!}
                className="object-cover w-full h-full"
                muted
                loop
                playsInline
                preload="metadata"
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                onEnded={() => {
                  setIsPlaying(false);
                  if (videoRef.current) videoRef.current.currentTime = 0;
                }}
              />
              <div
                className={`absolute inset-0 bg-black/25 flex items-center justify-center transition-opacity duration-200 ${
                  isPlaying ? "opacity-0" : "opacity-100"
                }`}
              >
                <button
                  type="button"
                  onClick={handleVideoClick}
                  className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-md hover:scale-105 transition-transform"
                >
                  <Play className="w-4 h-4 text-gray-900 ml-0.5" />
                </button>
              </div>
            </>
          ) : content.imageUrl ? (
            <>
              <Image
                src={content.imageUrl}
                alt={content.title}
                fill
                className={`object-cover group-hover:scale-105 transition-transform duration-300 ${
                  imageLoaded ? "opacity-100" : "opacity-0"
                }`}
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                onLoad={() => setImageLoaded(true)}
                loading="lazy"
              />
              {!imageLoaded && <div className="absolute inset-0 bg-gray-100" />}
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-50">
              <IconComponent className="w-10 h-10 text-gray-300" />
            </div>
          )}

          {/* Type badge */}
          <div
            className={`absolute top-3 left-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold backdrop-blur-sm ${typeColor}`}
          >
            <IconComponent className="w-3 h-3" />
            {typeLabel}
          </div>

          {/* Completed badge */}
          {content.isCompleted && (
            <div className="absolute top-3 right-3 bg-green-500 text-white rounded-lg px-2.5 py-1 text-[11px] font-semibold">
              ✓ Done
            </div>
          )}
        </div>

        {/* Body */}
        <div className="flex flex-col flex-1 p-5 gap-3">
          <div className="flex-1 space-y-1.5">
            <h3 className="text-sm font-bold text-gray-900 line-clamp-2 leading-snug group-hover:text-gray-600 transition-colors">
              {content.title}
            </h3>
            <p className="text-xs text-gray-400">By {content.user.fullName}</p>
            {plainDescription && (
              <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed pt-0.5">
                {plainDescription}
              </p>
            )}
          </div>

          {/* Meta row */}
          <div className="flex items-center gap-3 text-[11px] text-gray-400">
            {content.duration && (
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {content.duration} min
              </span>
            )}
            {content.views !== undefined && (
              <span className="flex items-center gap-1">
                <Eye className="w-3 h-3" />
                {content.views.toLocaleString()}
              </span>
            )}
            {content.tags && content.tags.length > 0 && (
              <span className="ml-auto text-gray-300 truncate max-w-[100px]">
                {content.tags[0]}
              </span>
            )}
          </div>

          {/* CTA */}
          <div className="flex items-center gap-1 text-xs font-semibold text-gray-900 pt-1 group-hover:gap-2 transition-all">
            {content.type === "video"
              ? "Watch"
              : content.type === "audio"
                ? "Listen"
                : content.type === "article"
                  ? "Read"
                  : "Explore"}
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </div>
      </div>
    </Link>
  );
}
