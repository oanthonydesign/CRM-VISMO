import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Grid, Col } from "@/components/layout/grid";
import { createClient } from "@/lib/supabase/server";
import { formatCurrency } from "@/utils/format";
import { DealPageHeader } from "@/components/oportunidades/deal-page-header";
import { DealCardActions } from "@/components/oportunidades/deal-card-actions";
import { DealFormDialog } from "@/components/oportunidades/deal-form-dialog";

const etapas = [
    { key: "prospeccao", label: "Prospecção", color: "bg-gray-500/20 text-gray-500" },
    { key: "qualificacao", label: "Qualificação", color: "bg-blue-500/20 text-blue-500" },
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
            <DealPageHeader />

            {/* Kanban Board */}
            <div className="flex gap-4 overflow-x-auto pb-4 min-h-[calc(100vh-250px)]">
                {etapas.map((etapa) => {
                    const oportunidadesEtapa = getOportunidadesPorEtapa(etapa.key);
                    const total = calcularTotalEtapa(etapa.key);

                    return (
                        <div key={etapa.key} className="flex-shrink-0 w-80">
                            <Card className="h-full bg-background-elevated/50 border-utility-border-subtle">
                                <CardHeader className="pb-3 bg-background-surface/50 rounded-t-lg">
                                    <div className="flex items-center justify-between">
                                        <CardTitle className="text-sm font-medium uppercase tracking-wider text-text-secondary">
                                            {etapa.label}
                                        </CardTitle>
                                        <Badge variant="outline" className={etapa.color}>
                                            {oportunidadesEtapa.length}
                                        </Badge>
                                    </div>
                                    <CardDescription className="font-mono text-xs font-medium text-text-primary">
                                        {formatCurrency(total)}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-3 p-3">
                                    {oportunidadesEtapa.length === 0 ? (
                                        <div className="text-center text-text-secondary text-xs py-8 border-2 border-dashed border-utility-border-subtle rounded-lg">
                                            Vazio
                                        </div>
                                    ) : (
                                        oportunidadesEtapa.map((op) => (
                                            <Card key={op.id} className="bg-background-default border-utility-border-subtle hover:border-brand-primary/50 transition-all shadow-sm group">
                                                <CardContent className="p-3 space-y-3">
                                                    <div className="flex items-start justify-between gap-2">
                                                        <h4 className="font-medium text-sm text-text-primary line-clamp-2">
                                                            {op.titulo}
                                                        </h4>
                                                        <DealCardActions deal={op} />
                                                    </div>

                                                    {op.empresa?.nome && (
                                                        <div className="text-xs text-text-secondary flex items-center gap-1">
                                                            <span className="truncate max-w-[180px]">{op.empresa.nome}</span>
                                                        </div>
                                                    )}

                                                    <div className="flex items-center justify-between pt-2 border-t border-utility-border-subtle">
                                                        <span className="font-mono text-sm font-medium text-text-primary">
                                                            {formatCurrency(op.valor || 0)}
                                                        </span>
                                                        {op.probabilidade && (
                                                            <Badge variant="secondary" className="text-[10px] h-5 px-1.5">
                                                                {op.probabilidade}%
                                                            </Badge>
                                                        )}
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
                            <CardDescription className="font-mono uppercase text-xs">Total em Pipeline</CardDescription>
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
                            <CardDescription className="font-mono uppercase text-xs">Oportunidades Ativas</CardDescription>
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

