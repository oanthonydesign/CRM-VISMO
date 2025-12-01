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
import { Slider } from "@/components/ui/slider"
import { createProject, updateProject } from "@/app/actions/projects"
import { projectSchema, type ProjectFormData } from "@/lib/schemas/projects"
import { toast } from "@/lib/toast"
import { createClient } from "@/lib/supabase/client"

interface ProjectFormDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    project?: {
        id: string
        nome: string
        empresa_id: string
        descricao?: string | null
        status: string
        health: string
        progress: number
        deadline?: string | null
        owner_id?: string | null
        valor_projeto?: number | null
    }
}

export function ProjectFormDialog({ open, onOpenChange, project }: ProjectFormDialogProps) {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [empresas, setEmpresas] = useState<{ id: string; nome: string }[]>([])
    const isEditing = !!project

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
    } = useForm<ProjectFormData>({
        resolver: zodResolver(projectSchema),
        defaultValues: project
            ? {
                nome: project.nome,
                empresa_id: project.empresa_id,
                descricao: project.descricao || "",
                status: (project.status as any) || "planejamento",
                health: (project.health as any) || "on_track",
                progress: project.progress || 0,
                deadline: project.deadline || "",
                owner_id: project.owner_id || "",
                valor_projeto: project.valor_projeto || 0,
            }
            : {
                nome: "",
                empresa_id: "",
                descricao: "",
                status: "planejamento",
                health: "on_track",
                progress: 0,
                deadline: "",
                owner_id: "",
                valor_projeto: 0,
            },
    })

    const progress = watch("progress")

    const onSubmit = async (data: ProjectFormData) => {
        setIsSubmitting(true)

        try {
            const result = isEditing
                ? await updateProject(project.id, data)
                : await createProject(data)

            if (result.error) {
                toast.error(isEditing ? "Erro ao atualizar projeto" : "Erro ao criar projeto", result.error)
            } else {
                toast.success(
                    isEditing ? "Projeto atualizado!" : "Projeto criado!"
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
                    <DialogTitle>{isEditing ? "Editar Projeto" : "Novo Projeto"}</DialogTitle>
                    <DialogDescription>
                        {isEditing
                            ? "Atualize os detalhes do projeto."
                            : "Inicie um novo projeto para um cliente."}
                    </DialogDescription>
                </DialogHeader>

                <Form onSubmit={handleSubmit(onSubmit)}>
                    <div className="grid gap-4 py-4">
                        {/* Nome */}
                        <FormField>
                            <FormLabel>Nome do Projeto *</FormLabel>
                            <Input
                                {...register("nome")}
                                placeholder="Ex: Implementação CRM"
                                disabled={isSubmitting}
                            />
                            {errors.nome && <FormMessage>{errors.nome.message}</FormMessage>}
                        </FormField>

                        {/* Empresa */}
                        <FormField>
                            <FormLabel>Cliente *</FormLabel>
                            <Select
                                value={watch("empresa_id")}
                                onValueChange={(value) => setValue("empresa_id", value)}
                                disabled={isSubmitting}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Selecione o cliente" />
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
                                        <SelectItem value="planejamento">Planejamento</SelectItem>
                                        <SelectItem value="em_andamento">Em Andamento</SelectItem>
                                        <SelectItem value="em_revisao">Em Revisão</SelectItem>
                                        <SelectItem value="concluido">Concluído</SelectItem>
                                        <SelectItem value="cancelado">Cancelado</SelectItem>
                                    </SelectContent>
                                </Select>
                            </FormField>

                            {/* Saúde */}
                            <FormField>
                                <FormLabel>Saúde do Projeto</FormLabel>
                                <Select
                                    value={watch("health")}
                                    onValueChange={(value) => setValue("health", value as any)}
                                    disabled={isSubmitting}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Selecione a saúde" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="on_track">No Prazo (Verde)</SelectItem>
                                        <SelectItem value="at_risk">Em Risco (Amarelo)</SelectItem>
                                        <SelectItem value="off_track">Atrasado (Vermelho)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </FormField>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            {/* Deadline */}
                            <FormField>
                                <FormLabel>Prazo de Entrega</FormLabel>
                                <Input
                                    type="date"
                                    {...register("deadline")}
                                    disabled={isSubmitting}
                                />
                            </FormField>

                            {/* Valor */}
                            <FormField>
                                <FormLabel>Valor do Projeto (R$)</FormLabel>
                                <Input
                                    type="number"
                                    {...register("valor_projeto", { valueAsNumber: true })}
                                    placeholder="0,00"
                                    disabled={isSubmitting}
                                />
                            </FormField>
                        </div>

                        {/* Progresso */}
                        <FormField>
                            <FormLabel>Progresso: {progress}%</FormLabel>
                            <div className="pt-2">
                                <Slider
                                    defaultValue={[progress]}
                                    max={100}
                                    step={5}
                                    onValueChange={(vals) => setValue("progress", vals[0])}
                                    disabled={isSubmitting}
                                />
                            </div>
                        </FormField>

                        {/* Descrição */}
                        <FormField>
                            <FormLabel>Descrição</FormLabel>
                            <textarea
                                {...register("descricao")}
                                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                placeholder="Detalhes do escopo..."
                                disabled={isSubmitting}
                            />
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
