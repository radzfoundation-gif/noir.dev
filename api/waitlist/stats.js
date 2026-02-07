import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY
);

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    const { count: total } = await supabase.from('waitlist').select('*', { count: 'exact', head: true });
    const { count: pending } = await supabase.from('waitlist').select('*', { count: 'exact', head: true }).eq('status', 'pending');
    const { count: invited } = await supabase.from('waitlist').select('*', { count: 'exact', head: true }).eq('status', 'invited');

    res.json({
        total: total || 0,
        pending: pending || 0,
        invited: invited || 0
    });
}
