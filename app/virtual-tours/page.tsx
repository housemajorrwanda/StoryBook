"use client";

import PageLayout from "@/layout/PageLayout";
import { ChevronRight, MapPin, Eye, Music, Sparkles } from "lucide-react";
import Link from "next/link";

const tours = [
  {
    id: 1,
    title: "Modern Downtown Loft",
    location: "New York, NY",
    type: "360_image",
    image: "/modern-loft-interior.jpg",
    impressions: 2341,
    hotspots: 5,
    audio: true,
  },
  {
    id: 2,
    title: "Beachfront Villa",
    location: "Malibu, CA",
    type: "360_image",
    image: "/luxury-beach-house.jpg",
    impressions: 5203,
    hotspots: 8,
    audio: true,
  },
  {
    id: 3,
    title: "Historic Museum Gallery",
    location: "Boston, MA",
    type: "3d_model",
    image: "/museum-gallery-interior.jpg",
    impressions: 1842,
    hotspots: 12,
    audio: true,
  },
  {
    id: 4,
    title: "Urban Office Space",
    location: "San Francisco, CA",
    type: "embed",
    image: "/modern-office-space.jpg",
    impressions: 3921,
    hotspots: 6,
    audio: false,
  },
];

export default function VirtualToursPage() {
  return (
    <PageLayout showBackgroundEffects={true} variant="default">
      {/* Hero Section */}
      <section className="container mx-auto px-6 py-20">
        <div className="space-y-6 mb-16">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 text-balance leading-tight">
            Immersive <span className="text-gray-900">360° Experiences</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl text-balance">
            Create stunning virtual tours with interactive hotspots, spatial
            audio, and visual effects. Engage your audience like never before.
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
        <div className="grid grid-cols-3 gap-8">
          {[
            { label: "Total Tours", value: "1,240" },
            { label: "Total Views", value: "2.5M+" },
            { label: "Active Users", value: "18K" },
          ].map((stat, i) => (
            <div
              key={i}
              className="border border-gray-200 rounded-xl p-6 bg-white/50 backdrop-blur-sm"
            >
              <div className="text-3xl font-bold text-gray-900 mb-2">
                {stat.value}
              </div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Tours */}
      <section className="container mx-auto px-6 py-20 border-t border-gray-200">
        <h2 className="text-3xl font-bold mb-12 text-gray-900">
          Featured Tours
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {tours.map((tour) => (
            <Link key={tour.id} href={`/tour/${tour.id}`}>
              <div className="group rounded-xl border border-gray-200 overflow-hidden hover:border-gray-400 transition-all duration-300 hover:shadow-lg hover:shadow-gray-400/20 cursor-pointer h-full bg-white/50">
                <div className="relative aspect-video overflow-hidden bg-gray-100">
                  <img
                    src={tour.image || "/placeholder.svg"}
                    alt={tour.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-gray-700 transition-colors">
                    {tour.title}
                  </h3>
                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
                    <MapPin className="w-4 h-4" />
                    {tour.location}
                  </div>
                  <div className="flex gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Eye className="w-4 h-4" />
                      {tour.impressions.toLocaleString()}
                    </div>
                    <div className="flex items-center gap-1">
                      <Sparkles className="w-4 h-4" />
                      {tour.hotspots} hotspots
                    </div>
                    {tour.audio && (
                      <div className="flex items-center gap-1">
                        <Music className="w-4 h-4" />
                        Audio
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
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
              desc: "Support for panoramic images, 360° videos, and embedded tours",
            },
            {
              icon: <Sparkles className="w-6 h-6" />,
              title: "Interactive Hotspots",
              desc: "Add clickable information points, links, and media throughout tours",
            },
            {
              icon: <Music className="w-6 h-6" />,
              title: "Spatial Audio",
              desc: "3D positional audio regions that play based on viewer position",
            },
          ].map((feature, i) => (
            <div
              key={i}
              className="p-6 rounded-xl border border-gray-200 bg-white/50 hover:border-gray-400 transition-colors"
            >
              <div className="w-12 h-12 rounded-lg bg-gray-900 flex items-center justify-center text-white mb-4">
                {feature.icon}
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-sm text-gray-600">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </PageLayout>
  );
}
