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
import { createEmpresa, updateEmpresa } from "@/app/actions/empresas"
import { empresaSchema, type EmpresaFormData } from "@/lib/schemas/empresas"
import { toast } from "@/lib/toast"

interface EmpresaFormDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    empresa?: {
        id: string
        nome: string
        nome_fantasia?: string | null
        cnpj?: string | null
        tipo?: string | null
        status?: string | null
        setor?: string | null
        tamanho?: string | null
        endereco?: string | null
        cidade?: string | null
        estado?: string | null
        origem?: string | null
    }
}

export function EmpresaFormDialog({ open, onOpenChange, empresa }: EmpresaFormDialogProps) {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const isEditing = !!empresa

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        setValue,
        watch,
    } = useForm<EmpresaFormData>({
        resolver: zodResolver(empresaSchema),
        defaultValues: empresa
            ? {
                nome: empresa.nome,
                nome_fantasia: empresa.nome_fantasia || "",
                cnpj: empresa.cnpj || "",
                tipo: (empresa.tipo as any) || "prospect",
                status: (empresa.status as any) || "ativo",
                setor: empresa.setor || "",
                tamanho: (empresa.tamanho as any) || undefined,
                endereco: empresa.endereco || "",
                cidade: empresa.cidade || "",
                estado: empresa.estado || "",
                origem: empresa.origem || "",
            }
            : {
                nome: "",
                nome_fantasia: "",
                cnpj: "",
                tipo: "prospect",
                status: "ativo",
                setor: "",
                tamanho: undefined,
                endereco: "",
                cidade: "",
                estado: "",
                origem: "",
            },
    })

    const onSubmit = async (data: EmpresaFormData) => {
        setIsSubmitting(true)

        try {
            const result = isEditing
                ? await updateEmpresa(empresa.id, data)
                : await createEmpresa(data)

            if (result.error) {
                toast.error(isEditing ? "Erro ao atualizar empresa" : "Erro ao criar empresa", result.error)
            } else {
                toast.success(
                    isEditing ? "Empresa atualizada com sucesso!" : "Empresa criada com sucesso!"
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
                    <DialogTitle>{isEditing ? "Editar Empresa" : "Nova Empresa"}</DialogTitle>
                    <DialogDescription>
                        {isEditing
                            ? "Atualize as informações da empresa."
                            : "Cadastre uma nova empresa no sistema."}
                    </DialogDescription>
                </DialogHeader>

                <Form onSubmit={handleSubmit(onSubmit)}>
                    <div className="grid gap-4 py-4">
                        {/* Nome / Razão Social */}
                        <FormField>
                            <FormLabel>Razão Social *</FormLabel>
                            <Input
                                {...register("nome")}
                                placeholder="Razão Social completa"
                                disabled={isSubmitting}
                            />
                            {errors.nome && <FormMessage>{errors.nome.message}</FormMessage>}
                        </FormField>

                        <div className="grid grid-cols-2 gap-4">
                            {/* Nome Fantasia */}
                            <FormField>
                                <FormLabel>Nome Fantasia</FormLabel>
                                <Input
                                    {...register("nome_fantasia")}
                                    placeholder="Nome comercial"
                                    disabled={isSubmitting}
                                />
                            </FormField>

                            {/* CNPJ */}
                            <FormField>
                                <FormLabel>CNPJ</FormLabel>
                                <Input
                                    {...register("cnpj")}
                                    placeholder="00.000.000/0000-00"
                                    disabled={isSubmitting}
                                />
                            </FormField>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            {/* Tipo */}
                            <FormField>
                                <FormLabel>Tipo</FormLabel>
                                <Select
                                    value={watch("tipo")}
                                    onValueChange={(value) => setValue("tipo", value as any)}
                                    disabled={isSubmitting}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Selecione o tipo" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="prospect">Prospect</SelectItem>
                                        <SelectItem value="cliente">Cliente</SelectItem>
                                        <SelectItem value="parceiro">Parceiro</SelectItem>
                                        <SelectItem value="fornecedor">Fornecedor</SelectItem>
                                    </SelectContent>
                                </Select>
                            </FormField>

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
                                        <SelectItem value="ativo">Ativo</SelectItem>
                                        <SelectItem value="inativo">Inativo</SelectItem>
                                        <SelectItem value="churn">Churn</SelectItem>
                                    </SelectContent>
                                </Select>
                            </FormField>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            {/* Setor */}
                            <FormField>
                                <FormLabel>Setor</FormLabel>
                                <Input
                                    {...register("setor")}
                                    placeholder="Ex: Tecnologia, Varejo..."
                                    disabled={isSubmitting}
                                />
                            </FormField>

                            {/* Tamanho */}
                            <FormField>
                                <FormLabel>Tamanho</FormLabel>
                                <Select
                                    value={watch("tamanho")}
                                    onValueChange={(value) => setValue("tamanho", value as any)}
                                    disabled={isSubmitting}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Selecione o tamanho" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="pequena">Pequena</SelectItem>
                                        <SelectItem value="media">Média</SelectItem>
                                        <SelectItem value="grande">Grande</SelectItem>
                                        <SelectItem value="enterprise">Enterprise</SelectItem>
                                    </SelectContent>
                                </Select>
                            </FormField>
                        </div>

                        {/* Endereço */}
                        <FormField>
                            <FormLabel>Endereço</FormLabel>
                            <Input
                                {...register("endereco")}
                                placeholder="Rua, número, bairro..."
                                disabled={isSubmitting}
                            />
                        </FormField>

                        <div className="grid grid-cols-2 gap-4">
                            {/* Cidade */}
                            <FormField>
                                <FormLabel>Cidade</FormLabel>
                                <Input
                                    {...register("cidade")}
                                    placeholder="Cidade"
                                    disabled={isSubmitting}
                                />
                            </FormField>

                            {/* Estado */}
                            <FormField>
                                <FormLabel>Estado</FormLabel>
                                <Input
                                    {...register("estado")}
                                    placeholder="UF (ex: SP)"
                                    maxLength={2}
                                    disabled={isSubmitting}
                                />
                                {errors.estado && <FormMessage>{errors.estado.message}</FormMessage>}
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
                            {isEditing ? "Salvar Alterações" : "Criar Empresa"}
                        </Button>
                    </DialogFooter>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
