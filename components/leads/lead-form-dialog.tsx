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
import { createLead, updateLead, leadSchema, type LeadFormData } from "@/app/actions/leads"
import { toast } from "@/lib/toast"

interface LeadFormDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    lead?: {
        id: string
        nome: string
        empresa?: string | null
        email?: string | null
        telefone?: string | null
        status: string
        origem?: string | null
        observacoes?: string | null
    }
}

export function LeadFormDialog({ open, onOpenChange, lead }: LeadFormDialogProps) {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const isEditing = !!lead

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        setValue,
        watch,
    } = useForm<LeadFormData>({
        resolver: zodResolver(leadSchema),
        defaultValues: lead
            ? {
                nome: lead.nome,
                empresa: lead.empresa || "",
                email: lead.email || "",
                telefone: lead.telefone || "",
                status: lead.status as "novo" | "qualificando" | "arquivado",
                origem: (lead.origem as any) || undefined,
                observacoes: lead.observacoes || "",
            }
            : {
                nome: "",
                empresa: "",
                email: "",
                telefone: "",
                status: "novo",
                origem: undefined,
                observacoes: "",
            },
    })

    const onSubmit = async (data: LeadFormData) => {
        setIsSubmitting(true)

        try {
            const result = isEditing
                ? await updateLead(lead.id, data)
                : await createLead(data)

            if (result.error) {
                toast.error(isEditing ? "Erro ao atualizar lead" : "Erro ao criar lead", result.error)
            } else {
                toast.success(
                    isEditing ? "Lead atualizado com sucesso!" : "Lead criado com sucesso!"
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
                    <DialogTitle>{isEditing ? "Editar Lead" : "Novo Lead"}</DialogTitle>
                    <DialogDescription>
                        {isEditing
                            ? "Atualize as informações do lead."
                            : "Adicione um novo lead ao banco de dados."}
                    </DialogDescription>
                </DialogHeader>

                <Form onSubmit={handleSubmit(onSubmit)}>
                    <div className="grid gap-4 py-4">
                        {/* Nome */}
                        <FormField>
                            <FormLabel>Nome *</FormLabel>
                            <Input
                                {...register("nome")}
                                placeholder="Nome completo"
                                disabled={isSubmitting}
                            />
                            {errors.nome && <FormMessage>{errors.nome.message}</FormMessage>}
                        </FormField>

                        {/* Empresa */}
                        <FormField>
                            <FormLabel>Empresa</FormLabel>
                            <Input
                                {...register("empresa")}
                                placeholder="Nome da empresa"
                                disabled={isSubmitting}
                            />
                            {errors.empresa && <FormMessage>{errors.empresa.message}</FormMessage>}
                        </FormField>

                        <div className="grid grid-cols-2 gap-4">
                            {/* Email */}
                            <FormField>
                                <FormLabel>Email</FormLabel>
                                <Input
                                    {...register("email")}
                                    type="email"
                                    placeholder="email@exemplo.com"
                                    disabled={isSubmitting}
                                />
                                {errors.email && <FormMessage>{errors.email.message}</FormMessage>}
                            </FormField>

                            {/* Telefone */}
                            <FormField>
                                <FormLabel>Telefone</FormLabel>
                                <Input
                                    {...register("telefone")}
                                    placeholder="(00) 00000-0000"
                                    disabled={isSubmitting}
                                />
                                {errors.telefone && <FormMessage>{errors.telefone.message}</FormMessage>}
                            </FormField>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            {/* Status */}
                            <FormField>
                                <FormLabel>Status *</FormLabel>
                                <Select
                                    value={watch("status")}
                                    onValueChange={(value) => setValue("status", value as any)}
                                    disabled={isSubmitting}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Selecione o status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="novo">Novo</SelectItem>
                                        <SelectItem value="qualificando">Qualificando</SelectItem>
                                        <SelectItem value="arquivado">Arquivado</SelectItem>
                                    </SelectContent>
                                </Select>
                                {errors.status && <FormMessage>{errors.status.message}</FormMessage>}
                            </FormField>

                            {/* Origem */}
                            <FormField>
                                <FormLabel>Origem</FormLabel>
                                <Select
                                    value={watch("origem")}
                                    onValueChange={(value) => setValue("origem", value as any)}
                                    disabled={isSubmitting}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Selecione a origem" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="linkedin">LinkedIn</SelectItem>
                                        <SelectItem value="site">Site</SelectItem>
                                        <SelectItem value="indicacao">Indicação</SelectItem>
                                        <SelectItem value="instagram">Instagram</SelectItem>
                                        <SelectItem value="outro">Outro</SelectItem>
                                    </SelectContent>
                                </Select>
                                {errors.origem && <FormMessage>{errors.origem.message}</FormMessage>}
                            </FormField>
                        </div>

                        {/* Observações */}
                        <FormField>
                            <FormLabel>Observações</FormLabel>
                            <textarea
                                {...register("observacoes")}
                                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                placeholder="Notas adicionais sobre o lead..."
                                disabled={isSubmitting}
                            />
                            {errors.observacoes && <FormMessage>{errors.observacoes.message}</FormMessage>}
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
                            {isEditing ? "Salvar Alterações" : "Criar Lead"}
                        </Button>
                    </DialogFooter>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
