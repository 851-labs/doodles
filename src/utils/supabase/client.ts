import { createBrowserClient } from "@supabase/ssr"

import { ENV } from "@/utils/env"

function createClient() {
  return createBrowserClient(ENV.NEXT_PUBLIC_SUPABASE_URL, ENV.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY)
}

export { createClient }
