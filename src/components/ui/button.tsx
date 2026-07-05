"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap font-semibold transition-all duration-200 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        // Primary CTA — Emerald #047857, WCAG AA 5.9:1
        cta: "bg-[#047857] text-white shadow-[0_1px_2px_rgba(4,120,87,0.3),0_4px_12px_-2px_rgba(4,120,87,0.25)] hover:bg-[#065F46] hover:shadow-[0_2px_4px_rgba(4,120,87,0.3),0_8px_20px_-4px_rgba(4,120,87,0.35)] hover:-translate-y-px focus-visible:ring-[#047857]",
        // Secondary outline
        outline: "border border-[#E2E8F0] bg-white text-[#0F2044] hover:bg-[#F8FAFC] hover:border-[#CBD5E1] focus-visible:ring-[#047857]",
        // Navy filled
        navy: "bg-[#0F2044] text-white hover:bg-[#1a3366] focus-visible:ring-[#0F2044]",
        // Ghost
        ghost: "text-[#475569] hover:bg-[#F1F5F9] focus-visible:ring-[#047857]",
        // Destructive
        destructive: "bg-[#DC2626] text-white hover:bg-[#B91C1C] focus-visible:ring-[#DC2626]",
      },
      size: {
        default: "h-11 px-6 py-2 text-sm rounded-[8px]",
        sm: "h-9 px-4 text-sm rounded-[8px]",
        lg: "h-13 px-8 text-base rounded-[8px]",
        icon: "h-10 w-10 rounded-[8px]",
      },
    },
    defaultVariants: {
      variant: "cta",
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
