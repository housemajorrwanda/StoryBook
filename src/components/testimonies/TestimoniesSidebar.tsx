"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Share2,
  Flame,
  TrendingUp,
  Clock,
  MapPin,
  ArrowUpRight,
  FileText,
  Headphones,
  Play,
} from "lucide-react";
import { useTrendingTestimonies, useTestimonies } from "@/hooks/useTestimonies";
import {
  generateTestimonySlug,
  formatImpressions,
} from "@/utils/testimony.utils";
import type { TrendingTestimony } from "@/types/testimonies";
import type { Testimony } from "@/types/testimonies";

const locationStories = [
  {
    name: "Kigali",
    count: 3,
    description: "Capital city testimonies",
    image: "/images/Kwibuka.jpeg",
  },
  {
    name: "Butare",
    count: 2,
    description: "Southern province stories",
    image: "/images/Rwanda%20Komera%20%23kwibuka31.jpeg",
  },
  {
    name: "Gisenyi",
    count: 1,
    description: "Lake Kivu region",
    image: null,
  },
  {
    name: "Nyamata",
    count: 1,
    description: "Memorial site stories",
    image: null,
  },
];

const TYPE_ICON = {
  written: <FileText className="w-3.5 h-3.5 text-emerald-500" />,
  audio: <Headphones className="w-3.5 h-3.5 text-indigo-500" />,
  video: <Play className="w-3.5 h-3.5 text-rose-500" />,
};

function formatTimeAgo(dateStr: string): string {
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  const diffHr = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMin < 1) return "Just now";
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHr < 24) return `${diffHr}h ago`;
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function TrendingSkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="flex gap-3 items-start animate-pulse">
          <div className="w-7 h-7 bg-gray-100 rounded" />
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-gray-100 rounded w-4/5" />
            <div className="h-3 bg-gray-100 rounded w-3/5" />
          </div>
          <div className="w-14 h-14 bg-gray-100 rounded-lg shrink-0" />
        </div>
      ))}
    </div>
  );
}

