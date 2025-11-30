import { KPICard } from "@/components/features/kpi-card";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Grid, Col } from "@/components/layout/grid";
import { DollarSign, TrendingUp, Activity, Users, Target } from "lucide-react";
import { mockKPIs, mockMetas, mockFinanceiro } from "@/lib/mock-data";
import { Progress } from "@/components/ui/progress";

export default function HQPage() {
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
                        value={mockFinanceiro.receitaRecebida.value.toLocaleString('pt-BR')}
                        change={mockFinanceiro.receitaRecebida.change}
                        icon={<DollarSign className="h-4 w-4" />}
                        format="currency"
                    />
                </Col>
                <Col span={1}>
                    <KPICard
                        title="Lucro Líquido"
                        value={mockFinanceiro.lucro.value.toLocaleString('pt-BR')}
                        change={mockFinanceiro.lucro.change}
                        icon={<TrendingUp className="h-4 w-4" />}
                        format="currency"
                    />
                </Col>
                <Col span={1}>
                    <KPICard
                        title="Burn Rate"
                        value={mockFinanceiro.burnRate.value.toLocaleString('pt-BR')}
                        change={mockFinanceiro.burnRate.change}
                        icon={<Activity className="h-4 w-4" />}
                        format="currency"
                    />
                </Col>
                <Col span={1}>
                    <KPICard
                        title="Runway Estimado"
                        value="4.5 Meses"
                        change={0}
                        icon={<Activity className="h-4 w-4" />}
                    />
                </Col>
            </Grid>

            {/* OKRs & Metas */}
            <div className="space-y-4">
                <h2 className="text-lg font-semibold text-text-primary">Metas & OKRs</h2>
                <Grid cols={3}>
                    {mockMetas.map((meta) => (
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
                                            {meta.atual.toLocaleString('pt-BR')}
                                        </span>
                                        <span className="text-sm text-text-secondary mb-1">
                                            / {meta.meta.toLocaleString('pt-BR')}
                                        </span>
                                    </div>
                                    <div className="space-y-1">
                                        <Progress value={(meta.atual / meta.meta) * 100} className="h-2" />
                                        <p className="text-xs text-text-secondary text-right">
                                            {Math.round((meta.atual / meta.meta) * 100)}% atingido
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        </Col>
                    ))}
                </Grid>
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
                                <p className="text-2xl font-bold text-text-primary">12</p>
                            </div>
                        </div>
                        <div className="h-12 w-px bg-utility-border-subtle" />
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-green-500/10 rounded-full">
                                <Activity className="h-6 w-6 text-green-500" />
                            </div>
                            <div>
                                <p className="text-sm text-text-secondary">Projetos Ativos</p>
                                <p className="text-2xl font-bold text-text-primary">8</p>
                            </div>
                        </div>
                        <div className="h-12 w-px bg-utility-border-subtle" />
                        <div className="flex-1">
                            <div className="flex justify-between mb-2">
                                <span className="text-sm font-medium text-text-primary">Utilização Geral</span>
                                <span className="text-sm text-text-secondary">75%</span>
                            </div>
                            <Progress value={75} className="h-2" />
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
