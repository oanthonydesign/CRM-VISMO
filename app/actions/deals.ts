'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { z } from 'zod'
import { dealSchema, type DealFormData } from '@/lib/schemas/deals'

// GET
export async function getDeals() {
    const supabase = await createClient()
    const { data, error } = await supabase
        .from('deals')
        .select(`
            *,
            empresa:empresas(id, nome),
            responsavel:profiles(id, full_name, avatar_url)
        `)
        .order('created_at', { ascending: false })

    if (error) {
        console.error('Error fetching deals:', error)
        return []
    }

    return data
}

// CREATE
export async function createDeal(data: DealFormData) {
    try {
        const supabase = await createClient()

        const validated = dealSchema.parse(data)

        const { error } = await supabase
            .from('deals')
            .insert({
                ...validated,
                data_fechamento_prevista: validated.data_fechamento_prevista || null,
                responsavel_id: validated.responsavel_id || null,
            })

        if (error) {
            console.error('Erro ao criar deal:', error)
            return { error: 'Erro ao criar oportunidade.' }
        }

        revalidatePath('/oportunidades')
        return { success: true }
    } catch (error) {
        console.error('Erro ao criar deal:', error)
        if (error instanceof z.ZodError) {
            return { error: 'Dados inválidos.' }
        }
        return { error: 'Erro ao criar oportunidade.' }
    }
}

// UPDATE
export async function updateDeal(id: string, data: Partial<DealFormData>) {
    try {
        const supabase = await createClient()

        // Validar apenas os campos enviados (Partial)
        // Nota: Idealmente usaríamos dealSchema.partial().parse(data)

        const { error } = await supabase
            .from('deals')
            .update({
                ...data,
                updated_at: new Date().toISOString(),
            })
            .eq('id', id)

        if (error) {
            console.error('Erro ao atualizar deal:', error)
            return { error: 'Erro ao atualizar oportunidade.' }
        }

        revalidatePath('/oportunidades')
        return { success: true }
    } catch (error) {
        console.error('Erro ao atualizar deal:', error)
        return { error: 'Erro ao atualizar oportunidade.' }
    }
}

// UPDATE STAGE (Drag & Drop)
export async function updateDealStage(id: string, novoEstagio: string) {
    try {
        const supabase = await createClient()

        const { error } = await supabase
            .from('deals')
            .update({
                estagio: novoEstagio,
                updated_at: new Date().toISOString(),
            })
            .eq('id', id)

        if (error) {
            console.error('Erro ao mover deal:', error)
            return { error: 'Erro ao mover oportunidade.' }
        }

        revalidatePath('/oportunidades')
        return { success: true }
    } catch (error) {
        console.error('Erro ao mover deal:', error)
        return { error: 'Erro ao mover oportunidade.' }
    }
}

// DELETE
export async function deleteDeal(id: string) {
    try {
        const supabase = await createClient()

        const { error } = await supabase
            .from('deals')
            .delete()
            .eq('id', id)

        if (error) {
            console.error('Erro ao deletar deal:', error)
            return { error: 'Erro ao deletar oportunidade.' }
        }

        revalidatePath('/oportunidades')
        return { success: true }
    } catch (error) {
        console.error('Erro ao deletar deal:', error)
        return { error: 'Erro ao deletar oportunidade.' }
    }
}
