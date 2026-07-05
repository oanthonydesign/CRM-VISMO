"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2, MessageSquarePlus } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Form, FormField, FormLabel, FormMessage } from "@/components/ui/form"
import { createInteracao } from "@/app/actions/interacoes"
import { interacaoSchema, type InteracaoFormData } from "@/lib/schemas/interacoes"
import { toast } from "@/lib/toast"

const textareaClass =
    "flex min-h-[70px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"

export function InteracaoFormDialog({ prospeccaoId }: { prospeccaoId: string }) {
    const [open, setOpen] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        setValue,
        watch,
    } = useForm<InteracaoFormData>({
        resolver: zodResolver(interacaoSchema),
        defaultValues: { prospeccao_id: prospeccaoId, tipo: "whatsapp", descricao: "", proximo_passo: "" },
    })

    const onSubmit = async (data: InteracaoFormData) => {
        setIsSubmitting(true)
        try {
            const result = await createInteracao(data)
            if (result.error) {
                toast.error("Erro ao registrar interação", result.error)
            } else {
                toast.success("Interação registrada!")
                reset({ prospeccao_id: prospeccaoId, tipo: "whatsapp", descricao: "", proximo_passo: "" })
                setOpen(false)
            }
        } catch {
            toast.error("Erro inesperado", "Tente novamente mais tarde.")
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button size="sm">
                    <MessageSquarePlus className="mr-2 h-4 w-4" /> Registrar interação
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Registrar interação</DialogTitle>
                    <DialogDescription>Guarde o que foi conversado e o próximo passo.</DialogDescription>
                </DialogHeader>
                <Form onSubmit={handleSubmit(onSubmit)}>
                    <div className="grid gap-4 py-2">
                        <FormField>
                            <FormLabel>Tipo *</FormLabel>
                            <Select value={watch("tipo")} onValueChange={(v) => setValue("tipo", v as InteracaoFormData["tipo"])} disabled={isSubmitting}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Selecione o tipo" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="whatsapp">WhatsApp</SelectItem>
                                    <SelectItem value="instagram">Instagram</SelectItem>
                                    <SelectItem value="ligacao">Ligação</SelectItem>
                                    <SelectItem value="nota">Nota</SelectItem>
                                </SelectContent>
                            </Select>
                        </FormField>

                        <FormField>
                            <FormLabel>O que aconteceu *</FormLabel>
                            <textarea {...register("descricao")} className={textareaClass} placeholder="Mensagem enviada, resposta recebida..." disabled={isSubmitting} />
                            {errors.descricao && <FormMessage>{errors.descricao.message}</FormMessage>}
                        </FormField>

                        <FormField>
                            <FormLabel>Próximo passo</FormLabel>
                            <textarea {...register("proximo_passo")} className={textareaClass} placeholder="O que fazer em seguida" disabled={isSubmitting} />
                        </FormField>
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={isSubmitting}>
                            Cancelar
                        </Button>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Registrar
                        </Button>
                    </DialogFooter>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
