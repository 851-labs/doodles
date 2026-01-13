"use client"

import { useEffect, useState } from "react"

import { CubeAnimation } from "@/app/doodles/[id]/_components/cube-animation"
import { ProgressBar } from "@/app/doodles/[id]/_components/progress-bar"

const GENERATING_3D_MESSAGES = [
  "Analyzing sketch depth...",
  "Extruding dimensions...",
  "Calculating perspective...",
  "Sculpting vertices...",
  "Building mesh structure...",
  "Adding depth information...",
  "Rendering normals...",
  "Computing lighting angles...",
  "Generating polygons...",
  "Mapping textures...",
  "Creating surface details...",
  "Optimizing geometry...",
  "Smoothing edges...",
  "Refining contours...",
  "Processing depth map...",
  "Constructing 3D form...",
  "Adding dimensional data...",
  "Calculating surface normals...",
  "Building wireframe...",
  "Triangulating faces...",
  "Connecting vertices...",
  "Applying thickness...",
  "Generating silhouette...",
  "Computing shadows...",
  "Analyzing shape topology...",
  "Extruding outlines...",
  "Creating depth layers...",
  "Processing occlusion...",
  "Building spatial data...",
  "Refining mesh density...",
  "Smoothing surfaces...",
  "Optimizing triangles...",
  "Adding fine details...",
  "Computing curvature...",
  "Generating UV coords...",
  "Processing materials...",
  "Building 3D structure...",
  "Analyzing proportions...",
  "Creating volume data...",
  "Mapping relief depth...",
  "Sculpting form...",
  "Adding roundness...",
  "Computing intersections...",
  "Building solid model...",
  "Refining topology...",
  "Processing boundaries...",
  "Creating edge loops...",
  "Optimizing vertices...",
  "Adding subdivisions...",
  "Computing tangents...",
  "Generating manifold...",
  "Building closed mesh...",
  "Analyzing convexity...",
  "Creating smooth groups...",
  "Processing seams...",
  "Refining resolution...",
  "Adding geometric detail...",
  "Computing face normals...",
  "Building quad mesh...",
  "Optimizing density...",
  "Creating base mesh...",
  "Adding edge definition...",
  "Processing silhouettes...",
  "Generating height data...",
  "Computing depth values...",
  "Building layer stack...",
  "Refining edge flow...",
  "Adding surface tension...",
  "Processing creases...",
  "Creating sharp edges...",
  "Optimizing topology...",
  "Building smooth mesh...",
  "Analyzing surface quality...",
  "Adding mesh details...",
  "Computing vertex colors...",
  "Generating final model...",
  "Preparing for export...",
  "Almost there...",
  "Finalizing geometry...",
  "Polishing surfaces...",
]

const TYPING_SPEED = 50
const BACKSPACE_SPEED = 20
const PAUSE_BEFORE_BACKSPACE = 1500
const GENERATION_DURATION_SECONDS = 160

function useTypewriter(messages: string[]) {
  const [displayText, setDisplayText] = useState("")
  const [messageIndex, setMessageIndex] = useState(0)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    const currentMessage = messages[messageIndex] ?? ""

    if (!isDeleting) {
      if (displayText.length < currentMessage.length) {
        const timeout = setTimeout(() => {
          setDisplayText(currentMessage.slice(0, displayText.length + 1))
        }, TYPING_SPEED)
        return () => clearTimeout(timeout)
      }
      const timeout = setTimeout(() => {
        setIsDeleting(true)
      }, PAUSE_BEFORE_BACKSPACE)
      return () => clearTimeout(timeout)
    }

    if (displayText.length > 0) {
      const timeout = setTimeout(() => {
        setDisplayText(displayText.slice(0, -1))
      }, BACKSPACE_SPEED)
      return () => clearTimeout(timeout)
    }

    const timeout = setTimeout(() => {
      setIsDeleting(false)
      setMessageIndex((prev) => (prev + 1) % messages.length)
    }, 0)
    return () => clearTimeout(timeout)
  }, [displayText, isDeleting, messageIndex, messages])

  return displayText
}

interface Generating3DStateProps {
  startedAt: Date
}

function Generating3DState({ startedAt }: Generating3DStateProps) {
  const displayText = useTypewriter(GENERATING_3D_MESSAGES)

  return (
    <>
      <ProgressBar durationSeconds={GENERATION_DURATION_SECONDS} isComplete={false} startedAt={startedAt} />
      <div className="flex flex-col items-center gap-8">
        <CubeAnimation />
        <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
          {displayText}
          <span className="animate-pulse">|</span>
        </p>
      </div>
    </>
  )
}

export { Generating3DState }
