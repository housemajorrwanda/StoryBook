"use client";

import EducationFilters from "@/components/education/education-filters";
import EducationGrid from "@/components/education/education-grid";
import EducationHeader from "@/components/education/education-header";
import PageLayout from "@/layout/PageLayout";
import { Search } from "lucide-react";
import { useState } from "react";

export default function EducationPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [contentType, setContentType] = useState<string>("all");

  // Clear all filters
  const handleClearFilters = () => {
    setSelectedCategory("all");
    setContentType("all");
    setSearchQuery("");
  };

  return (
    <PageLayout showBackgroundEffects={true} variant="default">
      <div className="min-h-screen bg-[#fafafa]">
        <EducationHeader />

        {/* Search and Filters */}
        <div className="sticky top-0 z-40 bg-background/80 backdrop-blur supports-backdrop-filter:bg-background/60 border-b border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex flex-col gap-4">
              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-black" />
                <input
                  type="text"
                  placeholder="Search educational content..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-input bg-background text-slate-600 placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
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
        </div>

        {/* Content Grid */}
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
