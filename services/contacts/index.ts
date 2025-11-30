import { createClient } from "@/lib/supabase/client";

export interface Contact {
    id: string;
    name: string;
    email: string;
    phone?: string;
    company?: string;
}

export const contactsService = {
    async getContacts() {
        const supabase = createClient();
        // Placeholder: Replace with actual table query
        // const { data, error } = await supabase.from('contacts').select('*');
        // return { data, error };
        return { data: [], error: null };
    },

    async createContact(contact: Omit<Contact, 'id'>) {
        const supabase = createClient();
        // const { data, error } = await supabase.from('contacts').insert(contact).selectSingle();
        // return { data, error };
        return { data: null, error: null };
    }
};
