"use client"

import { useQuery } from "@tanstack/react-query"

import type { Doodle } from "@/db/schema"
import { getDoodleStatusQueryOptions } from "@/app/_hooks/use-doodle-status/utils"

interface UseDoodleStatusParams {
  initialDoodle: Doodle
}

function useDoodleStatus({ initialDoodle }: UseDoodleStatusParams) {
  return useQuery(getDoodleStatusQueryOptions({ doodleId: initialDoodle.id, initialDoodle }))
}

export { useDoodleStatus }
