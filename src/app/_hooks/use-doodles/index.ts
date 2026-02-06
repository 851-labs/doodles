"use client"

import { useInfiniteQuery, useSuspenseInfiniteQuery } from "@tanstack/react-query"

import { getDoodlesQueryOptions } from "@/app/_hooks/use-doodles/utils"

function useDoodles() {
  return useInfiniteQuery(getDoodlesQueryOptions())
}

function useSuspenseDoodles() {
  return useSuspenseInfiniteQuery(getDoodlesQueryOptions())
}

export { useDoodles, useSuspenseDoodles }
