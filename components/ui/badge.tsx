import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-3 py-0.5 text-xs font-body font-semibold transition-colors",
  {
    variants: {
      variant: {
        default:     "bg-aqua-200 text-navy border border-aqua-300",
        secondary:   "bg-sky-light text-navy border border-sky-soft",
        destructive: "bg-red-100 text-red-700 border border-red-200",
        outline:     "border-2 border-dashed border-aqua-300 text-navy",
        coral:       "bg-coral-100 text-coral-600 border border-coral-200",
        // keep old aliases
        diary:       "bg-aqua-100 text-navy border border-aqua-300",
        neon:        "bg-aqua-200 text-navy border border-aqua-300",
      },
    },
    defaultVariants: { variant: "default" },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
