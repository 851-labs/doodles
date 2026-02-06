import { NextResponse } from "next/server"
import { z } from "zod"

import { fetchDoodleByModelRunId, refundCredits, updateDoodleByRunId, updateDoodleModelByRunId } from "@/db/queries"
import {
  DOODLE_STATUS,
  LIGHTBOX_3D_CREDIT_COST,
  LIGHTBOX_3D_OUTPUT_MODEL_NODE_ID,
  LIGHTBOX_3D_OUTPUT_POSTER_NODE_ID,
  LIGHTBOX_3D_PIPELINE_ID,
  LIGHTBOX_OUTPUT_NODE_ID,
  LIGHTBOX_PIPELINE_ID,
  MODEL_STATUS,
} from "@/utils/constants"
import { log } from "@/utils/log"

const FileOutputSchema = z.object({
  url: z.string(),
  content_type: z.string(),
  filename: z.string(),
})

const NodeOutputSchema = z.object({
  output: z.record(z.string(), z.unknown()),
})

const NodeWithErrorSchema = z.object({
  status: z.enum(["pending", "running", "completed", "errored"]),
  output: z.record(z.string(), z.unknown()).optional(),
  error_reason: z.string().nullable().optional(),
  error_message: z.string().nullable().optional(),
})

const WebhookPayloadSchema = z.object({
  event: z.enum(["run.completed", "run.failed"]),
  pipeline_version_run_id: z.string(),
  pipeline_id: z.string(),
  pipeline_version_id: z.string(),
  status: z.string(),
  outputs: z.record(z.string(), z.unknown()),
  created_at: z.string(),
  completed_at: z.string(),
})

function logNodeErrors(runId: string, pipelineId: string, outputs: Record<string, unknown>) {
  for (const [nodeId, nodeOutput] of Object.entries(outputs)) {
    const parsed = NodeWithErrorSchema.safeParse(nodeOutput)
    if (!parsed.success) continue

    if (parsed.data.status === "errored") {
      log.error(
        `[Lightbox] Pipeline ${pipelineId} run ${runId} node ${nodeId} failed: ${parsed.data.error_reason} - ${parsed.data.error_message}`,
      )
    }
  }
}

function extractFileUrl(outputs: Record<string, unknown>, nodeId: string): string | undefined {
  const nodeOutput = outputs[nodeId]

  if (!nodeOutput) {
    log.warn(`[Lightbox] Node ${nodeId} not found in outputs. Available nodes: ${Object.keys(outputs).join(", ")}`)
    return undefined
  }

  const parsedNodeOutput = NodeOutputSchema.safeParse(nodeOutput)

  if (!parsedNodeOutput.success) {
    log.warn(`[Lightbox] Failed to parse node ${nodeId} output`)
    return undefined
  }

  const outputValues = Object.values(parsedNodeOutput.data.output)
  for (const value of outputValues) {
    const parsed = FileOutputSchema.safeParse(value)
    if (parsed.success) {
      return parsed.data.url
    }
  }

  log.warn(`[Lightbox] No file URL found in node ${nodeId} output`)
  return undefined
}

async function handle2DPipelineWebhook(payload: z.infer<typeof WebhookPayloadSchema>) {
  const runId = payload.pipeline_version_run_id

  log.info(`[Lightbox 2D] Received webhook for run ${runId}: ${payload.event}`)

  if (payload.event !== "run.completed") {
    log.error(`[Lightbox 2D] Run ${runId} failed with event: ${payload.event}`)
    logNodeErrors(runId, payload.pipeline_id, payload.outputs)
    await updateDoodleByRunId({ runId, status: DOODLE_STATUS.ERRORED })
    return
  }

  const imageUrl = extractFileUrl(payload.outputs, LIGHTBOX_OUTPUT_NODE_ID)

  if (!imageUrl) {
    log.error(`[Lightbox 2D] Run ${runId} completed but no image URL found in outputs`)
    logNodeErrors(runId, payload.pipeline_id, payload.outputs)
    await updateDoodleByRunId({ runId, status: DOODLE_STATUS.ERRORED })
    return
  }

  const updatedDoodle = await updateDoodleByRunId({
    runId,
    status: DOODLE_STATUS.GENERATED,
    imageUrl,
  })

  if (updatedDoodle) {
    log.info(`[Lightbox 2D] Successfully updated doodle ${updatedDoodle.id} for run ${runId} to GENERATED`)
  } else {
    log.warn(`[Lightbox 2D] No doodle found with runId ${runId}`)
  }
}

async function handle3DPipelineWebhook(payload: z.infer<typeof WebhookPayloadSchema>) {
  const runId = payload.pipeline_version_run_id

  log.info(`[Lightbox 3D] Received webhook for run ${runId}: ${payload.event}`)

  if (payload.event !== "run.completed") {
    log.error(`[Lightbox 3D] Run ${runId} failed with event: ${payload.event}`)
    logNodeErrors(runId, payload.pipeline_id, payload.outputs)
    await updateDoodleModelByRunId({ modelRunId: runId, modelStatus: MODEL_STATUS.ERRORED })
    await refundCreditsForModelRun(runId)
    return
  }

  const modelUrl = extractFileUrl(payload.outputs, LIGHTBOX_3D_OUTPUT_MODEL_NODE_ID)
  const modelPosterUrl = extractFileUrl(payload.outputs, LIGHTBOX_3D_OUTPUT_POSTER_NODE_ID)

  if (!modelUrl) {
    log.error(`[Lightbox 3D] Run ${runId} completed but no model URL found in outputs`)
    logNodeErrors(runId, payload.pipeline_id, payload.outputs)
    await updateDoodleModelByRunId({ modelRunId: runId, modelStatus: MODEL_STATUS.ERRORED })
    await refundCreditsForModelRun(runId)
    return
  }

  const updatedDoodle = await updateDoodleModelByRunId({
    modelRunId: runId,
    modelStatus: MODEL_STATUS.GENERATED,
    modelUrl,
    modelPosterUrl,
  })

  if (updatedDoodle) {
    log.info(`[Lightbox 3D] Successfully updated doodle ${updatedDoodle.id} for run ${runId} to GENERATED`)
  } else {
    log.warn(`[Lightbox 3D] No doodle found with modelRunId ${runId}`)
  }
}

async function refundCreditsForModelRun(runId: string) {
  const doodle = await fetchDoodleByModelRunId(runId)
  if (!doodle) return

  log.info(`[Lightbox 3D] Refunding ${LIGHTBOX_3D_CREDIT_COST} credits to user ${doodle.userId}`)
  await refundCredits(doodle.userId, LIGHTBOX_3D_CREDIT_COST)
}

async function POST(request: Request) {
  const body: unknown = await request.json()

  log.info("[Lightbox Webhook] Received webhook request")

  const parseResult = WebhookPayloadSchema.safeParse(body)

  if (!parseResult.success) {
    log.error("[Lightbox Webhook] Failed to parse webhook payload")
    return NextResponse.json({ error: "Invalid webhook payload" }, { status: 400 })
  }

  const payload = parseResult.data

  log.info(`[Lightbox Webhook] Parsed payload: ${payload.event} for pipeline ${payload.pipeline_id}`)

  if (payload.pipeline_id === LIGHTBOX_PIPELINE_ID) {
    await handle2DPipelineWebhook(payload)
  } else if (payload.pipeline_id === LIGHTBOX_3D_PIPELINE_ID) {
    await handle3DPipelineWebhook(payload)
  } else {
    log.warn(`[Lightbox Webhook] Unrecognized pipeline ID: ${payload.pipeline_id}`)
  }

  return NextResponse.json({ received: true })
}

export { POST }
