"use client"

import { Sun, Moon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { useIsHydrated } from "@/hooks/use-is-hydrated"
import { Theme, useTheme } from "@/components/providers/theme-provider"

function ThemeToggle() {
  const { isHydrated } = useIsHydrated()
  const { theme, setTheme } = useTheme()

  if (!isHydrated) return null

  function handleClick() {
    if (theme === Theme.Light) {
      setTheme(Theme.Dark)
    } else {
      setTheme(Theme.Light)
    }
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleClick}
      aria-label="Toggle theme"
    >
      {theme === Theme.Dark ? <Moon className="size-4" /> : <Sun className="size-4" />}
    </Button>
  )
}

export { ThemeToggle }
