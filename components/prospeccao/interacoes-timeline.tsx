"use client"

import { Phone, MessageSquare, Instagram, StickyNote, Clock, CheckCircle2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { Card, CardContent } from "@/components/ui/card"
import { INTERACAO_LABELS } from "@/lib/prospeccao-constants"

interface Interacao {
    id: string
    tipo: string
    descricao: string
    proximo_passo?: string | null
    created_at: string
}

const iconMap: Record<string, typeof Phone> = {
    ligacao: Phone,
    whatsapp: MessageSquare,
    instagram: Instagram,
    nota: StickyNote,
}

export function InteracoesTimeline({ interacoes }: { interacoes: Interacao[] }) {
    if (interacoes.length === 0) {
        return (
            <div className="text-center py-10 border-2 border-dashed border-utility-border-subtle rounded-xl text-text-secondary bg-background-surface/50">
                Nenhuma interação registrada ainda.
            </div>
        )
    }

    return (
        <div className="space-y-4">
            {interacoes.map((interacao, index) => {
                const Icon = iconMap[interacao.tipo] || MessageSquare
                return (
                    <div key={interacao.id} className="relative pl-8 pb-4 last:pb-0">
                        {index !== interacoes.length - 1 && (
                            <div className="absolute left-[11px] top-6 bottom-0 w-[2px] bg-utility-border-subtle" />
                        )}

                        <div className="absolute left-0 top-1 p-1.5 rounded-full border border-utility-border-subtle bg-background-surface text-text-secondary">
                            <Icon size={12} />
                        </div>

                        <Card className="border-utility-border-subtle shadow-sm">
                            <CardContent className="p-4 space-y-2">
                                <div className="flex items-center justify-between">
                                    <span className="font-mono text-[10px] uppercase tracking-wider text-text-secondary bg-background-elevated px-1.5 py-0.5 rounded">
                                        {INTERACAO_LABELS[interacao.tipo] || interacao.tipo}
                                    </span>
                                    <span className="text-[11px] font-mono text-text-secondary flex items-center gap-1">
                                        <Clock size={10} />
                                        {new Date(interacao.created_at).toLocaleString("pt-BR", {
                                            day: "2-digit",
                                            month: "2-digit",
                                            hour: "2-digit",
                                            minute: "2-digit",
                                        })}
                                    </span>
                                </div>
                                <p className="text-sm text-text-primary">{interacao.descricao}</p>
                                {interacao.proximo_passo && (
                                    <div
                                        className={cn(
                                            "bg-brand-primary/5 p-3 rounded-lg border border-brand-primary/10",
                                        )}
                                    >
                                        <span className="text-[10px] uppercase font-bold text-brand-primary flex items-center gap-1 mb-1">
                                            <CheckCircle2 size={10} /> Próximo passo
                                        </span>
                                        <p className="text-sm text-text-primary italic">{interacao.proximo_passo}</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                )
            })}
        </div>
    )
}
