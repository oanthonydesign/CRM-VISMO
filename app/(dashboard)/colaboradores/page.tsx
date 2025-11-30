import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

function getCategoriaColor(role: string) {
    return role === "admin"
        ? "bg-green-500/20 text-green-500 border-green-500/50"
        : "bg-blue-500/20 text-blue-500 border-blue-500/50";
}

export default async function ColaboradoresPage() {
    const supabase = await createClient();

    const { data: colaboradores } = await supabase
        .from('profiles')
        .select('*')
        .order('full_name', { ascending: true });

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
                    <CardDescription>{colaboradores?.length || 0} colaboradores cadastrados</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Nome</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Departamento</TableHead>
                                <TableHead>Função</TableHead>
                                <TableHead className="text-right">Ações</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {colaboradores?.map((colaborador) => (
                                <TableRow key={colaborador.id}>
                                    <TableCell className="font-medium">{colaborador.full_name || '—'}</TableCell>
                                    <TableCell className="font-mono text-sm">{colaborador.email}</TableCell>
                                    <TableCell>{colaborador.department || '—'}</TableCell>
                                    <TableCell>
                                        <Badge variant="outline" className={getCategoriaColor(colaborador.role)}>
                                            {colaborador.role}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="ghost" size="sm">Ver</Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {(!colaboradores || colaboradores.length === 0) && (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center py-8 text-text-secondary">
                                        Nenhum colaborador cadastrado.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}

