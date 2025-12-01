import { z } from 'zod'

export const dealSchema = z.object({
    titulo: z.string().min(1, 'Título é obrigatório'),
    empresa_id: z.string().min(1, 'Empresa é obrigatória'),
    valor: z.coerce.number().min(0, 'Valor deve ser positivo'),
    estagio: z.enum([
        'prospeccao',
        'qualificacao',
        'proposta',
        'negociacao',
        'fechado_ganho',
        'fechado_perdido'
    ]).default('prospeccao'),
    probabilidade: z.coerce.number().min(0).max(100).optional(),
    data_fechamento_prevista: z.string().optional().or(z.literal('')),
    responsavel_id: z.string().optional(),
})

export type DealFormData = z.infer<typeof dealSchema>
