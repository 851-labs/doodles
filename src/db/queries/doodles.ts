"use server"

import { and, desc, eq, ne, sql } from "drizzle-orm"

import type { Doodle, DoodleInsert, DoodleStatus, ModelStatus } from "@/db/schema"
import { db, doodles } from "@/db"
import { DEFAULT_PAGE_SIZE, DOODLE_STATUS } from "@/utils/constants"

interface FetchDoodlesParams {
  page?: number
  pageSize?: number
}

interface FetchDoodlesResult {
  doodles: Doodle[]
  nextPage: number | null
}

async function fetchDoodles({
  page = 0,
  pageSize = DEFAULT_PAGE_SIZE,
}: FetchDoodlesParams = {}): Promise<FetchDoodlesResult> {
  const offset = page * pageSize

  const results = await db
    .select()
    .from(doodles)
    .where(eq(doodles.status, DOODLE_STATUS.GENERATED))
    .orderBy(desc(doodles.createdAt))
    .limit(pageSize)
    .offset(offset)

  const hasMore = results.length === pageSize

  return {
    doodles: results,
    nextPage: hasMore ? page + 1 : null,
  }
}

async function fetchDoodleById(id: string): Promise<Doodle | undefined> {
  const results = await db.select().from(doodles).where(eq(doodles.id, id)).limit(1)

  return results[0]
}

async function fetchSimilarDoodles(currentId: string, currentPrompt: string, limit = 6): Promise<Doodle[]> {
  const searchTerms = currentPrompt
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .split(/\s+/)
    .filter((term) => term.length > 2)
    .join(" | ")

  if (!searchTerms) {
    return db
      .select()
      .from(doodles)
      .where(and(ne(doodles.id, currentId), eq(doodles.status, DOODLE_STATUS.GENERATED)))
      .orderBy(desc(doodles.createdAt))
      .limit(limit)
  }

  const results = await db
    .select({
      id: doodles.id,
      userId: doodles.userId,
      prompt: doodles.prompt,
      imageUrl: doodles.imageUrl,
      runId: doodles.runId,
      status: doodles.status,
      modelUrl: doodles.modelUrl,
      modelPosterUrl: doodles.modelPosterUrl,
      modelRunId: doodles.modelRunId,
      modelStatus: doodles.modelStatus,
      modelGenerationStartedAt: doodles.modelGenerationStartedAt,
      createdAt: doodles.createdAt,
      rank: sql<number>`ts_rank(to_tsvector('english', ${doodles.prompt}), to_tsquery('english', ${searchTerms}))`.as(
        "rank",
      ),
    })
    .from(doodles)
    .where(
      and(
        ne(doodles.id, currentId),
        eq(doodles.status, DOODLE_STATUS.GENERATED),
        sql`to_tsvector('english', ${doodles.prompt}) @@ to_tsquery('english', ${searchTerms})`,
      ),
    )
    .orderBy(
      desc(sql`ts_rank(to_tsvector('english', ${doodles.prompt}), to_tsquery('english', ${searchTerms}))`),
      desc(doodles.createdAt),
    )
    .limit(limit)

  const mappedResults: Doodle[] = results.map(({ rank: _, ...rest }) => rest)

  if (mappedResults.length < limit) {
    const existingIds = mappedResults.map((r) => r.id)
    const remainingCount = limit - mappedResults.length

    const recentDoodles = await db
      .select()
      .from(doodles)
      .where(
        and(
          ne(doodles.id, currentId),
          eq(doodles.status, DOODLE_STATUS.GENERATED),
          existingIds.length > 0
            ? sql`${doodles.id} NOT IN (${sql.join(
                existingIds.map((id) => sql`${id}`),
                sql`, `,
              )})`
            : sql`true`,
        ),
      )
      .orderBy(desc(doodles.createdAt))
      .limit(remainingCount)

    return [...mappedResults, ...recentDoodles]
  }

  return mappedResults
}

async function insertDoodle(doodle: DoodleInsert): Promise<Doodle> {
  const results = await db.insert(doodles).values(doodle).returning()

  const inserted = results[0]
  if (!inserted) {
    throw new Error("Failed to insert doodle")
  }

  return inserted
}

interface UpdateDoodleParams {
  id: string
  status?: DoodleStatus
  imageUrl?: string
}

