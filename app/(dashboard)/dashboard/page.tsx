import { KPICard } from "@/components/features/kpi-card";
import { LineChart } from "@/components/charts/line-chart";
import { BarChart } from "@/components/charts/bar-chart";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Grid, Col } from "@/components/layout/grid";
import { DollarSign, FileText, TrendingUp, Target } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { calcularKPIs } from "@/lib/utils/kpis";

export default async function DashboardPage() {
    const supabase = await createClient();
    const kpis = await calcularKPIs();

    // Buscar dados para o gráfico de receita (últimos 6 meses)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const { data: transacoes } = await supabase
        .from('entradas_saidas')
        .select('*')
        .eq('tipo', 'entrada')
        .gte('data_transacao', sixMonthsAgo.toISOString())
        .order('data_transacao', { ascending: true });

    const receitaChartData = processReceitaChart(transacoes || []);

    // Buscar dados para o funil (deals por estágio)
    const { data: deals } = await supabase
        .from('deals')
        .select('estagio');

    const funilData = processFunilData(deals || []);

    // Buscar atividades recentes
    const { data: atividades } = await supabase
        .from('atividades')
        .select(`
            *,
            empresa:empresas(nome),
            responsavel:profiles(full_name)
        `)
        .order('data_realizada', { ascending: false })
        .limit(5);

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
                        value={kpis.receita_mes.toLocaleString('pt-BR')}
                        change={0} // TODO: Calcular variação
                        icon={<DollarSign className="h-4 w-4" />}
                        format="currency"
                    />
                </Col>
                <Col span={1}>
                    <KPICard
                        title="Contratos Ativos"
                        value={kpis.contratos_ativos}
                        change={0}
                        icon={<FileText className="h-4 w-4" />}
                    />
                </Col>
                <Col span={1}>
                    <KPICard
                        title="Oportunidades"
                        value={kpis.oportunidades_abertas}
                        change={0}
                        icon={<TrendingUp className="h-4 w-4" />}
                    />
                </Col>
                <Col span={1}>
                    <KPICard
                        title="Taxa Fechamento"
                        value={kpis.taxa_conversao}
                        change={0}
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
                                data={receitaChartData}
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
                            {atividades?.map((atividade) => (
                                <TableRow key={atividade.id}>
                                    <TableCell className="font-mono uppercase text-xs">{atividade.tipo}</TableCell>
                                    <TableCell className="font-medium">{atividade.empresa?.nome || '—'}</TableCell>
                                    <TableCell className="text-text-secondary">{atividade.descricao}</TableCell>
                                    <TableCell className="font-mono text-sm">
                                        {new Date(atividade.data_realizada).toLocaleDateString('pt-BR')}
                                    </TableCell>
                                    <TableCell>{atividade.responsavel?.full_name || '—'}</TableCell>
                                </TableRow>
                            ))}
                            {(!atividades || atividades.length === 0) && (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center py-8 text-text-secondary">
                                        Nenhuma atividade recente.
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

function processReceitaChart(transacoes: any[]) {
    const months: { [key: string]: { mes: string, receita: number } } = {};

    // Initialize last 6 months
    for (let i = 5; i >= 0; i--) {
        const d = new Date();
        d.setMonth(d.getMonth() - i);
        const key = `${d.getFullYear()}-${d.getMonth()}`;
        const label = d.toLocaleString('pt-BR', { month: 'short' });
        months[key] = { mes: label, receita: 0 };
    }

    transacoes.forEach(t => {
        const d = new Date(t.data_transacao);
        const key = `${d.getFullYear()}-${d.getMonth()}`;
        if (months[key]) {
            months[key].receita += t.valor;
        }
    });

    return Object.values(months);
}

function processFunilData(deals: any[]) {
    const etapas = [
        "descoberta",
        "diagnostico",
        "proposta",
        "negociacao",
        "fechado_ganho"
    ];

    const counts: { [key: string]: number } = {};
    etapas.forEach(e => counts[e] = 0);

    deals.forEach(d => {
        if (counts[d.estagio] !== undefined) {
            counts[d.estagio]++;
        }
    });

    return etapas.map(etapa => ({
        etapa: etapa.charAt(0).toUpperCase() + etapa.slice(1).replace('_', ' '),
        quantidade: counts[etapa]
    }));
}

