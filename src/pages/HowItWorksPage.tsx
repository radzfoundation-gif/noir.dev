import React from 'react';
import { Link } from 'react-router-dom';

export const HowItWorksPage = () => {
    return (
        <div className="bg-[#f5f8f6] dark:bg-[#0a0f0b] font-display text-slate-900 dark:text-white transition-colors duration-300 dark">
            <style>{`
                .glow-border {
                    box-shadow: 0 0 15px rgba(37, 244, 106, 0.1);
                }
                .neon-text-glow {
                    text-shadow: 0 0 10px rgba(37, 244, 106, 0.5);
                }
                .scan-line {
                    height: 2px;
                    background: linear-gradient(90deg, transparent, #25f46a, transparent);
                    position: absolute;
                    width: 100%;
                    top: 50%;
                }
            `}</style>

            {/* Navigation */}
            <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-[#0a0f0b]/80 backdrop-blur-md px-6 py-4">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <Link to="/" className="flex items-center gap-3">
                        <div className="size-8 bg-[#25f46a] rounded flex items-center justify-center">
                            <span className="material-symbols-outlined text-[#0a0f0b] font-bold">terminal</span>
                        </div>
                        <h2 className="text-xl font-bold tracking-tight uppercase text-white">Noir Code</h2>
                    </Link>
                    <nav className="hidden md:flex items-center gap-10">
                        <a className="text-sm font-medium hover:text-[#25f46a] transition-colors" href="#">Product</a>
                        <Link className="text-sm font-medium text-[#25f46a] underline underline-offset-8" to="/how-it-works">How it works</Link>
                        <Link className="text-sm font-medium hover:text-[#25f46a] transition-colors" to="/pricing">Pricing</Link>
                        <a className="text-sm font-medium hover:text-[#25f46a] transition-colors" href="#">Docs</a>
                    </nav>
                    <Link to="/register" className="bg-[#25f46a] text-[#0a0f0b] px-5 py-2 rounded-lg font-bold text-sm hover:brightness-110 transition-all">
                        Get Started
                    </Link>
                </div>
            </header>

            <main className="relative">
                {/* Hero Section */}
                <section className="relative pt-20 pb-16 px-6 overflow-hidden">
                    <div className="max-w-4xl mx-auto text-center relative z-10">
                        <span className="inline-block px-4 py-1 rounded-full border border-[#25f46a]/30 bg-[#25f46a]/10 text-[#25f46a] text-xs font-bold tracking-widest uppercase mb-6">Process Pipeline</span>
                        <h1 className="text-5xl md:text-7xl font-black leading-none tracking-tighter mb-6 uppercase text-white">
                            From Pixels to <br /><span className="text-[#25f46a] italic">Production</span>
                        </h1>
                        <p className="text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
                            Noir Code leverages proprietary neural engines to deconstruct your visual designs into clean, scalable React components with Tailwind CSS utility classes.
                        </p>
                    </div>
                    {/* Decorative background element */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-[#25f46a]/10 blur-[120px] rounded-full pointer-events-none"></div>
                </section>

                {/* Vertical Timeline Steps */}
                <section className="max-w-6xl mx-auto px-6 py-20">
                    <div className="relative">
                        {/* Center Line */}
                        <div className="absolute left-1/2 top-0 bottom-0 w-[1px] bg-gradient-to-b from-[#25f46a] via-[#25f46a]/50 to-transparent hidden lg:block"></div>

                        {/* Step 1 */}
                        <div className="relative flex flex-col lg:flex-row items-center gap-12 mb-32 group">
                            <div className="flex-1 lg:text-right">
                                <div className="inline-flex items-center justify-center size-14 rounded-xl bg-[#25f46a] text-[#0a0f0b] text-2xl font-black mb-6 glow-border">01</div>
                                <h3 className="text-3xl font-bold mb-4 text-white">Upload Your Screenshot</h3>
                                <p className="text-slate-400 leading-relaxed text-lg">
                                    Drag and drop any UI design, hand-drawn sketch, or high-fidelity mockup directly into our engine. We support PNG, JPG, and Figma exports.
                                </p>
                            </div>
                            <div className="flex-1 w-full">
                                <div className="relative aspect-video rounded-xl border border-white/10 bg-zinc-900/50 p-4 flex items-center justify-center overflow-hidden group-hover:border-[#25f46a]/50 transition-colors">
                                    <div className="w-full h-full border-2 border-dashed border-white/10 rounded-lg flex flex-col items-center justify-center gap-4 bg-zinc-900/40">
                                        <span className="material-symbols-outlined text-4xl text-[#25f46a]/40 group-hover:text-[#25f46a] transition-all scale-125">cloud_upload</span>
                                        <div className="text-xs font-mono text-slate-500 uppercase tracking-widest">drop_image_here.zip</div>
                                    </div>
                                    {/* Small floating preview UI */}
                                    <div className="absolute top-8 right-8 w-24 h-32 bg-zinc-800 rounded shadow-2xl rotate-12 border border-white/10 flex items-center justify-center">
                                        <span className="material-symbols-outlined text-slate-600">image</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Step 2 */}
                        <div className="relative flex flex-col lg:flex-row-reverse items-center gap-12 mb-32 group">
                            <div className="flex-1 lg:text-left">
                                <div className="inline-flex items-center justify-center size-14 rounded-xl bg-[#25f46a] text-[#0a0f0b] text-2xl font-black mb-6 glow-border">02</div>
                                <h3 className="text-3xl font-bold mb-4 text-white">AI-Powered Analysis</h3>
                                <p className="text-slate-400 leading-relaxed text-lg">
                                    Our neural engine identifies layouts, flexbox patterns, typography scales, and color palettes. It maps visual components to functional code structures in real-time.
                                </p>
                            </div>
                            <div className="flex-1 w-full">
                                <div className="relative aspect-video rounded-xl border border-white/10 bg-zinc-900 p-8 flex items-center justify-center overflow-hidden group-hover:border-[#25f46a]/50 transition-colors">
                                    <div className="grid grid-cols-3 gap-4 w-full h-full">
                                        <div className="col-span-2 bg-zinc-800/50 rounded p-4 relative overflow-hidden">
                                            <div className="w-full h-4 bg-[#25f46a]/20 rounded mb-4"></div>
                                            <div className="flex gap-2">
                                                <div className="size-12 bg-zinc-700 rounded-full"></div>
                                                <div className="flex-1 space-y-2">
                                                    <div className="h-3 w-full bg-zinc-700 rounded"></div>
                                                    <div className="h-3 w-2/3 bg-zinc-700 rounded"></div>
                                                </div>
                                            </div>
                                            {/* Scan line effect */}
                                            <div className="absolute inset-0 bg-[#25f46a]/5 animate-pulse"></div>
                                            <div className="scan-line"></div>
                                        </div>
                                        <div className="space-y-4">
                                            <div className="h-1/3 bg-zinc-800/50 rounded flex items-center justify-center"><span className="material-symbols-outlined text-[#25f46a]/40">analytics</span></div>
                                            <div className="h-1/3 bg-zinc-800/50 rounded flex items-center justify-center"><span className="material-symbols-outlined text-[#25f46a]/40">data_object</span></div>
                                            <div className="h-1/3 bg-[#25f46a]/10 rounded flex items-center justify-center border border-[#25f46a]/20"><span className="material-symbols-outlined text-[#25f46a]">check_circle</span></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Step 3 */}
                        <div className="relative flex flex-col lg:flex-row items-center gap-12 group">
                            <div className="flex-1 lg:text-right">
                                <div className="inline-flex items-center justify-center size-14 rounded-xl bg-[#25f46a] text-[#0a0f0b] text-2xl font-black mb-6 glow-border">03</div>
                                <h3 className="text-3xl font-bold mb-4 text-white">Export Clean Code</h3>
                                <p className="text-slate-400 leading-relaxed text-lg">
                                    Receive a ZIP file with modular React components, clean Tailwind utility classes, and optimized assets. Ready for production, zero bloat.
                                </p>
                            </div>
                            <div className="flex-1 w-full">
                                <div className="relative aspect-video rounded-xl border border-white/10 bg-[#1e1e1e] shadow-2xl overflow-hidden group-hover:border-[#25f46a]/50 transition-colors">
                                    {/* Code Editor Header */}
                                    <div className="h-8 bg-zinc-800 flex items-center px-4 gap-2">
                                        <div className="size-2.5 rounded-full bg-red-500"></div>
                                        <div className="size-2.5 rounded-full bg-amber-500"></div>
                                        <div className="size-2.5 rounded-full bg-emerald-500"></div>
                                        <span className="ml-4 text-[10px] font-mono text-slate-500">App.tsx — NoirCode_Output</span>
                                    </div>
                                    {/* Code Body */}
                                    <div className="p-6 font-mono text-sm space-y-2">
                                        <div className="flex gap-4">
                                            <span className="text-slate-600">1</span>
                                            <div><span className="text-purple-400">import</span> <span className="text-blue-300">React</span> <span className="text-purple-400">from</span> <span class="text-orange-300">'react'</span>;</div>
                                        </div>
                                        <div className="flex gap-4">
                                            <span className="text-slate-600">2</span>
                                            <div><span className="text-purple-400">export const</span> <span className="text-yellow-200">Navbar</span> = () <span className="text-purple-400">=&gt;</span> (</div>
                                        </div>
                                        <div className="flex gap-4">
                                            <span className="text-slate-600">3</span>
                                            <div className="ml-4"><span className="text-blue-300">&lt;div</span> <span className="text-emerald-400">className</span>=<span className="text-orange-300">"flex items-center"</span><span className="text-blue-300">&gt;</span></div>
                                        </div>
                                        <div className="flex gap-4">
                                            <span className="text-slate-600">4</span>
                                            <div className="ml-8"><span className="text-blue-300">&lt;Logo</span> <span className="text-emerald-400">size</span>={'{'}<span className="text-orange-300">24</span>{'}'} <span className="text-blue-300">/&gt;</span></div>
                                        </div>
                                        <div className="flex gap-4">
                                            <span className="text-slate-600">5</span>
                                            <div className="ml-4"><span className="text-blue-300">&lt;/div&gt;</span></div>
                                        </div>
                                        <div className="flex gap-4">
                                            <span className="text-slate-600">6</span>
                                            <div>);</div>
                                        </div>
                                        {/* Blinking cursor */}
                                        <div className="inline-block w-2 h-5 bg-[#25f46a] ml-16 animate-pulse"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="py-24 px-6 border-t border-white/5 bg-gradient-to-b from-transparent to-[#25f46a]/5">
                    <div className="max-w-4xl mx-auto rounded-3xl p-12 text-center border border-[#25f46a]/20 bg-[#0a0f0b] relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-8 opacity-10">
                            <span className="material-symbols-outlined text-[120px] text-[#25f46a]">auto_fix_high</span>
                        </div>
                        <h2 className="text-4xl md:text-5xl font-black mb-6 uppercase tracking-tight text-white">Ready to start?</h2>
                        <p className="text-slate-400 text-lg mb-10 max-w-xl mx-auto">
                            Join over 10,000 developers turning designs into code faster than ever before.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Link to="/register" className="w-full sm:w-auto min-w-[240px] bg-[#25f46a] text-[#0a0f0b] font-black py-4 px-8 rounded-xl text-lg hover:scale-105 active:scale-95 transition-all glow-border">
                                Transform Your First Image
                            </Link>
                            <button className="w-full sm:w-auto py-4 px-8 rounded-xl font-bold border border-white/10 hover:bg-white/5 transition-all text-white">
                                View Demo Project
                            </button>
                        </div>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="py-12 px-6 border-t border-white/5 text-center">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-8">
                        <div className="flex items-center gap-3">
                            <div className="size-6 bg-[#25f46a] rounded-sm flex items-center justify-center">
                                <span className="material-symbols-outlined text-[#0a0f0b] font-bold text-xs">terminal</span>
                            </div>
                            <h2 className="text-sm font-bold uppercase tracking-widest text-white">Noir Code</h2>
                        </div>
                        <div className="flex gap-8 text-xs font-mono uppercase text-slate-500">
                            <a className="hover:text-[#25f46a] transition-colors" href="#">Twitter</a>
                            <a className="hover:text-[#25f46a] transition-colors" href="#">GitHub</a>
                            <a className="hover:text-[#25f46a] transition-colors" href="#">Discord</a>
                        </div>
                    </div>
                    <p className="text-[10px] text-slate-600 font-mono">
                        © 2024 NOIR CODE ENGINE. ALL RIGHTS RESERVED. // ENCRYPTED_TRANSMISSION
                    </p>
                </div>
            </footer>
        </div>
    );
};
