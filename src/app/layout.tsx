import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"

import { Link } from "@/components/ui/link"

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
          <header className="bg-material-md sticky top-0 z-40 flex h-[var(--marketing-page-layout-header-height)] items-center border-b px-4">
            <div className="mx-auto flex w-full max-w-7xl items-center justify-between">
              <div className="flex items-center">
                <Link
                  href={URLS.home}
                  className="flex w-fit flex-row items-center justify-center rounded-xl text-[17px] leading-none font-semibold select-none"
                >
                  <span className="mt-px">Doodles</span>
                </Link>
              </div>
              <div className="flex items-center">
                <NavbarAuth />
              </div>
            </div>
          </header>

          <main className="relative isolate flex min-h-[calc(100svh-var(--marketing-page-layout-header-height))] flex-1 flex-col">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  )
}

export { metadata, viewport }
export default RootLayout
