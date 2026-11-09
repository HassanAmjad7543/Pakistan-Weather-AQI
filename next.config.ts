import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The OG image reads its fonts from disk at request time; make sure they ship with the function.
  outputFileTracingIncludes: {
    "/opengraph-image": ["./assets/fonts/**"],
  },
};

export default nextConfig;
