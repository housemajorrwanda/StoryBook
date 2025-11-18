"use client";

import PageLayout from "@/layout/PageLayout";
import { Search, Play, Sparkles, Eye, MapPin, Music, Info } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import {
  useIncrementViewCount,
  useVirtualTours,
} from "@/hooks/virtual-tour/use-virtual-tours";
import { VirtualTour } from "@/types/tour";
import { getTourTypeDisplay } from "@/utils/tour";
import { debounce } from "lodash";

const LIMIT = 9;

const TourCard = ({ tour }: { tour: VirtualTour }) => {
  const hasAudio = tour.audioRegions && tour.audioRegions.length > 0;
  const hotspotsCount = tour._count?.hotspots || tour.hotspots?.length || 0;
  const audioRegionsCount =
    tour._count?.audioRegions || tour.audioRegions?.length || 0;
  const effectsCount = tour._count?.effects || tour.effects?.length || 0;

  const isVideoTour = tour.tourType === "360_video";
  const hasMedia =
    tour.image360Url || tour.video360Url || tour.model3dUrl || tour.embedUrl;

  const { mutate: incrementViewCount } = useIncrementViewCount();

  const handleTourClick = useCallback(() => {
    incrementViewCount(tour.id, {
      onSuccess: () => {
        console.log("View count incremented for tour ID:", tour.id);
      },
      onError: (error) => {
        console.error("Failed to increment view count:", error);
      },
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
    <Link key={tour.id} href={`/tour/${tour.id}`} onClick={handleTourClick}>
      <div
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="group rounded-xl border border-gray-200 overflow-hidden hover:border-gray-400 transition-all duration-300 hover:shadow-lg hover:shadow-gray-400/20 cursor-pointer h-full bg-white/50"
      >
        <div className="relative aspect-video overflow-hidden bg-gray-100">
          {hasMedia ? (
            <>
              {isVideoTour && tour.video360Url ? (
                <div className="relative w-full h-full">
                  <video
                    ref={videoRef}
                    src={tour.video360Url}
                    className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-300"
                    muted
                    loop
                    playsInline
                    preload="metadata"
                  />
                  <div
                    className={`absolute inset-0 bg-black/20 flex items-center justify-center transition-opacity duration-300 ${
                      isPlaying ? "opacity-0" : "opacity-100"
                    }`}
                  >
                    <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Play className="w-6 h-6 text-gray-900 ml-1" />
                    </div>
                  </div>
                </div>
              ) : tour.image360Url ? (
                <Image
                  src={tour.image360Url}
                  alt={tour.title}
                  fill
                  className={`object-cover group-hover:scale-110 transition-transform duration-300 ${
                    imageLoaded ? "opacity-100" : "opacity-0"
                  }`}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  onLoad={() => setImageLoaded(true)}
                  loading="lazy"
                />
              ) : (
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
      <div className="flex items-start justify-between mb-2">
        <div className="h-5 bg-gray-200 rounded flex-1 mr-2" />
        <div className="h-6 bg-gray-200 rounded w-16" />
      </div>
      <div className="h-4 bg-gray-200 rounded w-3/4 mb-4" />
      <div className="flex flex-wrap gap-4">
        <div className="h-4 bg-gray-200 rounded w-1/4" />
        <div className="h-4 bg-gray-200 rounded w-1/4" />
        <div className="h-4 bg-gray-200 rounded w-1/4" />
      </div>
    </div>
  </div>
);

const FilterChip = ({
  label,
  value,
  isActive,
  onClick,
}: {
  label: string;
  value: string;
  isActive: boolean;
  onClick: (value: string) => void;
}) => (
  <button
    onClick={() => onClick(value)}
    className={`px-4 py-2 cursor-pointer rounded-full text-sm font-medium transition-colors ${
      isActive
        ? "bg-gray-600 text-white"
        : "bg-white text-gray-700 border border-gray-300 hover:border-gray-400"
    }`}
  >
    {label}
  </button>
);

export default function Tour() {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [page, setPage] = useState(1);
  const loaderRef = useRef<HTMLDivElement>(null);

  // Debounce search to avoid too many API calls
  const debouncedSearch = useMemo(
    () =>
      debounce((value: string) => {
        setDebouncedSearchTerm(value);
        setPage(1);
      }, 500),
    []
  );

  useEffect(() => {
    debouncedSearch(searchTerm);
    return () => debouncedSearch.cancel();
  }, [searchTerm, debouncedSearch]);

  const params = useMemo(
    () => ({
      isPublished: true,
      limit: LIMIT,
      page,
      search: debouncedSearchTerm || undefined,
      tourType: typeFilter === "all" ? undefined : typeFilter,
    }),
    [debouncedSearchTerm, typeFilter, page]
  );

  const {
    data: toursResponse,
    isLoading,
    error,
    isFetching,
    refetch,
  } = useVirtualTours(params);

  const tours = toursResponse?.data || [];
  const hasMore = tours.length === LIMIT && !isFetching;

  // Reset to page 1 when filters change
  useEffect(() => {
    // Use a callback to update page state asynchronously to avoid cascading renders
    const timer = setTimeout(() => setPage(1), 0);
    return () => clearTimeout(timer);
  }, [debouncedSearchTerm, typeFilter]);

  // Infinite scroll observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isFetching) {
          setPage((prev) => prev + 1);
        }
      },
      { threshold: 0.1 }
    );

    const currentLoader = loaderRef.current;
    if (currentLoader && hasMore) {
      observer.observe(currentLoader);
    }

    return () => {
      if (currentLoader) {
        observer.unobserve(currentLoader);
      }
    };
  }, [hasMore, isFetching]);

  const filterOptions = [
    { value: "all", label: "All Tours" },
    { value: "360_image", label: "360° Images" },
    { value: "3d_model", label: "3D Models" },
    { value: "360_video", label: "360° Videos" },
    { value: "embed", label: "Embedded" },
  ];

  const handleFilterChange = useCallback((value: string) => {
    setTypeFilter(value);
    setPage(1);
  }, []);

  const showLoadingSkeletons = isLoading && page === 1;
  const showEmptyState = !isLoading && tours.length === 0;
  const showLoadMore = hasMore && !isLoading;

  return (
    <PageLayout showBackgroundEffects={true} variant="default">
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 py-8">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Virtual Tour Gallery
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Immerse yourself in our collection of interactive virtual
              experiences
            </p>
          </div>

          {/* Search and Filters */}
          <div className="max-w-4xl mx-auto mb-12">
            {/* Search Bar */}
            <div className="relative mb-6">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search tours by title, location, or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-xl bg-white border border-gray-200 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent shadow-sm"
              />
            </div>

            {/* Filter Chips */}
            <div className="flex  flex-wrap gap-2 justify-center">
              {filterOptions.map((option) => (
                <FilterChip
                  key={option.value}
                  label={option.label}
                  value={option.value}
                  isActive={typeFilter === option.value}
                  onClick={handleFilterChange}
                />
              ))}
            </div>
          </div>

          {/* Tours Grid */}
          <div className="container mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {tours.map((tour) => (
                <TourCard key={tour.id} tour={tour} />
              ))}

              {showLoadingSkeletons &&
                Array.from({ length: LIMIT }).map((_, index) => (
                  <TourCardSkeleton key={`skeleton-${index}`} />
                ))}
            </div>

            {/* Loading More Indicator */}
            {showLoadMore && (
              <div
                ref={loaderRef}
                className="flex justify-center items-center py-8"
              >
                <div className="flex items-center gap-3 text-gray-600">
                  <div className="w-5 h-5 border-2 border-gray-600 border-t-transparent rounded-full animate-spin" />
                  <span>Loading more tours...</span>
                </div>
              </div>
            )}

            {/* Empty State */}
            {showEmptyState && (
              <div className="text-center py-16">
                <div className="max-w-md mx-auto">
                  <Info className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    No tours found
                  </h3>
                  <p className="text-gray-600 mb-6">
                    {debouncedSearchTerm
                      ? `No results found for "${debouncedSearchTerm}". Try adjusting your search or filters.`
                      : "No virtual tours available at the moment. Please check back later."}
                  </p>
                  {(debouncedSearchTerm || typeFilter !== "all") && (
                    <button
                      onClick={() => {
                        setSearchTerm("");
                        setTypeFilter("all");
                      }}
                      className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                    >
                      Clear filters
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="text-center py-16">
                <div className="max-w-md mx-auto">
                  <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">⚠️</span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Failed to load tours
                  </h3>
                  <p className="text-gray-600 mb-6">
                    We encountered an error while loading the tours. Please try
                    again.
                  </p>
                  <button
                    onClick={() => refetch()}
                    className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    Retry
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