function RecentSkeleton() {
  return (
    <div className="space-y-1">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="flex items-center gap-3 py-2.5 px-3 -mx-3 animate-pulse"
        >
          <div className="w-8 h-8 bg-gray-100 rounded-lg shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-gray-100 rounded w-3/4" />
            <div className="h-3 bg-gray-100 rounded w-1/3" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function TestimoniesSidebar() {
  const {
    data: trendingData,
    isLoading: trendingLoading,
    isError: trendingError,
  } = useTrendingTestimonies();

  const {
    data: recentData,
    isLoading: recentLoading,
    isError: recentError,
  } = useTestimonies({
    status: "approved",
    isPublished: true,
    limit: 3,
  });

  const trendingStories = (trendingData ?? []).slice(0, 3);
  const recentStories =
    recentData?.pages?.flatMap((page) => page.data).slice(0, 3) ?? [];

  return (
    <div className="space-y-10">
      {/* Trending Stories */}
      <div>
        <div className="flex items-center gap-2 mb-5">
          <TrendingUp className="w-4 h-4 text-gray-900" />
          <h3 className="text-sm font-bold text-gray-900">Trending</h3>
        </div>

        {trendingLoading ? (
          <TrendingSkeleton />
        ) : trendingError || trendingStories.length === 0 ? (
          <p className="text-xs text-gray-400">
            No trending stories right now.
          </p>
        ) : (
          <div className="space-y-4">
            {trendingStories.map((story: TrendingTestimony, idx: number) => {
              const slug = generateTestimonySlug(story.id, story.eventTitle);
              const coverImage = story.images?.[0]?.imageUrl;

              return (
                <Link
                  key={story.id}
                  href={`/testimonies/${slug}`}
                  className="group flex gap-3 items-start"
                >
                  <span className="text-2xl font-black text-gray-200 leading-none w-7 shrink-0 group-hover:text-gray-400 transition-colors">
                    {idx + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-semibold text-gray-900 leading-snug line-clamp-2 group-hover:text-gray-600 transition-colors">
                      {story.eventTitle}
                    </h4>
                    <p className="text-xs text-gray-400 mt-1">
                      {story.user?.fullName ?? "Anonymous"} &middot;{" "}
                      {formatImpressions(story.impressions)} reads
                    </p>
                  </div>
                  {coverImage && (
                    <div className="relative w-14 h-14 rounded-lg overflow-hidden shrink-0">
                      <Image
                        src={coverImage}
                        alt={story.eventTitle}
                        fill
                        className="object-cover"
                        sizes="56px"
                      />
                    </div>
                  )}
                </Link>
              );
            })}
          </div>
        )}
      </div>

      {/* Stories from — visual location cards (hardcoded) */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <MapPin className="w-4 h-4 text-gray-900" />
          <h3 className="text-sm font-bold text-gray-900">Stories from</h3>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {locationStories.map((loc) => (
            <button
              type="button"
              key={loc.name}
              className="group relative rounded-xl overflow-hidden text-left cursor-pointer transition-all duration-200 hover:shadow-md"
            >
              {/* Background */}
              {loc.image ? (
                <div className="absolute inset-0">
                  <Image
                    src={loc.image}
                    alt={loc.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                    sizes="160px"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/40 to-black/20" />
                </div>
              ) : (
                <div className="absolute inset-0 bg-gray-900 group-hover:bg-gray-800 transition-colors" />
              )}

              {/* Content */}
              <div className="relative p-3 pt-8">
                <p className="text-white font-bold text-sm leading-tight">
                  {loc.name}
                </p>
                <p className="text-white/50 text-xs mt-0.5">
                  {loc.count} {loc.count === 1 ? "story" : "stories"}
                </p>
              </div>

              {/* Hover arrow */}
              <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-white/0 group-hover:bg-white/20 flex items-center justify-center transition-all duration-200">
                <ArrowUpRight className="w-3 h-3 text-white/0 group-hover:text-white transition-colors" />
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Recently Added */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Clock className="w-4 h-4 text-gray-900" />
          <h3 className="text-sm font-bold text-gray-900">Just added</h3>
        </div>

        {recentLoading ? (
          <RecentSkeleton />
        ) : recentError || recentStories.length === 0 ? (
          <p className="text-xs text-gray-400">No recent stories yet.</p>
        ) : (
          <div className="space-y-1">
            {recentStories.map((item: Testimony) => {
              const slug = generateTestimonySlug(item.id, item.eventTitle);
              const type = item.submissionType || "written";
              const icon =
                TYPE_ICON[type as keyof typeof TYPE_ICON] ?? TYPE_ICON.written;

              return (
                <Link
                  key={item.id}
                  href={`/testimonies/${slug}`}
                  className="group flex items-center gap-3 py-2.5 px-3 -mx-3 rounded-xl hover:bg-gray-100 transition-colors"
                >
                  <div className="w-8 h-8 rounded-lg bg-gray-100 group-hover:bg-white flex items-center justify-center shrink-0 transition-colors">
                    {icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 leading-snug truncate">
                      {item.eventTitle}
                    </p>
                    <p className="text-xs text-gray-400">
                      {formatTimeAgo(item.createdAt)}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>

      {/* Share CTA */}
      <div className="bg-gray-950 rounded-2xl p-6 relative overflow-hidden">
        <div className="absolute -top-2 -right-2 text-white/3">
          <Flame className="w-28 h-28" />
        </div>
        <div className="relative">
          <p className="text-sm font-bold text-white mb-1">
            Your story matters
          </p>
          <p className="text-xs text-white/40 leading-relaxed mb-5">
            Help preserve history for future generations. Every voice counts.
          </p>
          <Link href="/share-testimony">
            <button
              type="button"
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-white text-gray-900 text-sm font-semibold rounded-xl hover:bg-gray-100 transition-colors cursor-pointer active:scale-[0.98]"
            >
              <Share2 className="w-4 h-4" />
              Share Testimony
            </button>
          </Link>
        </div>
      </div>

      {/* Quote */}
      <div className="border-l-2 border-gray-900 pl-4 py-1">
        <p className="text-sm text-gray-600 leading-relaxed italic">
          &ldquo;What we remember, we keep alive. What we share, we give
          meaning.&rdquo;
        </p>
        <p className="text-xs text-gray-400 mt-2 not-italic">&mdash; Kwibuka</p>
      </div>
    </div>
  );
}
