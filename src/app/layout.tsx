import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"

import { Link } from "@851-labs/ui/components/link"
import { MarketingPageLayoutMain } from "@851-labs/ui/marketing/marketing-page-layout-main"
import { MarketingPageLayoutNavigationHeader } from "@851-labs/ui/marketing/marketing-page-layout-navigation-header"

import { NavbarAuth } from "@/app/_components/navbar-auth"
import { Providers } from "@/app/_components/providers"
import { METADATA } from "@/utils/metadata"
import { URLS } from "@/utils/urls"

import "@/app/globals.css"

const INTER = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
})

const metadata: Metadata = {
  metadataBase: new URL(URLS.prod),
  applicationName: METADATA.title,
  title: METADATA.title,
  description: METADATA.description,
  alternates: {
    canonical: "./",
  },
  openGraph: {
    siteName: METADATA.openGraph.siteName,
    title: METADATA.title,
    description: METADATA.description,
    url: URLS.prod,
    locale: METADATA.openGraph.locale,
    type: METADATA.openGraph.type,
    images: METADATA.openGraph.images,
  },
  twitter: {
    title: METADATA.title,
    description: METADATA.description,
    card: METADATA.twitter.card,
    creator: METADATA.twitter.creator,
    images: METADATA.twitter.images,
  },
  icons: METADATA.icons,
}

const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: true,
  viewportFit: "cover",
}

function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={INTER.variable}>
      <body>
        <Providers>
          <MarketingPageLayoutNavigationHeader>
            <MarketingPageLayoutNavigationHeader.LeadingGroup>
              <Link
                href={URLS.home}
                className="flex w-fit flex-row items-center justify-center rounded-xl text-[17px] leading-none font-semibold select-none"
              >
                <span className="mt-px">Doodles</span>
              </Link>
            </MarketingPageLayoutNavigationHeader.LeadingGroup>
            <MarketingPageLayoutNavigationHeader.TrailingGroup desktop={<NavbarAuth />} mobile={<NavbarAuth />} />
          </MarketingPageLayoutNavigationHeader>

          <MarketingPageLayoutMain>{children}</MarketingPageLayoutMain>
        </Providers>
      </body>
    </html>
  )
}

export { metadata, viewport }
export default RootLayout
