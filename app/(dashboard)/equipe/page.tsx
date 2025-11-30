import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Grid, Col } from "@/components/layout/grid";
import { mockTeamMembers } from "@/lib/mock-data";
import { Mail, Phone, Briefcase } from "lucide-react";

export default function EquipePage() {
    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="space-y-2">
                <h1 className="text-display-xl font-sans text-text-primary">Equipe</h1>
                <p className="text-text-secondary font-mono">Diretório de colaboradores</p>
            </div>

            {/* Team Grid */}
            <Grid cols={3}>
                {mockTeamMembers.map((member) => (
                    <Col key={member.id} span={1}>
                        <Card className="hover:border-utility-border-strong transition-colors">
                            <CardHeader className="flex flex-row items-center gap-4 pb-2">
                                <Avatar className="h-12 w-12">
                                    <AvatarImage src={member.avatarUrl} alt={member.name} />
                                    <AvatarFallback className="bg-brand-primary/10 text-brand-primary font-medium">
                                        {member.avatarUrl}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="space-y-1">
                                    <CardTitle className="text-base">{member.name}</CardTitle>
                                    <CardDescription className="flex items-center gap-2">
                                        <Badge variant="secondary" className="text-[10px] h-5 px-1.5 font-normal">
                                            {member.department}
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
                                        <span className="truncate">email@vismo.com</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-text-secondary">
                                        <Phone className="h-4 w-4" />
                                        <span>+55 11 99999-9999</span>
                                    </div>
                                </div>

                                <div className="pt-4 border-t border-utility-border-subtle">
                                    <div className="flex items-center justify-between text-sm">
                                        <div className="flex items-center gap-2 text-text-primary">
                                            <Briefcase className="h-4 w-4 text-text-secondary" />
                                            <span className="font-medium">{member.activeProjectsCount}</span>
                                            <span className="text-text-secondary">Projetos Ativos</span>
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
