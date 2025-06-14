import { createRequire } from "module";
const require = createRequire(import.meta.url);

const withMDX = require("@next/mdx")({
  extension: /\.mdx?$/,
});

const nextConfig = withMDX({
  pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],
  images: {
    domains: [
      "res.cloudinary.com",
      "localhost",
      "annual-bessie-nadcat-17feb7ed.koyeb.app",
    ],
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "1337",
        pathname: "/**",
      },
    ],
  },
});

export default nextConfig;
