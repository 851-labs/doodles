"use client"

import React from "react"

import { cn } from "@/lib/utils"
import { Spinner as SpinnerPrimitive } from "@/components/ui/spinner"

const SOLID_COLOR_BASE = [
  "border-transparent bg-(--btn-border)",
  "dark:bg-(--btn-bg)",
  "before:absolute before:inset-0 before:-z-10 before:rounded-[calc(var(--btn-radius)-1px)] before:bg-(--btn-bg)",
  "before:shadow",
  "dark:before:hidden",
  "dark:border-white/5",
  "after:absolute after:inset-0 after:-z-10 after:rounded-[calc(var(--btn-radius)-1px)]",
  "after:shadow-[inset_0_1px_--theme(--color-white/15%)]",
  "active:disabled:after:bg-transparent hover:disabled:after:bg-transparent",
  "active:data-loading:after:bg-transparent hover:data-loading:after:bg-transparent",
  "active:after:bg-(--btn-hover-overlay) hover:after:bg-(--btn-hover-overlay)",
  "dark:after:-inset-px dark:after:rounded-(--btn-radius)",
  "before:data-disabled:shadow-none after:data-disabled:shadow-none",
]

const BUTTON_STYLES = {
  base: [
    "rounded-(--btn-radius) data-pill:rounded-full",
    "group relative isolate inline-flex items-center justify-center border select-none",
    "disabled:opacity-50",
    "*:data-[slot=icon]:text-(--btn-icon) forced-colors:[--btn-icon:ButtonText] forced-colors:hover:[--btn-icon:ButtonText]",
    "data-icon-only:aspect-square",
    "transition-all duration-200 ease-out",
  ],
  size: {
    sm: [
      "text-sm/5 [--btn-radius:var(--radius-lg)] gap-x-1.5 font-semibold h-8",
      "px-[calc(--spacing(2.5)-1px)] py-[calc(--spacing(1.25)-1px)]",
      "*:data-[slot=icon]:-mx-0.5 *:data-[slot=icon]:my-0.5 *:data-[slot=icon]:size-4 *:data-[slot=icon]:shrink-0",
    ],
    md: [
      "text-sm/6 [--btn-radius:0.625rem] gap-x-2 font-semibold h-9",
      "px-[calc(--spacing(3)-1px)] py-[calc(--spacing(1.5)-1px)]",
      "*:data-[slot=icon]:-mx-0.5 *:data-[slot=icon]:shrink-0 *:data-[slot=icon]:my-1 *:data-[slot=icon]:size-4",
    ],
    lg: [
      "text-[1.0625rem]/7 [--btn-radius:var(--radius-xl)] gap-x-3 font-medium h-11",
      "px-[calc(--spacing(3)-1px)] py-[calc(--spacing(2)-1px)]",
      "*:data-[slot=icon]:-mx-0.5 *:data-[slot=icon]:my-0.5 *:data-[slot=icon]:size-5 *:data-[slot=icon]:shrink-0",
    ],
  },
  variant: {
    plain: [
      "border-transparent text-gray-950 active:bg-gray-950/5 hover:bg-gray-950/5",
      "dark:text-white dark:active:bg-white/10 dark:hover:bg-white/10",
      "[--btn-icon:var(--color-gray-500)] active:[--btn-icon:var(--color-gray-700)] hover:[--btn-icon:var(--color-gray-700)] dark:[--btn-icon:var(--color-gray-500)] dark:active:[--btn-icon:var(--color-gray-400)] dark:hover:[--btn-icon:var(--color-gray-400)]",
    ],
    ghost: [
      "border-transparent text-gray-950 bg-gray-100 active:bg-gray-200 data-[state=open]:bg-gray-200 hover:bg-gray-200",
      "dark:text-white dark:bg-gray-800 dark:data-[state=open]:bg-gray-700 dark:active:bg-gray-700 dark:hover:bg-gray-700",
      "[--btn-icon:var(--color-gray-500)] active:[--btn-icon:var(--color-gray-700)] hover:[--btn-icon:var(--color-gray-700)] data-[state=open]:[--btn-icon:var(--color-gray-700)]",
      "dark:[--btn-icon:var(--color-gray-500)] dark:active:[--btn-icon:var(--color-gray-400)] dark:hover:[--btn-icon:var(--color-gray-400)] dark:data-[state=open]:[--btn-icon:var(--color-gray-400)]",
    ],
    "dark/gray": [
      ...SOLID_COLOR_BASE,
      "**:data-[slot=spinner]:invert dark:**:data-[slot=spinner]:invert-0",
      "text-white [--btn-bg:var(--color-gray-900)] [--btn-border:var(--color-gray-950)]/90 [--btn-hover-overlay:var(--color-white)]/10",
      "dark:text-white dark:[--btn-bg:var(--color-gray-600)] dark:[--btn-hover-overlay:var(--color-white)]/5",
      "[--btn-icon:var(--color-gray-400)] active:[--btn-icon:var(--color-gray-300)] hover:[--btn-icon:var(--color-gray-300)]",
    ],
    light: [
      ...SOLID_COLOR_BASE,
      "text-gray-950 [--btn-bg:white] [--btn-border:var(--color-gray-950)]/10 [--btn-hover-overlay:var(--color-gray-950)]/2.5 active:[--btn-border:var(--color-gray-950)]/15 hover:[--btn-border:var(--color-gray-950)]/15",
      "dark:text-white dark:[--btn-hover-overlay:var(--color-white)]/5 dark:[--btn-bg:var(--color-gray-800)]",
      "[--btn-icon:var(--color-gray-500)] active:[--btn-icon:var(--color-gray-700)] hover:[--btn-icon:var(--color-gray-700)] dark:[--btn-icon:var(--color-gray-500)] dark:active:[--btn-icon:var(--color-gray-400)] dark:hover:[--btn-icon:var(--color-gray-400)]",
    ],
  },
}

function ButtonSpinner() {
  return (
    <span aria-hidden className={cn("absolute inset-1 flex items-center justify-center bg-(--btn-bg)")}>
      <SpinnerPrimitive />
    </span>
  )
}

type ButtonVariant = keyof typeof BUTTON_STYLES.variant
type ButtonSize = keyof typeof BUTTON_STYLES.size

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  loading?: boolean
  pill?: boolean
  icon?: React.ReactNode
  accessibilityLabel?: string
}

function Button({
  variant = "dark/gray",
  size = "md",
  className,
  children,
  icon,
  loading = false,
  pill = false,
  disabled: _disabled = false,
  accessibilityLabel,
  ...props
}: ButtonProps) {
  const disabled = _disabled || loading
  const iconOnly = !children && !!icon

  return (
    <button
      disabled={disabled}
      aria-label={accessibilityLabel}
      data-pill={pill ? "" : undefined}
      data-loading={loading ? "" : undefined}
      data-icon-only={iconOnly ? "" : undefined}
      className={cn(
        BUTTON_STYLES.base,
        BUTTON_STYLES.variant[variant],
        BUTTON_STYLES.size[size],
        "cursor-default",
        className,
      )}
      {...props}
    >
      {icon ? <span data-slot="icon">{icon}</span> : null}
      {children ? <span className="line-clamp-1">{children}</span> : null}
      {loading ? <ButtonSpinner /> : null}
    </button>
  )
}

export { Button }
export type { ButtonProps }
