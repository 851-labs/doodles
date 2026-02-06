"use client"

import { useCurrentUser } from "@/app/_hooks/use-current-user"

function useCurrentUserIsLoggedIn() {
  const { user, isLoading } = useCurrentUser()

  return {
    isLoggedIn: !!user,
    isLoading,
  }
}

export { useCurrentUserIsLoggedIn }
