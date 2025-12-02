import { z } from 'zod'

export const taskSchema = z.object({
    title: z.string().min(1, 'Título é obrigatório'),
    project_id: z.string().min(1, 'Projeto é obrigatório'),
    description: z.string().optional(),
    status: z.enum(['todo', 'in_progress', 'review', 'done', 'blocked']),
    priority: z.enum(['low', 'medium', 'high', 'urgent']),
    assignee_id: z.string().optional(),
    due_date: z.string().optional().or(z.literal('')),
})

export type TaskFormData = z.infer<typeof taskSchema>
