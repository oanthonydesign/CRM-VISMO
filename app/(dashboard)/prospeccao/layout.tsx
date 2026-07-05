import { ProspeccaoNav } from "@/components/prospeccao/prospeccao-nav";

export default function ProspeccaoLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <h1 className="text-display-xl font-sans text-text-primary">Prospecção</h1>
                <p className="text-text-secondary font-mono">
                    Mapeamento, abordagem e playbook das suas prospecções
                </p>
            </div>
            <ProspeccaoNav />
            {children}
        </div>
    );
}
