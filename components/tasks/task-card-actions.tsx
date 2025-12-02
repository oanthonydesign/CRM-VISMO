"use client"

import { useState } from "react"
import { MoreHorizontal, Pencil, Trash2, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
} from "@/components/ui/dropdown-menu"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { deleteTask, updateTaskStatus } from "@/app/actions/tasks"
import { toast } from "@/lib/toast"
import { TaskFormDialog } from "./task-form-dialog"

interface TaskCardActionsProps {
    task: {
        id: string
        title: string
        project_id: string
        description?: string | null
        status: string
        priority: string
        assignee_id?: string | null
        due_date?: string | null
    }
}

export function TaskCardActions({ task }: TaskCardActionsProps) {
    const [showEditDialog, setShowEditDialog] = useState(false)
    const [showDeleteDialog, setShowDeleteDialog] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)

    const handleDelete = async () => {
        setIsDeleting(true)

        try {
            const result = await deleteTask(task.id)

            if (result.error) {
                toast.error("Erro ao excluir tarefa", result.error)
            } else {
                toast.success("Tarefa excluída!")
                setShowDeleteDialog(false)
            }
        } catch (error) {
            toast.error("Erro inesperado", "Tente novamente mais tarde.")
        } finally {
            setIsDeleting(false)
        }
    }

    const handleStatusChange = async (newStatus: string) => {
        try {
            const result = await updateTaskStatus(task.id, newStatus)

            if (result.error) {
                toast.error("Erro ao atualizar status", result.error)
            } else {
                toast.success("Status atualizado!")
            }
        } catch (error) {
            toast.error("Erro inesperado", "Tente novamente mais tarde.")
        }
    }

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Abrir menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Ações</DropdownMenuLabel>
                    <DropdownMenuItem onClick={() => setShowEditDialog(true)}>
                        <Pencil className="mr-2 h-4 w-4" /> Editar
                    </DropdownMenuItem>
                    <DropdownMenuSub>
                        <DropdownMenuSubTrigger>
                            <Clock className="mr-2 h-4 w-4" /> Alterar Status
                        </DropdownMenuSubTrigger>
                        <DropdownMenuSubContent>
                            <DropdownMenuItem onClick={() => handleStatusChange('todo')}>
                                A Fazer
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleStatusChange('in_progress')}>
                                Em Progresso
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleStatusChange('review')}>
                                Em Revisão
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleStatusChange('done')}>
                                Concluído
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleStatusChange('blocked')}>
                                Bloqueado
                            </DropdownMenuItem>
                        </DropdownMenuSubContent>
                    </DropdownMenuSub>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                        onClick={() => setShowDeleteDialog(true)}
                        className="text-red-600 focus:text-red-600 focus:bg-red-50"
                    >
                        <Trash2 className="mr-2 h-4 w-4" /> Excluir
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            {/* Edit Dialog */}
            <TaskFormDialog
                open={showEditDialog}
                onOpenChange={setShowEditDialog}
                task={task}
            />

            {/* Delete Confirmation Dialog */}
            <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Confirmar exclusão</DialogTitle>
                        <DialogDescription>
                            Tem certeza que deseja excluir a tarefa <strong>{task.title}</strong>?
                            Esta ação não pode ser desfeita.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setShowDeleteDialog(false)}
                            disabled={isDeleting}
                        >
                            Cancelar
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleDelete}
                            disabled={isDeleting}
                        >
                            {isDeleting ? "Excluindo..." : "Excluir"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    )
}
