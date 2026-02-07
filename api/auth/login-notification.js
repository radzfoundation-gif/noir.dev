export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { email, name } = req.body;

    if (!email) return res.status(400).json({ error: 'Email is required' });

    console.log(`[Login Notification] Sending login email to: ${email}`);

    try {
        const resendApiKey = process.env.RESEND_API_KEY;

        if (!resendApiKey) {
            console.error("[Login Notification] RESEND_API_KEY not found");
            return res.status(500).json({ error: 'Email service not configured' });
        }

        const loginTime = new Date().toLocaleString('id-ID', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });

        const emailResponse = await fetch("https://api.resend.com/emails", {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${resendApiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                from: "Noir <onboarding@resend.dev>",
                to: email,
                subject: "🔐 Login Notification - Noir Code",
                html: `
                    <div style="font-family: sans-serif; background: #000; color: #fff; padding: 40px; border-radius: 12px; max-width: 600px; margin: auto; border: 1px solid #333;">
                        <div style="text-align: center; margin-bottom: 30px;">
                            <h1 style="color: #a3e635; margin: 0; font-size: 28px;">Noir Code</h1>
                        </div>
                        
                        <h2 style="color: #fff; margin-bottom: 20px;">Login Berhasil!</h2>
                        
                        <p style="font-size: 16px; line-height: 1.6;">Halo ${name || 'Pengguna Noir'},</p>
                        
                        <p style="font-size: 16px; line-height: 1.6;">Kami mendeteksi login baru ke akun Anda.</p>
                        
                        <div style="background: #171717; padding: 20px; border-radius: 8px; margin: 24px 0; border: 1px solid #333;">
                            <p style="margin: 0 0 10px 0; color: #888; font-size: 14px;">Detail Login:</p>
                            <p style="margin: 5px 0; font-size: 14px;"><strong>Waktu:</strong> ${loginTime}</p>
                            <p style="margin: 5px 0; font-size: 14px;"><strong>Email:</strong> ${email}</p>
                        </div>
                        
                        <p style="font-size: 14px; line-height: 1.6; color: #888;">
                            Jika ini bukan Anda, silakan segera ubah password Anda atau hubungi tim support kami.
                        </p>
                        
                        <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #333; font-size: 12px; color: #666; text-align: center;">
                            <p>© 2026 Noir Code - AI-Powered Design to Code Platform</p>
                            <p style="margin-top: 10px;">Email ini dikirim secara otomatis, mohon tidak membalas.</p>
                        </div>
                    </div>
                `
            })
        });

        const responseData = await emailResponse.json().catch(() => ({}));

        if (!emailResponse.ok) {
            console.error("[Login Notification] Resend API Error:", responseData);
            return res.status(500).json({ error: 'Failed to send email', details: responseData });
        }

        console.log("[Login Notification] Email sent successfully! ID:", responseData.id);
        res.json({ success: true, message: 'Login notification sent' });

    } catch (error) {
        console.error("[Login Notification] Error:", error.message);
        res.status(500).json({ error: 'Internal server error', message: error.message });
    }
}
