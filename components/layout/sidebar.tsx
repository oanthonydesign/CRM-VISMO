import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { LayoutDashboard, Users, Settings, PieChart, Box, Target, Database } from "lucide-react";
import { LogoCrm } from "@/components/svgs/LogoCrm";

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> { }

export function Sidebar({ className }: SidebarProps) {
    return (
        <div className={cn("pb-12 w-64 border-r border-utility-border-subtle bg-background-surface h-screen fixed left-0 top-0 hidden md:block", className)}>
            <div className="space-y-4 py-4">
                <div className="px-6 py-2">
                    <div className="mb-2 px-2">
                        <LogoCrm className="h-6 w-auto" />
                    </div>
                    <p className="px-2 text-xs text-text-secondary font-mono">v1.1.0 MAINFRAME</p>
                </div>
                <div className="px-3 py-2">
                    <div className="space-y-1">
                        <Link href="/hq">
                            <Button variant="ghost" className="w-full justify-start font-mono-sm">
                                <LayoutDashboard className="mr-2 h-4 w-4" />
                                HQ
                            </Button>
                        </Link>
                        <Link href="/oportunidades">
                            <Button variant="ghost" className="w-full justify-start font-mono-sm">
                                <Box className="mr-2 h-4 w-4" />
                                Oportunidades
                            </Button>
                        </Link>
                        <Link href="/projetos">
                            <Button variant="ghost" className="w-full justify-start font-mono-sm">
                                <PieChart className="mr-2 h-4 w-4" />
                                Projetos
                            </Button>
                        </Link>
                        <Link href="/empresas">
                            <Button variant="ghost" className="w-full justify-start font-mono-sm">
                                <Users className="mr-2 h-4 w-4" />
                                Empresas
                            </Button>
                        </Link>
                        <Link href="/leads">
                            <Button variant="ghost" className="w-full justify-start font-mono-sm">
                                <Database className="mr-2 h-4 w-4" />
                                Leads
                            </Button>
                        </Link>
                        <Link href="/equipe">
                            <Button variant="ghost" className="w-full justify-start font-mono-sm">
                                <Users className="mr-2 h-4 w-4" />
                                Equipe
                            </Button>
                        </Link>
                        <Link href="/financeiro">
                            <Button variant="ghost" className="w-full justify-start font-mono-sm">
                                <Settings className="mr-2 h-4 w-4" />
                                Financeiro
                            </Button>
                        </Link>
                    </div>
                </div>
                <div className="px-6 py-2 mt-auto absolute bottom-4 w-full">
                    <div className="rounded-md border border-utility-border-subtle bg-background-card p-4">
                        <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-full bg-brand-primary/20 flex items-center justify-center text-brand-primary font-bold text-xs">
                                JS
                            </div>
                            <div>
                                <p className="text-sm font-medium text-text-primary">John Snow</p>
                                <p className="text-xs text-text-secondary">Admin</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
