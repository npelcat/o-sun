import { createRequire } from "module";

const require = createRequire(import.meta.url);
const withMDX = require("@next/mdx")({
  extension: /\.mdx?$/,
});

const nextConfig = withMDX({
  pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "1337",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "annual-bessie-nadcat-17feb7ed.koyeb.app",
        pathname: "/**",
      },
    ],
  },

  // En-têtes de sécurité HTTP
  async headers() {
    return [
      {
        // Applique à toutes les routes
        source: "/:path*",
        headers: [
          {
            // Protection contre le clickjacking
            // Empêche l'intégration du site dans une iframe
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            // Empêche le MIME sniffing
            // Force le navigateur à respecter le Content-Type déclaré
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            // Limite les informations envoyées dans le header Referer
            // Envoie uniquement l'origine (pas l'URL complète) vers d'autres sites
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            // Désactive l'accès aux APIs sensibles du navigateur
            // Camera, micro, géolocalisation non nécessaires pour le site
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
    ];
  },
});

export default nextConfig;
