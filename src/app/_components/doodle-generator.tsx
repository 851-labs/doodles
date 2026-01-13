"use client"

import { useCallback, useMemo, useState } from "react"
import { useSearchParams } from "next/navigation"

import { Button } from "@851-labs/ui/components/button"
import { Input } from "@851-labs/ui/components/input"

import { DoodleGrid } from "@/app/_components/doodle-grid"
import { useLoginSheet } from "@/app/_components/sheets/login-sheet"
import { usePurchaseSheet } from "@/app/_components/sheets/purchase-sheet"
import { useCurrentUserIsLoggedIn } from "@/app/_hooks/use-current-user-is-logged-in"
import { useDoodleGenerate } from "@/app/_hooks/use-doodle-generate"
import { useDoodles } from "@/app/_hooks/use-doodles"
import { useUserCredits } from "@/app/_hooks/use-user-credits"

interface DoodleGeneratorProps {
  placeholderExample: string
}

function DoodleGenerator({ placeholderExample }: DoodleGeneratorProps) {
  const searchParams = useSearchParams()
  const promptFromUrl = searchParams.get("prompt")
  const [inputValue, setInputValue] = useState(promptFromUrl ?? "")
  const { generate, isGenerating } = useDoodleGenerate()
  const { data } = useDoodles()
  const { isLoggedIn } = useCurrentUserIsLoggedIn()
  const { openLoginSheet } = useLoginSheet()
  const { openPurchaseSheet } = usePurchaseSheet()
  const { balance } = useUserCredits()

  const doodles = useMemo(() => data?.pages.flatMap((page) => page.doodles) ?? [], [data?.pages])
  const hasDoodles = useMemo(() => doodles.length > 0, [doodles])

  const handleSubmit = useCallback(
    (event: React.FormEvent) => {
      event.preventDefault()
      const prompt = inputValue.trim()
      if (!prompt || isGenerating) {
        return
      }

      if (!isLoggedIn) {
        openLoginSheet(prompt)
        return
      }

      if (balance < 1) {
        openPurchaseSheet(prompt)
        return
      }

      generate(prompt)
    },
    [inputValue, isGenerating, isLoggedIn, openLoginSheet, generate, balance, openPurchaseSheet],
  )

  const handleInputChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value)
  }, [])

  return (
    <div className="flex min-h-[calc(100vh-var(--marketing-page-layout-header-height))] flex-col">
      <div className="flex min-h-[70vh] flex-col items-center justify-center px-4">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl dark:text-white">
            AI Doodle Generator
          </h1>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Create simple stick-figure illustrations instantly
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex w-full max-w-md items-center gap-2">
          <Input
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            placeholder={placeholderExample}
            maxLength={200}
            disabled={isGenerating}
            className="flex-1"
          />
          <Button
            type="submit"
            disabled={!inputValue.trim() || isGenerating}
            loading={isGenerating}
            icon="arrow-up"
            accessibilityLabel="Generate doodle"
          />
        </form>
      </div>

      {hasDoodles ? (
        <div className="w-full px-4 pb-8">
          <div className="mx-auto max-w-4xl">
            <DoodleGrid />
          </div>
        </div>
      ) : null}
    </div>
  )
}

export { DoodleGenerator }
