import { z } from 'zod'

export const empresaSchema = z.object({
    nome: z.string().min(1, 'Razão Social é obrigatória'),
    nome_fantasia: z.string().optional(),
    cnpj: z.string().optional(), // TODO: Adicionar validação de CNPJ se necessário
    tipo: z.enum(['cliente', 'parceiro', 'fornecedor', 'prospect']).default('prospect'),
    status: z.enum(['ativo', 'inativo', 'churn']).default('ativo'),
    setor: z.string().optional(),
    tamanho: z.enum(['pequena', 'media', 'grande', 'enterprise']).optional(),
    endereco: z.string().optional(),
    cidade: z.string().optional(),
    estado: z.string().length(2, 'Use a sigla do estado (ex: SP)').optional().or(z.literal('')),
    origem: z.string().optional(),
})

export type EmpresaFormData = z.infer<typeof empresaSchema>
