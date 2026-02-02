import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
