"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
    DndContext,
    DragOverlay,
    closestCorners,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    type DragStartEvent,
    type DragEndEvent,
    type DragOverEvent,
    defaultDropAnimationSideEffects,
} from "@dnd-kit/core";
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
    useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { moveProspeccaoStage } from "@/app/actions/prospeccoes";
import { toast } from "@/lib/toast";
import { STAGE_META, CANAL_LABELS } from "@/lib/prospeccao-constants";
import { ProspeccaoCardActions } from "@/components/prospeccao/prospeccao-card-actions";
import type { ProspeccaoRecord } from "@/lib/schemas/prospeccoes";

type Prospeccao = ProspeccaoRecord & { canal: string; status: string };

interface Etapa {
    key: string;
    label: string;
}

interface KanbanBoardProps {
    initialProspeccoes: Prospeccao[];
    etapas: Etapa[];
}

function SortableProspeccaoCard({ prospeccao }: { prospeccao: Prospeccao }) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
        id: prospeccao.id,
        data: { type: "Prospeccao", prospeccao },
    });

    const style = { transform: CSS.Translate.toString(transform), transition };

    if (isDragging) {
        return (
            <div ref={setNodeRef} style={style} className="opacity-30">
                <ProspeccaoCard prospeccao={prospeccao} isGhost />
            </div>
        );
    }

    return (
        <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
            <ProspeccaoCard prospeccao={prospeccao} />
        </div>
    );
}

function ProspeccaoCard({ prospeccao, isGhost }: { prospeccao: Prospeccao; isGhost?: boolean }) {
    return (
        <Card
            className={`bg-background-default border-utility-border-subtle group ${!isGhost ? "hover:border-brand-primary/50 cursor-grab active:cursor-grabbing" : ""} transition-colors shadow-sm`}
        >
            <CardContent className="p-3 space-y-2">
                <div className="flex items-start justify-between gap-2">
                    <Link
                        href={`/prospeccao/${prospeccao.id}`}
                        onPointerDown={(e) => e.stopPropagation()}
                        className="text-sm font-medium text-text-primary hover:underline line-clamp-2"
                    >
                        {prospeccao.nome}
                    </Link>
                    {!isGhost && <ProspeccaoCardActions prospeccao={prospeccao} />}
                </div>

                {(prospeccao.empresa || prospeccao.segmento) && (
                    <div className="text-xs text-text-secondary truncate">
                        {prospeccao.empresa || prospeccao.segmento}
                    </div>
                )}

                <div className="flex items-center justify-between pt-2 border-t border-utility-border-subtle">
                    <Badge variant="secondary" className="text-[10px] h-5 px-1.5">
                        {CANAL_LABELS[prospeccao.canal] || prospeccao.canal}
                    </Badge>
                </div>
            </CardContent>
        </Card>
    );
}

export function KanbanBoard({ initialProspeccoes, etapas }: KanbanBoardProps) {
    const [prospeccoes, setProspeccoes] = useState<Prospeccao[]>(initialProspeccoes);
    const [activeProspeccao, setActiveProspeccao] = useState<Prospeccao | null>(null);

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
    );

    const porEtapa = useMemo(() => {
        const grouped: Record<string, Prospeccao[]> = {};
        etapas.forEach((e) => (grouped[e.key] = prospeccoes.filter((p) => p.status === e.key)));
        return grouped;
    }, [prospeccoes, etapas]);

    function handleDragStart(event: DragStartEvent) {
        if (event.active.data.current?.type === "Prospeccao") {
            setActiveProspeccao(event.active.data.current.prospeccao);
        }
    }

    function handleDragOver(event: DragOverEvent) {
        const { active, over } = event;
        if (!over) return;

        const activeId = active.id;
        const overId = over.id;
        if (activeId === overId) return;

        const isOverAColumn = etapas.some((e) => e.key === overId);

        setProspeccoes((prev) => {
            const activeIndex = prev.findIndex((p) => p.id === activeId);
            const activeProspeccao = prev[activeIndex];

            if (isOverAColumn) {
                const overEtapaKey = overId as string;
                if (activeProspeccao.status === overEtapaKey) return prev;
                const next = [...prev];
                next[activeIndex] = { ...activeProspeccao, status: overEtapaKey };
                return next;
            }

            const overIndex = prev.findIndex((p) => p.id === overId);
            const overProspeccao = prev[overIndex];

            if (activeProspeccao.status !== overProspeccao.status) {
                const next = [...prev];
                next[activeIndex] = { ...activeProspeccao, status: overProspeccao.status };
                return arrayMove(next, activeIndex, overIndex);
            }

            return arrayMove(prev, activeIndex, overIndex);
        });
    }

    async function handleDragEnd(event: DragEndEvent) {
        setActiveProspeccao(null);
        const { active, over } = event;
        if (!over) return;

        const id = active.id as string;
        const final = prospeccoes.find((p) => p.id === id);

        if (final) {
            const result = await moveProspeccaoStage(id, final.status);
            if (result.error) {
                toast.error("Erro ao salvar movimento", result.error);
                setProspeccoes(initialProspeccoes);
            } else {
                toast.success("Prospect movido!");
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
            <div className="flex gap-4 overflow-x-auto pb-4 min-h-[calc(100vh-320px)]">
                {etapas.map((etapa) => {
                    const itens = porEtapa[etapa.key] || [];
                    const meta = STAGE_META[etapa.key];

                    return (
                        <div key={etapa.key} className="flex-shrink-0 w-80">
                            <Card className="h-full bg-background-elevated/50 border-utility-border-subtle overflow-hidden flex flex-col">
                                <CardHeader className="pb-3 bg-background-surface/50">
                                    <div className="flex items-center justify-between">
                                        <CardTitle className="text-sm font-medium uppercase tracking-wider text-text-secondary">
                                            {etapa.label}
                                        </CardTitle>
                                        <Badge variant="outline" className={meta?.color}>
                                            {itens.length}
                                        </Badge>
                                    </div>
                                </CardHeader>

                                <CardContent className="p-3 flex-1 overflow-y-auto">
                                    <SortableContext id={etapa.key} items={itens.map((p) => p.id)} strategy={verticalListSortingStrategy}>
                                        <div className="space-y-3 min-h-[150px]">
                                            <AnimatePresence mode="popLayout">
                                                {itens.length === 0 ? (
                                                    <motion.div
                                                        initial={{ opacity: 0 }}
                                                        animate={{ opacity: 1 }}
                                                        exit={{ opacity: 0 }}
                                                        className="text-center text-text-secondary text-xs py-8 border-2 border-dashed border-utility-border-subtle rounded-lg"
                                                    >
                                                        Vazio (solte aqui)
                                                    </motion.div>
                                                ) : (
                                                    itens.map((p) => <SortableProspeccaoCard key={p.id} prospeccao={p} />)
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

            <DragOverlay
                dropAnimation={{
                    sideEffects: defaultDropAnimationSideEffects({ styles: { active: { opacity: "0.5" } } }),
                }}
            >
                {activeProspeccao ? (
                    <div className="rotate-3 scale-105 shadow-2xl">
                        <ProspeccaoCard prospeccao={activeProspeccao} />
                    </div>
                ) : null}
            </DragOverlay>
        </DndContext>
    );
}
