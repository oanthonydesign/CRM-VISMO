import { z } from 'zod'

export const interacaoSchema = z.object({
    prospeccao_id: z.string().min(1),
    tipo: z.enum(['whatsapp', 'instagram', 'ligacao', 'nota']),
    descricao: z.string().min(1, 'Descrição é obrigatória'),
    proximo_passo: z.string().optional(),
})

export type InteracaoFormData = z.infer<typeof interacaoSchema>
