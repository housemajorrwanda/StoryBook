"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import type { InfiniteData } from "@tanstack/react-query";
import {
  User,
  MapPin,
  Mic,
  Video,
  FileText,
  Calendar,
  Search,
  Headphones,
  Play,
  BarChart3,
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
    chip: "bg-emerald-50 text-emerald-700 border-emerald-200",
    iconBg: "bg-emerald-600",
    icon: <FileText className="w-4 h-4 text-white" />,
  },
  audio: {
    label: "Audio",
    chip: "bg-indigo-50 text-indigo-700 border-indigo-200",
    iconBg: "bg-indigo-600",
    icon: <Headphones className="w-4 h-4 text-white" />,
  },
  video: {
    label: "Video",
    chip: "bg-rose-50 text-rose-700 border-rose-200",
    iconBg: "bg-rose-600",
    icon: <Play className="w-4 h-4 text-white" />,
  },
};

const formatReads = (value?: number) => {
  if (!value || value <= 0) return "0 reads";
  if (value < 1000) return `${value} reads`;
  const abbreviated = (value / 1000).toFixed(value % 1000 === 0 ? 0 : 1);
  return `${abbreviated}k reads`;
};

const stripHtml = (value?: string, max = 200) => {
  if (!value) return "";
  const plain = value.replace(/<[^>]+>/g, "");
  if (plain.length <= max) return plain;
  return `${plain.substring(0, max)}…`;
};

