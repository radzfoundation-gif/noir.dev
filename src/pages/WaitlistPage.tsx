import React, { useState } from 'react';
import { User, Mail, ArrowRight, Infinity, Twitter, Instagram } from 'lucide-react';

export const WaitlistPage = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Mock submission
        setTimeout(() => setSubmitted(true), 1000);
    };

    return (
        <div className="bg-black text-neutral-300 min-h-screen flex flex-col antialiased selection:bg-lime-400 selection:text-black overflow-x-hidden relative font-sans">
            {/* Background Effects */}
            <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
                <div className="absolute -top-[20%] left-[20%] w-[600px] h-[600px] bg-lime-500/10 rounded-full blur-[120px] mix-blend-screen opacity-50"></div>
                <div className="absolute top-[40%] -right-[10%] w-[500px] h-[500px] bg-lime-900/10 rounded-full blur-[100px] mix-blend-screen opacity-30"></div>
            </div>

            {/* Navigation */}
            <nav className="w-full max-w-5xl mx-auto px-6 py-6 flex justify-between items-center z-50">
                <div className="flex items-center gap-2 group cursor-pointer">
                    <div className="w-6 h-6 bg-lime-400 rounded-sm flex items-center justify-center text-black">
                        <Infinity size={16} strokeWidth={2} />
                    </div>
                    <span className="text-white font-medium tracking-tighter text-lg group-hover:text-lime-400 transition-colors duration-300">NOIR CODE</span>
                </div>
                <div>
                    <a href="#" className="text-xs font-medium text-neutral-400 hover:text-white transition-colors">Contact Us</a>
                </div>
            </nav>

            {/* Main Content */}
            <main className="flex-grow flex flex-col justify-center items-center px-6 py-12 relative z-10 w-full max-w-xl mx-auto">
                {/* Header Text */}
                <div className="text-center mb-10 space-y-4">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-neutral-800 bg-neutral-900/50 backdrop-blur-sm mb-4">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-lime-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-lime-500"></span>
                        </span>
                        <span className="text-xs font-medium text-lime-400 tracking-wide uppercase">Limited Access</span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-medium text-white tracking-tight leading-[1.1]">
                        The future of <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-lime-300 to-lime-600">digital creativity.</span>
                    </h1>
                    <p className="text-neutral-500 text-sm md:text-base max-w-md mx-auto leading-relaxed">
                        Secure your unique username before the public launch. Join the ecosystem re-defining boundaries.
                    </p>
                </div>

                {/* Waitlist Form */}
                <div className="w-full bg-neutral-900/30 border border-neutral-800 rounded-2xl p-2 backdrop-blur-xl shadow-2xl shadow-lime-900/5">
                    {!submitted ? (
                        <form className="flex flex-col gap-3 p-4" onSubmit={handleSubmit}>
                            {/* Username Input */}
                            <div className="group relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-neutral-500 group-focus-within:text-lime-400 transition-colors">
                                    <User size={20} strokeWidth={1.5} />
                                </div>
                                <input
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    placeholder="Preferred username"
                                    className="w-full bg-neutral-950 border border-neutral-800 text-white text-sm rounded-lg block pl-10 p-3 outline-none focus:border-lime-500/50 focus:ring-1 focus:ring-lime-500/50 transition-all placeholder:text-neutral-600 font-normal hover:border-neutral-700"
                                    required
                                />
                                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                    <span className="text-xs text-neutral-600 font-mono">@noircode.dev</span>
                                </div>
                            </div>

                            {/* Email Input */}
                            <div className="group relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-neutral-500 group-focus-within:text-lime-400 transition-colors">
                                    <Mail size={20} strokeWidth={1.5} />
                                </div>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="name@company.com"
                                    className="w-full bg-neutral-950 border border-neutral-800 text-white text-sm rounded-lg block pl-10 p-3 outline-none focus:border-lime-500/50 focus:ring-1 focus:ring-lime-500/50 transition-all placeholder:text-neutral-600 font-normal hover:border-neutral-700"
                                    required
                                />
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                className="w-full group relative flex items-center justify-center gap-2 bg-lime-400 hover:bg-lime-300 text-black font-medium py-3 px-4 rounded-lg transition-all duration-300 shadow-[0_0_20px_-5px_rgba(163,230,53,0.4)] hover:shadow-[0_0_25px_-5px_rgba(163,230,53,0.6)] text-sm mt-1"
                            >
                                <span>Join Waitlist</span>
                                <ArrowRight size={18} strokeWidth={1.5} className="group-hover:translate-x-1 transition-transform" />
                            </button>

                            {/* Terms */}
                            <p className="text-center text-[10px] text-neutral-600 mt-2">
                                By joining, you agree to our <a href="#" className="underline hover:text-neutral-400">Terms of Service</a>.
                            </p>
                        </form>
                    ) : (
                        <div className="p-8 text-center animate-in fade-in zoom-in duration-500">
                            <div className="w-16 h-16 bg-lime-500/10 rounded-full flex items-center justify-center mx-auto mb-4 text-lime-400 border border-lime-500/20">
                                <Infinity size={32} strokeWidth={1.5} />
                            </div>
                            <h3 className="text-xl font-medium text-white mb-2">You're on the list!</h3>
                            <p className="text-neutral-400 text-sm mb-6 max-w-xs mx-auto">
                                Thanks for joining, <span className="text-lime-400 font-bold">@{username}</span>. We will notify you at <span className="text-white">{email}</span> when your spot is ready.
                            </p>
                            <button
                                onClick={() => setSubmitted(false)}
                                className="text-xs text-neutral-500 hover:text-white underline"
                            >
                                Back to home
                            </button>
                        </div>
                    )}
                </div>

                {/* Social Proof / Footer Elements */}
                <div className="mt-12 flex flex-col items-center gap-4">
                    <div className="flex -space-x-3">
                        <div className="w-8 h-8 rounded-full border border-black bg-neutral-800 flex items-center justify-center overflow-hidden">
                            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="avatar" className="w-full h-full opacity-80 grayscale" />
                        </div>
                        <div className="w-8 h-8 rounded-full border border-black bg-neutral-800 flex items-center justify-center overflow-hidden">
                            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka" alt="avatar" className="w-full h-full opacity-80 grayscale" />
                        </div>
                        <div className="w-8 h-8 rounded-full border border-black bg-neutral-800 flex items-center justify-center overflow-hidden">
                            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Zack" alt="avatar" className="w-full h-full opacity-80 grayscale" />
                        </div>
                        <div className="w-8 h-8 rounded-full border border-black bg-neutral-900 flex items-center justify-center text-[10px] font-medium text-white">
                            +2k
                        </div>
                    </div>
                    <p className="text-xs text-neutral-500 font-medium">Join 2,000+ other creators</p>
                </div>
            </main>

            {/* Footer */}
            <footer className="w-full py-8 border-t border-neutral-900 mt-auto bg-black relative z-20">
                <div className="max-w-5xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
                    <span className="text-xs text-neutral-600 tracking-tight">© 2026 Noir Code Inc. All rights reserved.</span>
                    <div className="flex gap-4">
                        <a href="#" className="text-neutral-600 hover:text-lime-400 transition-colors">
                            <Twitter size={18} strokeWidth={1.5} />
                        </a>
                        <a href="#" className="text-neutral-600 hover:text-lime-400 transition-colors">
                            <Instagram size={18} strokeWidth={1.5} />
                        </a>
                    </div>
                </div>
            </footer>
        </div>
    );
};
