import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Calendar, AlertCircle, CheckCircle, Clock } from "lucide-react";
import { mockProjetos } from "@/lib/mock-data";

function getStatusColor(status: string) {
    switch (status) {
        case "planejamento": return "bg-gray-500/20 text-gray-500 border-gray-500/50";
        case "design": return "bg-purple-500/20 text-purple-500 border-purple-500/50";
        case "desenvolvimento": return "bg-blue-500/20 text-blue-500 border-blue-500/50";
        case "qa": return "bg-yellow-500/20 text-yellow-500 border-yellow-500/50";
        case "entregue": return "bg-green-500/20 text-green-500 border-green-500/50";
        default: return "bg-gray-500/20 text-gray-500";
    }
}

function getHealthIcon(health: string) {
    switch (health) {
        case "on_track": return <CheckCircle className="h-4 w-4 text-green-500" />;
        case "at_risk": return <Clock className="h-4 w-4 text-yellow-500" />;
        case "off_track": return <AlertCircle className="h-4 w-4 text-red-500" />;
        default: return null;
    }
}

export function ProjectPortfolio() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {mockProjetos.map((projeto) => (
                <Card key={projeto.id} className="hover:border-utility-border-strong transition-colors">
                    <CardHeader>
                        <div className="flex items-start justify-between">
                            <div className="space-y-1">
                                <CardTitle>{projeto.nome}</CardTitle>
                                <CardDescription>{projeto.cliente}</CardDescription>
                            </div>
                            <Badge variant="outline" className={getStatusColor(projeto.status)}>
                                {projeto.status}
                            </Badge>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-text-secondary">Progresso</span>
                                <span className="font-mono text-text-primary">{projeto.progresso}%</span>
                            </div>
                            <Progress value={projeto.progresso} className="h-2" />
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-sm text-text-secondary">
                                <Calendar className="h-4 w-4" />
                                <span className="font-mono">Deadline: {projeto.deadline}</span>
                            </div>
                            {/* Simulated Health - randomly assigned if not in mock yet, or assume mock updated */}
                            <div className="flex items-center gap-2 text-sm font-medium">
                                {getHealthIcon(projeto.progresso > 50 ? 'on_track' : 'at_risk')}
                                <span className="capitalize">{projeto.progresso > 50 ? 'On Track' : 'At Risk'}</span>
                            </div>
                        </div>
                        <Button variant="outline" className="w-full">
                            Ver Detalhes
                        </Button>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
