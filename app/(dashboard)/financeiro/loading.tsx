import { KPICardSkeleton, TableRowSkeleton } from "@/components/ui/skeleton-elements"
import { Grid, Col } from "@/components/layout/grid"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

export default function FinanceiroLoading() {
    return (
        <div className="space-y-8">
            {/* Header Placeholder */}
            <div className="flex items-center justify-between">
                <div className="space-y-2">
                    <div className="h-8 w-48 animate-pulse rounded-md bg-utility-border-subtle" />
                    <div className="h-4 w-64 animate-pulse rounded-md bg-utility-border-subtle" />
                </div>
                <div className="h-10 w-32 animate-pulse rounded-md bg-utility-border-subtle" />
            </div>

            {/* KPI Skeletons */}
            <Grid cols={4}>
                {[1, 2, 3, 4].map((i) => (
                    <Col key={i} span={1}>
                        <KPICardSkeleton />
                    </Col>
                ))}
            </Grid>

            {/* Table Skeleton */}
            <Card>
                <CardHeader>
                    <CardTitle>Transações Recentes</CardTitle>
                    <CardDescription>Carregando movimentações...</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-2">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <TableRowSkeleton key={i} />
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
