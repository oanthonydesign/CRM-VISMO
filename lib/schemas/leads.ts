import { z } from 'zod'

// Schema de validação
export const leadSchema = z.object({
    nome: z.string().min(1, 'Nome é obrigatório'),
    empresa: z.string().optional(),
    email: z.string().optional(),
    telefone: z.string().optional(),
    status: z.enum(['novo', 'qualificando', 'arquivado']),
    origem: z.enum(['linkedin', 'site', 'indicacao', 'instagram', 'outro']).optional(),
    observacoes: z.string().optional(),
})

export type LeadFormData = z.infer<typeof leadSchema>
