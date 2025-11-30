import { Sidebar } from "@/components/layout/sidebar";
import { Navbar } from "@/components/layout/navbar";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect('/login');
    }

    // Fetch profile data
    const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

    // Combine auth user and profile data
    const userData = {
        email: user.email,
        full_name: profile?.full_name,
        avatar_url: profile?.avatar_url,
        role: profile?.role
    };

    return (
        <div className="min-h-screen bg-background-default">
            <Sidebar user={userData} />
            <div className="md:ml-64">
                <Navbar />
                <main className="px-6 md:px-8 pt-24 pb-6 md:pb-8">
                    {children}
                </main>
            </div>
        </div>
    );
}
