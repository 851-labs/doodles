"use client"

import { Button } from "@851-labs/ui/components/button"
import { useIsHydrated } from "@851-labs/ui/primitives/hooks/use-is-hydrated"
import { Theme, useTheme } from "@851-labs/ui/primitives/theme-provider"

function ThemeToggle() {
  const { isHydrated } = useIsHydrated()
  const { theme, setTheme, icon } = useTheme()

  if (!isHydrated) return null

  function handleClick() {
    if (theme === Theme.Light) {
      setTheme(Theme.Dark)
    } else {
      setTheme(Theme.Light)
    }
  }

  return <Button variant="plain" size="sm" icon={icon} onClick={handleClick} accessibilityLabel="Toggle theme" />
}

export { ThemeToggle }
