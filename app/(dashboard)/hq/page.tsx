import { KPICard } from "@/components/features/kpi-card";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Grid, Col } from "@/components/layout/grid";
import { DollarSign, TrendingUp, Activity, Users, Target } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { createClient } from "@/lib/supabase/server";
import { calcularKPIs } from "@/lib/utils/kpis";

export default async function HQPage() {
    const supabase = await createClient();
    const kpis = await calcularKPIs();

    // Buscar metas ativas
    const { data: metas } = await supabase
        .from('metas')
        .select('*')
        .order('created_at', { ascending: false });

    // Buscar total de colaboradores (profiles)
    const { count: totalColaboradores } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="space-y-2">
                <h1 className="text-display-xl font-sans text-text-primary">Headquarters</h1>
                <p className="text-text-secondary font-mono">Visão estratégica e saúde da operação</p>
            </div>

            {/* Vital KPIs */}
            <Grid cols={4}>
                <Col span={1}>
                    <KPICard
                        title="Receita Total"
                        value={kpis.receita_mes.toLocaleString('pt-BR')}
                        change={0} // TODO: Calcular variação
                        icon={<DollarSign className="h-4 w-4" />}
                        format="currency"
                    />
                </Col>
                <Col span={1}>
                    <KPICard
                        title="Lucro (Caixa)"
                        value={kpis.caixa_atual.toLocaleString('pt-BR')}
                        change={0}
                        icon={<TrendingUp className="h-4 w-4" />}
                        format="currency"
                    />
                </Col>
                <Col span={1}>
                    <KPICard
                        title="Burn Rate"
                        value={kpis.burn_rate.toLocaleString('pt-BR')}
                        change={0}
                        icon={<Activity className="h-4 w-4" />}
                        format="currency"
                    />
                </Col>
                <Col span={1}>
                    <KPICard
                        title="Runway Estimado"
                        value={`${kpis.runway_meses === Infinity ? '∞' : kpis.runway_meses.toFixed(1)} Meses`}
                        change={0}
                        icon={<Activity className="h-4 w-4" />}
                    />
                </Col>
            </Grid>

            {/* OKRs & Metas */}
            <div className="space-y-4">
                <h2 className="text-lg font-semibold text-text-primary">Metas & OKRs</h2>
                {metas && metas.length > 0 ? (
                    <Grid cols={3}>
                        {metas.map((meta) => {
                            const progresso = meta.meta_valor > 0 ? (meta.atual_valor / meta.meta_valor) * 100 : 0;
                            return (
                                <Col span={1} key={meta.id}>
                                    <Card>
                                        <CardHeader className="pb-2">
                                            <div className="flex items-center justify-between">
                                                <CardTitle className="text-base font-medium">{meta.titulo}</CardTitle>
                                                <Target className="h-4 w-4 text-text-secondary" />
                                            </div>
                                            <CardDescription className="font-mono text-xs uppercase">{meta.periodo}</CardDescription>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            <div className="flex items-end justify-between">
                                                <span className="text-2xl font-bold text-text-primary">
                                                    {meta.atual_valor.toLocaleString('pt-BR')}
                                                </span>
                                                <span className="text-sm text-text-secondary mb-1">
                                                    / {meta.meta_valor.toLocaleString('pt-BR')}
                                                </span>
                                            </div>
                                            <div className="space-y-1">
                                                <Progress value={progresso} className="h-2" />
                                                <p className="text-xs text-text-secondary text-right">
                                                    {Math.round(progresso)}% atingido
                                                </p>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </Col>
                            );
                        })}
                    </Grid>
                ) : (
                    <Card>
                        <CardContent className="py-8 text-center text-text-secondary">
                            Nenhuma meta definida.
                        </CardContent>
                    </Card>
                )}
            </div>

            {/* Team Health (Simplified) */}
            <Card>
                <CardHeader>
                    <CardTitle>Saúde do Time</CardTitle>
                    <CardDescription>Capacidade e utilização</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center gap-8">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-brand-primary/10 rounded-full">
                                <Users className="h-6 w-6 text-brand-primary" />
                            </div>
                            <div>
                                <p className="text-sm text-text-secondary">Total Colaboradores</p>
                                <p className="text-2xl font-bold text-text-primary">{totalColaboradores || 0}</p>
                            </div>
                        </div>
                        <div className="h-12 w-px bg-utility-border-subtle" />
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-green-500/10 rounded-full">
                                <Activity className="h-6 w-6 text-green-500" />
                            </div>
                            <div>
                                <p className="text-sm text-text-secondary">Projetos Ativos</p>
                                <p className="text-2xl font-bold text-text-primary">{kpis.projetos_ativos}</p>
                            </div>
                        </div>
                        <div className="h-12 w-px bg-utility-border-subtle" />
                        <div className="flex-1">
                            <div className="flex justify-between mb-2">
                                <span className="text-sm font-medium text-text-primary">Utilização Geral</span>
                                <span className="text-sm text-text-secondary">--%</span>
                            </div>
                            <Progress value={0} className="h-2" />
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
