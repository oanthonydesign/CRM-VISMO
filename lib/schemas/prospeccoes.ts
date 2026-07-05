import { z } from 'zod'

export const PROSPECCAO_STAGES = ['novo', 'abordado', 'respondeu', 'em_conversa', 'fechado', 'perdido'] as const

export const prospeccaoSchema = z.object({
    nome: z.string().min(1, 'Nome é obrigatório'),
    empresa: z.string().optional(),
    tipo: z.enum(['empresa', 'microempresa', 'profissional_liberal']),
    segmento: z.string().optional(),
    canal: z.enum(['whatsapp', 'instagram', 'ambos']),
    telefone: z.string().optional(),
    instagram: z.string().optional(),
    origem: z.string().optional(),
    status: z.enum(PROSPECCAO_STAGES),
    oportunidade: z.string().optional(),
    como_ajudar: z.string().optional(),
    ideia_abordagem: z.string().optional(),
    observacoes: z.string().optional(),
})

export type ProspeccaoFormData = z.infer<typeof prospeccaoSchema>

// Forma solta de um registro vindo do Supabase (cliente não é tipado com
// Database generics neste projeto), usada por listas/cards/detalhe.
export interface ProspeccaoRecord {
    id: string
    nome: string
    empresa?: string | null
    tipo?: string
    segmento?: string | null
    canal?: string
    telefone?: string | null
    instagram?: string | null
    origem?: string | null
    status?: string
    oportunidade?: string | null
    como_ajudar?: string | null
    ideia_abordagem?: string | null
    observacoes?: string | null
    data_encontrado?: string | null
    data_abordagem?: string | null
    data_ultima_interacao?: string | null
}
