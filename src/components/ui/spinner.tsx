import { cn } from "@/lib/utils"

const LEAF_STYLE = cn(
  "animate-[spinner-leaf-fade_800ms_linear_infinite] absolute left-[calc(50%-12.5%/2)] top-0 h-full w-[12.5%]",
  "before:block before:h-[30%] before:w-full before:rounded-full before:bg-current before:text-inherit",
)

type Size = "md" | "lg"

interface SpinnerProps {
  size?: Size
  className?: string
}

function Spinner({ size = "md", className }: SpinnerProps) {
  return (
    <span
      data-slot="spinner"
      className={cn(
        "relative block opacity-65",
        size === "md" && "h-4 w-4",
        size === "lg" && "h-5 w-5",
        "text-gray-900 dark:text-gray-100",
        className,
      )}
    >
      <span className={cn(LEAF_STYLE, "rotate-0 [animation-delay:-800ms]")} />
      <span className={cn(LEAF_STYLE, "rotate-45 [animation-delay:-700ms]")} />
      <span className={cn(LEAF_STYLE, "rotate-90 [animation-delay:-600ms]")} />
      <span className={cn(LEAF_STYLE, "rotate-135 [animation-delay:-500ms]")} />
      <span className={cn(LEAF_STYLE, "rotate-180 [animation-delay:-400ms]")} />
      <span className={cn(LEAF_STYLE, "rotate-225 [animation-delay:-300ms]")} />
      <span className={cn(LEAF_STYLE, "rotate-270 [animation-delay:-200ms]")} />
      <span className={cn(LEAF_STYLE, "rotate-315 [animation-delay:-100ms]")} />
    </span>
  )
}

export { Spinner }
