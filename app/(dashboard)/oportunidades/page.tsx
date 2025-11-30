import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Grid, Col } from "@/components/layout/grid";
import { createClient } from "@/lib/supabase/server";
import { formatCurrency } from "@/utils/format";

const etapas = [
    { key: "descoberta", label: "Descoberta", color: "bg-gray-500/20 text-gray-500" },
    { key: "diagnostico", label: "Diagnóstico", color: "bg-blue-500/20 text-blue-500" },
    { key: "proposta", label: "Proposta", color: "bg-purple-500/20 text-purple-500" },
    { key: "negociacao", label: "Negociação", color: "bg-yellow-500/20 text-yellow-500" },
    { key: "fechado_ganho", label: "Fechado", color: "bg-green-500/20 text-green-500" },
];

export default async function OportunidadesPage() {
    const supabase = await createClient();

    // Buscar deals (oportunidades) do banco
    const { data: deals, error } = await supabase
        .from('deals')
        .select(`
            *,
            empresa:empresas(nome),
            responsavel:profiles(full_name)
        `)
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Erro ao buscar deals:', error);
    }

    const oportunidades = deals || [];

    const getOportunidadesPorEtapa = (etapa: string) => {
        return oportunidades.filter(op => op.estagio === etapa);
    };

    const calcularTotalEtapa = (etapa: string) => {
        return getOportunidadesPorEtapa(etapa).reduce((acc, op) => acc + (op.valor || 0), 0);
    };

    const totalGeral = oportunidades.reduce((acc, op) => acc + (op.valor || 0), 0);
    const ticketMedio = oportunidades.length > 0 ? totalGeral / oportunidades.length : 0;

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="space-y-2">
                <h1 className="text-display-xl font-sans text-text-primary">Oportunidades</h1>
                <p className="text-text-secondary font-mono">Pipeline de vendas ativo</p>
            </div>

            {/* Kanban Board */}
            <div className="flex gap-4 overflow-x-auto pb-4">
                {etapas.map((etapa) => {
                    const oportunidadesEtapa = getOportunidadesPorEtapa(etapa.key);
                    const total = calcularTotalEtapa(etapa.key);

                    return (
                        <div key={etapa.key} className="flex-shrink-0 w-80">
                            <Card className="h-full">
                                <CardHeader className="pb-3">
                                    <div className="flex items-center justify-between">
                                        <CardTitle className="text-lg">{etapa.label}</CardTitle>
                                        <Badge variant="outline" className={etapa.color}>
                                            {oportunidadesEtapa.length}
                                        </Badge>
                                    </div>
                                    <CardDescription className="font-mono">
                                        {formatCurrency(total)}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    {oportunidadesEtapa.length === 0 ? (
                                        <div className="text-center text-text-secondary text-sm py-8">
                                            Nenhuma oportunidade
                                        </div>
                                    ) : (
                                        oportunidadesEtapa.map((op) => (
                                            <Card key={op.id} className="bg-background-surface border-utility-border-subtle hover:border-utility-border-strong transition-colors cursor-pointer">
                                                <CardContent className="p-4 space-y-2">
                                                    <div className="flex items-start justify-between">
                                                        <h4 className="font-medium text-text-primary">
                                                            {op.empresa?.nome || op.titulo}
                                                        </h4>
                                                    </div>
                                                    <div className="flex items-center justify-between text-sm">
                                                        <span className="text-text-secondary">Valor</span>
                                                        <span className="font-mono text-brand-primary font-medium">
                                                            {formatCurrency(op.valor || 0)}
                                                        </span>
                                                    </div>
                                                    <div className="text-xs text-text-secondary">
                                                        <span className="font-mono">
                                                            Resp: {op.responsavel?.full_name || 'Não atribuído'}
                                                        </span>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        ))
                                    )}
                                </CardContent>
                            </Card>
                        </div>
                    );
                })}
            </div>

            {/* Summary Stats */}
            <Grid cols={3}>
                <Col span={1}>
                    <Card>
                        <CardHeader className="pb-2">
                            <CardDescription className="font-mono uppercase text-xs">Total em Oportunidades</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-text-primary">
                                {formatCurrency(totalGeral)}
                            </div>
                        </CardContent>
                    </Card>
                </Col>
                <Col span={1}>
                    <Card>
                        <CardHeader className="pb-2">
                            <CardDescription className="font-mono uppercase text-xs">Oportunidades</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-text-primary">
                                {oportunidades.length}
                            </div>
                        </CardContent>
                    </Card>
                </Col>
                <Col span={1}>
                    <Card>
                        <CardHeader className="pb-2">
                            <CardDescription className="font-mono uppercase text-xs">Ticket Médio</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-text-primary">
                                {formatCurrency(ticketMedio)}
                            </div>
                        </CardContent>
                    </Card>
                </Col>
            </Grid>
        </div>
    );
}

