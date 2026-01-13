"use client"

import React, { useCallback, useEffect, useMemo, useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { atom, useAtom } from "jotai"
import { z } from "zod"

import { Button } from "@851-labs/ui/components/button"
import { Sheet } from "@851-labs/ui/components/sheet"
import { ButtonPrimitive } from "@851-labs/ui/primitives/button"
import { cn } from "@851-labs/ui/primitives/utils/cn"

import type { CreditPack } from "@/utils/constants"
import { useUserCredits } from "@/app/_hooks/use-user-credits"
import { CREDIT_PACKS } from "@/utils/constants"
import { ENV } from "@/utils/env"
import { URLS } from "@/utils/urls"

const CheckoutErrorResponseSchema = z.object({
  error: z.string().optional(),
})

const CheckoutSuccessResponseSchema = z.object({
  url: z.string(),
})

const showPurchaseSheetAtom = atom(false)
const pendingPromptAtom = atom<string | null>(null)

function usePurchaseSheet() {
  const setShowPurchaseSheet = useAtom(showPurchaseSheetAtom)[1]
  const setPendingPrompt = useAtom(pendingPromptAtom)[1]

  const openPurchaseSheet = useCallback(
    (prompt?: string) => {
      if (prompt) {
        setPendingPrompt(prompt)
      }
      setShowPurchaseSheet(true)
    },
    [setShowPurchaseSheet, setPendingPrompt],
  )

  return { openPurchaseSheet }
}

interface PricingOptionProps {
  pack: CreditPack
  isSelected: boolean
  onSelect?: () => void
}

const PricingOption = React.memo(function PricingOption({ pack, isSelected, onSelect }: PricingOptionProps) {
  const priceDisplay = useMemo(() => (pack.amountCents / 100).toFixed(0), [pack.amountCents])

  return (
    <ButtonPrimitive
      onClick={onSelect}
      className={cn(
        "flex w-full items-center justify-between rounded-xl border-2 px-4 py-3",
        isSelected
          ? "border-blue-500 bg-blue-50 dark:border-blue-400 dark:bg-blue-950"
          : "border-gray-200 bg-white hover:border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:hover:border-gray-600",
      )}
    >
      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{pack.credits} Doodles</span>
      <span className="text-sm font-semibold text-gray-900 dark:text-white">${priceDisplay}</span>
    </ButtonPrimitive>
  )
})

function PurchaseSheet() {
  const router = useRouter()
  const [open, setOpen] = useAtom(showPurchaseSheetAtom)
  const [pendingPrompt, setPendingPrompt] = useAtom(pendingPromptAtom)
  const [selectedPack, setSelectedPack] = useState<CreditPack | undefined>(undefined)
  const [showAllPrices, setShowAllPrices] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | undefined>(undefined)
  const [isRouterTransitionPending, startRouterTransition] = useTransition()

  const { hasPurchased } = useUserCredits()
  const creditPacks = useMemo(() => CREDIT_PACKS[ENV.NODE_ENV], [])
  const isPending = useMemo(() => isLoading || isRouterTransitionPending, [isLoading, isRouterTransitionPending])
  const defaultPack = useMemo(() => (hasPurchased ? creditPacks[1] : creditPacks[0]), [hasPurchased, creditPacks])

  useEffect(() => {
    if (open && !selectedPack) {
      setSelectedPack(defaultPack)
    }
  }, [open, selectedPack, defaultPack])

  const handlePurchase = useCallback(async () => {
    if (!selectedPack) return

    setIsLoading(true)
    setError(undefined)

    try {
      const response = await fetch(URLS.api.checkout, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          priceId: selectedPack.priceId,
          prompt: pendingPrompt ?? undefined,
        }),
      })

      if (!response.ok) {
        const errorData: unknown = await response.json()
        const parsedError = CheckoutErrorResponseSchema.parse(errorData)
        throw new Error(parsedError.error ?? "Failed to create checkout session")
      }

      const successData: unknown = await response.json()
      const parsedSuccess = CheckoutSuccessResponseSchema.parse(successData)

      startRouterTransition(() => {
        router.push(parsedSuccess.url)
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong")
      setIsLoading(false)
    }
  }, [selectedPack, router, pendingPrompt])

  function handleOpenChange(newOpen: boolean) {
    setOpen(newOpen)
    if (!newOpen) {
      setSelectedPack(undefined)
      setShowAllPrices(false)
      setError(undefined)
      setPendingPrompt(null)
    }
  }

  function handleShowAllPrices() {
    setShowAllPrices(true)
  }

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <Sheet.Content className="w-[420px]">
        <Sheet.Content.Icon name="sparkles" />
        <Sheet.Content.Title>Get More Doodles</Sheet.Content.Title>
        <Sheet.Content.Description>Credits never expire. Use them whenever you want.</Sheet.Content.Description>

        <div className="flex flex-col gap-2">
          {showAllPrices ? (
            creditPacks.map((pack) => (
              <PricingOption
                key={pack.priceId}
                pack={pack}
                isSelected={selectedPack?.priceId === pack.priceId}
                onSelect={() => setSelectedPack(pack)}
              />
            ))
          ) : selectedPack ? (
            <PricingOption pack={selectedPack} isSelected />
          ) : null}
        </div>

        {error ? <p className="mt-3 text-center text-sm text-red-500">{error}</p> : null}

        <Button
          className="mt-4 w-full"
          disabled={!selectedPack || isPending}
          loading={isPending}
          onClick={handlePurchase}
        >
          Continue
        </Button>

        {!showAllPrices ? (
          <Button variant="ghost" size="sm" className="mt-2 w-full" onClick={handleShowAllPrices}>
            See more prices
          </Button>
        ) : null}
      </Sheet.Content>
    </Sheet>
  )
}

export { PurchaseSheet, usePurchaseSheet }
