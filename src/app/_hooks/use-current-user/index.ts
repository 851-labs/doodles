"use client"

import { useEffect, useMemo } from "react"
import { useQuery, useQueryClient } from "@tanstack/react-query"

import { getCurrentUserQueryOptions } from "@/app/_hooks/use-current-user/utils"
import { createClient } from "@/utils/supabase/client"

function useCurrentUser() {
  const queryClient = useQueryClient()
  const supabase = useMemo(() => createClient(), [])

  const { data: user, isLoading } = useQuery(getCurrentUserQueryOptions({ supabase }))

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      void queryClient.invalidateQueries({ queryKey: ["current-user"] })
    })

    return () => subscription.unsubscribe()
  }, [supabase, queryClient])

  return { user, isLoading }
}

export { useCurrentUser }
