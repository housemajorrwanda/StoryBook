'use client';

import PageLayout from '@/layout/PageLayout';
import { Search, Filter, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

const tours = [
  { id: 1, title: 'Modern Downtown Loft', location: 'New York, NY', type: '360_image', image: '/modern-loft.jpg', views: 2341 },
  { id: 2, title: 'Beachfront Villa', location: 'Malibu, CA', type: '360_image', image: '/beach-villa.jpg', views: 5203 },
  { id: 3, title: 'Museum Gallery', location: 'Boston, MA', type: '3d_model', image: '/museum-interior.png', views: 1842 },
  { id: 4, title: 'Office Space', location: 'SF, CA', type: 'embed', image: '/modern-open-office.png', views: 3921 },
  { id: 5, title: 'Luxury Penthouse', location: 'Miami, FL', type: '360_image', image: '/luxurious-city-penthouse.png', views: 4562 },
  { id: 6, title: 'Historic Mansion', location: 'Charleston, SC', type: '360_video', image: '/grand-mansion.png', views: 2104 },
];

export default function Tour() {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');

  const filtered = tours.filter(
    (tour) =>
      (tour.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tour.location.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (typeFilter === 'all' || tour.type === typeFilter)
  );

  return (
    <PageLayout showBackgroundEffects={true} variant="default">
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-6 py-12">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Tour Gallery</h1>
            <p className="text-gray-600">Explore our collection of immersive virtual tours</p>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 w-5 h-5 text-gray-500" />
              <input
                type="text"
                placeholder="Search tours..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg bg-white border border-gray-200 text-gray-900 placeholder-gray-500 focus:outline-none focus:border-gray-400"
              />
            </div>
            <div className="flex items-center gap-2 p-2 rounded-lg bg-white border border-gray-200">
              <Filter className="w-5 h-5 text-gray-500" />
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="bg-transparent text-gray-900 focus:outline-none"
              >
                <option value="all">All Types</option>
                <option value="360_image">360° Images</option>
                <option value="3d_model">3D Models</option>
                <option value="360_video">360° Videos</option>
                <option value="embed">Embedded</option>
              </select>
            </div>
          </div>

          {/* Tours Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((tour) => (
              <Link key={tour.id} href={`/tour/${tour.id}`}>
                <div className="group rounded-lg border border-gray-200 overflow-hidden hover:border-gray-400 transition-all hover:shadow-lg hover:shadow-gray-400/20 cursor-pointer h-full flex flex-col bg-white/50">
                  <div className="relative aspect-video overflow-hidden bg-gray-100">
                    <img src={tour.image || "/placeholder.svg"} alt={tour.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                  </div>
                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-900 group-hover:text-gray-700 transition-colors mb-1">{tour.title}</h3>
                      <p className="text-sm text-gray-600">{tour.location}</p>
                    </div>
                    <div className="flex items-center justify-between text-xs text-gray-600">
                      <span>{tour.views.toLocaleString()} views</span>
                      <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-600">No tours found matching your search.</p>
            </div>
          )}
        </div>
      </div>
    </PageLayout>
  );
}