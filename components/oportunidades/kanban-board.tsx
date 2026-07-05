"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    DndContext,
    DragOverlay,
    closestCorners,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragStartEvent,
    DragEndEvent,
    DragOverEvent,
    defaultDropAnimationSideEffects
} from "@dnd-kit/core";
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
    useSortable
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/utils/format";
import { DealCardActions } from "./deal-card-actions";
import { updateDealStage } from "@/app/actions/deals";
import { toast } from "@/lib/toast";

interface Deal {
    id: string;
    titulo: string;
    empresa_id: string;
    valor: number;
    probabilidade?: number;
    estagio: string;
    data_fechamento_prevista?: string;
    responsavel_id?: string;
    empresa?: { nome: string };
    responsavel?: { full_name: string };
}

interface Etapa {
    key: string;
    label: string;
    color: string;
}

interface KanbanBoardProps {
    initialDeals: Deal[];
    etapas: Etapa[];
}

// Sub-componente para o Card Arrastável
function SortableDealCard({ deal }: { deal: Deal }) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({
        id: deal.id,
        data: {
            type: "Deal",
            deal,
        }
    });

    const style = {
        transform: CSS.Translate.toString(transform),
        transition,
    };

    if (isDragging) {
        return (
            <div
                ref={setNodeRef}
                style={style}
                className="opacity-30"
            >
                <DealCard deal={deal} isGhost />
            </div>
        );
    }

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
        >
            <DealCard deal={deal} />
        </div>
    );
}

