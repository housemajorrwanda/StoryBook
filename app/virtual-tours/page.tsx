"use client";

import PageLayout from "@/layout/PageLayout";
import {
  Search,
  Play,
  Sparkles,
  Eye,
  MapPin,
  Music,
  Info,
  X,
} from "lucide-react";
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
  const hotspotsCount = tour._count?.hotspots || tour.hotspots?.length || 0;
  const audioRegionsCount =
    tour._count?.audioRegions || tour.audioRegions?.length || 0;
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
    <Link href={`/virtual-tours/${tour.id}`} onClick={handleTourClick}>
      <div
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="group relative rounded-2xl overflow-hidden cursor-pointer h-full bg-white border border-gray-100 hover:border-gray-300 transition-all duration-500 hover:shadow-xl hover:shadow-black/8 hover:-translate-y-0.5"
      >
        {/* Media */}
        <div className="relative aspect-16/10 overflow-hidden bg-gray-100">
          {hasMedia ? (
            <>
              {isVideoTour && tour.video360Url ? (
                <div className="relative w-full h-full">
                  <video
                    ref={videoRef}
                    src={tour.video360Url}
                    className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-105"
                    muted
                    loop
                    playsInline
                    preload="metadata"
                  />
                  <div
                    className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${
                      isPlaying ? "opacity-0" : "opacity-100"
                    }`}
                  >
                    <div className="w-12 h-12 rounded-full bg-white/95 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                      <Play
                        className="w-4 h-4 text-gray-900 ml-0.5"
                        fill="currentColor"
                      />
                    </div>
                  </div>
                </div>
              ) : tour.image360Url ? (
                <>
                  <Image
                    src={tour.image360Url}
                    alt={tour.title}
                    fill
                    className={`object-cover transition-all duration-700 group-hover:scale-105 ${
                      imageLoaded ? "opacity-100" : "opacity-0"
                    }`}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    onLoad={() => setImageLoaded(true)}
                    loading="lazy"
                  />
                  {!imageLoaded && (
                    <div className="absolute inset-0 bg-gray-100 animate-pulse" />
                  )}
                </>
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-50">
                  <div className="text-center">
                    <Sparkles className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                    <p className="text-xs text-gray-400 font-medium tracking-wide uppercase">
                      {getTourTypeDisplay(tour.tourType)}
                    </p>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-50">
              <div className="text-center">
                <Sparkles className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                <p className="text-xs text-gray-400 font-medium tracking-wide uppercase">
                  {getTourTypeDisplay(tour.tourType)}
                </p>
              </div>
            </div>
          )}

          {/* Type badge */}
          <div className="absolute top-3 left-3">
            <span className="px-2.5 py-1 text-[10px] font-semibold tracking-widest uppercase bg-black/60 text-white/90 rounded-full backdrop-blur-md">
              {getTourTypeDisplay(tour.tourType)}
            </span>
          </div>

          {/* Subtle dark overlay on hover */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-500" />
        </div>

        {/* Content */}
        <div className="p-5">
          <div className="flex items-start justify-between gap-2 mb-3">
            <h3 className="text-sm font-semibold text-gray-900 leading-snug line-clamp-2 flex-1">
              {tour.title}
            </h3>
            <span
              className={`shrink-0 px-2 py-0.5 text-[10px] font-semibold tracking-wide uppercase rounded-full ${
                tour.isPublished
                  ? "bg-emerald-50 text-emerald-700"
                  : "bg-amber-50 text-amber-700"
              }`}
            >
              {tour.isPublished ? "Live" : "Draft"}
            </span>
          </div>

          {tour.location && (
            <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-4">
              <MapPin className="w-3 h-3 shrink-0" />
              <span className="truncate">{tour.location}</span>
            </div>
          )}

          <div className="flex items-center gap-4 text-xs text-gray-400 pt-4 border-t border-gray-50">
            <div className="flex items-center gap-1">
              <Eye className="w-3 h-3" />
              <span>{tour.impressions?.toLocaleString() || 0}</span>
            </div>
            {hotspotsCount > 0 && (
              <div className="flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                <span>{hotspotsCount}</span>
              </div>
            )}
            {audioRegionsCount > 0 && (
              <div className="flex items-center gap-1">
                <Music className="w-3 h-3" />
                <span>{audioRegionsCount}</span>
              </div>
            )}
          </div>
        </div>

        {/* Right arrow on hover */}
        <div className="absolute bottom-5 right-5 w-7 h-7 rounded-full bg-gray-900 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-1 group-hover:translate-x-0">
          <svg
            className="w-3 h-3 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
            />
          </svg>
        </div>
      </div>
    </Link>
  );
};

const TourCardSkeleton = () => (
  <div className="rounded-2xl border border-gray-100 overflow-hidden h-full bg-white animate-pulse">
    <div className="aspect-16/10 bg-gray-100" />
    <div className="p-5">
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="h-4 bg-gray-100 rounded flex-1" />
        <div className="h-4 bg-gray-100 rounded w-10" />
      </div>
      <div className="h-3 bg-gray-100 rounded w-1/2 mb-4" />
      <div className="flex gap-4 pt-4 border-t border-gray-50">
        <div className="h-3 bg-gray-100 rounded w-8" />
        <div className="h-3 bg-gray-100 rounded w-8" />
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
    type="button"
    onClick={() => onClick(value)}
    className={`px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all duration-200 ${
      isActive
        ? "bg-gray-900 text-white"
        : "bg-white text-gray-500 border border-gray-200 hover:border-gray-400 hover:text-gray-700"
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

  const debouncedSearch = useMemo(
    () =>
      debounce((value: string) => {
        setDebouncedSearchTerm(value);
        setPage(1);
      }, 500),
    [],
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
    [debouncedSearchTerm, typeFilter, page],
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

  useEffect(() => {
    const timer = setTimeout(() => setPage(1), 0);
    return () => clearTimeout(timer);
  }, [debouncedSearchTerm, typeFilter]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isFetching) {
          setPage((prev) => prev + 1);
        }
      },
      { threshold: 0.1 },
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
    { value: "all", label: "All" },
    { value: "360_image", label: "360° Image" },
    { value: "3d_model", label: "3D Model" },
    { value: "360_video", label: "360° Video" },
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
      <div className="min-h-screen bg-[#fafafa]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {/* Header */}
          <div className="mb-14 text-center">
            <p className="text-xs font-semibold tracking-[0.2em] uppercase text-gray-400 mb-5">
              Kwibuka — Remember
            </p>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight mb-5">
              Virtual Tours
            </h1>
            <p className="max-w-lg mx-auto text-sm text-gray-500 leading-relaxed mb-8">
              Step inside sacred sites and memorial spaces through immersive
              360° experiences — built to honor the memory of victims of the
              1994 Genocide against the Tutsi and foster education, healing, and
              reflection.
            </p>
            {/* Divider pills */}
            <div className="flex items-center justify-center gap-3 text-[10px] font-semibold tracking-[0.15em] uppercase text-gray-300">
              <span>360° Imagery</span>
              <span className="w-1 h-1 rounded-full bg-gray-300" />
              <span>3D Models</span>
              <span className="w-1 h-1 rounded-full bg-gray-300" />
              <span>Spatial Audio</span>
              <span className="w-1 h-1 rounded-full bg-gray-300" />
              <span>Interactive Hotspots</span>
            </div>
          </div>

          {/* Search + Filters */}
          <div className="max-w-2xl mx-auto mb-12 space-y-4">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by title, location, or description…"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-11 pr-10 py-3 rounded-xl bg-white border border-gray-200 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-300 transition-all duration-200"
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                >
                  <X className="w-3 h-3 text-gray-500" />
                </button>
              )}
            </div>

            <div className="flex flex-wrap gap-2 justify-center">
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

          {/* Result count */}
          {!isLoading && tours.length > 0 && (
            <p className="text-xs text-gray-400 mb-8 text-center">
              Showing{" "}
              <span className="text-gray-700 font-medium">{tours.length}</span>{" "}
              tour{tours.length !== 1 ? "s" : ""}
              {debouncedSearchTerm ? (
                <>
                  {" "}
                  for{" "}
                  <span className="text-gray-700 font-medium">
                    &ldquo;{debouncedSearchTerm}&rdquo;
                  </span>
                </>
              ) : null}
            </p>
          )}

          {/* Tours Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
            {tours.map((tour) => (
              <TourCard key={tour.id} tour={tour} />
            ))}

            {showLoadingSkeletons &&
              Array.from({ length: LIMIT }).map((_, index) => (
                <TourCardSkeleton key={`skeleton-${index}`} />
              ))}
          </div>

          {/* Load More */}
          {showLoadMore && (
            <div ref={loaderRef} className="flex justify-center py-10">
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <div className="w-4 h-4 border border-gray-300 border-t-gray-700 rounded-full animate-spin" />
                Loading more
              </div>
            </div>
          )}

          {/* Empty State */}
          {showEmptyState && (
            <div className="text-center py-20">
              <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                <Info className="w-5 h-5 text-gray-400" />
              </div>
              <h3 className="text-sm font-semibold text-gray-900 mb-2">
                {debouncedSearchTerm
                  ? "No results found"
                  : "No tours available"}
              </h3>
              <p className="text-xs text-gray-400 mb-6 max-w-xs mx-auto">
                {debouncedSearchTerm
                  ? `Nothing matched "${debouncedSearchTerm}". Try a broader term or remove a filter.`
                  : "Tours will appear here once published. Check back soon."}
              </p>
              {(debouncedSearchTerm || typeFilter !== "all") && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchTerm("");
                    setTypeFilter("all");
                  }}
                  className="px-4 py-2 text-xs font-semibold bg-gray-900 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Clear filters
                </button>
              )}
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="text-center py-20">
              <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
                <span className="text-lg">⚠</span>
              </div>
              <h3 className="text-sm font-semibold text-gray-900 mb-2">
                Failed to load tours
              </h3>
              <p className="text-xs text-gray-400 mb-6">
                Something went wrong. Please try again.
              </p>
              <button
                type="button"
                onClick={() => refetch()}
                className="px-4 py-2 text-xs font-semibold bg-gray-900 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                Retry
              </button>
            </div>
          )}
        </div>
      </div>
    </PageLayout>
  );
}
