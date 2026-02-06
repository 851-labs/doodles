"use client"

interface DoodleImageProps {
  src: string
  alt: string
  className?: string
}

function DoodleImage({ src, alt, className = "" }: DoodleImageProps) {
  return (
    // eslint-disable-next-line @next/next/no-img-element -- PNG doodles need CSS invert filter for dark mode, not supported by optimized Image
    <img src={src} alt={alt} className={`dark:invert ${className}`} draggable={false} />
  )
}

export { DoodleImage }
