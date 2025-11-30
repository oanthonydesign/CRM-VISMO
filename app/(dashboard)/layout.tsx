import { Sidebar } from "@/components/layout/sidebar";
import { Navbar } from "@/components/layout/navbar";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-background-default">
            <Sidebar />
            <div className="md:ml-64">
                <Navbar />
                <main className="px-6 md:px-8 pt-24 pb-6 md:pb-8">
                    {children}
                </main>
            </div>
        </div>
    );
}
