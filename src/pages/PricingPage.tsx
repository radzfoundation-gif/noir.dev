import { Link } from 'react-router-dom';

export const PricingPage = () => {
    return (
        <div className="bg-[#f5f8f6] dark:bg-[#0a0a0a] min-h-screen font-display text-slate-900 dark:text-white transition-colors duration-300 dark">
            <style>{`
                .tech-grid {
                    background-image: radial-gradient(circle at 1px 1px, #1a2e20 1px, transparent 0);
                    background-size: 40px 40px;
                }
                .pro-glow {
                    box-shadow: 0 0 30px rgba(37, 244, 106, 0.25);
                }
            `}</style>
            <div className="relative min-h-screen flex flex-col overflow-x-hidden tech-grid">
                <header className="w-full border-b border-solid border-slate-200 dark:border-white/10 px-6 lg:px-20 py-4 flex items-center justify-between bg-[#f5f8f6]/80 dark:bg-[#0a0a0a]/80 backdrop-blur-md sticky top-0 z-50">
                    <Link to="/" className="flex items-center gap-3">
                        <div className="text-[#25f46a]">
                            <svg className="w-8 h-8" fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                                <path d="M42.4379 44C42.4379 44 36.0744 33.9038 41.1692 24C46.8624 12.9336 42.2078 4 42.2078 4L7.01134 4C7.01134 4 11.6577 12.932 5.96912 23.9969C0.876273 33.9029 7.27094 44 7.27094 44L42.4379 44Z" fill="currentColor"></path>
                            </svg>
                        </div>
                        <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">Noir Code</h2>
                    </Link>
                    <nav className="hidden md:flex items-center gap-10">
                        <a className="text-sm font-medium hover:text-[#25f46a] transition-colors" href="#">Product</a>
                        <a className="text-sm font-medium hover:text-[#25f46a] transition-colors" href="#">Features</a>
                        <a className="text-sm font-medium hover:text-[#25f46a] transition-colors" href="#">Docs</a>
                        <a className="text-sm font-medium hover:text-[#25f46a] transition-colors" href="#">Showcase</a>
                    </nav>
                    <div className="flex gap-3">
                        <Link to="/login" className="hidden sm:flex h-10 px-5 items-center justify-center rounded-lg border border-slate-300 dark:border-white/20 text-sm font-bold hover:bg-white/5 transition-all text-slate-900 dark:text-white">
                            Log in
                        </Link>
                        <Link to="/register" className="h-10 px-5 items-center justify-center rounded-lg bg-[#25f46a] text-[#0a0a0a] text-sm font-bold hover:brightness-110 transition-all shadow-lg shadow-[#25f46a]/20">
                            Get Started
                        </Link>
                    </div>
                </header>
                <main className="flex-1 flex flex-col items-center py-16 px-6 lg:px-20">
                    <div className="max-w-4xl w-full text-center mb-16">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#25f46a]/10 border border-[#25f46a]/20 text-[#25f46a] text-xs font-bold uppercase tracking-widest mb-6">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#25f46a] opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#25f46a]"></span>
                            </span>
                            Updated Pricing
                        </div>
                        <h1 className="text-5xl md:text-6xl font-black leading-tight tracking-tight mb-6 text-slate-900 dark:text-white">
                            Build Faster for <span className="text-[#25f46a]">Less</span>
                        </h1>
                        <p className="text-slate-600 dark:text-slate-400 text-lg md:text-xl max-w-2xl mx-auto">
                            The most powerful screenshot-to-code engine is now even more accessible. Start for free, upgrade as you grow.
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl w-full items-stretch">
                        <div className="flex flex-col gap-8 rounded-xl border border-slate-200 dark:border-white/10 bg-white/50 dark:bg-[#121212] p-8 transition-transform hover:-translate-y-1">
                            <div className="flex flex-col gap-2">
                                <h3 className="text-lg font-bold">Free</h3>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-4xl font-black tracking-tight">$0</span>
                                    <span className="text-slate-500 dark:text-slate-400 font-medium">/month</span>
                                </div>
                                <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">Perfect for exploration and hobbyists.</p>
                            </div>
                            <button className="w-full h-12 rounded-lg border-2 border-slate-200 dark:border-white/20 font-bold hover:bg-slate-50 dark:hover:bg-white/5 transition-all text-slate-900 dark:text-white">
                                Start Coding
                            </button>
                            <div className="flex flex-col gap-4">
                                <div className="flex gap-3 text-sm items-center">
                                    <span className="material-symbols-outlined text-[#25f46a] text-[20px]">check_circle</span>
                                    5 code generations / mo
                                </div>
                                <div className="flex gap-3 text-sm items-center">
                                    <span className="material-symbols-outlined text-[#25f46a] text-[20px]">check_circle</span>
                                    React & Tailwind output
                                </div>
                                <div className="flex gap-3 text-sm items-center">
                                    <span className="material-symbols-outlined text-[#25f46a] text-[20px]">check_circle</span>
                                    Standard speed
                                </div>
                                <div className="flex gap-3 text-sm items-center">
                                    <span className="material-symbols-outlined text-[#25f46a] text-[20px]">check_circle</span>
                                    Community support
                                </div>
                            </div>
                        </div>
                        <div className="relative flex flex-col gap-8 rounded-xl border-2 border-[#25f46a] bg-white dark:bg-[#161616] p-8 pro-glow transform md:scale-105 z-10">
                            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#25f46a] text-[#0a0a0a] text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full">
                                Most Popular
                            </div>
                            <div className="flex flex-col gap-2">
                                <h3 className="text-lg font-bold">Pro</h3>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-4xl font-black tracking-tight">$3</span>
                                    <span className="text-slate-500 dark:text-slate-400 font-medium">/month</span>
                                </div>
                                <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">Our most affordable professional tier.</p>
                            </div>
                            <button className="w-full h-12 rounded-lg bg-[#25f46a] text-[#0a0a0a] font-bold hover:brightness-110 transition-all shadow-xl shadow-[#25f46a]/20">
                                Go Pro Now
                            </button>
                            <div className="flex flex-col gap-4">
                                <div className="flex gap-3 text-sm items-center font-bold">
                                    <span className="material-symbols-outlined text-[#25f46a] text-[20px] font-bold">check_circle</span>
                                    Unlimited generations
                                </div>
                                <div className="flex gap-3 text-sm items-center font-medium">
                                    <span className="material-symbols-outlined text-[#25f46a] text-[20px] font-bold">check_circle</span>
                                    Priority AI processing
                                </div>
                                <div className="flex gap-3 text-sm items-center font-medium">
                                    <span className="material-symbols-outlined text-[#25f46a] text-[20px] font-bold">check_circle</span>
                                    All frameworks (Vue, Svelte, etc.)
                                </div>
                                <div className="flex gap-3 text-sm items-center font-medium">
                                    <span className="material-symbols-outlined text-[#25f46a] text-[20px] font-bold">check_circle</span>
                                    Advanced component logic
                                </div>
                                <div className="flex gap-3 text-sm items-center font-medium">
                                    <span className="material-symbols-outlined text-[#25f46a] text-[20px] font-bold">check_circle</span>
                                    Early access to beta features
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col gap-8 rounded-xl border border-slate-200 dark:border-white/10 bg-white/50 dark:bg-[#121212] p-8 transition-transform hover:-translate-y-1">
                            <div className="flex flex-col gap-2">
                                <h3 className="text-lg font-bold">Enterprise</h3>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-4xl font-black tracking-tight">Custom</span>
                                </div>
                                <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">Scale with confidence and team controls.</p>
                            </div>
                            <button className="w-full h-12 rounded-lg border-2 border-slate-200 dark:border-white/20 font-bold hover:bg-slate-50 dark:hover:bg-white/5 transition-all text-slate-900 dark:text-white">
                                Contact Sales
                            </button>
                            <div className="flex flex-col gap-4">
                                <div className="flex gap-3 text-sm items-center">
                                    <span className="material-symbols-outlined text-[#25f46a] text-[20px]">check_circle</span>
                                    Team management
                                </div>
                                <div className="flex gap-3 text-sm items-center">
                                    <span className="material-symbols-outlined text-[#25f46a] text-[20px]">check_circle</span>
                                    SSO & SAML
                                </div>
                                <div className="flex gap-3 text-sm items-center">
                                    <span className="material-symbols-outlined text-[#25f46a] text-[20px]">check_circle</span>
                                    Dedicated account manager
                                </div>
                                <div className="flex gap-3 text-sm items-center">
                                    <span className="material-symbols-outlined text-[#25f46a] text-[20px]">check_circle</span>
                                    Custom API limits
                                </div>
                                <div className="flex gap-3 text-sm items-center">
                                    <span className="material-symbols-outlined text-[#25f46a] text-[20px]">check_circle</span>
                                    Enterprise SLA
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="max-w-4xl w-full mt-32 mb-8">
                        <h2 className="text-3xl font-bold tracking-tight text-center text-slate-900 dark:text-white">Frequently Asked Questions</h2>
                    </div>
                    <div className="max-w-3xl w-full flex flex-col gap-3">
                        <details className="group bg-white/5 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl overflow-hidden">
                            <summary className="flex cursor-pointer items-center justify-between p-5 list-none text-slate-900 dark:text-white">
                                <span className="font-bold">What's the difference between Free and Pro?</span>
                                <span className="material-symbols-outlined group-open:rotate-180 transition-transform">expand_more</span>
                            </summary>
                            <div className="px-5 pb-5 text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                                The Free plan allows for 5 generations per month and is limited to React/Tailwind exports. The Pro plan at just $3/month gives you unlimited generations, priority processing, and access to all supported frameworks like Vue and Svelte.
                            </div>
                        </details>
                        <details className="group bg-white/5 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl overflow-hidden">
                            <summary className="flex cursor-pointer items-center justify-between p-5 list-none text-slate-900 dark:text-white">
                                <span className="font-bold">How accurate is the code generation?</span>
                                <span className="material-symbols-outlined group-open:rotate-180 transition-transform">expand_more</span>
                            </summary>
                            <div className="px-5 pb-5 text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                                Our proprietary AI model is trained specifically on UI design patterns. It captures spacing, typography, and component structures with roughly 95% accuracy, requiring only minor functional tweaks.
                            </div>
                        </details>
                        <details className="group bg-white/5 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl overflow-hidden">
                            <summary className="flex cursor-pointer items-center justify-between p-5 list-none text-slate-900 dark:text-white">
                                <span className="font-bold">Can I cancel my subscription at any time?</span>
                                <span className="material-symbols-outlined group-open:rotate-180 transition-transform">expand_more</span>
                            </summary>
                            <div className="px-5 pb-5 text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                                Yes, you can cancel your subscription at any time through your dashboard. You will continue to have access to your plan until the end of your current billing period.
                            </div>
                        </details>
                        <details className="group bg-white/5 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl overflow-hidden">
                            <summary className="flex cursor-pointer items-center justify-between p-5 list-none text-slate-900 dark:text-white">
                                <span className="font-bold">Do you offer team discounts?</span>
                                <span className="material-symbols-outlined group-open:rotate-180 transition-transform">expand_more</span>
                            </summary>
                            <div className="px-5 pb-5 text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                                Absolutely. Teams of 5 or more are eligible for our Enterprise rates which include volume discounts. Contact our sales team for a custom quote.
                            </div>
                        </details>
                    </div>
                </main>
                <footer className="w-full border-t border-slate-200 dark:border-white/10 px-6 lg:px-20 py-12 bg-[#f5f8f6] dark:bg-[#0a0a0a]">
                    <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
                        <div className="flex items-center gap-3">
                            <div className="text-[#25f46a]/50">
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M42.4379 44C42.4379 44 36.0744 33.9038 41.1692 24C46.8624 12.9336 42.2078 4 42.2078 4L7.01134 4C7.01134 4 11.6577 12.932 5.96912 23.9969C0.876273 33.9029 7.27094 44 7.27094 44L42.4379 44Z" fill="currentColor"></path>
                                </svg>
                            </div>
                            <h2 className="text-lg font-bold tracking-tight opacity-50 text-slate-900 dark:text-white">Noir Code</h2>
                        </div>
                        <div className="flex gap-8 text-sm font-medium text-slate-500">
                            <a className="hover:text-[#25f46a] transition-colors" href="#">Privacy Policy</a>
                            <a className="hover:text-[#25f46a] transition-colors" href="#">Terms of Service</a>
                            <a className="hover:text-[#25f46a] transition-colors" href="#">Twitter</a>
                            <a className="hover:text-[#25f46a] transition-colors" href="#">GitHub</a>
                        </div>
                        <div className="text-sm text-slate-500 italic">
                            Built for Developers.
                        </div>
                    </div>
                    <div className="mt-8 text-center text-xs text-slate-400">
                        © 2024 Noir Code Inc. All rights reserved.
                    </div>
                </footer>
            </div>
        </div>
    );
};
