"use client"

import React, { Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react"
import dynamic from "next/dynamic"
import { useRouter } from "next/navigation"
import { useQueryClient } from "@tanstack/react-query"

import { Icon } from "@851-labs/ui/components/icon"
import { SegmentedControl } from "@851-labs/ui/components/segmented-control"
import { cn } from "@851-labs/ui/primitives/utils/cn"

import type { Doodle } from "@/db/schema"
import { DoodleImage } from "@/app/_components/doodle-image"
import { use3DGenerate } from "@/app/_hooks/use-3d-generate"
import { useDoodleStatus } from "@/app/_hooks/use-doodle-status"
import { Confetti } from "@/app/doodles/[id]/_components/confetti"
import { DoodleActionsButtons, DoodleActionsInput } from "@/app/doodles/[id]/_components/doodle-actions"
import { ErroredState } from "@/app/doodles/[id]/_components/errored-state"
import { Generate3DButton } from "@/app/doodles/[id]/_components/generate-3d-button"
import { Generating3DState } from "@/app/doodles/[id]/_components/generating-3d-state"
import { GeneratingState } from "@/app/doodles/[id]/_components/generating-state"
import { DOODLE_STATUS, MODEL_STATUS } from "@/utils/constants"
import { URLS } from "@/utils/urls"

const ModelViewer = dynamic(
  () => import("@/app/doodles/[id]/_components/model-viewer").then((mod) => mod.ModelViewer),
  { ssr: false },
)

type ViewMode = "sketch" | "3d"

function isViewMode(value: string): value is ViewMode {
  return value === "sketch" || value === "3d"
}

const MissingImageState = React.memo(function MissingImageState() {
  return (
    <div className="flex flex-col items-center justify-center gap-2 text-center">
      <Icon name="triangle-exclamation" size={32} className="text-gray-400 dark:text-gray-500" />
      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Image unavailable</p>
    </div>
  )
})

interface DoodleContentProps {
  initialDoodle: Doodle
  doodleUrl: string
}

function DoodleContent({ initialDoodle, doodleUrl }: DoodleContentProps) {
  const router = useRouter()
  const queryClient = useQueryClient()
  const hasInvalidated = useRef(false)
  const [viewMode, setViewMode] = useState<ViewMode>("sketch")

  const { generate: generate3D, isGenerating: isGenerating3D } = use3DGenerate(initialDoodle.id)
  const { data: doodle } = useDoodleStatus({ initialDoodle })

  const wasInitiallyGenerating = useMemo(
    () => initialDoodle.status === DOODLE_STATUS.GENERATING,
    [initialDoodle.status],
  )

  const showConfetti = useMemo(
    () => wasInitiallyGenerating && doodle.status === DOODLE_STATUS.GENERATED && doodle.imageUrl,
    [wasInitiallyGenerating, doodle.status, doodle.imageUrl],
  )

  const handleViewModeChange = useCallback((value: string) => {
    if (!isViewMode(value)) return
    setViewMode(value)
  }, [])

  const handleGenerate3D = useCallback(() => {
    generate3D()
  }, [generate3D])

  useEffect(() => {
    if (doodle.status !== DOODLE_STATUS.GENERATED) return

    const ref = hasInvalidated
    if (ref.current) return

    ref.current = true
    void queryClient.invalidateQueries({ queryKey: ["doodles"] })
  }, [doodle.status, queryClient])

  useEffect(() => {
    if (doodle.status !== DOODLE_STATUS.ERRORED) return

    const timeout = setTimeout(() => {
      router.push(URLS.home)
    }, 5000)
    return () => clearTimeout(timeout)
  }, [doodle.status, router])

  if (doodle.status === DOODLE_STATUS.GENERATING) {
    return (
      <div className="flex w-full max-w-sm flex-col items-center gap-6">
        <GeneratingState startedAt={new Date(doodle.createdAt)} />
      </div>
    )
  }

  if (doodle.status === DOODLE_STATUS.ERRORED) {
    return (
      <div className="flex w-full max-w-sm flex-col items-center gap-6">
        <ErroredState prompt={doodle.prompt} />
      </div>
    )
  }

  return (
    <div className="flex w-full max-w-sm flex-col items-center gap-6">
      {showConfetti ? (
        <Suspense fallback={null}>
          <Confetti forceShow />
        </Suspense>
      ) : null}

      <SegmentedControl value={viewMode} onValueChange={handleViewModeChange}>
        <SegmentedControl.Item value="sketch">Sketch</SegmentedControl.Item>
        <SegmentedControl.Item value="3d">3D</SegmentedControl.Item>
      </SegmentedControl>

      <div className="relative w-full">
        <div
          className={cn(
            "relative flex aspect-square w-full items-center justify-center overflow-hidden rounded-2xl border border-gray-200 p-4 dark:border-gray-800",
            viewMode === "3d" && doodle.modelStatus === MODEL_STATUS.GENERATING
              ? "bg-gray-100 dark:bg-gray-900"
              : "bg-white dark:bg-gray-900",
          )}
        >
          {viewMode === "sketch" ? (
            doodle.imageUrl ? (
              <DoodleImage src={doodle.imageUrl} alt={doodle.prompt} className="h-full w-full object-contain" />
            ) : (
              <MissingImageState />
            )
          ) : doodle.modelStatus === MODEL_STATUS.GENERATING && doodle.modelGenerationStartedAt ? (
            <Generating3DState startedAt={new Date(doodle.modelGenerationStartedAt)} />
          ) : doodle.modelStatus === MODEL_STATUS.GENERATED && doodle.modelUrl ? (
            <ModelViewer
              modelUrl={doodle.modelUrl}
              posterUrl={doodle.modelPosterUrl ?? undefined}
              alt={`3D model of ${doodle.prompt}`}
            />
          ) : (
            <Generate3DButton onClick={handleGenerate3D} isLoading={isGenerating3D} />
          )}
        </div>
        {viewMode === "sketch" && doodle.imageUrl ? (
          <div className="absolute top-2 right-2">
            <DoodleActionsButtons prompt={doodle.prompt} imageUrl={doodle.imageUrl} doodleUrl={doodleUrl} />
          </div>
        ) : null}
      </div>

      <DoodleActionsInput prompt={doodle.prompt} />
    </div>
  )
}

export { DoodleContent }
