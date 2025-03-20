import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'i.imgur.com',
        port: '',
      },
    ],
  },
  // for security emasures since im gonna send html to backend
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value:
              "default-src 'self'; style-src 'self' 'unsafe-inline'; script-src 'self'",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
