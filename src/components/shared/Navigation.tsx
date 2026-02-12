"use client";

import Link from "next/link";
import { useState, useEffect, type MouseEvent as ReactMouseEvent } from "react";
import { usePathname } from "next/navigation";
import { Menu, X, Share2 } from "lucide-react";
import UserAvatar from "@/components/shared/UserAvatar";
import { getCurrentUser, isAuthenticated } from "@/lib/decodeToken";
import { useLogout } from "@/hooks/auth/use-auth-queries";

interface NavigationProps {
  showBackgroundEffects?: boolean;
  variant?: "default" | "transparent";
}

export default function Navigation({ variant = "default" }: NavigationProps) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [user, setUser] = useState<ReturnType<typeof getCurrentUser>>(null);
  const logoutMutation = useLogout();

  const isActive = (href: string) => {
    if (href === "/#testimonies") {
      return pathname === "/" || pathname === "/#testimonies";
    }
    return pathname === href || pathname.startsWith(href);
  };

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
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

    const handleStorageChange = () => checkAuth();
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
      onSuccess: () => setUser(null),
    });
  };

  const navItems = [
    { href: "/#testimonies", label: "Testimonies" },
    { href: "/connections", label: "Connections" },
    { href: "/virtual-tours", label: "Virtual Tours" },
    { href: "/education", label: "Education" },
  ];

  const getHeaderOffset = () => {
    if (typeof window === "undefined") return 80;
    const width = window.innerWidth;
    if (width < 768) return 64;
    return 80;
  };

  const getSectionElement = (hash: string) => {
    if (!hash || typeof document === "undefined") return null;
    return document.getElementById(hash);
  };

  const scrollToSection = (hash: string, delay = 0) => {
    if (typeof window === "undefined") return;

    const performScroll = () => {
      const element = getSectionElement(hash);
      if (!element) return;

      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition =
        elementPosition + window.pageYOffset - getHeaderOffset();

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    };

    if (delay) {
      setTimeout(performScroll, delay);
    } else {
      performScroll();
    }
  };

  const handleDesktopNavClick = (
    e: ReactMouseEvent<HTMLAnchorElement>,
    href: string,
  ) => {
    if (!href.startsWith("/#")) return;
    const hash = href.split("#")[1];
    if (!getSectionElement(hash)) return;
    e.preventDefault();
    scrollToSection(hash);
  };

  const handleMobileNavClick = (
    e: ReactMouseEvent<HTMLAnchorElement>,
    href: string,
  ) => {
    const isAnchorLink = href.startsWith("/#");
    setIsMobileMenuOpen(false);
    if (!isAnchorLink) return;
    const hash = href.split("#")[1];
    if (!getSectionElement(hash)) return;
    e.preventDefault();
    scrollToSection(hash, 100);
  };

  const resolveLabel = (item: { href: string; label: string }) => {
    if (
      (item.href === "/tour" || item.href === "/virtual-tours") &&
      pathname?.startsWith("/tour")
    ) {
      return "Virtual Tours";
    }
    return item.label;
  };

  const resolveActive = (item: { href: string }) => {
    if (
      (item.href === "/tour" || item.href === "/virtual-tours") &&
      pathname?.startsWith("/tour")
    ) {
      return true;
    }
    return isActive(item.href);
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-white/90 backdrop-blur-xl border-b border-gray-200/60 shadow-sm"
            : variant === "default"
              ? "bg-white/80 backdrop-blur-lg border-b border-transparent"
              : "bg-transparent"
        }`}
      >
        <div className="container mx-auto px-5 sm:px-6 lg:px-16">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 shrink-0 group">
              <div className="w-9 h-9 md:w-10 md:h-10 bg-gray-900 rounded-xl flex items-center justify-center group-hover:bg-black transition-colors">
                <span className="text-white font-black text-lg md:text-xl">
                  i
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-lg md:text-xl font-black text-gray-900 tracking-tight leading-none">
                  iHame
                </span>
                <span className="text-[10px] font-semibold text-gray-400 tracking-wider uppercase leading-none mt-0.5">
                  StoryBook
                </span>
              </div>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-1">
              {navItems.map((item) => {
                const active = resolveActive(item);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={(e) => handleDesktopNavClick(e, item.href)}
                    className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                      active
                        ? "text-gray-900 bg-gray-100"
                        : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
                    }`}
                  >
                    {resolveLabel(item)}
                  </Link>
                );
              })}
            </nav>

            {/* Right side */}
            <div className="flex items-center gap-3 shrink-0">
              {mounted && user && (
                <Link href="/share-testimony" className="hidden sm:block">
                  <button className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 text-white text-sm font-semibold rounded-lg hover:bg-black transition-colors cursor-pointer active:scale-[0.98]">
                    <Share2 className="w-4 h-4" />
                    <span className="hidden lg:inline">Share Testimony</span>
                    <span className="lg:hidden">Share</span>
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
                <Link href="/login" className="hidden md:block">
                  <button className="px-4 py-2 text-sm font-semibold text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-colors cursor-pointer">
                    Sign in
                  </button>
                </Link>
              )}

              {/* Mobile hamburger */}
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className={`md:hidden p-2 rounded-lg transition-colors cursor-pointer ${
                  isMobileMenuOpen
                    ? "bg-gray-900 text-white"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
                aria-label="Toggle menu"
                aria-expanded={isMobileMenuOpen}
              >
                {isMobileMenuOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
          onClick={() => setIsMobileMenuOpen(false)}
          aria-label="Close menu"
        />
      )}

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed top-16 left-0 right-0 z-50 px-4 pt-2">
          <div className="bg-white border border-gray-200 rounded-2xl shadow-xl overflow-hidden">
            <div className="p-3">
              {/* Nav links */}
              <div className="space-y-0.5">
                {navItems.map((item) => {
                  const active = resolveActive(item);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={(e) => handleMobileNavClick(e, item.href)}
                    >
                      <div
                        className={`px-4 py-3 text-sm font-medium rounded-xl transition-colors ${
                          active
                            ? "text-gray-900 bg-gray-100"
                            : "text-gray-600 hover:text-gray-900 hover:bg-gray-50 active:bg-gray-100"
                        }`}
                      >
                        {resolveLabel(item)}
                      </div>
                    </Link>
                  );
                })}
              </div>

              {/* Divider */}
              <div className="h-px bg-gray-100 my-3" />

              {/* Actions */}
              <div className="space-y-2">
                {mounted && user && (
                  <Link
                    href="/share-testimony"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <div className="flex items-center justify-center gap-2 px-4 py-3 bg-gray-900 text-white text-sm font-semibold rounded-xl hover:bg-black transition-colors">
                      <Share2 className="w-4 h-4" />
                      Share Your Testimony
                    </div>
                  </Link>
                )}

                {mounted && user ? (
                  <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-xl mt-2">
                    <UserAvatar user={user} size="md" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 truncate">
                        {user.fullName || user.email}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {user.email}
                      </p>
                      {user.role === "admin" && (
                        <Link
                          href="/dashboard"
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="text-xs text-gray-500 hover:text-gray-800 mt-0.5 block"
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
                      className="px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors shrink-0 cursor-pointer"
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
                      <div className="px-4 py-3 text-sm font-semibold text-gray-700 border border-gray-200 rounded-xl text-center hover:bg-gray-50 transition-colors mt-2">
                        Sign in
                      </div>
                    </Link>
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
