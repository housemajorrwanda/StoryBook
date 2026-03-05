"use client";

import EducationFilters from "@/components/education/education-filters";
import EducationGrid from "@/components/education/education-grid";
import EducationHeader from "@/components/education/education-header";
import PageLayout from "@/layout/PageLayout";
import { Search, X } from "lucide-react";
import { useState } from "react";

export default function EducationPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [contentType, setContentType] = useState<string>("all");

  const handleClearFilters = () => {
    setSelectedCategory("all");
    setContentType("all");
    setSearchQuery("");
  };

  return (
    <PageLayout showBackgroundEffects={true} variant="default">
      <div className="min-h-screen bg-[#fafafa]">
        <EducationHeader />

        {/* Sticky toolbar */}
        <div
          id="content"
          className="sticky top-0 z-40 bg-white/90 backdrop-blur border-b border-gray-100"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-col gap-3">
            {/* Search */}
            <div className="relative max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search content…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-8 py-2 text-sm rounded-xl border border-gray-200 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-600 transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Filters */}
            <EducationFilters
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              contentType={contentType}
              setContentType={setContentType}
            />
          </div>
        </div>

        {/* Content */}
        <EducationGrid
          category={selectedCategory}
          contentType={contentType}
          searchQuery={searchQuery}
          onClearFilters={handleClearFilters}
        />
      </div>
    </PageLayout>
  );
}
