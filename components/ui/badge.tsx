import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium font-sans transition-colors",
  {
    variants: {
      variant: {
        default:     "bg-blue-100 text-blue-700 border border-blue-200",
        secondary:   "bg-slate-100 text-slate-600 border border-slate-200",
        destructive: "bg-red-100 text-red-700 border border-red-200",
        outline:     "border border-slate-300 text-slate-600",
        // keep old aliases
        diary:       "bg-blue-100 text-blue-700 border border-blue-200",
        neon:        "bg-blue-100 text-blue-700 border border-blue-200",
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
