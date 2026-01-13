"use client"

import { useCallback, useState } from "react"

import { Button } from "@851-labs/ui/components/button"
import { Input } from "@851-labs/ui/components/input"
import { toast } from "@851-labs/ui/components/toast"

import { useDoodleGenerate } from "@/app/_hooks/use-doodle-generate"

interface DoodleActionsButtonsProps {
  prompt: string
  imageUrl: string
  doodleUrl: string
}

function DoodleActionsButtons({ prompt, imageUrl, doodleUrl }: DoodleActionsButtonsProps) {
  const handleShare = useCallback(async () => {
    const canShare = typeof navigator.share === "function"
    if (canShare) {
      await navigator.share({
        title: prompt,
        url: doodleUrl,
      })
    } else {
      await navigator.clipboard.writeText(doodleUrl)
      toast.success("Link copied to clipboard")
    }
  }, [prompt, doodleUrl])

  const handleDownload = useCallback(async () => {
    const response = await fetch(imageUrl)
    const blob = await response.blob()
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `${prompt.replace(/\s+/g, "-").toLowerCase()}.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }, [imageUrl, prompt])

  return (
    <div className="flex items-center gap-1">
      <Button variant="ghost" size="sm" onClick={handleShare} icon="share" accessibilityLabel="Share doodle" />
      <Button
        variant="ghost"
        size="sm"
        onClick={handleDownload}
        icon="arrow-down-tray"
        accessibilityLabel="Download doodle"
      />
    </div>
  )
}

interface DoodleActionsInputProps {
  prompt: string
}

function DoodleActionsInput({ prompt }: DoodleActionsInputProps) {
  const { generate, isGenerating } = useDoodleGenerate()
  const [inputValue, setInputValue] = useState(prompt)

  const handleSubmit = useCallback(
    (event: React.FormEvent) => {
      event.preventDefault()
      if (inputValue.trim() && !isGenerating) {
        generate(inputValue.trim())
      }
    },
    [inputValue, isGenerating, generate],
  )

  const handleInputChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value)
  }, [])

  return (
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
  )
}

export { DoodleActionsButtons, DoodleActionsInput }
