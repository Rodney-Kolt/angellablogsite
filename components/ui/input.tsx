import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-2xl border-2 border-pink-200 bg-white/80 px-4 py-2 text-sm font-body ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-pink-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-300 focus-visible:ring-offset-2 focus-visible:border-pink-400 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };
