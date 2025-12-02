import { z } from 'zod'

export const contactSchema = z.object({
    nome: z.string().min(1, 'Nome é obrigatório'),
    empresa_id: z.string().min(1, 'Empresa é obrigatória'),
    cargo: z.string().optional(),
    email: z.string().email('Email inválido').optional().or(z.literal('')),
    telefone: z.string().optional(),
    linkedin: z.string().optional(),
    is_primary: z.boolean().optional(),
})

export type ContactFormData = z.infer<typeof contactSchema>
