import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Radar as RadarIcon } from "lucide-react";
import { getProspeccoes } from "@/app/actions/prospeccoes";
import { RadarPageHeader } from "@/components/prospeccao/radar-page-header";
import { RadarTableActions } from "@/components/prospeccao/radar-table-actions";
import { TIPO_LABELS, CANAL_LABELS } from "@/lib/prospeccao-constants";

export default async function RadarPage() {
    const todas = await getProspeccoes();
    const prospeccoes = todas.filter((p) => p.status === "novo");

    return (
        <div className="space-y-6">
            <RadarPageHeader />

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <RadarIcon className="h-5 w-5 text-text-secondary" />
                        Backlog de triagem
                    </CardTitle>
                    <CardDescription>{prospeccoes.length} prospects aguardando abordagem</CardDescription>
                </CardHeader>
                <CardContent>
                    {prospeccoes.length > 0 ? (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Nome</TableHead>
                                    <TableHead>Tipo</TableHead>
                                    <TableHead>Segmento</TableHead>
                                    <TableHead>Canal</TableHead>
                                    <TableHead>Origem</TableHead>
                                    <TableHead className="text-right">Ações</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {prospeccoes.map((p) => (
                                    <TableRow key={p.id}>
                                        <TableCell className="font-medium">
                                            {p.nome}
                                            {p.empresa && (
                                                <span className="block text-xs text-text-secondary">{p.empresa}</span>
                                            )}
                                        </TableCell>
                                        <TableCell>{TIPO_LABELS[p.tipo] || p.tipo}</TableCell>
                                        <TableCell>{p.segmento || "—"}</TableCell>
                                        <TableCell>
                                            <Badge variant="outline">{CANAL_LABELS[p.canal] || p.canal}</Badge>
                                        </TableCell>
                                        <TableCell className="text-text-secondary">{p.origem || "—"}</TableCell>
                                        <TableCell>
                                            <RadarTableActions prospeccao={p} />
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    ) : (
                        <div className="text-center py-12 text-text-secondary">
                            <p>Nenhum prospect no radar.</p>
                            <p className="text-sm mt-2">Clique em &quot;Novo prospect&quot; para mapear alguém encontrado.</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
