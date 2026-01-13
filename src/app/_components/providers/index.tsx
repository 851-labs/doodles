"use client"

import { Suspense } from "react"

import { QueryProvider } from "@851-labs/query/components/query-provider"
import { ToastProvider } from "@851-labs/ui/components/toast"
import { TooltipProvider } from "@851-labs/ui/components/tooltip"
import { MotionProvider } from "@851-labs/ui/primitives/motion-provider"
import { PortalProvider } from "@851-labs/ui/primitives/portal-provider"
import { ThemeProvider } from "@851-labs/ui/primitives/theme-provider"

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
            <PortalProvider>
              {children}

              <Suspense>
                <LoginSheet />
                <PurchaseSheet />
                <PurchaseSuccessHandler />
              </Suspense>
            </PortalProvider>

            <ToastProvider />
          </ThemeProvider>
        </TooltipProvider>
      </QueryProvider>
    </MotionProvider>
  )
}

export { Providers }
