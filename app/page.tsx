import Link from 'next/link';

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

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-red-50 to-red-100 pt-1 pb-30 rounded-3xl my-25 mx-25">
        {/* Background Pattern Overlay */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            backgroundRepeat: 'repeat'
          }}></div>
        </div>
        
        <div className="container mx-auto px-50 text-center">
          {/* Words Section */}
          <div className="mb-16">
            <h1 className="text-6xl md:text-8xl font-bold text-gray-900 mb-8 leading-tight">
              <span className="block">Preserving Memory.</span>
              <span className="block">Connecting Families.</span>
            </h1>
            <p className="text-2xl text-gray-700 mb-12 max-w-4xl mx-auto leading-relaxed">
              A digital archive dedicated to preserving testimonies from the 1994 genocide against the Tutsi in Rwanda
            </p>
            
            {/* Statistics */}
            <div className="flex flex-wrap justify-center gap-12 mb-16 text-gray-600">
              <div className="flex items-center">
                <span className="text-4xl font-bold text-gray-800">8,432+</span>
                <span className="ml-3 text-xl">Testimonies</span>
              </div>
              <div className="hidden sm:block w-px h-10 bg-gray-400"></div>
              <div className="flex items-center">
                <span className="text-4xl font-bold text-gray-800">3,289</span>
                <span className="ml-3 text-xl">Families Reunited</span>
              </div>
              <div className="hidden sm:block w-px h-10 bg-gray-400"></div>
              <div className="flex items-center">
                <span className="text-4xl font-bold text-gray-800">12,847</span>
                <span className="ml-3 text-xl">AI Connections</span>
              </div>
            </div>
          </div>

          {/* Search Section */}
          <div className="max-w-2xl mx-auto mb-16">
            <div className="flex bg-white rounded-xl shadow-lg p-2">
              <div className="flex-1 flex items-center px-4">
                <svg className="w-5 h-5 text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Search testimonies by name, location, date..."
                  className="flex-1 outline-none text-gray-700 placeholder-gray-400"
                />
              </div>
              <button className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                Search
              </button>
            </div>
          </div>

          {/* Our Mission Section */}
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-gray-200 shadow-lg">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h2>
            <p className="text-sm text-gray-600 mb-6 max-w-3xl mx-auto">
              The Kwibuka Archive serves as a living memorial to preserve testimonies and reconnect families through advanced AI technology
            </p>
            
            {/* Feature Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
                <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                  <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Remember</h3>
                <p className="text-gray-600 text-xs leading-relaxed">
                  Honor the memory of over one million lives lost and preserve their stories for generations to come
                </p>
              </div>
              
              <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
                <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                  <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Connect</h3>
                <p className="text-gray-600 text-xs leading-relaxed">
                  Reunite families through AI-powered analysis that identifies connections between testimonies
                </p>
              </div>
              
              <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
                <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                  <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Preserve</h3>
                <p className="text-gray-600 text-xs leading-relaxed">
                  Create a permanent digital archive ensuring these crucial testimonies are never forgotten
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* Testimonies Section */}
      <section id="stories" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-12">Family Stories</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Testimony Card 1 */}
            <div className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-shadow">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                      <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <span className="text-sm font-medium text-gray-600">Video</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                    </svg>
                    <span>5</span>
                  </div>
                </div>
                
                <h3 className="text-lg font-bold text-gray-900 mb-3">Looking for My Brother in Nyanza</h3>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span>Marie Uwimana</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span>Last seen: April 1994</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span>Nyanza District</span>
                  </div>
                </div>
                
                <p className="text-gray-600 text-sm mb-4">
                  I lost my brother Jean-Paul during the conflict. He was 25 years old, tall, and had a scar on his left hand. We were separated when we fled to the marshes. If anyone knows his whereabouts...
                </p>
                
                <button className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors flex items-center justify-center">
                  <span>Read Full Story</span>
                  <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Testimony Card 2 */}
            <div className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-shadow">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                      <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                      </svg>
                    </div>
                    <span className="text-sm font-medium text-gray-600">Audio</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                    </svg>
                    <span>3</span>
                  </div>
                </div>
                
                <h3 className="text-lg font-bold text-gray-900 mb-3">Searching for My Sister</h3>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span>Jean-Paul Habimana</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span>Last seen: April 1994</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span>Gikongoro</span>
                  </div>
                </div>
                
                <p className="text-gray-600 text-sm mb-4">
                  My sister Marie was 22 when we were separated. She had long braids and was wearing a blue dress. We lost contact during the conflict. If you know anything about her...
                </p>
                
                <button className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors flex items-center justify-center">
                  <span>Read Full Story</span>
                  <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Testimony Card 3 */}
            <div className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-shadow">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                      <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <span className="text-sm font-medium text-gray-600">Text</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                    </svg>
                    <span>12</span>
                  </div>
                </div>
                
                <h3 className="text-lg font-bold text-gray-900 mb-3">Looking for My Parents</h3>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span>Anonymous Survivor</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span>Last seen: April 1994</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span>Kibuye District</span>
                  </div>
                </div>
                
                <p className="text-gray-600 text-sm mb-4">
                  I was only 8 years old when I lost my parents. My father was a teacher and my mother was a nurse. They told me to hide and never come back. I need to find them...
                </p>
                
                <button className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors flex items-center justify-center">
                  <span>Read Full Story</span>
                  <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Research & Support Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* For Researchers Card */}
            <div className="bg-gray-50 rounded-xl p-8 text-center hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">For Researchers?</h3>
              <p className="text-gray-600 mb-6">
                Access our comprehensive digital archive for academic research, documentation, and education purposes. Contribute to preserving history through scholarly work.
              </p>
              <button className="bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-300 transition-colors">
                Research Access Portal
              </button>
            </div>

            {/* Need Support Card */}
            <div className="bg-gray-50 rounded-xl p-8 text-center hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-red-100 rounded-xl flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Need Support?</h3>
              <p className="text-gray-600 mb-6">
                Sharing testimonies can be emotionally challenging. We provide resources and support for survivors and families, including counseling and trauma resources.
              </p>
              <button className="bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-300 transition-colors">
                Access Support Resources
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Company Info */}
            <div className="col-span-1 md:col-span-1">
              <h3 className="text-2xl font-bold mb-4">HouseMajor</h3>
              <p className="text-gray-400 mb-6">
                Preserving the memory of important events and connecting families through shared experiences, testimonies, and stories that must never be forgotten.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li><Link href="#stories" className="text-gray-400 hover:text-white transition-colors">Browse</Link></li>
                <li><Link href="#connections" className="text-gray-400 hover:text-white transition-colors">Find Connection</Link></li>
                <li><Link href="#archive" className="text-gray-400 hover:text-white transition-colors">Archive</Link></li>
                <li><Link href="#education" className="text-gray-400 hover:text-white transition-colors">Education</Link></li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h4 className="text-lg font-semibold mb-4">Support</h4>
              <ul className="space-y-2">
                <li><Link href="#" className="text-gray-400 hover:text-white transition-colors">Trauma Resources</Link></li>
                <li><Link href="#" className="text-gray-400 hover:text-white transition-colors">FAQ</Link></li>
                <li><Link href="#" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</Link></li>
                <li><Link href="#" className="text-gray-400 hover:text-white transition-colors">Contact Us</Link></li>
              </ul>
            </div>

            {/* Partners */}
            <div>
              <h4 className="text-lg font-semibold mb-4">Partners</h4>
              <ul className="space-y-2">
                <li><Link href="#" className="text-gray-400 hover:text-white transition-colors">Memorial Organizations</Link></li>
                <li><Link href="#" className="text-gray-400 hover:text-white transition-colors">Research Institutions</Link></li>
                <li><Link href="#" className="text-gray-400 hover:text-white transition-colors">Support Groups</Link></li>
                <li><Link href="#" className="text-gray-400 hover:text-white transition-colors">Educational Partners</Link></li>
              </ul>
            </div>
          </div>

          {/* Bottom Copyright */}
          <div className="border-t border-gray-800 mt-12 pt-8 text-center">
            <p className="text-gray-400">
              © 2025 HouseMajor. All rights reserved. | In memory of those whose stories we preserve and families we help connect.
            </p>
          </div>
        </div>
      </footer>
 </div>
  );
}
