import { KPICard } from "@/components/features/kpi-card";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Grid, Col } from "@/components/layout/grid";
import { DollarSign, TrendingUp, TrendingDown, Activity } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { createClient } from "@/lib/supabase/server";
import { formatCurrency } from "@/utils/format";
import { FinancePageHeader } from "@/components/financeiro/finance-page-header";
import { TransactionTableActions } from "@/components/financeiro/transaction-table-actions";

function getStatusColor(status: string) {
    switch (status) {
        case "pendente": return "bg-yellow-500/20 text-yellow-500 border-yellow-500/50";
        case "realizado": return "bg-green-500/20 text-green-500 border-green-500/50";
        case "cancelado": return "bg-red-500/20 text-red-500 border-red-500/50";
        default: return "bg-gray-500/20 text-gray-500";
    }
}

function getStatusLabel(status: string) {
    const labels: Record<string, string> = {
        pendente: "Pendente",
        realizado: "Realizado",
        cancelado: "Cancelado",
    };
    return labels[status] || status;
}

export default async function FinanceiroPage() {
    const supabase = await createClient();

    // Buscar transações
    const { data: transactions } = await supabase
        .from('entradas_saidas')
        .select('*')
        .order('data_transacao', { ascending: false })
        .limit(50);

    const transacoes = transactions || [];

    // Calcular totais
    const totalEntradas = transacoes
        .filter(t => t.tipo === 'entrada' && t.status === 'realizado')
        .reduce((sum, t) => sum + (t.valor || 0), 0);

    const totalSaidas = transacoes
        .filter(t => t.tipo === 'saida' && t.status === 'realizado')
        .reduce((sum, t) => sum + (t.valor || 0), 0);

    const saldo = totalEntradas - totalSaidas;

    const totalPendente = transacoes
        .filter(t => t.status === 'pendente')
        .reduce((sum, t) => sum + (t.valor || 0), 0);

    return (
        <div className="space-y-8">
            {/* Header */}
            <FinancePageHeader />

            {/* KPIs */}
            <Grid cols={4}>
                <Col span={1}>
                    <KPICard
                        title="Total Entradas"
                        value={totalEntradas.toLocaleString('pt-BR')}
                        change={0}
                        icon={<TrendingUp className="h-4 w-4" />}
                        format="currency"
                    />
                </Col>
                <Col span={1}>
                    <KPICard
                        title="Total Saídas"
                        value={totalSaidas.toLocaleString('pt-BR')}
                        change={0}
                        icon={<TrendingDown className="h-4 w-4" />}
                        format="currency"
                    />
                </Col>
                <Col span={1}>
                    <KPICard
                        title="Saldo (Realizado)"
                        value={saldo.toLocaleString('pt-BR')}
                        change={0}
                        icon={<DollarSign className="h-4 w-4" />}
                        format="currency"
                    />
                </Col>
                <Col span={1}>
                    <KPICard
                        title="Pendente"
                        value={totalPendente.toLocaleString('pt-BR')}
                        change={0}
                        icon={<Activity className="h-4 w-4" />}
                        format="currency"
                    />
                </Col>
            </Grid>

            {/* Transactions Table */}
            <Card>
                <CardHeader>
                    <CardTitle>Transações Recentes</CardTitle>
                    <CardDescription>{transacoes.length} transações</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Data</TableHead>
                                <TableHead>Descrição</TableHead>
                                <TableHead>Categoria</TableHead>
                                <TableHead>Tipo</TableHead>
                                <TableHead className="text-right">Valor</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Ações</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {transacoes.map((transacao) => (
                                <TableRow key={transacao.id}>
                                    <TableCell className="font-mono text-sm">
                                        {new Date(transacao.data_transacao).toLocaleDateString('pt-BR')}
                                    </TableCell>
                                    <TableCell className="font-medium">
                                        {transacao.descricao}
                                    </TableCell>
                                    <TableCell className="text-sm text-text-secondary">
                                        {transacao.categoria || '—'}
                                    </TableCell>
                                    <TableCell>
                                        <Badge
                                            variant="outline"
                                            className={transacao.tipo === 'entrada'
                                                ? 'bg-green-500/20 text-green-500 border-green-500/50'
                                                : 'bg-red-500/20 text-red-500 border-red-500/50'}
                                        >
                                            {transacao.tipo === 'entrada' ? 'Entrada' : 'Saída'}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="font-mono text-right font-medium">
                                        {formatCurrency(transacao.valor || 0)}
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline" className={getStatusColor(transacao.status)}>
                                            {getStatusLabel(transacao.status)}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <TransactionTableActions transaction={transacao} />
                                    </TableCell>
                                </TableRow>
                            ))}
                            {transacoes.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={7} className="text-center py-8 text-text-secondary">
                                        Nenhuma transação registrada.
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
