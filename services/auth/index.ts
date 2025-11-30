import { createClient } from "@/lib/supabase/client";

export const authService = {
    async signInWithEmail(email: string) {
        const supabase = createClient();
        return supabase.auth.signInWithOtp({ email });
    },

    async signOut() {
        const supabase = createClient();
        return supabase.auth.signOut();
    },

    async getUser() {
        const supabase = createClient();
        return supabase.auth.getUser();
    }
};
