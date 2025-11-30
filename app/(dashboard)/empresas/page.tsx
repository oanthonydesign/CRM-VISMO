import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Plus, Search } from "lucide-react";
import { mockEmpresas } from "@/lib/mock-data";

function getTipoColor(tipo: string) {
    switch (tipo) {
        case "cliente": return "bg-green-500/20 text-green-500 border-green-500/50";
        case "lead": return "bg-blue-500/20 text-blue-500 border-blue-500/50";
        case "ex-cliente": return "bg-gray-500/20 text-gray-500 border-gray-500/50";
        default: return "bg-gray-500/20 text-gray-500";
    }
}

export default function EmpresasPage() {
    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="space-y-2">
                    <h1 className="text-display-xl font-sans text-text-primary">Empresas</h1>
                    <p className="text-text-secondary font-mono">Gestão de clientes e leads</p>
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
                                <SelectItem value="lead">Lead</SelectItem>
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
                    <CardDescription>{mockEmpresas.length} empresas cadastradas</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Nome</TableHead>
                                <TableHead>Tipo</TableHead>
                                <TableHead>Contatos</TableHead>
                                <TableHead>Valor Total</TableHead>
                                <TableHead className="text-right">Ações</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {mockEmpresas.map((empresa) => (
                                <TableRow key={empresa.id}>
                                    <TableCell className="font-medium">{empresa.nome}</TableCell>
                                    <TableCell>
                                        <Badge variant="outline" className={getTipoColor(empresa.tipo)}>
                                            {empresa.tipo}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="font-mono">{empresa.contatos}</TableCell>
                                    <TableCell className="font-mono">
                                        {empresa.valorTotal > 0 ? `R$ ${empresa.valorTotal.toLocaleString('pt-BR')}` : '—'}
                                    </TableCell>
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
