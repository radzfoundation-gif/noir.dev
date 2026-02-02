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
    baseURL: "https://ai.sumopod.com/v1",
    apiKey: process.env.SUMOPOD_API_KEY || "dummy-key",
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
                content: "You are NOIR AI, an expert web developer. Your task is to generate production-ready HTML/CSS. \n\nCRITICAL PROCESS: You MUST pause and analyze the prompt before generating any code. This is a 'Chain of Thought' requirement.\n\noutput format:\n\n/// STEP: 1. Analysis & Strategy ///\nAnalyze the user's request (and image if provided). List 3-5 key design requirements, color palette choices, and layout structure.\n\n/// STEP: 2. Component Architecture ///\nBriefly list the main components (Navbar, Hero, Grid, etc.) you will build.\n\n/// STEP: 3. Refinement ///\nMention any specific styling details (e.g., 'Glassmorphism on cards', 'Gradient text').\n\n/// CODE ///\n<!DOCTYPE html>\n<html... (The full code)\n\nDO NOT output the code immediately. You MUST provide the steps first."
            },
            ...(history || [])
        ];

        if (image) {
            messages.push({
                role: "user",
                content: [
                    { type: "text", text: prompt || "Generate code based on this image." },
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
            model: model || "google/gemini-2.0-flash-exp:free",
            messages: messages,
            stream: true,
            max_tokens: 4000 // Ensure enough tokens for full code
        });

        for await (const chunk of stream) {
            const content = chunk.choices[0]?.delta?.content || "";
            if (content) {
                res.write(`data: ${JSON.stringify({ content })}\n\n`);
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

            const emailResponse = await fetch("https://api.resend.com/emails", {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer re_b2M5xmcK_9wpCLjMgqi2t7XXCwNjjnWjG`,
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

server.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
