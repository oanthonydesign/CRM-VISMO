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
import { createProspeccao, updateProspeccao } from "@/app/actions/prospeccoes"
import { prospeccaoSchema, type ProspeccaoFormData, type ProspeccaoRecord } from "@/lib/schemas/prospeccoes"
import { toast } from "@/lib/toast"

interface ProspeccaoFormDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    prospeccao?: ProspeccaoRecord
}

const textareaClass =
    "flex min-h-[70px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"

export function ProspeccaoFormDialog({ open, onOpenChange, prospeccao }: ProspeccaoFormDialogProps) {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const isEditing = !!prospeccao

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        setValue,
        watch,
    } = useForm<ProspeccaoFormData>({
        resolver: zodResolver(prospeccaoSchema),
        defaultValues: {
            nome: prospeccao?.nome || "",
            empresa: prospeccao?.empresa || "",
            tipo: (prospeccao?.tipo as ProspeccaoFormData["tipo"]) || "empresa",
            segmento: prospeccao?.segmento || "",
            canal: (prospeccao?.canal as ProspeccaoFormData["canal"]) || "whatsapp",
            telefone: prospeccao?.telefone || "",
            instagram: prospeccao?.instagram || "",
            origem: prospeccao?.origem || "",
            status: (prospeccao?.status as ProspeccaoFormData["status"]) || "novo",
            oportunidade: prospeccao?.oportunidade || "",
            como_ajudar: prospeccao?.como_ajudar || "",
            ideia_abordagem: prospeccao?.ideia_abordagem || "",
            observacoes: prospeccao?.observacoes || "",
        },
    })

    const onSubmit = async (data: ProspeccaoFormData) => {
        setIsSubmitting(true)

        try {
            const result = isEditing
                ? await updateProspeccao(prospeccao.id, data)
                : await createProspeccao(data)

            if (result.error) {
                toast.error(isEditing ? "Erro ao atualizar" : "Erro ao criar", result.error)
            } else {
                toast.success(isEditing ? "Prospect atualizado!" : "Prospect adicionado ao radar!")
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
            <DialogContent className="sm:max-w-[600px] max-h-[85vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{isEditing ? "Editar prospect" : "Novo prospect"}</DialogTitle>
                    <DialogDescription>
                        {isEditing
                            ? "Atualize os dados e a estratégia deste prospect."
                            : "Mapeie uma empresa, microempresa ou profissional liberal encontrado."}
                    </DialogDescription>
                </DialogHeader>

                <Form onSubmit={handleSubmit(onSubmit)}>
                    <div className="grid gap-4 py-2">
                        <div className="grid grid-cols-2 gap-4">
                            <FormField>
                                <FormLabel>Nome *</FormLabel>
                                <Input {...register("nome")} placeholder="Nome ou razão social" disabled={isSubmitting} />
                                {errors.nome && <FormMessage>{errors.nome.message}</FormMessage>}
                            </FormField>
                            <FormField>
                                <FormLabel>Empresa</FormLabel>
                                <Input {...register("empresa")} placeholder="Se pessoa física, empresa que representa" disabled={isSubmitting} />
                            </FormField>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <FormField>
                                <FormLabel>Tipo *</FormLabel>
                                <Select value={watch("tipo")} onValueChange={(v) => setValue("tipo", v as ProspeccaoFormData["tipo"])} disabled={isSubmitting}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Selecione o tipo" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="empresa">Empresa</SelectItem>
                                        <SelectItem value="microempresa">Microempresa</SelectItem>
                                        <SelectItem value="profissional_liberal">Profissional liberal</SelectItem>
                                    </SelectContent>
                                </Select>
                            </FormField>
                            <FormField>
                                <FormLabel>Segmento / nicho</FormLabel>
                                <Input {...register("segmento")} placeholder="Padaria, salão, contador..." disabled={isSubmitting} />
                            </FormField>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <FormField>
                                <FormLabel>Canal *</FormLabel>
                                <Select value={watch("canal")} onValueChange={(v) => setValue("canal", v as ProspeccaoFormData["canal"])} disabled={isSubmitting}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Selecione o canal" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="whatsapp">WhatsApp</SelectItem>
                                        <SelectItem value="instagram">Instagram</SelectItem>
                                        <SelectItem value="ambos">Ambos</SelectItem>
                                    </SelectContent>
                                </Select>
                            </FormField>
                            <FormField>
                                <FormLabel>Origem</FormLabel>
                                <Input {...register("origem")} placeholder="Explore, indicação, Maps, evento..." disabled={isSubmitting} />
                            </FormField>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <FormField>
                                <FormLabel>Telefone</FormLabel>
                                <Input {...register("telefone")} placeholder="(00) 00000-0000" disabled={isSubmitting} />
                            </FormField>
                            <FormField>
                                <FormLabel>@ Instagram</FormLabel>
                                <Input {...register("instagram")} placeholder="@perfil" disabled={isSubmitting} />
                            </FormField>
                        </div>

                        {isEditing && (
                            <FormField>
                                <FormLabel>Estágio</FormLabel>
                                <Select value={watch("status")} onValueChange={(v) => setValue("status", v as ProspeccaoFormData["status"])} disabled={isSubmitting}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Selecione o estágio" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="novo">Novo</SelectItem>
                                        <SelectItem value="abordado">Abordado</SelectItem>
                                        <SelectItem value="respondeu">Respondeu</SelectItem>
                                        <SelectItem value="em_conversa">Em conversa</SelectItem>
                                        <SelectItem value="fechado">Fechado</SelectItem>
                                        <SelectItem value="perdido">Perdido</SelectItem>
                                    </SelectContent>
                                </Select>
                            </FormField>
                        )}

                        <FormField>
                            <FormLabel>Oportunidade identificada</FormLabel>
                            <textarea {...register("oportunidade")} className={textareaClass} placeholder="O que dá pra implementar na empresa dela" disabled={isSubmitting} />
                        </FormField>

                        <FormField>
                            <FormLabel>Como ajudar</FormLabel>
                            <textarea {...register("como_ajudar")} className={textareaClass} placeholder="Qual dor isso resolve" disabled={isSubmitting} />
                        </FormField>

                        <FormField>
                            <FormLabel>Ideia de abordagem</FormLabel>
                            <textarea {...register("ideia_abordagem")} className={textareaClass} placeholder="Gancho ou mensagem planejada" disabled={isSubmitting} />
                        </FormField>

                        <FormField>
                            <FormLabel>Observações</FormLabel>
                            <textarea {...register("observacoes")} className={textareaClass} placeholder="Notas adicionais" disabled={isSubmitting} />
                        </FormField>
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
                            Cancelar
                        </Button>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {isEditing ? "Salvar alterações" : "Adicionar ao radar"}
                        </Button>
                    </DialogFooter>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
