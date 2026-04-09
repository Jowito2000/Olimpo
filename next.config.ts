import type { NextConfig } from 'next';

const securityHeaders = [
  // Prevent clickjacking — only allow this site to iframe itself
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },

  // Block MIME-type sniffing
  { key: 'X-Content-Type-Options', value: 'nosniff' },

  // Referrer policy — send origin only on same-site, nothing cross-site
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },

  // Disable access to camera, microphone, geolocation
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },

  // Force HTTPS for 1 year (only meaningful in production with HTTPS)
  { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains' },

  // Content Security Policy
  // - default: only same origin
  // - scripts: same origin + inline (needed by Next.js runtime)
  // - styles: same origin + inline + Google Fonts
  // - fonts: same origin + Google Fonts CDN
  // - images: same origin + data URIs (used by D3 / inline SVGs)
  // - connect: same origin (API routes like /api/sugerencia)
  {
    key: 'Content-Security-Policy',
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data: blob:",
      "connect-src 'self'",
      "frame-ancestors 'self'",
    ]
      .join('; ')
      .trim(),
  },
];

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
