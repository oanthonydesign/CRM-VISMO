'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { z } from 'zod'
import { profileSchema, type ProfileFormData } from '@/lib/schemas/profiles'

// GET
export async function getProfiles() {
    const supabase = await createClient()
    const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('full_name', { ascending: true })

    if (error) {
        console.error('Error fetching profiles:', error)
        return []
    }

    return data
}

// UPDATE
export async function updateProfile(id: string, data: Partial<ProfileFormData>) {
    try {
        const supabase = await createClient()

        // Validar dados (apenas os campos enviados)
        // O schema completo pode ser rigoroso demais para updates parciais, 
        // mas aqui vamos assumir que o form envia dados válidos.

        const { error } = await supabase
            .from('profiles')
            .update({
                full_name: data.full_name,
                role: data.role,
                department: data.department,
                updated_at: new Date().toISOString(),
            })
            .eq('id', id)

        if (error) {
            console.error('Erro ao atualizar perfil:', error)
            return { error: 'Erro ao atualizar perfil.' }
        }

        revalidatePath('/colaboradores')
        return { success: true }
    } catch (error) {
        console.error('Erro ao atualizar perfil:', error)
        return { error: 'Erro ao atualizar perfil.' }
    }
}

// NOTE: Create Profile não é implementado aqui pois requer criação de usuário no Auth.
// Isso deve ser feito via convite no painel Supabase ou com Service Role Key.
