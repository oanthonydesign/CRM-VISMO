'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function getDeals() {
    const supabase = await createClient()
    const { data, error } = await supabase
        .from('deals')
        .select('*, empresas(nome)')
        .order('created_at', { ascending: false })

    if (error) {
        console.error('Error fetching deals:', error)
        return []
    }

    return data
}

export async function createDeal(formData: FormData) {
    const supabase = await createClient()

    const rawData = {
        titulo: formData.get('titulo') as string,
        empresa_id: formData.get('empresa_id') as string,
        valor: parseFloat(formData.get('valor') as string),
        estagio: 'descoberta',
        probabilidade: 10,
    }

    const { error } = await supabase
        .from('deals')
        .insert(rawData)

    if (error) {
        console.error('Error creating deal:', error)
        return { error: 'Failed to create deal' }
    }

    revalidatePath('/oportunidades')
    return { success: true }
}

export async function updateDeal(id: string, data: any) {
    const supabase = await createClient()

    const { error } = await supabase
        .from('deals')
        .update(data)
        .eq('id', id)

    if (error) {
        console.error('Error updating deal:', error)
        return { error: 'Failed to update deal' }
    }

    revalidatePath('/oportunidades')
    return { success: true }
}
