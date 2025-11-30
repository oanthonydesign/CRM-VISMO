'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function getContracts() {
    const supabase = await createClient()
    const { data, error } = await supabase
        .from('contracts')
        .select('*, empresas(nome)')
        .order('created_at', { ascending: false })

    if (error) {
        console.error('Error fetching contracts:', error)
        return []
    }

    return data
}

export async function createContract(formData: FormData) {
    const supabase = await createClient()

    const rawData = {
        titulo: formData.get('titulo') as string,
        empresa_id: formData.get('empresa_id') as string,
        valor_total: parseFloat(formData.get('valor_total') as string),
        data_inicio: formData.get('data_inicio') as string,
        status: 'ativo'
    }

    const { error } = await supabase
        .from('contracts')
        .insert(rawData)

    if (error) {
        console.error('Error creating contract:', error)
        return { error: 'Failed to create contract' }
    }

    revalidatePath('/financeiro')
    return { success: true }
}

export async function registerTransaction(formData: FormData) {
    const supabase = await createClient()

    const rawData = {
        descricao: formData.get('descricao') as string,
        valor: parseFloat(formData.get('valor') as string),
        tipo: formData.get('tipo') as string, // entrada or saida
        categoria: formData.get('categoria') as string,
        data_transacao: formData.get('data_transacao') as string,
        status: 'realizado'
    }

    const { error } = await supabase
        .from('transactions')
        .insert(rawData)

    if (error) {
        console.error('Error registering transaction:', error)
        return { error: 'Failed to register transaction' }
    }

    revalidatePath('/financeiro')
    return { success: true }
}

export async function getCashFlow() {
    const supabase = await createClient()
    const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .order('data_transacao', { ascending: true })

    if (error) {
        console.error('Error fetching cash flow:', error)
        return []
    }

    return data
}
