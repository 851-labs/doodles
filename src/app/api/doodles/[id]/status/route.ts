import { NextResponse } from "next/server"

import type { Doodle } from "@/db/schema"
import { fetchDoodleById, refundCredit, refundCredits, updateDoodle, updateDoodleModelStatus } from "@/db/queries"
import {
  DOODLE_STATUS,
  GENERATION_TIMEOUT_MS,
  LIGHTBOX_3D_CREDIT_COST,
  MODEL_GENERATION_TIMEOUT_MS,
  MODEL_STATUS,
} from "@/utils/constants"

interface RouteContext {
  params: Promise<{ id: string }>
}

function isDoodleGenerationTimedOut(doodle: Doodle): boolean {
  if (doodle.status !== DOODLE_STATUS.GENERATING) return false
  const elapsedMs = Date.now() - doodle.createdAt.getTime()
  return elapsedMs > GENERATION_TIMEOUT_MS
}

function isModelGenerationTimedOut(doodle: Doodle): boolean {
  if (doodle.modelStatus !== MODEL_STATUS.GENERATING) return false
  if (!doodle.modelGenerationStartedAt) return false
  const elapsedMs = Date.now() - doodle.modelGenerationStartedAt.getTime()
  return elapsedMs > MODEL_GENERATION_TIMEOUT_MS
}

async function handleDoodleTimeout(doodle: Doodle): Promise<string> {
  if (!isDoodleGenerationTimedOut(doodle)) return doodle.status

  await updateDoodle({ id: doodle.id, status: DOODLE_STATUS.ERRORED })
  await refundCredit(doodle.userId)
  return DOODLE_STATUS.ERRORED
}

async function handleModelTimeout(doodle: Doodle): Promise<string | null> {
  if (!isModelGenerationTimedOut(doodle)) return doodle.modelStatus

  await updateDoodleModelStatus({ doodleId: doodle.id, modelStatus: MODEL_STATUS.ERRORED })
  await refundCredits(doodle.userId, LIGHTBOX_3D_CREDIT_COST)
  return MODEL_STATUS.ERRORED
}

async function GET(_: Request, context: RouteContext) {
  const { id } = await context.params

  const doodle = await fetchDoodleById(id)
  if (!doodle) {
    return NextResponse.json({ error: "Doodle not found" }, { status: 404 })
  }

  const currentStatus = await handleDoodleTimeout(doodle)
  const currentModelStatus = await handleModelTimeout(doodle)

  return NextResponse.json({
    id: doodle.id,
    status: currentStatus,
    imageUrl: doodle.imageUrl,
    prompt: doodle.prompt,
    modelUrl: doodle.modelUrl,
    modelPosterUrl: doodle.modelPosterUrl,
    modelStatus: currentModelStatus,
    modelGenerationStartedAt: doodle.modelGenerationStartedAt?.toISOString() ?? null,
    createdAt: doodle.createdAt.toISOString(),
  })
}

export { GET }
