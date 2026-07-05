"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { EstrategiaFormDialog } from "@/components/prospeccao/estrategia-form-dialog"

export function EstrategiaPageHeader() {
    const [open, setOpen] = useState(false)

    return (
        <>
            <div className="flex items-center justify-between">
                <div className="space-y-1">
                    <h2 className="text-heading-lg font-sans text-text-primary">Estratégias</h2>
                    <p className="text-text-secondary font-mono text-sm">
                        Playbook de abordagens e ofertas por segmento
                    </p>
                </div>
                <Button onClick={() => setOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" /> Nova estratégia
                </Button>
            </div>
            <EstrategiaFormDialog open={open} onOpenChange={setOpen} />
        </>
    )
}
