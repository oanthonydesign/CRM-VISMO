'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { z } from 'zod'
import { transactionSchema, type TransactionFormData } from '@/lib/schemas/transactions'

// GET Transactions
export async function getTransactions() {
    const supabase = await createClient()
    const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .order('data_transacao', { ascending: false })

    if (error) {
        console.error('Error fetching transactions:', error)
        return []
    }

    return data
}

// GET Cash Flow (alias for getTransactions)
export async function getCashFlow() {
    return getTransactions()
}

// CREATE Transaction
export async function createTransaction(data: TransactionFormData) {
    try {
        const supabase = await createClient()

        const validated = transactionSchema.parse(data)

        const { error } = await supabase
            .from('transactions')
            .insert({
                ...validated,
                comprovante_url: validated.comprovante_url || null,
                categoria: validated.categoria || null,
            })

        if (error) {
            console.error('Erro ao criar transação:', error)
            return { error: 'Erro ao criar transação.' }
        }

        revalidatePath('/financeiro')
        return { success: true }
    } catch (error) {
        console.error('Erro ao criar transação:', error)
        if (error instanceof z.ZodError) {
            return { error: 'Dados inválidos.' }
        }
        return { error: 'Erro ao criar transação.' }
    }
}

// UPDATE Transaction
export async function updateTransaction(id: string, data: Partial<TransactionFormData>) {
    try {
        const supabase = await createClient()

        const { error } = await supabase
            .from('transactions')
            .update({
                ...data,
                updated_at: new Date().toISOString(),
            })
            .eq('id', id)

        if (error) {
            console.error('Erro ao atualizar transação:', error)
            return { error: 'Erro ao atualizar transação.' }
        }

        revalidatePath('/financeiro')
        return { success: true }
    } catch (error) {
        console.error('Erro ao atualizar transação:', error)
        return { error: 'Erro ao atualizar transação.' }
    }
}

// DELETE Transaction
export async function deleteTransaction(id: string) {
    try {
        const supabase = await createClient()

        const { error } = await supabase
            .from('transactions')
            .delete()
            .eq('id', id)

        if (error) {
            console.error('Erro ao deletar transação:', error)
            return { error: 'Erro ao deletar transação.' }
        }

        revalidatePath('/financeiro')
        return { success: true }
    } catch (error) {
        console.error('Erro ao deletar transação:', error)
        return { error: 'Erro ao deletar transação.' }
    }
}

// Legacy function for compatibility
export async function registerTransaction(formData: FormData) {
    const data: TransactionFormData = {
        descricao: formData.get('descricao') as string,
        valor: parseFloat(formData.get('valor') as string),
        tipo: formData.get('tipo') as 'entrada' | 'saida',
        categoria: formData.get('categoria') as string,
        data_transacao: formData.get('data_transacao') as string,
        status: 'realizado',
    }

    return createTransaction(data)
}


