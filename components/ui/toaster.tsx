"use client"

import { Toaster as Sonner } from "sonner"

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps) => {
    return (
        <Sonner
            theme="dark"
            className="toaster group"
            position="top-right"
            toastOptions={{
                classNames: {
                    toast:
                        "group toast group-[.toaster]:bg-background-elevated group-[.toaster]:text-text-primary group-[.toaster]:border-utility-border-subtle group-[.toaster]:shadow-lg",
                    description: "group-[.toast]:text-text-secondary",
                    actionButton:
                        "group-[.toast]:bg-brand-primary group-[.toast]:text-white",
                    cancelButton:
                        "group-[.toast]:bg-background-surface group-[.toast]:text-text-secondary",
                    error: "group-[.toast]:bg-red-500/10 group-[.toast]:text-red-500 group-[.toast]:border-red-500/20",
                    success: "group-[.toast]:bg-green-500/10 group-[.toast]:text-green-500 group-[.toast]:border-green-500/20",
                    warning: "group-[.toast]:bg-yellow-500/10 group-[.toast]:text-yellow-500 group-[.toast]:border-yellow-500/20",
                    info: "group-[.toast]:bg-blue-500/10 group-[.toast]:text-blue-500 group-[.toast]:border-blue-500/20",
                },
            }}
            {...props}
        />
    )
}

export { Toaster }
