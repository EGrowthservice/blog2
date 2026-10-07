import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 2678400, // 31 days cache
    remotePatterns: [
      { protocol: "https", hostname: "**" },
      { protocol: "http", hostname: "**" },
    ],
  },
  compress: true,
  async redirects() {
    return [
      {
        source: '/blog/:slug*',
        destination: '/article/:slug*',
        permanent: true,
      },
      {
        source: '/category/sports',
        destination: '/category/sport',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
