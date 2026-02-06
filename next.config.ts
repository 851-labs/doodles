import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  typescript: { ignoreBuildErrors: true },
  images: {
    loader: "custom",
    loaderFile: "./src/utils/images/imgproxy-loader.ts",
  },
}

export default nextConfig
