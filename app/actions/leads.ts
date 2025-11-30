'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { z } from 'zod'

// Schema de validação
export const leadSchema = z.object({
    nome: z.string().min(1, 'Nome é obrigatório'),
    empresa: z.string().optional(),
    email: z.string().email('Email inválido').optional().or(z.literal('')),
    telefone: z.string().optional(),
    status: z.enum(['novo', 'qualificando', 'arquivado']).default('novo'),
    origem: z.enum(['linkedin', 'site', 'indicacao', 'instagram', 'outro']).optional(),
    observacoes: z.string().optional(),
})

export type LeadFormData = z.infer<typeof leadSchema>

// CREATE
export async function createLead(data: LeadFormData) {
    try {
        const supabase = await createClient()

        // Validar dados
        const validated = leadSchema.parse(data)

        const { error } = await supabase
            .from('prospeccoes')
            .insert({
                ...validated,
                email: validated.email || null,
                telefone: validated.telefone || null,
                empresa: validated.empresa || null,
                origem: validated.origem || null,
                observacoes: validated.observacoes || null,
            })

        if (error) {
            console.error('Erro ao criar lead:', error)
            return { error: 'Erro ao criar lead. Verifique os dados e tente novamente.' }
        }

        revalidatePath('/leads')
        return { success: true }
    } catch (error) {
        console.error('Erro ao criar lead:', error)
        if (error instanceof z.ZodError) {
            return { error: 'Dados inválidos. Verifique os campos.' }
        }
        return { error: 'Erro ao criar lead.' }
    }
}

// UPDATE
export async function updateLead(id: string, data: LeadFormData) {
    try {
        const supabase = await createClient()

        // Validar dados
        const validated = leadSchema.parse(data)

        const { error } = await supabase
            .from('prospeccoes')
            .update({
                ...validated,
                email: validated.email || null,
                telefone: validated.telefone || null,
                empresa: validated.empresa || null,
                origem: validated.origem || null,
                observacoes: validated.observacoes || null,
                updated_at: new Date().toISOString(),
            })
            .eq('id', id)

        if (error) {
            console.error('Erro ao atualizar lead:', error)
            return { error: 'Erro ao atualizar lead.' }
        }

        revalidatePath('/leads')
        return { success: true }
    } catch (error) {
        console.error('Erro ao atualizar lead:', error)
        if (error instanceof z.ZodError) {
            return { error: 'Dados inválidos. Verifique os campos.' }
        }
        return { error: 'Erro ao atualizar lead.' }
    }
}

// DELETE
export async function deleteLead(id: string) {
    try {
        const supabase = await createClient()

        const { error } = await supabase
            .from('prospeccoes')
            .delete()
            .eq('id', id)

        if (error) {
            console.error('Erro ao deletar lead:', error)
            return { error: 'Erro ao deletar lead.' }
        }

        revalidatePath('/leads')
        return { success: true }
    } catch (error) {
        console.error('Erro ao deletar lead:', error)
        return { error: 'Erro ao deletar lead.' }
    }
}
