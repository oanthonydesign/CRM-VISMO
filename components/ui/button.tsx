import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
    "inline-flex items-center justify-center whitespace-nowrap rounded-pill text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
    {
        variants: {
            variant: {
                default: "bg-brand-primary text-text-primary hover:bg-brand-primary-hover hover:shadow-glow-brand transform hover:-translate-y-0.5 transition-all duration-200",
                destructive:
                    "bg-red-500 text-destructive-foreground hover:bg-red-500/90",
                outline:
                    "border border-utility-border-subtle bg-transparent hover:bg-white/5 hover:border-text-primary text-text-primary",
                secondary:
                    "bg-secondary text-secondary-foreground hover:bg-secondary/80",
                ghost: "hover:bg-accent hover:text-accent-foreground text-text-secondary hover:text-text-primary",
                link: "text-primary underline-offset-4 hover:underline",
            },
            size: {
                default: "h-10 px-6 py-2",
                sm: "h-9 rounded-md px-3",
                lg: "h-11 rounded-md px-8",
                icon: "h-10 w-10",
            },
            font: {
                default: "font-mono-sm",
                sans: "font-sans",
            }
        },
        defaultVariants: {
            variant: "default",
            size: "default",
            font: "default",
        },
    }
)

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
    asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant, size, font, asChild = false, ...props }, ref) => {
        const Comp = asChild ? Slot : "button"
        return (
            <Comp
                className={cn(buttonVariants({ variant, size, font, className }))}
                ref={ref}
                {...props}
            />
        )
    }
)
Button.displayName = "Button"

export { Button, buttonVariants }
