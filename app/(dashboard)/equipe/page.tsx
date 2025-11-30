import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Grid, Col } from "@/components/layout/grid";
import { Mail, Phone, Briefcase } from "lucide-react";
import { createClient } from "@/lib/supabase/server";

export default async function EquipePage() {
    const supabase = await createClient();

    // Buscar perfis
    const { data: profiles } = await supabase
        .from('profiles')
        .select(`
            *,
            projetos:projetos(count)
        `)
        .eq('projetos.status', 'execucao'); // Filtrar apenas projetos em execução para a contagem (opcional, mas o count direto não suporta filtro aninhado facilmente assim no select simples, faremos diferente)

    // Melhor abordagem para count com filtro seria uma query separada ou rpc, mas para simplificar vamos pegar todos os profiles e depois podemos ajustar a contagem se necessário.
    // O Supabase join count é simples: projetos(count) retorna total de projetos.

    const { data: teamMembers } = await supabase
        .from('profiles')
        .select(`
            *,
            projetos:projetos(count)
        `)
        .order('full_name', { ascending: true });

    const getInitials = (name: string) => {
        if (!name) return "U";
        return name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2);
    };

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="space-y-2">
                <h1 className="text-display-xl font-sans text-text-primary">Equipe</h1>
                <p className="text-text-secondary font-mono">Diretório de colaboradores</p>
            </div>

            {/* Team Grid */}
            <Grid cols={3}>
                {teamMembers?.map((member) => (
                    <Col key={member.id} span={1}>
                        <Card className="hover:border-utility-border-strong transition-colors">
                            <CardHeader className="flex flex-row items-center gap-4 pb-2">
                                <Avatar className="h-12 w-12">
                                    <AvatarImage src={member.avatar_url} alt={member.full_name} />
                                    <AvatarFallback className="bg-brand-primary/10 text-brand-primary font-medium">
                                        {getInitials(member.full_name)}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="space-y-1">
                                    <CardTitle className="text-base">{member.full_name}</CardTitle>
                                    <CardDescription className="flex items-center gap-2">
                                        <Badge variant="secondary" className="text-[10px] h-5 px-1.5 font-normal">
                                            {member.department || 'Geral'}
                                        </Badge>
                                        {member.role === 'admin' && (
                                            <Badge variant="outline" className="text-[10px] h-5 px-1.5 border-brand-primary/50 text-brand-primary">
                                                Admin
                                            </Badge>
                                        )}
                                    </CardDescription>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4 pt-2">
                                <div className="grid gap-2 text-sm">
                                    <div className="flex items-center gap-2 text-text-secondary">
                                        <Mail className="h-4 w-4" />
                                        <span className="truncate">{member.email}</span>
                                    </div>
                                    {/* Phone is not in profile schema yet, placeholder or remove */}
                                    {/* <div className="flex items-center gap-2 text-text-secondary">
                                        <Phone className="h-4 w-4" />
                                        <span>+55 11 99999-9999</span>
                                    </div> */}
                                </div>

                                <div className="pt-4 border-t border-utility-border-subtle">
                                    <div className="flex items-center justify-between text-sm">
                                        <div className="flex items-center gap-2 text-text-primary">
                                            <Briefcase className="h-4 w-4 text-text-secondary" />
                                            <span className="font-medium">{member.projetos?.[0]?.count || 0}</span>
                                            <span className="text-text-secondary">Projetos (Owner)</span>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </Col>
                ))}
            </Grid>
        </div>
    );
}

