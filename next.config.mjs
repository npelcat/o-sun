import { createRequire } from "module";
const require = createRequire(import.meta.url);

const withMDX = require("@next/mdx")({
  extension: /\.mdx?$/,
});

const nextConfig = withMDX({
  pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],
  experimental: {
    appDir: true,
  },
  images: {
    domains: ["res.cloudinary.com"],
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "1337", // Spécifiez le port utilisé par Strapi
        pathname: "/uploads/**", // Autorisez uniquement les images dans le dossier /uploads
      },
    ],
  },
});

export default nextConfig;
