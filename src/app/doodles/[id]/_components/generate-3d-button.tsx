"use client"

import { memo } from "react"

import { Button } from "@851-labs/ui/components/button"

import { LIGHTBOX_3D_CREDIT_COST } from "@/utils/constants"

interface Generate3DButtonProps {
  onClick: () => void
  isLoading: boolean
}

function Generate3DButtonComponent({ onClick, isLoading }: Generate3DButtonProps) {
  return (
    <div className="flex flex-col items-center gap-2">
      <Button onClick={onClick} loading={isLoading} disabled={isLoading}>
        Generate 3D Model
      </Button>
      <span className="text-xs text-gray-500 dark:text-gray-400">{LIGHTBOX_3D_CREDIT_COST} credits</span>
    </div>
  )
}

const Generate3DButton = memo(Generate3DButtonComponent)

export { Generate3DButton }
