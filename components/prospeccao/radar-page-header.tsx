"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { ProspeccaoFormDialog } from "@/components/prospeccao/prospeccao-form-dialog"

export function RadarPageHeader() {
    const [open, setOpen] = useState(false)

    return (
        <>
            <div className="flex items-center justify-between">
                <div className="space-y-1">
                    <h2 className="text-heading-lg font-sans text-text-primary">Radar</h2>
                    <p className="text-text-secondary font-mono text-sm">
                        Encontrados e ainda não abordados
                    </p>
                </div>
                <Button onClick={() => setOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" /> Novo prospect
                </Button>
            </div>
            <ProspeccaoFormDialog open={open} onOpenChange={setOpen} />
        </>
    )
}
