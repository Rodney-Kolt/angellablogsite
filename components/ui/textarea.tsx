import * as React from "react";
import { cn } from "@/lib/utils";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          "flex min-h-[80px] w-full rounded-2xl border-2 border-pink-200 bg-white/80 px-4 py-3 text-sm font-body ring-offset-background placeholder:text-pink-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-300 focus-visible:ring-offset-2 focus-visible:border-pink-400 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200 resize-none",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Textarea.displayName = "Textarea";

export { Textarea };
