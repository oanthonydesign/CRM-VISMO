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
import { createGoal, updateGoal } from "@/app/actions/goals"
import { goalSchema, type GoalFormData } from "@/lib/schemas/goals"
import { toast } from "@/lib/toast"

interface GoalFormDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    goal?: {
        id: string
        titulo: string
        meta_valor: number
        atual_valor?: number | null
        periodo: string
        tipo: string
        owner_id?: string | null
        data_inicio?: string | null
        data_fim?: string | null
    }
}

export function GoalFormDialog({ open, onOpenChange, goal }: GoalFormDialogProps) {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const isEditing = !!goal

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        setValue,
        watch,
    } = useForm<GoalFormData>({
        resolver: zodResolver(goalSchema),
        defaultValues: goal
            ? {
                titulo: goal.titulo,
                meta_valor: goal.meta_valor,
                atual_valor: goal.atual_valor || 0,
                periodo: goal.periodo as any,
                tipo: goal.tipo as any,
                owner_id: goal.owner_id || "",
                data_inicio: goal.data_inicio || "",
                data_fim: goal.data_fim || "",
            }
            : {
                titulo: "",
                meta_valor: 0,
                atual_valor: 0,
                periodo: "mensal",
                tipo: "receita",
                owner_id: "",
                data_inicio: "",
                data_fim: "",
            },
    })

    const onSubmit = async (data: GoalFormData) => {
        setIsSubmitting(true)

        try {
            const result = isEditing
                ? await updateGoal(goal.id, data)
                : await createGoal(data)

            if (result.error) {
                toast.error(isEditing ? "Erro ao atualizar meta" : "Erro ao criar meta", result.error)
            } else {
                toast.success(
                    isEditing ? "Meta atualizada!" : "Meta criada!"
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
                    <DialogTitle>{isEditing ? "Editar Meta" : "Nova Meta"}</DialogTitle>
                    <DialogDescription>
                        {isEditing
                            ? "Atualize os detalhes da meta."
                            : "Defina uma nova meta para acompanhar o desempenho."}
                    </DialogDescription>
                </DialogHeader>

                <Form onSubmit={handleSubmit(onSubmit)}>
                    <div className="grid gap-4 py-4">
                        {/* Título */}
                        <FormField>
                            <FormLabel>Título da Meta *</FormLabel>
                            <Input
                                {...register("titulo")}
                                placeholder="Ex: Receita Mensal Q1"
                                disabled={isSubmitting}
                            />
                            {errors.titulo && <FormMessage>{errors.titulo.message}</FormMessage>}
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
                                        <SelectItem value="receita">Receita</SelectItem>
                                        <SelectItem value="vendas">Vendas</SelectItem>
                                        <SelectItem value="projetos">Projetos</SelectItem>
                                        <SelectItem value="clientes">Clientes</SelectItem>
                                        <SelectItem value="leads">Leads</SelectItem>
                                        <SelectItem value="customizado">Customizado</SelectItem>
                                    </SelectContent>
                                </Select>
                                {errors.tipo && <FormMessage>{errors.tipo.message}</FormMessage>}
                            </FormField>

                            {/* Período */}
                            <FormField>
                                <FormLabel>Período *</FormLabel>
                                <Select
                                    value={watch("periodo")}
                                    onValueChange={(value) => setValue("periodo", value as any)}
                                    disabled={isSubmitting}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Selecione o período" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="mensal">Mensal</SelectItem>
                                        <SelectItem value="trimestral">Trimestral</SelectItem>
                                        <SelectItem value="anual">Anual</SelectItem>
                                        <SelectItem value="customizado">Customizado</SelectItem>
                                    </SelectContent>
                                </Select>
                                {errors.periodo && <FormMessage>{errors.periodo.message}</FormMessage>}
                            </FormField>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            {/* Meta Valor */}
                            <FormField>
                                <FormLabel>Valor da Meta *</FormLabel>
                                <Input
                                    type="number"
                                    step="0.01"
                                    {...register("meta_valor", { valueAsNumber: true })}
                                    placeholder="100000"
                                    disabled={isSubmitting}
                                />
                                {errors.meta_valor && <FormMessage>{errors.meta_valor.message}</FormMessage>}
                            </FormField>

                            {/* Valor Atual */}
                            <FormField>
                                <FormLabel>Valor Atual</FormLabel>
                                <Input
                                    type="number"
                                    step="0.01"
                                    {...register("atual_valor", { valueAsNumber: true })}
                                    placeholder="0"
                                    disabled={isSubmitting}
                                />
                            </FormField>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            {/* Data Início */}
                            <FormField>
                                <FormLabel>Data Início</FormLabel>
                                <Input
                                    type="date"
                                    {...register("data_inicio")}
                                    disabled={isSubmitting}
                                />
                            </FormField>

                            {/* Data Fim */}
                            <FormField>
                                <FormLabel>Data Fim</FormLabel>
                                <Input
                                    type="date"
                                    {...register("data_fim")}
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
