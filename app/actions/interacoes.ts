'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { z } from 'zod'
import { interacaoSchema, type InteracaoFormData } from '@/lib/schemas/interacoes'

export async function getInteracoes(prospeccaoId: string) {
    const supabase = await createClient()
    const { data, error } = await supabase
        .from('prospeccao_interacoes')
        .select('*')
        .eq('prospeccao_id', prospeccaoId)
        .order('created_at', { ascending: false })

    if (error) {
        console.error('Erro ao buscar interações:', error)
        return []
    }

    return data
}

// CREATE — registra a interação e atualiza data_ultima_interacao no prospect
export async function createInteracao(data: InteracaoFormData) {
    try {
        const supabase = await createClient()
        const validated = interacaoSchema.parse(data)

        const { error } = await supabase
            .from('prospeccao_interacoes')
            .insert({
                ...validated,
                proximo_passo: validated.proximo_passo || null,
            })

        if (error) {
            console.error('Erro ao registrar interação:', error)
            return { error: 'Erro ao registrar interação.' }
        }

        await supabase
            .from('prospeccoes')
            .update({ data_ultima_interacao: new Date().toISOString() })
            .eq('id', validated.prospeccao_id)

        revalidatePath(`/prospeccao/${validated.prospeccao_id}`)
        revalidatePath('/prospeccao')
        return { success: true }
    } catch (error) {
        console.error('Erro ao registrar interação:', error)
        if (error instanceof z.ZodError) {
            return { error: 'Dados inválidos. Verifique os campos.' }
        }
        return { error: 'Erro ao registrar interação.' }
    }
}
