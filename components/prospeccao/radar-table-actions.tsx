"use client"

import { useState, useTransition } from "react"
import Link from "next/link"
import { MoreHorizontal, Pencil, Trash2, Send, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
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
import { deleteProspeccao, moveProspeccaoStage } from "@/app/actions/prospeccoes"
import { toast } from "@/lib/toast"
import { ProspeccaoFormDialog } from "@/components/prospeccao/prospeccao-form-dialog"
import type { ProspeccaoRecord } from "@/lib/schemas/prospeccoes"

interface RadarTableActionsProps {
    prospeccao: ProspeccaoRecord
}

export function RadarTableActions({ prospeccao }: RadarTableActionsProps) {
    const [showEditDialog, setShowEditDialog] = useState(false)
    const [showDeleteDialog, setShowDeleteDialog] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)
    const [isAbordando, startTransition] = useTransition()

    const handleAbordar = () => {
        startTransition(async () => {
            const result = await moveProspeccaoStage(prospeccao.id, "abordado")
            if (result.error) {
                toast.error("Erro ao abordar", result.error)
            } else {
                toast.success("Movido para o Pipeline!", "Registre a mensagem enviada no detalhe do prospect.")
            }
        })
    }

    const handleDelete = async () => {
        setIsDeleting(true)
        try {
            const result = await deleteProspeccao(prospeccao.id)
            if (result.error) {
                toast.error("Erro ao excluir", result.error)
            } else {
                toast.success("Prospect excluído.")
                setShowDeleteDialog(false)
            }
        } catch {
            toast.error("Erro inesperado", "Tente novamente mais tarde.")
        } finally {
            setIsDeleting(false)
        }
    }

    return (
        <>
            <div className="flex items-center justify-end gap-2">
                <Button size="sm" onClick={handleAbordar} disabled={isAbordando}>
                    <Send className="mr-2 h-3.5 w-3.5" /> Abordar
                </Button>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Abrir menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                            <Link href={`/prospeccao/${prospeccao.id}`}>
                                <Eye className="mr-2 h-4 w-4" /> Ver detalhe
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setShowEditDialog(true)}>
                            <Pencil className="mr-2 h-4 w-4" /> Editar
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            onClick={() => setShowDeleteDialog(true)}
                            className="text-red-500 focus:text-red-500"
                        >
                            <Trash2 className="mr-2 h-4 w-4" /> Excluir
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            <ProspeccaoFormDialog open={showEditDialog} onOpenChange={setShowEditDialog} prospeccao={prospeccao} />

            <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Confirmar exclusão</DialogTitle>
                        <DialogDescription>
                            Tem certeza que deseja excluir <strong>{prospeccao.nome}</strong>? Esta ação não pode ser desfeita.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowDeleteDialog(false)} disabled={isDeleting}>
                            Cancelar
                        </Button>
                        <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
                            {isDeleting ? "Excluindo..." : "Excluir"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    )
}
