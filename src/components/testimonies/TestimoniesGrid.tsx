"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import {
  User,
  MapPin,
  Mic,
  Video,
  ArrowRight,
  FileText,
  Calendar,
  Link as LinkIcon,
  Search,
  Filter,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useTestimonies } from "@/hooks/useTestimonies";
import { Testimony } from "@/types/testimonies";
import {
  generateTestimonySlug,
} from "@/utils/testimony.utils";
import { EmptyState } from "@/components/shared";

interface TestimoniesGridProps {
  limit?: number;
  showHeader?: boolean;
  showFilters?: boolean;
}

export default function TestimoniesGrid({
  limit,
  showHeader = true,
  showFilters = true,
}: TestimoniesGridProps) {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [submissionType, setSubmissionType] = useState<string>("");
  const [status, setStatus] = useState<string>("");
  const [isPublished, setIsPublished] = useState<boolean | undefined>(undefined);
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = limit || 9;

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setCurrentPage(1); // Reset to page 1 when search changes
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  // Calculate skip based on current page
  const skip = (currentPage - 1) * itemsPerPage;

  const filters = {
    ...(debouncedSearch && { search: debouncedSearch }),
    ...(submissionType && { submissionType }),
    ...(status && { status }),
    ...(isPublished !== undefined && { isPublished }),
    ...(dateFrom && { dateFrom }),
    ...(dateTo && { dateTo }),
    skip,
    limit: itemsPerPage,
  };

  const { data: response, isLoading, error } = useTestimonies(filters);
  const testimonies = response?.data || [];

  const formatDateRange = (from: string, to: string) => {
    const fromDate = new Date(from);
    const toDate = new Date(to);
    const fromMonth = fromDate.toLocaleDateString("en-US", { month: "short" });
    const toMonth = toDate.toLocaleDateString("en-US", { month: "short" });
    const fromYear = fromDate.getFullYear();
    const toYear = toDate.getFullYear();
    
    if (fromYear === toYear && fromMonth === toMonth) {
      return `${fromMonth} ${fromYear}`;
    }
    if (fromYear === toYear) {
      return `${fromMonth}-${toMonth} ${fromYear}`;
    }
    return `${fromMonth} ${fromYear}-${toMonth} ${toYear}`;
  };

  const getSubmissionIcon = (type: string) => {
    switch (type) {
      case "audio":
        return <Mic className="w-5 h-5 text-white" />;
      case "video":
        return <Video className="w-5 h-5 text-white" />;
      default:
        return <FileText className="w-5 h-5 text-white" />;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="relative">
          <div className="flex flex-col items-center gap-6">
            <div className="relative">
              <div className="w-20 h-20 border-4 border-gray-200 border-t-gray-900 rounded-full animate-spin" />
              <div className="absolute inset-0 blur-2xl bg-gray-400 opacity-20 animate-pulse" />
            </div>
            <div className="text-center">
              <span className="text-xl text-gray-900 font-bold tracking-wide block">
                Loading Stories
              </span>
              <span className="text-sm text-gray-500 mt-1 block">
                Preparing testimonies for you
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-24">
        <div className="inline-block p-12 bg-red-50 border-l-4 border-red-600">
          <p className="text-2xl font-black text-red-900 mb-3">
            Unable to Load Testimonies
          </p>
          <p className="text-base text-red-600 mb-6">
            Please refresh the page or try again later
          </p>
          <button className="px-8 py-4 bg-red-600 text-white font-bold hover:bg-red-700 transition-all duration-300">
            Retry
          </button>
        </div>
      </div>
    );
  }

  const displayedTestimonies = testimonies;

  if (!displayedTestimonies || displayedTestimonies.length === 0) {
    return (
      <EmptyState
        title="No Testimonies Yet"
        subtitle="Be the first to share your story and inspire others with your journey"
        icon={<FileText className="w-16 h-16 text-gray-300" />}
        size="lg"
      />
    );
  }

  const clearFilters = () => {
    setSearch("");
    setDebouncedSearch("");
    setSubmissionType("");
    setStatus("");
    setIsPublished(undefined);
    setDateFrom("");
    setDateTo("");
    setCurrentPage(1);
  };

  const totalPages = response?.meta ? Math.ceil(response.meta.total / itemsPerPage) : 1;
  const canGoPrevious = currentPage > 1;
  const canGoNext = currentPage < totalPages;

  const hasActiveFilters = debouncedSearch || submissionType || status || isPublished !== undefined || dateFrom || dateTo;

  return (
    <div className="w-full">
      {showHeader && (
        <div className="max-w-6xl mx-auto mb-8 px-4">
          <div className="border-l-8 border-black pl-6">
            <span className="text-xs font-bold tracking-[0.3em] uppercase text-gray-600 block mb-2">
              Testimonies
            </span>
            <h1 className="text-5xl md:text-7xl font-black tracking-tight text-black leading-none">
              Stories That Matter
            </h1>
            <p className="text-lg text-gray-600 mt-4 max-w-2xl">
              Voices of resilience, courage, and remembrance from survivors and
              witnesses
            </p>
          </div>
        </div>
      )}

      {/* Search and Filters - Positioned right after header */}
      {showFilters && (
        <div className="max-w-7xl mx-auto mb-8 px-4">
          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
            {/* Search Bar */}
            <div className="mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search testimonies by title, description, or name..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-800 focus:border-transparent text-gray-900 bg-white placeholder:text-gray-400"
                />
              </div>
            </div>

            {/* Filter Toggle */}
            <div className="flex items-center justify-between">
              <button
                onClick={() => setShowFilterPanel(!showFilterPanel)}
                className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Filter className="w-4 h-4" />
                Filters
                {hasActiveFilters && (
                  <span className="bg-gray-800 text-white text-xs px-2 py-0.5 rounded-full">
                    Active
                  </span>
                )}
              </button>
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-gray-600 hover:text-gray-800 transition-colors"
                >
                  <X className="w-4 h-4" />
                  Clear All
                </button>
              )}
            </div>

            {/* Filter Panel */}
            {showFilterPanel && (
              <div className="mt-4 pt-4 border-t border-gray-200 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Submission Type */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Type
                  </label>
                        <select
                          value={submissionType}
                          onChange={(e) => {
                            setSubmissionType(e.target.value);
                            setCurrentPage(1);
                          }}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-800 focus:border-transparent"
                        >
                    <option value="">All Types</option>
                    <option value="written">Written</option>
                    <option value="audio">Audio</option>
                    <option value="video">Video</option>
                  </select>
                </div>

                {/* Status */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Status
                  </label>
                        <select
                          value={status}
                          onChange={(e) => {
                            setStatus(e.target.value);
                            setCurrentPage(1);
                          }}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-800 focus:border-transparent"
                        >
                    <option value="">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>

                {/* Published */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Published
                  </label>
                        <select
                          value={isPublished === undefined ? "" : isPublished ? "true" : "false"}
                          onChange={(e) => {
                            setIsPublished(e.target.value === "" ? undefined : e.target.value === "true");
                            setCurrentPage(1);
                          }}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-800 focus:border-transparent"
                        >
                    <option value="">All</option>
                    <option value="true">Published</option>
                    <option value="false">Not Published</option>
                  </select>
                </div>

                {/* Date From */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Date From
                  </label>
                        <input
                          type="date"
                          value={dateFrom}
                          onChange={(e) => {
                            setDateFrom(e.target.value);
                            setCurrentPage(1);
                          }}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-800 focus:border-transparent"
                        />
                </div>

                {/* Date To */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Date To
                  </label>
                        <input
                          type="date"
                          value={dateTo}
                          onChange={(e) => {
                            setDateTo(e.target.value);
                            setCurrentPage(1);
                          }}
                          min={dateFrom || undefined}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-800 focus:border-transparent"
                        />
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Results Count */}
      {showFilters && response?.meta && (
        <div className="max-w-7xl mx-auto mb-4 px-4">
          <p className="text-sm text-gray-600">
            Showing {skip + 1}-{Math.min(skip + itemsPerPage, response.meta.total)} of {response.meta.total} testimonies
          </p>
        </div>
      )}

      {/* Card Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-4 max-w-7xl mx-auto">
        {displayedTestimonies.map((testimony: Testimony) => {
          const imageCount = testimony.images?.length || 0;
          const submissionType = testimony.submissionType || "written";
          const typeLabel = submissionType.charAt(0).toUpperCase() + submissionType.slice(1);

          // Get excerpt text
          let excerptText = "";
          if (testimony.fullTestimony) {
            const plainText = testimony.fullTestimony.replace(/<[^>]*>/g, "");
            excerptText = plainText.substring(0, 180);
            if (plainText.length > 180) excerptText += "...";
          } else if (submissionType === "audio") {
            excerptText = "I was hiding in the marshes of Nyanza when the killings began. This is my story of survival and the family members I lost. We stayed there for...";
          } else if (submissionType === "video") {
            excerptText = "I was hiding in the marshes of Nyanza when the killings began. This is my story of survival and the family members I lost. We stayed there for...";
          }

          // Format date
          let dateText = "";
          if (testimony.dateOfEventFrom && testimony.dateOfEventTo) {
            dateText = formatDateRange(testimony.dateOfEventFrom, testimony.dateOfEventTo);
          } else if (testimony.dateOfEventFrom) {
            const date = new Date(testimony.dateOfEventFrom);
            dateText = date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
          }

          const survivorName = testimony.identityPreference === "anonymous"
            ? "Anonymous Survivor"
            : testimony.fullName || "Unknown";

          return (
            <Link
              key={testimony.id}
              href={`/testimonies/${generateTestimonySlug(
                testimony.id,
                testimony.eventTitle
              )}`}
              className="group"
            >
              <article className="bg-gray-100 rounded-2xl p-6 h-full flex flex-col shadow-sm">
                {/* Top: Type Badge and Count */}
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-400 rounded-lg">
                    {getSubmissionIcon(submissionType)}
                    <span className="text-sm font-bold text-white uppercase">{typeLabel}</span>
                    </div>
                  {imageCount > 0 && (
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-400 rounded-lg">
                      <LinkIcon className="w-4 h-4 text-white" />
                      <span className="text-sm font-medium text-white">{imageCount}</span>
                    </div>
                        )}
                      </div>

                      {/* Title */}
                <h2 className="text-2xl font-bold text-black mb-5 line-clamp-2">
                        {testimony.eventTitle}
                      </h2>

                {/* Metadata Row */}
                <div className="flex flex-wrap items-center gap-4 mb-5 text-sm text-gray-700">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    <span className="font-medium">{survivorName}</span>
                  </div>
                  {dateText && (
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>{dateText}</span>
                    </div>
                  )}
                  {testimony.location && (
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4" />
                          <span>{testimony.location}</span>
                    </div>
                  )}
                </div>

                {/* Excerpt */}
                {excerptText && (
                  <p className="text-sm text-gray-700 leading-relaxed line-clamp-3 mb-6 flex-grow">
                    {excerptText}
                  </p>
                )}

                {/* Read Full Testimony Button */}
                <button className="w-full mt-auto px-4 py-3 bg-gray-400 hover:bg-gray-500 text-white font-semibold rounded-lg transition-colors flex items-center justify-between">
                  <span>Read Full Testimony</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </article>
            </Link>
          );
        })}
      </div>

      {/* Pagination */}
      {showFilters && response?.meta && totalPages > 1 && (
        <div className="max-w-7xl mx-auto mt-8 px-4">
          <div className="flex items-center justify-between bg-white rounded-lg p-4 shadow-sm border border-gray-200">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={!canGoPrevious}
                className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </button>
            </div>

            <div className="flex items-center gap-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                // Show first page, last page, current page, and pages around current
                if (
                  page === 1 ||
                  page === totalPages ||
                  (page >= currentPage - 1 && page <= currentPage + 1)
                ) {
                  return (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-4 py-2 text-sm font-semibold rounded-lg transition-colors ${
                        currentPage === page
                          ? "bg-gray-800 text-white"
                          : "text-gray-700 bg-gray-100 hover:bg-gray-200"
                      }`}
                    >
                      {page}
                    </button>
                  );
                } else if (
                  page === currentPage - 2 ||
                  page === currentPage + 2
                ) {
                  return (
                    <span key={page} className="px-2 text-gray-500">
                      ...
                    </span>
                  );
                }
                return null;
              })}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                disabled={!canGoNext}
                className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
