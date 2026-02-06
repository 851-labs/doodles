import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"
import { createServerClient } from "@supabase/ssr"

import type { CookieMethodsServer } from "@supabase/ssr"
import { ENV } from "@/utils/env"

interface ResponseHolder {
  current: NextResponse
}

async function updateSession(request: NextRequest) {
  const responseHolder: ResponseHolder = {
    current: NextResponse.next({ request }),
  }

  const cookieMethods: CookieMethodsServer = {
    getAll() {
      return request.cookies.getAll()
    },
    setAll(cookiesToSet) {
      for (const { name, value } of cookiesToSet) {
        request.cookies.set(name, value)
      }
      responseHolder.current = NextResponse.next({ request })
      for (const { name, value, options } of cookiesToSet) {
        responseHolder.current.cookies.set(name, value, options)
      }
    },
  }

  const supabase = createServerClient(ENV.NEXT_PUBLIC_SUPABASE_URL, ENV.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY, {
    cookies: cookieMethods,
  })

  await supabase.auth.getUser()

  return responseHolder.current
}

export { updateSession }
