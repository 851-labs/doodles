import { cookies } from "next/headers"
import { createServerClient } from "@supabase/ssr"

import type { CookieMethodsServer } from "@supabase/ssr"
import { ENV } from "@/utils/env"

async function createClient() {
  const cookieStore = await cookies()

  const cookieMethods: CookieMethodsServer = {
    getAll() {
      return cookieStore.getAll()
    },
    setAll(cookiesToSet) {
      for (const { name, value, options } of cookiesToSet) {
        cookieStore.set(name, value, options)
      }
    },
  }

  return createServerClient(ENV.NEXT_PUBLIC_SUPABASE_URL, ENV.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY, {
    cookies: cookieMethods,
  })
}

export { createClient }