async function updateDoodle({ id, status, imageUrl }: UpdateDoodleParams): Promise<Doodle | undefined> {
  const updates: Partial<Pick<Doodle, "status" | "imageUrl">> = {}
  if (status) updates.status = status
  if (imageUrl) updates.imageUrl = imageUrl

  const results = await db.update(doodles).set(updates).where(eq(doodles.id, id)).returning()

  return results[0]
}

interface UpdateDoodleByRunIdParams {
  runId: string
  status: DoodleStatus
  imageUrl?: string
}

async function updateDoodleByRunId({
  runId,
  status,
  imageUrl,
}: UpdateDoodleByRunIdParams): Promise<Doodle | undefined> {
  const updates: Partial<Pick<Doodle, "status" | "imageUrl">> = { status }
  if (imageUrl) updates.imageUrl = imageUrl

  const results = await db.update(doodles).set(updates).where(eq(doodles.runId, runId)).returning()

  return results[0]
}

async function fetchDoodleByModelRunId(modelRunId: string): Promise<Doodle | undefined> {
  const results = await db.select().from(doodles).where(eq(doodles.modelRunId, modelRunId)).limit(1)

  return results[0]
}

interface StartModelGenerationParams {
  doodleId: string
  modelRunId: string
}

async function startModelGeneration({ doodleId, modelRunId }: StartModelGenerationParams): Promise<Doodle | undefined> {
  const results = await db
    .update(doodles)
    .set({
      modelRunId,
      modelStatus: "generating",
      modelGenerationStartedAt: new Date(),
    })
    .where(eq(doodles.id, doodleId))
    .returning()

  return results[0]
}

interface TryClaimModelGenerationResult {
  success: boolean
  doodle?: Doodle
}

async function tryClaimModelGeneration(doodleId: string): Promise<TryClaimModelGenerationResult> {
  const results = await db
    .update(doodles)
    .set({
      modelStatus: "generating",
      modelGenerationStartedAt: new Date(),
    })
    .where(and(eq(doodles.id, doodleId), sql`(${doodles.modelStatus} IS NULL OR ${doodles.modelStatus} = 'errored')`))
    .returning()

  const doodle = results[0]
  return { success: !!doodle, doodle }
}

async function setModelRunId(doodleId: string, modelRunId: string): Promise<Doodle | undefined> {
  const results = await db.update(doodles).set({ modelRunId }).where(eq(doodles.id, doodleId)).returning()

  return results[0]
}

async function releaseModelClaim(doodleId: string): Promise<void> {
  await db
    .update(doodles)
    .set({
      modelStatus: null,
      modelGenerationStartedAt: null,
    })
    .where(eq(doodles.id, doodleId))
}

interface UpdateDoodleModelByRunIdParams {
  modelRunId: string
  modelStatus: ModelStatus
  modelUrl?: string
  modelPosterUrl?: string
}

async function updateDoodleModelByRunId({
  modelRunId,
  modelStatus,
  modelUrl,
  modelPosterUrl,
}: UpdateDoodleModelByRunIdParams): Promise<Doodle | undefined> {
  const updates: Partial<Pick<Doodle, "modelStatus" | "modelUrl" | "modelPosterUrl">> = { modelStatus }
  if (modelUrl) updates.modelUrl = modelUrl
  if (modelPosterUrl) updates.modelPosterUrl = modelPosterUrl

  const results = await db.update(doodles).set(updates).where(eq(doodles.modelRunId, modelRunId)).returning()

  return results[0]
}

interface UpdateDoodleModelStatusParams {
  doodleId: string
  modelStatus: ModelStatus
}

async function updateDoodleModelStatus({
  doodleId,
  modelStatus,
}: UpdateDoodleModelStatusParams): Promise<Doodle | undefined> {
  const results = await db.update(doodles).set({ modelStatus }).where(eq(doodles.id, doodleId)).returning()

  return results[0]
}

export {
  fetchDoodleById,
  fetchDoodleByModelRunId,
  fetchDoodles,
  fetchSimilarDoodles,
  insertDoodle,
  releaseModelClaim,
  setModelRunId,
  startModelGeneration,
  tryClaimModelGeneration,
  updateDoodle,
  updateDoodleByRunId,
  updateDoodleModelByRunId,
  updateDoodleModelStatus,
}
