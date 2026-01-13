"use client"

import { useCallback, useState } from "react"

import { Button } from "@851-labs/ui/components/button"
import { Input } from "@851-labs/ui/components/input"

import { useDoodleGenerate } from "@/app/_hooks/use-doodle-generate"

interface ErroredStateProps {
  prompt: string
}

function ErroredState({ prompt }: ErroredStateProps) {
  const { generate, isGenerating } = useDoodleGenerate()
  const [inputValue, setInputValue] = useState(prompt)

  const handleRetry = useCallback(() => {
    if (inputValue.trim() && !isGenerating) {
      generate(inputValue.trim())
    }
  }, [inputValue, isGenerating, generate])

  const handleInputChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value)
  }, [])

  const handleSubmit = useCallback(
    (event: React.FormEvent) => {
      event.preventDefault()
      handleRetry()
    },
    [handleRetry],
  )

  return (
    <div className="flex w-full flex-col items-center gap-6">
      <div className="relative aspect-square w-full overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-800">
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-gray-100 dark:bg-gray-900">
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Something went wrong</p>
          <Button variant="dark/gray" onClick={handleRetry} disabled={isGenerating} loading={isGenerating}>
            Try Again
          </Button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex w-full items-center gap-2">
        <Input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          placeholder={prompt}
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
  )
}

export { ErroredState }
