import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, ExternalLink } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { ProfileCardActions } from "@/components/colaboradores/profile-card-actions";

function getCategoriaColor(role: string | null) {
    switch (role) {
        case "admin":
            return "bg-red-500/20 text-red-500 border-red-500/50";
        case "manager":
            return "bg-purple-500/20 text-purple-500 border-purple-500/50";
        case "sales":
            return "bg-green-500/20 text-green-500 border-green-500/50";
        default:
            return "bg-blue-500/20 text-blue-500 border-blue-500/50";
    }
}

function getRoleLabel(role: string | null) {
    const labels: Record<string, string> = {
        admin: "Administrador",
        manager: "Gerente",
        sales: "Vendas",
        member: "Membro",
    };
    return labels[role || "member"] || role || "Membro";
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
                    <p className="text-text-secondary font-mono">Gestão da equipe e permissões</p>
                </div>
                <Link href="https://supabase.com/dashboard/project/_/auth/users" target="_blank">
                    <Button variant="outline">
                        <ExternalLink className="mr-2 h-4 w-4" /> Gerenciar Convites (Supabase)
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
                                    <TableCell className="font-medium">
                                        <div className="flex items-center gap-3">
                                            {colaborador.avatar_url && (
                                                <img
                                                    src={colaborador.avatar_url}
                                                    alt={colaborador.full_name || ""}
                                                    className="w-8 h-8 rounded-full object-cover"
                                                />
                                            )}
                                            <span>{colaborador.full_name || '—'}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="font-mono text-sm">{colaborador.email}</TableCell>
                                    <TableCell>{colaborador.department || '—'}</TableCell>
                                    <TableCell>
                                        <Badge variant="outline" className={getCategoriaColor(colaborador.role)}>
                                            {getRoleLabel(colaborador.role)}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <ProfileCardActions profile={colaborador} />
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

