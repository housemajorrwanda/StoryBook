"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import type { InfiniteData } from "@tanstack/react-query";
import {
  User,
  MapPin,
  FileText,
  Search,
  Headphones,
  Play,
  ArrowRight,
  BookOpen,
  X,
  Loader2,
} from "lucide-react";
import { useTestimonies } from "@/hooks/useTestimonies";
import { Testimony } from "@/types/testimonies";
import { generateTestimonySlug } from "@/utils/testimony.utils";
import { EmptyState } from "@/components/shared";
import SkeletonTestimonies from "./SkeletonTestimonies";

interface TestimoniesGridProps {
  limit?: number;
  showHeader?: boolean;
  showFilters?: boolean;
}

type TestimonyPage = {
  data: Testimony[];
  meta?: { skip: number; limit: number; total: number };
};

const TYPE_META = {
  written: {
    label: "Written",
    icon: <FileText className="w-3.5 h-3.5" />,
    accent: "text-emerald-600",
    bg: "bg-emerald-50",
  },
  audio: {
    label: "Audio",
    icon: <Headphones className="w-3.5 h-3.5" />,
    accent: "text-indigo-600",
    bg: "bg-indigo-50",
  },
  video: {
    label: "Video",
    icon: <Play className="w-3.5 h-3.5" />,
    accent: "text-rose-600",
    bg: "bg-rose-50",
  },
};

export const formatReads = (value?: number) => {
  if (!value || value <= 0) return "0 reads";
  if (value < 1000) return `${value} reads`;
  const abbreviated = (value / 1000).toFixed(value % 1000 === 0 ? 0 : 1);
  return `${abbreviated}k reads`;
};

const stripHtml = (value?: string, max = 280) => {
  if (!value) return "";
  const plain = value.replace(/<[^>]+>/g, "");
  if (plain.length <= max) return plain;
  return `${plain.substring(0, max)}…`;
};

