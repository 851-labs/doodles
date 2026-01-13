import type { Metadata } from "next"

import { createImgproxyUrl } from "@851-labs/utils/imgproxy"

import { ENV } from "./env"

const DEFAULT_OG_IMAGE = {
  url: "https://attic.sh/_static/doodles/opengraph/og-1200x630.png",
  type: "image/png",
  width: 1200,
  height: 630,
}

const LOGO_PRECOMPOSED =
  ENV.NODE_ENV === "development"
    ? "https://attic.sh/_static/doodles/opengraph/logo-development-1024x1024-precomposed.png"
    : "https://attic.sh/_static/doodles/opengraph/logo-1024x1024-precomposed.png"

const FAVICON = {
  32: createImgproxyUrl({ src: LOGO_PRECOMPOSED, options: { width: 32, height: 32, format: "png" } }),
  64: createImgproxyUrl({ src: LOGO_PRECOMPOSED, options: { width: 64, height: 64, format: "png" } }),
  96: createImgproxyUrl({ src: LOGO_PRECOMPOSED, options: { width: 96, height: 96, format: "png" } }),
}

const APPLE_TOUCH_ICON_PRECOMPOSED = {
  120: createImgproxyUrl({ src: LOGO_PRECOMPOSED, options: { width: 120, height: 120, format: "png" } }),
  152: createImgproxyUrl({ src: LOGO_PRECOMPOSED, options: { width: 152, height: 152, format: "png" } }),
  167: createImgproxyUrl({ src: LOGO_PRECOMPOSED, options: { width: 167, height: 167, format: "png" } }),
  180: createImgproxyUrl({ src: LOGO_PRECOMPOSED, options: { width: 180, height: 180, format: "png" } }),
}

const METADATA = {
  title: "AI Doodle Generator",
  description: "Generate beautiful stick-figure doodle illustrations with AI",
  openGraph: {
    siteName: "AI Doodle Generator",
    locale: "en_US",
    images: [DEFAULT_OG_IMAGE],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    creator: "@lightbox_sh",
    images: [DEFAULT_OG_IMAGE],
  },
  icons: {
    icon: FAVICON[32],
  },
} satisfies Metadata

export { LOGO_PRECOMPOSED, FAVICON, APPLE_TOUCH_ICON_PRECOMPOSED, METADATA, DEFAULT_OG_IMAGE }
