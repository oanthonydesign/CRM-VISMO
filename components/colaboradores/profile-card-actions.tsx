"use client"

import { useState } from "react"
import { MoreHorizontal, Pencil } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ProfileFormDialog } from "./profile-form-dialog"

interface ProfileCardActionsProps {
    profile: {
        id: string
        full_name: string | null
        email: string
        role: string | null
        department: string | null
    }
}

export function ProfileCardActions({ profile }: ProfileCardActionsProps) {
    const [showEditDialog, setShowEditDialog] = useState(false)

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
                </DropdownMenuContent>
            </DropdownMenu>

            {/* Edit Dialog */}
            <ProfileFormDialog
                open={showEditDialog}
                onOpenChange={setShowEditDialog}
                profile={profile}
            />
        </>
    )
}
