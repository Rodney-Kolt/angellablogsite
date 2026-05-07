import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-body font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-aqua-400 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:     "bg-aqua-200 text-navy hover:bg-aqua-300 hover:scale-105 active:scale-95 shadow-soft",
        coral:       "bg-coral-300 text-white hover:bg-coral-400 hover:scale-105 active:scale-95 shadow-soft",
        outline:     "border-2 border-dashed border-aqua-300 bg-white/80 text-navy hover:bg-aqua-50 hover:scale-105",
        ghost:       "text-navy-muted hover:bg-aqua-100 hover:text-navy hover:scale-105",
        destructive: "bg-red-400 text-white hover:bg-red-500 hover:scale-105",
        link:        "text-coral-400 underline-offset-4 hover:underline p-0 h-auto",
        // keep old aliases
        secondary:   "bg-aqua-100 text-navy hover:bg-aqua-200 hover:scale-105",
        neon:        "bg-aqua-200 text-navy hover:bg-aqua-300 hover:scale-105 shadow-soft",
        girly:       "bg-coral-300 text-white hover:bg-coral-400 hover:scale-105 shadow-soft",
      },
      size: {
        default: "h-10 px-6 py-2",
        sm:      "h-8 px-4 text-xs",
        lg:      "h-12 px-8 text-base",
        icon:    "h-10 w-10",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
