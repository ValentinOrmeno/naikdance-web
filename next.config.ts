import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Reduce JS no utilizado: tree-shake lucide-react y react-icons (apoya a los defaults de Next)
  experimental: {
    optimizePackageImports: ['lucide-react', 'react-icons/fa', 'react-icons/si'],
  },
  images: {
    // Tamaños intermedios para que no se sirva 640px cuando se muestran ~400px (ahorro ~154 KiB)
    deviceSizes: [256, 384, 448, 640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'scontent.cdninstagram.com',
      },
      {
        protocol: 'https',
        hostname: 'scontent-*.cdninstagram.com',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          // Seguridad: Prevenir XSS
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          // Seguridad: Prevenir clickjacking
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          // Seguridad: XSS Protection
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          // Seguridad: Referrer Policy
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          // Seguridad: Permissions Policy
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
