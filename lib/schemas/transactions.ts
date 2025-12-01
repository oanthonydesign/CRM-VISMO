import { z } from 'zod'

export const transactionSchema = z.object({
    descricao: z.string().min(1, 'Descrição é obrigatória'),
    valor: z.number().min(0.01, 'Valor deve ser maior que zero'),
    tipo: z.enum(['entrada', 'saida']),
    categoria: z.string().optional(),
    data_transacao: z.string().min(1, 'Data é obrigatória'),
    status: z.enum(['pendente', 'realizado', 'cancelado']),
    comprovante_url: z.string().optional(),
})

export type TransactionFormData = z.infer<typeof transactionSchema>
