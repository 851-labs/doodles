import NextLink from "next/link"
import React from "react"

import { cn } from "@/lib/utils"

type LinkProps = React.ComponentProps<typeof NextLink>

function Link({ className, ...props }: LinkProps) {
  return (
    <NextLink
      className={cn(
        "rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 dark:focus-visible:ring-gray-300",
        className,
      )}
      {...props}
    />
  )
}

export { Link }
