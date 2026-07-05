import { z } from 'zod'

export const estrategiaSchema = z.object({
    segmento: z.string().min(1, 'Segmento é obrigatório'),
    titulo: z.string().min(1, 'Título é obrigatório'),
    gancho: z.string().optional(),
    oferta: z.string().optional(),
    canal_recomendado: z.enum(['whatsapp', 'instagram', 'ambos']).optional(),
})

export type EstrategiaFormData = z.infer<typeof estrategiaSchema>
