import { KPICard } from "@/components/features/kpi-card";
import { LineChart } from "@/components/charts/line-chart";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Grid, Col } from "@/components/layout/grid";
import { DollarSign, TrendingUp, TrendingDown, Activity } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { createClient } from "@/lib/supabase/server";
import { calcularKPIs } from "@/lib/utils/kpis";

function getStatusColor(status: string) {
    switch (status) {
        case "pendente": return "bg-yellow-500/20 text-yellow-500 border-yellow-500/50";
        case "atrasada": return "bg-red-500/20 text-red-500 border-red-500/50";
        case "pago": return "bg-green-500/20 text-green-500 border-green-500/50";
        default: return "bg-gray-500/20 text-gray-500";
    }
}

export default async function FinanceiroPage() {
    const supabase = await createClient();
    const kpis = await calcularKPIs();

    // Buscar parcelas pendentes
    const { data: parcelas } = await supabase
        .from('parcelas')
        .select(`
            *,
            contrato:contratos(
                empresa:empresas(nome)
            )
        `)
        .in('status', ['pendente', 'atrasada'])
        .order('data_vencimento', { ascending: true })
        .limit(10);

    // Buscar dados para o gráfico de fluxo de caixa (últimos 6 meses)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const { data: transacoes } = await supabase
        .from('entradas_saidas')
        .select('*')
        .gte('data_transacao', sixMonthsAgo.toISOString())
        .order('data_transacao', { ascending: true });

    // Processar dados para o gráfico
    const chartData = processChartData(transacoes || []);

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
                        value={kpis.receita_mes.toLocaleString('pt-BR')}
                        change={0} // TODO: Calcular variação
                        icon={<DollarSign className="h-4 w-4" />}
                        format="currency"
                    />
                </Col>
                <Col span={1}>
                    <KPICard
                        title="Receita Prevista"
                        value={kpis.receita_prevista.toLocaleString('pt-BR')}
                        change={0}
                        icon={<TrendingUp className="h-4 w-4" />}
                        format="currency"
                    />
                </Col>
                <Col span={1}>
                    <KPICard
                        title="Lucro (Caixa)"
                        value={kpis.caixa_atual.toLocaleString('pt-BR')}
                        change={0}
                        icon={<Activity className="h-4 w-4" />}
                        format="currency"
                    />
                </Col>
                <Col span={1}>
                    <KPICard
                        title="Burn Rate"
                        value={kpis.burn_rate.toLocaleString('pt-BR')}
                        change={0}
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
                        data={chartData}
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
                            {parcelas?.map((parcela) => (
                                <TableRow key={parcela.id}>
                                    <TableCell className="font-medium">
                                        {parcela.contrato?.empresa?.nome || '—'}
                                    </TableCell>
                                    <TableCell className="font-mono">
                                        R$ {parcela.valor.toLocaleString('pt-BR')}
                                    </TableCell>
                                    <TableCell className="font-mono text-sm">
                                        {new Date(parcela.data_vencimento).toLocaleDateString('pt-BR')}
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline" className={getStatusColor(parcela.status)}>
                                            {parcela.status}
                                        </Badge>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {(!parcelas || parcelas.length === 0) && (
                                <TableRow>
                                    <TableCell colSpan={4} className="text-center py-8 text-text-secondary">
                                        Nenhuma parcela pendente.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}

function processChartData(transacoes: any[]) {
    const months: { [key: string]: { mes: string, entradas: number, saidas: number } } = {};

    // Initialize last 6 months
    for (let i = 5; i >= 0; i--) {
        const d = new Date();
        d.setMonth(d.getMonth() - i);
        const key = `${d.getFullYear()}-${d.getMonth()}`;
        const label = d.toLocaleString('pt-BR', { month: 'short' });
        months[key] = { mes: label, entradas: 0, saidas: 0 };
    }

    transacoes.forEach(t => {
        const d = new Date(t.data_transacao);
        const key = `${d.getFullYear()}-${d.getMonth()}`;
        if (months[key]) {
            if (t.tipo === 'entrada') months[key].entradas += t.valor;
            if (t.tipo === 'saida') months[key].saidas += t.valor;
        }
    });

    return Object.values(months);
}
