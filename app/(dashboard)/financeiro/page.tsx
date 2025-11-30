import { KPICard } from "@/components/features/kpi-card";
import { LineChart } from "@/components/charts/line-chart";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Grid, Col } from "@/components/layout/grid";
import { DollarSign, TrendingUp, TrendingDown, Activity } from "lucide-react";
import { mockFinanceiro, mockFluxoCaixa, mockParcelas } from "@/lib/mock-data";
import { Badge } from "@/components/ui/badge";

function getStatusColor(status: string) {
    switch (status) {
        case "pendente": return "bg-yellow-500/20 text-yellow-500 border-yellow-500/50";
        case "atrasada": return "bg-red-500/20 text-red-500 border-red-500/50";
        case "paga": return "bg-green-500/20 text-green-500 border-green-500/50";
        default: return "bg-gray-500/20 text-gray-500";
    }
}

export default function FinanceiroPage() {
    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="space-y-2">
                <h1 className="text-display-xl font-sans text-text-primary">Financeiro</h1>
                <p className="text-text-secondary font-mono">Controle de receitas, despesas e previsões</p>
            </div>

            {/* KPIs */}
            <Grid cols={4}>
                <Col span={1}>
                    <KPICard
                        title="Receita Recebida"
                        value={mockFinanceiro.receitaRecebida.value.toLocaleString('pt-BR')}
                        change={mockFinanceiro.receitaRecebida.change}
                        icon={<DollarSign className="h-4 w-4" />}
                        format="currency"
                    />
                </Col>
                <Col span={1}>
                    <KPICard
                        title="Receita Prevista"
                        value={mockFinanceiro.receitaPrevista.value.toLocaleString('pt-BR')}
                        change={mockFinanceiro.receitaPrevista.change}
                        icon={<TrendingUp className="h-4 w-4" />}
                        format="currency"
                    />
                </Col>
                <Col span={1}>
                    <KPICard
                        title="Lucro"
                        value={mockFinanceiro.lucro.value.toLocaleString('pt-BR')}
                        change={mockFinanceiro.lucro.change}
                        icon={<Activity className="h-4 w-4" />}
                        format="currency"
                    />
                </Col>
                <Col span={1}>
                    <KPICard
                        title="Burn Rate"
                        value={mockFinanceiro.burnRate.value.toLocaleString('pt-BR')}
                        change={mockFinanceiro.burnRate.change}
                        icon={<TrendingDown className="h-4 w-4" />}
                        format="currency"
                    />
                </Col>
            </Grid>

            {/* Cash Flow Chart */}
            <Card>
                <CardHeader>
                    <CardTitle>Fluxo de Caixa</CardTitle>
                    <CardDescription>Comparação de entradas vs saídas - Últimos 6 meses</CardDescription>
                </CardHeader>
                <CardContent>
                    <LineChart
                        data={mockFluxoCaixa}
                        xKey="mes"
                        lines={[
                            { key: "entradas", color: "#10B981", name: "Entradas" },
                            { key: "saidas", color: "#EF4444", name: "Saídas" }
                        ]}
                        height={350}
                    />
                </CardContent>
            </Card>

            {/* Parcelas Pendentes */}
            <Card>
                <CardHeader>
                    <CardTitle>Parcelas Pendentes</CardTitle>
                    <CardDescription>Próximos vencimentos e atrasos</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Cliente</TableHead>
                                <TableHead>Valor</TableHead>
                                <TableHead>Vencimento</TableHead>
                                <TableHead>Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {mockParcelas.map((parcela) => (
                                <TableRow key={parcela.id}>
                                    <TableCell className="font-medium">{parcela.cliente}</TableCell>
                                    <TableCell className="font-mono">R$ {parcela.valor.toLocaleString('pt-BR')}</TableCell>
                                    <TableCell className="font-mono text-sm">{parcela.vencimento}</TableCell>
                                    <TableCell>
                                        <Badge variant="outline" className={getStatusColor(parcela.status)}>
                                            {parcela.status}
                                        </Badge>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
