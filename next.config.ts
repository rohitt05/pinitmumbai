import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lqpeggadtuborolujbak.supabase.co',
      },
    ],
  },
};

export default nextConfig;
