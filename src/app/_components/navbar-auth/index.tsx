"use client"

import { useCallback, useMemo } from "react"

import { Avatar } from "@851-labs/ui/components/avatar"
import { Button } from "@851-labs/ui/components/button"
import { Menu } from "@851-labs/ui/components/menu"

import { useLoginSheet } from "@/app/_components/sheets/login-sheet"
import { usePurchaseSheet } from "@/app/_components/sheets/purchase-sheet"
import { ThemeToggle } from "@/app/_components/theme-toggle"
import { useCurrentUser } from "@/app/_hooks/use-current-user"
import { useCurrentUserIsLoggedIn } from "@/app/_hooks/use-current-user-is-logged-in"
import { useCurrentUserLogout } from "@/app/_hooks/use-current-user-logout"
import { useUserCredits } from "@/app/_hooks/use-user-credits"

function NavbarAuth() {
  const { openLoginSheet } = useLoginSheet()
  const { openPurchaseSheet } = usePurchaseSheet()
  const { user } = useCurrentUser()
  const { isLoggedIn, isLoading } = useCurrentUserIsLoggedIn()
  const { logout } = useCurrentUserLogout()
  const { balance, isLoading: isCreditsLoading } = useUserCredits()

  const userEmail = useMemo(() => user?.email ?? "", [user?.email])
  const userInitial = useMemo(() => userEmail.charAt(0).toUpperCase(), [userEmail])
  const creditsDisplay = useMemo(() => (isCreditsLoading ? "..." : balance), [isCreditsLoading, balance])

  const handleSignIn = useCallback(() => {
    openLoginSheet()
  }, [openLoginSheet])

  const handleSignOut = useCallback(() => {
    void logout()
  }, [logout])

  const handleBuyCredits = useCallback(() => {
    openPurchaseSheet()
  }, [openPurchaseSheet])

  if (isLoading) {
    return <ThemeToggle />
  }

  if (!isLoggedIn) {
    return (
      <div className="flex items-center gap-2">
        <ThemeToggle />
        <Button variant="ghost" size="sm" onClick={handleSignIn}>
          Sign In
        </Button>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-2">
      <ThemeToggle />
      <Menu>
        <Menu.Trigger className="rounded-full">
          <Avatar size="sm">
            <Avatar.Fallback>{userInitial}</Avatar.Fallback>
          </Avatar>
        </Menu.Trigger>
        <Menu.Content align="end">
          <Menu.Content.Group>
            <Menu.Content.Group.Item disabled>
              <span className="truncate text-sm text-gray-500 dark:text-gray-400">{userEmail}</span>
            </Menu.Content.Group.Item>
          </Menu.Content.Group>
          <Menu.Content.Group>
            <Menu.Content.Group.Item icon="sparkles" onClick={handleBuyCredits}>
              {creditsDisplay} Credits
            </Menu.Content.Group.Item>
            <Menu.Content.Group.Item icon="arrow-right-start-on-rectangle" onClick={handleSignOut}>
              Sign Out
            </Menu.Content.Group.Item>
          </Menu.Content.Group>
        </Menu.Content>
      </Menu>
    </div>
  )
}

export { NavbarAuth }
