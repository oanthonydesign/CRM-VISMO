"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { GoalFormDialog } from "./goal-form-dialog"

export function GoalsPageHeader() {
    const [showCreateDialog, setShowCreateDialog] = useState(false)

    return (
        <>
            <div className="flex items-center justify-between">
                <div className="space-y-2">
                    <h1 className="text-display-xl font-sans text-text-primary">Metas</h1>
                    <p className="text-text-secondary font-mono">Acompanhamento de objetivos e performance</p>
                </div>
                <Button onClick={() => setShowCreateDialog(true)}>
                    <Plus className="mr-2 h-4 w-4" /> Nova Meta
                </Button>
            </div>

            <GoalFormDialog open={showCreateDialog} onOpenChange={setShowCreateDialog} />
        </>
    )
}
