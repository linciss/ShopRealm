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
              process.env.NODE_ENV === 'development'
                ? `default-src 'self'; style-src 'self' 'unsafe-inline'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; connect-src 'self' ws: wss:; img-src 'self' data: https://i.imgur.com; font-src 'self' data:;`
                : `default-src 'self'; connect-src 'self' https://vercel.live https://vercel.com; img-src 'self' data: https://i.imgur.com https://vercel.com; script-src 'self' https://vercel.live 'strict-dynamic'; style-src 'self' 'unsafe-inline' https://vercel.com; font-src 'self' frame-src 'none';`,
          },
        ],
      },
    ];
  },
};

export default nextConfig;
