"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { LuMenu, LuShare, LuX } from "react-icons/lu";
import HeroSection from "@/components/shared/HeroSection";
import TestimoniesGrid from "@/components/testimonies/TestimoniesGrid";
import UserAvatar from "@/components/shared/UserAvatar";
import { getCurrentUser, isAuthenticated } from "@/lib/decodeToken";
import { useLogout } from "@/hooks/auth/use-auth-queries";

export default function Home() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [mounted, setMounted] = useState(false);
  const [user, setUser] = useState<ReturnType<typeof getCurrentUser>>(null);
  const logoutMutation = useLogout();

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

  // Track mouse position for interactive effects
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Check authentication status
  useEffect(() => {
    const checkAuth = () => {
      if (isAuthenticated()) {
        setUser(getCurrentUser());
      } else {
        setUser(null);
      }
    };

    // Set mounted in next tick to avoid direct state update in effect
    setTimeout(() => setMounted(true), 0);
    checkAuth();

    // Listen for storage changes (when login/logout happens in other tabs)
    const handleStorageChange = () => {
      checkAuth();
    };

    window.addEventListener("storage", handleStorageChange);

    // Also check periodically for token expiration
    const interval = setInterval(checkAuth, 5000);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      clearInterval(interval);
    };
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

  const handleLogout = () => {
    logoutMutation.mutate(undefined, {
      onSuccess: () => {
        setUser(null);
      },
    });
  };

  return (
    <div className="min-h-screen bg-[#fafafa] relative overflow-hidden">
      {/* Animated Background Pattern */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-5">
        {/* Geometric Grid */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `
              linear-gradient(to right, #000 1px, transparent 1px),
              linear-gradient(to bottom, #000 1px, transparent 1px)
            `,
            backgroundSize: "80px 80px",
            transform: `translate(${mousePosition.x * 0.01}px, ${
              mousePosition.y * 0.01
            }px)`,
            transition: "transform 0.1s ease-out",
          }}
        />

        {/* Floating Orbs */}
        <div
          className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full bg-blue-100/20 blur-3xl"
          style={{
            transform: `translate(${Math.sin(scrollY * 0.001) * 50}px, ${
              Math.cos(scrollY * 0.001) * 50
            }px)`,
          }}
        />
        <div
          className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-purple-100/20 blur-3xl"
          style={{
            transform: `translate(${Math.cos(scrollY * 0.001) * -50}px, ${
              Math.sin(scrollY * 0.001) * -50
            }px)`,
          }}
        />
      </div>

      <div
        className="fixed top-0 w-full left-0 z-50 px-4 py-3 md:py-4"
        style={{
          transform: `translateY(${Math.min(0, scrollY * -0.5)}px)`,
          opacity: Math.max(0.6, 1 - scrollY * 0.003),
        }}
      >
        <div className="relative px-6 md:px-8 py-3 md:py-4 mx-auto w-fit">
          {/* Decorative lines */}
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-12 h-px bg-black/20" />
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-12 h-px bg-black/20" />

          <p className="text-xs md:text-sm text-gray-800 font-bold tracking-[0.3em] text-center uppercase">
            Remember <span className="text-gray-400 mx-2">•</span> Preserve{" "}
            <span className="text-gray-400 mx-2">•</span> Connect
          </p>
        </div>
      </div>

      <header className="fixed top-16 md:top-20 w-full left-0 z-40 px-4 sm:px-6 lg:px-8">
        <div
          className={`container mx-auto px-5 md:px-8 h-16 md:h-20 flex items-center justify-between backdrop-blur-2xl rounded-2xl transition-all duration-700 ease-out relative ${
            isScrolled
              ? "bg-white/80 shadow-[0_8px_32px_rgba(0,0,0,0.08)] scale-[0.96] border border-gray-200/50"
              : "bg-white/60 shadow-[0_4px_24px_rgba(0,0,0,0.04)] scale-100 border border-white/40"
          }`}
          style={{ overflow: "visible" }}
        >
          {/* Shimmer effect on hover */}
          <div className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-500 pointer-events-none">
            <div
              className="absolute inset-0"
              style={{
                background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(255,255,255,0.1), transparent 40%)`,
              }}
            />
          </div>

          {/* Refined Logo */}
          <Link
            href="/"
            className="flex items-center gap-3 md:gap-4 hover:scale-[1.02] transition-all duration-500 shrink-0 group relative z-10"
          >
            <div className="relative">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-black rounded-2xl flex items-center justify-center shadow-[0_4px_16px_rgba(0,0,0,0.15)] group-hover:shadow-[0_8px_24px_rgba(0,0,0,0.25)] transition-all duration-500 relative overflow-hidden">
                {/* Inner glow effect */}
                <div className="absolute inset-[2px] bg-white/5 rounded-[14px]" />
                <span className="text-white font-black text-xl md:text-2xl relative z-10 tracking-tight">
                  S
                </span>
              </div>
              {/* Corner accent */}
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-black rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl md:text-2xl font-black text-black tracking-tight">
                StoryBook
              </span>
              <span className="text-xs font-bold text-gray-500 tracking-wider uppercase mt-1 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-1 group-hover:translate-y-0">
                Kwibuka
              </span>
            </div>
          </Link>

          {/* Elevated Navigation - Desktop */}
          <nav className="hidden md:flex items-center justify-center flex-1">
            <div className="flex items-center gap-1 bg-black/5 backdrop-blur-md rounded-full px-2 py-2 border border-black/5">
              {[
                { href: "#testimonies", label: "Testimonies" },
                { href: "#connections", label: "Connections" },
                { href: "#virtual Tours", label: "Virtual Tours" },
                { href: "#education", label: "Education" },
              ].map((item) => (
                <Link key={item.href} href={item.href}>
                  <button className="relative px-6 py-2.5 font-semibold text-sm text-gray-700 hover:text-black transition-all duration-300 cursor-pointer group rounded-full hover:bg-white/80">
                    <span className="relative z-10">{item.label}</span>
                    {/* Hover pill effect */}
                    <div className="absolute inset-0 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 scale-90 group-hover:scale-100 shadow-sm" />
                  </button>
                </Link>
              ))}
            </div>
          </nav>

          <div className="hidden md:flex items-center gap-3 shrink-0 relative z-10">
            <Link href="/share-testimony">
              <button className="group relative inline-flex items-center gap-2.5 px-6 py-3 bg-black text-white font-semibold rounded-xl transition-all duration-300 cursor-pointer overflow-hidden shadow-[0_4px_16px_rgba(0,0,0,0.2)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.3)] hover:scale-[1.02]">
                {/* Shine effect */}
                <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-linear-to-r from-transparent via-white/20 to-transparent" />
                <LuShare className="w-4 h-4 relative z-10" />
                <span className="relative z-10">Share Testimony</span>
              </button>
            </Link>

            {mounted && user ? (
              <UserAvatar
                user={user}
                size="lg"
                showDropdown={true}
                onLogout={handleLogout}
              />
            ) : (
              mounted && (
                <Link href="/login">
                  <button
                    className={`inline-flex items-center gap-2 cursor-pointer px-6 py-3 font-semibold rounded-xl transition-all duration-300 hover:scale-[1.02] border ${
                      isScrolled
                        ? "bg-white hover:bg-gray-50 border-gray-200 text-gray-800 shadow-sm hover:shadow-md"
                        : "bg-white/80 hover:bg-white border-white/60 text-gray-800 backdrop-blur-sm shadow-sm hover:shadow-md"
                    }`}
                  >
                    Sign in
                  </button>
                </Link>
              )
            )}
          </div>

          {/* Refined Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`md:hidden p-3.5 rounded-2xl transition-all duration-300 min-w-[48px] min-h-[48px] flex items-center justify-center relative z-10 ${
              isMobileMenuOpen
                ? "bg-black shadow-[0_4px_16px_rgba(0,0,0,0.25)]"
                : "bg-white/80 hover:bg-white border border-gray-200 shadow-sm"
            }`}
            aria-label="Toggle menu"
            aria-expanded={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? (
              <LuX className="w-5 h-5 text-white" />
            ) : (
              <LuMenu className="w-5 h-5 text-gray-800" />
            )}
          </button>
        </div>
      </header>

      {/* Redesigned Mobile Menu */}
      {isMobileMenuOpen && (
        <div
          className="top-28 left-0 max-h-[calc(100vh-8rem)] overflow-y-auto mobile-blur-overlay md:hidden relative z-30 mx-4 mb-6 bg-white/95 backdrop-blur-2xl border border-gray-200/50 rounded-4xl shadow-[0_20px_60px_rgba(0,0,0,0.15)]"
          style={{
            animation: "slideInScale 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
          }}
        >
          <div className="p-6">
            {/* Navigation Links with Stagger Effect */}
            <div className="space-y-2 pb-6 border-b border-gray-200/50">
              {[
                { href: "#testimonies", label: "Testimonies", delay: "0ms" },
                {
                  href: "#connections",
                  label: "Find Connections",
                  delay: "50ms",
                },
                { href: "#archive", label: "View Archive", delay: "100ms" },
                { href: "#education", label: "Education", delay: "150ms" },
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <button
                    className="w-full text-left px-6 py-4 text-base font-bold text-gray-800 hover:text-black bg-gray-50/50 hover:bg-gray-100 active:bg-gray-200 rounded-2xl transition-all duration-200 min-h-[56px] flex items-center group relative overflow-hidden"
                    style={{ animationDelay: item.delay }}
                  >
                    {/* Slide in indicator */}
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-0 group-hover:h-8 bg-black transition-all duration-300 rounded-full" />
                    <span className="ml-1 group-hover:ml-3 transition-all duration-300">
                      {item.label}
                    </span>
                  </button>
                </Link>
              ))}
            </div>

            {/* Action Buttons with Premium Feel */}
            <div className="space-y-3 pt-6">
              <Link
                href="/share-testimony"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <button className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-black hover:bg-gray-800 active:bg-gray-900 text-white text-base font-bold rounded-2xl transition-all duration-200 min-h-[56px] shadow-[0_4px_16px_rgba(0,0,0,0.2)] active:shadow-[0_2px_8px_rgba(0,0,0,0.3)] active:scale-[0.98] relative overflow-hidden group">
                  <div className="absolute inset-0 -translate-x-full group-active:translate-x-full transition-transform duration-500 bg-linear-to-r from-transparent via-white/10 to-transparent" />
                  <LuShare className="w-5 h-5 relative z-10" />
                  <span className="relative z-10">Share Your Testimony</span>
                </button>
              </Link>

              {mounted && user ? (
                <div className="flex items-center gap-3 px-6 py-4 bg-gray-50 rounded-2xl">
                  <UserAvatar user={user} size="md" />
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-900">
                      {user.firstName && user.lastName
                        ? `${user.firstName} ${user.lastName}`
                        : user.username || user.email}
                    </p>
                    {user.role === "admin" && (
                      <Link
                        href="/dashboard"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="text-xs text-gray-600 hover:text-gray-900"
                      >
                        Go to Dashboard
                      </Link>
                    )}
                  </div>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMobileMenuOpen(false);
                    }}
                    className="px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    Sign out
                  </button>
                </div>
              ) : (
                mounted && (
                  <Link
                    href="/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <button className="w-full px-6 py-4 bg-white border border-gray-300 hover:border-gray-400 active:border-gray-500 text-gray-800 hover:text-black text-base font-bold rounded-2xl transition-all duration-200 min-h-[56px] active:bg-gray-50 active:scale-[0.98] shadow-sm mt-2">
                      Sign in
                    </button>
                  </Link>
                )
              )}
            </div>
          </div>
        </div>
      )}

      {/* Refined Overlay */}
      {isMobileMenuOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/20 backdrop-blur-md z-20"
          onClick={() => setIsMobileMenuOpen(false)}
          aria-label="Close menu"
          style={{
            animation: "fadeIn 0.3s ease-out",
          }}
        />
      )}

      <style jsx>{`
        @keyframes slideInScale {
          from {
            opacity: 0;
            transform: translateY(-20px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
      `}</style>

      {/* Spacer for fixed header */}
      <div className="h-32 md:h-36" />

      {/* Main Content Section */}
      <HeroSection />

      {/* Published Testimonies Section */}
      <section id="testimonies" className="relative z-10 bg-[#fafafa]">
        <div className="container mx-auto px-2 sm:px-4 lg:px-6 py-12 md:py-14 bg-[#fafafa]">
          <div className="mb-6 sm:mb-10 md:mb-12">
            <h2 className="text-xl sm:text-xl md:text-3xl font-extrabold tracking-tight text-gray-900">
              Testimonies
            </h2>
            <p className="mt-2 text-xs md:text-sm text-gray-600 max-w-2xl">
              Discover powerful stories of resilience, courage, and remembrance
              shared by our community.
            </p>
          </div>

          <TestimoniesGrid limit={6} showHeader={false} />
        </div>
      </section>
    </div>
  );
}
