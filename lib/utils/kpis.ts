import { createClient } from "@/lib/supabase/server";

/**
 * Interface para os KPIs calculados do sistema
 */
export interface KPIs {
    // Dashboard
    receita_mes: number;         // Receita do mês atual
    contratos_ativos: number;    // Total de contratos ativos
    oportunidades_abertas: number; // Total de oportunidades em aberto
    taxa_conversao: number;      // Taxa de conversão de oportunidades

    // Financeiro
    receita_prevista: number;    // Receita prevista (parcelas pendentes)
    caixa_atual: number;         // Saldo de caixa (entradas - saídas)
    burn_rate: number;           // Burn rate mensal (média de saídas)

    // HQ
    ticket_medio: number;        // Ticket médio dos contratos
    ltv: number;                 // Lifetime Value
    cac: number;                 // Custo de Aquisição de Cliente
    runway_meses: number;        // Meses de runway (caixa / burn_rate)
    projetos_ativos: number;     // Total de projetos ativos
}

/**
 * Calcula todos os KPIs do sistema
 */
export async function calcularKPIs(): Promise<KPIs> {
    const supabase = await createClient();

    // Datas de referência
    const hoje = new Date();
    const inicioMes = new Date(hoje.getFullYear(), hoje.getMonth(), 1);
    const fimMes = new Date(hoje.getFullYear(), hoje.getMonth() + 1, 0);

    // 1. Receita do mês (soma de parcelas pagas no mês atual)
    const { data: parcelasPagas } = await supabase
        .from('parcelas')
        .select('valor')
        .eq('status', 'pago')
        .gte('data_pagamento', inicioMes.toISOString())
        .lte('data_pagamento', fimMes.toISOString());

    const receita_mes = parcelasPagas?.reduce((sum, p) => sum + p.valor, 0) || 0;

    // 2. Contratos ativos
    const { count: contratos_ativos } = await supabase
        .from('contratos')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'ativo');

    // 3. Oportunidades abertas (deals não ganhos nem perdidos)
    const { count: oportunidades_abertas } = await supabase
        .from('deals')
        .select('*', { count: 'exact', head: true })
        .not('estagio', 'in', '(fechado_ganho,fechado_perdido)');

    // 4. Taxa de conversão (deals ganhos / total de deals finalizados)
    const { data: dealsFinalizados } = await supabase
        .from('deals')
        .select('estagio')
        .in('estagio', ['fechado_ganho', 'fechado_perdido']);

    const totalFinalizados = dealsFinalizados?.length || 0;
    const totalGanhos = dealsFinalizados?.filter(d => d.estagio === 'fechado_ganho').length || 0;
    const taxa_conversao = totalFinalizados > 0 ? (totalGanhos / totalFinalizados) * 100 : 0;

    // 5. Receita prevista (parcelas pendentes)
    const { data: parcelasPendentes } = await supabase
        .from('parcelas')
        .select('valor')
        .in('status', ['pendente', 'atrasada']);

    const receita_prevista = parcelasPendentes?.reduce((sum, p) => sum + p.valor, 0) || 0;

    // 6. Caixa atual (entradas - saídas)
    const { data: transacoes } = await supabase
        .from('entradas_saidas')
        .select('tipo, valor');

    let totalEntradas = 0;
    let totalSaidas = 0;
    transacoes?.forEach(t => {
        if (t.tipo === 'entrada') totalEntradas += t.valor;
        if (t.tipo === 'saida') totalSaidas += t.valor;
    });

    const caixa_atual = totalEntradas - totalSaidas;

    // 7. Burn rate (média de saídas nos últimos 3 meses)
    const tresMesesAtras = new Date();
    tresMesesAtras.setMonth(tresMesesAtras.getMonth() - 3);

    const { data: saidasRecentes } = await supabase
        .from('entradas_saidas')
        .select('valor')
        .eq('tipo', 'saida')
        .gte('data_transacao', tresMesesAtras.toISOString());

    const totalSaidasRecentes = saidasRecentes?.reduce((sum, s) => sum + s.valor, 0) || 0;
    const burn_rate = totalSaidasRecentes / 3;

    // 8. Ticket médio (valor médio dos contratos ativos)
    const { data: contratosValor } = await supabase
        .from('contratos')
        .select('valor_total')
        .eq('status', 'ativo');

    const somaContratos = contratosValor?.reduce((sum, c) => sum + c.valor_total, 0) || 0;
    const ticket_medio = contratosValor && contratosValor.length > 0
        ? somaContratos / contratosValor.length
        : 0;

    // 9. LTV (Lifetime Value) - simplificado: ticket médio * tempo médio de contrato (assumindo 12 meses)
    const ltv = ticket_medio * 1; // Assumindo 1 ano de contrato médio

    // 10. CAC (Custo de Aquisição de Cliente) - simplificado: despesas de marketing / novos clientes
    // Vamos considerar as despesas de marketing dos últimos 3 meses
    const { data: despesasMarketing } = await supabase
        .from('entradas_saidas')
        .select('valor')
        .eq('tipo', 'saida')
        .eq('categoria', 'marketing')
        .gte('data_transacao', tresMesesAtras.toISOString());

    const totalDespesasMarketing = despesasMarketing?.reduce((sum, d) => sum + d.valor, 0) || 0;

    // Contar novos contratos dos últimos 3 meses
    const { count: novosContratos } = await supabase
        .from('contratos')
        .select('*', { count: 'exact', head: true })
        .gte('data_inicio', tresMesesAtras.toISOString());

    const cac = novosContratos && novosContratos > 0
        ? totalDespesasMarketing / novosContratos
        : 0;

    // 11. Projetos ativos (status diferente de 'entregue')
    const { count: projetos_ativos } = await supabase
        .from('projects')
        .select('*', { count: 'exact', head: true })
        .neq('status', 'entregue');

    // 12. Runway em meses (caixa atual / burn rate)
    let runway_meses = 0;
    if (burn_rate === 0) {
        runway_meses = Infinity; // Sem gastos, runway infinito
    } else if (caixa_atual > 0) {
        runway_meses = caixa_atual / burn_rate;
    }
    // Se caixa_atual <= 0, runway_meses permanece 0

    return {
        receita_mes,
        contratos_ativos: contratos_ativos || 0,
        oportunidades_abertas: oportunidades_abertas || 0,
        taxa_conversao: parseFloat(taxa_conversao.toFixed(2)),
        receita_prevista,
        caixa_atual,
        burn_rate,
        ticket_medio,
        ltv,
        cac,
        runway_meses,
        projetos_ativos: projetos_ativos || 0,
    };
}
