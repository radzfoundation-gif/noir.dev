import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY
);

export default async function handler(req, res) {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { name, email } = req.body;
    if (!email) return res.status(400).json({ error: 'Email is required' });

    const newUser = {
        name: name || 'Anonymous',
        email,
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        status: 'pending',
        score: Math.floor(Math.random() * 100),
        source: req.headers.referer || 'Direct'
    };

    console.log(`[Waitlist Join] Attempting to join: ${email}`);

    const { data, error } = await supabase
        .from('waitlist')
        .insert([newUser])
        .select();

    if (error) {
        console.error("[Waitlist Join] Supabase Insert Error:", error);
        if (error.code === '23505') {
            return res.status(400).json({ error: "Email ini sudah terdaftar dalam waitlist!" });
        }
        return res.status(500).json({
            error: "Gagal menyimpan data ke database",
            details: error.message,
            code: error.code
        });
    }

    const insertedUser = (data && data.length > 0) ? data[0] : { ...newUser, id: 'temp-id' };

    // Send confirmation email via Resend (Non-blocking)
    try {
        const resendApiKey = process.env.RESEND_API_KEY;
        if (resendApiKey) {
            await fetch("https://api.resend.com/emails", {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${resendApiKey}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    from: "Noir <onboarding@resend.dev>",
                    to: email,
                    subject: "Welcome to the Waitlist!",
                    html: `
                        <div style="font-family: sans-serif; background: #000; color: #fff; padding: 40px; border-radius: 12px; max-width: 600px; margin: auto; border: 1px solid #333;">
                            <h1 style="color: #a3e635; margin-bottom: 24px;">You're on the list!</h1>
                            <p style="font-size: 16px; line-height: 1.6;">Hi ${name || 'there'},</p>
                            <p style="font-size: 16px; line-height: 1.6;">Thanks for joining the Noir waitlist. We're building the future of AI-powered web development, and we're excited to have you with us.</p>
                            <p style="font-size: 16px; line-height: 1.6;">We'll notify you as soon as your access is ready. In the meantime, follow us for updates!</p>
                            <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #333; font-size: 12px; color: #666;">
                                © 2026 Noir Code
                            </div>
                        </div>
                    `
                })
            });
        }
    } catch (emailErr) {
        console.error("[Email] Error:", emailErr.message);
    }

    return res.json({ success: true, user: insertedUser });
}
