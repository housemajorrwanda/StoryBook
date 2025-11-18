"use client";

import PageLayout from "@/layout/PageLayout";
import { ChevronRight, MapPin, Eye, Music, Sparkles, TrendingUp, Play } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useIncrementViewCount, useVirtualTours } from "@/hooks/virtual-tour/use-virtual-tours";
import { VirtualTour } from "@/types/tour";
import { getTourTypeDisplay } from "@/utils/tour";
import { useCallback, useRef, useState } from "react";



// Tour card component
const TourCard = ({ tour }: { tour: VirtualTour }) => {
  const hasAudio = tour.audioRegions && tour.audioRegions.length > 0;
  const hotspotsCount = tour._count?.hotspots || tour.hotspots?.length ||  0;
  const audioRegionsCount = tour._count?.audioRegions || tour.audioRegions?.length || 0;
  const effectsCount =  tour._count?.effects || tour.effects?.length || 0;
  
  const isVideoTour = tour.tourType === '360_video';
  const hasMedia = tour.image360Url || tour.video360Url;

const { mutate: incrementViewCount } = useIncrementViewCount();

 const handleTourClick = useCallback(() => {
    incrementViewCount(tour.id, {
      onSuccess: () => {
        // Successfully incremented view count
        console.log('View count incremented for tour ID:', tour.id);
      },
      onError: (error) => {
        console.error('Failed to increment view count:', error);
      }
    });
  }, [tour.id, incrementViewCount]);


    const videoRef = useRef<HTMLVideoElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [imageLoaded, setImageLoaded] = useState(false);
  
    const handleMouseEnter = useCallback(async () => {
      if (isVideoTour && videoRef.current) {
        try {
          await videoRef.current.play();
          setIsPlaying(true);
        } catch (error) {
          console.error("Failed to play video:", error);
        }
      }
    }, [isVideoTour]);
  
    const handleMouseLeave = useCallback(() => {
      if (videoRef.current) {
        videoRef.current.pause();
        if (videoRef.current) videoRef.current.currentTime = 0;
        setIsPlaying(false);
      }
    }, []);

  return (
    <Link key={tour.id} href={`/tour/${tour.id}`}  onClick={handleTourClick}>
      <div

       onMouseEnter={handleMouseEnter}
       onMouseLeave={handleMouseLeave}
      
      className="group rounded-xl border border-gray-200 overflow-hidden hover:border-gray-400 transition-all duration-300 hover:shadow-lg hover:shadow-gray-400/20 cursor-pointer h-full bg-white/50">
        <div className="relative aspect-video overflow-hidden bg-gray-100">
          {hasMedia ? (
            <>
              {isVideoTour && tour.video360Url ? (
                // Video player with hover play
                <div 
                  className="relative w-full h-full"
                  onMouseEnter={async () => {
                    await videoRef.current?.play();
                    setIsPlaying(true);
                  }}
                  onMouseLeave={() => {
                    videoRef.current?.pause();
                    if (videoRef.current) videoRef.current.currentTime = 0;
                    setIsPlaying(false);
                  }}
                >
                  <video
                    ref={videoRef}
                    src={tour.video360Url}
                    className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-300"
                    muted
                    loop
                    playsInline
                    preload="metadata"
                  />
                  <div className={`absolute inset-0 bg-black/20 flex items-center justify-center transition-opacity duration-300 ${isPlaying ? 'opacity-0' : 'opacity-100'}`}>
                    <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Play className="w-6 h-6 text-gray-900 ml-1" />
                    </div>
                  </div>
                </div>
              ) : tour.image360Url ? (
                // Regular image
                <Image
                  src={tour.image360Url}
                  alt={tour.title}
                  fill
                  onLoad={() => setImageLoaded(true)}
                  loading="lazy"
                  className={`object-cover group-hover:scale-110 transition-transform duration-300 ${
                    imageLoaded ? "opacity-100" : "opacity-0"
                  }`}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              ) : (
                // Fallback for tours with no media
                <div className="w-full h-full flex items-center justify-center bg-linear-to-br from-gray-100 to-gray-200">
                  <div className="text-center p-6">
                    <Sparkles className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-sm text-gray-500 font-medium">
                      {getTourTypeDisplay(tour.tourType)}
                    </p>
                  </div>
                </div>
              )}
            </>
          ) : (
            // No media available
            <div className="w-full h-full flex items-center justify-center bg-linear-to-br from-gray-100 to-gray-200">
              <div className="text-center p-6">
                <Sparkles className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-sm text-gray-500 font-medium">
                  {getTourTypeDisplay(tour.tourType)}
                </p>
              </div>
            </div>
          )}
          
          {/* Tour type badge */}
          <div className="absolute top-3 right-3">
            <span className="px-2 py-1 text-xs font-medium bg-black/70 text-white rounded-full backdrop-blur-sm">
              {getTourTypeDisplay(tour.tourType)}
            </span>
          </div>
          
          {/* Hover overlay */}
          <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
        
        <div className="p-6">
          <div className="flex items-start justify-between mb-2">
            <h3 className="text-lg font-semibold text-gray-900 group-hover:text-gray-700 transition-colors flex-1 pr-2">
              {tour.title}
            </h3>
            {tour.isPublished ? (
              <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full shrink-0">
                Published
              </span>
            ) : (
              <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full shrink-0">
                Draft
              </span>
            )}
          </div>
          
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
            <MapPin className="w-4 h-4" />
            {tour.location}
          </div>
          
          <div className="flex flex-wrap gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <Eye className="w-4 h-4" />
              {tour.impressions?.toLocaleString() || 0}
            </div>
            <div className="flex items-center gap-1">
              <Sparkles className="w-4 h-4" />
              {hotspotsCount} hotspots
            </div>
            {hasAudio && (
              <div className="flex items-center gap-1">
                <Music className="w-4 h-4" />
                {audioRegionsCount} audio
              </div>
            )}
            {effectsCount > 0 && (
              <div className="flex items-center gap-1">
                <Sparkles className="w-4 h-4" />
                {effectsCount} effects
              </div>
            )}
          </div>
          
        </div>
      </div>
    </Link>
  );
};

