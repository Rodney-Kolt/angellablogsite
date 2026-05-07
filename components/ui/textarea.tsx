import * as React from "react";
import { cn } from "@/lib/utils";

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => (
    <textarea
      className={cn(
        "flex min-h-[80px] w-full rounded-xl border-2 border-aqua-200 bg-white/80 px-4 py-3 text-sm font-body text-navy placeholder:text-aqua-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-aqua-300 focus-visible:border-aqua-400 disabled:cursor-not-allowed disabled:opacity-50 transition-all resize-none",
        className
      )}
      ref={ref}
      {...props}
    />
  )
);
Textarea.displayName = "Textarea";

export { Textarea };
