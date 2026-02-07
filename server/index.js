import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import OpenAI from 'openai';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { Server } from 'socket.io';
import http from 'http';
import { createClient } from '@supabase/supabase-js';
// Xendit SDK will be imported dynamically below

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});
const PORT = process.env.PORT || 3001;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Supabase Initialization
const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY
);

app.use(cors());
app.use(express.json({ limit: '50mb' }));

const client = new OpenAI({
    baseURL: process.env.SUMOPOD_BASE_URL || "https://api.apifree.ai/v1",
    apiKey: process.env.SUMOPOD_API_KEY,
});

app.get('/api/health', (req, res) => {
    res.json({ status: 'ok' });
});

app.get('/api/diag', async (req, res) => {
    try {
        const { data, error, count } = await supabase
            .from('waitlist')
            .select('*', { count: 'exact', head: true });

        res.json({
            supabase: error ? 'error' : 'ok',
            count: count || 0,
            error: error || null,
            env: {
                hasUrl: !!process.env.SUPABASE_URL,
                hasKey: !!process.env.SUPABASE_ANON_KEY
            }
        });
    } catch (err) {
        res.status(500).json({ status: 'error', message: err.message });
    }
});

app.post('/api/generate-fullstack', async (req, res) => {
    const { prompt, appType, customSpec, mode = 'fullstack' } = req.body;

    try {
        console.log(`[Fullstack] Generating ${mode} app from prompt`);

        let spec;
        if (customSpec) {
            spec = customSpec;
        } else if (prompt) {
            const response = await client.chat.completions.create({
                model: 'anthropic/claude-opus-4.5',
                messages: [
                    {
                        role: 'system',
                        content: `You are an AI app architect. Analyze the user's description and create an app specification.
Output JSON format (no markdown):
{
  "type": "saas|blog|ecommerce|dashboard|portfolio|crm|chat|cms|landing|admin|ecommerce-ui|blog-ui|portfolio-ui|social",
  "name": "App Name",
  "description": "Brief description",
  "features": ["feature1", "feature2"],
  "pages": ["page1", "page2"],
  "database": "postgresql|mysql|mongodb|none",
  "auth": true|false,
  "ui": "tailwind|shadcn",
  "deployment": "vercel|netlify|none",
  "mode": "fullstack|frontend|backend-only"
}`
                    },
                    { role: 'user', content: prompt }
                ]
            });
            spec = JSON.parse(response.choices[0].message.content);
            spec.mode = mode;
        } else {
            return res.status(400).json({ error: 'Prompt or customSpec is required' });
        }

        res.setHeader('Content-Type', 'application/json');
        res.write(JSON.stringify({ status: 'analyzing', message: 'Analyzing app requirements...' }) + '\n\n');

        const fs = await import('fs');
        const generatorPath = path.join(__dirname, '../src/lib/fullstackGeneratorService.ts');
        const generator = await import(generatorPath);

        const generatorService = generator.fullstackGeneratorService;

        if (spec.mode === 'frontend') {
            spec.database = 'none';
            spec.auth = false;
        } else if (spec.mode === 'backend-only') {
            spec.features = [];
            spec.pages = [];
        }

        res.write(JSON.stringify({ status: 'generating', message: 'Generating application files...' }) + '\n\n');

        const generatedApp = await generatorService.generateApp(spec);

        res.write(JSON.stringify({ status: 'complete', spec, filesCount: Object.keys(generatedApp.frontend || {}).length + Object.keys(generatedApp.backend || {}).length }) + '\n\n');
        res.write(JSON.stringify({ data: generatedApp }) + '\n\n');

        res.end();
        console.log(`[Fullstack] Generated successfully`);

    } catch (error) {
        console.error('[Fullstack] Error:', error);
        res.write(JSON.stringify({ error: error.message }) + '\n\n');
        res.end();
    }
});

