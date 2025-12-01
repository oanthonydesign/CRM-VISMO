"use client"

import { useState, useEffect } from "react"
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
import { createDeal, updateDeal } from "@/app/actions/deals"
import { dealSchema, type DealFormData } from "@/lib/schemas/deals"
import { toast } from "@/lib/toast"
import { createClient } from "@/lib/supabase/client"

interface DealFormDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    deal?: {
        id: string
        titulo: string
        empresa_id: string
        valor: number
        estagio: string
        probabilidade?: number
        data_fechamento_prevista?: string
        responsavel_id?: string
    }
    defaultStage?: string
}

export function DealFormDialog({ open, onOpenChange, deal, defaultStage }: DealFormDialogProps) {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [empresas, setEmpresas] = useState<{ id: string; nome: string }[]>([])
    const isEditing = !!deal

    // Buscar empresas para o select
    useEffect(() => {
        const fetchEmpresas = async () => {
            const supabase = createClient()
            const { data } = await supabase.from('empresas').select('id, nome').order('nome')
            if (data) setEmpresas(data)
        }
        if (open) fetchEmpresas()
    }, [open])

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        setValue,
        watch,
    } = useForm<DealFormData>({
        resolver: zodResolver(dealSchema),
        defaultValues: deal
            ? {
                titulo: deal.titulo,
                empresa_id: deal.empresa_id,
                valor: deal.valor,
                estagio: (deal.estagio as any) || "prospeccao",
                probabilidade: deal.probabilidade || 10,
                data_fechamento_prevista: deal.data_fechamento_prevista || "",
                responsavel_id: deal.responsavel_id || "",
            }
            : {
                titulo: "",
                empresa_id: "",
                valor: 0,
                estagio: (defaultStage as any) || "prospeccao",
                probabilidade: 10,
                data_fechamento_prevista: "",
                responsavel_id: "",
            },
    })

    const onSubmit = async (data: DealFormData) => {
        setIsSubmitting(true)

        try {
            const result = isEditing
                ? await updateDeal(deal.id, data)
                : await createDeal(data)

            if (result.error) {
                toast.error(isEditing ? "Erro ao atualizar oportunidade" : "Erro ao criar oportunidade", result.error)
            } else {
                toast.success(
                    isEditing ? "Oportunidade atualizada!" : "Oportunidade criada!"
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
            <DialogContent className="sm:max-w-[550px]">
                <DialogHeader>
                    <DialogTitle>{isEditing ? "Editar Oportunidade" : "Nova Oportunidade"}</DialogTitle>
                    <DialogDescription>
                        {isEditing
                            ? "Atualize os detalhes da negociação."
                            : "Adicione uma nova oportunidade ao pipeline."}
                    </DialogDescription>
                </DialogHeader>

                <Form onSubmit={handleSubmit(onSubmit)}>
                    <div className="grid gap-4 py-4">
                        {/* Título */}
                        <FormField>
                            <FormLabel>Título *</FormLabel>
                            <Input
                                {...register("titulo")}
                                placeholder="Ex: Contrato Anual - Empresa X"
                                disabled={isSubmitting}
                            />
                            {errors.titulo && <FormMessage>{errors.titulo.message}</FormMessage>}
                        </FormField>

                        {/* Empresa */}
                        <FormField>
                            <FormLabel>Empresa *</FormLabel>
                            <Select
                                value={watch("empresa_id")}
                                onValueChange={(value) => setValue("empresa_id", value)}
                                disabled={isSubmitting}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Selecione a empresa" />
                                </SelectTrigger>
                                <SelectContent>
                                    {empresas.map((empresa) => (
                                        <SelectItem key={empresa.id} value={empresa.id}>
                                            {empresa.nome}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.empresa_id && <FormMessage>{errors.empresa_id.message}</FormMessage>}
                        </FormField>

                        <div className="grid grid-cols-2 gap-4">
                            {/* Valor */}
                            <FormField>
                                <FormLabel>Valor (R$)</FormLabel>
                                <Input
                                    type="number"
                                    {...register("valor")}
                                    placeholder="0,00"
                                    disabled={isSubmitting}
                                />
                                {errors.valor && <FormMessage>{errors.valor.message}</FormMessage>}
                            </FormField>

                            {/* Probabilidade */}
                            <FormField>
                                <FormLabel>Probabilidade (%)</FormLabel>
                                <Input
                                    type="number"
                                    {...register("probabilidade")}
                                    placeholder="0-100"
                                    min={0}
                                    max={100}
                                    disabled={isSubmitting}
                                />
                                {errors.probabilidade && <FormMessage>{errors.probabilidade.message}</FormMessage>}
                            </FormField>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            {/* Estágio */}
                            <FormField>
                                <FormLabel>Estágio</FormLabel>
                                <Select
                                    value={watch("estagio")}
                                    onValueChange={(value) => setValue("estagio", value as any)}
                                    disabled={isSubmitting}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Selecione o estágio" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="prospeccao">Prospecção</SelectItem>
                                        <SelectItem value="qualificacao">Qualificação</SelectItem>
                                        <SelectItem value="proposta">Proposta</SelectItem>
                                        <SelectItem value="negociacao">Negociação</SelectItem>
                                        <SelectItem value="fechado_ganho">Fechado (Ganho)</SelectItem>
                                        <SelectItem value="fechado_perdido">Fechado (Perdido)</SelectItem>
                                    </SelectContent>
                                </Select>
                                {errors.estagio && <FormMessage>{errors.estagio.message}</FormMessage>}
                            </FormField>

                            {/* Data Fechamento */}
                            <FormField>
                                <FormLabel>Previsão de Fechamento</FormLabel>
                                <Input
                                    type="date"
                                    {...register("data_fechamento_prevista")}
                                    disabled={isSubmitting}
                                />
                            </FormField>
                        </div>
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
