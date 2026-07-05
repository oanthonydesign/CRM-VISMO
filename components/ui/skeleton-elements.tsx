import { cn } from "@/lib/utils"

function Skeleton({
    className,
    ...props
}: React.HTMLAttributes<HTMLDivElement>) {
    return (
        <div
            className={cn("animate-pulse rounded-md bg-utility-border-subtle", className)}
            {...props}
        />
    )
}

export function KPICardSkeleton() {
    return (
        <div className="rounded-xl border border-utility-border-subtle bg-background-surface p-6 shadow-sm">
            <div className="flex items-center justify-between space-y-0 pb-2">
                <Skeleton className="h-4 w-[100px]" />
                <Skeleton className="h-4 w-4 rounded-full" />
            </div>
            <div className="space-y-3">
                <Skeleton className="h-8 w-[140px]" />
                <Skeleton className="h-3 w-[80px]" />
            </div>
        </div>
    )
}

export function TableRowSkeleton() {
    return (
        <div className="flex items-center space-x-4 py-4">
            <Skeleton className="h-4 w-[100px]" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-[80px]" />
            <Skeleton className="h-4 w-[60px]" />
        </div>
    )
}

export { Skeleton }
