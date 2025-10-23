'use client';

import Link from 'next/link';
import { useState } from 'react';
import { UnderDevelopment } from '@/components/shared';

export default function Home() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  return (
    <div className="min-h-screen bg-white">
      {/* Fixed Banner Text - Always visible */}
      <div className="fixed top-3 w-full left-0 z-50 px-4">
        <div className="bg-white/10 border border-white/20 backdrop-blur-sm rounded-full px-4 py-1 shadow-lg mx-auto w-fit">
          <p className="text-xs text-gray-700 font-medium">Kwibuka • Remember • Preserve • Connect</p>
        </div>
      </div>

      {/* Scrollable Header Navigation */}
      <header className="sticky top-12 w-full left-0 z-40 px-8 mb-4">
        <div className="container mx-auto px-4 h-12 flex items-center justify-between bg-white/10 border border-white/20 text-xs text-gray-800 rounded-full backdrop-blur-sm shadow-lg">
          {/* Logo Section */}
          <Link href="/" className="flex items-center gap-1 hover:opacity-80 transition-opacity">
            <div className="w-6 h-6 bg-gray-800 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-xs">H</span>
            </div>
            <span className="text-sm font-semibold">HTFC</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-2">
            <Link href="#stories">
              <button className="inline-flex items-center hover:text-gray-600 hover:cursor-pointer transform hover:scale-105 gap-1 px-3 py-1.5 rounded-full bg-white/10 border border-white/20 text-xs text-gray-800 backdrop-blur-sm transition-all">
                Browse
              </button>
            </Link>

            <Link href="#connections">
              <button className="inline-flex items-center hover:text-gray-600 hover:cursor-pointer transform hover:scale-105 gap-1 px-3 py-1.5 rounded-full bg-white/10 border border-white/20 text-xs text-gray-800 backdrop-blur-sm transition-all">
                Find Connection
              </button>
            </Link>

            <Link href="#archive">
              <button className="inline-flex items-center hover:text-gray-600 hover:cursor-pointer transform hover:scale-105 gap-1 px-3 py-1.5 rounded-full bg-white/10 border border-white/20 text-xs text-gray-800 backdrop-blur-sm transition-all">
                Archive
              </button>
            </Link>

            <Link href="#education">
              <button className="inline-flex items-center hover:text-gray-600 hover:cursor-pointer transform hover:scale-105 gap-1 px-3 py-1.5 rounded-full bg-white/10 border border-white/20 text-xs text-gray-800 backdrop-blur-sm transition-all">
                Education
              </button>
            </Link>

            <button className="inline-flex items-center hover:text-white hover:cursor-pointer transform hover:scale-105 gap-1 px-3 py-1.5 rounded-full bg-gray-800 border border-gray-800 text-xs text-white backdrop-blur-sm transition-all">
              <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
              </svg>
              Share Story
            </button>

            <Link href="/login">
              <button className="inline-flex items-center hover:text-gray-600 hover:cursor-pointer transform hover:scale-105 gap-1 px-3 py-1.5 rounded-full bg-white/10 border border-white/20 text-xs text-gray-800 backdrop-blur-sm transition-all">
                Sign in
              </button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-1 hover:bg-white/20 rounded-full transition-colors"
            aria-label="Toggle menu"
          >
            <svg className="h-5 w-5 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </header>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed top-16 left-4 right-4 z-30 bg-white/95 backdrop-blur-sm border border-white/20 rounded-2xl shadow-lg">
          <div className="p-4 space-y-2">
            <Link href="#stories" onClick={() => setIsMobileMenuOpen(false)}>
              <button className="w-full text-left px-3 py-2 text-sm text-gray-800 hover:bg-gray-100 rounded-lg transition-colors">
                Browse
              </button>
            </Link>
            <Link href="#connections" onClick={() => setIsMobileMenuOpen(false)}>
              <button className="w-full text-left px-3 py-2 text-sm text-gray-800 hover:bg-gray-100 rounded-lg transition-colors">
                Find Connection
              </button>
            </Link>
            <Link href="#archive" onClick={() => setIsMobileMenuOpen(false)}>
              <button className="w-full text-left px-3 py-2 text-sm text-gray-800 hover:bg-gray-100 rounded-lg transition-colors">
                Archive
              </button>
            </Link>
            <Link href="#education" onClick={() => setIsMobileMenuOpen(false)}>
              <button className="w-full text-left px-3 py-2 text-sm text-gray-800 hover:bg-gray-100 rounded-lg transition-colors">
                Education
              </button>
            </Link>
            <button className="w-full text-left px-3 py-2 text-sm text-gray-800 hover:bg-gray-100 rounded-lg transition-colors">
              Share Story
            </button>
            <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
              <button className="w-full text-left px-3 py-2 text-sm text-gray-800 hover:bg-gray-100 rounded-lg transition-colors">
                Sign in
              </button>
            </Link>
          </div>
        </div>
      )}

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black/20 z-20"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

          {/* Main Content Section */}
          <UnderDevelopment 
            title="Welcome to StoryBook"
            subtitle="This page is under development"
            className='mt-50'
          />
 </div>
  );
}
