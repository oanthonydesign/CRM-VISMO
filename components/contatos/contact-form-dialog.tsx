"use client"

import { useState, useEffect } from "react"
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
import { Checkbox } from "@/components/ui/checkbox"
import { createContact, updateContact } from "@/app/actions/contacts"
import { contactSchema, type ContactFormData } from "@/lib/schemas/contacts"
import { toast } from "@/lib/toast"
import { createClient } from "@/lib/supabase/client"

interface ContactFormDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    contact?: {
        id: string
        nome: string
        empresa_id: string
        cargo?: string | null
        email?: string | null
        telefone?: string | null
        linkedin?: string | null
        is_primary?: boolean | null
    }
}

export function ContactFormDialog({ open, onOpenChange, contact }: ContactFormDialogProps) {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [empresas, setEmpresas] = useState<Array<{ id: string; nome: string }>>([])
    const isEditing = !!contact

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        setValue,
        watch,
    } = useForm<ContactFormData>({
        resolver: zodResolver(contactSchema),
        defaultValues: contact
            ? {
                nome: contact.nome,
                empresa_id: contact.empresa_id,
                cargo: contact.cargo || "",
                email: contact.email || "",
                telefone: contact.telefone || "",
                linkedin: contact.linkedin || "",
                is_primary: contact.is_primary || false,
            }
            : {
                nome: "",
                empresa_id: "",
                cargo: "",
                email: "",
                telefone: "",
                linkedin: "",
                is_primary: false,
            },
    })

    useEffect(() => {
        async function fetchEmpresas() {
            const supabase = createClient()
            const { data } = await supabase
                .from('empresas')
                .select('id, nome')
                .order('nome', { ascending: true })

            if (data) {
                setEmpresas(data)
            }
        }

        if (open) {
            fetchEmpresas()
        }
    }, [open])

    const onSubmit = async (data: ContactFormData) => {
        setIsSubmitting(true)

        try {
            const result = isEditing
                ? await updateContact(contact.id, data)
                : await createContact(data)

            if (result.error) {
                toast.error(isEditing ? "Erro ao atualizar contato" : "Erro ao criar contato", result.error)
            } else {
                toast.success(
                    isEditing ? "Contato atualizado!" : "Contato criado!"
                )
                reset()
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
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>{isEditing ? "Editar Contato" : "Novo Contato"}</DialogTitle>
                    <DialogDescription>
                        {isEditing
                            ? "Atualize as informações do contato."
                            : "Adicione um novo contato à empresa."}
                    </DialogDescription>
                </DialogHeader>

                <Form onSubmit={handleSubmit(onSubmit)}>
                    <div className="grid gap-4 py-4">
                        {/* Nome */}
                        <FormField>
                            <FormLabel>Nome Completo *</FormLabel>
                            <Input
                                {...register("nome")}
                                placeholder="Ex: João Silva"
                                disabled={isSubmitting}
                            />
                            {errors.nome && <FormMessage>{errors.nome.message}</FormMessage>}
                        </FormField>

                        <div className="grid grid-cols-2 gap-4">
                            {/* Empresa */}
                            <FormField>
                                <FormLabel>Empresa *</FormLabel>
                                <Select
                                    value={watch("empresa_id")}
                                    onValueChange={(value) => setValue("empresa_id", value)}
                                    disabled={isSubmitting || isEditing}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Selecione a empresa" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {empresas.map((empresa) => (
                                            <SelectItem key={empresa.id} value={empresa.id}>
                                                {empresa.nome}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.empresa_id && <FormMessage>{errors.empresa_id.message}</FormMessage>}
                            </FormField>

                            {/* Cargo */}
                            <FormField>
                                <FormLabel>Cargo</FormLabel>
                                <Input
                                    {...register("cargo")}
                                    placeholder="Ex: Diretor Comercial"
                                    disabled={isSubmitting}
                                />
                            </FormField>
                        </div>

                        {/* Email */}
                        <FormField>
                            <FormLabel>Email</FormLabel>
                            <Input
                                type="email"
                                {...register("email")}
                                placeholder="joao@empresa.com"
                                disabled={isSubmitting}
                            />
                            {errors.email && <FormMessage>{errors.email.message}</FormMessage>}
                        </FormField>

                        <div className="grid grid-cols-2 gap-4">
                            {/* Telefone */}
                            <FormField>
                                <FormLabel>Telefone</FormLabel>
                                <Input
                                    {...register("telefone")}
                                    placeholder="(11) 99999-9999"
                                    disabled={isSubmitting}
                                />
                            </FormField>

                            {/* LinkedIn */}
                            <FormField>
                                <FormLabel>LinkedIn</FormLabel>
                                <Input
                                    {...register("linkedin")}
                                    placeholder="linkedin.com/in/joaosilva"
                                    disabled={isSubmitting}
                                />
                            </FormField>
                        </div>

                        {/* Is Primary */}
                        <FormField>
                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="is_primary"
                                    checked={watch("is_primary")}
                                    onCheckedChange={(checked) => setValue("is_primary", checked as boolean)}
                                    disabled={isSubmitting}
                                />
                                <label
                                    htmlFor="is_primary"
                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                >
                                    Contato principal da empresa
                                </label>
                            </div>
                        </FormField>
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
                            {isEditing ? "Salvar" : "Criar"}
                        </Button>
                    </DialogFooter>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
