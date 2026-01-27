import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, Eye, Sparkles, ChevronRight } from 'lucide-react';

const DEMO_SAMPLES = [
    {
        id: 'hero',
        name: 'SaaS Hero',
        image: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&q=80&w=400',
        code: `<div className="bg-slate-950 p-12 rounded-3xl border border-white/10">
  <h1 className="text-5xl font-bold text-white mb-6">
    Scale <span className="text-lime-400">Faster</span>
  </h1>
  <p className="text-slate-400 text-lg mb-8">
    The ultimate platform for modern developers.
  </p>
  <button className="px-8 py-3 bg-lime-400 text-black font-semibold rounded-xl">
    Get Started
  </button>
</div>`,
        preview: (
            <div className="bg-slate-950 p-8 rounded-2xl border border-white/10 w-full">
                <h1 className="text-3xl font-bold text-white mb-4">
                    Scale <span className="text-lime-400">Faster</span>
                </h1>
                <p className="text-slate-400 text-sm mb-6">
                    The ultimate platform for modern developers.
                </p>
                <div className="px-6 py-2 bg-lime-400 text-black text-xs font-bold rounded-lg inline-block">
                    Get Started
                </div>
            </div>
        )
    },
    {
        id: 'pricing',
        name: 'Pricing Tier',
        image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=400',
        code: `<div className="p-8 bg-white/5 border border-lime-500/20 rounded-2xl">
  <h3 className="text-lime-400 font-bold mb-2 uppercase">Pro Plan</h3>
  <div className="text-4xl font-bold text-white mb-4">$49<span className="text-lg">/mo</span></div>
  <ul className="space-y-3 text-slate-300">
    <li>✓ Unlimited Projects</li>
    <li>✓ AI Code Refactor</li>
    <li>✓ 24/7 Support</li>
  </ul>
</div>`,
        preview: (
            <div className="p-6 bg-white/5 border border-lime-500/20 rounded-2xl w-full">
                <h3 className="text-lime-400 text-xs font-bold mb-1 uppercase">Pro Plan</h3>
                <div className="text-3xl font-bold text-white mb-4">$49<span className="text-sm font-normal text-slate-500">/mo</span></div>
                <ul className="space-y-2 text-slate-400 text-xs text-left">
                    <li className="flex items-center gap-2"><span>✓</span> Unlimited Projects</li>
                    <li className="flex items-center gap-2"><span>✓</span> AI Code Refactor</li>
                    <li className="flex items-center gap-2"><span>✓</span> 24/7 Support</li>
                </ul>
            </div>
        )
    },
    {
        id: 'login',
        name: 'Auth Modal',
        image: 'https://images.unsplash.com/photo-1555421689-491a97ff2040?auto=format&fit=crop&q=80&w=400',
        code: `<div className="max-w-md w-full bg-zinc-900 border border-zinc-800 p-8 rounded-2xl">
  <h2 className="text-2xl font-bold text-white mb-6">Welcome Back</h2>
  <input className="w-full bg-black/50 border border-zinc-700 p-3 rounded-lg mb-4" placeholder="Email" />
  <button className="w-full bg-white text-black py-3 rounded-lg font-bold">Sign In</button>
</div>`,
        preview: (
            <div className="w-full bg-zinc-900 border border-zinc-800 p-6 rounded-2xl">
                <h2 className="text-xl font-bold text-white mb-4">Welcome Back</h2>
                <div className="w-full h-8 bg-black/50 border border-zinc-700 rounded-lg mb-3 flex items-center px-3">
                    <span className="text-zinc-600 text-[10px]">Email</span>
                </div>
                <div className="w-full bg-white text-black py-2 rounded-lg font-bold text-xs text-center">
                    Sign In
                </div>
            </div>
        )
    }
];

