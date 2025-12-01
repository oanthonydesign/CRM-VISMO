'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { z } from 'zod'
import { projectSchema, type ProjectFormData } from '@/lib/schemas/projects'

// GET
export async function getProjects() {
    const supabase = await createClient()
    const { data, error } = await supabase
        .from('projects')
        .select(`
            *,
            empresa:empresas(id, nome),
            owner:profiles(id, full_name, avatar_url)
        `)
        .order('deadline', { ascending: true })

    if (error) {
        console.error('Error fetching projects:', error)
        return []
    }

    return data
}

// CREATE
export async function createProject(data: ProjectFormData) {
    try {
        const supabase = await createClient()

        const validated = projectSchema.parse(data)

        const { error } = await supabase
            .from('projects')
            .insert({
                ...validated,
                deadline: validated.deadline || null,
                owner_id: validated.owner_id || null,
                valor_projeto: validated.valor_projeto || null,
            })

        if (error) {
            console.error('Erro ao criar projeto:', error)
            return { error: 'Erro ao criar projeto.' }
        }

        revalidatePath('/projetos')
        return { success: true }
    } catch (error) {
        console.error('Erro ao criar projeto:', error)
        if (error instanceof z.ZodError) {
            return { error: 'Dados inválidos.' }
        }
        return { error: 'Erro ao criar projeto.' }
    }
}

// UPDATE
export async function updateProject(id: string, data: Partial<ProjectFormData>) {
    try {
        const supabase = await createClient()

        const { error } = await supabase
            .from('projects')
            .update({
                ...data,
                updated_at: new Date().toISOString(),
            })
            .eq('id', id)

        if (error) {
            console.error('Erro ao atualizar projeto:', error)
            return { error: 'Erro ao atualizar projeto.' }
        }

        revalidatePath('/projetos')
        return { success: true }
    } catch (error) {
        console.error('Erro ao atualizar projeto:', error)
        return { error: 'Erro ao atualizar projeto.' }
    }
}

// DELETE
export async function deleteProject(id: string) {
    try {
        const supabase = await createClient()

        const { error } = await supabase
            .from('projects')
            .delete()
            .eq('id', id)

        if (error) {
            console.error('Erro ao deletar projeto:', error)
            return { error: 'Erro ao deletar projeto.' }
        }

        revalidatePath('/projetos')
        return { success: true }
    } catch (error) {
        console.error('Erro ao deletar projeto:', error)
        return { error: 'Erro ao deletar projeto.' }
    }
}
