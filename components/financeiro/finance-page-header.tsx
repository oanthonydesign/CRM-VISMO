"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { TransactionFormDialog } from "./transaction-form-dialog"

export function FinancePageHeader() {
    const [showCreateDialog, setShowCreateDialog] = useState(false)

    return (
        <>
            <div className="flex items-center justify-between">
                <div className="space-y-2">
                    <h1 className="text-display-xl font-sans text-text-primary">Financeiro</h1>
                    <p className="text-text-secondary font-mono">Controle de receitas e despesas</p>
                </div>
                <Button onClick={() => setShowCreateDialog(true)}>
                    <Plus className="mr-2 h-4 w-4" /> Nova Transação
                </Button>
            </div>

            <TransactionFormDialog open={showCreateDialog} onOpenChange={setShowCreateDialog} />
        </>
    )
}
