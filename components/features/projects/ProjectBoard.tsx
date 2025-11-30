import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const columns = [
    { id: "todo", label: "A Fazer" },
    { id: "in_progress", label: "Em Progresso" },
    { id: "review", label: "Revisão" },
    { id: "done", label: "Concluído" },
];

export function ProjectBoard({ projetos }: { projetos: any[] }) {
    // Flatten tasks from all projects
    const allTasks = projetos?.flatMap(p => p.tasks || []) || [];

    const getTasksByStatus = (status: string) => {
        return allTasks.filter(task => task.status === status);
    };

    const getInitials = (name: string) => {
        if (!name) return "ID";
        return name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2);
    };

    return (
        <div className="flex gap-4 overflow-x-auto pb-4 h-[calc(100vh-240px)]">
            {columns.map((col) => (
                <div key={col.id} className="flex-shrink-0 w-80 flex flex-col gap-4">
                    <div className="flex items-center justify-between px-2">
                        <h3 className="font-semibold text-text-primary">{col.label}</h3>
                        <Badge variant="secondary" className="rounded-full">
                            {getTasksByStatus(col.id).length}
                        </Badge>
                    </div>
                    <div className="flex-1 bg-background-surface/50 rounded-lg p-2 space-y-3 overflow-y-auto">
                        {getTasksByStatus(col.id).map((task) => (
                            <Card key={task.id} className="cursor-pointer hover:border-utility-border-strong transition-colors">
                                <CardContent className="p-4 space-y-3">
                                    <div className="flex justify-between items-start gap-2">
                                        <p className="text-sm font-medium text-text-primary leading-tight">
                                            {task.title}
                                        </p>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <Badge variant="outline" className="text-[10px] h-5 px-1.5 uppercase">
                                            {task.priority || 'normal'}
                                        </Badge>
                                        <Avatar className="h-6 w-6">
                                            <AvatarFallback className="text-[10px] bg-brand-primary/10 text-brand-primary">
                                                {getInitials(task.assignee?.full_name)}
                                            </AvatarFallback>
                                        </Avatar>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}
