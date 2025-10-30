"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { LuMenu, LuShare } from "react-icons/lu";
import HeroSection from "@/components/shared/HeroSection";

export default function Home() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  // Handle scroll events
  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY > 20;
      setIsScrolled(scrolled);
      setScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Handle mobile menu state changes
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };

    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [isMobileMenuOpen]);
  return (
    <div className="min-h-screen bg-white">
      {/* Enhanced Fixed Banner */}
      <div
        className="fixed top-0 w-full left-0 z-50 px-4 py-2 md:py-3"
        style={{
          transform: `translateY(${Math.min(0, scrollY * -0.5)}px)`,
          opacity: Math.max(0.7, 1 - scrollY * 0.003),
        }}
      >
        <div className="px-4 md:px-6 py-2 md:py-3 mx-auto w-fit">
          <p className="text-xs md:text-sm text-gray-600 font-semibold tracking-wide text-center">
            Kwibuka • Remember • Preserve • Connect
          </p>
        </div>
      </div>

      <header
        className="sticky top-12 md:top-16 w-full left-0 z-40 px-3 sm:px-6 lg:px-8 mb-4 md:mb-6"
        style={{
          transform: `translateY(${Math.max(-50, scrollY * -0.1)}px)`,
        }}
      >
        <div
          className={`container mx-auto px-4 md:px-6 h-14 md:h-16 flex items-center justify-between text-sm backdrop-blur-lg rounded-lg md:rounded-xl transition-all duration-500 transform ${
            isScrolled
              ? " border border-gray-100/5 shadow-2xl scale-[0.98] text-gray-900"
              : "bg-white/20 border border-white/30 shadow-xl text-gray-800 scale-100"
          }`}
        >
          {/* Enhanced Logo Section */}
          <Link
            href="/"
            className="flex items-center gap-2 md:gap-3 hover:scale-105 transition-all duration-300 shrink-0 group"
          >
            <div className="w-9 h-9 md:w-10 md:h-10 bg-black rounded-lg md:rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300">
              <span className="text-white font-bold text-lg md:text-xl">S</span>
            </div>
            <span className="text-lg md:text-xl font-bold bg-black bg-clip-text text-black">
              StoryBook
            </span>
          </Link>

          {/* Enhanced Center Navigation - Desktop */}
          <nav className="hidden md:flex items-center justify-center flex-1">
            <div className="flex items-center gap-8 lg:gap-10 backdrop-blur-sm rounded-full px-8 py-3">
              <Link href="#stories">
                <button className="font-semibold transition-all duration-300 text-base cursor-pointer relative group hover:scale-110">
                  Browse
                  <span className="absolute -bottom-2 left-0 w-0 h-0.5 bg-black transition-all duration-300 group-hover:w-full rounded-full"></span>
                </button>
              </Link>

              <Link href="#connections">
                <button className="font-semibold transition-all duration-300 text-base cursor-pointer relative group hover:scale-110">
                  Connections
                  <span className="absolute -bottom-2 left-0 w-0 h-0.5 bg-black transition-all duration-300 group-hover:w-full rounded-full"></span>
                </button>
              </Link>

              <Link href="#archive">
                <button className="font-semibold transition-all duration-300 text-base cursor-pointer relative group hover:scale-110">
                  Archive
                  <span className="absolute -bottom-2 left-0 w-0 h-0.5 bg-black transition-all duration-300 group-hover:w-full rounded-full"></span>
                </button>
              </Link>

              <Link href="#education">
                <button className="font-semibold transition-all duration-300 text-base cursor-pointer relative group hover:scale-110">
                  Education
                  <span className="absolute -bottom-2 left-0 w-0 h-0.5 bg-black transition-all duration-300 group-hover:w-full rounded-full"></span>
                </button>
              </Link>
            </div>
          </nav>

          <div className="hidden md:flex items-center gap-3 lg:gap-4 shrink-0">
            <button
              className="inline-flex items-center gap-2 lg:gap-3 px-4 lg:px-6 py-2.5 lg:py-3 bg-black text-white font-medium lg:font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 cursor-pointer shadow-lg hover:shadow-xl text-sm lg:text-base"
              onClick={() => {
                setIsMobileMenuOpen(false);
              }}
            >
              <LuShare className="w-4 h-4 lg:w-5 lg:h-5" />
              <span className="hidden lg:inline">Share Story</span>
              <span className="lg:hidden">Share</span>
            </button>

            <Link href="/login">
              <button
                className={`inline-flex items-center gap-2 cursor-pointer px-4 lg:px-6 py-2.5 lg:py-3 font-medium lg:font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 text-sm lg:text-base ${
                  isScrolled
                    ? "bg-white hover:bg-gray-50 border border-gray-200 text-gray-800 hover:text-gray-900 hover:shadow-lg"
                    : "bg-white/30 hover:bg-white/50 border border-white/30 text-gray-800 hover:text-gray-900 hover:shadow-lg backdrop-blur-sm"
                }`}
              >
                Sign in
              </button>
            </Link>
          </div>

          {/* Enhanced Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`md:hidden p-3 rounded-xl transition-all duration-300 transform active:scale-95 min-w-[44px] min-h-[44px] flex items-center justify-center ${
              isMobileMenuOpen
                ? "bg-gray-800 shadow-lg border border-gray-600"
                : "hover:bg-white/30 border border-white/20 shadow-lg"
            }`}
            aria-label="Toggle menu"
            aria-expanded={isMobileMenuOpen}
          >
            <LuMenu
              className={`w-5 h-5 transition-colors duration-200 ${
                isMobileMenuOpen ? "text-white" : "text-gray-800"
              }`}
            />
          </button>
        </div>
      </header>

      {/* Enhanced Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div
          className="md:hidden fixed top-16 left-3 right-3 z-30 bg-white/97 backdrop-blur-xl border border-gray-200/50 rounded-3xl shadow-2xl transform animate-in slide-in-from-top-5 duration-300 max-h-[calc(100vh-5rem)] overflow-y-auto"
          style={{
            backdropFilter: "blur(25px)",
          }}
        >
          <div className="p-5 mt-8">
            {/* Enhanced Navigation Links */}
            <div className="space-y-2 pb-5 border-b border-gray-200/50">
              <Link href="#stories" onClick={() => setIsMobileMenuOpen(false)}>
                <button className="w-full text-left px-6 py-5 text-lg font-semibold text-gray-800 hover:text-gray-900 bg-gray-50/50 hover:bg-gray-100 rounded-2xl transition-all duration-200 active:scale-[0.98] active:bg-gray-200 min-h-[56px] flex items-center">
                  <span>Browse Stories</span>
                </button>
              </Link>
              <Link
                href="#connections"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <button className="w-full text-left px-6 py-5 text-lg font-semibold text-gray-800 hover:text-gray-900 bg-gray-50/50 hover:bg-gray-100 rounded-2xl transition-all duration-200 active:scale-[0.98] active:bg-gray-200 min-h-[56px] flex items-center">
                  <span>Find Connections</span>
                </button>
              </Link>
              <Link href="#archive" onClick={() => setIsMobileMenuOpen(false)}>
                <button className="w-full text-left px-6 py-5 text-lg font-semibold text-gray-800 hover:text-gray-900 bg-gray-50/50 hover:bg-gray-100 rounded-2xl transition-all duration-200 active:scale-[0.98] active:bg-gray-200 min-h-[56px] flex items-center">
                  <span>View Archive</span>
                </button>
              </Link>
              <Link
                href="#education"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <button className="w-full text-left px-6 py-5 text-lg font-semibold text-gray-800 hover:text-gray-900 bg-gray-50/50 hover:bg-gray-100 rounded-2xl transition-all duration-200 active:scale-[0.98] active:bg-gray-200 min-h-[56px] flex items-center">
                  <span>Education</span>
                </button>
              </Link>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 pt-5">
              <button
                className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-black active:bg-black text-white text-lg font-semibold rounded-2xl transition-all duration-200 active:scale-[0.98] min-h-[56px] shadow-lg"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <LuShare className="w-5 h-5" />
                <span>Share Your Story</span>
              </button>
              <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
                <button className="w-full px-6 py-4 bg-white border-2 border-gray-300 hover:border-gray-400 text-gray-800 hover:text-gray-900 text-lg font-semibold rounded-2xl transition-all duration-200 active:scale-[0.98] min-h-[56px] active:bg-gray-50">
                  Sign in
                </button>
              </Link>
            </div>

            {/* Mobile Menu Footer */}
            <div className="pt-5 mt-5 border-t border-gray-200/50">
              <p className="text-sm text-gray-500 text-center">
                Kwibuka • Remember • Preserve • Connect
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/30 backdrop-blur-sm z-20 animate-in fade-in duration-300"
          onClick={() => setIsMobileMenuOpen(false)}
          aria-label="Close menu"
        />
      )}

      {/* Main Content Section */}
      <HeroSection />
    </div>
  );
}
