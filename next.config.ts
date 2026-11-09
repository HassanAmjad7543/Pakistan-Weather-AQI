import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The OG images read their fonts from disk at request time; make sure they ship with the functions.
  outputFileTracingIncludes: {
    "/opengraph-image": ["./assets/fonts/**"],
    "/city/[slug]/opengraph-image": ["./assets/fonts/**"],
  },
};

export default nextConfig;
