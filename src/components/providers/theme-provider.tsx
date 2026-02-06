"use client"

import { ThemeProvider as NextThemesProvider, useTheme as useNextTheme } from "next-themes"

enum Theme {
  Light = "light",
  Dark = "dark",
  System = "system",
}

function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider attribute="data-theme" defaultTheme="system" enableSystem storageKey="doodles.theme">
      {children}
    </NextThemesProvider>
  )
}

function useTheme() {
  const { theme, resolvedTheme, setTheme } = useNextTheme()
  return { theme: theme as Theme, resolvedTheme, setTheme }
}

export { ThemeProvider, useTheme, Theme }
