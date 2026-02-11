"use client";

import Image from "next/image";

function getYearsOfRemembrance(): number {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;
  const day = now.getDate();
  // Before April 7th, the anniversary hasn't happened yet this year
  if (month < 4 || (month === 4 && day < 7)) {
    return year - 1994 - 1;
  }
  return year - 1994;
}

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const years = getYearsOfRemembrance();

  return (
    <div className="min-h-screen flex bg-[#0a0a0a]">
      {/* Left Side - Full Bleed Image */}
      <div className="hidden lg:block lg:w-[55%] relative">
        <Image
          src="/images/Visit-Rwanda-Flame-of-Remembrance-1920x1280.jpg"
          alt="Rwanda Remembrance"
          fill
          className="object-cover"
          priority
          sizes="55vw"
        />
        {/* Overall dark overlay */}
        <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/30 to-black/10" />

        {/* Right edge dark shadow that fades into the dark form side */}
        <div className="absolute inset-y-0 right-0 w-48 bg-linear-to-l from-[#0a0a0a] via-[#0a0a0a]/70 to-transparent z-10" />

        {/* Content Overlay */}
        <div className="absolute inset-0 flex flex-col justify-end p-12 pb-16 text-white z-20">
          <div className="max-w-lg space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 bg-white/15 backdrop-blur-sm rounded-full flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-white"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div>
                <h2 className="text-3xl font-bold leading-tight">
                  {years} Years
                </h2>
                <p className="text-sm text-white/80">Of Remembrance</p>
              </div>
            </div>

            <p className="text-white/75 leading-relaxed text-base">
              From tragedy to healing, from silence to testimony, from
              separation to reunion. Join us in preserving history for future
              generations.
            </p>

            <div className="flex items-center gap-2 pt-1">
              <div className="h-px w-12 bg-white/40" />
              <span className="text-xs text-white/50 uppercase tracking-wider">
                Kwibuka
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Form Area (dark) */}
      <div className="w-full lg:w-[45%] flex items-center justify-center px-6 py-10 lg:px-16 bg-[#0a0a0a] relative">
        <div className="w-full max-w-md">{children}</div>
      </div>
    </div>
  );
}
