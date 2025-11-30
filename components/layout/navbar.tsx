import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Bell, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface NavbarProps extends React.HTMLAttributes<HTMLDivElement> { }

export function Navbar({ className }: NavbarProps) {
    return (
        <div className={cn("h-16 border-b border-utility-border-subtle bg-background-default/80 backdrop-blur-md fixed top-0 right-0 left-0 md:left-64 z-40 px-6 flex items-center justify-between", className)}>
            <div className="flex items-center gap-4">
                {/* Breadcrumbs placeholder */}
                <div className="flex items-center text-sm text-text-secondary font-mono">
                    <span className="hover:text-text-primary cursor-pointer">Home</span>
                    <span className="mx-2">/</span>
                    <span className="text-text-primary">Dashboard</span>
                </div>
            </div>

            <div className="flex items-center gap-4">
                <div className="relative w-64 hidden md:block">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-text-secondary" />
                    <Input placeholder="Buscar..." className="pl-8 bg-background-surface border-none focus-visible:ring-1 focus-visible:ring-utility-border-strong" />
                </div>
                {/* Notification - Admin Only */}
                <Button variant="ghost" size="icon" className="rounded-full relative">
                    <Bell className="h-5 w-5 text-text-secondary" />
                    <span className="absolute top-2 right-2 h-2 w-2 bg-brand-primary rounded-full" />
                </Button>
            </div>
        </div>
    );
}
