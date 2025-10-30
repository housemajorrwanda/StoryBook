import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Configure allowed image quality values used in your components
    qualities: [60, 70, 75, 80, 90, 100],
    // Optional: Configure allowed domains if you use external images
    // domains: ['example.com'],
  },
};

export default nextConfig;
