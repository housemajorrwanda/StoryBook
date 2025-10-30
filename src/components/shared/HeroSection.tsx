import React from "react";
import Image from "next/image";
import Link from "next/link";
import { LuSearch, LuShare } from "react-icons/lu";

const HeroSection: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative min-h-screen overflow-hidden mt-20">
        <div className="absolute inset-8 rounded-4xl overflow-hidden">
          {/* Main Background Image */}
          <div className="absolute inset-0 bg-cover bg-center bg-no-repeat">
            <Image
              src="/images/Kwibuka.jpeg"
              alt="Kwibuka Memorial - Remembering the 1994 Genocide against the Tutsi"
              fill
              priority
              className="object-cover object-center duration-500"
              quality={90}
              sizes="100vw"
              placeholder="blur"
              blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R"
            />
          </div>

          {/* Optional Secondary Image Overlay for Depth */}
          <div className="absolute inset-0 opacity-20 mix-blend-overlay">
            <Image
              src="/images/_106339679_1465a159-179e-4eb0-bdf3-cd1da49a012e.jpg"
              alt=""
              fill
              className="object-cover object-center"
              quality={60}
              sizes="100vw"
            />
          </div>

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-black/20 to-black/50 z-10"></div>
        </div>

        {/* Content */}
        <div className="relative z-20 container mx-auto px-6 pt-32 pb-20">
          {/* Main Heading */}
          <div className="max-w-4xl mb-12">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight mb-6">
              Preserving Memory.
              <br />
              <span className="text-gray-200">Connecting Families.</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-200 max-w-2xl leading-relaxed">
              A digital archive dedicated to preserving testimonies from the
              1994 genocide against the Tutsi in Rwanda
            </p>
          </div>

          {/* Simple Stats */}
          <div className="flex flex-wrap gap-8 mb-16 text-white">
            <div className="text-center">
              <p className="text-2xl font-bold text-white">6,843</p>
              <p className="text-sm text-gray-300">Testimonies</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-white">3,299</p>
              <p className="text-sm text-gray-300">Families Reunited</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-white">12,847</p>
              <p className="text-sm text-gray-300">Documents</p>
            </div>
          </div>

          {/* Enhanced Search Section */}
          <div className="max-w-4xl mb-20">
            <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl overflow-hidden border border-white/20 hover:shadow-3xl transition-shadow duration-300">
              <div className="flex items-center">
                <div className="flex items-center pl-6 pr-4">
                  <LuSearch className="w-6 h-6 text-gray-500" />
                </div>
                <input
                  type="text"
                  placeholder="Search by name, location, date, or keywords..."
                  className="flex-1 py-6 px-4 text-lg text-gray-700 placeholder-gray-500 focus:outline-none bg-transparent focus:ring-0"
                />
                <button className="bg-black hover:bg-gray-800 text-white px-14 py-8 font-semibold transition-all duration-200 hover:shadow-lg cursor-pointer active:scale-95">
                  Search
                </button>
              </div>
            </div>
            <p className="text-gray-300 text-sm mt-4 text-center">
              Search through thousands of testimonies and documents to find your
              loved ones
            </p>
          </div>

          {/* Share Story Call-to-Action */}
          <div className="max-w-4xl mb-20 mx-auto">
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-8 text-center">
              <div className="mb-6">
                <LuShare className="w-12 h-12 text-white mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-white mb-3">
                  Have a Story to Share?
                </h3>
                <p className="text-gray-200 text-lg max-w-2xl mx-auto">
                  Your testimony matters. Help preserve history and connect
                  families by sharing your experiences from the 1994 genocide
                  against the Tutsi.
                </p>
              </div>
              <Link href="/share-testimony">
                <button className="inline-flex items-center gap-3 px-8 py-4 bg-white text-gray-900 font-semibold rounded-2xl hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
                  <LuShare className="w-5 h-5" />
                  Share Your Testimony
                </button>
              </Link>
            </div>
          </div>

          {/* Mission Cards with Images */}
          <div className="mb-20">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                Our Mission
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
                Three core pillars guide our commitment to preserving history
                and connecting lives
              </p>
            </div>

            <div className="max-w-7xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
                {/* Remember Card */}
                <div className="group relative">
                  <div className="bg-white/95 backdrop-blur-sm border border-white/20 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-500 h-80 hover:transform hover:-translate-y-2 overflow-hidden">
                    {/* Card Background Image */}
                    <div className="absolute inset-0 opacity-5 group-hover:opacity-10 transition-opacity duration-500">
                      <Image
                        src="/images/Visit-Rwanda-Flame-of-Remembrance-1920x1280.jpg"
                        alt=""
                        fill
                        className="object-cover"
                        quality={60}
                      />
                    </div>
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                      <div className="w-16 h-16 bg-gray-800 rounded-2xl flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform duration-300">
                        <svg
                          className="w-8 h-8 text-white"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M13.83,2.17C13.5,1.84 13,1.84 12.67,2.17L12.67,2.17L9.83,5.02C9.41,5.44 9,6.18 9,7V14C9,17.31 11.69,20 15,20C18.31,20 21,17.31 21,14V7C21,6.18 20.59,5.44 20.17,5.02L17.33,2.17C17,1.84 16.5,1.84 16.17,2.17L16.17,2.17L15.66,2.68C15.44,2.9 15.44,3.26 15.66,3.48C15.88,3.7 16.24,3.7 16.46,3.48L16.46,3.48L16.83,3.11L19.32,5.61C19.61,5.9 19.84,6.4 19.84,6.85V13.84C19.84,16.55 17.71,18.68 15,18.68C12.29,18.68 10.16,16.55 10.16,13.84V6.85C10.16,6.4 10.39,5.9 10.68,5.61L13.17,3.11L13.54,3.48C13.76,3.7 14.12,3.7 14.34,3.48C14.56,3.26 14.56,2.9 14.34,2.68L13.83,2.17Z" />
                        </svg>
                      </div>
                    </div>
                    <div className="relative z-5 pt-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-3 text-center">
                        Remember
                      </h3>
                      <p className="text-gray-600 leading-relaxed text-center text-sm">
                        Preserving precious memories and testimonies of those
                        affected by the genocide against the Tutsi, ensuring
                        their voices echo through generations.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Connect Card*/}
                <div className="group relative">
                  <div className="bg-white/98 backdrop-blur-sm border border-gray-300 rounded-3xl p-12 shadow-2xl hover:shadow-3xl transition-all duration-500 h-[420px] transform scale-105 hover:-translate-y-4 overflow-hidden">
                    {/* Card Background Image */}
                    <div className="absolute inset-0 opacity-5 group-hover:opacity-10 transition-opacity duration-500">
                      <Image
                        src="/images/Rwanda Komera #kwibuka31.jpeg"
                        alt=""
                        fill
                        className="object-cover"
                        quality={60}
                      />
                    </div>
                    <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 z-10">
                      <div className="w-24 h-24 bg-gray-800 rounded-3xl flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform duration-300">
                        <svg
                          className="w-12 h-12 text-white"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M3.9,12C3.9,10.29 5.29,8.9 7,8.9H11V7H7A5,5 0 0,0 2,12A5,5 0 0,0 7,17H11V15.1H7C5.29,15.1 3.9,13.71 3.9,12M8,13H16V11H8V13M17,7H13V8.9H17C18.71,8.9 20.1,10.29 20.1,12C20.1,13.71 18.71,15.1 17,15.1H13V17H17A5,5 0 0,0 22,12A5,5 0 0,0 17,7Z" />
                        </svg>
                      </div>
                    </div>
                    <div className="relative z-5 pt-10">
                      <h3 className="text-3xl font-bold text-gray-900 mb-6 text-center">
                        Connect
                      </h3>
                      <p className="text-gray-700 leading-relaxed text-center text-lg">
                        Leveraging cutting-edge AI technology to identify
                        meaningful connections between testimonies, reuniting
                        families separated by tragedy and revealing shared
                        experiences that bridge time and distance.
                      </p>
                      <div className="mt-6 text-center">
                        <div className="inline-flex items-center justify-center w-8 h-1 bg-black rounded-full"></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Preserve Card */}
                <div className="group relative">
                  <div className="bg-white/95 backdrop-blur-sm border border-white/20 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-500 h-80 hover:transform hover:-translate-y-2 overflow-hidden">
                    {/* Card Background Image */}
                    <div className="absolute inset-0 opacity-5 group-hover:opacity-10 transition-opacity duration-500">
                      <Image
                        src="/images/Urumuri Rutazima(never off light).jpeg"
                        alt=""
                        fill
                        className="object-cover"
                        quality={60}
                      />
                    </div>
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                      <div className="w-16 h-16 bg-gray-800 rounded-2xl flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform duration-300">
                        <svg
                          className="w-8 h-8 text-white"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M12,1L3,5V11C3,16.55 6.84,21.74 12,23C17.16,21.74 21,16.55 21,11V5L12,1M12,7C13.4,7 14.8,8.6 14.8,10V11.5C14.8,12.1 14.4,12.5 13.8,12.5H10.2C9.6,12.5 9.2,12.1 9.2,11.5V10C9.2,8.6 10.6,7 12,7M12,8.2C11.2,8.2 10.5,8.7 10.5,9.5V10.8H13.5V9.5C13.5,8.7 12.8,8.2 12,8.2Z" />
                        </svg>
                      </div>
                    </div>
                    <div className="relative z-5 pt-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-3 text-center">
                        Preserve
                      </h3>
                      <p className="text-gray-600 leading-relaxed text-center text-sm">
                        Utilizing advanced digital archival systems and AI
                        technology to ensure these crucial historical
                        testimonies are securely preserved for future
                        generations.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Image Gallery Preview */}
          <div className="max-w-7xl mx-auto mt-20">
            <div className="text-center mb-12">
              <h3 className="text-3xl font-bold text-white mb-4">
                Memory Archive
              </h3>
              <p className="text-gray-300 max-w-2xl mx-auto">
                Explore our collection of historical documents, photographs, and
                testimonies
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((item) => (
                <div
                  key={item}
                  className="relative aspect-square rounded-2xl overflow-hidden group"
                >
                  <Image
                    src={`/images/11994824-6897971-image-a-5_1554708520133.jpg`}
                    alt={`Archive image ${item}`}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                    quality={80}
                    sizes="(max-width: 768px) 50vw, 25vw"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
