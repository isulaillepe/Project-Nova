"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--nova-secondary)]/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[#001233] disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        // Solid sun-gold fill on deep midnight text — the divine focus action
        default:
          "bg-[var(--nova-secondary)] text-[#001233] font-bold hover:brightness-105 hover:scale-[1.02] active:scale-[0.98] shadow-[0_6px_24px_rgba(255,184,27,0.25)]",
        destructive: "bg-red-600 text-white hover:bg-red-600/90 hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-red-600/20",
        outline:
          "border border-[var(--nova-secondary)]/30 bg-transparent text-[var(--nova-linen)] hover:border-[var(--nova-secondary)]/70 hover:bg-[var(--nova-secondary)]/5 hover:scale-[1.02] active:scale-[0.98]",
        secondary:
          "bg-[var(--nova-blue)]/20 text-[var(--nova-linen)] border border-[var(--nova-blue)]/40 hover:bg-[var(--nova-blue)]/30 hover:border-[var(--nova-secondary)]/40 hover:scale-[1.02] active:scale-[0.98]",
        ghost: "hover:bg-[var(--nova-secondary)]/10 hover:text-[var(--nova-secondary)] text-[var(--nova-slate)]",
        link: "text-[var(--nova-secondary)] underline-offset-4 hover:underline",
        // gradient now reads as a burnished-gold fill with spring scaling
        gradient:
          "px-8 py-4 bg-[var(--nova-secondary)] text-[#001233] font-bold rounded-full hover:brightness-105 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 tracking-tight text-center shadow-[0_6px_24px_rgba(255,184,27,0.28)]",
        accent:
          "px-8 py-4 bg-[var(--nova-secondary)] text-[#001233] font-bold rounded-full hover:brightness-105 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 tracking-tight text-center shadow-[0_6px_24px_rgba(255,184,27,0.2)]",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-full px-3",
        lg: "h-11 rounded-full px-8",
        xl: "h-12 rounded-full px-10 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
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
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };