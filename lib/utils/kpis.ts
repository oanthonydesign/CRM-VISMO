import { createClient } from "@/lib/supabase/server";

/**
 * Interface para os KPIs calculados do sistema
 */
export interface KPIs {
    // Dashboard
    receita_mes: number;         // Receita do mês atual
    clientes_ativos: number;     // Total de empresas com tipo = cliente
    oportunidades_abertas: number; // Total de oportunidades em aberto
    taxa_conversao: number;      // Taxa de conversão de oportunidades

    // Financeiro
    receita_prevista: number;    // Receita prevista (entradas pendentes)
    caixa_atual: number;         // Saldo de caixa (entradas - saídas)
    burn_rate: number;           // Burn rate mensal (média de saídas)

    // HQ
    ticket_medio: number;        // Valor médio dos deals fechados (ganhos)
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
    const tresMesesAtras = new Date();
    tresMesesAtras.setMonth(tresMesesAtras.getMonth() - 3);

    // 1. Receita do mês (entradas realizadas no mês atual)
    const { data: entradasMes } = await supabase
        .from('entradas_saidas')
        .select('valor')
        .eq('tipo', 'entrada')
        .eq('status', 'realizado')
        .gte('data_transacao', inicioMes.toISOString())
        .lte('data_transacao', fimMes.toISOString());

    const receita_mes = entradasMes?.reduce((sum, e) => sum + e.valor, 0) || 0;

    // 2. Clientes ativos (empresas com tipo = cliente)
    const { count: clientes_ativos } = await supabase
        .from('empresas')
        .select('*', { count: 'exact', head: true })
        .eq('tipo', 'cliente');

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

    // 5. Receita prevista (entradas/saídas pendentes)
    const { data: pendentes } = await supabase
        .from('entradas_saidas')
        .select('valor')
        .eq('status', 'pendente');

    const receita_prevista = pendentes?.reduce((sum, p) => sum + p.valor, 0) || 0;

    // 6. Caixa atual (entradas - saídas realizadas)
    const { data: transacoes } = await supabase
        .from('entradas_saidas')
        .select('tipo, valor')
        .eq('status', 'realizado');

    let totalEntradas = 0;
    let totalSaidas = 0;
    transacoes?.forEach(t => {
        if (t.tipo === 'entrada') totalEntradas += t.valor;
        if (t.tipo === 'saida') totalSaidas += t.valor;
    });

    const caixa_atual = totalEntradas - totalSaidas;

    // 7. Burn rate (média de saídas nos últimos 3 meses)
    const { data: saidasRecentes } = await supabase
        .from('entradas_saidas')
        .select('valor')
        .eq('tipo', 'saida')
        .eq('status', 'realizado')
        .gte('data_transacao', tresMesesAtras.toISOString());

    const totalSaidasRecentes = saidasRecentes?.reduce((sum, s) => sum + s.valor, 0) || 0;
    const burn_rate = totalSaidasRecentes / 3;

    // 8. Ticket médio (valor médio dos deals fechados/ganhos)
    const { data: dealsGanhos } = await supabase
        .from('deals')
        .select('valor')
        .eq('estagio', 'fechado_ganho');

    const somaDeals = dealsGanhos?.reduce((sum, d) => sum + (d.valor || 0), 0) || 0;
    const ticket_medio = dealsGanhos && dealsGanhos.length > 0
        ? somaDeals / dealsGanhos.length
        : 0;

    // 9. LTV (Lifetime Value) - simplificado: ticket médio * tempo médio de contrato (assumindo 12 meses)
    const ltv = ticket_medio * 1; // Assumindo 1 ano de contrato médio

    // 10. CAC (Custo de Aquisição de Cliente) - simplificado: despesas de marketing / novos clientes
    const { data: despesasMarketing } = await supabase
        .from('entradas_saidas')
        .select('valor')
        .eq('tipo', 'saida')
        .eq('categoria', 'marketing')
        .gte('data_transacao', tresMesesAtras.toISOString());

    const totalDespesasMarketing = despesasMarketing?.reduce((sum, d) => sum + d.valor, 0) || 0;

    // Contar novos clientes (empresas viraram tipo = cliente) nos últimos 3 meses
    const { count: novosClientes } = await supabase
        .from('empresas')
        .select('*', { count: 'exact', head: true })
        .eq('tipo', 'cliente')
        .gte('created_at', tresMesesAtras.toISOString());

    const cac = novosClientes && novosClientes > 0
        ? totalDespesasMarketing / novosClientes
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
        clientes_ativos: clientes_ativos || 0,
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
