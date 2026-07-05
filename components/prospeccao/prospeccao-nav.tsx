"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

const ITEMS = [
    { href: "/prospeccao", label: "Dashboard" },
    { href: "/prospeccao/radar", label: "Radar" },
    { href: "/prospeccao/pipeline", label: "Pipeline" },
    { href: "/prospeccao/estrategias", label: "Estratégias" },
]

export function ProspeccaoNav() {
    const pathname = usePathname()

    return (
        <div className="inline-flex items-center gap-1 rounded-md border border-utility-border-subtle bg-background-surface p-1">
            {ITEMS.map((item) => {
                const isActive = item.href === "/prospeccao"
                    ? pathname === item.href
                    : pathname?.startsWith(item.href)

                return (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                            "rounded-sm px-3 py-1.5 text-sm font-mono-sm transition-colors",
                            isActive
                                ? "bg-brand-primary text-text-primary"
                                : "text-text-secondary hover:bg-white/5 hover:text-text-primary"
                        )}
                    >
                        {item.label}
                    </Link>
                )
            })}
        </div>
    )
}
