'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function getProjects() {
    const supabase = await createClient()
    const { data, error } = await supabase
        .from('projects')
        .select('*, empresas(nome)')
        .order('deadline', { ascending: true })

    if (error) {
        console.error('Error fetching projects:', error)
        return []
    }

    return data
}

export async function createProject(formData: FormData) {
    const supabase = await createClient()

    const rawData = {
        nome: formData.get('nome') as string,
        empresa_id: formData.get('empresa_id') as string,
        descricao: formData.get('descricao') as string,
        deadline: formData.get('deadline') as string,
        status: 'planejamento',
        health: 'on_track',
        progress: 0
    }

    const { error } = await supabase
        .from('projects')
        .insert(rawData)

    if (error) {
        console.error('Error creating project:', error)
        return { error: 'Failed to create project' }
    }

    revalidatePath('/projetos')
    return { success: true }
}

export async function updateProject(id: string, data: any) {
    const supabase = await createClient()

    const { error } = await supabase
        .from('projects')
        .update(data)
        .eq('id', id)

    if (error) {
        console.error('Error updating project:', error)
        return { error: 'Failed to update project' }
    }

    revalidatePath('/projetos')
    return { success: true }
}

export async function createTask(formData: FormData) {
    const supabase = await createClient()

    const rawData = {
        title: formData.get('title') as string,
        project_id: formData.get('project_id') as string,
        priority: formData.get('priority') as string,
        due_date: formData.get('due_date') as string,
        status: 'todo'
    }

    const { error } = await supabase
        .from('tasks')
        .insert(rawData)

    if (error) {
        console.error('Error creating task:', error)
        return { error: 'Failed to create task' }
    }

    revalidatePath('/projetos')
    return { success: true }
}
