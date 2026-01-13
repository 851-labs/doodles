"use client"

import { useQuery, useSuspenseQuery } from "@tanstack/react-query"

import { getDoodleQueryOptions } from "@/app/_hooks/use-doodle/utils"

function useDoodle(doodleId: string) {
  return useQuery(getDoodleQueryOptions(doodleId))
}

function useSuspenseDoodle(doodleId: string) {
  return useSuspenseQuery(getDoodleQueryOptions(doodleId))
}

export { useDoodle, useSuspenseDoodle }
