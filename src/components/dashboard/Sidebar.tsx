"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLogout } from "@/hooks/auth/use-auth-queries";
import {
  LayoutDashboard,
  Users,
  MapPinned,
  ShieldCheck,
  MessageSquareQuote,
  Settings,
} from "lucide-react";


interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const logoutMutation = useLogout();

 const menuItems = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: <LayoutDashboard className="w-5 h-5" />,
  },
  {
    name: "User Management",
    href: "/dashboard/users",
    icon: <Users className="w-5 h-5" />,
  },
  {
    name: "Tour Management",
    href: "/dashboard/virtual-tour",
    icon: <MapPinned className="w-5 h-5" />,
  },
  {
    name: "Content Moderations",
    href: "/dashboard/moderations",
    icon: <ShieldCheck className="w-5 h-5" />,
  },
  {
    name: "All Testimonies",
    href: "/dashboard/testimonies",
    icon: <MessageSquareQuote className="w-5 h-5" />,
  },
];

const generalItems = [
  {
    name: "Settings Analytics",
    href: "/dashboard/settings",
    icon: <Settings className="w-5 h-5" />,
  },
];


  const handleLogout = () => {
    logoutMutation.mutate();
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-60 bg-gray-50 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center h-20 px-6  ">
            <h1 className="text-lg  font-bold text-gray-900">HTFC</h1>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-6 py-2 space-y-4 border-t border-gray-200 overflow-y-auto">
            {/* Main Menu */}
            <div>
              <h3 className="px-2 text-xs font-semibold text-gray-900 uppercase tracking-wider mb-2">
                Main Menu
              </h3>
              <div className="space-y-1">
                {menuItems.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`flex items-center px-2 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                        isActive
                          ? "bg-gray-200 text-gray-900 font-bold"
                          : "text-gray-600 hover:bg-gray-100"
                      }`}
                    >
                      <span
                        className={`mr-3 ${
                          isActive ? "text-gray-900" : "text-gray-500"
                        }`}
                      >
                        {item.icon}
                      </span>
                      <span>{item.name}</span>
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* General */}
            <div>
              <h3 className="px-2 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                General
              </h3>
              <div className="space-y-1">
                {generalItems.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`flex items-center px-2 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                        isActive
                          ? "bg-gray-200 text-gray-900 font-bold"
                          : "text-gray-600 hover:bg-gray-100"
                      }`}
                    >
                      <span
                        className={`mr-3 ${
                          isActive ? "text-gray-900" : "text-gray-500"
                        }`}
                      >
                        {item.icon}
                      </span>
                      <span>{item.name}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          </nav>

          {/* Logout */}
          <div className="p-2 px-12 py-9 ">
            <button
              onClick={handleLogout}
              disabled={logoutMutation.isPending}
              className="flex items-center w-full px-3 py-2 text-sm font-medium text-gray-600 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50"
            >
              <svg
                className="w-5 h-5 mr-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
              <span>
                {logoutMutation.isPending ? "Logging out..." : "Logout"}
              </span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
