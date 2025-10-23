'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUser, isAuthenticated } from '@/lib/decodeToken';
import { JWTPayload } from '@/types/auth';
import { UnderDevelopment } from '@/components/shared';

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<JWTPayload | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/login');
      return;
    }

    const currentUser = getCurrentUser();
    setUser(currentUser);
    setLoading(false);
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-600">Welcome back, {user.firstName || user.username || 'User'}!</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">
                  {user.firstName && user.lastName 
                    ? `${user.firstName} ${user.lastName}` 
                    : user.username || user.email || 'User'
                  }
                </p>
                <p className="text-sm text-gray-500">{user.email}</p>
              </div>
              <div className="h-10 w-10 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white font-medium text-sm">
                  {user.firstName && user.lastName 
                    ? `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`
                    : user.username 
                      ? user.username.charAt(0).toUpperCase()
                      : user.email 
                        ? user.email.charAt(0).toUpperCase()
                        : 'U'
                  }
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Section */}
      <main>
        <UnderDevelopment 
          title="Welcome to StoryBook Dashboard"
          subtitle="This dashboard is still under development"
        />
      </main>
    </div>
  );
}
