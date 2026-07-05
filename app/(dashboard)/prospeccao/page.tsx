import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Grid, Col } from "@/components/layout/grid";
import { BarChart } from "@/components/charts/bar-chart";
import { LineChart } from "@/components/charts/line-chart";
import { calcularKPIsProspeccao } from "@/lib/utils/prospeccao-kpis";
import { STAGE_META, STAGE_ORDER, CANAL_LABELS } from "@/lib/prospeccao-constants";

function formatDataCurta(iso: string) {
    const [, mes, dia] = iso.split('-');
    return `${dia}/${mes}`;
}

export default async function ProspeccaoDashboardPage() {
    const kpis = await calcularKPIsProspeccao();

    const funilData = STAGE_ORDER.map((estagio) => ({
        estagio: STAGE_META[estagio].label,
        total: kpis.porEstagio[estagio] || 0,
    }));

    const tendenciaData = kpis.porDia.map((d) => ({
        data: formatDataCurta(d.data),
        total: d.total,
    }));

    return (
        <div className="space-y-6">
            <Grid cols={4}>
                <Col span={1}>
                    <Card>
                        <CardHeader className="pb-2">
                            <CardDescription className="font-mono uppercase text-xs">Hoje</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-text-primary">{kpis.hoje}</div>
                            <p className="text-xs text-text-secondary mt-1">prospects mapeados</p>
                        </CardContent>
                    </Card>
                </Col>
                <Col span={1}>
                    <Card>
                        <CardHeader className="pb-2">
                            <CardDescription className="font-mono uppercase text-xs">Últimos 7 dias</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-text-primary">{kpis.semana}</div>
                            <p className="text-xs text-text-secondary mt-1">prospects mapeados</p>
                        </CardContent>
                    </Card>
                </Col>
                <Col span={1}>
                    <Card>
                        <CardHeader className="pb-2">
                            <CardDescription className="font-mono uppercase text-xs">Este mês</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-text-primary">{kpis.mes}</div>
                            <p className="text-xs text-text-secondary mt-1">prospects mapeados</p>
                        </CardContent>
                    </Card>
                </Col>
                <Col span={1}>
                    <Card>
                        <CardHeader className="pb-2">
                            <CardDescription className="font-mono uppercase text-xs">Taxa de resposta</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-text-primary">{kpis.taxaResposta}%</div>
                            <p className="text-xs text-text-secondary mt-1">de quem foi abordado</p>
                        </CardContent>
                    </Card>
                </Col>
            </Grid>

            <Grid cols={2}>
                <Col span={1}>
                    <Card>
                        <CardHeader className="pb-2">
                            <CardDescription className="font-mono uppercase text-xs">Canal mais efetivo</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {kpis.canalMaisEfetivo ? (
                                <>
                                    <div className="text-2xl font-bold text-text-primary">
                                        {CANAL_LABELS[kpis.canalMaisEfetivo.canal] || kpis.canalMaisEfetivo.canal}
                                    </div>
                                    <p className="text-xs text-text-secondary mt-1">
                                        {kpis.canalMaisEfetivo.taxaResposta}% de taxa de resposta
                                    </p>
                                </>
                            ) : (
                                <p className="text-sm text-text-secondary">Sem dados suficientes ainda.</p>
                            )}
                        </CardContent>
                    </Card>
                </Col>
                <Col span={1}>
                    <Card>
                        <CardHeader className="pb-2">
                            <CardDescription className="font-mono uppercase text-xs">Parados sem próxima ação</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-text-primary">{kpis.paradosSemProximaAcao}</div>
                            <p className="text-xs text-text-secondary mt-1">
                                prospects ativos sem data de retorno definida
                            </p>
                        </CardContent>
                    </Card>
                </Col>
            </Grid>

            <Grid cols={2}>
                <Col span={1}>
                    <Card>
                        <CardHeader>
                            <CardTitle>Funil por estágio</CardTitle>
                            <CardDescription>Onde cada prospect está agora</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <BarChart
                                data={funilData}
                                xKey="estagio"
                                bars={[{ key: "total", name: "Prospects" }]}
                                layout="vertical"
                                height={280}
                            />
                        </CardContent>
                    </Card>
                </Col>
                <Col span={1}>
                    <Card>
                        <CardHeader>
                            <CardTitle>Prospecção por dia</CardTitle>
                            <CardDescription>Últimos 14 dias com registro</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {tendenciaData.length > 0 ? (
                                <LineChart
                                    data={tendenciaData}
                                    xKey="data"
                                    lines={[{ key: "total", name: "Prospectados" }]}
                                    height={280}
                                />
                            ) : (
                                <div className="flex h-[280px] items-center justify-center text-sm text-text-secondary">
                                    Nenhum prospect mapeado ainda.
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </Col>
            </Grid>
        </div>
    );
}
