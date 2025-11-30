import { Card, CardContent } from "@/components/ui/card";
import { mockProjetos } from "@/lib/mock-data";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export function ProjectTimeline() {
    // Simplified timeline visualization
    const months = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun"];

    return (
        <div className="space-y-6">
            <div className="flex items-center border-b border-utility-border-subtle pb-2">
                <div className="w-64 flex-shrink-0 font-medium text-sm text-text-secondary">Projeto</div>
                <div className="flex-1 grid grid-cols-6">
                    {months.map(m => (
                        <div key={m} className="text-sm text-text-secondary text-center border-l border-utility-border-subtle first:border-l-0">
                            {m}
                        </div>
                    ))}
                </div>
            </div>

            <div className="space-y-4">
                {mockProjetos.map((projeto) => (
                    <div key={projeto.id} className="flex items-center group">
                        <div className="w-64 flex-shrink-0 pr-4">
                            <p className="text-sm font-medium text-text-primary truncate">{projeto.nome}</p>
                            <p className="text-xs text-text-secondary truncate">{projeto.cliente}</p>
                        </div>
                        <div className="flex-1 grid grid-cols-6 relative h-8 items-center">
                            {/* Grid lines */}
                            {months.map((_, i) => (
                                <div key={i} className="absolute h-full w-px bg-utility-border-subtle/30" style={{ left: `${(i / 6) * 100}%` }} />
                            ))}

                            {/* Project Bar (Simulated position/width based on deadline) */}
                            <div
                                className="absolute h-6 rounded-full bg-brand-primary/20 border border-brand-primary/50 flex items-center px-2"
                                style={{
                                    left: '10%',
                                    width: `${Math.random() * 40 + 20}%` // Random width for demo since we don't have start dates in mock
                                }}
                            >
                                <span className="text-[10px] text-brand-primary font-medium truncate">
                                    {projeto.status}
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
