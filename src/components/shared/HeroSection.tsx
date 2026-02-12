"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Search, ArrowDown, Flame, Link2, Shield } from "lucide-react";

const HeroSection: React.FC = () => {
  const [searchFocused, setSearchFocused] = useState(false);

  const stats = [
    { value: "6,843", label: "Testimonies" },
    { value: "3,299", label: "Families Reunited" },
    { value: "12,847", label: "Documents Archived" },
  ];

  const pillars = [
    {
      title: "Remember",
      description:
        "Preserving precious memories and testimonies of those affected, ensuring their voices echo through generations.",
      icon: <Flame className="w-5 h-5" />,
    },
    {
      title: "Connect",
      description:
        "Using AI to identify connections between testimonies, reuniting families separated by tragedy.",
      icon: <Link2 className="w-5 h-5" />,
    },
    {
      title: "Preserve",
      description:
        "Advanced digital archival systems ensuring these crucial testimonies are securely kept for the future.",
      icon: <Shield className="w-5 h-5" />,
    },
  ];

  return (
    <section className="relative -mt-16 md:-mt-20">
      {/* Hero Image */}
      <div className="relative h-svh min-h-[640px] max-h-[900px]">
        <Image
          src="/images/Kwibuka.jpeg"
          alt="Kwibuka Memorial - Remembering the 1994 Genocide against the Tutsi"
          fill
          priority
          className="object-cover"
          quality={90}
          sizes="100vw"
          placeholder="blur"
          blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R"
        />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-linear-to-b from-black/40 via-black/30 to-black/70" />

        {/* Content */}
        <div className="relative z-10 h-full flex flex-col justify-end pb-16 md:pb-24">
          <div className="container mx-auto px-6 sm:px-8 lg:px-16">
            {/* Headline */}
            <div className="max-w-3xl mb-8">
              <p className="text-white/70 text-sm font-semibold tracking-[0.2em] uppercase mb-4">
                Digital Archive &middot; Rwanda
              </p>
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white leading-[1.05] tracking-tight mb-5">
                Preserving Memory.
                <br />
                <span className="text-white/60">Connecting Families.</span>
              </h1>
              <p className="text-lg md:text-xl text-white/80 leading-relaxed max-w-2xl">
                A digital archive dedicated to preserving testimonies from the
                1994 genocide against the Tutsi in Rwanda.
              </p>
            </div>

            {/* Search Bar */}
            <div className="max-w-2xl mb-10">
              <div
                className={`flex items-center bg-white/10 backdrop-blur-md border rounded-2xl transition-all duration-300 ${
                  searchFocused
                    ? "border-white/40 bg-white/15 shadow-lg shadow-black/20"
                    : "border-white/20 hover:border-white/30"
                }`}
              >
                <Search className="w-5 h-5 text-white/50 ml-5 shrink-0" />
                <input
                  type="text"
                  placeholder="Search by name, location, or keywords..."
                  className="flex-1 py-4 px-4 bg-transparent text-white placeholder:text-white/40 text-base focus:outline-none"
                  onFocus={() => setSearchFocused(true)}
                  onBlur={() => setSearchFocused(false)}
                />
                <button className="m-1.5 px-6 py-2.5 bg-white text-black text-sm font-semibold rounded-xl hover:bg-white/90 transition-colors cursor-pointer active:scale-95">
                  Search
                </button>
              </div>
            </div>

            {/* Stats Row */}
            <div className="flex flex-wrap gap-8 md:gap-12">
              {stats.map((stat, idx) => (
                <div key={idx}>
                  <p className="text-2xl md:text-3xl font-black text-white tracking-tight">
                    {stat.value}
                  </p>
                  <p className="text-sm text-white/50 font-medium mt-0.5">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Scroll indicator */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2">
            <a
              href="#pillars"
              title="Scroll to mission pillars"
              className="flex flex-col items-center gap-1 text-white/30 hover:text-white/60 transition-colors"
            >
              <ArrowDown className="w-5 h-5 animate-bounce" />
            </a>
          </div>
        </div>
      </div>

      {/* Mission Pillars */}
      <div id="pillars" className="bg-gray-950 text-white">
        <div className="container mx-auto px-6 sm:px-8 lg:px-16 py-20 md:py-28">
          <div className="text-center max-w-2xl mx-auto mb-14 md:mb-20">
            <p className="text-xs font-semibold tracking-[0.25em] uppercase text-white/40 mb-4">
              Our Mission
            </p>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
              Three pillars guiding our work
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-white/10 rounded-2xl overflow-hidden">
            {pillars.map((pillar, idx) => (
              <div
                key={idx}
                className="group bg-gray-950 p-8 md:p-10 lg:p-12 hover:bg-gray-900 transition-colors duration-300"
              >
                {/* Number + Icon row */}
                <div className="flex items-center justify-between mb-8">
                  <span className="text-5xl md:text-6xl font-black text-white/6 leading-none select-none">
                    0{idx + 1}
                  </span>
                  <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center group-hover:bg-white/15 transition-colors duration-300">
                    {pillar.icon}
                  </div>
                </div>

                <h3 className="text-xl md:text-2xl font-bold mb-3">
                  {pillar.title}
                </h3>

                <p className="text-white/50 text-sm md:text-base leading-relaxed">
                  {pillar.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
