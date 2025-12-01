import { z } from 'zod'

export const projectSchema = z.object({
    nome: z.string().min(1, 'Nome do projeto é obrigatório'),
    empresa_id: z.string().min(1, 'Empresa é obrigatória'),
    descricao: z.string().optional(),
    status: z.enum([
        'planejamento',
        'em_andamento',
        'em_revisao',
        'concluido',
        'cancelado'
    ]),
    health: z.enum([
        'on_track',
        'at_risk',
        'off_track'
    ]),
    progress: z.number().min(0).max(100),
    deadline: z.string().optional().or(z.literal('')),
    owner_id: z.string().optional(),
    valor_projeto: z.number().min(0).optional(),
})

export type ProjectFormData = z.infer<typeof projectSchema>
