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
import { Textarea } from "@/components/ui/textarea"
import { createTask, updateTask } from "@/app/actions/tasks"
import { taskSchema, type TaskFormData } from "@/lib/schemas/tasks"
import { toast } from "@/lib/toast"
import { createClient } from "@/lib/supabase/client"

interface TaskFormDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    task?: {
        id: string
        title: string
        project_id: string
        description?: string | null
        status: string
        priority: string
        assignee_id?: string | null
        due_date?: string | null
    }
    defaultProjectId?: string
}

export function TaskFormDialog({ open, onOpenChange, task, defaultProjectId }: TaskFormDialogProps) {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [projects, setProjects] = useState<Array<{ id: string; nome: string }>>([])
    const [collaborators, setCollaborators] = useState<Array<{ id: string; full_name: string }>>([])
    const isEditing = !!task

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        setValue,
        watch,
    } = useForm<TaskFormData>({
        resolver: zodResolver(taskSchema),
        defaultValues: task
            ? {
                title: task.title,
                project_id: task.project_id,
                description: task.description || "",
                status: task.status as any,
                priority: task.priority as any,
                assignee_id: task.assignee_id || "",
                due_date: task.due_date || "",
            }
            : {
                title: "",
                project_id: defaultProjectId || "",
                description: "",
                status: "todo",
                priority: "medium",
                assignee_id: "",
                due_date: "",
            },
    })

    useEffect(() => {
        async function fetchData() {
            const supabase = createClient()

            const [projectsData, collaboratorsData] = await Promise.all([
                supabase.from('projects').select('id, nome').order('nome', { ascending: true }),
                supabase.from('profiles').select('id, full_name').order('full_name', { ascending: true })
            ])

            if (projectsData.data) setProjects(projectsData.data)
            if (collaboratorsData.data) setCollaborators(collaboratorsData.data)
        }

        if (open) {
            fetchData()
        }
    }, [open])

    const onSubmit = async (data: TaskFormData) => {
        setIsSubmitting(true)

        try {
            const result = isEditing
                ? await updateTask(task.id, data)
                : await createTask(data)

            if (result.error) {
                toast.error(isEditing ? "Erro ao atualizar tarefa" : "Erro ao criar tarefa", result.error)
            } else {
                toast.success(
                    isEditing ? "Tarefa atualizada!" : "Tarefa criada!"
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
                    <DialogTitle>{isEditing ? "Editar Tarefa" : "Nova Tarefa"}</DialogTitle>
                    <DialogDescription>
                        {isEditing
                            ? "Atualize os detalhes da tarefa."
                            : "Crie uma nova tarefa para o projeto."}
                    </DialogDescription>
                </DialogHeader>

                <Form onSubmit={handleSubmit(onSubmit)}>
                    <div className="grid gap-4 py-4">
                        {/* Título */}
                        <FormField>
                            <FormLabel>Título *</FormLabel>
                            <Input
                                {...register("title")}
                                placeholder="Ex: Implementar autenticação"
                                disabled={isSubmitting}
                            />
                            {errors.title && <FormMessage>{errors.title.message}</FormMessage>}
                        </FormField>

                        {/* Projeto */}
                        <FormField>
                            <FormLabel>Projeto *</FormLabel>
                            <Select
                                value={watch("project_id")}
                                onValueChange={(value) => setValue("project_id", value)}
                                disabled={isSubmitting || isEditing}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Selecione o projeto" />
                                </SelectTrigger>
                                <SelectContent>
                                    {projects.map((project) => (
                                        <SelectItem key={project.id} value={project.id}>
                                            {project.nome}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.project_id && <FormMessage>{errors.project_id.message}</FormMessage>}
                        </FormField>

                        {/* Descrição */}
                        <FormField>
                            <FormLabel>Descrição</FormLabel>
                            <Textarea
                                {...register("description")}
                                placeholder="Detalhes da tarefa..."
                                disabled={isSubmitting}
                                rows={3}
                            />
                        </FormField>

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
                                        <SelectItem value="todo">A Fazer</SelectItem>
                                        <SelectItem value="in_progress">Em Progresso</SelectItem>
                                        <SelectItem value="review">Em Revisão</SelectItem>
                                        <SelectItem value="done">Concluído</SelectItem>
                                        <SelectItem value="blocked">Bloqueado</SelectItem>
                                    </SelectContent>
                                </Select>
                            </FormField>

                            {/* Prioridade */}
                            <FormField>
                                <FormLabel>Prioridade *</FormLabel>
                                <Select
                                    value={watch("priority")}
                                    onValueChange={(value) => setValue("priority", value as any)}
                                    disabled={isSubmitting}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Selecione a prioridade" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="low">Baixa</SelectItem>
                                        <SelectItem value="medium">Média</SelectItem>
                                        <SelectItem value="high">Alta</SelectItem>
                                        <SelectItem value="urgent">Urgente</SelectItem>
                                    </SelectContent>
                                </Select>
                            </FormField>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            {/* Responsável */}
                            <FormField>
                                <FormLabel>Responsável</FormLabel>
                                <Select
                                    value={watch("assignee_id") || ""}
                                    onValueChange={(value) => setValue("assignee_id", value)}
                                    disabled={isSubmitting}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Nenhum" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="">Nenhum</SelectItem>
                                        {collaborators.map((collaborator) => (
                                            <SelectItem key={collaborator.id} value={collaborator.id}>
                                                {collaborator.full_name || collaborator.id}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </FormField>

                            {/* Data de Vencimento */}
                            <FormField>
                                <FormLabel>Prazo</FormLabel>
                                <Input
                                    type="date"
                                    {...register("due_date")}
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
