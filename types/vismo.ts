export type Status = 'todo' | 'in_progress' | 'review' | 'done';
export type Priority = 'low' | 'medium' | 'high' | 'urgent';
export type ProjectHealth = 'on_track' | 'at_risk' | 'off_track';

export interface Task {
    id: string;
    title: string;
    description?: string;
    status: Status;
    priority: Priority;
    projectId: string;
    assigneeId?: string;
    dueDate?: string;
    createdAt: string;
}

export interface ProjectUpdate {
    id: string;
    projectId: string;
    authorId: string;
    content: string;
    health: ProjectHealth;
    createdAt: string;
}

export interface TeamMember {
    id: string;
    name: string;
    role: 'admin' | 'member';
    department: string;
    avatarUrl?: string;
    activeProjectsCount: number;
}

// Re-export existing types or extend them
export interface Project {
    id: string;
    name: string;
    status: string; // planning, design, development, qa, delivered, maintenance
    health: ProjectHealth;
    progress: number; // 0-100
    deadline: string;
    ownerId: string;
}
