'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { z } from 'zod'
import { estrategiaSchema, type EstrategiaFormData } from '@/lib/schemas/estrategias'

export async function getEstrategias() {
    const supabase = await createClient()
    const { data, error } = await supabase
        .from('estrategias_abordagem')
        .select('*')
        .order('segmento', { ascending: true })

    if (error) {
        console.error('Erro ao buscar estratégias:', error)
        return []
    }

    return data
}

export async function createEstrategia(data: EstrategiaFormData) {
    try {
        const supabase = await createClient()
        const validated = estrategiaSchema.parse(data)

        const { error } = await supabase
            .from('estrategias_abordagem')
            .insert({
                ...validated,
                gancho: validated.gancho || null,
                oferta: validated.oferta || null,
                canal_recomendado: validated.canal_recomendado || null,
            })

        if (error) {
            console.error('Erro ao criar estratégia:', error)
            return { error: 'Erro ao criar estratégia.' }
        }

        revalidatePath('/prospeccao/estrategias')
        return { success: true }
    } catch (error) {
        console.error('Erro ao criar estratégia:', error)
        if (error instanceof z.ZodError) {
            return { error: 'Dados inválidos. Verifique os campos.' }
        }
        return { error: 'Erro ao criar estratégia.' }
    }
}

export async function updateEstrategia(id: string, data: EstrategiaFormData) {
    try {
        const supabase = await createClient()
        const validated = estrategiaSchema.parse(data)

        const { error } = await supabase
            .from('estrategias_abordagem')
            .update({
                ...validated,
                gancho: validated.gancho || null,
                oferta: validated.oferta || null,
                canal_recomendado: validated.canal_recomendado || null,
                updated_at: new Date().toISOString(),
            })
            .eq('id', id)

        if (error) {
            console.error('Erro ao atualizar estratégia:', error)
            return { error: 'Erro ao atualizar estratégia.' }
        }

        revalidatePath('/prospeccao/estrategias')
        return { success: true }
    } catch (error) {
        console.error('Erro ao atualizar estratégia:', error)
        if (error instanceof z.ZodError) {
            return { error: 'Dados inválidos. Verifique os campos.' }
        }
        return { error: 'Erro ao atualizar estratégia.' }
    }
}

export async function deleteEstrategia(id: string) {
    try {
        const supabase = await createClient()

        const { error } = await supabase
            .from('estrategias_abordagem')
            .delete()
            .eq('id', id)

        if (error) {
            console.error('Erro ao deletar estratégia:', error)
            return { error: 'Erro ao deletar estratégia.' }
        }

        revalidatePath('/prospeccao/estrategias')
        return { success: true }
    } catch (error) {
        console.error('Erro ao deletar estratégia:', error)
        return { error: 'Erro ao deletar estratégia.' }
    }
}
