import { createClient } from "@/lib/supabase/server";

export interface ProspeccaoKPIs {
    hoje: number;
    semana: number;
    mes: number;
    porEstagio: Record<string, number>;
    taxaResposta: number; // respondeu+ / abordado+
    canalMaisEfetivo: { canal: string; taxaResposta: number } | null;
    paradosSemProximaAcao: number;
    porDia: { data: string; total: number }[];
}

const ESTAGIOS_RESPONDIDOS = ['respondeu', 'em_conversa', 'fechado'];
const ESTAGIOS_ABORDADOS_OU_ALEM = ['abordado', 'respondeu', 'em_conversa', 'fechado', 'perdido'];

export async function calcularKPIsProspeccao(): Promise<ProspeccaoKPIs> {
    const supabase = await createClient();

    const { data: prospeccoes, error } = await supabase
        .from('prospeccoes')
        .select('status, canal, data_encontrado, proxima_acao_data');

    if (error || !prospeccoes) {
        console.error('Erro ao calcular KPIs de prospecção:', error);
        return {
            hoje: 0,
            semana: 0,
            mes: 0,
            porEstagio: {},
            taxaResposta: 0,
            canalMaisEfetivo: null,
            paradosSemProximaAcao: 0,
            porDia: [],
        };
    }

    const hoje = new Date();
    const hojeStr = hoje.toISOString().slice(0, 10);
    const inicioSemana = new Date(hoje);
    inicioSemana.setDate(hoje.getDate() - 7);
    const inicioMes = new Date(hoje.getFullYear(), hoje.getMonth(), 1);

    const porEstagio: Record<string, number> = {};
    let contadorHoje = 0;
    let contadorSemana = 0;
    let contadorMes = 0;
    let paradosSemProximaAcao = 0;
    const porDiaMap = new Map<string, number>();

    for (const p of prospeccoes) {
        porEstagio[p.status] = (porEstagio[p.status] || 0) + 1;

        if (p.data_encontrado) {
            const data = new Date(p.data_encontrado);
            if (p.data_encontrado === hojeStr) contadorHoje++;
            if (data >= inicioSemana) contadorSemana++;
            if (data >= inicioMes) contadorMes++;

            porDiaMap.set(p.data_encontrado, (porDiaMap.get(p.data_encontrado) || 0) + 1);
        }

        const ativo = p.status !== 'fechado' && p.status !== 'perdido';
        if (ativo && !p.proxima_acao_data) paradosSemProximaAcao++;
    }

    const abordadosOuAlem = prospeccoes.filter(p => ESTAGIOS_ABORDADOS_OU_ALEM.includes(p.status));
    const respondidos = abordadosOuAlem.filter(p => ESTAGIOS_RESPONDIDOS.includes(p.status));
    const taxaResposta = abordadosOuAlem.length > 0
        ? (respondidos.length / abordadosOuAlem.length) * 100
        : 0;

    const canais = ['whatsapp', 'instagram', 'ambos'];
    let canalMaisEfetivo: { canal: string; taxaResposta: number } | null = null;
    for (const canal of canais) {
        const doCanal = abordadosOuAlem.filter(p => p.canal === canal);
        if (doCanal.length === 0) continue;
        const respondidosCanal = doCanal.filter(p => ESTAGIOS_RESPONDIDOS.includes(p.status));
        const taxa = (respondidosCanal.length / doCanal.length) * 100;
        if (!canalMaisEfetivo || taxa > canalMaisEfetivo.taxaResposta) {
            canalMaisEfetivo = { canal, taxaResposta: parseFloat(taxa.toFixed(1)) };
        }
    }

    const porDia = Array.from(porDiaMap.entries())
        .sort(([a], [b]) => a.localeCompare(b))
        .slice(-14)
        .map(([data, total]) => ({ data, total }));

    return {
        hoje: contadorHoje,
        semana: contadorSemana,
        mes: contadorMes,
        porEstagio,
        taxaResposta: parseFloat(taxaResposta.toFixed(1)),
        canalMaisEfetivo,
        paradosSemProximaAcao,
        porDia,
    };
}
