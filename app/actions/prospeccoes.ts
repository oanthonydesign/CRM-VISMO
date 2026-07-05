'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { z } from 'zod'
import { prospeccaoSchema, type ProspeccaoFormData } from '@/lib/schemas/prospeccoes'

function revalidateProspeccao() {
    revalidatePath('/prospeccao')
    revalidatePath('/prospeccao/radar')
    revalidatePath('/prospeccao/pipeline')
}

// GET (lista completa, usada pelas 4 telas)
export async function getProspeccoes() {
    const supabase = await createClient()
    const { data, error } = await supabase
        .from('prospeccoes')
        .select('*')
        .order('created_at', { ascending: false })

    if (error) {
        console.error('Erro ao buscar prospecções:', error)
        return []
    }

    return data
}

export async function getProspeccao(id: string) {
    const supabase = await createClient()
    const { data, error } = await supabase
        .from('prospeccoes')
        .select('*')
        .eq('id', id)
        .single()

    if (error) {
        console.error('Erro ao buscar prospecção:', error)
        return null
    }

    return data
}

// CREATE
export async function createProspeccao(data: ProspeccaoFormData) {
    try {
        const supabase = await createClient()
        const validated = prospeccaoSchema.parse(data)

        const { error } = await supabase
            .from('prospeccoes')
            .insert({
                ...validated,
                empresa: validated.empresa || null,
                segmento: validated.segmento || null,
                telefone: validated.telefone || null,
                instagram: validated.instagram || null,
                origem: validated.origem || null,
                oportunidade: validated.oportunidade || null,
                como_ajudar: validated.como_ajudar || null,
                ideia_abordagem: validated.ideia_abordagem || null,
                observacoes: validated.observacoes || null,
            })

        if (error) {
            console.error('Erro ao criar prospecção:', error)
            return { error: 'Erro ao criar prospecção. Verifique os dados e tente novamente.' }
        }

        revalidateProspeccao()
        return { success: true }
    } catch (error) {
        console.error('Erro ao criar prospecção:', error)
        if (error instanceof z.ZodError) {
            return { error: 'Dados inválidos. Verifique os campos.' }
        }
        return { error: 'Erro ao criar prospecção.' }
    }
}

// UPDATE
export async function updateProspeccao(id: string, data: ProspeccaoFormData) {
    try {
        const supabase = await createClient()
        const validated = prospeccaoSchema.parse(data)

        const { error } = await supabase
            .from('prospeccoes')
            .update({
                ...validated,
                empresa: validated.empresa || null,
                segmento: validated.segmento || null,
                telefone: validated.telefone || null,
                instagram: validated.instagram || null,
                origem: validated.origem || null,
                oportunidade: validated.oportunidade || null,
                como_ajudar: validated.como_ajudar || null,
                ideia_abordagem: validated.ideia_abordagem || null,
                observacoes: validated.observacoes || null,
                updated_at: new Date().toISOString(),
            })
            .eq('id', id)

        if (error) {
            console.error('Erro ao atualizar prospecção:', error)
            return { error: 'Erro ao atualizar prospecção.' }
        }

        revalidateProspeccao()
        revalidatePath(`/prospeccao/${id}`)
        return { success: true }
    } catch (error) {
        console.error('Erro ao atualizar prospecção:', error)
        if (error instanceof z.ZodError) {
            return { error: 'Dados inválidos. Verifique os campos.' }
        }
        return { error: 'Erro ao atualizar prospecção.' }
    }
}

// MOVER DE ESTÁGIO (Radar -> abordar, Pipeline -> drag & drop)
// Toda transição de estágio passa por aqui para manter data_abordagem e
// data_ultima_interacao consistentes nos dois fluxos.
export async function moveProspeccaoStage(id: string, novoStatus: string) {
    try {
        const supabase = await createClient()

        const updates: Record<string, unknown> = {
            status: novoStatus,
            updated_at: new Date().toISOString(),
            data_ultima_interacao: new Date().toISOString(),
        }

        if (novoStatus !== 'novo') {
            const { data: atual } = await supabase
                .from('prospeccoes')
                .select('data_abordagem')
                .eq('id', id)
                .single()

            if (!atual?.data_abordagem) {
                updates.data_abordagem = new Date().toISOString().slice(0, 10)
            }
        }

        const { error } = await supabase
            .from('prospeccoes')
            .update(updates)
            .eq('id', id)

        if (error) {
            console.error('Erro ao mover prospecção:', error)
            return { error: 'Erro ao mover prospecção.' }
        }

        revalidateProspeccao()
        revalidatePath(`/prospeccao/${id}`)
        return { success: true }
    } catch (error) {
        console.error('Erro ao mover prospecção:', error)
        return { error: 'Erro ao mover prospecção.' }
    }
}

// DELETE
export async function deleteProspeccao(id: string) {
    try {
        const supabase = await createClient()

        const { error } = await supabase
            .from('prospeccoes')
            .delete()
            .eq('id', id)

        if (error) {
            console.error('Erro ao deletar prospecção:', error)
            return { error: 'Erro ao deletar prospecção.' }
        }

        revalidateProspeccao()
        return { success: true }
    } catch (error) {
        console.error('Erro ao deletar prospecção:', error)
        return { error: 'Erro ao deletar prospecção.' }
    }
}