// Componente de UI do Card puro
function DealCard({ deal, isGhost }: { deal: Deal, isGhost?: boolean }) {
    return (
        <Card className={`bg-background-default border-utility-border-subtle group ${!isGhost ? 'hover:border-brand-primary/50 cursor-grab active:cursor-grabbing' : ''} transition-colors shadow-sm`}>
            <CardContent className="p-3 space-y-3">
                <div className="flex items-start justify-between gap-2">
                    <h4 className="font-medium text-sm text-text-primary line-clamp-2">
                        {deal.titulo}
                    </h4>
                    {!isGhost && <DealCardActions deal={deal} />}
                </div>

                {deal.empresa?.nome && (
                    <div className="text-xs text-text-secondary flex items-center gap-1">
                        <span className="truncate max-w-[180px]">
                            {deal.empresa.nome}
                        </span>
                    </div>
                )}

                <div className="flex items-center justify-between pt-2 border-t border-utility-border-subtle">
                    <span className="font-mono text-sm font-medium text-text-primary">
                        {formatCurrency(deal.valor || 0)}
                    </span>
                    {deal.probabilidade && (
                        <Badge
                            variant="secondary"
                            className="text-[10px] h-5 px-1.5"
                        >
                            {deal.probabilidade}%
                        </Badge>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}

export function KanbanBoard({ initialDeals, etapas }: KanbanBoardProps) {
    const [deals, setDeals] = useState<Deal[]>(initialDeals);
    const [activeDeal, setActiveDeal] = useState<Deal | null>(null);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 5, // Ativa o drag apenas após mover 5px (evita clicks acidentais)
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const dealsByEtapa = useMemo(() => {
        const grouped: Record<string, Deal[]> = {};
        etapas.forEach(e => grouped[e.key] = deals.filter(d => d.estagio === e.key));
        return grouped;
    }, [deals, etapas]);

    const calcularTotalEtapa = (etapaKey: string) => {
        return dealsByEtapa[etapaKey]?.reduce((acc, op) => acc + (op.valor || 0), 0) || 0;
    };

    function handleDragStart(event: DragStartEvent) {
        if (event.active.data.current?.type === "Deal") {
            setActiveDeal(event.active.data.current.deal);
        }
    }

    function handleDragOver(event: DragOverEvent) {
        const { active, over } = event;
        if (!over) return;

        const activeId = active.id;
        const overId = over.id;

        if (activeId === overId) return;

        const isOverAColumn = etapas.some(e => e.key === overId);

        // Lógica para mover entre colunas ou reordenar
        setDeals((prev) => {
            const activeIndex = prev.findIndex(d => d.id === activeId);
            const activeDeal = prev[activeIndex];

            if (isOverAColumn) {
                // Arrastando sobre uma coluna vazia ou cabeçalho de coluna
                const overEtapaKey = overId as string;
                if (activeDeal.estagio === overEtapaKey) return prev;

                const newDeals = [...prev];
                newDeals[activeIndex] = { ...activeDeal, estagio: overEtapaKey };
                return newDeals;
            }

            // Arrastando sobre outro card
            const overIndex = prev.findIndex(d => d.id === overId);
            const overDeal = prev[overIndex];

            if (activeDeal.estagio !== overDeal.estagio) {
                const newDeals = [...prev];
                newDeals[activeIndex] = { ...activeDeal, estagio: overDeal.estagio };
                return arrayMove(newDeals, activeIndex, overIndex);
            }

            return arrayMove(prev, activeIndex, overIndex);
        });
    }

    async function handleDragEnd(event: DragEndEvent) {
        setActiveDeal(null);
        const { active, over } = event;
        if (!over) return;

        const dealId = active.id as string;
        const finalDeal = deals.find(d => d.id === dealId);

        if (finalDeal) {
            // Sincronizar com o banco
            const result = await updateDealStage(dealId, finalDeal.estagio);
            if (result.error) {
                toast.error("Erro ao salvar movimento", result.error);
                // Opcional: Reverter estado local se der erro (Rollback)
                setDeals(initialDeals);
            } else {
                toast.success("Oportunidade movida!");
            }
        }
    }

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCorners}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragEnd={handleDragEnd}
        >
            <div className="flex gap-4 overflow-x-auto pb-4 min-h-[calc(100vh-250px)]">
                {etapas.map((etapa) => {
                    const oportunidadesEtapa = dealsByEtapa[etapa.key] || [];

                    return (
                        <div key={etapa.key} className="flex-shrink-0 w-80">
                            <Card className="h-full bg-background-elevated/50 border-utility-border-subtle overflow-hidden flex flex-col">
                                <CardHeader className="pb-3 bg-background-surface/50">
                                    <div className="flex items-center justify-between">
                                        <CardTitle className="text-sm font-medium uppercase tracking-wider text-text-secondary">
                                            {etapa.label}
                                        </CardTitle>
                                        <Badge variant="outline" className={etapa.color}>
                                            {oportunidadesEtapa.length}
                                        </Badge>
                                    </div>
                                    <CardDescription className="font-mono text-xs font-medium text-text-primary">
                                        {formatCurrency(calcularTotalEtapa(etapa.key))}
                                    </CardDescription>
                                </CardHeader>

                                <CardContent className="p-3 flex-1 overflow-y-auto">
                                    <SortableContext
                                        id={etapa.key}
                                        items={oportunidadesEtapa.map(d => d.id)}
                                        strategy={verticalListSortingStrategy}
                                    >
                                        <div className="space-y-3 min-h-[150px]">
                                            <AnimatePresence mode="popLayout">
                                                {oportunidadesEtapa.length === 0 ? (
                                                    <motion.div
                                                        initial={{ opacity: 0 }}
                                                        animate={{ opacity: 1 }}
                                                        exit={{ opacity: 0 }}
                                                        className="text-center text-text-secondary text-xs py-8 border-2 border-dashed border-utility-border-subtle rounded-lg"
                                                    >
                                                        Vazio (Solte aqui)
                                                    </motion.div>
                                                ) : (
                                                    oportunidadesEtapa.map((op) => (
                                                        <SortableDealCard key={op.id} deal={op} />
                                                    ))
                                                )}
                                            </AnimatePresence>
                                        </div>
                                    </SortableContext>
                                </CardContent>
                            </Card>
                        </div>
                    );
                })}
            </div>

            <DragOverlay dropAnimation={{
                sideEffects: defaultDropAnimationSideEffects({
                    styles: {
                        active: {
                            opacity: "0.5",
                        },
                    },
                }),
            }}>
                {activeDeal ? (
                    <div className="rotate-3 scale-105 shadow-2xl">
                        <DealCard deal={activeDeal} />
                    </div>
                ) : null}
            </DragOverlay>
        </DndContext>
    );
}
