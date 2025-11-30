"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Plus, Upload } from "lucide-react"
import { LeadFormDialog } from "./lead-form-dialog"

export function LeadPageHeader() {
    const [showCreateDialog, setShowCreateDialog] = useState(false)

    return (
        <>
            <div className="flex items-center justify-between">
                <div className="space-y-2">
                    <h1 className="text-display-xl font-sans text-text-primary">Banco de Leads</h1>
                    <p className="text-text-secondary font-mono">Repositório geral de contatos</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" disabled>
                        <Upload className="mr-2 h-4 w-4" /> Importar
                    </Button>
                    <Button onClick={() => setShowCreateDialog(true)}>
                        <Plus className="mr-2 h-4 w-4" /> Novo Lead
                    </Button>
                </div>
            </div>

            <LeadFormDialog open={showCreateDialog} onOpenChange={setShowCreateDialog} />
        </>
    )
}
