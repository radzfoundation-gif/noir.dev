import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { NoirLogo } from '../components/NoirLogo';

const API_URL = import.meta.env.VITE_API_URL || '';

export const WaitlistJoinPage = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [errorMsg, setErrorMsg] = useState('');
    const navigate = useNavigate();

    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMsg('');
        try {
            const res = await fetch(`${API_URL}/api/waitlist/join`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email })
            });

            const data = await res.json();

            if (res.ok) {
                navigate('/success', { state: { name } });
            } else {
                setErrorMsg(data.error || "Gagal bergabung. Silakan coba lagi.");
            }
        } catch (err) {
            console.error("Join failed", err);
            setErrorMsg("Gagal terhubung ke server.");
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-background-dark font-sans text-white selection:bg-primary/30 min-h-screen relative flex flex-col"
        >
            <div className="fixed inset-0 pointer-events-none opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, #1e293b 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>
            <div className="fixed inset-0 pointer-events-none" style={{ background: 'radial-gradient(circle at center, rgba(6, 99, 249, 0.1) 0%, rgba(10, 10, 11, 0) 70%)' }}></div>

            {/* Moving background blobs */}
            <motion.div
                animate={{
                    x: [-50, 50, -50],
                    y: [-30, 30, -30],
                }}
                transition={{
                    duration: 15,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
                className="fixed top-1/4 left-1/4 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none z-0"
            />
            <motion.div
                animate={{
                    x: [50, -50, 50],
                    y: [30, -30, 30],
                }}
                transition={{
                    duration: 12,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
                className="fixed bottom-1/4 right-1/4 w-[400px] h-[400px] bg-indigo-600/10 rounded-full blur-[100px] pointer-events-none z-0"
            />

            <main className="flex-1 flex flex-col items-center justify-center px-4 py-12 lg:py-20 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col items-center gap-6 mb-12"
                >
                    <div className="cursor-pointer flex flex-col items-center gap-3" onClick={() => navigate('/')}>
                        <NoirLogo className="size-12" />
                        <h2 className="text-2xl font-bold tracking-tighter">Noir</h2>
                    </div>
                </motion.div>

                <div className="max-w-3xl text-center mb-12">
                    <h1 className="text-white tracking-tight text-4xl md:text-6xl font-bold leading-tight pb-4">
                        The Future of Web Design is <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-400">Autonomous.</span>
                    </h1>
                    <p className="text-slate-400 text-lg md:text-xl font-light leading-relaxed max-w-2xl mx-auto">
                        Build production-ready sites with AI in seconds. Join the exclusive early access list to shape the next era of the web.
                    </p>
                </div>

                <div className="w-full max-w-5xl bg-zinc-900/50 backdrop-blur-xl rounded-xl border border-white/10 overflow-hidden shadow-2xl flex flex-col lg:flex-row">
                    <div className="flex-1 p-8 lg:p-12 border-b lg:border-b-0 lg:border-r border-white/5">
                        <h3 className="text-xl font-medium mb-6">Reserve your spot</h3>

                        {errorMsg && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm font-medium"
                            >
                                {errorMsg}
                            </motion.div>
                        )}

                        <form className="space-y-5" onSubmit={handleFormSubmit}>
                            <div className="flex flex-col gap-2">
                                <label className="text-xs uppercase tracking-widest font-semibold text-slate-500">Full Name</label>
                                <input
                                    required
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full bg-black border border-white/10 rounded-lg px-4 py-4 text-white placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all font-light"
                                    placeholder="Alex Rivera"
                                    type="text"
                                />
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="text-xs uppercase tracking-widest font-semibold text-slate-500">Work Email</label>
                                <input
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-black border border-white/10 rounded-lg px-4 py-4 text-white placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all font-light"
                                    placeholder="alex@company.com"
                                    type="email"
                                />
                            </div>
                            <button className="w-full py-4 mt-4 bg-gradient-to-r from-blue-600 to-indigo-800 rounded-lg text-white font-semibold text-lg hover:brightness-110 active:scale-[0.98] transition-all shadow-lg shadow-blue-500/20">
                                Join Waitlist
                            </button>
                            <p className="text-[10px] text-center text-slate-500 uppercase tracking-tight font-light">Limited spots available for the initial beta phase</p>
                        </form>
                    </div>
                    <div className="flex-1 p-8 lg:p-12 bg-white/5 flex flex-col justify-center">
                        <h4 className="text-slate-300 font-medium mb-8">What early access gives you:</h4>
                        <ul className="space-y-6">
                            {[
                                { title: 'AI-Driven Layouts', desc: 'Intelligent structural design based on your content intent.' },
                                { title: 'Seamless SEO Integration', desc: 'Built-in semantic tagging and automated meta-optimization.' },
                                { title: 'Zero-Code Customization', desc: 'Deep edit every component through natural language prompts.' },
                                { title: 'Instant Deployment', desc: 'One-click push to global edge networks with SSL included.' }
                            ].map((item, i) => (
                                <motion.li
                                    key={i}
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.1 }}
                                    className="flex items-start gap-4"
                                >
                                    <span className="material-symbols-outlined text-primary bg-primary/10 rounded-lg p-1">check_circle</span>
                                    <div>
                                        <h5 className="font-semibold text-white leading-none">{item.title}</h5>
                                        <p className="text-sm text-slate-400 mt-1 font-light">{item.desc}</p>
                                    </div>
                                </motion.li>
                            ))}
                        </ul>
                    </div>
                </div>
            </main>

            <footer className="w-full px-10 py-12 mt-auto border-t border-white/5 bg-black/50">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
                    <p className="text-slate-500 text-sm">© 2026 Noir Autonomous Web Systems. All rights reserved.</p>
                    <div className="flex gap-8 text-sm text-slate-400 font-medium">
                        <a className="hover:text-white" href="#">Privacy Policy</a>
                        <a className="hover:text-white" href="#">Terms</a>
                        <a className="hover:text-white" href="#">X (Twitter)</a>
                    </div>
                </div>
            </footer>
        </motion.div>
    );
};
