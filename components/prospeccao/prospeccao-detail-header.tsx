"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, Pencil, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { deleteProspeccao } from "@/app/actions/prospeccoes"
import { toast } from "@/lib/toast"
import { ProspeccaoFormDialog } from "@/components/prospeccao/prospeccao-form-dialog"
import { STAGE_META, TIPO_LABELS, CANAL_LABELS } from "@/lib/prospeccao-constants"
import type { ProspeccaoRecord } from "@/lib/schemas/prospeccoes"

interface ProspeccaoDetailHeaderProps {
    prospeccao: ProspeccaoRecord
}

export function ProspeccaoDetailHeader({ prospeccao }: ProspeccaoDetailHeaderProps) {
    const router = useRouter()
    const [showEditDialog, setShowEditDialog] = useState(false)
    const [showDeleteDialog, setShowDeleteDialog] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)

    const handleDelete = async () => {
        setIsDeleting(true)
        try {
            const result = await deleteProspeccao(prospeccao.id)
            if (result.error) {
                toast.error("Erro ao excluir", result.error)
            } else {
                toast.success("Prospect excluído.")
                router.push("/prospeccao/pipeline")
            }
        } catch {
            toast.error("Erro inesperado", "Tente novamente mais tarde.")
        } finally {
            setIsDeleting(false)
        }
    }

    return (
        <div className="space-y-4">
            <Link href="/prospeccao/pipeline" className="inline-flex items-center gap-1 text-sm text-text-secondary hover:text-text-primary">
                <ArrowLeft className="h-4 w-4" /> Voltar ao pipeline
            </Link>

            <div className="flex items-start justify-between gap-4">
                <div className="space-y-2">
                    <h1 className="text-heading-lg font-sans text-text-primary">{prospeccao.nome}</h1>
                    {prospeccao.empresa && <p className="text-text-secondary">{prospeccao.empresa}</p>}
                    <div className="flex flex-wrap gap-2">
                        <Badge variant="outline" className={STAGE_META[prospeccao.status ?? "novo"]?.color}>
                            {STAGE_META[prospeccao.status ?? "novo"]?.label || prospeccao.status}
                        </Badge>
                        <Badge variant="secondary">{TIPO_LABELS[prospeccao.tipo ?? ""] || prospeccao.tipo}</Badge>
                        <Badge variant="secondary">{CANAL_LABELS[prospeccao.canal ?? ""] || prospeccao.canal}</Badge>
                    </div>
                </div>

                <div className="flex gap-2 shrink-0">
                    <Button variant="outline" onClick={() => setShowEditDialog(true)}>
                        <Pencil className="mr-2 h-4 w-4" /> Editar
                    </Button>
                    <Button
                        variant="outline"
                        className="text-red-500 hover:text-red-600 hover:bg-red-500/10"
                        onClick={() => setShowDeleteDialog(true)}
                    >
                        <Trash2 className="mr-2 h-4 w-4" /> Excluir
                    </Button>
                </div>
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
        </div>
    )
}
