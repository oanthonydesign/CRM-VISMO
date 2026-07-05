import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Grid, Col } from "@/components/layout/grid";
import { getProspeccao } from "@/app/actions/prospeccoes";
import { getInteracoes } from "@/app/actions/interacoes";
import { ProspeccaoDetailHeader } from "@/components/prospeccao/prospeccao-detail-header";
import { InteracaoFormDialog } from "@/components/prospeccao/interacao-form-dialog";
import { InteracoesTimeline } from "@/components/prospeccao/interacoes-timeline";

function formatData(value: string | null) {
    if (!value) return "—";
    return new Date(value).toLocaleDateString("pt-BR");
}

export default async function ProspeccaoDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const [prospeccao, interacoes] = await Promise.all([getProspeccao(id), getInteracoes(id)]);

    if (!prospeccao) notFound();

    return (
        <div className="space-y-6">
            <ProspeccaoDetailHeader prospeccao={prospeccao} />

            <Grid cols={2}>
                <Col span={1} className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">Contato</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-text-secondary">Telefone</span>
                                <span className="text-text-primary">{prospeccao.telefone || "—"}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-text-secondary">Instagram</span>
                                <span className="text-text-primary">{prospeccao.instagram || "—"}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-text-secondary">Segmento</span>
                                <span className="text-text-primary">{prospeccao.segmento || "—"}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-text-secondary">Origem</span>
                                <span className="text-text-primary">{prospeccao.origem || "—"}</span>
                            </div>
                            <div className="flex justify-between border-t border-utility-border-subtle pt-2 mt-2">
                                <span className="text-text-secondary">Encontrado em</span>
                                <span className="text-text-primary">{formatData(prospeccao.data_encontrado)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-text-secondary">Abordado em</span>
                                <span className="text-text-primary">{formatData(prospeccao.data_abordagem)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-text-secondary">Última interação</span>
                                <span className="text-text-primary">{formatData(prospeccao.data_ultima_interacao)}</span>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">Oportunidade identificada</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-text-primary whitespace-pre-wrap">
                                {prospeccao.oportunidade || "Ainda não definida."}
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">Como ajudar</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-text-primary whitespace-pre-wrap">
                                {prospeccao.como_ajudar || "Ainda não definido."}
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">Ideia de abordagem</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-text-primary whitespace-pre-wrap">
                                {prospeccao.ideia_abordagem || "Ainda não definida."}
                            </p>
                        </CardContent>
                    </Card>

                    {prospeccao.observacoes && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base">Observações</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-text-primary whitespace-pre-wrap">{prospeccao.observacoes}</p>
                            </CardContent>
                        </Card>
                    )}
                </Col>

                <Col span={1} className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="text-heading-md font-sans text-text-primary">Histórico</h3>
                        <InteracaoFormDialog prospeccaoId={prospeccao.id} />
                    </div>
                    <InteracoesTimeline interacoes={interacoes} />
                </Col>
            </Grid>
        </div>
    );
}
