import { getProspeccoes } from "@/app/actions/prospeccoes";
import { KanbanBoard } from "@/components/prospeccao/kanban-board";
import { STAGE_META, PIPELINE_STAGES } from "@/lib/prospeccao-constants";

export default async function PipelinePage() {
    const todas = await getProspeccoes();
    const emAbordagem = todas.filter((p) => p.status !== "novo");

    const etapas = PIPELINE_STAGES.map((key) => ({ key, label: STAGE_META[key].label }));

    return (
        <div className="space-y-6">
            <div className="space-y-1">
                <h2 className="text-heading-lg font-sans text-text-primary">Pipeline</h2>
                <p className="text-text-secondary font-mono text-sm">
                    Arraste os cards entre as colunas para atualizar o estágio
                </p>
            </div>

            <KanbanBoard initialProspeccoes={emAbordagem} etapas={etapas} />
        </div>
    );
}
