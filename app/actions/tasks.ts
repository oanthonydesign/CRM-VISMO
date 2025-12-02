'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { z } from 'zod'
import { taskSchema, type TaskFormData } from '@/lib/schemas/tasks'

// GET Tasks
export async function getTasks() {
    const supabase = await createClient()
    const { data, error } = await supabase
        .from('tasks')
        .select(`
            *,
            project:projects(id, nome),
            assignee:profiles(id, full_name, avatar_url)
        `)
        .order('created_at', { ascending: false })

    if (error) {
        console.error('Error fetching tasks:', error)
        return []
    }

    return data
}

// GET Tasks by Project
export async function getTasksByProject(projectId: string) {
    const supabase = await createClient()
    const { data, error } = await supabase
        .from('tasks')
        .select(`
            *,
            assignee:profiles(id, full_name, avatar_url)
        `)
        .eq('project_id', projectId)
        .order('priority', { ascending: false })

    if (error) {
        console.error('Error fetching tasks by project:', error)
        return []
    }

    return data
}

// CREATE Task
export async function createTask(data: TaskFormData) {
    try {
        const supabase = await createClient()

        const validated = taskSchema.parse(data)

        const { error } = await supabase
            .from('tasks')
            .insert({
                ...validated,
                description: validated.description || null,
                assignee_id: validated.assignee_id || null,
                due_date: validated.due_date || null,
            })

        if (error) {
            console.error('Erro ao criar tarefa:', error)
            return { error: 'Erro ao criar tarefa.' }
        }

        revalidatePath('/projetos')
        return { success: true }
    } catch (error) {
        console.error('Erro ao criar tarefa:', error)
        if (error instanceof z.ZodError) {
            return { error: 'Dados inválidos.' }
        }
        return { error: 'Erro ao criar tarefa.' }
    }
}

// UPDATE Task
export async function updateTask(id: string, data: Partial<TaskFormData>) {
    try {
        const supabase = await createClient()

        const { error } = await supabase
            .from('tasks')
            .update({
                ...data,
                updated_at: new Date().toISOString(),
            })
            .eq('id', id)

        if (error) {
            console.error('Erro ao atualizar tarefa:', error)
            return { error: 'Erro ao atualizar tarefa.' }
        }

        revalidatePath('/projetos')
        return { success: true }
    } catch (error) {
        console.error('Erro ao atualizar tarefa:', error)
        return { error: 'Erro ao atualizar tarefa.' }
    }
}

// UPDATE Task Status
export async function updateTaskStatus(id: string, status: string) {
    try {
        const supabase = await createClient()

        const { error } = await supabase
            .from('tasks')
            .update({
                status,
                updated_at: new Date().toISOString(),
            })
            .eq('id', id)

        if (error) {
            console.error('Erro ao atualizar status:', error)
            return { error: 'Erro ao atualizar status.' }
        }

        revalidatePath('/projetos')
        return { success: true }
    } catch (error) {
        console.error('Erro ao atualizar status:', error)
        return { error: 'Erro ao atualizar status.' }
    }
}

// DELETE Task
export async function deleteTask(id: string) {
    try {
        const supabase = await createClient()

        const { error } = await supabase
            .from('tasks')
            .delete()
            .eq('id', id)

        if (error) {
            console.error('Erro ao deletar tarefa:', error)
            return { error: 'Erro ao deletar tarefa.' }
        }

        revalidatePath('/projetos')
        return { success: true }
    } catch (error) {
        console.error('Erro ao deletar tarefa:', error)
        return { error: 'Erro ao deletar tarefa.' }
    }
}
