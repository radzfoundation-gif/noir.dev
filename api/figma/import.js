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

    const { token, url } = req.body;

    if (!token || !url) return res.status(400).json({ error: "Missing token or URL" });

    // Parse URL for fileKey and nodeId
    const fileKeyMatch = url.match(/figma\.com\/(?:file|design)\/([a-zA-Z0-9]+)/);
    const nodeIdMatch = url.match(/[?&]node-id=([^&]+)/);

    if (!fileKeyMatch || !nodeIdMatch) {
        return res.status(400).json({ error: "Invalid Figma URL. Ensure it contains the File Key and node-id param." });
    }

    const fileKey = fileKeyMatch[1];
    const nodeId = decodeURIComponent(nodeIdMatch[1]);

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
        const imageUrl = data.images[nodeId];

        if (!imageUrl) {
            return res.status(404).json({ error: "No image found for the specified Node ID." });
        }

        res.json({ url: imageUrl });

    } catch (e) {
        console.error("[Figma Import] Exception:", e);
        res.status(500).json({ error: e.message });
    }
}
