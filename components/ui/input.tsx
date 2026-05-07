import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => (
    <input
      type={type}
      className={cn(
        "flex h-10 w-full rounded-xl border-2 border-aqua-200 bg-white/80 px-4 py-2 text-sm font-body text-navy placeholder:text-aqua-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-aqua-300 focus-visible:border-aqua-400 disabled:cursor-not-allowed disabled:opacity-50 transition-all",
        className
      )}
      ref={ref}
      {...props}
    />
  )
);
Input.displayName = "Input";

export { Input };
