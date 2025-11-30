'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

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

export async function createEmpresa(formData: FormData) {
    const supabase = await createClient()

    const rawData = {
        nome: formData.get('nome') as string,
        tipo: formData.get('tipo') as string,
        email: formData.get('email') as string,
        telefone: formData.get('telefone') as string,
        status: 'ativo',
    }

    const { error } = await supabase
        .from('empresas')
        .insert(rawData)

    if (error) {
        console.error('Error creating empresa:', error)
        return { error: 'Failed to create empresa' }
    }

    revalidatePath('/empresas')
    revalidatePath('/leads')
    return { success: true }
}

export async function updateEmpresa(id: string, data: any) {
    const supabase = await createClient()

    const { error } = await supabase
        .from('empresas')
        .update(data)
        .eq('id', id)

    if (error) {
        console.error('Error updating empresa:', error)
        return { error: 'Failed to update empresa' }
    }

    revalidatePath('/empresas')
    revalidatePath('/leads')
    return { success: true }
}
