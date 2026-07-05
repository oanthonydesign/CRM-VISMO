import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Grid, Col } from "@/components/layout/grid";
import { createClient } from "@/lib/supabase/server";
import { formatCurrency } from "@/utils/format";
import { DealPageHeader } from "@/components/oportunidades/deal-page-header";
import { DealCardActions } from "@/components/oportunidades/deal-card-actions";
import { DealFormDialog } from "@/components/oportunidades/deal-form-dialog";
import { KanbanBoard } from "@/components/oportunidades/kanban-board";

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
            <KanbanBoard initialDeals={oportunidades} etapas={etapas} />

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

