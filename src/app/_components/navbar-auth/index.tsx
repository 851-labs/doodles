"use client"

import { useCallback, useMemo } from "react"
import { Sparkles, LogOut } from "lucide-react"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"

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
      <DropdownMenu>
        <DropdownMenuTrigger className="rounded-full">
          <Avatar className="h-6 w-6">
            <AvatarFallback>{userInitial}</AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuGroup>
            <DropdownMenuItem disabled>
              <span className="truncate text-sm text-gray-500 dark:text-gray-400">{userEmail}</span>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem onClick={handleBuyCredits}>
              <Sparkles className="mr-2 size-4" />
              {creditsDisplay} Credits
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleSignOut}>
              <LogOut className="mr-2 size-4" />
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

export { NavbarAuth }
