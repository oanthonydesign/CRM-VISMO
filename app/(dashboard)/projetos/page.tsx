import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProjectPortfolio } from "@/components/features/projects/ProjectPortfolio";
import { ProjectBoard } from "@/components/features/projects/ProjectBoard";
import { ProjectTimeline } from "@/components/features/projects/ProjectTimeline";
import { createClient } from "@/lib/supabase/server";
import { ProjectPageHeader } from "@/components/projetos/project-page-header";

export default async function ProjetosPage() {
    const supabase = await createClient();

    // Buscar projetos do banco
    const { data: projetos, error } = await supabase
        .from('projects')
        .select(`
            *,
            empresa:empresas(nome),
            owner:profiles(full_name),
            tasks(
                id, 
                title, 
                status, 
                priority, 
                assignee_id
            )
        `)
        .order('deadline', { ascending: true });

    if (error) {
        console.error('Erro ao buscar projetos:', error);
    }

    return (
        <div className="space-y-8 h-full flex flex-col">
            {/* Header */}
            <ProjectPageHeader />

            <Tabs defaultValue="portfolio" className="flex-1 flex flex-col space-y-6">
                <div className="flex items-center justify-between">
                    <TabsList>
                        <TabsTrigger value="portfolio">Portfólio</TabsTrigger>
                        <TabsTrigger value="board">Board</TabsTrigger>
                        <TabsTrigger value="timeline">Timeline</TabsTrigger>
                    </TabsList>
                </div>

                <TabsContent value="portfolio" className="flex-1">
                    <ProjectPortfolio projetos={projetos || []} />
                </TabsContent>

                <TabsContent value="board" className="flex-1 h-full">
                    <ProjectBoard projetos={projetos || []} />
                </TabsContent>

                <TabsContent value="timeline" className="flex-1">
                    <ProjectTimeline projetos={projetos || []} />
                </TabsContent>
            </Tabs>
        </div>
    );
}
