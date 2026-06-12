import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === "development";
const strapiUrl = process.env.NEXT_PUBLIC_API_URL ?? "";

const cspHeader = `
  default-src 'self';
  script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}
    https://va.vercel-scripts.com
    https://challenges.cloudflare.com
    https://accounts.google.com;
  style-src 'self' 'unsafe-inline';
  img-src 'self' blob: data:
    https://res.cloudinary.com
    ${strapiUrl}
    https://lh3.googleusercontent.com;
  connect-src 'self'
    ${strapiUrl}
    https://vitals.vercel-insights.com
    https://accounts.google.com
    https://*.supabase.co;
  frame-src 'self'
    https://challenges.cloudflare.com
    https://accounts.google.com;
  form-action 'self'
    https://accounts.google.com;
  font-src 'self';
  object-src 'none';
  base-uri 'self';
  frame-ancestors 'none';
  upgrade-insecure-requests;
`;

const nextConfig: NextConfig = {
  images: {
    qualities: [75, 85],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: new URL(strapiUrl).hostname,
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        pathname: "/**",
      },
    ],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Content-Security-Policy",
            value: cspHeader.replace(/\s{2,}/g, " ").trim(),
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
