"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2 } from "lucide-react"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Form, FormField, FormLabel, FormMessage } from "@/components/ui/form"
import { createTransaction, updateTransaction } from "@/app/actions/finance"
import { transactionSchema, type TransactionFormData } from "@/lib/schemas/transactions"
import { toast } from "@/lib/toast"

interface TransactionFormDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    transaction?: {
        id: string
        descricao: string
        valor: number
        tipo: string
        categoria?: string | null
        data_transacao: string
        status: string
        comprovante_url?: string | null
    }
}

export function TransactionFormDialog({ open, onOpenChange, transaction }: TransactionFormDialogProps) {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const isEditing = !!transaction

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        setValue,
        watch,
    } = useForm<TransactionFormData>({
        resolver: zodResolver(transactionSchema),
        defaultValues: transaction
            ? {
                descricao: transaction.descricao,
                valor: transaction.valor,
                tipo: transaction.tipo as any,
                categoria: transaction.categoria || "",
                data_transacao: transaction.data_transacao,
                status: transaction.status as any,
                comprovante_url: transaction.comprovante_url || "",
            }
            : {
                descricao: "",
                valor: 0,
                tipo: "entrada",
                categoria: "",
                data_transacao: new Date().toISOString().split('T')[0],
                status: "pendente",
                comprovante_url: "",
            },
    })

    const onSubmit = async (data: TransactionFormData) => {
        setIsSubmitting(true)

        try {
            const result = isEditing
                ? await updateTransaction(transaction.id, data)
                : await createTransaction(data)

            if (result.error) {
                toast.error(isEditing ? "Erro ao atualizar transação" : "Erro ao criar transação", result.error)
            } else {
                toast.success(
                    isEditing ? "Transação atualizada!" : "Transação criada!"
                )
                reset()
                onOpenChange(false)
            }
        } catch (error) {
            toast.error("Erro inesperado", "Tente novamente mais tarde.")
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>{isEditing ? "Editar Transação" : "Nova Transação"}</DialogTitle>
                    <DialogDescription>
                        {isEditing
                            ? "Atualize os detalhes da transação financeira."
                            : "Registre uma nova entrada ou saída financeira."}
                    </DialogDescription>
                </DialogHeader>

                <Form onSubmit={handleSubmit(onSubmit)}>
                    <div className="grid gap-4 py-4">
                        {/* Descrição */}
                        <FormField>
                            <FormLabel>Descrição *</FormLabel>
                            <Input
                                {...register("descricao")}
                                placeholder="Ex: Pagamento Cliente X"
                                disabled={isSubmitting}
                            />
                            {errors.descricao && <FormMessage>{errors.descricao.message}</FormMessage>}
                        </FormField>

                        <div className="grid grid-cols-2 gap-4">
                            {/* Tipo */}
                            <FormField>
                                <FormLabel>Tipo *</FormLabel>
                                <Select
                                    value={watch("tipo")}
                                    onValueChange={(value) => setValue("tipo", value as any)}
                                    disabled={isSubmitting}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Selecione o tipo" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="entrada">Entrada (Receita)</SelectItem>
                                        <SelectItem value="saida">Saída (Despesa)</SelectItem>
                                    </SelectContent>
                                </Select>
                                {errors.tipo && <FormMessage>{errors.tipo.message}</FormMessage>}
                            </FormField>

                            {/* Valor */}
                            <FormField>
                                <FormLabel>Valor (R$) *</FormLabel>
                                <Input
                                    type="number"
                                    step="0.01"
                                    {...register("valor", { valueAsNumber: true })}
                                    placeholder="0,00"
                                    disabled={isSubmitting}
                                />
                                {errors.valor && <FormMessage>{errors.valor.message}</FormMessage>}
                            </FormField>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            {/* Categoria */}
                            <FormField>
                                <FormLabel>Categoria</FormLabel>
                                <Input
                                    {...register("categoria")}
                                    placeholder="Ex: Vendas, Marketing"
                                    disabled={isSubmitting}
                                />
                            </FormField>

                            {/* Data */}
                            <FormField>
                                <FormLabel>Data da Transação *</FormLabel>
                                <Input
                                    type="date"
                                    {...register("data_transacao")}
                                    disabled={isSubmitting}
                                />
                                {errors.data_transacao && <FormMessage>{errors.data_transacao.message}</FormMessage>}
                            </FormField>
                        </div>

                        {/* Status */}
                        <FormField>
                            <FormLabel>Status</FormLabel>
                            <Select
                                value={watch("status")}
                                onValueChange={(value) => setValue("status", value as any)}
                                disabled={isSubmitting}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Selecione o status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="pendente">Pendente</SelectItem>
                                    <SelectItem value="realizado">Realizado</SelectItem>
                                    <SelectItem value="cancelado">Cancelado</SelectItem>
                                </SelectContent>
                            </Select>
                        </FormField>
                    </div>

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            disabled={isSubmitting}
                        >
                            Cancelar
                        </Button>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {isEditing ? "Salvar" : "Criar"}
                        </Button>
                    </DialogFooter>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
