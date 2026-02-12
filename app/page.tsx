import { HeroSection } from "@/components/shared";
import TestimoniesGrid from "@/components/testimonies/TestimoniesGrid";
import TestimoniesSidebar from "@/components/testimonies/TestimoniesSidebar";
import PageLayout from "@/layout/PageLayout";
import React from "react";

const Home = () => {
  return (
    <PageLayout showBackgroundEffects={true} variant="default">
      <HeroSection />
      <section
        id="testimonies"
        className="relative scroll-mt-16 md:scroll-mt-20"
      >
        <div className="container mx-auto px-6 sm:px-8 lg:px-16 py-16 md:py-20 bg-[#fafafa]">
          <div className="mb-10 md:mb-14">
            <p className="text-sm font-semibold tracking-[0.15em] uppercase text-gray-400 mb-3">
              Stories
            </p>
            <h2 className="text-3xl md:text-4xl font-black tracking-tight text-gray-900">
              Testimonies
            </h2>
            <p className="mt-3 text-sm text-gray-500 max-w-xl">
              Discover powerful stories of resilience, courage, and remembrance
              shared by our community.
            </p>
          </div>

          <div className="flex gap-12 lg:gap-16 items-start">
            {/* Stories feed */}
            <div className="flex-1 min-w-0 max-w-3xl">
              <TestimoniesGrid
                limit={9}
                showHeader={false}
                showFilters={true}
              />
            </div>

            {/* Sidebar — sticky, full height, follows scroll */}
            <aside className="hidden lg:block w-72 xl:w-80 shrink-0 sticky top-24 self-start">
              <TestimoniesSidebar />
            </aside>
          </div>
        </div>
      </section>
    </PageLayout>
  );
};

export default Home;
