"use client"

import React, { useCallback, useEffect, useMemo, useRef } from "react"

import { Link } from "@851-labs/ui/components/link"
import { Spinner } from "@851-labs/ui/components/spinner"

import type { Doodle } from "@/db/schema"
import { DoodleImage } from "@/app/_components/doodle-image"
import { useDoodles } from "@/app/_hooks/use-doodles"
import { URLS } from "@/utils/urls"

interface DoodleGridItemProps {
  doodle: Doodle
}

const DoodleGridItem = React.memo(function DoodleGridItem({ doodle }: DoodleGridItemProps) {
  if (!doodle.imageUrl) return null

  return (
    <Link
      href={URLS.doodle({ params: { id: doodle.id } })}
      className="relative flex aspect-square items-center justify-center overflow-hidden rounded-lg border border-gray-200 bg-white p-1 dark:border-gray-800 dark:bg-gray-900"
    >
      <DoodleImage src={doodle.imageUrl} alt={doodle.prompt} className="h-full w-full object-contain" />
    </Link>
  )
})

interface DoodleGridProps {
  excludeId?: string
}

function DoodleGrid({ excludeId }: DoodleGridProps) {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, isError } = useDoodles()
  const loadMoreRef = useRef<HTMLDivElement>(null)

  const allDoodles = useMemo(() => data?.pages.flatMap((page) => page.doodles) ?? [], [data?.pages])
  const doodles = useMemo(
    () => (excludeId ? allDoodles.filter((doodle) => doodle.id !== excludeId) : allDoodles),
    [allDoodles, excludeId],
  )

  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const target = entries[0]
      if (target?.isIntersecting && hasNextPage && !isFetchingNextPage) {
        void fetchNextPage()
      }
    },
    [fetchNextPage, hasNextPage, isFetchingNextPage],
  )

  useEffect(() => {
    const element = loadMoreRef.current
    if (!element) return

    const observer = new IntersectionObserver(handleObserver, {
      root: null,
      rootMargin: "100px",
      threshold: 0,
    })

    observer.observe(element)

    return () => {
      observer.disconnect()
    }
  }, [handleObserver])

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Spinner size="lg" />
      </div>
    )
  }

  if (isError) {
    return (
      <div className="py-12 text-center">
        <p className="text-sm text-gray-500">Failed to load doodles</p>
      </div>
    )
  }

  if (doodles.length === 0) {
    return null
  }

  return (
    <div className="w-full px-4 pb-8">
      <div className="mx-auto max-w-4xl">
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6">
          {doodles.map((doodle) => (
            <DoodleGridItem key={doodle.id} doodle={doodle} />
          ))}
        </div>

        <div ref={loadMoreRef} className="flex justify-center py-8">
          {isFetchingNextPage ? <Spinner size="md" /> : hasNextPage ? <div className="h-8" /> : null}
        </div>
      </div>
    </div>
  )
}

export { DoodleGrid }
