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
});

export default nextConfig;
