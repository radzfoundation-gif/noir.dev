import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY
);

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,DELETE,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    const { id } = req.query;

    if (req.method === 'DELETE') {
        console.log(`[Waitlist Delete] Attempting to delete user ID: ${id}`);

        const { error, data } = await supabase
            .from('waitlist')
            .delete()
            .eq('id', id)
            .select();

        if (error) {
            console.error("[Waitlist Delete] Supabase Error:", error);
            return res.status(500).json({ error: error.message });
        }

        console.log(`[Waitlist Delete] Successfully deleted user: ${data?.[0]?.email || id}`);
        return res.json({ success: true, deletedCount: data?.length || 0 });
    }

    return res.status(405).json({ error: 'Method not allowed' });
}
