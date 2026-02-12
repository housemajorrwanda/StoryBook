"use client"

import { useEducationContent } from "@/hooks/education/use-education-content";
import { EducationContent } from "@/types/education";
import { 
  BookOpen, 
  Video, 
  Zap, 
  Clock, 
  Play, 
  Eye, 
  ChevronLeft, 
  User, 
  Calendar, 
  Tag, 
  Loader2, 
  AlertCircle,
  Share2,
  Bookmark,
  CheckCircle,
  CheckCircle2,
  ExternalLink
} from "lucide-react";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import EducationCard from "./education-card";

interface UseEducationByIdResult {
  data: EducationContent | undefined;
  isLoading: boolean;
  error: Error | null;
}

interface UseTrackProgressResult {
  mutate: (params: { id: number; completed?: boolean }, options?: {
    onSuccess?: () => void;
    onError?: (error: Error) => void;
  }) => void;
  isLoading: boolean;
}

interface SingleEducationContentProps {
  contentId: number;
  useEducationById: (id: number) => UseEducationByIdResult;
  useTrackProgress: () => UseTrackProgressResult;
  useIncrementViews: () => { mutate: (id: number) => void };
}

type ContentType = "article" | "video" | "interactive" | "timeline" | "audio";

const typeIcons: Record<ContentType, React.ElementType> = {
  article: BookOpen,
  video: Video,
  interactive: Zap,
  timeline: Clock,
  audio: Play,
};

const typeLabels: Record<ContentType, string> = {
  article: "Article",
  video: "Video Story",
  interactive: "Interactive Learning",
  timeline: "Historical Timeline",
  audio: "Audio Testimony",
};