app.post('/api/generate-template', async (req, res) => {
    const { type, mode = 'fullstack', config } = req.body;

    const templates = {
        saas: {
            name: 'SaaS Application',
            type: 'saas',
            description: 'Full-featured SaaS with authentication, dashboard, and billing',
            features: ['Authentication', 'Dashboard', 'User Management', 'Settings', 'Billing', 'API Routes'],
            pages: ['Landing', 'Login', 'Register', 'Dashboard', 'Settings', 'Pricing'],
            database: 'postgresql',
            auth: true,
            ui: 'tailwind',
            deployment: 'vercel',
            mode: 'fullstack'
        },
        blog: {
            name: 'Blog Platform',
            type: 'blog',
            description: 'Content management system with posts, categories, and comments',
            features: ['Posts', 'Categories', 'Comments', 'Search', 'Tags', 'RSS Feed'],
            pages: ['Home', 'Blog', 'Post Detail', 'About', 'Contact', 'Categories'],
            database: 'postgresql',
            auth: false,
            ui: 'tailwind',
            deployment: 'vercel',
            mode: 'fullstack'
        },
        ecommerce: {
            name: 'E-commerce Store',
            type: 'ecommerce',
            description: 'Online store with products, cart, checkout, and payments',
            features: ['Products', 'Cart', 'Checkout', 'Payments', 'Orders', 'Inventory'],
            pages: ['Home', 'Shop', 'Product Detail', 'Cart', 'Checkout', 'Account'],
            database: 'postgresql',
            auth: true,
            ui: 'tailwind',
            deployment: 'vercel',
            mode: 'fullstack'
        },
        dashboard: {
            name: 'Admin Dashboard',
            type: 'dashboard',
            description: 'Analytics dashboard with charts, tables, and reports',
            features: ['Analytics', 'Charts', 'Tables', 'Reports', 'Export', 'Real-time Data'],
            pages: ['Dashboard', 'Analytics', 'Users', 'Settings', 'Reports', 'Activity'],
            database: 'postgresql',
            auth: true,
            ui: 'shadcn',
            deployment: 'vercel',
            mode: 'fullstack'
        },
        portfolio: {
            name: 'Portfolio Website',
            type: 'portfolio',
            description: 'Personal portfolio with projects, skills, and contact',
            features: ['Projects', 'Skills', 'Timeline', 'Contact Form', 'Resume', 'Testimonials'],
            pages: ['Home', 'About', 'Projects', 'Blog', 'Contact', 'Resume'],
            database: 'none',
            auth: false,
            ui: 'tailwind',
            deployment: 'netlify',
            mode: 'frontend'
        },
        crm: {
            name: 'CRM System',
            type: 'crm',
            description: 'Customer relationship management with contacts, deals, and tasks',
            features: ['Contacts', 'Deals', 'Tasks', 'Notes', 'Pipeline', 'Reports'],
            pages: ['Dashboard', 'Contacts', 'Deals', 'Tasks', 'Calendar', 'Reports'],
            database: 'postgresql',
            auth: true,
            ui: 'shadcn',
            deployment: 'vercel',
            mode: 'fullstack'
        },
        chat: {
            name: 'Chat Application',
            type: 'chat',
            description: 'Real-time messaging with channels, DMs, and notifications',
            features: ['Real-time Chat', 'Channels', 'Direct Messages', 'File Sharing', 'Notifications', 'Online Status'],
            pages: ['Login', 'Chat', 'Channels', 'Direct Messages', 'Settings', 'Profile'],
            database: 'mongodb',
            auth: true,
            ui: 'tailwind',
            deployment: 'railway',
            mode: 'fullstack'
        },
        cms: {
            name: 'Content Management',
            type: 'cms',
            description: 'Headless CMS with content types, media library, and API',
            features: ['Content Types', 'Media Library', 'API', 'Users', 'Roles', 'Versioning'],
            pages: ['Admin', 'Content', 'Media', 'Users', 'Settings', 'API Docs'],
            database: 'postgresql',
            auth: true,
            ui: 'shadcn',
            deployment: 'railway',
            mode: 'fullstack'
        },
        landing: {
            name: 'Landing Page',
            type: 'landing',
            description: 'Marketing landing page with hero, features, pricing, and CTA',
            features: ['Hero Section', 'Features Grid', 'Pricing Table', 'Testimonials', 'FAQ', 'Footer'],
            pages: ['Home'],
            database: 'none',
            auth: false,
            ui: 'tailwind',
            deployment: 'netlify',
            mode: 'frontend'
        },
        admin: {
            name: 'Admin Panel',
            type: 'admin',
            description: 'Admin dashboard with sidebar, charts, and data tables',
            features: ['Sidebar Navigation', 'Data Tables', 'Charts', 'User Management', 'Settings', 'Analytics'],
            pages: ['Dashboard', 'Users', 'Settings', 'Reports', 'Activity', 'Analytics'],
            database: 'none',
            auth: false,
            ui: 'tailwind',
            deployment: 'vercel',
            mode: 'frontend'
        },
        'ecommerce-ui': {
            name: 'E-commerce UI',
            type: 'ecommerce-ui',
            description: 'Online store UI with product grid, cart, and checkout',
            features: ['Product Grid', 'Product Detail', 'Shopping Cart', 'Checkout Form', 'User Account', 'Wishlist'],
            pages: ['Home', 'Shop', 'Product', 'Cart', 'Checkout', 'Account'],
            database: 'none',
            auth: false,
            ui: 'tailwind',
            deployment: 'vercel',
            mode: 'frontend'
        },
        'blog-ui': {
            name: 'Blog UI',
            type: 'blog-ui',
            description: 'Blog interface with posts, categories, and comments',
            features: ['Post Grid', 'Single Post', 'Categories', 'Comments', 'Author Profile', 'Newsletter'],
            pages: ['Home', 'Blog', 'Post', 'Category', 'Author', 'Contact'],
            database: 'none',
            auth: false,
            ui: 'tailwind',
            deployment: 'netlify',
            mode: 'frontend'
        },
        'portfolio-ui': {
            name: 'Portfolio',
            type: 'portfolio-ui',
            description: 'Personal portfolio with projects, skills, and contact form',
            features: ['Hero', 'Projects Gallery', 'Skills Section', 'About Me', 'Contact Form', 'Resume Download'],
            pages: ['Home', 'About', 'Projects', 'Skills', 'Contact', 'Resume'],
            database: 'none',
            auth: false,
            ui: 'tailwind',
            deployment: 'netlify',
            mode: 'frontend'
        },
        social: {
            name: 'Social Feed',
            type: 'social',
            description: 'Social media feed with posts, likes, and comments',
            features: ['Feed', 'Posts', 'Comments', 'Likes', 'User Profiles', 'Notifications'],
            pages: ['Feed', 'Profile', 'Notifications', 'Messages', 'Search', 'Settings'],
            database: 'none',
            auth: false,
            ui: 'tailwind',
            deployment: 'vercel',
            mode: 'frontend'
        }
    };

    let spec = templates[type];
    if (!spec) {
        return res.status(400).json({ error: 'Invalid template type' });
    }

    spec = { ...spec, mode };

    if (config) {
        if (config.framework) spec.framework = config.framework;
        if (config.ui) spec.ui = config.ui;
        if (config.database) spec.database = config.database;
        if (config.auth !== undefined) spec.auth = config.auth;
    }

    if (mode === 'frontend') {
        spec.database = 'none';
        spec.auth = false;
    }

    try {
        const generatorPath = path.join(__dirname, '../src/lib/fullstackGeneratorService.ts');
        const generator = await import(generatorPath);
        const generatedApp = await generator.fullstackGeneratorService.generateApp(spec);

        res.json({ success: true, spec, app: generatedApp, mode });
    } catch (error) {
        console.error('[Template] Error:', error);
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/generate', async (req, res) => {
    const { prompt, model, history, image } = req.body;

    if (!prompt && !image) return res.status(400).json({ error: 'Prompt or image is required' });

    console.log(`\n[Generate] Starting stream for model: ${model || 'auto'}`);

    // Set headers for SSE
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    try {
        const messages = [
            {
                role: "system",
                content: `You are NOIR AI, an expert web developer with vision capabilities.

WHEN YOU RECEIVE AN IMAGE:
First, analyze the image in detail:
/// ANALYSIS ///
1. Layout Structure: (describe the overall layout - header, sections, footer)
2. Color Palette: (list main colors used)
3. Typography: (describe font styles, sizes)
4. Key Components: (list buttons, cards, forms, images, etc.)
5. Style Theme: (modern, minimal, corporate, creative, etc.)
/// END ANALYSIS ///

Then generate the HTML code that replicates the design:

RULES:
1. Include <script src="https://cdn.tailwindcss.com"></script> in head
2. Replicate the EXACT layout and visual style from the image
3. Match colors as closely as possible using Tailwind classes
4. FOR IMAGES: Use 'https://image.pollinations.ai/prompt/{description}?width={w}&height={h}&nologo=true' (e.g., 'office meeting', 'modern building'). DO NOT use source.unsplash.com (it is down).
5. ALWAYS complete the full HTML from <!DOCTYPE html> to </html>
6. DO NOT output '/// END CODE ///' at the end of the response.

OUTPUT FORMAT:
/// ANALYSIS ///
[Your detailed analysis of the image]
/// END ANALYSIS ///

/// CODE ///
<!DOCTYPE html>
<html>
...complete code that matches the image...
</html>

Generate code that looks EXACTLY like the screenshot.`
            },
            ...(history || [])
        ];

        if (image) {
            messages.push({
                role: "user",
                content: [
                    { type: "text", text: prompt || "Analyze this screenshot and convert it to a responsive HTML page. First describe what you see, then generate the code." },
                    {
                        type: "image_url",
                        image_url: {
                            url: image
                        }
                    }
                ]
            });
        } else {
            messages.push({ role: "user", content: prompt });
        }

        const stream = await client.chat.completions.create({
            model: model || "openai/gpt-5",
            messages: messages,
            stream: true
        });

        for await (const chunk of stream) {
            const content = chunk.choices[0]?.delta?.content || "";
            const thinking = chunk.choices[0]?.delta?.reasoning_content || "";
            if (content || thinking) {
                res.write(`data: ${JSON.stringify({ content, thinking })}\n\n`);
            }
        }

        res.write('data: [DONE]\n\n');
        res.end();
        console.log(`[Generate] Stream completed successfully`);

    } catch (error) {
        console.error("[Generate] API Error:", error);
        res.write(`data: ${JSON.stringify({ error: error.message })}\n\n`);
        res.end();
    }
});

// Waitlist API
app.post('/api/waitlist/join', async (req, res) => {
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

    console.log(`\n[Waitlist Join] Attempting to join: ${email}`);

    const { data, error } = await supabase
        .from('waitlist')
        .insert([newUser])
        .select();

    if (error) {
        console.error("[Waitlist Join] Supabase Insert Error:", error);
        // Handle duplicate email error
        if (error.code === '23505') {
            return res.status(400).json({ error: "Email ini sudah terdaftar dalam waitlist!" });
        }
        return res.status(500).json({
            error: "Gagal menyimpan data ke database",
            details: error.message,
            code: error.code
        });
    }

    // data might be empty if there's an RLS policy preventing select() but allowing insert()
    const insertedUser = (data && data.length > 0) ? data[0] : { ...newUser, id: 'temp-id' };

    if (!data || data.length === 0) {
        console.log("[Waitlist Join] Warning: No data returned from insert(). This is likely due to Supabase RLS policies. Continuing anyway.");
    }

    // Get fresh count for real-time (Non-blocking)
    (async () => {
        try {
            const { count } = await supabase
                .from('waitlist')
                .select('*', { count: 'exact', head: true });

            io.emit('waitlistUpdated', {
                count: count || 0,
                latest: insertedUser
            });
        } catch (countErr) {
            console.error("[Waitlist Join] Real-time Count Error (Non-critical):", countErr.message);
        }
    })();

    // Send confirmation email via Resend (Non-blocking background process)
    (async () => {
        try {
            console.log(`[Email] Starting background send for: ${email}`);

            const resendApiKey = process.env.RESEND_API_KEY;
            if (!resendApiKey) {
                console.error("[Email] RESEND_API_KEY not found in environment variables");
                return;
            }

            const emailResponse = await fetch("https://api.resend.com/emails", {
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

            const responseData = await emailResponse.json().catch(() => ({}));

            if (!emailResponse.ok) {
                console.error("[Email] Resend API Error:", responseData);
            } else {
                console.log("[Email] Resend Success! ID:", responseData.id);
            }
        } catch (emailErr) {
            console.error("[Email] Background Send Error:", emailErr.message);
        }
    })();

    return res.json({ success: true, user: insertedUser });
});

app.get('/api/waitlist/stats', async (req, res) => {
    const { count: total } = await supabase.from('waitlist').select('*', { count: 'exact', head: true });
    const { count: pending } = await supabase.from('waitlist').select('*', { count: 'exact', head: true }).eq('status', 'pending');
    const { count: invited } = await supabase.from('waitlist').select('*', { count: 'exact', head: true }).eq('status', 'invited');

    res.json({
        total: total || 0,
        pending: pending || 0,
        invited: invited || 0
    });
});

app.get('/api/waitlist/users', async (req, res) => {
    const { data, error } = await supabase
        .from('waitlist')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
});

app.delete('/api/waitlist/users/:id', async (req, res) => {
    const { id } = req.params;
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

    // Notify clients about the change
    const { count } = await supabase.from('waitlist').select('*', { count: 'exact', head: true });
    io.emit('waitlistUpdated', { count: count || 0 });

    res.json({ success: true, deletedCount: data?.length || 0 });
});

// Real-time connection
io.on('connection', async (socket) => {
    console.log('Client connected for real-time updates');
    const { count } = await supabase.from('waitlist').select('*', { count: 'exact', head: true });
    socket.emit('waitlistUpdated', { count: count || 0 });
});

// Figma Import API
app.post('/api/figma/import', async (req, res) => {
    const { token, url } = req.body;

    if (!token || !url) return res.status(400).json({ error: "Missing token or URL" });

    // Parse URL for fileKey and nodeId
    // Supports: https://www.figma.com/file/KEY/... and https://www.figma.com/design/KEY/...
    const fileKeyMatch = url.match(/figma\.com\/(?:file|design)\/([a-zA-Z0-9]+)/);
    const nodeIdMatch = url.match(/[?&]node-id=([^&]+)/);

    if (!fileKeyMatch || !nodeIdMatch) {
        return res.status(400).json({ error: "Invalid Figma URL. Ensure it contains the File Key and node-id param." });
    }

    const fileKey = fileKeyMatch[1];
    const nodeId = decodeURIComponent(nodeIdMatch[1]); // e.g. 1%3A2 -> 1:2

    console.log(`[Figma Import] Key: ${fileKey}, Node: ${nodeId}`);

    try {
        const response = await fetch(`https://api.figma.com/v1/images/${fileKey}?ids=${nodeId}&scale=2&format=png`, {
            headers: { 'X-Figma-Token': token }
        });

        if (!response.ok) {
            const text = await response.text();
            console.error(`[Figma API Error] ${response.status}: ${text}`);
            return res.status(response.status).json({ error: "Failed to fetch from Figma. Check your Token." });
        }

        const data = await response.json();
        // data.images is { "1:2": "url" }
        const imageUrl = data.images[nodeId];

        if (!imageUrl) {
            return res.status(404).json({ error: "No image found for the specified Node ID." });
        }

        res.json({ url: imageUrl });

    } catch (e) {
        console.error("[Figma Import] Exception:", e);
        res.status(500).json({ error: e.message });
    }
});

// Login Notification Email API
app.post('/api/auth/login-notification', async (req, res) => {
    const { email, name } = req.body;

    if (!email) return res.status(400).json({ error: 'Email is required' });

    console.log(`\n[Login Notification] Sending login email to: ${email}`);

    try {
        const resendApiKey = process.env.RESEND_API_KEY;

        if (!resendApiKey) {
            console.error("[Login Notification] RESEND_API_KEY not found in environment variables");
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
});

// Xendit Integration - Using REST API directly
// This implementation uses Xendit's REST API instead of the SDK to avoid compatibility issues

const XENDIT_API_KEY = process.env.XENDIT_SECRET_KEY;
const XENDIT_API_URL = 'https://api.xendit.co';

const xenditApiRequest = async (endpoint, method = 'GET', data = null) => {
    const url = `${XENDIT_API_URL}${endpoint}`;
    const options = {
        method,
        headers: {
            'Authorization': `Basic ${Buffer.from(XENDIT_API_KEY + ':').toString('base64')}`,
            'Content-Type': 'application/json',
        },
    };

    if (data) {
        options.body = JSON.stringify(data);
    }

    const response = await fetch(url, options);

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Xendit API error: ${response.status}`);
    }

    return response.json();
};

// Invoice service using Xendit REST API
const Invoice = {
    createInvoice: async ({ data }) => {
        const result = await xenditApiRequest('/v2/invoices', 'POST', {
            external_id: data.externalId,
            amount: data.amount,
            currency: data.currency,
            payer_email: data.customer?.email,
            description: data.description,
            success_redirect_url: data.successUrl,
            failure_redirect_url: data.failureUrl,
            callback_url: data.callbackUrl,
            payment_methods: data.paymentMethods,
            should_send_email: data.shouldSendEmail,
        });

        return {
            id: result.id,
            invoiceUrl: result.invoice_url,
            externalId: result.external_id,
            status: result.status,
        };
    },
    listInvoices: async (filters = {}) => {
        const queryParams = new URLSearchParams();
        if (filters.externalId) queryParams.append('external_id', filters.externalId);
        if (filters.status) queryParams.append('status', filters.status);

        const queryString = queryParams.toString();
        const endpoint = `/v2/invoices${queryString ? '?' + queryString : ''}`;

        return await xenditApiRequest(endpoint, 'GET');
    },
    getInvoice: async (invoiceId) => {
        return await xenditApiRequest(`/v2/invoices/${invoiceId}`, 'GET');
    },
    expireInvoice: async (invoiceId) => {
        return await xenditApiRequest(`/v2/invoices/${invoiceId}/expire!`, 'POST');
    }
};

if (!XENDIT_API_KEY) {
    console.error('[Xendit] WARNING: XENDIT_SECRET_KEY not set. Payment features will not work.');
} else {
    console.log('[Xendit] REST API integration loaded successfully');
}

const PLANS = {
    pro: {
        name: 'Noir Pro',
        price: 50000,
        currency: 'IDR',
        interval: 'MONTH',
        description: 'Unlimited generations, priority AI processing, all frameworks',
    },
    enterprise: {
        name: 'Noir Enterprise',
        price: 500000,
        currency: 'IDR',
        interval: 'MONTH',
        description: 'Team management, SSO, dedicated account manager',
    },
};

app.post('/api/xendit/create-invoice', async (req, res) => {
    try {
        const { planId, email, name } = req.body;

        if (!planId || !PLANS[planId]) {
            return res.status(400).json({ error: 'Invalid plan ID' });
        }

        const plan = PLANS[planId];
        const invoiceExternalId = `noir_${planId}_${Date.now()}`;

        if (!email) {
            return res.status(400).json({ error: 'Email is required' });
        }

        const invoiceParams = {
            externalId: invoiceExternalId,
            amount: plan.price,
            currency: plan.currency,
            customer: {
                givenNames: name || 'Noir User',
                email: email,
            },
            description: `${plan.name} - ${plan.description}`,
            callbackUrl: `${process.env.VITE_API_URL}/api/xendit/callback`,
            successUrl: `${process.env.VITE_API_URL}/payment-success?external_id=${invoiceExternalId}`,
            failureUrl: `${process.env.VITE_API_URL}/payment-failure`,
            shouldSendEmail: true,
            paymentMethods: ['BANK_TRANSFER', 'CREDIT_CARD', 'EWALLET', 'OVO', 'DANA', 'LINKAJA', 'SHOPEEPAY'],
        };

        const invoice = await Invoice.createInvoice({ data: invoiceParams });

        res.json({
            success: true,
            invoiceId: invoice.id,
            invoiceUrl: invoice.invoiceUrl,
            externalId: invoiceExternalId,
        });
    } catch (error) {
        console.error('Xendit create invoice error:', error);
        res.status(500).json({ error: 'Failed to create invoice' });
    }
});

app.post('/api/xendit/callback', async (req, res) => {
    try {
        const { external_id, status, payment_method, paid_at } = req.body;

        console.log('Xendit callback received:', { external_id, status, payment_method, paid_at });

        if (status === 'PAID') {
            console.log(`Payment successful for invoice: ${external_id}`);
        }

        res.json({ received: true });
    } catch (error) {
        console.error('Callback error:', error);
        res.status(500).json({ error: 'Callback processing failed' });
    }
});

app.get('/api/xendit/invoice/:externalId', async (req, res) => {
    try {
        const { externalId } = req.params;
        const invoices = await Invoice.listInvoices({ externalId });

        if (invoices.length === 0) {
            return res.status(404).json({ error: 'Invoice not found' });
        }

        res.json({ invoice: invoices[0] });
    } catch (error) {
        console.error('Get invoice error:', error);
        res.status(500).json({ error: 'Failed to get invoice status' });
    }
});

app.get('/api/xendit/plans', (req, res) => {
    res.json({
        plans: Object.entries(PLANS).map(([id, plan]) => ({
            id,
            ...plan,
            priceIdr: plan.price.toLocaleString('id-ID'),
        })),
    });
});

app.post('/api/download-app', async (req, res) => {
    const { app } = req.body;

    if (!app) {
        return res.status(400).json({ error: 'App data is required' });
    }

    try {
        const JSZip = (await import('jszip')).default;
        const zip = new JSZip();

        Object.entries(app.frontend || {}).forEach(([path, content]) => {
            zip.file(path, content);
        });

        if (app.backend) {
            Object.entries(app.backend).forEach(([path, content]) => {
                zip.file(`server/${path}`, content);
            });
        }

        if (app.config) {
            zip.file('package.json', app.config.packageJson);
            zip.file('.env.example', app.config.envExample);
            zip.file('README.md', app.config.readme);
            if (app.config.dockerfile) {
                zip.file('Dockerfile', app.config.dockerfile);
            }
        }

        if (app.deployment?.vercel) {
            Object.entries(app.deployment.vercel).forEach(([path, content]) => {
                zip.file(`.vercel/${path}`, content);
            });
        }

        const buffer = await zip.generateAsync({ type: 'nodebuffer' });

        res.setHeader('Content-Type', 'application/zip');
        res.setHeader('Content-Disposition', `attachment; filename=noir-app-${Date.now()}.zip`);
        res.send(buffer);

    } catch (error) {
        console.error('[Download] Error:', error);
        res.status(500).json({ error: 'Failed to create download' });
    }
});

server.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
