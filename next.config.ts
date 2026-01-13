import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  transpilePackages: ["@851-labs/query", "@851-labs/ui", "@851-labs/utils"],
  typescript: { ignoreBuildErrors: true },
  images: {
    loader: "custom",
    loaderFile: "./src/utils/images/imgproxy-loader.ts",
  },
}

export default nextConfig
