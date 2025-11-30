import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Search, Database } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { LeadPageHeader } from "@/components/leads/lead-page-header";
import { LeadTableActions } from "@/components/leads/lead-table-actions";

function getStatusColor(status: string) {
    switch (status) {
        case "novo": return "bg-blue-500/20 text-blue-500 border-blue-500/50";
        case "qualificando": return "bg-yellow-500/20 text-yellow-500 border-yellow-500/50";
        case "arquivado": return "bg-gray-500/20 text-gray-500 border-gray-500/50";
        default: return "bg-gray-500/20 text-gray-500";
    }
}


export default async function LeadsPage() {
    const supabase = await createClient();

    // Buscar leads (prospecções) do banco
    const { data: leads, error } = await supabase
        .from('prospeccoes')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Erro ao buscar leads:', error);
    }

    return (
        <div className="space-y-8">
            {/* Header */}
            <LeadPageHeader />

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
                    <CardDescription>{leads?.length || 0} leads encontrados</CardDescription>
                </CardHeader>
                <CardContent>
                    {leads && leads.length > 0 ? (
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
                                {leads.map((lead) => (
                                    <TableRow key={lead.id}>
                                        <TableCell className="font-medium">{lead.nome}</TableCell>
                                        <TableCell>{lead.empresa || '—'}</TableCell>
                                        <TableCell>
                                            <div className="flex flex-col text-xs text-text-secondary">
                                                <span>{lead.email || '—'}</span>
                                                <span>{lead.telefone || '—'}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className={getStatusColor(lead.status)}>
                                                {lead.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="capitalize">{lead.origem || '—'}</TableCell>
                                        <TableCell className="text-right">
                                            <LeadTableActions lead={lead} />
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    ) : (
                        <div className="text-center py-12 text-text-secondary">
                            <p>Nenhum lead cadastrado ainda.</p>
                            <p className="text-sm mt-2">Clique em "Novo Lead" para começar.</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}


