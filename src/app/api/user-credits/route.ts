import { NextResponse } from "next/server"

import { fetchUserCredits, hasUserPurchasedBefore } from "@/db/queries"
import { createClient } from "@/utils/supabase/server"

async function GET() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const [balance, hasPurchased] = await Promise.all([fetchUserCredits(user.id), hasUserPurchasedBefore(user.id)])

  return NextResponse.json({ balance, hasPurchased })
}

export { GET }
