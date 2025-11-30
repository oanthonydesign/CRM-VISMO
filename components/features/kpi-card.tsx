import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

interface KPICardProps {
    title: string;
    value: string | number;
    change?: number;
    icon?: React.ReactNode;
    format?: "currency" | "number" | "percentage";
}

export function KPICard({ title, value, change, icon, format = "number" }: KPICardProps) {
    const getTrendIcon = () => {
        if (change === undefined || change === 0) return <Minus className="h-4 w-4 text-text-secondary" />;
        if (change > 0) return <TrendingUp className="h-4 w-4 text-green-500" />;
        return <TrendingDown className="h-4 w-4 text-red-500" />;
    };

    const getTrendColor = () => {
        if (change === undefined || change === 0) return "text-text-secondary";
        if (change > 0) return "text-green-500";
        return "text-red-500";
    };

    return (
        <Card className="hover:border-utility-border-strong transition-colors">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-text-secondary font-mono uppercase">
                    {title}
                </CardTitle>
                {icon && <div className="text-text-secondary">{icon}</div>}
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold text-text-primary">
                    {format === "currency" && "R$ "}
                    {value}
                    {format === "percentage" && "%"}
                </div>
                {change !== undefined && (
                    <div className={cn("flex items-center gap-1 text-xs font-medium mt-2", getTrendColor())}>
                        {getTrendIcon()}
                        <span>{Math.abs(change)}% vs mês anterior</span>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
