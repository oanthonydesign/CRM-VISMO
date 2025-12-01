import { z } from 'zod'

export const goalSchema = z.object({
    titulo: z.string().min(1, 'Título é obrigatório'),
    meta_valor: z.number().min(0, 'Meta deve ser maior que zero'),
    atual_valor: z.number().min(0).optional(),
    periodo: z.enum(['mensal', 'trimestral', 'anual', 'customizado']),
    tipo: z.enum(['receita', 'vendas', 'projetos', 'clientes', 'leads', 'customizado']),
    owner_id: z.string().optional(),
    data_inicio: z.string().optional().or(z.literal('')),
    data_fim: z.string().optional().or(z.literal('')),
})

export type GoalFormData = z.infer<typeof goalSchema>
