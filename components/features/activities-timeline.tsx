"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Phone,
    Video,
    MessageSquare,
    Mail,
    CheckCircle2,
    ChevronDown,
    Clock,
    User
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";

interface Atividade {
    id: string;
    tipo: string;
    descricao: string;
    data_realizada: string;
    proximo_passo?: string;
    empresa?: { nome: string };
    responsavel?: { full_name: string };
}

interface ActivitiesTimelineProps {
    atividades: Atividade[];
}

const iconMap: Record<string, any> = {
    ligacao: Phone,
    reuniao: Video,
    whatsapp: MessageSquare,
    email: Mail,
};

export function ActivitiesTimeline({ atividades }: ActivitiesTimelineProps) {
    const [expandedId, setExpandedId] = useState<string | null>(null);

    return (
        <div className="space-y-4">
            {atividades.map((atividade, index) => {
                const Icon = iconMap[atividade.tipo.toLowerCase()] || MessageSquare;
                const isExpanded = expandedId === atividade.id;

                return (
                    <div key={atividade.id} className="relative pl-8 pb-4 last:pb-0">
                        {/* Timeline Line */}
                        {index !== atividades.length - 1 && (
                            <div className="absolute left-[11px] top-6 bottom-0 w-[2px] bg-utility-border-subtle" />
                        )}

                        {/* Timeline Dot/Icon */}
                        <div className={cn(
                            "absolute left-0 top-1 p-1.5 rounded-full border bg-background-surface transition-colors duration-200",
                            isExpanded ? "border-brand-primary text-brand-primary shadow-sm" : "border-utility-border-subtle text-text-secondary"
                        )}>
                            <Icon size={12} />
                        </div>

                        <Card
                            className={cn(
                                "transition-all duration-300 border-utility-border-subtle hover:border-brand-primary/30 cursor-pointer overflow-hidden",
                                isExpanded ? "shadow-md ring-1 ring-brand-primary/10" : "shadow-sm"
                            )}
                            onClick={() => setExpandedId(isExpanded ? null : atividade.id)}
                        >
                            <CardContent className="p-4">
                                <div className="flex items-start justify-between">
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2">
                                            <span className="font-mono text-[10px] uppercase tracking-wider text-text-secondary bg-background-elevated px-1.5 py-0.5 rounded">
                                                {atividade.tipo}
                                            </span>
                                            <span className="text-sm font-medium text-text-primary">
                                                {atividade.empresa?.nome || "Sem empresa"}
                                            </span>
                                        </div>
                                        <p className={cn(
                                            "text-sm text-text-secondary",
                                            isExpanded ? "" : "line-clamp-1"
                                        )}>
                                            {atividade.descricao}
                                        </p>
                                    </div>
                                    <div className="flex flex-col items-end gap-2">
                                        <span className="text-[11px] font-mono text-text-secondary flex items-center gap-1">
                                            <Clock size={10} />
                                            {new Date(atividade.data_realizada).toLocaleDateString('pt-BR')}
                                        </span>
                                        <ChevronDown size={14} className={cn(
                                            "text-text-secondary transition-transform duration-300",
                                            isExpanded ? "rotate-180" : ""
                                        )} />
                                    </div>
                                </div>

                                <AnimatePresence>
                                    {isExpanded && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: "auto", opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                        >
                                            <div className="pt-4 mt-4 border-t border-utility-border-subtle space-y-3">
                                                {atividade.proximo_passo && (
                                                    <div className="bg-brand-primary/5 p-3 rounded-lg border border-brand-primary/10">
                                                        <span className="text-[10px] uppercase font-bold text-brand-primary flex items-center gap-1 mb-1">
                                                            <CheckCircle2 size={10} /> Próximo passo
                                                        </span>
                                                        <p className="text-sm text-text-primary italic">
                                                            {atividade.proximo_passo}
                                                        </p>
                                                    </div>
                                                )}
                                                <div className="flex items-center justify-between text-xs text-text-secondary">
                                                    <div className="flex items-center gap-1.5">
                                                        <User size={12} />
                                                        <span>{atividade.responsavel?.full_name}</span>
                                                    </div>
                                                    <span className="italic">Registrado em sistema</span>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </CardContent>
                        </Card>
                    </div>
                );
            })}

            {atividades.length === 0 && (
                <div className="text-center py-12 border-2 border-dashed border-utility-border-subtle rounded-xl text-text-secondary bg-background-surface/50">
                    Nenhuma atividade registrada.
                </div>
            )}
        </div>
    );
}
