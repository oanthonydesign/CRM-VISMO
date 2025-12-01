"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { ProjectFormDialog } from "./project-form-dialog"

export function ProjectPageHeader() {
    const [showCreateDialog, setShowCreateDialog] = useState(false)

    return (
        <>
            <div className="flex items-center justify-between">
                <div className="space-y-2">
                    <h1 className="text-display-xl font-sans text-text-primary">Projetos</h1>
                    <p className="text-text-secondary font-mono">Gestão de entregas e serviços</p>
                </div>
                <Button onClick={() => setShowCreateDialog(true)}>
                    <Plus className="mr-2 h-4 w-4" /> Novo Projeto
                </Button>
            </div>

            <ProjectFormDialog open={showCreateDialog} onOpenChange={setShowCreateDialog} />
        </>
    )
}
