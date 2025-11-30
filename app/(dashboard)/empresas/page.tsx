import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Plus, Search } from "lucide-react";
import { createClient } from "@/lib/supabase/server";

function getTipoColor(tipo: string) {
    switch (tipo) {
        case "cliente": return "bg-green-500/20 text-green-500 border-green-500/50";
        case "ex-cliente": return "bg-gray-500/20 text-gray-500 border-gray-500/50";
        default: return "bg-gray-500/20 text-gray-500";
    }
}

export default async function EmpresasPage() {
    const supabase = await createClient();

    // Buscar empresas do banco
    const { data: empresas, error } = await supabase
        .from('empresas')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Erro ao buscar empresas:', error);
    }

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="space-y-2">
                    <h1 className="text-display-xl font-sans text-text-primary">Empresas</h1>
                    <p className="text-text-secondary font-mono">Gestão de clientes</p>
                </div>
                <Button>
                    <Plus className="mr-2 h-4 w-4" /> Nova Empresa
                </Button>
            </div>

            {/* Filters */}
            <Card>
                <CardContent className="pt-6">
                    <div className="flex gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-3 h-4 w-4 text-text-secondary" />
                            <Input placeholder="Buscar empresa..." className="pl-9" />
                        </div>
                        <Select defaultValue="todos">
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Tipo" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="todos">Todos</SelectItem>
                                <SelectItem value="cliente">Cliente</SelectItem>
                                <SelectItem value="ex-cliente">Ex-Cliente</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            {/* Table */}
            <Card>
                <CardHeader>
                    <CardTitle>Lista de Empresas</CardTitle>
                    <CardDescription>
                        {empresas?.length || 0} empresas cadastradas
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {empresas && empresas.length > 0 ? (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Nome</TableHead>
                                    <TableHead>Tipo</TableHead>
                                    <TableHead>Cidade</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Ações</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {empresas.map((empresa) => (
                                    <TableRow key={empresa.id}>
                                        <TableCell className="font-medium">
                                            <div>
                                                <div>{empresa.nome}</div>
                                                {empresa.nome_fantasia && (
                                                    <div className="text-xs text-text-secondary">{empresa.nome_fantasia}</div>
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className={getTipoColor(empresa.tipo)}>
                                                {empresa.tipo}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="font-mono">
                                            {empresa.cidade || '—'}
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant={empresa.status === 'ativo' ? 'default' : 'secondary'}>
                                                {empresa.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button variant="ghost" size="sm">Ver</Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    ) : (
                        <div className="text-center py-12 text-text-secondary">
                            <p>Nenhuma empresa cadastrada ainda.</p>
                            <p className="text-sm mt-2">Clique em "Nova Empresa" para começar.</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
