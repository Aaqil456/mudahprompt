import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ['images.unsplash.com'], // ← allow Unsplash
  },
};

export default nextConfig;
