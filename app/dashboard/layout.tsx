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
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      setMounted(true);
      const authenticated = isAuthenticated();
      setIsLoggedIn(authenticated);

      if (!authenticated) {
        router.push("/login");
      }
    };

    checkAuth();
  }, [router]);

  if (!mounted) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-800 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isLoggedIn) {
    return null;
  }

  const user = getCurrentUser();

  const pageTitle = (() => {
    if (!pathname) return "Dashboard";
    const map: Record<string, string> = {
      "/dashboard": "Dashboard Overview",
      "/dashboard/users-management": "User Management",
      "/dashboard/content-moderations": "Content Moderations",
      "/dashboard/virtual-tour": "Virtual Tour Management",
      "/dashboard/all-testimonies": "All Testimonies",
      "/dashboard/settings": "Settings & Analytics",
    };
    return map[pathname] ?? "Dashboard";
  })();

  const contentPaddingClass = sidebarCollapsed ? "lg:pl-0" : "lg:pl-0";

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />
      
      {/* Main content */}
      <div
        className={`flex-1 flex flex-col transition-all duration-300 ${contentPaddingClass}`}
      >
        {/* Header */}
        <Header
          title={pageTitle}
          user={user}
          onMenuClick={() => setSidebarOpen(true)}
          sidebarCollapsed={sidebarCollapsed}
        />

        {/* Main content*/}
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}