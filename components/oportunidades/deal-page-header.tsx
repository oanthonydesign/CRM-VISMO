"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { DealFormDialog } from "./deal-form-dialog"

export function DealPageHeader() {
    const [showCreateDialog, setShowCreateDialog] = useState(false)

    return (
        <>
            <div className="flex items-center justify-between">
                <div className="space-y-2">
                    <h1 className="text-display-xl font-sans text-text-primary">Oportunidades</h1>
                    <p className="text-text-secondary font-mono">Gestão do funil de vendas</p>
                </div>
                <Button onClick={() => setShowCreateDialog(true)}>
                    <Plus className="mr-2 h-4 w-4" /> Nova Oportunidade
                </Button>
            </div>

            <DealFormDialog open={showCreateDialog} onOpenChange={setShowCreateDialog} />
        </>
    )
}