export default function TestimoniesGrid({
  limit
}: TestimoniesGridProps) {
  const pageSize = limit ?? 5;
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
 

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm.trim());
    }, 400);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const {
    data,
    status,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useTestimonies({
    search: debouncedSearch || undefined,
    status: "approved",
    isPublished: true,
    limit: pageSize,
  });

  const pages = useMemo<TestimonyPage[]>(
    () =>
      ((data as InfiniteData<TestimonyPage> | undefined)?.pages ?? []) as TestimonyPage[],
    [data]
  );
  const testimonies = useMemo(
    () => pages.flatMap((page) => page.data),
    [pages]
  );
  const isLoading = status === "pending";
  const isError = status === "error";

  const sentinelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!hasNextPage) {
      return;
    }

    const node = sentinelRef.current;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { rootMargin: "200px" }
    );

    if (node) {
      observer.observe(node);
    }

    return () => {
      if (node) {
        observer.unobserve(node);
      }
      observer.disconnect();
    };
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  if (isLoading) {
    return <SkeletonTestimonies />;
  }

  if (isError) {
    return (
      <EmptyState
        title="Unable to load testimonies"
        subtitle="Please refresh the page or try again later."
        icon={<FileText className="w-16 h-16 text-gray-300" />}
        size="lg"
      />
    );
  }

  if (testimonies.length === 0) {
    return (
      <EmptyState
        title="No published testimonies yet"
        subtitle="Check back later or share a story to inspire the community."
        icon={<FileText className="w-16 h-16 text-gray-300" />}
        size="lg"
      />
    );
  }

  return (
    <div className="w-full">
      {/* Enhanced Search */}
      <div className="max-w-9xl mx-auto px-4 mb-10 rounded-2xl">
        <div className="relative bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search stories by title, author, or theme…"
            className="w-full pl-14 pr-6 py-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 border-0 text-gray-700 placeholder:text-gray-400 text-sm bg-transparent"
          />
        </div>
      </div>

      {/* Testimonies Grid */}
      <div className="space-y-6 mx-auto px-4">
        {testimonies.map((testimony: Testimony) => {
          const type = testimony.submissionType || "written";
          const meta = TYPE_META[type as keyof typeof TYPE_META] || TYPE_META.written;
          const slug = generateTestimonySlug(testimony.id, testimony.eventTitle);
          const excerpt = stripHtml(testimony.fullTestimony, 220);
          const createdAt = testimony.createdAt
            ? new Date(testimony.createdAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })
            : "";
          const authorName =
            testimony.identityPreference === "anonymous"
              ? "Anonymous"
              : testimony.user?.name || testimony.fullName || "Unknown";
          const impressions = formatReads(testimony.impressions);
          const tags = [
            testimony.relationToEvent &&
              testimony.relationToEvent.replace(/_/g, " "),
            testimony.location,
            meta.label,
          ]
            .filter(Boolean)
            .slice(0, 3) as string[];
          const coverImage = testimony.images?.[0]?.imageUrl;

          return (
            <div key={testimony.id} className="group relative">
              <Link href={`/testimonies/${slug}`} className="block">
                <article className="rounded-xl bg-white border border-gray-100 shadow-sm hover:shadow-xl hover:border-gray-200 transition-all duration-300 overflow-hidden hover:scale-[1.002]">
                  <div className="grid md:grid-cols-[1.65fr,1fr] gap-0">
                    {/* Content Section */}
                    <div className="p-8 md:p-10 flex flex-col gap-5">
                      {/* Meta Info Row */}
                      <div className="flex flex-wrap items-center gap-3">
                        <span
                          className={`inline-flex items-center gap-2 text-xs font-bold px-4 py-1.5 rounded-xl border ${meta.chip} shadow-sm`}
                        >
                          <span
                            className={`inline-flex items-center justify-center w-6 h-6 rounded-xl ${meta.iconBg} shadow-md text-white`}
                          >
                            {meta.icon}
                          </span>
                          {meta.label}
                        </span>
                        <span className="text-xs font-medium uppercase tracking-wider text-gray-500">
                          {createdAt}
                        </span>
                        <span className="text-xs font-medium text-gray-500 flex items-center gap-1.5 ml-auto">
                          <BarChart3 className="w-4 h-4" />
                          {impressions}
                        </span>
                      </div>

                      {/* Title */}
                      <h2 className="text-2xl md:text-4xl font-bold text-gray-900 leading-tight group-hover:text-gray-700 transition-colors duration-200 line-clamp-2">
                        {testimony.eventTitle}
                      </h2>

                      {/* Excerpt */}
                      <p className="text-gray-600 text-base leading-relaxed line-clamp-3">
                        {excerpt ||
                          "An audio testimony capturing moments of courage and defiance, remembered in detail."}
                      </p>

                      {/* Author & Location Info */}
                      <div className="flex flex-wrap items-center gap-5 text-sm text-gray-600 pt-3 border-t border-gray-50 rounded-b-xl">
                        <span className="inline-flex items-center gap-2 font-medium text-gray-800">
                          <User className="w-4 h-4 text-gray-400" />
                          {authorName}
                        </span>
                        {testimony.location && (
                          <span className="inline-flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-gray-400" />
                            {testimony.location}
                          </span>
                        )}
                        {testimony.dateOfEventFrom && (
                          <span className="inline-flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-gray-400" />
                            {new Date(testimony.dateOfEventFrom).toLocaleDateString("en-US", {
                              month: "short",
                              year: "numeric",
                            })}
                          </span>
                        )}
                      </div>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-2 mt-auto pt-2">
                        {tags.map((tag: string) => (
                          <span
                            key={tag}
                            className="text-xs font-medium px-3.5 py-1.5 rounded-full bg-gray-50 text-gray-600 border border-gray-200 hover:bg-gray-100 transition-colors"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Image/Media Section */}
                    <div className="relative bg-gray-50 min-h-[280px] md:min-h-full border-l border-gray-100 rounded-r-xl">
                      {coverImage ? (
                        <div className="relative h-full w-full overflow-hidden">
                          <Image
                            src={coverImage}
                            alt={testimony.eventTitle}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                            sizes="(min-width: 768px) 40vw, 100vw"
                          />
                          <div className="absolute inset-0 bg-linear-to-t from-black/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </div>
                      ) : type === "audio" ? (
                        <div className="h-full w-full bg-indigo-50 flex flex-col items-center justify-center text-indigo-600 gap-5 group-hover:bg-indigo-100 transition-all duration-300 border-l border-indigo-100">
                          <div className="p-6 bg-white rounded-full shadow-lg border border-indigo-100">
                            <Mic className="w-12 h-12 text-indigo-500" />
                          </div>
                          <p className="text-sm font-bold uppercase tracking-[0.3em] text-indigo-700">
                            Audio Story
                          </p>
                        </div>
                      ) : type === "video" ? (
                        <div className="h-full w-full bg-rose-50 flex flex-col items-center justify-center text-rose-600 gap-5 group-hover:bg-rose-100 transition-all duration-300 border-l border-rose-100">
                          <div className="p-6 bg-white rounded-full shadow-lg border border-rose-100">
                            <Video className="w-12 h-12 text-rose-500" />
                          </div>
                          <p className="text-sm font-bold uppercase tracking-[0.3em] text-rose-700">
                            Video Story
                          </p>
                        </div>
                      ) : (
                        <div className="h-full w-full bg-emerald-50 flex flex-col items-center justify-center text-emerald-600 gap-5 group-hover:bg-emerald-100 transition-all duration-300 border-l border-emerald-100">
                          <div className="p-6 bg-white rounded-full shadow-lg border border-emerald-100">
                            <FileText className="w-12 h-12 text-emerald-500" />
                          </div>
                          <p className="text-sm font-bold uppercase tracking-[0.3em] text-emerald-700">
                            Written Story
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </article>
              </Link>
            </div>
          );
        })}

        {/* Loading and End States */}
        {hasNextPage && (
          <div ref={sentinelRef} className="py-12 text-center">
            {isFetchingNextPage ? (
              <div className="flex items-center justify-center gap-3 text-gray-500">
                <div className="animate-spin rounded-full h-6 w-6 border-b border-gray-400"></div>
                <span className="text-sm">Loading more inspiring stories…</span>
              </div>
            ) : (
              <div className="text-center">
                <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-blue-50 flex items-center justify-center">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                </div>
                <p className="text-sm text-gray-500">Scroll to discover more stories</p>
              </div>
            )}
          </div>
        )}

        {!hasNextPage && testimonies.length > 0 && (
          <div className="text-center py-6 rounded-b-xl">
            <p className="text-gray-500 text-sm">
              You&apos;ve reached the end of published testimonies
            </p>
          </div>
        )}
      </div>
    </div>
  );
}