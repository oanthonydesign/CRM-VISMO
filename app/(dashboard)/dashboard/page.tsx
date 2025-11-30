import { KPICard } from "@/components/features/kpi-card";
import { LineChart } from "@/components/charts/line-chart";
import { BarChart } from "@/components/charts/bar-chart";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Grid, Col } from "@/components/layout/grid";
import { DollarSign, FileText, TrendingUp, Target } from "lucide-react";
import { mockKPIs, mockReceitaChart, mockFunil, mockAtividades } from "@/lib/mock-data";

export default function DashboardPage() {
    const funilData = [
        { etapa: "Descoberta", quantidade: mockFunil.descoberta },
        { etapa: "Diagnóstico", quantidade: mockFunil.diagnostico },
        { etapa: "Proposta", quantidade: mockFunil.proposta },
        { etapa: "Negociação", quantidade: mockFunil.negociacao },
        { etapa: "Fechado", quantidade: mockFunil.fechado },
    ];

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="space-y-2">
                <h1 className="text-display-xl font-sans text-text-primary">Dashboard</h1>
                <p className="text-text-secondary font-mono">Visão geral da operação</p>
            </div>

            {/* KPIs */}
            <Grid cols={4}>
                <Col span={1}>
                    <KPICard
                        title="Receita do Mês"
                        value={mockKPIs.receitaMes.value.toLocaleString('pt-BR')}
                        change={mockKPIs.receitaMes.change}
                        icon={<DollarSign className="h-4 w-4" />}
                        format="currency"
                    />
                </Col>
                <Col span={1}>
                    <KPICard
                        title="Contratos Ativos"
                        value={mockKPIs.contratosAtivos.value}
                        change={mockKPIs.contratosAtivos.change}
                        icon={<FileText className="h-4 w-4" />}
                    />
                </Col>
                <Col span={1}>
                    <KPICard
                        title="Oportunidades"
                        value={mockKPIs.oportunidadesAbertas.value}
                        change={mockKPIs.oportunidadesAbertas.change}
                        icon={<TrendingUp className="h-4 w-4" />}
                    />
                </Col>
                <Col span={1}>
                    <KPICard
                        title="Taxa Fechamento"
                        value={mockKPIs.taxaFechamento.value}
                        change={mockKPIs.taxaFechamento.change}
                        icon={<Target className="h-4 w-4" />}
                        format="percentage"
                    />
                </Col>
            </Grid>

            {/* Charts */}
            <Grid cols={2}>
                <Col span={1}>
                    <Card>
                        <CardHeader>
                            <CardTitle>Evolução de Receita</CardTitle>
                            <CardDescription>Últimos 6 meses</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <LineChart
                                data={mockReceitaChart}
                                xKey="mes"
                                lines={[{ key: "receita", color: "#FE3C00", name: "Receita" }]}
                                height={300}
                            />
                        </CardContent>
                    </Card>
                </Col>
                <Col span={1}>
                    <Card>
                        <CardHeader>
                            <CardTitle>Pipeline de Vendas</CardTitle>
                            <CardDescription>Oportunidades por etapa</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <BarChart
                                data={funilData}
                                xKey="etapa"
                                bars={[{ key: "quantidade", color: "#FE3C00", name: "Qtd" }]}
                                height={300}
                            />
                        </CardContent>
                    </Card>
                </Col>
            </Grid>

            {/* Recent Activities */}
            <Card>
                <CardHeader>
                    <CardTitle>Atividades Recentes</CardTitle>
                    <CardDescription>Últimas interações com clientes</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Tipo</TableHead>
                                <TableHead>Empresa</TableHead>
                                <TableHead>Descrição</TableHead>
                                <TableHead>Data</TableHead>
                                <TableHead>Responsável</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {mockAtividades.map((atividade) => (
                                <TableRow key={atividade.id}>
                                    <TableCell className="font-mono uppercase text-xs">{atividade.tipo}</TableCell>
                                    <TableCell className="font-medium">{atividade.empresa}</TableCell>
                                    <TableCell className="text-text-secondary">{atividade.descricao}</TableCell>
                                    <TableCell className="font-mono text-sm">{atividade.data}</TableCell>
                                    <TableCell>{atividade.responsavel}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
