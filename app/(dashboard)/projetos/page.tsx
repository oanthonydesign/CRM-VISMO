import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProjectPortfolio } from "@/components/features/projects/ProjectPortfolio";
import { ProjectBoard } from "@/components/features/projects/ProjectBoard";
import { ProjectTimeline } from "@/components/features/projects/ProjectTimeline";

export default function ProjetosPage() {
    return (
        <div className="space-y-8 h-full flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between flex-shrink-0">
                <div className="space-y-2">
                    <h1 className="text-display-xl font-sans text-text-primary">Projetos</h1>
                    <p className="text-text-secondary font-mono">Gestão de entregas e tarefas</p>
                </div>
                <Button>
                    <Plus className="mr-2 h-4 w-4" /> Novo Projeto
                </Button>
            </div>

            <Tabs defaultValue="portfolio" className="flex-1 flex flex-col space-y-6">
                <div className="flex items-center justify-between">
                    <TabsList>
                        <TabsTrigger value="portfolio">Portfólio</TabsTrigger>
                        <TabsTrigger value="board">Board</TabsTrigger>
                        <TabsTrigger value="timeline">Timeline</TabsTrigger>
                    </TabsList>
                </div>

                <TabsContent value="portfolio" className="flex-1">
                    <ProjectPortfolio />
                </TabsContent>

                <TabsContent value="board" className="flex-1 h-full">
                    <ProjectBoard />
                </TabsContent>

                <TabsContent value="timeline" className="flex-1">
                    <ProjectTimeline />
                </TabsContent>
            </Tabs>
        </div>
    );
}
