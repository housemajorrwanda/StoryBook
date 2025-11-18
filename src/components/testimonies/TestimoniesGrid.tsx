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
    chip: "bg-emerald-50 text-emerald-700",
    iconBg: "bg-emerald-600",
    icon: <FileText className="w-4 h-4 text-white" />,
  },
  audio: {
    label: "Audio",
    chip: "bg-indigo-50 text-indigo-700",
    iconBg: "bg-indigo-600",
    icon: <Headphones className="w-4 h-4 text-white" />,
  },
  video: {
    label: "Video",
    chip: "bg-rose-50 text-rose-700",
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
  const total = pages[0]?.meta?.total ?? 0;
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
    return (
      <div className="max-w-full mx-auto px-4 space-y-8">
        <div className="animate-pulse space-y-4">
          <div className="h-5 w-32 bg-gray-200 rounded-full" />
          <div className="h-10 w-3/4 bg-gray-200 rounded-2xl" />
          <div className="h-4 w-1/2 bg-gray-200 rounded-full" />
          <div className="h-12 bg-gray-100 rounded-full" />
        </div>
        {Array.from({ length: 3 }).map((_, idx) => (
          <div
            key={`skeleton-${idx}`}
            className="animate-pulse rounded-3xl bg-white shadow-sm overflow-hidden"
          >
            <div className="grid grid-cols-1 md:grid-cols-[1.65fr,1fr]">
              <div className="p-4 md:p-6 flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-24 h-7 bg-gray-200 rounded-full" />
                  <div className="w-16 h-4 bg-gray-100 rounded-full" />
                  <div className="w-20 h-4 bg-gray-100 rounded-full" />
                </div>
                <div className="space-y-2 md:space-y-3">
                  <div className="h-6 bg-gray-200 rounded-full w-11/12" />
                  <div className="h-6 bg-gray-200 rounded-full w-3/4" />
                </div>
                <div className="space-y-2 md:space-y-3">
                  <div className="h-4 bg-gray-100 rounded-full" />
                  <div className="h-4 bg-gray-100 rounded-full w-10/12" />
                  <div className="h-4 bg-gray-100 rounded-full w-9/12" />
                </div>
                <div className="flex flex-wrap gap-2 md:gap-3">
                  <div className="w-24 h-6 bg-gray-100 rounded-full" />
                  <div className="w-20 h-6 bg-gray-100 rounded-full" />
                  <div className="w-28 h-6 bg-gray-100 rounded-full" />
                </div>
              </div>
              <div className="hidden md:block h-full w-full bg-gray-100" />
            </div>
          </div>
        ))}
      </div>
    );
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

      <div className="max-w-5xl mx-auto px-4 mb-10">
        <div className="relative bg-white rounded-full shadow-sm">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search stories by title, author, or theme…"
            className="w-full pl-14 pr-6 py-4 rounded-full focus:outline-none focus:ring-2 focus:ring-gray-900 text-gray-900 placeholder:text-gray-400"
          />
        </div>
        <p className="text-sm text-gray-500 mt-3">
          Showing {testimonies.length} of {total.toLocaleString()} published testimonies
        </p>
      </div>

      <div className="space-y-10 max-w-5xl mx-auto px-4">
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
            <Link
              key={testimony.id}
              href={`/testimonies/${slug}`}
              className="group block"
            >
              <article className="rounded-3xl bg-white shadow hover:shadow-xl transition-all duration-300 overflow-hidden">
                <div className="grid md:grid-cols-[1.65fr,1fr]">
                  <div className="p-8 flex flex-col gap-6">
                    <div className="flex items-center gap-3">
                      <span
                        className={`inline-flex items-center gap-2 text-xs font-semibold px-3 py-1 rounded-full ${meta.chip}`}
                      >
                        <span
                          className={`inline-flex items-center justify-center w-5 h-5 rounded-full ${meta.iconBg}`}
                        >
                          {meta.icon}
                        </span>
                        {meta.label}
                      </span>
                      <span className="text-xs uppercase tracking-widest text-gray-400">
                        {createdAt}
                      </span>
                      <span className="text-xs text-gray-400 flex items-center gap-1">
                        <BarChart3 className="w-3.5 h-3.5" />
                        {impressions}
                      </span>
                    </div>

                    <h2 className="text-2xl md:text-3xl font-semibold text-gray-900 leading-snug group-hover:text-black">
                      {testimony.eventTitle}
                    </h2>

                    <p className="text-gray-600 text-base leading-relaxed line-clamp-4">
                      {excerpt ||
                        "An audio testimony capturing moments of courage and defiance, remembered in detail."}
                    </p>

                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                      <span className="inline-flex items-center gap-2 font-semibold text-gray-800">
                        <User className="w-4 h-4" />
                        {authorName}
                      </span>
                      {testimony.location && (
                        <span className="inline-flex items-center gap-2">
                          <MapPin className="w-4 h-4" />
                          {testimony.location}
                        </span>
                      )}
                      {testimony.dateOfEventFrom && (
                        <span className="inline-flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          {new Date(testimony.dateOfEventFrom).toLocaleDateString("en-US", {
                            month: "short",
                            year: "numeric",
                          })}
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {tags.map((tag: string) => (
                        <span
                          key={tag}
                          className="text-xs font-semibold uppercase tracking-wide px-3 py-1 rounded-full bg-gray-100 text-gray-600"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="relative bg-gray-50">
                    {coverImage ? (
                      <Image
                        src={coverImage}
                        alt={testimony.eventTitle}
                        fill
                        className="object-cover"
                        sizes="(min-width: 768px) 40vw, 100vw"
                      />
                    ) : type === "audio" ? (
                      <div className="h-full w-full bg-linear-to-br from-indigo-500 via-purple-500 to-pink-500 flex flex-col items-center justify-center text-white gap-4">
                        <Mic className="w-10 h-10" />
                        <p className="text-sm font-semibold uppercase tracking-[0.3em]">
                          Audio Story
                        </p>
                      </div>
                    ) : type === "video" ? (
                      <div className="h-full w-full bg-linear-to-br from-rose-500 via-orange-500 to-amber-400 flex flex-col items-center justify-center text-white gap-4">
                        <Video className="w-10 h-10" />
                        <p className="text-sm font-semibold uppercase tracking-[0.3em]">
                          Video Story
                        </p>
                      </div>
                    ) : (
                      <div className="h-full w-full bg-linear-to-br from-gray-900 to-gray-700 flex flex-col items-center justify-center text-white gap-4">
                        <FileText className="w-10 h-10" />
                        <p className="text-sm font-semibold uppercase tracking-[0.3em]">
                          Written Story
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </article>
            </Link>
          );
        })}

        {hasNextPage && (
          <div ref={sentinelRef} className="py-10 text-center text-gray-500 text-sm">
            {isFetchingNextPage ? "Loading more stories…" : "Scroll for more stories"}
          </div>
        )}

        {!hasNextPage && (
          <p className="text-center text-gray-400 text-sm py-6">
            You’ve reached the end of published testimonies.
          </p>
        )}
      </div>
    </div>
  );
}
