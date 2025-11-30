"use client"

import { useState } from "react"
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { deleteLead } from "@/app/actions/leads"
import { toast } from "@/lib/toast"
import { LeadFormDialog } from "./lead-form-dialog"

interface LeadTableActionsProps {
    lead: {
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

export function LeadTableActions({ lead }: LeadTableActionsProps) {
    const [showEditDialog, setShowEditDialog] = useState(false)
    const [showDeleteDialog, setShowDeleteDialog] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)

    const handleDelete = async () => {
        setIsDeleting(true)

        try {
            const result = await deleteLead(lead.id)

            if (result.error) {
                toast.error("Erro ao excluir lead", result.error)
            } else {
                toast.success("Lead excluído com sucesso!")
                setShowDeleteDialog(false)
            }
        } catch (error) {
            toast.error("Erro inesperado", "Tente novamente mais tarde.")
        } finally {
            setIsDeleting(false)
        }
    }

    return (
        <>
            <div className="flex items-center gap-2 justify-end">
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowEditDialog(true)}
                >
                    <Pencil className="h-4 w-4 mr-2" />
                    Editar
                </Button>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowDeleteDialog(true)}
                    className="text-red-500 hover:text-red-600 hover:bg-red-500/10"
                >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Excluir
                </Button>
            </div>

            {/* Edit Dialog */}
            <LeadFormDialog
                open={showEditDialog}
                onOpenChange={setShowEditDialog}
                lead={lead}
            />

            {/* Delete Confirmation Dialog */}
            <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Confirmar exclusão</DialogTitle>
                        <DialogDescription>
                            Tem certeza que deseja excluir o lead <strong>{lead.nome}</strong>?
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
