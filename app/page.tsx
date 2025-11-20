import { HeroSection } from "@/components/shared";
import TestimoniesGrid from "@/components/testimonies/TestimoniesGrid";
import PageLayout from "@/layout/PageLayout";
import React from "react";

const Home = () => {
  return (
    <PageLayout showBackgroundEffects={true} variant="default">
      {/* Main Content Section */}
      <HeroSection />

      {/* Published Testimonies Section */}
      <section 
        id="testimonies" 
        className="relative z-10 scroll-mt-24 sm:scroll-mt-28 md:scroll-mt-32"
      >
        <div className="container mx-auto px-2 sm:px-4 lg:px-6 py-12 md:py-14 bg-[#fafafa]">
          <div className="mb-6 sm:mb-10 md:mb-12">
            <h2 className="text-xl sm:text-xl md:text-3xl font-extrabold tracking-tight text-gray-900">
              Testimonies
            </h2>
            <p className="mt-2 text-xs md:text-sm text-gray-600 max-w-2xl">
              Discover powerful stories of resilience, courage, and remembrance
              shared by our community.
            </p>
          </div>

          <TestimoniesGrid limit={9} showHeader={false} showFilters={true} />
        </div>
      </section>
    </PageLayout>
  );
};

export default Home;
