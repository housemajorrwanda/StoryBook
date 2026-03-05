"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { isAuthenticated, getCurrentUser } from "@/lib/decodeToken";
import { Sidebar, Header } from "@/components/dashboard";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!isAuthenticated()) router.push("/login");
  }, [router]);

  if (!mounted) {
    return (
      <div className="flex items-center justify-center h-screen bg-white">
        <div className="w-8 h-8 rounded-full border-2 border-gray-100 border-t-gray-900 animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated()) return null;

  const user = getCurrentUser();

  const pageTitle = (() => {
    if (!pathname) return "Dashboard";
    const map: Record<string, string> = {
      "/dashboard": "Overview",
      "/dashboard/users-management": "User Management",
      "/dashboard/content-moderations": "Content Moderation",
      "/dashboard/virtual-tour": "Tour Management",
      "/dashboard/all-testimonies": "Testimonies",
      "/dashboard/education": "Education",
      "/dashboard/settings": "Settings",
      "/dashboard/profile": "My Profile",
    };
    return map[pathname] ?? "Dashboard";
  })();

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header
          title={pageTitle}
          user={user}
          onMenuClick={() => setSidebarOpen(true)}
          sidebarCollapsed={sidebarCollapsed}
        />
        <main className="flex-1 overflow-y-auto custom-scrollbar p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
