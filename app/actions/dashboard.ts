'use server'

import { createClient } from '@/lib/supabase/server'

export async function getKPIs() {
    const supabase = await createClient()

    // Parallel fetch for dashboard metrics
    const [
        { count: dealsCount },
        { count: projectsCount },
        { data: transactions }
    ] = await Promise.all([
        supabase.from('deals').select('*', { count: 'exact', head: true }),
        supabase.from('projects').select('*', { count: 'exact', head: true }),
        supabase.from('entradas_saidas').select('valor, tipo')
    ])

    // Calculate revenue (Entradas - Saidas)
    const receita = transactions?.reduce((acc, curr) => {
        return curr.tipo === 'entrada' ? acc + curr.valor : acc
    }, 0) || 0

    return {
        dealsCount: dealsCount || 0,
        projectsCount: projectsCount || 0,
        receita
    }
}

export async function getGoals() {
    const supabase = await createClient()
    const { data, error } = await supabase
        .from('metas')
        .select('*')
        .order('created_at', { ascending: false })

    if (error) {
        console.error('Error fetching goals:', error)
        return []
    }

    return data
}
