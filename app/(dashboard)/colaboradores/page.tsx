import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus } from "lucide-react";
import Link from "next/link";

// Mock data para demonstração
const colaboradores = [
    { id: 1, nome: "João Silva", email: "joao@vismo.com", telefone: "(11) 99999-9999", categoria: "fixo" },
    { id: 2, nome: "Maria Santos", email: "maria@vismo.com", telefone: "(11) 98888-8888", categoria: "fixo" },
    { id: 3, nome: "Pedro Costa", email: "pedro@vismo.com", telefone: "(11) 97777-7777", categoria: "freela" },
];

function getCategoriaColor(categoria: string) {
    return categoria === "fixo"
        ? "bg-green-500/20 text-green-500 border-green-500/50"
        : "bg-blue-500/20 text-blue-500 border-blue-500/50";
}

export default function ColaboradoresPage() {
    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="space-y-2">
                    <h1 className="text-display-xl font-sans text-text-primary">Colaboradores</h1>
                    <p className="text-text-secondary font-mono">Gestão da equipe</p>
                </div>
                <Link href="/colaboradores/novo">
                    <Button>
                        <Plus className="mr-2 h-4 w-4" /> Novo Colaborador
                    </Button>
                </Link>
            </div>

            {/* Table */}
            <Card>
                <CardHeader>
                    <CardTitle>Lista de Colaboradores</CardTitle>
                    <CardDescription>{colaboradores.length} colaboradores cadastrados</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Nome</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Telefone</TableHead>
                                <TableHead>Categoria</TableHead>
                                <TableHead className="text-right">Ações</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {colaboradores.map((colaborador) => (
                                <TableRow key={colaborador.id}>
                                    <TableCell className="font-medium">{colaborador.nome}</TableCell>
                                    <TableCell className="font-mono text-sm">{colaborador.email}</TableCell>
                                    <TableCell className="font-mono text-sm">{colaborador.telefone}</TableCell>
                                    <TableCell>
                                        <Badge variant="outline" className={getCategoriaColor(colaborador.categoria)}>
                                            {colaborador.categoria}
                                        </Badge>
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
