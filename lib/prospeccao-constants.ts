export const STAGE_META: Record<string, { label: string; color: string }> = {
    novo: { label: 'Novo', color: 'bg-gray-500/20 text-gray-500 border-gray-500/50' },
    abordado: { label: 'Abordado', color: 'bg-blue-500/20 text-blue-500 border-blue-500/50' },
    respondeu: { label: 'Respondeu', color: 'bg-yellow-500/20 text-yellow-500 border-yellow-500/50' },
    em_conversa: { label: 'Em conversa', color: 'bg-purple-500/20 text-purple-500 border-purple-500/50' },
    fechado: { label: 'Fechado', color: 'bg-green-500/20 text-green-500 border-green-500/50' },
    perdido: { label: 'Perdido', color: 'bg-red-500/20 text-red-500 border-red-500/50' },
}

export const STAGE_ORDER = ['novo', 'abordado', 'respondeu', 'em_conversa', 'fechado', 'perdido'] as const

// estágios que aparecem no board do Pipeline (Radar cobre o "novo" à parte)
export const PIPELINE_STAGES = ['abordado', 'respondeu', 'em_conversa', 'fechado', 'perdido'] as const

export const TIPO_LABELS: Record<string, string> = {
    empresa: 'Empresa',
    microempresa: 'Microempresa',
    profissional_liberal: 'Profissional liberal',
}

export const CANAL_LABELS: Record<string, string> = {
    whatsapp: 'WhatsApp',
    instagram: 'Instagram',
    ambos: 'Ambos',
}

export const INTERACAO_LABELS: Record<string, string> = {
    whatsapp: 'WhatsApp',
    instagram: 'Instagram',
    ligacao: 'Ligação',
    nota: 'Nota',
}
