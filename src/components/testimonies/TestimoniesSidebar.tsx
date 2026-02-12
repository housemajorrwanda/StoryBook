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
  BookOpen,
} from "lucide-react";

const trendingStories = [
  {
    id: 1,
    title: "The Night We Crossed the River",
    author: "Marie C.",
    reads: "2.4k",
    image: "/images/Kwibuka.jpeg",
  },
  {
    id: 2,
    title: "Finding My Brother After 28 Years",
    author: "Jean Pierre M.",
    reads: "1.8k",
    image: "/images/Rwanda%20Komera%20%23kwibuka31.jpeg",
  },
  {
    id: 3,
    title: "A Teacher Who Saved Seven Lives",
    author: "Anonymous",
    reads: "1.2k",
    image: null,
  },
];

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

export default function TestimoniesSidebar() {
  return (
    <div className="space-y-10">
      {/* Trending Stories */}
      <div>
        <div className="flex items-center gap-2 mb-5">
          <TrendingUp className="w-4 h-4 text-gray-900" />
          <h3 className="text-sm font-bold text-gray-900">Trending</h3>
        </div>

        <div className="space-y-4">
          {trendingStories.map((story, idx) => (
            <Link
              key={story.id}
              href="#"
              className="group flex gap-3 items-start"
            >
              <span className="text-2xl font-black text-gray-200 leading-none w-7 shrink-0 group-hover:text-gray-400 transition-colors">
                {idx + 1}
              </span>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-semibold text-gray-900 leading-snug line-clamp-2 group-hover:text-gray-600 transition-colors">
                  {story.title}
                </h4>
                <p className="text-xs text-gray-400 mt-1">
                  {story.author} &middot; {story.reads} reads
                </p>
              </div>
              {story.image && (
                <div className="relative w-14 h-14 rounded-lg overflow-hidden shrink-0">
                  <Image
                    src={story.image}
                    alt={story.title}
                    fill
                    className="object-cover"
                    sizes="56px"
                  />
                </div>
              )}
            </Link>
          ))}
        </div>
      </div>

      {/* Stories from — visual location cards */}
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

        <div className="space-y-1">
          {[
            {
              title: "Voices from Murambi",
              time: "2 hours ago",
              type: "written",
            },
            {
              title: "The Last Letter Home",
              time: "5 hours ago",
              type: "audio",
            },
            {
              title: "When the Drums Stopped",
              time: "Yesterday",
              type: "video",
            },
          ].map((item) => (
            <Link
              key={item.title}
              href="#"
              className="group flex items-center gap-3 py-2.5 px-3 -mx-3 rounded-xl hover:bg-gray-100 transition-colors"
            >
              <div className="w-8 h-8 rounded-lg bg-gray-100 group-hover:bg-white flex items-center justify-center shrink-0 transition-colors">
                <BookOpen className="w-3.5 h-3.5 text-gray-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 leading-snug truncate">
                  {item.title}
                </p>
                <p className="text-xs text-gray-400">{item.time}</p>
              </div>
            </Link>
          ))}
        </div>
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