export default function TestimoniesGrid({ limit }: TestimoniesGridProps) {
  const pageSize = limit ?? 5;
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm.trim());
    }, 400);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const { data, status, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useTestimonies({
      search: debouncedSearch || undefined,
      status: "approved",
      isPublished: true,
      limit: pageSize,
    });

  const pages = useMemo<TestimonyPage[]>(
    () =>
      ((data as InfiniteData<TestimonyPage> | undefined)?.pages ??
        []) as TestimonyPage[],
    [data],
  );
  const testimonies = useMemo(
    () => pages.flatMap((page) => page.data),
    [pages],
  );
  const isLoading = status === "pending";
  const isError = status === "error";
  const isSearching = searchTerm !== debouncedSearch;

  const sentinelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!hasNextPage) return;
    const node = sentinelRef.current;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { rootMargin: "200px" },
    );
    if (node) observer.observe(node);
    return () => {
      if (node) observer.unobserve(node);
      observer.disconnect();
    };
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  const searchBar = (
    <div className="mb-8">
      <div className="relative">
        {isSearching ? (
          <Loader2 className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 animate-spin" />
        ) : (
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        )}
        <input
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search stories..."
          className="w-full pl-11 pr-10 py-3 bg-white rounded-xl border border-gray-200 focus:border-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900/5 text-sm text-gray-900 placeholder:text-gray-400 transition-all duration-200"
        />
        {searchTerm && (
          <button
            type="button"
            onClick={() => setSearchTerm("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
            aria-label="Clear search"
          >
            <X className="w-4 h-4 text-gray-400" />
          </button>
        )}
      </div>
    </div>
  );

  if (isLoading && !debouncedSearch) return <SkeletonTestimonies />;

  if (isError) {
    return (
      <div className="w-full">
        {searchBar}
        <EmptyState
          title="Unable to load testimonies"
          subtitle="Please refresh the page or try again later."
          icon={<FileText className="w-16 h-16 text-gray-300" />}
          size="lg"
        />
      </div>
    );
  }

  if (testimonies.length === 0 && !debouncedSearch) {
    return (
      <div className="w-full">
        {searchBar}
        <EmptyState
          title="No published testimonies yet"
          subtitle="Check back later or share a story to inspire the community."
          icon={<FileText className="w-16 h-16 text-gray-300" />}
          size="lg"
        />
      </div>
    );
  }

  return (
    <div className="w-full">
      {searchBar}

      {/* Loading state for search */}
      {isLoading && debouncedSearch && (
        <div className="py-16 text-center">
          <div className="flex items-center justify-center gap-3 text-gray-400">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span className="text-sm">Searching stories...</span>
          </div>
        </div>
      )}

      {/* No search results */}
      {!isLoading && testimonies.length === 0 && debouncedSearch && (
        <EmptyState
          title="No stories found"
          subtitle={`No results for "${debouncedSearch}". Try a different search term.`}
          icon={<Search className="w-16 h-16 text-gray-300" />}
          size="lg"
        />
      )}

      {/* Stories */}
      <div>
        {testimonies.map((testimony: Testimony, index: number) => {
          const type = testimony.submissionType || "written";
          const meta =
            TYPE_META[type as keyof typeof TYPE_META] || TYPE_META.written;
          const slug = generateTestimonySlug(
            testimony.id,
            testimony.eventTitle,
          );
          const excerpt = stripHtml(testimony.fullTestimony, 280);
          const createdAt = testimony.createdAt
            ? new Date(testimony.createdAt).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })
            : "";
          const authorName =
            testimony.identityPreference === "anonymous"
              ? "Anonymous"
              : testimony.user?.name || testimony.fullName || "Unknown";
          const coverImage = testimony.images?.[0]?.imageUrl;

          // Featured first story
          if (index === 0) {
            return (
              <article key={testimony.id} className="mb-10">
                <Link href={`/testimonies/${slug}`} className="group block">
                  {/* Featured image */}
                  {coverImage && (
                    <div className="relative w-full aspect-video rounded-2xl overflow-hidden mb-6">
                      <Image
                        src={coverImage}
                        alt={testimony.eventTitle}
                        fill
                        className="object-cover group-hover:scale-[1.03] transition-transform duration-700"
                        sizes="(min-width: 768px) 60vw, 100vw"
                      />
                      <div className="absolute inset-0 bg-linear-to-t from-black/50 via-transparent to-transparent" />
                      <div className="absolute bottom-5 left-5">
                        <span
                          className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full bg-white/90 backdrop-blur-sm ${meta.accent}`}
                        >
                          {meta.icon}
                          {meta.label} Story
                        </span>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-3 text-xs text-gray-400 mb-3">
                    <span>{createdAt}</span>
                    {testimony.location && (
                      <>
                        <span className="w-1 h-1 rounded-full bg-gray-300" />
                        <span className="inline-flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {testimony.location}
                        </span>
                      </>
                    )}
                  </div>

                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900 leading-snug mb-3 group-hover:text-gray-600 transition-colors">
                    {testimony.eventTitle}
                  </h2>

                  <p className="text-gray-500 text-base md:text-lg leading-relaxed mb-5 line-clamp-3">
                    {excerpt ||
                      "A testimony capturing moments of courage, resilience, and remembrance."}
                  </p>

                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-2 text-sm font-medium text-gray-700">
                      <span className="w-7 h-7 rounded-full bg-gray-900 text-white flex items-center justify-center text-xs font-bold">
                        {authorName[0]?.toUpperCase()}
                      </span>
                      {authorName}
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-400 group-hover:text-gray-900 transition-colors">
                      Read story
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
                    </span>
                  </div>
                </Link>
              </article>
            );
          }

          // Regular stories
          return (
            <article key={testimony.id} className="border-t border-gray-100">
              <Link
                href={`/testimonies/${slug}`}
                className="group flex gap-5 md:gap-6 py-7 md:py-8"
              >
                {/* Text content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2.5 text-xs text-gray-400 mb-2.5">
                    <span
                      className={`inline-flex items-center gap-1 font-semibold ${meta.accent}`}
                    >
                      {meta.icon}
                      {meta.label}
                    </span>
                    <span className="w-1 h-1 rounded-full bg-gray-300" />
                    <span>{createdAt}</span>
                  </div>

                  <h2 className="text-lg md:text-xl font-bold text-gray-900 leading-snug mb-2 group-hover:text-gray-600 transition-colors line-clamp-2">
                    {testimony.eventTitle}
                  </h2>

                  <p className="text-gray-500 text-sm leading-relaxed line-clamp-2 mb-3">
                    {excerpt ||
                      "A testimony capturing moments of courage and remembrance."}
                  </p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 text-xs text-gray-500">
                      <span className="inline-flex items-center gap-1.5 font-medium text-gray-700">
                        <User className="w-3 h-3 text-gray-400" />
                        {authorName}
                      </span>
                      {testimony.location && (
                        <>
                          <span className="w-1 h-1 rounded-full bg-gray-200" />
                          <span className="inline-flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-gray-400" />
                            {testimony.location}
                          </span>
                        </>
                      )}
                      <span className="w-1 h-1 rounded-full bg-gray-200" />
                      <span>{formatReads(testimony.impressions)}</span>
                    </div>
                    <span className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-400 opacity-0 group-hover:opacity-100 group-hover:text-gray-900 transition-all duration-200">
                      Read story
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform duration-200" />
                    </span>
                  </div>
                </div>

                {/* Thumbnail */}
                {coverImage ? (
                  <div className="relative w-24 h-24 md:w-32 md:h-32 rounded-xl overflow-hidden shrink-0 self-center">
                    <Image
                      src={coverImage}
                      alt={testimony.eventTitle}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                      sizes="128px"
                    />
                  </div>
                ) : (
                  <div
                    className={`w-24 h-24 md:w-32 md:h-32 rounded-xl shrink-0 self-center flex items-center justify-center ${meta.bg}`}
                  >
                    <BookOpen className={`w-6 h-6 ${meta.accent} opacity-40`} />
                  </div>
                )}
              </Link>
            </article>
          );
        })}
      </div>

      {/* Loading / End States */}
      {hasNextPage && (
        <div
          ref={sentinelRef}
          className="py-12 text-center border-t border-gray-100"
        >
          {isFetchingNextPage ? (
            <div className="flex items-center justify-center gap-3 text-gray-400">
              <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
              <span className="text-sm">Loading more stories...</span>
            </div>
          ) : (
            <p className="text-sm text-gray-400">
              Scroll to discover more stories
            </p>
          )}
        </div>
      )}

      {!hasNextPage && testimonies.length > 0 && (
        <div className="text-center py-10 border-t border-gray-100">
          <p className="text-gray-400 text-sm">You&apos;ve reached the end</p>
        </div>
      )}
    </div>
  );
}
