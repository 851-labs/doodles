import { queryOptions } from "@tanstack/react-query"

import type { createClient } from "@/utils/supabase/client"
import type { User } from "@supabase/supabase-js"

type SupabaseClient = ReturnType<typeof createClient>

async function fetchCurrentUser(supabase: SupabaseClient): Promise<User | null> {
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return user
}

function getCurrentUserQueryOptions({ supabase }: { supabase: SupabaseClient }) {
  return queryOptions({
    // eslint-disable-next-line @tanstack/query/exhaustive-deps -- supabase client has circular refs and cannot be serialized in queryKey
    queryKey: ["current-user"],
    queryFn: () => fetchCurrentUser(supabase),
  })
}

export { getCurrentUserQueryOptions }
