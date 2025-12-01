import { z } from 'zod'

export const profileSchema = z.object({
    full_name: z.string().min(1, 'Nome completo é obrigatório'),
    email: z.string().email('Email inválido').optional(), // Email geralmente não editável, mas útil para display/criação
    role: z.enum(['admin', 'member', 'manager', 'sales']),
    department: z.string().optional(),
    avatar_url: z.string().optional(),
})

export type ProfileFormData = z.infer<typeof profileSchema>
