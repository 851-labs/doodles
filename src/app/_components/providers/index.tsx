"use client"

import { Suspense } from "react"

import { Toaster } from "sonner"

import { QueryProvider } from "@/components/providers/query-provider"
import { MotionProvider } from "@/components/providers/motion-provider"
import { ThemeProvider } from "@/components/providers/theme-provider"
import { TooltipProvider } from "@/components/ui/tooltip"

import { PurchaseSuccessHandler } from "@/app/_components/purchase-success-handler"
import { LoginSheet } from "@/app/_components/sheets/login-sheet"
import { PurchaseSheet } from "@/app/_components/sheets/purchase-sheet"

type ProvidersProps = React.PropsWithChildren

function Providers({ children }: ProvidersProps) {
  return (
    <MotionProvider>
      <QueryProvider>
        <TooltipProvider>
          <ThemeProvider>
            {children}

            <Suspense>
              <LoginSheet />
              <PurchaseSheet />
              <PurchaseSuccessHandler />
            </Suspense>

            <Toaster />
          </ThemeProvider>
        </TooltipProvider>
      </QueryProvider>
    </MotionProvider>
  )
}

export { Providers }
