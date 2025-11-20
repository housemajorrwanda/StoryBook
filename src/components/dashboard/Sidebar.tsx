"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  LuLayoutDashboard,
  LuUsers,
  LuMapPinned,
  LuShieldCheck,
  LuMessageSquareQuote,
  LuSettings,
  LuChevronLeft,
  LuChevronRight,
} from "react-icons/lu";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
}

export default function Sidebar({ isOpen, onClose, collapsed, onToggleCollapse }: SidebarProps) {
  const pathname = usePathname();
  const [, setHoveredItem] = useState<string | null>(null);

  const menuItems = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: <LuLayoutDashboard className="w-5 h-5" />,
    },
    {
      name: "User Management",
      href: "/dashboard/users-management",
      icon: <LuUsers className="w-5 h-5" />,
    },
    {
      name: "Tour Management",
      href: "/dashboard/virtual-tour",
      icon: <LuMapPinned className="w-5 h-5" />,
    },
    {
      name: "Content Moderations",
      href: "/dashboard/content-moderations",
      icon: <LuShieldCheck className="w-5 h-5" />,
    },
    {
      name: "All Testimonies",
      href: "/dashboard/all-testimonies",
      icon: <LuMessageSquareQuote className="w-5 h-5" />,
    },
  ];

  const generalItems = [
    {
      name: "Settings Analytics",
      href: "/dashboard/settings",
      icon: <LuSettings className="w-5 h-5" />,
    },
  ];


  const isActive = (href: string) => pathname === href;

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden transition-opacity duration-300"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 bg-white transform transition-all duration-300 ease-in-out lg:static lg:inset-0 lg:z-auto lg:translate-x-0
          ${isOpen ? "translate-x-0" : "-translate-x-full"} 
          ${collapsed ? "w-20" : "w-64"}`}
      >
        <div className="flex flex-col h-full bg-white">
          {/* Logo and Toggle */}
          <div className={`flex items-center ${collapsed ? 'justify-center px-4' : 'justify-between px-6'} h-20 border-b border-gray-100`}>
            {!collapsed && (
              <div className="flex items-center justify-center">
                <h1 className="text-xl font-bold text-gray-900">HTFC</h1>
              </div>
            )}
            
            {/* Collapse Toggle - Desktop only */}
            <button
              onClick={onToggleCollapse}
              className="hidden lg:flex items-center justify-center w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors duration-200 cursor-pointer"
            >
              {collapsed ? (
                <LuChevronRight className="w-4 h-4 text-gray-600" />
              ) : (
                <LuChevronLeft className="w-4 h-4 text-gray-600" />
              )}
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
            {/* Main Menu */}
            <div>
              {!collapsed && (
                <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
                  Main Menu
                </h3>
              )}
              <div className="space-y-1">
                {menuItems.map((item) => {
                  const active = isActive(item.href);
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      onMouseEnter={() => setHoveredItem(item.name)}
                      onMouseLeave={() => setHoveredItem(null)}
                      className={`relative flex items-center transition-all duration-200 group cursor-pointer ${
                        collapsed ? 'justify-center px-3 py-3 rounded-xl' : 'px-3 py-3 rounded-xl mx-2'
                      } ${
                        active
                          ? "bg-gray-100 text-gray-900 shadow-sm"
                          : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                      }`}
                    >
                      {/* Active indicator */}
                      {active && (
                        <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-6 bg-gray-500 rounded-r-full"></div>
                      )}
                      
                      <span className={`transition-colors cursor-pointer ${active ? 'text-gray-600' : 'text-gray-400 group-hover:text-gray-600'}`}>
                        {item.icon}
                      </span>
                      
                      {!collapsed && (
                        <span className="ml-3 text-sm font-medium cursor-pointer">{item.name}</span>
                      )}
                      
                      {/* Tooltip for collapsed state */}
                      {collapsed && (
                        <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-50 cursor-pointer">
                          {item.name}
                          <div className="absolute right-full top-1/2 transform -translate-y-1/2 w-0 h-0"></div>
                        </div>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* General Section */}
            <div className="pt-6">
              {!collapsed && (
                <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
                  General
                </h3>
              )}
              <div className="space-y-1">
                {generalItems.map((item) => {
                  const active = isActive(item.href);
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      onMouseEnter={() => setHoveredItem(item.name)}
                      onMouseLeave={() => setHoveredItem(null)}
                      className={`relative flex items-center transition-all duration-200 group ${
                        collapsed ? 'justify-center px-3 py-3 rounded-xl' : 'px-3 py-3 rounded-xl mx-2'
                      } ${
                        active
                          ? "bg-gray-100 text-gray-900 shadow-sm"
                          : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                      }`}
                    >
                      {active && (
                        <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-6 bg-gray-500 rounded-r-full"></div>
                      )}
                      
                      <span className={`transition-colors ${active ? 'text-gray-600' : 'text-gray-400 group-hover:text-gray-600'}`}>
                        {item.icon}
                      </span>
                      
                      {!collapsed && (
                        <span className="ml-3 text-sm font-medium">{item.name}</span>
                      )}
                      
                      {collapsed && (
                        <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-50">
                          {item.name}
                          <div className="absolute right-full top-1/2 transform -translate-y-1/2 w-0 h-0"></div>
                        </div>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          </nav>
        </div>
      </div>
    </>
  );
}