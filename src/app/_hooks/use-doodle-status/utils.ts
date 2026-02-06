import { queryOptions } from "@tanstack/react-query"
import { z } from "zod"

import type { Doodle } from "@/db/schema"
import { DOODLE_STATUS, MODEL_STATUS } from "@/utils/constants"
import { URLS } from "@/utils/urls"

const DoodleStatusResponseSchema = z.object({
  id: z.string(),
  status: z.enum([DOODLE_STATUS.GENERATING, DOODLE_STATUS.GENERATED, DOODLE_STATUS.ERRORED]),
  imageUrl: z.string().nullable(),
  prompt: z.string(),
  modelUrl: z.string().nullable(),
  modelPosterUrl: z.string().nullable(),
  modelStatus: z.enum([MODEL_STATUS.GENERATING, MODEL_STATUS.GENERATED, MODEL_STATUS.ERRORED]).nullable(),
  modelGenerationStartedAt: z.string().nullable(),
  createdAt: z.string(),
})

type DoodleStatusResponse = z.infer<typeof DoodleStatusResponseSchema>

async function fetchDoodleStatus(doodleId: string): Promise<DoodleStatusResponse> {
  const response = await fetch(URLS.api.doodleStatus({ params: { id: doodleId } }))
  if (!response.ok) throw new Error("Failed to fetch doodle status")

  const data: unknown = await response.json()
  return DoodleStatusResponseSchema.parse(data)
}

function buildInitialData(doodle: Doodle): DoodleStatusResponse {
  const parseResult = DoodleStatusResponseSchema.safeParse({
    id: doodle.id,
    status: doodle.status,
    imageUrl: doodle.imageUrl,
    prompt: doodle.prompt,
    modelUrl: doodle.modelUrl,
    modelPosterUrl: doodle.modelPosterUrl,
    modelStatus: doodle.modelStatus,
    modelGenerationStartedAt: doodle.modelGenerationStartedAt?.toISOString() ?? null,
    createdAt: doodle.createdAt.toISOString(),
  })

  if (!parseResult.success) {
    return {
      id: doodle.id,
      status: DOODLE_STATUS.GENERATING,
      imageUrl: doodle.imageUrl,
      prompt: doodle.prompt,
      modelUrl: doodle.modelUrl ?? null,
      modelPosterUrl: doodle.modelPosterUrl ?? null,
      modelStatus: null,
      modelGenerationStartedAt: null,
      createdAt: doodle.createdAt.toISOString(),
    }
  }

  return parseResult.data
}

function computeRefetchInterval(data: DoodleStatusResponse | undefined): number | false {
  if (!data) return 1000

  const isSketchGenerating = data.status === DOODLE_STATUS.GENERATING
  const isModelGenerating = data.modelStatus === MODEL_STATUS.GENERATING

  if (isSketchGenerating || isModelGenerating) return 1000
  if (data.status === DOODLE_STATUS.ERRORED) return false

  return false
}

interface GetDoodleStatusQueryOptionsParams {
  doodleId: string
  initialDoodle: Doodle
}

function getDoodleStatusQueryOptions({ doodleId, initialDoodle }: GetDoodleStatusQueryOptionsParams) {
  return queryOptions({
    queryKey: ["doodle-status", doodleId],
    queryFn: () => fetchDoodleStatus(doodleId),
    initialData: buildInitialData(initialDoodle),
    refetchInterval: (query) => computeRefetchInterval(query.state.data),
  })
}

export { buildInitialData, getDoodleStatusQueryOptions }
export type { DoodleStatusResponse }
