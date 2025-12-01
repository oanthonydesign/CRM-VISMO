"use client"

import { useState } from "react"
import { Pencil, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { deleteEmpresa } from "@/app/actions/empresas"
import { toast } from "@/lib/toast"
import { EmpresaFormDialog } from "./empresa-form-dialog"

interface EmpresaTableActionsProps {
    empresa: {
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

export function EmpresaTableActions({ empresa }: EmpresaTableActionsProps) {
    const [showEditDialog, setShowEditDialog] = useState(false)
    const [showDeleteDialog, setShowDeleteDialog] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)

    const handleDelete = async () => {
        setIsDeleting(true)

        try {
            const result = await deleteEmpresa(empresa.id)

            if (result.error) {
                toast.error("Erro ao excluir empresa", result.error)
            } else {
                toast.success("Empresa excluída com sucesso!")
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
            <EmpresaFormDialog
                open={showEditDialog}
                onOpenChange={setShowEditDialog}
                empresa={empresa}
            />

            {/* Delete Confirmation Dialog */}
            <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Confirmar exclusão</DialogTitle>
                        <DialogDescription>
                            Tem certeza que deseja excluir a empresa <strong>{empresa.nome}</strong>?
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
