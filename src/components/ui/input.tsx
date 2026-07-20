import * as React from "react";
import { cn } from "@/lib/utils";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-lg border border-[#003599]/40 bg-[#002066]/30 px-3 py-2 text-sm text-[var(--nova-linen)] transition-all duration-200 file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-[#cbd5e0]/40 focus:outline-none focus:border-[#FFB81B] focus:ring-1 focus:ring-[#FFB81B] focus:shadow-[0_0_18px_rgba(255,184,27,0.2)] focus:bg-[#002066]/50 disabled:cursor-not-allowed disabled:opacity-50",
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