import { cn } from "@/lib/utils";
import React from "react";

interface GridProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
    className?: string;
    cols?: number;
}

export function Grid({ children, className, cols = 12, ...props }: GridProps) {
    return (
        <div
            className={cn(
                "grid gap-6",
                cols === 12 && "grid-cols-12",
                cols === 4 && "grid-cols-4",
                cols === 2 && "grid-cols-2",
                cols === 1 && "grid-cols-1",
                className
            )}
            {...props}
        >
            {children}
        </div>
    );
}

interface ColProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
    className?: string;
    span?: number;
}

export function Col({ children, className, span = 12, ...props }: ColProps) {
    return (
        <div
            className={cn(
                span === 12 && "col-span-12",
                span === 11 && "col-span-11",
                span === 10 && "col-span-10",
                span === 9 && "col-span-9",
                span === 8 && "col-span-8",
                span === 7 && "col-span-7",
                span === 6 && "col-span-6",
                span === 5 && "col-span-5",
                span === 4 && "col-span-4",
                span === 3 && "col-span-3",
                span === 2 && "col-span-2",
                span === 1 && "col-span-1",
                className
            )}
            {...props}
        >
            {children}
        </div>
    );
}
