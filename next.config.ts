import type { NextConfig } from "next";
import createMDX from "@next/mdx";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  pageExtensions: ["ts", "tsx", "mdx"],
  images: {
    formats: ["image/avif", "image/webp"],
  },
  async redirects() {
    return [
      { source: "/services/childrens-dentistry", destination: "/services/paediatric-dentistry", permanent: true },
      { source: "/sw/services/childrens-dentistry", destination: "/sw/services/paediatric-dentistry", permanent: true },
      { source: "/your-visit", destination: "/what-to-expect", permanent: true },
      { source: "/sw/your-visit", destination: "/sw/what-to-expect", permanent: true },
      { source: "/visit-us", destination: "/contact", permanent: true },
      { source: "/sw/visit-us", destination: "/sw/contact", permanent: true },
    ];
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

const withMDX = createMDX({});

export default withMDX(nextConfig);
