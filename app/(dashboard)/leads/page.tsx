import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Database, Upload } from "lucide-react";
import { mockLeads } from "@/lib/mock-data";

function getStatusColor(status: string) {
    switch (status) {
        case "novo": return "bg-blue-500/20 text-blue-500 border-blue-500/50";
        case "qualificando": return "bg-yellow-500/20 text-yellow-500 border-yellow-500/50";
        case "arquivado": return "bg-gray-500/20 text-gray-500 border-gray-500/50";
        default: return "bg-gray-500/20 text-gray-500";
    }
}

export default function LeadsPage() {
    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="space-y-2">
                    <h1 className="text-display-xl font-sans text-text-primary">Banco de Leads</h1>
                    <p className="text-text-secondary font-mono">Repositório geral de contatos</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline">
                        <Upload className="mr-2 h-4 w-4" /> Importar
                    </Button>
                    <Button>
                        <Plus className="mr-2 h-4 w-4" /> Novo Lead
                    </Button>
                </div>
            </div>

            {/* Filters */}
            <Card>
                <CardContent className="pt-6">
                    <div className="flex gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-3 h-4 w-4 text-text-secondary" />
                            <Input placeholder="Buscar leads..." className="pl-9" />
                        </div>
                        <Select defaultValue="todos">
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="todos">Todos</SelectItem>
                                <SelectItem value="novo">Novo</SelectItem>
                                <SelectItem value="qualificando">Qualificando</SelectItem>
                                <SelectItem value="arquivado">Arquivado</SelectItem>
                            </SelectContent>
                        </Select>
                        <Select defaultValue="todos">
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Origem" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="todos">Todas</SelectItem>
                                <SelectItem value="linkedin">LinkedIn</SelectItem>
                                <SelectItem value="site">Site</SelectItem>
                                <SelectItem value="indicacao">Indicação</SelectItem>
                                <SelectItem value="instagram">Instagram</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            {/* Table */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Database className="h-5 w-5 text-text-secondary" />
                        Todos os Leads
                    </CardTitle>
                    <CardDescription>{mockLeads.length} leads encontrados</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Nome</TableHead>
                                <TableHead>Empresa</TableHead>
                                <TableHead>Contato</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Origem</TableHead>
                                <TableHead className="text-right">Ações</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {mockLeads.map((lead) => (
                                <TableRow key={lead.id}>
                                    <TableCell className="font-medium">{lead.nome}</TableCell>
                                    <TableCell>{lead.empresa}</TableCell>
                                    <TableCell>
                                        <div className="flex flex-col text-xs text-text-secondary">
                                            <span>{lead.email}</span>
                                            <span>{lead.telefone}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline" className={getStatusColor(lead.status)}>
                                            {lead.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="capitalize">{lead.origem}</TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="ghost" size="sm">Ver</Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
