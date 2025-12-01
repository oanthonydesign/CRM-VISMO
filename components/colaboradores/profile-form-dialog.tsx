"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2 } from "lucide-react"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Form, FormField, FormLabel, FormMessage } from "@/components/ui/form"
import { updateProfile } from "@/app/actions/profiles"
import { profileSchema, type ProfileFormData } from "@/lib/schemas/profiles"
import { toast } from "@/lib/toast"

interface ProfileFormDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    profile: {
        id: string
        full_name: string | null
        email: string
        role: string | null
        department: string | null
    }
}

export function ProfileFormDialog({ open, onOpenChange, profile }: ProfileFormDialogProps) {
    const [isSubmitting, setIsSubmitting] = useState(false)

    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
        watch,
    } = useForm<ProfileFormData>({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            full_name: profile.full_name || "",
            email: profile.email,
            role: (profile.role as any) || "member",
            department: profile.department || "",
        },
    })

    const onSubmit = async (data: ProfileFormData) => {
        setIsSubmitting(true)

        try {
            const result = await updateProfile(profile.id, data)

            if (result.error) {
                toast.error("Erro ao atualizar perfil", result.error)
            } else {
                toast.success("Perfil atualizado!")
                onOpenChange(false)
            }
        } catch (error) {
            toast.error("Erro inesperado", "Tente novamente mais tarde.")
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Editar Colaborador</DialogTitle>
                    <DialogDescription>
                        Atualize as informações do colaborador. O email não pode ser alterado aqui.
                    </DialogDescription>
                </DialogHeader>

                <Form onSubmit={handleSubmit(onSubmit)}>
                    <div className="grid gap-4 py-4">
                        {/* Nome */}
                        <FormField>
                            <FormLabel>Nome Completo</FormLabel>
                            <Input
                                {...register("full_name")}
                                placeholder="Ex: João Silva"
                                disabled={isSubmitting}
                            />
                            {errors.full_name && <FormMessage>{errors.full_name.message}</FormMessage>}
                        </FormField>

                        {/* Email (Read-only) */}
                        <FormField>
                            <FormLabel>Email</FormLabel>
                            <Input
                                {...register("email")}
                                disabled={true}
                                className="bg-muted"
                            />
                        </FormField>

                        <div className="grid grid-cols-2 gap-4">
                            {/* Função/Role */}
                            <FormField>
                                <FormLabel>Função</FormLabel>
                                <Select
                                    value={watch("role")}
                                    onValueChange={(value) => setValue("role", value as any)}
                                    disabled={isSubmitting}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Selecione a função" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="admin">Admin</SelectItem>
                                        <SelectItem value="manager">Gerente</SelectItem>
                                        <SelectItem value="sales">Vendas</SelectItem>
                                        <SelectItem value="member">Membro</SelectItem>
                                    </SelectContent>
                                </Select>
                                {errors.role && <FormMessage>{errors.role.message}</FormMessage>}
                            </FormField>

                            {/* Departamento */}
                            <FormField>
                                <FormLabel>Departamento</FormLabel>
                                <Input
                                    {...register("department")}
                                    placeholder="Ex: Comercial"
                                    disabled={isSubmitting}
                                />
                                {errors.department && <FormMessage>{errors.department.message}</FormMessage>}
                            </FormField>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            disabled={isSubmitting}
                        >
                            Cancelar
                        </Button>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Salvar Alterações
                        </Button>
                    </DialogFooter>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
