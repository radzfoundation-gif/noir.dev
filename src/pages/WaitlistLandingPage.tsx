import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import { motion } from 'framer-motion';
import { NoirLogo } from '../components/NoirLogo';
import { InteractiveDemo } from '../components/InteractiveDemo';
import { ShieldCheck, Code2, Layers, Sparkles } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || '';

export const WaitlistLandingPage = () => {
    const [stats, setStats] = useState({ total: 0 });
    const navigate = useNavigate();

    useEffect(() => {
        // Socket.io only works in development (Vercel doesn't support persistent WebSocket connections)
        let socket: ReturnType<typeof io> | null = null;
        if (import.meta.env.DEV && API_URL) {
            socket = io(API_URL);
            socket.on('waitlistUpdated', (data) => {
                setStats(prev => ({ ...prev, total: data.count }));
            });
        }

        fetch(`${API_URL}/api/waitlist/stats`)
            .then(res => res.json())
            .then(data => setStats({ total: data.total }))
            .catch(console.error);

        return () => { socket?.disconnect(); };
    }, []);

    const handleJoinClick = () => navigate('/join');

    return (
        <div className="bg-background-dark font-display text-white transition-colors duration-300 min-h-screen">
            {/* Top Navigation Bar */}
            <header className="fixed top-0 w-full z-50 glass border-b border-white/10 px-6 lg:px-20 py-4">
                <div className="max-w-[1200px] mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
                        <div className="text-primary">
                            <NoirLogo className="size-8" />
                        </div>
                        <h2 className="text-xl font-semibold tracking-tight glow-text">NOIR AI</h2>
                    </div>
                    <nav className="hidden md:flex items-center gap-10">
                        <a className="text-sm font-medium hover:text-primary transition-colors" href="#features">Features</a>
                        <a className="text-sm font-medium hover:text-primary transition-colors" href="#flow">Flow</a>
                        <a className="text-sm font-medium hover:text-primary transition-colors" href="#">Docs</a>
                    </nav>
                    <div className="flex gap-3">
                        <button
                            onClick={handleJoinClick}
                            className="px-5 py-2 rounded-lg bg-primary hover:bg-lime-500 text-stone-900 text-sm font-semibold shadow-lg shadow-primary/20 transition-all active:scale-95"
                        >
                            Join Waitlist
                        </button>
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <section className="relative pt-40 pb-24 px-6 lg:px-20 overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,98,255,0.08),transparent_50%)]"></div>
                <div className="max-w-[1200px] mx-auto text-center relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold mb-6 uppercase tracking-widest"
                    >
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                        </span>
                        Next-Gen Engine v2.0
                    </motion.div>
                    <motion.h1
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, delay: 0.1 }}
                        className="text-5xl md:text-7xl font-bold leading-tight tracking-tighter mb-8 max-w-4xl mx-auto"
                    >
                        Turn <span className="text-primary font-bold">Screenshots</span> into Production Code
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed font-light"
                    >
                        NOIR AI bridges the gap between vision and reality. Join our waitlist to generate clean, accessible React and Tailwind code from mockups in seconds.
                    </motion.p>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="flex flex-wrap justify-center gap-4"
                    >
                        <button
                            onClick={handleJoinClick}
                            className="px-8 py-4 bg-primary text-stone-900 rounded-xl font-semibold text-lg hover:scale-105 transition-transform flex items-center gap-2 shadow-xl shadow-primary/20"
                        >
                            <span className="material-symbols-outlined">bolt</span> Join Exclusive Waitlist
                        </button>
                        <div className="flex items-center gap-3 px-6 py-4 glass rounded-xl border border-white/10">
                            <div className="flex -space-x-3">
                                {[1, 2, 3].map(i => (
                                    <div key={i} className="w-8 h-8 rounded-full border border-black bg-neutral-800 overflow-hidden">
                                        <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i + 10}`} alt="user" className="w-full h-full grayscale opacity-80" />
                                    </div>
                                ))}
                            </div>
                            <span className="text-sm font-medium text-slate-300">
                                {stats.total > 0 ? stats.total.toLocaleString() : '2,450'}+ builders joined
                            </span>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Feature 1: Screenshot to Code */}
            <section id="features" className="py-24 px-6 lg:px-20 max-w-[1200px] mx-auto">
                <div className="flex flex-col gap-4 mb-12">
                    <h2 className="text-3xl font-semibold flex items-center gap-3">
                        <span className="material-symbols-outlined text-primary text-4xl">add_photo_alternate</span>
                        Screenshot to Code
                    </h2>
                    <p className="text-slate-400 font-light">Transform any image, mockup, or napkin sketch into functional UI components.</p>
                </div>
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    {/* Left: Upload Card */}
                    <div className="glass p-8 rounded-2xl aspect-video flex flex-col items-center justify-center border-dashed border-2 border-primary/30 relative overflow-hidden group cursor-pointer" onClick={handleJoinClick}>
                        <motion.div
                            animate={{ top: ["0%", "100%", "0%"] }}
                            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                            className="absolute left-0 w-full scanner-line opacity-50 z-10"
                        />
                        <div className="text-center group-hover:scale-110 transition-transform duration-500 relative z-0">
                            <div className="size-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-primary/20">
                                <span className="material-symbols-outlined text-primary text-4xl">cloud_upload</span>
                            </div>
                            <p className="text-xl font-semibold mb-2">Drag and drop your design</p>
                            <p className="text-slate-400 text-sm italic font-light">Join waitlist to unlock uploader</p>
                        </div>
                    </div>
                    {/* Right: Code Preview */}
                    <div className="glass rounded-2xl overflow-hidden border border-white/10 flex flex-col h-[400px]">
                        <div className="bg-white/5 px-6 py-3 border-b border-white/10 flex items-center justify-between">
                            <div className="flex gap-2">
                                <div className="size-3 rounded-full bg-red-500/50"></div>
                                <div className="size-3 rounded-full bg-yellow-500/50"></div>
                                <div className="size-3 rounded-full bg-green-500/50"></div>
                            </div>
                            <span className="text-xs font-mono text-slate-500 uppercase tracking-widest">Generated Output: React + Tailwind</span>
                        </div>
                        <div className="p-6 font-mono text-sm overflow-y-auto scanline-effect">
                            <pre className="text-slate-300">
                                <span className="text-primary">export default function</span> <span className="text-yellow-400">HeroSection</span>() {'{'}<br />
                                {'  '}<span className="text-primary">return</span> (<br />
                                {'    '}&lt;<span className="text-blue-400">div</span> <span className="text-green-400">className</span>=<span className="text-orange-300">"relative bg-dark p-12"</span>&gt;<br />
                                {'      '}&lt;<span className="text-blue-400">h1</span> <span className="text-green-400">className</span>=<span className="text-orange-300">"text-4xl font-semibold"</span>&gt;<br />
                                {'        '}Modern AI Platform<br />
                                {'      '}&lt;/<span className="text-blue-400">h1</span>&gt;<br />
                                {'      '}&lt;<span className="text-blue-400">button</span> <span className="text-green-400">className</span>=<span className="text-orange-300">"bg-blue-600 rounded-lg"</span>&gt;<br />
                                {'        '}Get Started<br />
                                {'      '}&lt;/<span className="text-blue-400">button</span>&gt;<br />
                                {'    '}&lt;/<span className="text-blue-400">div</span>&gt;<br />
                                {'  '});<br />
                                {'}'}
                            </pre>
                        </div>
                    </div>
                </div>
            </section>

            {/* Feature 2: URL to Code */}
            <section className="py-24 px-6 lg:px-20 bg-primary/5 border-y border-white/5">
                <div className="max-w-[1200px] mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-semibold mb-4 flex justify-center items-center gap-3">
                            <span className="material-symbols-outlined text-primary text-4xl">link</span>
                            Website Link to Code
                        </h2>
                        <p className="text-slate-400 max-w-2xl mx-auto font-light">Found a component you love? Paste the URL and let NOIR AI extract the design patterns and rebuild them for your tech stack.</p>
                    </div>
                    <div className="max-w-3xl mx-auto">
                        <div className="glass p-2 rounded-2xl flex items-center gap-2 focus-within:ring-2 ring-primary/50 transition-all">
                            <input
                                onClick={handleJoinClick}
                                readOnly
                                className="flex-1 bg-transparent border-none focus:ring-0 px-6 py-4 text-white placeholder-slate-500 cursor-pointer font-light"
                                placeholder="https://example.com/inspiration"
                                type="text"
                            />
                            <button
                                onClick={handleJoinClick}
                                className="bg-primary hover:bg-blue-600 px-8 py-4 rounded-xl font-semibold flex items-center gap-2 whitespace-nowrap transition-all active:scale-95"
                            >
                                <span className="material-symbols-outlined">bolt</span> Fetch UI
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Section 3: How It Works */}
            <section id="flow" className="py-24 px-6 lg:px-20 max-w-[1200px] mx-auto">
                <h2 className="text-center text-3xl font-semibold mb-16">The NOIR Intelligence Flow</h2>
                <div className="grid md:grid-cols-3 gap-8 relative">
                    <div className="hidden md:block absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent -translate-y-1/2 -z-10"></div>
                    {[
                        { icon: 'input', title: '1. Input Design', desc: 'Upload a screenshot or paste a URL for the AI to analyze.' },
                        { icon: 'psychology', title: '2. AI Analysis', desc: 'Our neural engine identifies patterns, layouts, and style tokens.' },
                        { icon: 'code_blocks', title: '3. Export Code', desc: 'Get production-ready code blocks tailored to your framework.' }
                    ].map((step, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.2 }}
                            className="glass p-8 rounded-2xl text-center flex flex-col items-center hover:border-primary/50 transition-colors"
                        >
                            <div className="size-16 rounded-xl bg-primary/20 flex items-center justify-center mb-6 border border-primary/30 text-primary">
                                <span className="material-symbols-outlined text-3xl">{step.icon}</span>
                            </div>
                            <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                            <p className="text-slate-400 text-sm font-light">{step.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Section 5: Tech Stack */}
            <section className="py-20 px-6 lg:px-20 opacity-40">
                <div className="max-w-[1200px] mx-auto">
                    <h2 className="text-center text-sm font-semibold tracking-[0.3em] uppercase text-slate-500 mb-12">Universal Compatibility</h2>
                    <div className="flex flex-wrap justify-center gap-12 grayscale">
                        {['React', 'Tailwind', 'HTML5', 'Next.js', 'TypeScript'].map((tech) => (
                            <div key={tech} className="flex items-center gap-2 text-xl font-medium hover:grayscale-0 transition-all cursor-default">
                                <span className="material-symbols-outlined text-primary">deployed_code</span>
                                {tech}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Section 6: Interactive Demo */}
            <section className="py-24 px-6 lg:px-20 max-w-[1200px] mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
                        See the <span className="text-primary">Intelligence</span> in Action
                    </h2>
                    <p className="text-slate-400 max-w-2xl mx-auto text-lg font-light">
                        Select a design mockup below to see how NOIR AI analyzes the hierarchy and generates production-grade React code.
                    </p>
                </div>
                <InteractiveDemo />
            </section>

            {/* Section 7: Engineered for Maintainability */}
            <section className="py-24 px-6 lg:px-20 bg-primary/5 border-y border-white/5">
                <div className="max-w-[1200px] mx-auto">
                    <div className="flex flex-col items-center text-center mb-16">
                        <div className="size-16 rounded-2xl bg-primary/20 flex items-center justify-center mb-6 border border-primary/30 text-primary">
                            <ShieldCheck size={32} />
                        </div>
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Engineered for Maintainability</h2>
                        <p className="text-slate-400 max-w-2xl font-light">We don't just generate code; we generate code that your team will actually want to use and scale.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            {
                                icon: <Code2 className="text-primary" />,
                                title: "Clean Tailwind Tokens",
                                desc: "No magic numbers. Every spacing, color, and shadow is mapped to your design system's consistent tokens."
                            },
                            {
                                icon: <Layers className="text-primary" />,
                                title: "Modular Components",
                                desc: "Generated code is split into logical, reusable components following modern React and TypeScript best practices."
                            },
                            {
                                icon: <Sparkles className="text-primary" />,
                                title: "Semantic & Accessible",
                                desc: "Accessibility isn't an afterthought. We generate ARIA-compliant, semantic HTML5 layouts by default."
                            }
                        ].map((item, i) => (
                            <div key={i} className="glass p-8 rounded-2xl border border-white/10 hover:border-primary/50 transition-colors group">
                                <div className="size-12 rounded-xl bg-white/5 flex items-center justify-center mb-6 group-hover:bg-primary/10 transition-colors">
                                    {item.icon}
                                </div>
                                <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                                <p className="text-slate-400 text-sm leading-relaxed font-light">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Footer CTA Banner */}
            <footer className="py-24 px-6 lg:px-20">
                <div className="max-w-[1200px] mx-auto rounded-[2.5rem] bg-gradient-to-br from-primary to-blue-800 p-12 md:p-20 text-center relative overflow-hidden group border border-white/10">
                    <div className="absolute inset-0 opacity-10 pointer-events-none mix-blend-overlay bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
                    <div className="relative z-10">
                        <h2 className="text-4xl md:text-5xl font-bold text-white mb-8 tracking-tighter">Start Turning Designs Into Code</h2>
                        <p className="text-blue-100 text-lg md:text-xl max-w-xl mx-auto mb-12 opacity-80 font-medium font-light">
                            Join over {stats.total > 0 ? stats.total.toLocaleString() : '10,000'}+ developers shipping faster than ever before.
                        </p>
                        <div className="flex flex-wrap justify-center gap-4">
                            <button
                                onClick={handleJoinClick}
                                className="px-10 py-5 bg-primary text-stone-900 rounded-xl font-semibold text-lg hover:bg-lime-500 transition-all shadow-2xl active:scale-95"
                            >
                                Join Waitlist Now
                            </button>
                            <button className="px-10 py-5 bg-black/20 text-white rounded-xl font-semibold text-lg hover:bg-black/30 transition-all backdrop-blur-sm border border-white/20 active:scale-95">
                                Explore Vision
                            </button>
                        </div>
                    </div>
                </div>
                <div className="max-w-[1200px] mx-auto mt-24 flex flex-col md:flex-row justify-between items-center gap-8 border-t border-white/10 pt-12">
                    <div className="flex items-center gap-3">
                        <NoirLogo className="size-6 text-primary" />
                        <h2 className="text-lg font-semibold tracking-tight glow-text uppercase">NOIR AI</h2>
                    </div>
                    <p className="text-slate-500 text-sm font-light">© 2026 NOIR AI Systems. Built for the future of development.</p>
                    <div className="flex gap-6">
                        <a className="text-slate-400 hover:text-white transition-colors" href="#"><span className="material-symbols-outlined">public</span></a>
                        <a className="text-slate-400 hover:text-white transition-colors" href="#"><span className="material-symbols-outlined">alternate_email</span></a>
                        <a className="text-slate-400 hover:text-white transition-colors" href="#"><span className="material-symbols-outlined">terminal</span></a>
                    </div>
                </div>
            </footer>
        </div>
    );
};
