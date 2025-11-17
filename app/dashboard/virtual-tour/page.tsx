'use client';

import { BarChart3, Eye, Users, TrendingUp, MoreVertical, Edit, Trash2, Archive } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

interface Tour {
  id: number;
  title: string;
  location: string;
  status: 'draft' | 'published' | 'archived';
  impressions: number;
  hotspots: number;
  audioRegions: number;
  createdAt: string;
}

export default function AdminDashboard() {
  const [tours, setTours] = useState<Tour[]>([
    { id: 1, title: 'Modern Downtown Loft', location: 'New York, NY', status: 'published', impressions: 2341, hotspots: 5, audioRegions: 2, createdAt: '2025-01-10' },
    { id: 2, title: 'Beachfront Villa', location: 'Malibu, CA', status: 'published', impressions: 5203, hotspots: 8, audioRegions: 3, createdAt: '2025-01-08' },
    { id: 3, title: 'Museum Gallery', location: 'Boston, MA', status: 'draft', impressions: 0, hotspots: 12, audioRegions: 4, createdAt: '2025-01-05' },
    { id: 4, title: 'Office Space', location: 'SF, CA', status: 'published', impressions: 3921, hotspots: 6, audioRegions: 1, createdAt: '2025-01-02' },
  ]);

  const [openMenu, setOpenMenu] = useState<number | null>(null);
  const [filter, setFilter] = useState<'all' | 'published' | 'draft' | 'archived'>('all');

  const stats = [
    { label: 'Total Tours', value: tours.length, icon: BarChart3 },
    { label: 'Published', value: tours.filter((t) => t.status === 'published').length, icon: Eye },
    { label: 'Total Impressions', value: tours.reduce((sum, t) => sum + t.impressions, 0).toLocaleString(), icon: TrendingUp },
    { label: 'Active Users', value: '1,243', icon: Users },
  ];

  const filteredTours = tours.filter((t) => filter === 'all' || t.status === filter);

  const handleDeleteTour = (id: number) => {
    setTours(tours.filter((t) => t.id !== id));
  };

  const handleArchiveTour = (id: number) => {
    setTours(tours.map((t) => (t.id === id ? { ...t, status: 'archived' } : t)));
  };

  const handlePublishTour = (id: number) => {
    setTours(tours.map((t) => (t.id === id ? { ...t, status: 'published' } : t)));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'draft':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'archived':
        return 'bg-gray-100 text-gray-600 border-gray-200';
      default:
        return '';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="px-6 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Virtual Tour Management</h1>
          <p className="text-gray-600">Manage your virtual tours, analytics, and platform settings</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <div key={i} className="border border-gray-200 rounded-xl p-6 bg-white shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-2">{stat.label}</p>
                    <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                  <div className="w-10 h-10 rounded-lg bg-gray-900 flex items-center justify-center text-white">
                    <Icon className="w-6 h-6" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Tours Management */}
        <div className="border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm">
          {/* Header */}
          <div className="border-b border-gray-200 p-6 flex items-center justify-between bg-white">
            <h2 className="text-xl font-bold text-gray-900">Virtual Tours</h2>
            <Link href="/dashboard/create" className="px-4 py-2 rounded-lg bg-gray-900 text-white hover:bg-gray-800 transition-colors font-medium">
              Create Tour
            </Link>
          </div>

          {/* Filters */}
          <div className="border-b border-gray-200 p-4 flex gap-2 flex-wrap bg-gray-50">
            {(['all', 'published', 'draft', 'archived'] as const).map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-2 cursor-pointer rounded-lg text-sm font-medium transition-colors capitalize ${
                  filter === status
                    ? 'bg-gray-900 text-white font-semibold'
                    : 'border border-gray-300 text-gray-700 hover:bg-gray-100'
                }`}
              >
                {status}
              </button>
            ))}
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900">Tour</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900">Status</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900">Impressions</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900">Hotspots</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900">Audio</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900">Created</th>
                  <th className="text-center px-6 py-4 text-sm font-semibold text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredTours.map((tour) => (
                  <tr key={tour.id} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-semibold text-gray-900">{tour.title}</p>
                        <p className="text-sm text-gray-600">{tour.location}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(tour.status)} capitalize`}>
                        {tour.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-900 font-semibold">{tour.impressions.toLocaleString()}</td>
                    <td className="px-6 py-4 text-gray-700">{tour.hotspots}</td>
                    <td className="px-6 py-4 text-gray-700">{tour.audioRegions}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{tour.createdAt}</td>
                    <td className="px-6 py-4">
                      <div className="relative">
                        <button
                          onClick={() => setOpenMenu(openMenu === tour.id ? null : tour.id)}
                          className="p-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-500 hover:text-gray-700"
                        >
                          <MoreVertical className="w-5 h-5" />
                        </button>

                        {openMenu === tour.id && (
                          <div className="absolute right-0 top-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg shadow-gray-400/20 overflow-hidden z-50 w-48">
                            <Link href={`/tour/${tour.id}`} className="flex items-center gap-2 w-full px-4 py-2 hover:bg-gray-50 transition-colors text-gray-700 text-sm">
                              <Eye className="w-4 h-4" />
                              View Tour
                            </Link>
                            <button className="flex items-center gap-2 w-full px-4 py-2 hover:bg-gray-50 transition-colors text-gray-700 text-sm">
                              <Edit className="w-4 h-4" />
                              Edit
                            </button>
                            {tour.status !== 'published' && (
                              <button
                                onClick={() => handlePublishTour(tour.id)}
                                className="flex items-center gap-2 w-full px-4 py-2 hover:bg-gray-50 transition-colors text-gray-900 text-sm"
                              >
                                <TrendingUp className="w-4 h-4" />
                                Publish
                              </button>
                            )}
                            {tour.status !== 'archived' && (
                              <button
                                onClick={() => handleArchiveTour(tour.id)}
                                className="flex items-center gap-2 w-full px-4 py-2 hover:bg-gray-50 transition-colors text-gray-600 text-sm"
                              >
                                <Archive className="w-4 h-4" />
                                Archive
                              </button>
                            )}
                            <button
                              onClick={() => handleDeleteTour(tour.id)}
                              className="flex items-center gap-2 w-full px-4 py-2 hover:bg-red-50 transition-colors text-red-600 text-sm"
                            >
                              <Trash2 className="w-4 h-4" />
                              Delete
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Empty State */}
          {filteredTours.length === 0 && (
            <div className="p-12 text-center">
              <p className="text-gray-600 mb-4">No {filter !== 'all' ? filter : ''} tours found</p>
              <Link href="/dashboard/create" className="inline-block px-4 py-2 rounded-lg bg-gray-900 text-white hover:bg-gray-800 transition-colors font-medium">
                Create First Tour
              </Link>
            </div>
          )}
        </div>

        {/* Additional Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
          {/* Recent Activities */}
          <div className="border border-gray-200 rounded-xl p-6 bg-white shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activities</h3>
            <div className="space-y-4">
              {[
                { action: 'Published', tour: 'Downtown Loft', time: '2 hours ago' },
                { action: 'Created', tour: 'Museum Gallery', time: '5 hours ago' },
                { action: 'Updated', tour: 'Beachfront Villa', time: '1 day ago' },
              ].map((activity, i) => (
                <div key={i} className="flex items-center justify-between pb-4 border-b border-gray-200 last:border-0">
                  <div>
                    <p className="text-gray-900 font-medium">{activity.action}</p>
                    <p className="text-sm text-gray-600">{activity.tour}</p>
                  </div>
                  <span className="text-xs text-gray-500">{activity.time}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Performance Metrics */}
          <div className="border border-gray-200 rounded-xl p-6 bg-white shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Performing Tours</h3>
            <div className="space-y-4">
              {tours
                .filter((t) => t.status === 'published')
                .sort((a, b) => b.impressions - a.impressions)
                .slice(0, 3)
                .map((tour) => (
                  <div key={tour.id} className="pb-4 border-b border-gray-100 last:border-0">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-gray-900 font-medium">{tour.title}</p>
                      <span className="text-gray-900 font-semibold">{tour.impressions.toLocaleString()} views</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-linear-to-r from-gray-900 to-gray-700 h-2 rounded-full"
                        style={{ width: `${(tour.impressions / 5500) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}