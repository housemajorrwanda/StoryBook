"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LuLayoutDashboard,
  LuUsers,
  LuMapPinned,
  LuShieldCheck,
  LuMessageSquareQuote,
  LuSettings,
  LuChevronLeft,
  LuChevronRight,
  LuGraduationCap,
} from "react-icons/lu";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
}

const menuItems = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: LuLayoutDashboard,
    exact: true,
  },
  {
    name: "User Management",
    href: "/dashboard/users-management",
    icon: LuUsers,
  },
  {
    name: "Tour Management",
    href: "/dashboard/virtual-tour",
    icon: LuMapPinned,
  },
  {
    name: "Moderation",
    href: "/dashboard/content-moderations",
    icon: LuShieldCheck,
  },
  {
    name: "Testimonies",
    href: "/dashboard/all-testimonies",
    icon: LuMessageSquareQuote,
  },
  { name: "Education", href: "/dashboard/education", icon: LuGraduationCap },
];

const generalItems = [
  { name: "Settings", href: "/dashboard/settings", icon: LuSettings },
];

function NavItem({
  item,
  collapsed,
}: {
  item: (typeof menuItems)[number];
  collapsed: boolean;
}) {
  const pathname = usePathname();
  const active = item.exact
    ? pathname === item.href
    : pathname.startsWith(item.href);
  const Icon = item.icon;

  return (
    <Link
      href={item.href}
      title={collapsed ? item.name : undefined}
      className={`relative flex items-center gap-3 rounded-xl transition-all duration-150 group ${
        collapsed ? "justify-center p-3" : "px-3 py-2.5"
      } ${
        active
          ? "bg-gray-900 text-white shadow-sm"
          : "text-gray-400 hover:bg-gray-50 hover:text-gray-900"
      }`}
    >
      <Icon
        className={`w-[18px] h-[18px] shrink-0 transition-colors ${
          active ? "text-white" : "text-gray-400 group-hover:text-gray-700"
        }`}
      />

      {!collapsed && (
        <span className="text-sm font-medium leading-none">{item.name}</span>
      )}

      {/* Active indicator */}
      {active && !collapsed && (
        <span className="ml-auto w-1.5 h-1.5 rounded-full bg-white/60" />
      )}

      {/* Tooltip when collapsed */}
      {collapsed && (
        <div className="pointer-events-none absolute left-full ml-3 z-50 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
          <div className="bg-gray-900 text-white text-xs font-medium px-2.5 py-1.5 rounded-lg whitespace-nowrap shadow-lg">
            {item.name}
            <span className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-gray-900" />
          </div>
        </div>
      )}
    </Link>
  );
}

export default function Sidebar({
  isOpen,
  onClose,
  collapsed,
  onToggleCollapse,
}: SidebarProps) {
  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden backdrop-blur-sm"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex flex-col bg-white border-r border-gray-100 transition-all duration-300 ease-in-out lg:static lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } ${collapsed ? "w-[68px]" : "w-[220px]"}`}
      >
        {/* Logo */}
        <div className="flex items-center h-16 border-b border-gray-100 shrink-0 px-3 justify-between">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-7 h-7 bg-gray-900 rounded-lg flex items-center justify-center shrink-0">
              <span className="text-white text-xs font-black tracking-tight">
                I
              </span>
            </div>
            {!collapsed && (
              <span className="text-sm font-bold tracking-tight text-gray-900 truncate">
                iHame
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={onToggleCollapse}
            className="hidden lg:flex w-7 h-7 items-center justify-center rounded-lg text-gray-300 hover:text-gray-700 hover:bg-gray-100 transition-colors shrink-0"
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? (
              <LuChevronRight className="w-4 h-4" />
            ) : (
              <LuChevronLeft className="w-4 h-4" />
            )}
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 flex flex-col px-3 py-4 overflow-y-auto custom-scrollbar gap-5">
          {/* Main */}
          <div className="flex flex-col gap-0.5">
            {!collapsed && (
              <p className="px-3 mb-1.5 text-[10px] font-semibold uppercase tracking-widest text-gray-300">
                Main
              </p>
            )}
            {menuItems.map((item) => (
              <NavItem key={item.href} item={item} collapsed={collapsed} />
            ))}
          </div>

          {/* General */}
          <div className="flex flex-col gap-0.5">
            {!collapsed && (
              <p className="px-3 mb-1.5 text-[10px] font-semibold uppercase tracking-widest text-gray-300">
                General
              </p>
            )}
            {generalItems.map((item) => (
              <NavItem key={item.href} item={item} collapsed={collapsed} />
            ))}
          </div>
        </nav>

        {/* Footer */}
        {!collapsed && (
          <div className="px-4 py-4 border-t border-gray-100 shrink-0">
            <p className="text-[10px] text-gray-300 text-center tracking-wide">
              Kwibuka Admin Platform
            </p>
          </div>
        )}
      </aside>
    </>
  );
}
