'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { z } from 'zod'
import { contactSchema, type ContactFormData } from '@/lib/schemas/contacts'

// GET Contacts
export async function getContacts() {
    const supabase = await createClient()
    const { data, error } = await supabase
        .from('contatos')
        .select(`
            *,
            empresa:empresas(id, nome, tipo)
        `)
        .order('created_at', { ascending: false })

    if (error) {
        console.error('Error fetching contacts:', error)
        return []
    }

    return data
}

// GET Contacts by Empresa
export async function getContactsByEmpresa(empresaId: string) {
    const supabase = await createClient()
    const { data, error } = await supabase
        .from('contatos')
        .select('*')
        .eq('empresa_id', empresaId)
        .order('is_primary', { ascending: false })

    if (error) {
        console.error('Error fetching contacts by empresa:', error)
        return []
    }

    return data
}

// CREATE Contact
export async function createContact(data: ContactFormData) {
    try {
        const supabase = await createClient()

        const validated = contactSchema.parse(data)

        const { error } = await supabase
            .from('contatos')
            .insert({
                ...validated,
                cargo: validated.cargo || null,
                email: validated.email || null,
                telefone: validated.telefone || null,
                linkedin: validated.linkedin || null,
                is_primary: validated.is_primary || false,
            })

        if (error) {
            console.error('Erro ao criar contato:', error)
            return { error: 'Erro ao criar contato.' }
        }

        revalidatePath('/empresas')
        return { success: true }
    } catch (error) {
        console.error('Erro ao criar contato:', error)
        if (error instanceof z.ZodError) {
            return { error: 'Dados inválidos.' }
        }
        return { error: 'Erro ao criar contato.' }
    }
}

// UPDATE Contact
export async function updateContact(id: string, data: Partial<ContactFormData>) {
    try {
        const supabase = await createClient()

        const { error } = await supabase
            .from('contatos')
            .update({
                ...data,
                updated_at: new Date().toISOString(),
            })
            .eq('id', id)

        if (error) {
            console.error('Erro ao atualizar contato:', error)
            return { error: 'Erro ao atualizar contato.' }
        }

        revalidatePath('/empresas')
        return { success: true }
    } catch (error) {
        console.error('Erro ao atualizar contato:', error)
        return { error: 'Erro ao atualizar contato.' }
    }
}

// DELETE Contact
export async function deleteContact(id: string) {
    try {
        const supabase = await createClient()

        const { error } = await supabase
            .from('contatos')
            .delete()
            .eq('id', id)

        if (error) {
            console.error('Erro ao deletar contato:', error)
            return { error: 'Erro ao deletar contato.' }
        }

        revalidatePath('/empresas')
        return { success: true }
    } catch (error) {
        console.error('Erro ao deletar contato:', error)
        return { error: 'Erro ao deletar contato.' }
    }
}

// SET Primary Contact
export async function setPrimaryContact(id: string, empresaId: string) {
    try {
        const supabase = await createClient()

        // First, remove primary from all contacts of this empresa
        await supabase
            .from('contatos')
            .update({ is_primary: false })
            .eq('empresa_id', empresaId)

        // Then set the selected contact as primary
        const { error } = await supabase
            .from('contatos')
            .update({ is_primary: true })
            .eq('id', id)

        if (error) {
            console.error('Erro ao definir contato principal:', error)
            return { error: 'Erro ao definir contato principal.' }
        }

        revalidatePath('/empresas')
        return { success: true }
    } catch (error) {
        console.error('Erro ao definir contato principal:', error)
        return { error: 'Erro ao definir contato principal.' }
    }
}
