"use client"

import { useCallback } from "react"
import { useRouter } from "next/navigation"

import { createClient } from "@/utils/supabase/client"

function useCurrentUserLogout() {
  const router = useRouter()

  const logout = useCallback(async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.refresh()
  }, [router])

  return { logout }
}

export { useCurrentUserLogout }
