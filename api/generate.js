import OpenAI from 'openai';

const client = new OpenAI({
    baseURL: process.env.SUMOPOD_BASE_URL || "https://api.apifree.ai/v1",
    apiKey: process.env.SUMOPOD_API_KEY,
});

export const config = {
    maxDuration: 60,
};

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

    const { prompt, model, history, image } = req.body;

    if (!prompt && !image) {
        return res.status(400).json({ error: 'Prompt or image is required' });
    }

    console.log(`[Generate] Starting stream for model: ${model || 'auto'}`);

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
}
