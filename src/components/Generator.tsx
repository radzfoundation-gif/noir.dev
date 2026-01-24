import { useState } from 'react';
import { Layout } from './Layout';
import { Hero } from './Hero';
import { EditorLayout } from './EditorLayout';
import { ChatInput } from './ChatInput';
import { Workspace } from './Workspace';

export const Generator = () => {
    const [view, setView] = useState<'landing' | 'editor'>('landing');
    const [image, setImage] = useState<string | null>(null);
    const [model, setModel] = useState('google/gemini-2.0-flash-exp');
    const [prompt, setPrompt] = useState('');
    const [code, setCode] = useState('');
    const [loading, setLoading] = useState(false);

    const handleGenerate = async () => {
        // Switch to editor view immediately
        setView('editor');
        setLoading(true);
        setCode('');

        // Simulate AI Generation
        setTimeout(() => {
            const mockGeneratedCode = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sirius - AI Operating System</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <style>
        body { font-family: 'Inter', sans-serif; }
        .glass { background: rgba(255, 255, 255, 0.03); backdrop-filter: blur(20px); border: 1px solid rgba(255, 255, 255, 0.05); }
    </style>
    <script>
        tailwind.config = {
            theme: {
                extend: {
                    colors: {
                        brand: { 400: '#a3e635', 500: '#84cc16' }
                    }
                }
            }
        }
    </script>
</head>
<body class="bg-black text-white min-h-screen overflow-x-hidden selection:bg-brand-500/30 selection:text-brand-400">
    
    <!-- Navbar -->
    <nav class="fixed top-0 w-full z-50 border-b border-white/5 bg-black/50 backdrop-blur-xl">
        <div class="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
            <div class="flex items-center gap-2">
                <div class="w-2 h-2 rounded-full bg-brand-400 shadow-[0_0_10px_rgba(163,230,53,0.5)]"></div>
                <span class="font-bold tracking-tight">SIRIUS.ID</span>
            </div>
            <div class="hidden md:flex items-center gap-8 text-sm text-zinc-400 font-medium">
                <a href="#" class="hover:text-white transition-colors">Manifesto</a>
                <a href="#" class="hover:text-white transition-colors">Features</a>
                <a href="#" class="hover:text-white transition-colors">Pricing</a>
            </div>
            <button class="bg-white/5 hover:bg-white/10 border border-white/5 px-4 py-1.5 rounded-full text-xs font-semibold transition-all">
                Login
            </button>
        </div>
    </nav>

    <!-- Hero -->
    <main class="relative pt-32 pb-20 px-6">
        <!-- Glow Effect -->
        <div class="absolute top-20 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-brand-500/10 blur-[100px] rounded-full pointer-events-none"></div>

        <div class="max-w-4xl mx-auto text-center relative z-10">
            <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-brand-400/20 bg-brand-400/5 text-brand-400 text-[10px] font-bold tracking-wider mb-8 uppercase">
                <span class="w-1.5 h-1.5 rounded-full bg-brand-400 animate-pulse"></span>
                Accepting Early Access
            </div>

            <h1 class="text-5xl md:text-7xl font-bold tracking-tight mb-6 leading-[1.1]">
                The future of <br />
                <span class="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-emerald-400">digital intelligence.</span>
            </h1>

            <p class="text-xl text-zinc-400 max-w-2xl mx-auto mb-12 font-light leading-relaxed">
                Sirius is the operating system for your ideas. Integrate AI seamlessly into your workflow with a context-aware workspace designed for speed.
            </p>

            <!-- Waitlist Form -->
            <div class="max-w-md mx-auto glass rounded-2xl p-2 p-8 shadow-2xl relative overflow-hidden group">
                <div class="absolute inset-0 bg-gradient-to-b from-brand-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
                
                <div class="relative z-10 space-y-4 text-left">
                    <div>
                        <label class="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider pl-1 mb-1 block">Full Name</label>
                        <div class="relative">
                            <input type="text" placeholder="John Doe" class="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-brand-400/50 transition-colors placeholder:text-zinc-700 text-white" />
                        </div>
                    </div>
                    <div>
                        <label class="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider pl-1 mb-1 block">Email Address</label>
                         <div class="relative">
                            <input type="email" placeholder="john@company.com" class="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-brand-400/50 transition-colors placeholder:text-zinc-700 text-white" />
                        </div>
                    </div>
                    
                    <button class="w-full bg-brand-400 hover:bg-brand-500 text-black font-bold py-3.5 rounded-lg mt-2 transition-all hover:scale-[1.02] shadow-[0_0_20px_rgba(163,230,53,0.3)]">
                        Join the Waitlist →
                    </button>
                    
                    <p class="text-center text-[10px] text-zinc-600 mt-4">
                        Join <span class="text-white font-medium">2,583</span> innovators waiting for access.
                    </p>
                </div>
            </div>
            
            <!-- Logos -->
            <div class="mt-20 pt-10 border-t border-white/5 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
                <p class="text-xs text-zinc-600 mb-6 font-medium">TRUSTED BY TEAMS AT</p>
                <div class="flex justify-center gap-12 items-center">
                   <div class="h-6 w-20 bg-zinc-800 rounded"></div>
                   <div class="h-6 w-20 bg-zinc-800 rounded"></div>
                   <div class="h-6 w-20 bg-zinc-800 rounded"></div>
                   <div class="h-6 w-20 bg-zinc-800 rounded"></div>
                </div>
            </div>
        </div>
    </main>
</body>
</html>`;
            setCode(mockGeneratedCode);
            setLoading(false);
        }, 2500);
    };

    if (view === 'landing') {
        return (
            <Layout>
                <Hero
                    onGenerate={handleGenerate}
                    loading={loading}
                    image={image}
                    setImage={setImage}
                    model={model}
                    setModel={setModel}
                    prompt={prompt}
                    setPrompt={setPrompt}
                />
            </Layout>
        );
    }

    return (
        <EditorLayout
            sidebarContent={
                <div className="space-y-6">
                    {/* Simulated Specs similar to screenshot */}
                    <div className="space-y-2">
                        <h4 className="text-sm font-medium text-white">Micro-Interactions</h4>
                        <ul className="list-disc pl-4 text-xs text-zinc-400 space-y-1.5 leading-relaxed marker:text-lime-500">
                            <li>Hover effects on inputs (icon color change, border highlight).</li>
                            <li>A shimmering effect on the "Join Waitlist" button.</li>
                            <li>Smooth accordion animation for the FAQ.</li>
                            <li>Entrance animations (fade up) for all major elements.</li>
                        </ul>
                    </div>
                </div>
            }
            sidebarBottom={
                <ChatInput
                    onGenerate={handleGenerate}
                    loading={loading}
                    image={image}
                    setImage={setImage}
                    model={model}
                    setModel={setModel}
                    prompt={prompt}
                    setPrompt={setPrompt}
                />
            }
            workspaceContent={
                <Workspace code={code} loading={loading} />
            }
        />
    );
};
