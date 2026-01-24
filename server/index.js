import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import OpenAI from 'openai';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json({ limit: '50mb' })); // Increased limit for base64 images

const client = new OpenAI({
    baseURL: "https://openrouter.ai/api/v1",
    apiKey: process.env.OPENROUTER_API_KEY,
});

app.get('/api/health', (req, res) => {
    res.json({ status: 'ok' });
});

app.post('/api/generate', async (req, res) => {
    try {
        const { model, image, prompt } = req.body;

        if (!image) {
            return res.status(400).json({ error: 'Image is required' });
        }

        const messages = [
            {
                role: "system",
                content: "You are an expert Frontend Developer. You convert UI designs (images) into pixel-perfect, responsive HTML/TailwindCSS code. Return ONLY the code, no markdown fences, no explanations. If using React, return a functional component."
            },
            {
                role: "user",
                content: [
                    { type: "text", text: prompt || "Convert this design to code." },
                    { type: "image_url", image_url: { url: image } } // URL or Base64
                ]
            }
        ];

        const completion = await client.chat.completions.create({
            model: model || "google/gemini-2.0-flash-exp", // Default fallback
            messages: messages,
        });

        res.json(completion.choices[0].message);

    } catch (error) {
        console.error("Error generating code:", error);
        res.status(500).json({ error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
