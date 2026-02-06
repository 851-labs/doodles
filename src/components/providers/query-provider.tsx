"use client"

import React from "react"
import { QueryNormalizerProvider } from "@normy/react-query"
import { defaultShouldDehydrateQuery, QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ReactQueryStreamedHydration } from "@tanstack/react-query-next-experimental"
import ms from "ms"

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: ms("60s"),
        retry: typeof window === "undefined" ? false : 3,
      },
      dehydrate: {
        shouldDehydrateQuery: (query) => defaultShouldDehydrateQuery(query) || query.state.status === "pending",
      },
    },
  })
}

let browserQueryClient: QueryClient | undefined = undefined

function getQueryClient() {
  if (typeof window === "undefined") {
    return makeQueryClient()
  } else {
    browserQueryClient ??= makeQueryClient()
    return browserQueryClient
  }
}

type QueryProviderProps = React.PropsWithChildren

function QueryProvider({ children }: QueryProviderProps) {
  const queryClient = getQueryClient()

  return (
    <QueryNormalizerProvider queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <ReactQueryStreamedHydration>{children}</ReactQueryStreamedHydration>
      </QueryClientProvider>
    </QueryNormalizerProvider>
  )
}

export { QueryProvider }