export default function SingleEducationContent({ 
  contentId, 
  useEducationById, 
  useTrackProgress,
  useIncrementViews 
}: SingleEducationContentProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isMarkingComplete, setIsMarkingComplete] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showShareOptions, setShowShareOptions] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const { data: content, isLoading, error } = useEducationById(contentId);
  const { mutate: trackProgress, isLoading: isTrackingProgress } = useTrackProgress();
  const { mutate: incrementViews } = useIncrementViews();

  const limit = 4;
  
  // Fix: Check if content exists before using it in the hook
  const { data: relatedContentData, isLoading: relatedLoading, error: relatedError } = useEducationContent({
    limit,
    category: content?.category !== "all" ? content?.category : undefined,
    isPublished: true,
    type: content?.type, 
  });

  // Get related content (excluding current content)
  const relatedContent = content ? (relatedContentData?.data?.filter(item => item.id !== contentId) || []) : [];

  // Track view count when component mounts
  useEffect(() => {
    if (contentId) {
      incrementViews(contentId);
    }
  }, [contentId, incrementViews]);

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleMarkComplete = () => {
    if (!content || isMarkingComplete) return;

    setIsMarkingComplete(true);
    const newCompletedStatus = !content.isCompleted;
    
    trackProgress({
      id: content.id,
      completed: newCompletedStatus
    }, {
      onSuccess: () => {
        console.log(`Content marked as ${newCompletedStatus ? 'completed' : 'incomplete'}`);
        setIsMarkingComplete(false);
      },
      onError: (error: Error) => {
        console.error('Failed to track progress:', error);
        setIsMarkingComplete(false);
      }
    });
  };

  const handleShare = async () => {
    if (!content) return;

    const shareData = {
      title: content.title,
      text: content.description || content.title,
      url: window.location.href,
    };

    if (navigator.share && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData);
        console.log('Content shared successfully');
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      // Fallback: Copy to clipboard
      try {
        await navigator.clipboard.writeText(window.location.href);
        alert('Link copied to clipboard!');
      } catch (error) {
        console.error('Failed to copy link:', error);
        alert('Failed to copy link. Please try again.');
      }
    }
    setShowShareOptions(false);
  };

  const handleSaveForLater = () => {
    if (isSaving) return;

    setIsSaving(true);
    // TODO: Implement save functionality - might need a new API endpoint
    // For now, we'll just toggle local state
    setTimeout(() => {
      setIsSaved(!isSaved);
      setIsSaving(false);
      console.log(`${isSaved ? 'Removed from' : 'Added to'} saved items`);
    }, 500);
  };

  const getVideoElement = () => {
    if (!content?.videoUrl) return null;
    
    return (
      <div className="relative w-full h-full">
        <video
          src={content.videoUrl}
          className="w-full h-full object-cover rounded-2xl"
          controls
          preload="metadata"
          controlsList="nodownload"
        >
          Your browser does not support the video tag.
        </video>
        
        {/* Custom video controls overlay */}
        <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center">
          <div className="flex items-center gap-2 text-white text-sm bg-black/50 backdrop-blur-sm rounded-full px-3 py-1">
            <Clock className="h-4 w-4" />
            <span>{content.duration || 'N/A'} min</span>
          </div>
        </div>
      </div>
    );
  };

  const getImageElement = () => (
    <>
      <Image
        src={content?.imageUrl || ''}
        alt={content?.title || 'Education content'}
        fill
        className={`object-cover rounded-2xl transition-opacity duration-300 ${
          imageLoaded ? "opacity-100" : "opacity-0"
        }`}
        onLoad={() => setImageLoaded(true)}
      />
      {!imageLoaded && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
        </div>
      )}
    </>
  );

  const getMediaPlaceholder = () => (
    <div className="w-full h-full flex flex-col items-center justify-center bg-linear-to-br from-gray-100 to-gray-200 rounded-2xl">
      <IconComponent className="w-16 h-16 text-gray-400 mb-4" />
      <p className="text-gray-500 font-medium">{typeLabel}</p>
    </div>
  );

  const IconComponent = content ? (typeIcons[content.type as ContentType] || BookOpen) : BookOpen;
  const typeLabel = content ? (typeLabels[content.type as ContentType] || "Content") : "Content";

  // Loading State
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 text-gray-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Loading content...</p>
        </div>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl border border-red-200 p-8 max-w-md">
          <div className="text-center">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="h-6 w-6 text-red-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Error Loading Content</h2>
            <p className="text-gray-600 mb-4">
              {error.message || "Failed to load the educational content. Please try again."}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-gray-600 text-white rounded-lg font-medium hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-600 focus:ring-offset-2"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Not Found State
  if (!content) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl border border-gray-200 p-8 max-w-md text-center">
          <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">Content Not Found</h2>
          <p className="text-gray-600 mb-4">
            The educational content you&apos;re looking for doesn&apos;t exist or has been removed.
          </p>
          <button
            onClick={() => window.history.back()}
            className="px-6 py-3 bg-gray-600 text-white rounded-lg font-medium hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-600 focus:ring-offset-2"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white cursor-pointer border-b border-gray-200">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <button 
            onClick={() => window.history.back()}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-600 focus:ring-offset-2 rounded-lg"
          >
            <ChevronLeft className="h-5 w-5" />
            <span className="font-medium">Back to Education</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Image/Video */}
        <div className="relative aspect-video w-full overflow-hidden bg-gray-100 mb-8 rounded-2xl">
          {content.videoUrl ? (
            getVideoElement()
          ) : content.imageUrl ? (
            getImageElement()
          ) : (
            getMediaPlaceholder()
          )}

          {/* Type Badge */}
          <div className="absolute top-4 left-4 bg-black/70 text-white rounded-full px-4 py-2 flex items-center gap-2 text-sm font-semibold backdrop-blur-sm border border-white/20">
            <IconComponent className="h-4 w-4" />
            {typeLabel}
          </div>

          {/* Completion Badge */}
          {content.isCompleted && (
            <div className="absolute top-4 right-4 bg-green-100 text-green-800 rounded-full px-4 py-2 text-sm font-medium backdrop-blur-sm border border-green-200 flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4" />
              Completed
            </div>
          )}
        </div>

        {/* Content Card */}
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          {/* Title Section */}
          <div className="p-8 border-b border-gray-200">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              {content.title}
            </h1>
            
            <p className="text-lg text-gray-700 leading-relaxed mb-6">
              {content.description}
            </p>

            {/* Meta Information */}
            <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span className="font-medium">{content.user.fullName}</span>
              </div>

              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>{formatDate(content.createdAt)}</span>
              </div>

              {content.views !== undefined && content.views !== null && (
                <div className="flex items-center gap-2">
                  <Eye className="h-4 w-4" />
                  <span>{content.views.toLocaleString()} views</span>
                </div>
              )}

              {content.duration && (
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>{content.duration} min</span>
                </div>
              )}
            </div>

            {/* Tags */}
            {content.tags && content.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-6">
                {content.tags.map((tag, index) => (
                  <div
                    key={`${tag}-${index}`}
                    className="flex items-center gap-1 bg-gray-100 text-gray-700 rounded-full px-3 py-1 text-sm border border-gray-200"
                  >
                    <Tag className="h-3 w-3" />
                    {tag}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Main Content */}
          <div className="p-8">
            <div className="prose prose-lg max-w-none">
              {content.content ? (
                content.content.split('\n\n').map((paragraph, index) => (
                  <p key={index} className="text-gray-700 leading-relaxed mb-4 last:mb-0">
                    {paragraph}
                  </p>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <BookOpen className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>No detailed content available</p>
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="p-8 bg-gray-50 border-t border-gray-200">
            <div className="flex flex-wrap gap-4">
              <button
                onClick={handleMarkComplete}
                disabled={isTrackingProgress || isMarkingComplete}
                className={`px-6 py-3 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 flex items-center gap-2 ${
                  content.isCompleted
                    ? 'bg-green-100 text-green-800 hover:bg-green-200 focus:ring-green-600'
                    : 'bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-600'
                } ${isTrackingProgress || isMarkingComplete ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {isTrackingProgress || isMarkingComplete ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    {content.isCompleted ? 'Unmarking...' : 'Marking...'}
                  </>
                ) : (
                  <>
                    {content.isCompleted ? (
                      <>
                        <CheckCircle className="h-4 w-4" />
                        Mark as Incomplete
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="h-4 w-4" />
                        Mark as Complete
                      </>
                    )}
                  </>
                )}
              </button>
              
              <div className="relative">
                <button
                  onClick={() => setShowShareOptions(!showShareOptions)}
                  className="px-6 py-3 bg-white text-gray-700 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-600 focus:ring-offset-2 flex items-center gap-2"
                >
                  <Share2 className="h-4 w-4" />
                  Share
                </button>
                
                {showShareOptions && (
                  <div className="absolute bottom-full left-0 mb-2 bg-white border border-gray-200 rounded-lg shadow-lg p-2 min-w-[160px] z-10">
                    <button
                      onClick={handleShare}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded"
                    >
                      Copy Link
                    </button>
                  </div>
                )}
              </div>

              <button
                onClick={handleSaveForLater}
                disabled={isSaving}
                className={`px-6 py-3 bg-white text-gray-700 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-600 focus:ring-offset-2 flex items-center gap-2 ${
                  isSaving ? 'opacity-50 cursor-not-allowed' : ''
                } ${isSaved ? 'text-blue-600 border-blue-300 bg-blue-50 hover:bg-blue-100' : ''}`}
              >
                {isSaving ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Bookmark className={`h-4 w-4 ${isSaved ? 'fill-current' : ''}`} />
                    {isSaved ? 'Saved' : 'Save for Later'}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Related Content Section */}
        <div className="mt-12">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Related Content
              </h2>
              <p className="text-gray-600 mt-1">
                More {content.category || "similar"} content you might like
              </p>
            </div>
            {relatedContent.length > 0 && (
              <Link 
                href={`/education?category=${content.category || 'all'}`}
                className="text-gray-600 hover:text-gray-900 font-medium flex items-center gap-2"
              >
                View all in {content.category || "category"}
                <ExternalLink className="h-4 w-4" />
              </Link>
            )}
          </div>

          {relatedLoading ? (
            <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
              <Loader2 className="h-8 w-8 text-gray-400 animate-spin mx-auto mb-4" />
              <p className="text-gray-600">Loading related content...</p>
            </div>
          ) : relatedError ? (
            <div className="bg-white rounded-xl border border-gray-200 p-8 text-center text-gray-500">
              <AlertCircle className="h-8 w-8 text-gray-400 mx-auto mb-4" />
              <p>Unable to load related content at this time.</p>
            </div>
          ) : relatedContent.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedContent.slice(0, 3).map((item) => (
                <EducationCard key={item.id} content={item} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-gray-200 p-8 text-center text-gray-500">
              <BookOpen className="h-8 w-8 text-gray-400 mx-auto mb-4" />
              <p className="mb-3">No related content available at this time.</p>
              <Link 
                href="/education"
                className="text-gray-600 hover:text-gray-900 font-medium inline-flex items-center gap-2"
              >
                Browse all education content
                <ExternalLink className="h-4 w-4" />
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}