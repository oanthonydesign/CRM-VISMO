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
import { createEstrategia, updateEstrategia } from "@/app/actions/estrategias"
import { estrategiaSchema, type EstrategiaFormData } from "@/lib/schemas/estrategias"
import { toast } from "@/lib/toast"

interface EstrategiaFormDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    estrategia?: { id: string } & Partial<EstrategiaFormData>
}

const textareaClass =
    "flex min-h-[70px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"

export function EstrategiaFormDialog({ open, onOpenChange, estrategia }: EstrategiaFormDialogProps) {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const isEditing = !!estrategia

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        setValue,
        watch,
    } = useForm<EstrategiaFormData>({
        resolver: zodResolver(estrategiaSchema),
        defaultValues: {
            segmento: estrategia?.segmento || "",
            titulo: estrategia?.titulo || "",
            gancho: estrategia?.gancho || "",
            oferta: estrategia?.oferta || "",
            canal_recomendado: estrategia?.canal_recomendado || undefined,
        },
    })

    const onSubmit = async (data: EstrategiaFormData) => {
        setIsSubmitting(true)
        try {
            const result = isEditing
                ? await updateEstrategia(estrategia.id, data)
                : await createEstrategia(data)

            if (result.error) {
                toast.error(isEditing ? "Erro ao atualizar" : "Erro ao criar", result.error)
            } else {
                toast.success(isEditing ? "Estratégia atualizada!" : "Estratégia adicionada ao playbook!")
                reset()
                onOpenChange(false)
            }
        } catch {
            toast.error("Erro inesperado", "Tente novamente mais tarde.")
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[550px]">
                <DialogHeader>
                    <DialogTitle>{isEditing ? "Editar estratégia" : "Nova estratégia"}</DialogTitle>
                    <DialogDescription>
                        Playbook reutilizável: gancho e oferta para um segmento inteiro, não para uma pessoa só.
                    </DialogDescription>
                </DialogHeader>

                <Form onSubmit={handleSubmit(onSubmit)}>
                    <div className="grid gap-4 py-2">
                        <div className="grid grid-cols-2 gap-4">
                            <FormField>
                                <FormLabel>Segmento *</FormLabel>
                                <Input {...register("segmento")} placeholder="Padaria, salão, contador..." disabled={isSubmitting} />
                                {errors.segmento && <FormMessage>{errors.segmento.message}</FormMessage>}
                            </FormField>
                            <FormField>
                                <FormLabel>Canal recomendado</FormLabel>
                                <Select
                                    value={watch("canal_recomendado")}
                                    onValueChange={(v) => setValue("canal_recomendado", v as EstrategiaFormData["canal_recomendado"])}
                                    disabled={isSubmitting}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Selecione" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="whatsapp">WhatsApp</SelectItem>
                                        <SelectItem value="instagram">Instagram</SelectItem>
                                        <SelectItem value="ambos">Ambos</SelectItem>
                                    </SelectContent>
                                </Select>
                            </FormField>
                        </div>

                        <FormField>
                            <FormLabel>Título *</FormLabel>
                            <Input {...register("titulo")} placeholder="Ex: Padarias sem cardápio digital" disabled={isSubmitting} />
                            {errors.titulo && <FormMessage>{errors.titulo.message}</FormMessage>}
                        </FormField>

                        <FormField>
                            <FormLabel>Gancho / mensagem</FormLabel>
                            <textarea {...register("gancho")} className={textareaClass} placeholder="Como abrir a conversa com esse segmento" disabled={isSubmitting} />
                        </FormField>

                        <FormField>
                            <FormLabel>Oferta</FormLabel>
                            <textarea {...register("oferta")} className={textareaClass} placeholder="O que costuma fazer sentido oferecer" disabled={isSubmitting} />
                        </FormField>
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
                            Cancelar
                        </Button>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {isEditing ? "Salvar alterações" : "Adicionar ao playbook"}
                        </Button>
                    </DialogFooter>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
