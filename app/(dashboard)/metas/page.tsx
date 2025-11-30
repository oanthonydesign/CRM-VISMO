import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Grid, Col } from "@/components/layout/grid";
import { Plus, Target } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { createClient } from "@/lib/supabase/server";

export default async function MetasPage() {
    const supabase = await createClient();

    const { data: metas } = await supabase
        .from('metas')
        .select('*')
        .order('created_at', { ascending: false });

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="space-y-2">
                    <h1 className="text-display-xl font-sans text-text-primary">Metas & KPIs</h1>
                    <p className="text-text-secondary font-mono">Acompanhamento de objetivos</p>
                </div>
                <Button>
                    <Plus className="mr-2 h-4 w-4" /> Nova Meta
                </Button>
            </div>

            {/* Goals Grid */}
            <Grid cols={1}>
                {metas?.map((meta) => {
                    const progresso = meta.meta_valor > 0 ? Math.round((meta.atual_valor / meta.meta_valor) * 100) : 0;
                    const isCompleta = progresso >= 100;

                    return (
                        <Col key={meta.id} span={1}>
                            <Card className={isCompleta ? "border-green-500/50" : ""}>
                                <CardHeader>
                                    <div className="flex items-start justify-between">
                                        <div className="space-y-1">
                                            <CardTitle className="flex items-center gap-2">
                                                <Target className="h-5 w-5 text-brand-primary" />
                                                {meta.titulo}
                                            </CardTitle>
                                            <CardDescription className="font-mono uppercase text-xs">
                                                {meta.periodo}
                                            </CardDescription>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-2xl font-bold text-text-primary">{progresso}%</div>
                                            <div className="text-xs text-text-secondary font-mono">
                                                {meta.atual_valor.toLocaleString()} / {meta.meta_valor.toLocaleString()}
                                            </div>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <Progress value={progresso} className="h-3" />
                                    {isCompleta && (
                                        <p className="mt-3 text-sm text-green-500 font-medium">✓ Meta alcançada!</p>
                                    )}
                                </CardContent>
                            </Card>
                        </Col>
                    );
                })}
                {(!metas || metas.length === 0) && (
                    <div className="text-center py-8 text-text-secondary">
                        Nenhuma meta cadastrada.
                    </div>
                )}
            </Grid>
        </div>
    );
}

