"use client"

import { useState } from "react"
import { MoreHorizontal, Pencil, Trash2, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { deleteContact, setPrimaryContact } from "@/app/actions/contacts"
import { toast } from "@/lib/toast"
import { ContactFormDialog } from "./contact-form-dialog"

interface ContactTableActionsProps {
    contact: {
        id: string
        nome: string
        empresa_id: string
        cargo?: string | null
        email?: string | null
        telefone?: string | null
        linkedin?: string | null
        is_primary?: boolean | null
    }
}

export function ContactTableActions({ contact }: ContactTableActionsProps) {
    const [showEditDialog, setShowEditDialog] = useState(false)
    const [showDeleteDialog, setShowDeleteDialog] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)

    const handleDelete = async () => {
        setIsDeleting(true)

        try {
            const result = await deleteContact(contact.id)

            if (result.error) {
                toast.error("Erro ao excluir contato", result.error)
            } else {
                toast.success("Contato excluído!")
                setShowDeleteDialog(false)
            }
        } catch (error) {
            toast.error("Erro inesperado", "Tente novamente mais tarde.")
        } finally {
            setIsDeleting(false)
        }
    }

    const handleSetPrimary = async () => {
        try {
            const result = await setPrimaryContact(contact.id, contact.empresa_id)

            if (result.error) {
                toast.error("Erro ao definir contato principal", result.error)
            } else {
                toast.success("Contato principal atualizado!")
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
                    {!contact.is_primary && (
                        <DropdownMenuItem onClick={handleSetPrimary}>
                            <Star className="mr-2 h-4 w-4" /> Definir como principal
                        </DropdownMenuItem>
                    )}
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
            <ContactFormDialog
                open={showEditDialog}
                onOpenChange={setShowEditDialog}
                contact={contact}
            />

            {/* Delete Confirmation Dialog */}
            <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Confirmar exclusão</DialogTitle>
                        <DialogDescription>
                            Tem certeza que deseja excluir o contato <strong>{contact.nome}</strong>?
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
