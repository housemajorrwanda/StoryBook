import Link from 'next/link';
import { UnderDevelopment } from '@/components/shared';

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Fixed Banner Text - Always visible */}
      <div className="fixed top-4 w-full left-0 z-50 px-8">
        <div className="bg-white/10 border border-white/20 backdrop-blur-sm rounded-full px-6 py-2 shadow-lg mx-auto w-fit">
          <p className="text-sm text-gray-700 font-medium">Kwibuka • Remember • Preserve • Connect</p>
        </div>
      </div>

      {/* Scrollable Header Navigation */}
      <header className="sticky top-20 w-full left-0 z-40 px-8 mb-6">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between bg-white/10 border border-white/20 text-sm text-gray-800 rounded-full backdrop-blur-sm shadow-lg">
          {/* Logo Section */}
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">H</span>
            </div>
            <span className="text-lg sm:text-xl font-semibold">HTFC</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-3">
            <Link href="#stories">
              <button className="inline-flex items-center hover:text-gray-600 hover:cursor-pointer transform hover:scale-105 gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-sm text-gray-800 backdrop-blur-sm transition-all">
                Browse
              </button>
            </Link>

            <Link href="#connections">
              <button className="inline-flex items-center hover:text-gray-600 hover:cursor-pointer transform hover:scale-105 gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-sm text-gray-800 backdrop-blur-sm transition-all">
                Find Connection
              </button>
            </Link>

            <Link href="#archive">
              <button className="inline-flex items-center hover:text-gray-600 hover:cursor-pointer transform hover:scale-105 gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-sm text-gray-800 backdrop-blur-sm transition-all">
                Archive
              </button>
            </Link>

            <Link href="#education">
              <button className="inline-flex items-center hover:text-gray-600 hover:cursor-pointer transform hover:scale-105 gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-sm text-gray-800 backdrop-blur-sm transition-all">
                Education
              </button>
            </Link>

            <button className="inline-flex items-center hover:text-white hover:cursor-pointer transform hover:scale-105 gap-2 px-4 py-2 rounded-full bg-gray-800 border border-gray-800 text-sm text-white backdrop-blur-sm transition-all">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
              </svg>
              Share Story
            </button>

            <Link href="/login">
              <button className="inline-flex items-center hover:text-gray-600 hover:cursor-pointer transform hover:scale-105 gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-sm text-gray-800 backdrop-blur-sm transition-all">
                Sign in
              </button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 hover:bg-white/20 rounded-full transition-colors"
            aria-label="Toggle menu"
          >
            <svg className="h-6 w-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </header>

          {/* Main Content Section */}
          <UnderDevelopment 
            title="Welcome to StoryBook"
            subtitle="This page is under development"
          />
 </div>
  );
}
