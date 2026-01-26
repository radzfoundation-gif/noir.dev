import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import { motion } from 'framer-motion';
import { NoirLogo } from '../components/NoirLogo';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export const WaitlistLandingPage = () => {
    const [stats, setStats] = useState({ total: 0 });
    const navigate = useNavigate();

    useEffect(() => {
        const socket = io(API_URL);
        socket.on('waitlistUpdated', (data) => {
            setStats(prev => ({ ...prev, total: data.count }));
        });

        fetch(`${API_URL}/api/waitlist/stats`)
            .then(res => res.json())
            .then(data => setStats({ total: data.total }))
            .catch(console.error);

        return () => { socket.disconnect(); };
    }, []);

    const handleJoinClick = () => navigate('/join');

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-background-dark text-white selection:bg-primary/30 font-display min-h-screen"
        >
            <header className="fixed top-0 w-full z-50 border-b border-white/5 bg-black/70 backdrop-blur-xl">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <NoirLogo />
                        <h2 className="text-xl font-bold tracking-tight">Noir</h2>
                    </div>
                    <nav className="hidden md:flex items-center gap-8">
                        <a className="text-sm font-medium text-zinc-400 hover:text-white transition-colors" href="#features">Features</a>
                        <a className="text-sm font-medium text-zinc-400 hover:text-white transition-colors" href="#">Docs</a>
                        <a className="text-sm font-medium text-zinc-400 hover:text-white transition-colors" href="#">Pricing</a>
                        <button onClick={handleJoinClick} className="bg-primary hover:bg-primary/90 text-white px-5 py-2 rounded-lg text-sm font-bold transition-all shadow-[0_0_20px_-5px_rgba(163,230,53,0.4)]">
                            Join Waitlist
                        </button>
                    </nav>
                </div>
            </header>

            <main className="pt-32 pb-20">
                <section className="max-w-5xl mx-auto px-6 text-center">
                    <motion.div
                        animate={{ y: [0, -5, 0] }}
                        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                        className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold mb-8"
                    >
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                        </span>
                        NEXT-GEN AI GENERATOR
                    </motion.div>
                    <motion.h1
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                        className="text-5xl md:text-7xl font-bold tracking-tighter mb-6 bg-gradient-to-b from-white to-zinc-500 bg-clip-text text-transparent"
                    >
                        Build Production Websites <br /> With AI. Instantly.
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1, delay: 0.6 }}
                        className="text-zinc-400 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed"
                    >
                        The intelligent workbench for developers. Move from prompt to production in seconds, not hours.
                    </motion.p>
                    <div className="flex flex-wrap justify-center gap-4 mb-20">
                        <button onClick={handleJoinClick} className="bg-primary hover:bg-primary/90 text-white px-8 py-4 rounded-lg font-bold transition-all shadow-[0_0_20px_-5px_rgba(163,230,53,0.4)] text-lg">
                            Join Waitlist
                        </button>
                        <button className="bg-transparent border border-white/10 hover:bg-white/5 text-white px-8 py-4 rounded-lg font-bold transition-all text-lg">
                            View Demo
                        </button>
                    </div>

                    <div className="relative group">
                        {/* Animated Background Blobs */}
                        <motion.div
                            animate={{
                                x: [-20, 20, -20],
                                y: [-20, 30, -20],
                                scale: [1, 1.1, 1],
                            }}
                            transition={{
                                duration: 8,
                                repeat: Infinity,
                                ease: "easeInOut"
                            }}
                            className="absolute -top-20 -left-20 w-96 h-96 bg-primary/20 rounded-full blur-[120px] pointer-events-none"
                        />
                        <motion.div
                            animate={{
                                x: [20, -20, 20],
                                y: [20, -30, 20],
                                scale: [1, 1.2, 1],
                            }}
                            transition={{
                                duration: 10,
                                repeat: Infinity,
                                ease: "easeInOut"
                            }}
                            className="absolute -bottom-20 -right-20 w-96 h-96 bg-primary/10 rounded-full blur-[120px] pointer-events-none"
                        />

                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            whileInView={{ y: 0, opacity: 1 }}
                            whileHover={{ rotateX: 2, rotateY: -2, scale: 1.01 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                            className="relative border border-white/10 rounded-xl bg-black overflow-hidden shadow-2xl perspective-1000"
                        >
                            {/* Scanning Line */}
                            <motion.div
                                animate={{ top: ["0%", "100%", "0%"] }}
                                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                                className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent z-50 pointer-events-none"
                            />
                            <div className="border-b border-white/10 px-4 py-3 flex items-center justify-between bg-zinc-900/50">
                                <div className="flex gap-2">
                                    <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50"></div>
                                    <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50"></div>
                                    <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50"></div>
                                </div>
                                <div className="flex gap-4">
                                    <span className="material-symbols-outlined text-zinc-500 text-sm">code</span>
                                    <span className="material-symbols-outlined text-zinc-500 text-sm">visibility</span>
                                    <span className="material-symbols-outlined text-zinc-500 text-sm">share</span>
                                </div>
                            </div>
                            <div className="flex flex-col md:flex-row h-[500px]">
                                <div className="w-full md:w-1/3 border-r border-white/10 p-6 flex flex-col gap-4">
                                    <div className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Input Prompt</div>
                                    <div className="bg-zinc-950 border border-white/10 rounded-lg p-4 h-full text-left font-mono text-sm text-zinc-300">
                                        <span className="text-primary">&gt;</span> Create a minimalist dashboard for a SaaS platform with a dark theme, neon blue accents, and responsive charts...
                                        <span className="animate-pulse">|</span>
                                    </div>
                                    <div className="mt-12 flex flex-col items-center gap-4">
                                        <div className="flex -space-x-3">
                                            {[1, 2, 3].map(i => (
                                                <div key={i} className="w-8 h-8 rounded-full border border-black bg-neutral-800 flex items-center justify-center overflow-hidden">
                                                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i}`} alt="avatar" className="w-full h-full opacity-80 grayscale" />
                                                </div>
                                            ))}
                                            <div className="w-8 h-8 rounded-full border border-black bg-neutral-900 flex items-center justify-center text-[10px] font-medium text-white">
                                                +{stats.total > 0 ? stats.total : '2k'}
                                            </div>
                                        </div>
                                        <p className="text-xs text-neutral-500 font-medium">Join {stats.total > 0 ? stats.total.toLocaleString() : '2,000'}+ other creators</p>
                                    </div>
                                </div>
                                <div className="flex-1 bg-[#050505] p-6 flex items-center justify-center overflow-hidden">
                                    <div className="w-full h-full border border-white/10 rounded-lg bg-black p-4 flex flex-col gap-4">
                                        <div className="flex justify-between items-center border-b border-white/10 pb-4">
                                            <div className="flex gap-2">
                                                <div className="h-4 w-20 bg-zinc-800 rounded"></div>
                                                <div className="h-4 w-12 bg-zinc-800 rounded"></div>
                                            </div>
                                            <div className="h-4 w-4 bg-primary rounded"></div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="h-24 bg-zinc-900 rounded border border-white/10"></div>
                                            <div className="h-24 bg-zinc-900 rounded border border-white/10"></div>
                                            <div className="h-32 col-span-2 bg-zinc-900 rounded border border-white/10"></div>
                                        </div>
                                        <div className="h-4 w-1/2 bg-zinc-800 rounded"></div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </section>

                <section className="mt-40 max-w-7xl mx-auto px-6" id="features">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="mb-16"
                    >
                        <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">Built for Developer Speed</h2>
                        <p className="text-zinc-400 max-w-xl">Noir translates your architectural intent into clean, production-ready code without the overhead.</p>
                    </motion.div>
                    <div className="grid md:grid-cols-2 gap-6">
                        {[
                            { icon: 'psychology', title: 'Intent-Based Generation', desc: 'AI that understands high-level technical requirements and maps them to industry standard patterns.' },
                            { icon: 'speed', title: 'Prompt-to-Production', desc: 'Go from a single line of text to a hosted, optimized, and secure production site instantly.' },
                            { icon: 'view_stream', title: 'Live Preview', desc: 'See changes in real-time with zero-latency updates as the AI iterates through your requirements.' },
                            { icon: 'code_blocks', title: 'Developer Export', desc: 'Get clean, modular React and Tailwind code that fits perfectly into your existing Git workflow.' }
                        ].map((feature, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1, duration: 0.5 }}
                                className="group relative p-8 rounded-xl border border-white/5 bg-zinc-900/50 hover:border-primary/50 transition-all"
                            >
                                <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl"></div>
                                <div className="relative">
                                    <span className="material-symbols-outlined text-primary text-4xl mb-4">{feature.icon}</span>
                                    <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                                    <p className="text-zinc-400 leading-relaxed">{feature.desc}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </section>

                <section className="mt-40 max-w-4xl mx-auto px-6 mb-20">
                    <div className="relative p-12 rounded-2xl border border-white/5 bg-gradient-to-br from-zinc-900 to-black text-center overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 blur-[100px]"></div>
                        <h2 className="text-3xl md:text-5xl font-bold mb-6 relative z-10 font-display">Ready to build?</h2>
                        <p className="text-zinc-400 mb-8 relative z-10 max-w-md mx-auto">Join the waitlist to get early access to the Noir developer workbench.</p>
                        <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto relative z-10">
                            <input className="flex-1 bg-black border border-white/10 rounded-lg px-4 py-3 focus:border-primary focus:ring-1 focus:ring-primary transition-all text-white outline-none" placeholder="Enter your work email" type="email" />
                            <button onClick={() => navigate('/join')} className="bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-lg font-bold transition-all shadow-[0_0_20px_-5px_rgba(163,230,53,0.4)] whitespace-nowrap">
                                Join Waitlist
                            </button>
                        </div>
                    </div>
                </section>
            </main>

            <footer className="border-t border-white/5 py-12 bg-black">
                <div className="max-w-7xl mx-auto px-6 text-center md:text-left">
                    <div className="grid md:grid-cols-4 gap-12 mb-12">
                        <div className="col-span-2">
                            <div className="flex items-center gap-2 mb-4 justify-center md:justify-start">
                                <NoirLogo className="size-10" />
                                <span className="font-bold text-lg">Noir</span>
                            </div>
                            <p className="text-zinc-500 max-w-xs leading-relaxed mx-auto md:mx-0">The modern AI engine for production-grade websites. Designed for developers who value quality and speed.</p>
                        </div>
                        <div>
                            <h5 className="font-bold mb-4">Product</h5>
                            <ul className="flex flex-col gap-2 text-zinc-500 text-sm">
                                <li><a className="hover:text-primary transition-colors" href="#">Features</a></li>
                                <li><a className="hover:text-primary transition-colors" href="#">Integrations</a></li>
                                <li><a className="hover:text-primary transition-colors" href="#">Pricing</a></li>
                            </ul>
                        </div>
                        <div>
                            <h5 className="font-bold mb-4">Resources</h5>
                            <ul className="flex flex-col gap-2 text-zinc-500 text-sm">
                                <li><a className="hover:text-primary transition-colors" href="#">Documentation</a></li>
                                <li><a className="hover:text-primary transition-colors" href="#">GitHub</a></li>
                                <li><a className="hover:text-primary transition-colors" href="#">Discord</a></li>
                            </ul>
                        </div>
                    </div>
                    <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-zinc-600 text-xs">
                        <p>© 2026 Noir AI. All rights reserved.</p>
                        <div className="flex gap-6">
                            <a className="hover:text-white transition-colors" href="#">Privacy Policy</a>
                            <a className="hover:text-white transition-colors" href="#">Terms of Service</a>
                        </div>
                    </div>
                </div>
            </footer>
        </motion.div>
    );
};
