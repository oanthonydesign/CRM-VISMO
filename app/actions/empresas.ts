'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { z } from 'zod'
import { empresaSchema, type EmpresaFormData } from '@/lib/schemas/empresas'

// GET
export async function getEmpresas() {
    const supabase = await createClient()
    const { data, error } = await supabase
        .from('empresas')
        .select('*')
        .order('created_at', { ascending: false })

    if (error) {
        console.error('Error fetching empresas:', error)
        return []
    }

    return data
}

// CREATE
export async function createEmpresa(data: EmpresaFormData) {
    try {
        const supabase = await createClient()

        // Validar dados
        const validated = empresaSchema.parse(data)

        const { error } = await supabase
            .from('empresas')
            .insert({
                ...validated,
                nome_fantasia: validated.nome_fantasia || null,
                cnpj: validated.cnpj || null,
                setor: validated.setor || null,
                tamanho: validated.tamanho || null,
                endereco: validated.endereco || null,
                cidade: validated.cidade || null,
                estado: validated.estado || null,
                origem: validated.origem || null,
            })

        if (error) {
            console.error('Erro ao criar empresa:', error)
            return { error: 'Erro ao criar empresa.' }
        }

        revalidatePath('/empresas')
        return { success: true }
    } catch (error) {
        console.error('Erro ao criar empresa:', error)
        if (error instanceof z.ZodError) {
            return { error: 'Dados inválidos.' }
        }
        return { error: 'Erro ao criar empresa.' }
    }
}

// UPDATE
export async function updateEmpresa(id: string, data: EmpresaFormData) {
    try {
        const supabase = await createClient()

        const validated = empresaSchema.parse(data)

        const { error } = await supabase
            .from('empresas')
            .update({
                ...validated,
                nome_fantasia: validated.nome_fantasia || null,
                cnpj: validated.cnpj || null,
                setor: validated.setor || null,
                tamanho: validated.tamanho || null,
                endereco: validated.endereco || null,
                cidade: validated.cidade || null,
                estado: validated.estado || null,
                origem: validated.origem || null,
                updated_at: new Date().toISOString(),
            })
            .eq('id', id)

        if (error) {
            console.error('Erro ao atualizar empresa:', error)
            return { error: 'Erro ao atualizar empresa.' }
        }

        revalidatePath('/empresas')
        return { success: true }
    } catch (error) {
        console.error('Erro ao atualizar empresa:', error)
        return { error: 'Erro ao atualizar empresa.' }
    }
}

// DELETE
export async function deleteEmpresa(id: string) {
    try {
        const supabase = await createClient()

        const { error } = await supabase
            .from('empresas')
            .delete()
            .eq('id', id)

        if (error) {
            console.error('Erro ao deletar empresa:', error)
            return { error: 'Erro ao deletar empresa.' }
        }

        revalidatePath('/empresas')
        return { success: true }
    } catch (error) {
        console.error('Erro ao deletar empresa:', error)
        return { error: 'Erro ao deletar empresa.' }
    }
}
