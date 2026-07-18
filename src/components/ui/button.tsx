"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-semibold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--nova-primary)]/50 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-[var(--nova-primary)] text-white hover:bg-[var(--nova-primary)]/90 shadow-lg shadow-[var(--nova-primary)]/20",
        destructive: "bg-red-600 text-white hover:bg-red-600/90 shadow-lg shadow-red-600/20",
        outline: "border border-white/10 bg-transparent hover:bg-white/5 text-white",
        secondary: "bg-white/5 text-white border border-white/10 hover:bg-white/10 hover:border-white/20",
        ghost: "hover:bg-white/5 hover:text-white text-slate-300",
        link: "text-[var(--nova-primary)] underline-offset-4 hover:underline",
        gradient: "px-8 py-4 bg-gradient-to-r from-[var(--nova-primary)] to-indigo-600 text-white font-semibold rounded-full hover:opacity-95 active:scale-95 transition-all duration-300 tracking-tight text-center shadow-lg shadow-[var(--nova-primary)]/20",
        accent: "px-8 py-4 bg-[var(--nova-secondary)] text-slate-950 font-bold rounded-full hover:bg-[#e09e12] active:scale-95 transition-all duration-300 tracking-tight text-center shadow-lg shadow-[var(--nova-secondary)]/10",
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