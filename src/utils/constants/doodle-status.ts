const DOODLE_STATUS = {
  GENERATING: "generating",
  GENERATED: "generated",
  ERRORED: "errored",
} as const

const MODEL_STATUS = {
  GENERATING: "generating",
  GENERATED: "generated",
  ERRORED: "errored",
} as const

const GENERATION_TIMEOUT_MS = 60 * 1000
const MODEL_GENERATION_TIMEOUT_MS = 300 * 1000

type DoodleStatus = (typeof DOODLE_STATUS)[keyof typeof DOODLE_STATUS]
type ModelStatus = (typeof MODEL_STATUS)[keyof typeof MODEL_STATUS]

export { DOODLE_STATUS, GENERATION_TIMEOUT_MS, MODEL_GENERATION_TIMEOUT_MS, MODEL_STATUS }
export type { DoodleStatus, ModelStatus }
