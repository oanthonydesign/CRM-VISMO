import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Grid, Col } from "@/components/layout/grid";
import { Target } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { createClient } from "@/lib/supabase/server";
import { GoalsPageHeader } from "@/components/metas/goals-page-header";
import { GoalCardActions } from "@/components/metas/goal-card-actions";

export default async function MetasPage() {
    const supabase = await createClient();

    const { data: metas } = await supabase
        .from('metas')
        .select('*')
        .order('created_at', { ascending: false });

    return (
        <div className="space-y-8">
            {/* Header */}
            <GoalsPageHeader />

            {/* Goals Grid */}
            <Grid cols={2}>
                {metas?.map((meta) => {
                    const progresso = meta.meta_valor > 0 ? Math.round(((meta.atual_valor || 0) / meta.meta_valor) * 100) : 0;
                    const isCompleta = progresso >= 100;
                    const isProxima = progresso >= 80 && progresso < 100;

                    return (
                        <Col key={meta.id} span={1}>
                            <Card className={
                                isCompleta
                                    ? "border-green-500/50 bg-green-500/5"
                                    : isProxima
                                        ? "border-yellow-500/50 bg-yellow-500/5"
                                        : ""
                            }>
                                <CardHeader>
                                    <div className="flex items-start justify-between">
                                        <div className="space-y-1 flex-1">
                                            <div className="flex items-start justify-between gap-2">
                                                <CardTitle className="flex items-center gap-2">
                                                    <Target className="h-5 w-5 text-brand-primary" />
                                                    {meta.titulo}
                                                </CardTitle>
                                                <GoalCardActions goal={meta} />
                                            </div>
                                            <CardDescription className="font-mono uppercase text-xs">
                                                {meta.tipo} • {meta.periodo}
                                            </CardDescription>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {/* Progress */}
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-text-secondary">Progresso</span>
                                            <span className="font-bold text-text-primary">{progresso}%</span>
                                        </div>
                                        <Progress
                                            value={progresso}
                                            className={`h-3 ${isCompleta ? '[&>div]:bg-green-500' : isProxima ? '[&>div]:bg-yellow-500' : ''}`}
                                        />
                                        <div className="text-xs text-text-secondary font-mono text-right">
                                            {(meta.atual_valor || 0).toLocaleString('pt-BR')} / {meta.meta_valor.toLocaleString('pt-BR')}
                                        </div>
                                    </div>

                                    {/* Status Messages */}
                                    {isCompleta && (
                                        <div className="flex items-center gap-2 text-sm text-green-600 font-medium bg-green-50 p-2 rounded">
                                            <span>✓</span>
                                            <span>Meta alcançada!</span>
                                        </div>
                                    )}
                                    {isProxima && !isCompleta && (
                                        <div className="flex items-center gap-2 text-sm text-yellow-600 font-medium bg-yellow-50 p-2 rounded">
                                            <span>⚡</span>
                                            <span>Quase lá! Faltam {meta.meta_valor - (meta.atual_valor || 0)}</span>
                                        </div>
                                    )}

                                    {/* Dates */}
                                    {(meta.data_inicio || meta.data_fim) && (
                                        <div className="flex items-center gap-4 text-xs text-text-secondary pt-2 border-t">
                                            {meta.data_inicio && (
                                                <span>Início: {new Date(meta.data_inicio).toLocaleDateString('pt-BR')}</span>
                                            )}
                                            {meta.data_fim && (
                                                <span>Fim: {new Date(meta.data_fim).toLocaleDateString('pt-BR')}</span>
                                            )}
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </Col>
                    );
                })}
                {(!metas || metas.length === 0) && (
                    <Col span={2}>
                        <Card>
                            <CardContent className="text-center py-12 text-text-secondary">
                                <Target className="h-12 w-12 mx-auto mb-4 opacity-20" />
                                <p>Nenhuma meta cadastrada.</p>
                                <p className="text-sm mt-2">Crie sua primeira meta para começar a acompanhar seus objetivos.</p>
                            </CardContent>
                        </Card>
                    </Col>
                )}
            </Grid>
        </div>
    );
}
