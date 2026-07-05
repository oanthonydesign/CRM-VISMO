import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen } from "lucide-react";
import { getEstrategias } from "@/app/actions/estrategias";
import { EstrategiaPageHeader } from "@/components/prospeccao/estrategia-page-header";
import { EstrategiaCardActions } from "@/components/prospeccao/estrategia-card-actions";
import { CANAL_LABELS } from "@/lib/prospeccao-constants";

export default async function EstrategiasPage() {
    const estrategias = await getEstrategias();

    return (
        <div className="space-y-6">
            <EstrategiaPageHeader />

            {estrategias.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {estrategias.map((e) => (
                        <Card key={e.id}>
                            <CardHeader className="pb-3">
                                <div className="flex items-start justify-between gap-2">
                                    <div className="space-y-1">
                                        <Badge variant="outline" className="font-mono text-[10px] uppercase">
                                            {e.segmento}
                                        </Badge>
                                        <CardTitle className="text-base">{e.titulo}</CardTitle>
                                    </div>
                                    <EstrategiaCardActions estrategia={e} />
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                {e.gancho && (
                                    <div>
                                        <p className="text-[10px] uppercase font-mono text-text-secondary mb-1">Gancho</p>
                                        <p className="text-sm text-text-primary">{e.gancho}</p>
                                    </div>
                                )}
                                {e.oferta && (
                                    <div>
                                        <p className="text-[10px] uppercase font-mono text-text-secondary mb-1">Oferta</p>
                                        <p className="text-sm text-text-primary">{e.oferta}</p>
                                    </div>
                                )}
                                {e.canal_recomendado && (
                                    <Badge variant="secondary" className="text-[10px]">
                                        {CANAL_LABELS[e.canal_recomendado] || e.canal_recomendado}
                                    </Badge>
                                )}
                            </CardContent>
                        </Card>
                    ))}
                </div>
            ) : (
                <Card>
                    <CardContent className="py-12 text-center text-text-secondary">
                        <BookOpen className="mx-auto h-8 w-8 mb-3 opacity-50" />
                        <p>Nenhuma estratégia cadastrada ainda.</p>
                        <p className="text-sm mt-2">
                            Registre ganchos e ofertas por segmento para consultar antes de abordar alguém novo.
                        </p>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
