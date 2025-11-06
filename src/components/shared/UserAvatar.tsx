"use client";

import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { JWTPayload } from "@/types/auth";
import Link from "next/link";
import { LuFileText, LuSave, LuChevronRight } from "react-icons/lu";
import { useDrafts } from "@/hooks/useTestimonies";
import { isAuthenticated } from "@/lib/decodeToken";

interface UserAvatarProps {
  user: JWTPayload;
  size?: "sm" | "md" | "lg";
  className?: string;
  showDropdown?: boolean;
  onLogout?: () => void;
}

export default function UserAvatar({
  user,
  size = "md",
  className = "",
  showDropdown = false,
  onLogout,
}: UserAvatarProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({
    top: 0,
    right: 0,
  });
  const buttonRef = useRef<HTMLButtonElement>(null);
  const isClient = typeof window !== "undefined";
  const router = useRouter();

  // Fetch drafts if user is authenticated
  const { data: drafts = [], isLoading: isLoadingDrafts } = useDrafts();
  const hasDrafts = drafts.length > 0;

  useEffect(() => {
    if (isDropdownOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + 8,
        right: window.innerWidth - rect.right,
      });
    }
  }, [isDropdownOpen]);

  const sizeClasses = {
    sm: "w-8 h-8 text-xs",
    md: "w-10 h-10 text-sm",
    lg: "w-12 h-12 text-base",
  };

  const getInitials = () => {
    if (user.firstName && user.lastName) {
      return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
    }
    if (user.username) {
      return user.username[0].toUpperCase();
    }
    if (user.email) {
      return user.email[0].toUpperCase();
    }
    return "U";
  };

  const getUserName = () => {
    return user.fullName || "User";
  };

  const handleResumeDraft = (draftId: number) => {
    setIsDropdownOpen(false);
    router.push(`/share-testimony?draft=${draftId}`);
  };

  const formatDraftTitle = (draft: {
    eventTitle?: string;
    submissionType?: string | null;
  }) => {
    if (draft.eventTitle) {
      return draft.eventTitle.length > 30
        ? `${draft.eventTitle.substring(0, 30)}...`
        : draft.eventTitle;
    }
    return draft.submissionType
      ? `${
          String(draft.submissionType).charAt(0).toUpperCase() +
          String(draft.submissionType).slice(1)
        } Testimony`
      : "Untitled Draft";
  };

  const dropdownContent = showDropdown && isDropdownOpen && isClient && (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0"
        style={{ zIndex: 9998 }}
        onClick={() => setIsDropdownOpen(false)}
      />

      {/* Dropdown Menu */}
      <div
        className="fixed w-64 bg-white rounded-xl shadow-xl border border-gray-200 py-2 max-h-[80vh] overflow-y-auto"
        style={{
          zIndex: 9999,
          top: `${dropdownPosition.top}px`,
          right: `${dropdownPosition.right}px`,
        }}
      >
        <div className="px-4 py-2 border-b border-gray-50">
          <p className="text-base font-bold text-gray-900">{getUserName()}</p>
          <p className="text-xs text-gray-500 truncate">{user.email}</p>
        </div>

        {/* Drafts Section */}
        {isAuthenticated() && (
          <>
            {isLoadingDrafts ? (
              <div className="px-4 py-3 text-xs text-gray-500">
                Loading drafts...
              </div>
            ) : hasDrafts ? (
              <div className="border-b border-gray-100">
                <div className="px-4 py-2 bg-gray-50">
                  <p className="text-xs font-semibold text-gray-700 uppercase tracking-wide flex items-center gap-2">
                    <LuSave className="w-3 h-3" />
                    Drafts ({drafts.length})
                  </p>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {drafts.slice(0, 5).map((draft) => (
                    <button
                      key={draft.id}
                      onClick={() => handleResumeDraft(draft.id)}
                      className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer border-b border-gray-50 last:border-b-0"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">
                            {formatDraftTitle(draft)}
                          </p>
                          {draft.updatedAt && (
                            <p className="text-xs text-gray-500 mt-0.5">
                              {new Date(draft.updatedAt).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                        <LuChevronRight className="w-4 h-4 text-gray-400 shrink-0" />
                      </div>
                    </button>
                  ))}
                  {drafts.length > 5 && (
                    <Link
                      href="/share-testimony?view=drafts"
                      className="block px-4 py-2 text-xs text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer text-center border-t border-gray-100"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      View all {drafts.length} drafts
                    </Link>
                  )}
                </div>
              </div>
            ) : (
              <Link
                href="/share-testimony"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer border-b border-gray-100"
                onClick={() => setIsDropdownOpen(false)}
              >
                <div className="flex items-center gap-2">
                  <LuFileText className="w-4 h-4" />
                  <span>Share Your Story</span>
                </div>
              </Link>
            )}
          </>
        )}

        {/* Admin Dashboard */}
        {user.role === "admin" && (
          <Link
            href="/dashboard"
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer border-b border-gray-100"
            onClick={() => setIsDropdownOpen(false)}
          >
            Dashboard
          </Link>
        )}

        {/* Logout */}
        {onLogout && (
          <button
            onClick={() => {
              onLogout();
              setIsDropdownOpen(false);
            }}
            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
          >
            Sign out
          </button>
        )}
      </div>
    </>
  );

  return (
    <div className={`relative ${className} z-50`}>
      <button
        ref={buttonRef}
        onClick={() => showDropdown && setIsDropdownOpen(!isDropdownOpen)}
        className={`${sizeClasses[size]} rounded-full bg-black text-white font-bold flex items-center justify-center hover:ring-4 hover:ring-gray-300 transition-all duration-200 cursor-pointer shrink-0 relative`}
        aria-label="User menu"
      >
        <div className="w-full h-full rounded-full bg-gray-900 flex items-center justify-center">
          {getInitials()}
        </div>
        {/* Draft indicator badge */}
        {isAuthenticated() && hasDrafts && !isLoadingDrafts && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 rounded-full border-2 border-white flex items-center justify-center">
            <span className="text-[8px] text-white font-bold">
              {drafts.length}
            </span>
          </span>
        )}
      </button>

      {isClient &&
        dropdownContent &&
        createPortal(dropdownContent, document.body)}
    </div>
  );
}
