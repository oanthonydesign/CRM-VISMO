'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { z } from 'zod'
import { goalSchema, type GoalFormData } from '@/lib/schemas/goals'

// GET Goals
export async function getGoals() {
    const supabase = await createClient()
    const { data, error } = await supabase
        .from('metas')
        .select(`
            *,
            owner:profiles(id, full_name, avatar_url)
        `)
        .order('created_at', { ascending: false })

    if (error) {
        console.error('Error fetching goals:', error)
        return []
    }

    return data
}

// CREATE Goal
export async function createGoal(data: GoalFormData) {
    try {
        const supabase = await createClient()

        const validated = goalSchema.parse(data)

        const { error } = await supabase
            .from('metas')
            .insert({
                ...validated,
                atual_valor: validated.atual_valor || 0,
                owner_id: validated.owner_id || null,
                data_inicio: validated.data_inicio || null,
                data_fim: validated.data_fim || null,
            })

        if (error) {
            console.error('Erro ao criar meta:', error)
            return { error: 'Erro ao criar meta.' }
        }

        revalidatePath('/metas')
        return { success: true }
    } catch (error) {
        console.error('Erro ao criar meta:', error)
        if (error instanceof z.ZodError) {
            return { error: 'Dados inválidos.' }
        }
        return { error: 'Erro ao criar meta.' }
    }
}

// UPDATE Goal
export async function updateGoal(id: string, data: Partial<GoalFormData>) {
    try {
        const supabase = await createClient()

        const { error } = await supabase
            .from('metas')
            .update({
                ...data,
                updated_at: new Date().toISOString(),
            })
            .eq('id', id)

        if (error) {
            console.error('Erro ao atualizar meta:', error)
            return { error: 'Erro ao atualizar meta.' }
        }

        revalidatePath('/metas')
        return { success: true }
    } catch (error) {
        console.error('Erro ao atualizar meta:', error)
        return { error: 'Erro ao atualizar meta.' }
    }
}

// UPDATE Goal Progress
export async function updateGoalProgress(id: string, atualValor: number) {
    try {
        const supabase = await createClient()

        const { error } = await supabase
            .from('metas')
            .update({
                atual_valor: atualValor,
                updated_at: new Date().toISOString(),
            })
            .eq('id', id)

        if (error) {
            console.error('Erro ao atualizar progresso:', error)
            return { error: 'Erro ao atualizar progresso.' }
        }

        revalidatePath('/metas')
        return { success: true }
    } catch (error) {
        console.error('Erro ao atualizar progresso:', error)
        return { error: 'Erro ao atualizar progresso.' }
    }
}

// DELETE Goal
export async function deleteGoal(id: string) {
    try {
        const supabase = await createClient()

        const { error } = await supabase
            .from('metas')
            .delete()
            .eq('id', id)

        if (error) {
            console.error('Erro ao deletar meta:', error)
            return { error: 'Erro ao deletar meta.' }
        }

        revalidatePath('/metas')
        return { success: true }
    } catch (error) {
        console.error('Erro ao deletar meta:', error)
        return { error: 'Erro ao deletar meta.' }
    }
}
