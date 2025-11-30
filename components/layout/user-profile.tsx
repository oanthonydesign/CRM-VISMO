'use client'

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"
import { signOut } from "@/app/actions/auth"

interface UserProfileProps {
    user: {
        email?: string
        full_name?: string
        avatar_url?: string
        role?: string
    } | null
}

export function UserProfile({ user }: UserProfileProps) {
    if (!user) return null

    const initials = user.full_name
        ? user.full_name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
        : user.email?.slice(0, 2).toUpperCase() || 'U'

    return (
        <div className="rounded-md border border-utility-border-subtle bg-background-card p-4">
            <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 overflow-hidden">
                    <Avatar className="h-8 w-8 border border-utility-border-subtle">
                        <AvatarImage src={user.avatar_url} />
                        <AvatarFallback className="bg-brand-primary/10 text-brand-primary text-xs font-bold">
                            {initials}
                        </AvatarFallback>
                    </Avatar>
                    <div className="truncate">
                        <p className="text-sm font-medium text-text-primary truncate">
                            {user.full_name || user.email}
                        </p>
                        <p className="text-xs text-text-secondary capitalize">
                            {user.role || 'Member'}
                        </p>
                    </div>
                </div>
                <form action={signOut}>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-text-secondary hover:text-red-500">
                        <LogOut className="h-4 w-4" />
                    </Button>
                </form>
            </div>
        </div>
    )
}
