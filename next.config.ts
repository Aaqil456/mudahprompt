import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ['images.unsplash.com'], // ← allow Unsplash
  },
  eslint: {
    ignoreDuringBuilds: true, // ← add this line to disable linting on Vercel
  },
};

export default nextConfig;
