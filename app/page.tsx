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

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY > 20;
      setIsScrolled(scrolled);
      setScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useEffect(() => {
    const checkAuth = () => {
      if (isAuthenticated()) {
        setUser(getCurrentUser());
      } else {
        setUser(null);
      }
    };

    setTimeout(() => setMounted(true), 0);
    checkAuth();

    const handleStorageChange = () => {
      checkAuth();
    };

    window.addEventListener("storage", handleStorageChange);

    const interval = setInterval(checkAuth, 5000);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      clearInterval(interval);
    };
  }, []);

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
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-5">
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
        className="fixed top-0 w-full left-0 z-50 px-3 sm:px-4 py-2 sm:py-3 md:py-4"
        style={{
          transform: `translateY(${Math.min(0, scrollY * -0.5)}px)`,
          opacity: Math.max(0.7, 1 - scrollY * 0.003),
        }}
      >
        <div className="relative px-4 sm:px-6 md:px-8 py-2 sm:py-3 md:py-4 mx-auto w-fit">
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-8 sm:w-12 h-px bg-black/20" />
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-8 sm:w-12 h-px bg-black/20" />

          <p className="text-[10px] sm:text-xs md:text-sm text-gray-800 font-bold tracking-[0.2em] sm:tracking-[0.3em] text-center uppercase whitespace-nowrap">
            Remember <span className="text-gray-400 mx-1 sm:mx-2">•</span>{" "}
            Preserve <span className="text-gray-400 mx-1 sm:mx-2">•</span>{" "}
            Connect
          </p>
        </div>
      </div>

      <header className="fixed top-14 sm:top-16 md:top-20 w-full left-0 z-40 px-3 sm:px-4 md:px-6 lg:px-8">
        <div
          className={`container mx-auto px-3 sm:px-4 md:px-5 lg:px-8 h-14 sm:h-16 md:h-20 flex items-center justify-between backdrop-blur-2xl rounded-xl sm:rounded-2xl transition-all duration-700 ease-out relative gap-2 sm:gap-3 ${
            isScrolled
              ? "bg-white/80 shadow-[0_8px_32px_rgba(0,0,0,0.08)] scale-[0.98] sm:scale-[0.96] border border-gray-200/50"
              : "bg-white/60 shadow-[0_4px_24px_rgba(0,0,0,0.04)] scale-100 border border-white/40"
          }`}
          style={{ overflow: "visible" }}
        >
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
            className="flex items-center gap-2 sm:gap-3 md:gap-4 hover:scale-[1.02] transition-all duration-500 shrink-0 group relative z-10 min-w-0"
          >
            <div className="relative shrink-0">
              <div className="w-9 h-9 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-black rounded-xl sm:rounded-2xl flex items-center justify-center shadow-[0_4px_16px_rgba(0,0,0,0.15)] group-hover:shadow-[0_8px_24px_rgba(0,0,0,0.25)] transition-all duration-500 relative overflow-hidden">
                {/* Inner glow effect */}
                <div className="absolute inset-[2px] bg-white/5 rounded-[10px] sm:rounded-[14px]" />
                <span className="text-white font-black text-lg sm:text-xl md:text-2xl relative z-10 tracking-tight">
                  S
                </span>
              </div>
              {/* Corner accent */}
              <div className="absolute -top-1 -right-1 w-2.5 h-2.5 sm:w-3 sm:h-3 bg-black rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </div>
            <div className="flex flex-col min-w-0 relative z-10 md:hidden lg:flex">
              <span className="text-base sm:text-lg md:text-xl lg:text-2xl font-black text-black tracking-tight truncate">
                StoryBook
              </span>
              <span className="text-[9px] sm:text-[10px] md:text-xs font-bold text-gray-500 tracking-wider uppercase mt-0.5 sm:mt-1 opacity-70 sm:opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-0 sm:translate-y-1 group-hover:translate-y-0">
                Kwibuka
              </span>
            </div>
          </Link>

          {/* Elevated Navigation - Desktop */}
          <nav className="hidden md:flex items-center justify-center flex-1 min-w-0">
            <div className="flex items-center gap-0.5 sm:gap-1 bg-black/5 backdrop-blur-md rounded-full px-1 sm:px-2 py-1.5 sm:py-2 border border-black/5">
              {[
                { href: "#testimonies", label: "Testimonies" },
                { href: "/connections", label: "Connections" },
                { href: "/virtual-tours", label: "Virtual Tours" },
                { href: "/education", label: "Education" },
              ].map((item) => (
                <Link key={item.href} href={item.href}>
                  <button className="relative px-3 sm:px-4 md:px-6 py-1.5 sm:py-2 md:py-2.5 font-semibold text-xs sm:text-sm text-gray-700 hover:text-black transition-all duration-300 cursor-pointer group rounded-full hover:bg-white/80 whitespace-nowrap">
                    <span className="relative z-10">{item.label}</span>

                    <div className="absolute inset-0 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 scale-90 group-hover:scale-100 shadow-sm" />
                  </button>
                </Link>
              ))}
            </div>
          </nav>

          <div className="flex items-center gap-2 sm:gap-3 shrink-0 relative z-10">
            {/* Share Testimony Button - Always visible with solid background */}
            {mounted && user && (
              <Link href="/share-testimony">
                <button className="group relative inline-flex items-center gap-2 sm:gap-2.5 px-4 sm:px-5 md:px-6 py-3 sm:py-4 md:py-4 bg-black text-white font-semibold text-xs sm:text-sm md:text-base rounded-lg sm:rounded-xl transition-all duration-300 overflow-hidden shadow-[0_4px_16px_rgba(0,0,0,0.2)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.3)] hover:scale-[1.02] whitespace-nowrap z-20 cursor-pointer">
                  <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-linear-to-r from-transparent via-white/20 to-transparent" />
                  <LuShare className="w-3.5 h-3.5 sm:w-4 sm:h-4 relative z-10 shrink-0" />
                  <span className="relative z-10 hidden sm:inline">
                    Share Testimony
                  </span>
                  <span className="relative z-10 sm:hidden">Share</span>
                </button>
              </Link>
            )}

            {mounted && user && (
              <div className="hidden md:block">
                <UserAvatar
                  user={user}
                  size="lg"
                  showDropdown={true}
                  onLogout={handleLogout}
                />
              </div>
            )}

            {mounted && !user && (
              <div className="hidden md:block">
                <Link href="/login">
                  <button
                    className={`inline-flex items-center gap-2 cursor-pointer px-4 sm:px-5 md:px-6 py-2 sm:py-2.5 md:py-3 font-semibold text-xs sm:text-sm md:text-base rounded-lg sm:rounded-xl transition-all duration-300 hover:scale-[1.02] border whitespace-nowrap ${
                      isScrolled
                        ? "bg-white hover:bg-gray-50 border-gray-200 text-gray-800 shadow-sm hover:shadow-md"
                        : "bg-white hover:bg-white border-white/60 text-gray-800 backdrop-blur-sm shadow-sm hover:shadow-md"
                    }`}
                  >
                    Sign in
                  </button>
                </Link>
              </div>
            )}

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`md:hidden p-2.5 sm:p-3 rounded-xl sm:rounded-2xl transition-all duration-300 min-w-[44px] min-h-[44px] sm:min-w-[48px] sm:min-h-[48px] flex items-center justify-center relative z-10 shrink-0 cursor-pointer ${
                isMobileMenuOpen
                  ? "bg-black shadow-[0_4px_16px_rgba(0,0,0,0.25)]"
                  : "bg-white/80 hover:bg-white border border-gray-200 shadow-sm active:scale-95"
              }`}
              aria-label="Toggle menu"
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? (
                <LuX className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              ) : (
                <LuMenu className="w-5 h-5 sm:w-6 sm:h-6 text-gray-800 cursor-pointer" />
              )}
            </button>
          </div>
        </div>
      </header>

      {isMobileMenuOpen && (
        <div
          className="fixed top-20 sm:top-24 left-0 right-0 max-h-[calc(100vh-6rem)] sm:max-h-[calc(100vh-7rem)] overflow-y-auto mobile-blur-overlay md:hidden z-50 mx-3 sm:mx-4 mb-4 sm:mb-6 bg-white border border-gray-200/50 rounded-2xl sm:rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.15)]"
          style={{
            animation: "slideInScale 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
          }}
        >
          <div className="p-4 sm:p-6">
            <div className="space-y-2 sm:space-y-2.5 pb-4 sm:pb-6 border-b border-gray-200/50">
              {[
                { href: "#testimonies", label: "Testimonies", delay: "0ms" },
                {
                  href: "/connections",
                  label: "Find Connections",
                  delay: "50ms",
                },
                {
                  href: "/virtual-tours",
                  label: "Virtual Tours",
                  delay: "100ms",
                },
                { href: "/education", label: "Education", delay: "150ms" },
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <button
                    className="w-full text-left px-4 sm:px-6 py-3 sm:py-4 text-sm sm:text-base font-bold text-gray-800 hover:text-black bg-gray-50/50 hover:bg-gray-100 active:bg-gray-200 rounded-xl sm:rounded-2xl transition-all duration-200 min-h-[52px] sm:min-h-[56px] flex items-center group relative overflow-hidden touch-manipulation cursor-pointer"
                    style={{ animationDelay: item.delay }}
                  >
                    {/* Slide in indicator */}
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-0 group-hover:h-6 sm:group-hover:h-8 bg-black transition-all duration-300 rounded-full" />
                    <span className="ml-1 group-hover:ml-2 sm:group-hover:ml-3 transition-all duration-300">
                      {item.label}
                    </span>
                  </button>
                </Link>
              ))}
            </div>

            {/* Action Buttons with Premium Feel */}
            <div className="space-y-3 sm:space-y-3.5 pt-4 sm:pt-6">
              {mounted && user && (
                <Link
                  href="/share-testimony"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <button className="w-full flex items-center justify-center gap-2.5 sm:gap-3 px-4 sm:px-6 py-3.5 sm:py-4 bg-black hover:bg-gray-800 active:bg-gray-900 text-white text-sm sm:text-base font-bold rounded-xl sm:rounded-2xl transition-all duration-200 min-h-[52px] sm:min-h-[56px] shadow-[0_4px_16px_rgba(0,0,0,0.2)] active:shadow-[0_2px_8px_rgba(0,0,0,0.3)] active:scale-[0.98] relative overflow-hidden group touch-manipulation cursor-pointer">
                    <div className="absolute inset-0 -translate-x-full group-active:translate-x-full transition-transform duration-500 bg-linear-to-r from-transparent via-white/10 to-transparent" />
                    <LuShare className="w-4 h-4 sm:w-5 sm:h-5 relative z-10 shrink-0" />
                    <span className="relative z-10">Share Your Testimony</span>
                  </button>
                </Link>
              )}

              {mounted && user ? (
                <div className="flex items-center gap-2.5 sm:gap-3 px-4 sm:px-6 py-3 sm:py-4 bg-gray-50 rounded-xl sm:rounded-2xl">
                  <UserAvatar user={user} size="md" />
                  <div className="flex-1 min-w-0">
                    <p className="text-base font-semibold text-gray-900 truncate">
                      {user.fullName ? `${user.fullName}` : user.email}
                    </p>
                    <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">
                      {user.email}
                    </p>
                    {user.role === "admin" && (
                      <Link
                        href="/dashboard"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="text-[10px] sm:text-xs text-gray-600 hover:text-gray-900 block mt-0.5"
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
                    className="px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm text-red-600 hover:bg-red-50 active:bg-red-100 rounded-lg transition-colors shrink-0 touch-manipulation cursor-pointer"
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
                    <button className="w-full px-4 sm:px-6 py-3.5 sm:py-4 bg-white border border-gray-300 hover:border-gray-400 active:border-gray-500 text-gray-800 hover:text-black text-sm sm:text-base font-bold rounded-xl sm:rounded-2xl transition-all duration-200 min-h-[52px] sm:min-h-[56px] active:bg-gray-50 active:scale-[0.98] shadow-sm mt-2 touch-manipulation cursor-pointer">
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
          className="md:hidden fixed inset-0 bg-black/20 backdrop-blur-md z-40 cursor-pointer"
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

      <div className="h-28 sm:h-32 md:h-36 cursor-pointer" />

      {/* Main Content Section */}
      <HeroSection />

      {/* Published Testimonies Section */}
      <section id="testimonies" className="relative z-10">
        <div className="container mx-auto px-2 sm:px-4 lg:px-6 py-12 md:py-14 bg-[#fafafa]">
          <div className="mb-6 sm:mb-10 md:mb-12">
            <h2 className="text-xl sm:text-xl md:text-3xl font-extrabold tracking-tight text-gray-900">
              Testimonies
            </h2>
          </div>

          <TestimoniesGrid limit={9} showHeader={false} showFilters={true} />
        </div>
      </section>
    </div>
  );
}