export const InteractiveDemo = () => {
    const [activeSample, setActiveSample] = useState(DEMO_SAMPLES[0]);
    const [displayedCode, setDisplayedCode] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [view, setView] = useState<'preview' | 'code'>('preview');

    useEffect(() => {
        let index = 0;
        setDisplayedCode('');
        setIsTyping(true);

        const interval = setInterval(() => {
            if (index < activeSample.code.length) {
                setDisplayedCode(prev => prev + activeSample.code[index]);
                index++;
            } else {
                setIsTyping(false);
                clearInterval(interval);
            }
        }, 10);

        return () => clearInterval(interval);
    }, [activeSample]);

    return (
        <div className="flex flex-col gap-8 w-full">
            {/* Selection Tabs */}
            <div className="flex justify-center gap-4">
                {DEMO_SAMPLES.map((sample) => (
                    <button
                        key={sample.id}
                        onClick={() => setActiveSample(sample)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${activeSample.id === sample.id
                            ? 'bg-primary text-stone-900 shadow-lg shadow-primary/20'
                            : 'bg-white/5 text-slate-400 hover:bg-white/10'
                            }`}
                    >
                        {sample.name}
                    </button>
                ))}
            </div>

            <div className="grid lg:grid-cols-2 gap-8 h-[500px]">
                {/* Left: Input Design */}
                <div className="relative group perspective-1000">
                    <div className="absolute inset-0 bg-primary/20 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                    <div className="relative glass rounded-3xl overflow-hidden border border-white/10 h-full flex flex-col">
                        <div className="bg-white/5 px-6 py-4 border-b border-white/10 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Sparkles size={16} className="text-primary" />
                                <span className="text-xs font-bold uppercase tracking-widest">Input Design Mockup</span>
                            </div>
                            <div className="size-2 rounded-full bg-red-400 animate-pulse"></div>
                        </div>
                        <div className="p-0 flex-1 relative bg-black/40">
                            <motion.img
                                key={activeSample.id}
                                initial={{ opacity: 0, scale: 1.1 }}
                                animate={{ opacity: 1, scale: 1 }}
                                src={activeSample.image}
                                className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-700"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>

                            {/* Scanning Animation */}
                            {isTyping && (
                                <motion.div
                                    animate={{ top: ['0%', '100%', '0%'] }}
                                    transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                                    className="absolute left-0 w-full h-0.5 bg-primary/50 shadow-[0_0_15px_#a3e635] z-10"
                                />
                            )}
                        </div>
                    </div>
                </div>

                {/* Right: Output Code/Preview */}
                <div className="relative">
                    <div className="relative glass rounded-3xl overflow-hidden border border-white/10 h-full flex flex-col">
                        <div className="bg-white/5 px-6 py-4 border-b border-white/10 flex items-center justify-between">
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setView('preview')}
                                    className={`flex items-center gap-2 px-3 py-1 rounded-md text-xs transition-colors ${view === 'preview' ? 'bg-primary text-stone-900 font-bold' : 'text-slate-400 hover:text-white'
                                        }`}
                                >
                                    <Eye size={14} /> Preview
                                </button>
                                <button
                                    onClick={() => setView('code')}
                                    className={`flex items-center gap-2 px-3 py-1 rounded-md text-xs transition-colors ${view === 'code' ? 'bg-primary text-stone-900 font-bold' : 'text-slate-400 hover:text-white'
                                        }`}
                                >
                                    <Terminal size={14} /> Code
                                </button>
                            </div>
                            <div className="flex gap-1.5">
                                <div className="size-2.5 rounded-full bg-white/10"></div>
                                <div className="size-2.5 rounded-full bg-white/10"></div>
                                <div className="size-2.5 rounded-full bg-white/10"></div>
                            </div>
                        </div>

                        <div className="flex-1 overflow-hidden relative">
                            <AnimatePresence mode="wait">
                                {view === 'preview' ? (
                                    <motion.div
                                        key="preview"
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        className="h-full w-full p-8 flex items-center justify-center bg-[radial-gradient(circle_at_50%_50%,rgba(163,230,53,0.05),transparent)]"
                                    >
                                        <div className="w-full max-w-sm">
                                            {activeSample.preview}
                                        </div>
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="code"
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        className="h-full w-full p-6 font-mono text-xs overflow-y-auto bg-black/20"
                                    >
                                        <pre className="text-slate-300">
                                            {displayedCode}
                                            {isTyping && <span className="animate-pulse inline-block w-1.5 h-4 bg-primary ml-1 translate-y-0.5"></span>}
                                        </pre>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Status Bar */}
                        <div className="bg-white/5 px-6 py-3 border-t border-white/10 flex items-center justify-between text-[10px] text-slate-500 font-mono tracking-widest uppercase">
                            <div className="flex items-center gap-4">
                                <span className="flex items-center gap-1.5">
                                    <div className={`size-1.5 rounded-full ${isTyping ? 'bg-amber-400 animate-pulse' : 'bg-green-400'}`}></div>
                                    {isTyping ? 'Synthesizing...' : 'Code Ready'}
                                </span>
                                <span>React v19</span>
                                <span>Tailwind v4</span>
                            </div>
                            <div className="flex items-center gap-1 text-primary/70">
                                <span>840ms</span>
                                <ChevronRight size={10} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
