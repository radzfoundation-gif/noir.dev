import React, { useState } from 'react';
import { Figma, Loader2, X } from 'lucide-react';

interface FigmaImportProps {
    onImageImport: (url: string) => void;
}

export const FigmaImport: React.FC<FigmaImportProps> = ({ onImageImport }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [token, setToken] = useState(localStorage.getItem('figma_token') || '');
    const [url, setUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleImport = async () => {
        if (!token || !url) return;
        setLoading(true);
        setError(null);

        // Auto-save token logic (if valid)
        localStorage.setItem('figma_token', token);

        try {
            // Determine API URL (Local vs Prod) - Assuming local for dev, but relative path is safer
            // Using relative path assuming Vite proxies or same domain? 
            // NOIR dev runs backend on 3001, frontend 5173. 
            // ChatInput uses likely no prefix (or fetch fails). The 'fetch' in ChatInput or API calls usually needs base.
            // server/index.js is on 3001. Frontend vite.config proxy?
            // Assuming localhost:3001 for now or relative if proxy set.
            // Existing app likely uses direct localhost:3001 or logic.
            // I'll use http://localhost:3001 for safety as per other parts if visible.
            // Actually, `ChatInput` doesn't fetch. `Workbench` calls `fetch('/api/generate')`? No, `fetch` via `projectService`?
            // Let's use relative `/api/figma/import` and assume proxy is set up or I'll check `vite.config.ts`.
            // Wait, package.json scripts: `"dev": "concurrently \"vite\" \"node server/index.js\""`.
            // Usually valid Vite setup proxies /api to backend.
            // If not, I'll default to `http://localhost:3001`.

            const apiUrl = import.meta.env.PROD ? '/api/figma/import' : 'http://localhost:3001/api/figma/import';

            const res = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token, url })
            });

            const data = await res.json();

            if (!res.ok) throw new Error(data.error || 'Import failed');

            onImageImport(data.url);
            setIsOpen(false);
            setUrl(''); // Clear URL but keep token
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`p-1.5 transition-colors rounded-full hover:bg-zinc-900 ${isOpen ? 'text-lime-400 bg-zinc-900' : 'text-zinc-500 hover:text-lime-400'}`}
                title="Import from Figma"
            >
                <Figma size={14} />
            </button>

            {isOpen && (
                <>
                    <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
                    <div className="absolute bottom-full mb-2 left-0 w-80 bg-zinc-900 border border-zinc-800 rounded-xl shadow-xl z-50 p-4 animate-in slide-in-from-bottom-2 fade-in duration-200">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                                <Figma size={16} className="text-[#F24E1E]" />
                                Figma Import
                            </h3>
                            <button onClick={() => setIsOpen(false)} className="text-zinc-500 hover:text-white">
                                <X size={14} />
                            </button>
                        </div>

                        <div className="space-y-3">
                            <div>
                                <label className="text-[10px] uppercase font-bold text-zinc-500 mb-1 block">Figma Token</label>
                                <input
                                    type="password"
                                    value={token}
                                    onChange={e => setToken(e.target.value)}
                                    placeholder="Paste your Personal Access Token"
                                    className="w-full bg-black/50 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-lime-500/50"
                                />
                                <a href="https://www.figma.com/developers/api#access-tokens" target="_blank" rel="noreferrer" className="text-[10px] text-zinc-600 hover:text-lime-400 mt-1 block">
                                    Get your token here ↗
                                </a>
                            </div>

                            <div>
                                <label className="text-[10px] uppercase font-bold text-zinc-500 mb-1 block">File Link (with Node ID)</label>
                                <input
                                    type="text"
                                    value={url}
                                    onChange={e => setUrl(e.target.value)}
                                    placeholder="Paste link to Frame..."
                                    className="w-full bg-black/50 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-lime-500/50"
                                />
                                <p className="text-[10px] text-zinc-600 mt-1">
                                    Tip: Select a Frame in Figma → Copy Link
                                </p>
                            </div>

                            {error && (
                                <div className="p-2 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-xs">
                                    {error}
                                </div>
                            )}

                            <button
                                onClick={handleImport}
                                disabled={loading || !token || !url}
                                className="w-full bg-[#F24E1E] hover:opacity-90 text-white font-medium py-2 rounded-lg text-xs transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {loading ? <Loader2 size={14} className="animate-spin" /> : "Import Design"}
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};
