import type { ImageLoaderProps } from "next/image"
import { generateImageInfoUrl, generateImageUrl } from "@imgproxy/imgproxy-node"

import type { Options, OptionsImageInfo } from "@imgproxy/imgproxy-js-core"

const IMGPROXY_URL = "https://imgproxy.attic.sh"

function createImgproxyUrl({ src, options }: { src: string; options: Options }): string {
  return generateImageUrl({
    endpoint: IMGPROXY_URL,
    url: {
      value: src,
      displayAs: "plain",
    },
    options,
  })
}

function createImgproxyInfoUrl({ src, options }: { src: string; options?: OptionsImageInfo }): string {
  return generateImageInfoUrl({
    endpoint: IMGPROXY_URL,
    url: {
      value: src,
      displayAs: "plain",
    },
    options,
  })
}

function imgproxyLoader({ src, width, quality }: ImageLoaderProps): string {
  return createImgproxyUrl({
    src,
    options: {
      width,
      quality: quality ?? 90,
      format: "webp",
    },
  })
}

export { createImgproxyUrl, createImgproxyInfoUrl, imgproxyLoader }
