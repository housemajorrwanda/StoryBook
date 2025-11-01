"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { LuSearch, LuArrowRight } from "react-icons/lu";

const HeroSection: React.FC = () => {
  const [searchFocused, setSearchFocused] = useState(false);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const stats = [
    { value: "6,843", label: "Testimonies" },
    { value: "3,299", label: "Families Reunited" },
    { value: "12,847", label: "Documents" },
  ];

  const missionCards = [
    {
      title: "Remember",
      description:
        "Preserving precious memories and testimonies of those affected by the genocide against the Tutsi, ensuring their voices echo through generations.",
      image: "/images/Visit-Rwanda-Flame-of-Remembrance-1920x1280.jpg",
      icon: (
        <svg className="w-full h-full" fill="currentColor" viewBox="0 0 24 24">
          <path d="M13.83,2.17C13.5,1.84 13,1.84 12.67,2.17L12.67,2.17L9.83,5.02C9.41,5.44 9,6.18 9,7V14C9,17.31 11.69,20 15,20C18.31,20 21,17.31 21,14V7C21,6.18 20.59,5.44 20.17,5.02L17.33,2.17C17,1.84 16.5,1.84 16.17,2.17L16.17,2.17L15.66,2.68C15.44,2.9 15.44,3.26 15.66,3.48C15.88,3.7 16.24,3.7 16.46,3.48L16.46,3.48L16.83,3.11L19.32,5.61C19.61,5.9 19.84,6.4 19.84,6.85V13.84C19.84,16.55 17.71,18.68 15,18.68C12.29,18.68 10.16,16.55 10.16,13.84V6.85C10.16,6.4 10.39,5.9 10.68,5.61L13.17,3.11L13.54,3.48C13.76,3.7 14.12,3.7 14.34,3.48C14.56,3.26 14.56,2.9 14.34,2.68L13.83,2.17Z" />
        </svg>
      ),
      featured: false,
    },
    {
      title: "Connect",
      description:
        "Leveraging cutting-edge AI technology to identify meaningful connections between testimonies, reuniting families separated by tragedy and revealing shared experiences that bridge time and distance.",
      image: "/images/Rwanda%20Komera%20%23kwibuka31.jpeg",
      icon: (
        <svg className="w-full h-full" fill="currentColor" viewBox="0 0 24 24">
          <path d="M3.9,12C3.9,10.29 5.29,8.9 7,8.9H11V7H7A5,5 0 0,0 2,12A5,5 0 0,0 7,17H11V15.1H7C5.29,15.1 3.9,13.71 3.9,12M8,13H16V11H8V13M17,7H13V8.9H17C18.71,8.9 20.1,10.29 20.1,12C20.1,13.71 18.71,15.1 17,15.1H13V17H17A5,5 0 0,0 22,12A5,5 0 0,0 17,7Z" />
        </svg>
      ),
      featured: true,
    },
    {
      title: "Preserve",
      description:
        "Utilizing advanced digital archival systems and AI technology to ensure these crucial historical testimonies are securely preserved for future generations.",
      image: "/images/Urumuri Rutazima(never off light).jpeg",
      icon: (
        <svg className="w-full h-full" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12,1L3,5V11C3,16.55 6.84,21.74 12,23C17.16,21.74 21,16.55 21,11V5L12,1M12,7C13.4,7 14.8,8.6 14.8,10V11.5C14.8,12.1 14.4,12.5 13.8,12.5H10.2C9.6,12.5 9.2,12.1 9.2,11.5V10C9.2,8.6 10.6,7 12,7M12,8.2C11.2,8.2 10.5,8.7 10.5,9.5V10.8H13.5V9.5C13.5,8.7 12.8,8.2 12,8.2Z" />
        </svg>
      ),
      featured: false,
    },
  ];

  return (
    <div className="min-h-screen bg-[#fafafa] relative">
      <div className="relative min-h-screen overflow-hidden">
        <div className="absolute inset-4 sm:inset-8 md:inset-12 lg:inset-16 rounded-[2.5rem] overflow-hidden shadow-[0_0_80px_rgba(0,0,0,0.3)]">
          <div className="absolute inset-0 bg-cover bg-center bg-no-repeat">
            <Image
              src="/images/Kwibuka.jpeg"
              alt="Kwibuka Memorial - Remembering the 1994 Genocide against the Tutsi"
              fill
              priority
              className="object-cover object-center duration-700 scale-105 hover:scale-110 transition-transform"
              quality={95}
              sizes="100vw"
              placeholder="blur"
              blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R"
            />
          </div>

          <div className="absolute inset-0 opacity-15 mix-blend-overlay">
            <Image
              src="/images/_106339679_1465a159-179e-4eb0-bdf3-cd1da49a012e.jpg"
              alt=""
              fill
              className="object-cover object-center"
              quality={70}
              sizes="100vw"
            />
          </div>

          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.25)_0%,rgba(0,0,0,0.2)_40%,rgba(0,0,0,0.35)_100%)] z-10" />

          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.2)_100%)] z-10" />
        </div>

        <div className="relative z-30 container mx-auto px-6 sm:px-8 md:px-12 lg:px-20 pt-24 md:pt-32 lg:pt-40 pb-20 md:pb-28 lg:pb-40">
          <div className="max-w-5xl mb-10 md:mb-16">
            <h1
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black text-white leading-[1.1] mb-6 md:mb-8 text-center md:text-left tracking-tight"
              style={{
                textShadow:
                  "0 4px 24px rgba(0,0,0,0.5), 0 2px 8px rgba(0,0,0,0.3)",
              }}
            >
              Preserving Memory.
              <br />
              <span className="text-white/70 inline-flex items-center gap-4">
                Connecting Families.
                <span className="inline-block w-3 h-3 bg-white rounded-full animate-pulse" />
              </span>
            </h1>

            <p
              className="text-xl text-white/95 max-w-3xl leading-relaxed text-center md:text-left mx-auto md:mx-0 font-medium"
              style={{
                textShadow: "0 2px 12px rgba(0,0,0,0.5)",
              }}
            >
              A digital archive dedicated to preserving testimonies from the
              1994 genocide against the Tutsi in Rwanda
            </p>
          </div>

          {/* Animated Stats Cards */}
          <div className="flex flex-wrap justify-center md:justify-start gap-4 md:gap-6 mb-14 md:mb-20">
            {stats.map((stat, idx) => (
              <div
                key={idx}
                className="group relative bg-white/10 backdrop-blur-xl border border-white/20 rounded-[1.25rem] px-6 md:px-8 py-4 md:py-5 hover:bg-white/15 hover:border-white/30 transition-all duration-500 hover:scale-105 hover:-translate-y-1 cursor-default"
                style={{
                  animationDelay: `${idx * 100}ms`,
                  boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
                }}
              >
                <div className="flex items-center gap-3">
                  <div>
                    <p className="text-2xl md:text-3xl font-black text-white tracking-tight">
                      {stat.value}
                    </p>
                    <p className="text-xs md:text-sm text-white/80 font-semibold tracking-wide">
                      {stat.label}
                    </p>
                  </div>
                </div>

                {/* Hover Glow Effect */}
                <div className="absolute inset-0 rounded-[1.25rem] bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>
            ))}
          </div>

          <div className="max-w-4xl mb-14 md:mb-24">
            <div
              className={`bg-white backdrop-blur-xl rounded-3xl shadow-[0_12px_48px_rgba(0,0,0,0.3)] overflow-hidden border-2 transition-all duration-500 ${
                searchFocused
                  ? "border-black/30 shadow-[0_20px_64px_rgba(0,0,0,0.4)] scale-[1.02]"
                  : "border-white/20 hover:border-white/30 hover:shadow-[0_16px_56px_rgba(0,0,0,0.35)]"
              }`}
            >
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center">
                <div className="flex items-center pl-6 sm:pl-8 pr-4 py-5 sm:py-0">
                  <LuSearch
                    className={`w-6 h-6 transition-all duration-300 ${
                      searchFocused ? "text-black scale-110" : "text-gray-500"
                    }`}
                  />
                </div>

                <input
                  type="text"
                  placeholder="Search by name, location, date, or keywords..."
                  className="flex-1 py-5 sm:py-7 px-4 text-base sm:text-lg text-gray-800 placeholder-gray-500 focus:outline-none bg-transparent focus:ring-0 border-b sm:border-b-0 border-gray-200/50 sm:border-none font-medium"
                  onFocus={() => setSearchFocused(true)}
                  onBlur={() => setSearchFocused(false)}
                />

                <button className="group relative bg-black hover:bg-gray-800 text-white px-8 sm:px-10 md:px-16 py-5 sm:py-7 md:py-8 font-bold transition-all duration-300 hover:shadow-[0_8px_32px_rgba(0,0,0,0.4)] cursor-pointer active:scale-95 text-base sm:text-lg overflow-hidden">
                  <span className="relative z-10 flex items-center gap-2">
                    <LuSearch className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                    Search
                  </span>

                  {/* Button Shine Effect */}
                  <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.2),transparent)]" />
                </button>
              </div>
            </div>
          </div>

          {/* Mission Cards */}
          <div className="mb-10 md:mb-24">
            <div className="text-center mb-12 md:mb-16">
              <h2
                className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-white mb-4 md:mb-6 tracking-tight"
                style={{
                  textShadow: "0 4px 24px rgba(0,0,0,0.5)",
                }}
              >
                Our Mission
              </h2>

              <p
                className="text-sm sm:text-base text-white/90 max-w-3xl mx-auto leading-relaxed px-4 font-medium"
                style={{
                  textShadow: "0 2px 12px rgba(0,0,0,0.5)",
                }}
              >
                Three core pillars guide our commitment to preserving history
                and connecting lives
              </p>
            </div>

            <div className="max-w-7xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 items-stretch">
                {missionCards.map((card, idx) => (
                  <div
                    key={idx}
                    className={`group relative cursor-pointer ${
                      card.featured ? "md:scale-110 md:z-10" : ""
                    }`}
                    onMouseEnter={() => setHoveredCard(idx)}
                    onMouseLeave={() => setHoveredCard(null)}
                    style={{
                      animationDelay: `${idx * 150}ms`,
                    }}
                  >
                    <div
                      className={`relative bg-white border rounded-3xl p-6 md:p-8 ${
                        card.featured ? "lg:p-12" : ""
                      } shadow-lg hover:shadow-2xl transition-all duration-500 ${
                        card.featured
                          ? "min-h-[400px] md:min-h-[480px] border-gray-200 shadow-2xl"
                          : "min-h-[320px] md:min-h-[360px] border-gray-100"
                      } hover:transform hover:-translate-y-2 overflow-hidden ${
                        hoveredCard === idx ? "scale-[1.02] shadow-xl" : ""
                      }`}
                    >
                      {/* Subtle Background Pattern */}
                      <div
                        className={`absolute inset-0 transition-opacity duration-500 ${
                          hoveredCard === idx
                            ? "opacity-[0.03]"
                            : "opacity-[0.02]"
                        }`}
                      >
                        <div className="absolute inset-0 bg-black" />
                        <Image
                          src={card.image}
                          alt="about image"
                          fill
                          className="object-cover mix-blend-overlay"
                          quality={70}
                          sizes="(max-width: 768px) 100vw, 33vw"
                        />
                      </div>

                      {/* Enhanced Icon Container */}
                      <div
                        className={`absolute ${
                          card.featured
                            ? "-top-6 md:-top-8"
                            : "-top-4 md:-top-5"
                        } left-1/2 transform -translate-x-1/2 z-20`}
                      >
                        <div
                          className={`${
                            card.featured
                              ? "w-16 h-16 md:w-24 md:h-24"
                              : "w-14 h-14 md:w-18 md:h-18"
                          } bg-white border border-gray-800 rounded-xl flex items-center justify-center transition-all duration-500 ${
                            hoveredCard === idx
                              ? "scale-110 rotate-3 shadow-xl"
                              : "scale-100 rotate-0"
                          }`}
                        >
                          <div
                            className={`flex items-center justify-center ${
                              card.featured
                                ? "w-10 h-10 md:w-14 md:h-14"
                                : "w-7 h-7 md:w-9 md:h-9"
                            } text-gray-800`}
                          >
                            <div className="w-full h-full text-gray-800">
                              {card.icon}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Content */}
                      <div
                        className={`relative z-10 cursor-pointer ${
                          card.featured ? "pt-14 md:pt-20" : "pt-12 md:pt-14"
                        }`}
                      >
                        <h3
                          className={`cursor-pointer ${
                            card.featured
                              ? "text-2xl md:text-3xl lg:text-4xl mb-5 md:mb-7"
                              : "text-xl md:text-2xl mb-3 md:mb-4"
                          } font-bold text-gray-900 text-center tracking-tight`}
                        >
                          {card.title}
                        </h3>

                        <p
                          className={`cursor-pointer text-gray-600 leading-relaxed text-center ${
                            card.featured
                              ? "text-base md:text-lg lg:text-xl font-normal"
                              : "text-sm md:text-base"
                          }`}
                        >
                          {card.description}
                        </p>

                        {/* Featured Card Accent */}
                        {card.featured && (
                          <div className="mt-6 md:mt-8 text-center">
                            <div className="inline-flex items-center space-x-2">
                              <div className="w-3 h-3 bg-gray-800 rounded-full" />
                              <div className="w-8 h-1 bg-gray-800 rounded-full" />
                              <div className="w-3 h-3 bg-gray-800 rounded-full" />
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Corner Accents */}
                      <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-gray-200 rounded-tl-lg" />
                      <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-gray-200 rounded-tr-lg" />
                      <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-gray-200 rounded-bl-lg" />
                      <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-gray-200 rounded-br-lg" />

                      {/* Solid Border Animation */}
                      <div
                        className={`absolute inset-0 rounded-3xl border-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none ${
                          card.featured ? "border-gray-800" : "border-gray-300"
                        }`}
                      />
                    </div>

                    {/* Outer Glow for Featured Card */}
                    {card.featured && (
                      <div className="absolute inset-0 rounded-3xl bg-gray-800/10 blur-md -z-10 scale-105 opacity-60 cursor-pointer" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Memory Archive Gallery */}
          <div className="max-w-7xl mx-auto mt-16 md:mt-24">
            <div className="text-center mb-10 md:mb-16">
              <h3
                className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-4 md:mb-6 tracking-tight"
                style={{
                  textShadow: "0 4px 24px rgba(0,0,0,0.5)",
                }}
              >
                Memory Archive
              </h3>

              <p
                className="text-white/90 text-base md:text-lg max-w-2xl mx-auto px-4 font-medium"
                style={{
                  textShadow: "0 2px 12px rgba(0,0,0,0.5)",
                }}
              >
                Explore our collection of historical documents, photographs, and
                testimonies
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 md:gap-6">
              {[1, 2, 3, 4].map((item) => (
                <div
                  key={item}
                  className="group relative aspect-square rounded-3xl overflow-hidden cursor-pointer"
                >
                  <Image
                    src="/images/11994824-6897971-image-a-5_1554708520133.jpg"
                    alt={`Archive image ${item}`}
                    fill
                    className="object-cover group-hover:scale-125 transition-transform duration-700"
                    quality={85}
                    sizes="(max-width: 640px) 50vw, (max-width: 768px) 25vw, 25vw"
                  />

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_0%,rgba(0,0,0,0.7)_100%)] opacity-0 group-hover:opacity-100 transition-all duration-500" />

                  {/* Play Button Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500">
                    <div className="w-14 h-14 md:w-16 md:h-16 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-[0_8px_32px_rgba(0,0,0,0.3)] group-hover:scale-110 transition-transform duration-300">
                      <LuArrowRight className="w-6 h-6 md:w-7 md:h-7 text-black" />
                    </div>
                  </div>

                  {/* Border Effect */}
                  <div className="absolute inset-0 rounded-3xl border-2 border-white/0 group-hover:border-white/30 transition-all duration-500" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Keyframe Animations */}
      <style jsx>{`
        @keyframes shimmer {
          0% {
            background-position: 200% 0;
          }
          100% {
            background-position: -200% 0;
          }
        }
      `}</style>
    </div>
  );
};

export default HeroSection;