// Loading skeleton component
const TourCardSkeleton = () => (
  <div className="rounded-xl border border-gray-200 overflow-hidden h-full bg-white/50 animate-pulse">
    <div className="aspect-video bg-gray-200" />
    <div className="p-6">
      <div className="h-4 bg-gray-200 rounded mb-2" />
      <div className="h-3 bg-gray-200 rounded w-3/4 mb-4" />
      <div className="flex gap-4">
        <div className="h-3 bg-gray-200 rounded w-1/4" />
        <div className="h-3 bg-gray-200 rounded w-1/4" />
        <div className="h-3 bg-gray-200 rounded w-1/4" />
      </div>
    </div>
  </div>
);

// Error component
const ErrorState = ({ onRetry }: { onRetry: () => void }) => (
  <div className="text-center py-12">
    <div className="text-gray-500 mb-4">Failed to load tours</div>
    <button 
      onClick={onRetry}
      className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
    >
      Try Again
    </button>
  </div>
);

// Empty state component
const EmptyState = () => (
  <div className="text-center py-12">
    <div className="text-gray-500 mb-4">No tours available yet</div>
  </div>
);

export default function VirtualToursPage() {
  const { data: toursResponse, isLoading, error, refetch } = useVirtualTours({
    isPublished: true,
    limit: 4
  });

  const tours = toursResponse?.data || [];
  const totalTours = toursResponse?.meta?.total || 0;
  const totalImpressions = tours?.reduce((sum, tour) => sum + (tour.impressions || 0), 0) || 0;

  // Calculate stats from real data
  const stats = [
    { 
      label: "Total Tours", 
      value: totalTours.toLocaleString(),
      icon: <Sparkles className="w-5 h-5" />
    },
    { 
      label: "Total Views", 
      value: totalImpressions.toLocaleString(),
      icon: <Eye className="w-5 h-5" />
    },
    { 
      label: "Active Tours", 
      value: tours.filter(tour => tour.isPublished).length.toString(),
      icon: <TrendingUp className="w-5 h-5" />
    },
  ];

  return (
    <PageLayout showBackgroundEffects={true} variant="default">
      {/* Hero Section */}
      <section className="container mx-auto px-6 py-20">
        <div className="space-y-6 mb-16">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 text-balance leading-tight">
            Immersive <span className="text-gray-900">360° Experiences</span>
          </h1>
          <p className="text-xl text-gray-600 text-balance">
            Build thoughtful Kwibuka virtual tours with interactive details, immersive audio, and respectful visuals—creating a space for remembrance, learning, and healing.
          </p>
          <div className="flex gap-4 pt-4">
            <Link
              href="/tour"
              className="px-6 py-3 rounded-lg bg-gray-900 text-white hover:bg-gray-800 transition-colors font-medium flex items-center gap-2"
            >
              Explore Tours <ChevronRight className="w-4 h-4" />
            </Link>
            <button className="px-6 py-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors font-medium text-gray-900">
              Learn More
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stats.map((stat, i) => (
            <div
              key={i}
              className="border border-gray-200 rounded-xl p-6 bg-white/50 backdrop-blur-sm hover:border-gray-300 transition-colors"
            >
              <div className="flex items-center gap-3 ">
                <div className="w-10 h-10 rounded-lg bg-gray-900 flex items-center justify-center text-white">
                  {stat.icon}
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">
                    {stat.value}
                  </div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Tours Section */}
      <section className="container mx-auto px-6 py-20 border-t border-gray-200">
        <div className="flex items-center justify-between mb-12">
          <h2 className="text-3xl font-bold text-gray-900">
            Featured Tours
          </h2>
          <Link
            href="/tour"
            className="text-gray-900 hover:text-gray-700 font-medium flex items-center gap-2"
          >
            View all tours <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Array.from({ length: 4 }).map((_, index) => (
              <TourCardSkeleton key={index} />
            ))}
          </div>
        ) : error ? (
          <ErrorState onRetry={() => refetch()} />
        ) : tours.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {tours.map((tour) => (
              <TourCard key={tour.id} tour={tour} />
            ))}
          </div>
        ) : (
          <EmptyState />
        )}
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-6 py-20 border-t border-gray-200">
        <h2 className="text-3xl font-bold mb-12 text-gray-900">
          Platform Features
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              icon: <Eye className="w-6 h-6" />,
              title: "360° Viewing",
              desc: "Support for panoramic images, 360° videos, 3D models, and embedded tours from Matterport and more",
            },
            {
              icon: <Sparkles className="w-6 h-6" />,
              title: "Interactive Hotspots",
              desc: "Add clickable information points, links, images, videos, and audio triggers throughout your tours",
            },
            {
              icon: <Music className="w-6 h-6" />,
              title: "Spatial Audio",
              desc: "3D positional audio regions that play based on viewer position with fade effects and distance control",
            },
          ].map((feature, i) => (
            <div
              key={i}
              className="p-6 rounded-xl border border-gray-200 bg-white/50 hover:border-gray-400 transition-colors group"
            >
              <div className="w-12 h-12 rounded-lg bg-gray-900 flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform">
                {feature.icon}
              </div>
              <h3 className="font-semibold text-gray-900 mb-2 text-lg">
                {feature.title}
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                {feature.desc}
              </p>
            </div>
          ))}
        </div>
      </section>
    </PageLayout>
  );
}