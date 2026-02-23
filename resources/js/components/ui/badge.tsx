import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-full border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden",
  {
    variants: {
      variant: {
        default:
          "chip-success [a&]:hover:bg-[color:var(--button-bg)] [a&]:hover:text-[color:var(--button-text)]",
        secondary:
          "border-transparent bg-[color:var(--button-bg)] text-[color:var(--button-text)] [a&]:hover:bg-[color:var(--button-bg-hover)]",
        destructive:
          "border-transparent bg-[color:var(--button-bg)] text-[color:var(--button-text)] [a&]:hover:bg-[color:var(--button-bg-hover)]",
        outline:
          "border-[color:var(--button-border)] text-[color:var(--button-bg)] [a&]:hover:bg-[color:var(--button-bg-soft)]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant,
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "span"

  return (
    <Comp
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }
