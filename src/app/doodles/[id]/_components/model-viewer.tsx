"use client"

import { memo, useEffect, useRef } from "react"

interface ModelViewerProps {
  modelUrl: string
  posterUrl?: string
  alt: string
}

function ModelViewerComponent({ modelUrl, posterUrl, alt }: ModelViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    void import("@google/model-viewer")
  }, [])

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const viewer = document.createElement("model-viewer")
    viewer.setAttribute("src", modelUrl)
    if (posterUrl) {
      viewer.setAttribute("poster", posterUrl)
    }
    viewer.setAttribute("alt", alt)
    viewer.setAttribute("auto-rotate", "")
    viewer.setAttribute("camera-controls", "")
    viewer.setAttribute("shadow-intensity", "1")
    viewer.setAttribute("exposure", "1")
    viewer.style.width = "100%"
    viewer.style.height = "100%"

    container.appendChild(viewer)

    return () => {
      container.removeChild(viewer)
    }
  }, [modelUrl, posterUrl, alt])

  return <div ref={containerRef} className="h-full w-full" />
}

const ModelViewer = memo(ModelViewerComponent)

export { ModelViewer }
