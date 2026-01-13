import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { Link } from "@851-labs/ui/components/link"

import type { Doodle } from "@/db/schema"
import { DoodleImage } from "@/app/_components/doodle-image"
import { DoodleContent } from "@/app/doodles/[id]/_components/doodle-content"
import { fetchDoodleById, fetchSimilarDoodles } from "@/db/queries"
import { getDoodleOpenGraphImageUrl } from "@/utils/images"
import { DEFAULT_OG_IMAGE, METADATA } from "@/utils/metadata"
import { URLS } from "@/utils/urls"

function SimilarDoodleItem({ doodle }: { doodle: Doodle }) {
  if (!doodle.imageUrl) return null

  return (
    <Link
      href={URLS.doodle({ params: { id: doodle.id } })}
      className="relative flex aspect-square items-center justify-center overflow-hidden rounded-lg border border-gray-200 bg-white p-1 dark:border-gray-800 dark:bg-gray-900"
    >
      <DoodleImage src={doodle.imageUrl} alt={doodle.prompt} className="h-full w-full object-contain" />
    </Link>
  )
}

function SimilarDoodles({ doodles }: { doodles: Doodle[] }) {
  const validDoodles = doodles.filter((doodle) => doodle.imageUrl)

  if (validDoodles.length === 0) {
    return null
  }

  return (
    <div className="w-full px-4 pb-8">
      <div className="mx-auto max-w-4xl">
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6">
          {validDoodles.map((doodle) => (
            <SimilarDoodleItem key={doodle.id} doodle={doodle} />
          ))}
        </div>
      </div>
    </div>
  )
}

interface DoodlePageProps {
  params: Promise<{ id: string }>
}

async function DoodlePage({ params }: DoodlePageProps) {
  const { id } = await params

  const doodle = await fetchDoodleById(id)

  if (!doodle) {
    notFound()
  }

  const doodleUrl = `${URLS.prod}${URLS.doodle({ params: { id: doodle.id } })}`

  const similarDoodles = await fetchSimilarDoodles(id, doodle.prompt)

  return (
    <div className="flex min-h-[calc(100vh-var(--marketing-page-layout-header-height))] flex-col">
      <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 py-8">
        <DoodleContent initialDoodle={doodle} doodleUrl={doodleUrl} />
      </div>

      <SimilarDoodles doodles={similarDoodles} />
    </div>
  )
}

async function generateMetadata({ params }: DoodlePageProps): Promise<Metadata> {
  const { id } = await params

  const doodle = await fetchDoodleById(id)

  if (!doodle) {
    return {}
  }

  const title = `${doodle.prompt} Doodle | ${METADATA.title}`
  const description = `${doodle.prompt} doodle illustration created using AI. Share this fun stick-figure style doodle with friends.`
  const ogImage = doodle.imageUrl
    ? {
        url: getDoodleOpenGraphImageUrl(doodle.imageUrl),
        type: "image/jpeg" as const,
        width: 1200,
        height: 630,
      }
    : DEFAULT_OG_IMAGE

  return {
    title,
    description,
    alternates: {
      canonical: URLS.doodle({ params: { id: doodle.id } }),
    },
    openGraph: {
      title,
      description,
      images: [ogImage],
    },
    twitter: {
      title,
      description,
      images: [ogImage],
    },
  }
}

export { generateMetadata }
export default DoodlePage
