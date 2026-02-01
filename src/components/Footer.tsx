import React from 'react';
import { NoirLogo } from './NoirLogo';

export const Footer: React.FC = () => {
    return (
        <footer
            className="border-t border-white/5 bg-black pt-32 pb-16 mt-0 relative overflow-hidden"
            style={{
                backgroundImage: `url('/footer-bg.png')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat'
            }}
        >
            <div className="absolute inset-0 bg-black/20 pointer-events-none"></div>
            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="flex flex-col items-center justify-center gap-8">

                    {/* Large Centered Logo */}
                    <div className="flex items-center gap-4 opacity-90 hover:opacity-100 transition-opacity">
                        <NoirLogo className="size-16 md:size-24" />
                        <span className="text-4xl md:text-6xl font-bold text-white tracking-tighter">noir</span>
                    </div>

                    {/* Navigation & Socials */}
                    <div className="flex flex-wrap items-center justify-center gap-6 md:gap-8 mt-4">
                        <a href="#" className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors text-white">
                            <span className="material-symbols-outlined text-xl">smart_display</span> {/* Youtube */}
                        </a>
                        <a href="#" className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors text-white">
                            <span className="material-symbols-outlined text-xl">alternate_email</span> {/* X/Twitter */}
                        </a>
                        <a href="#" className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors text-white">
                            <span className="material-symbols-outlined text-xl">discord</span> {/* Discord */}
                        </a>

                        <div className="w-px h-6 bg-white/20 mx-2 hidden md:block"></div>

                        <a href="#" className="text-sm font-medium text-white/80 hover:text-white transition-colors">Terms</a>
                        <a href="#" className="text-sm font-medium text-white/80 hover:text-white transition-colors">Privacy</a>
                    </div>

                    {/* Copyright at very bottom */}
                    <div className="mt-8 text-xs font-medium text-white/50 tracking-wide">
                        © 2026 NOIR USA Inc.
                    </div>
                </div>
            </div>
        </footer>
    );
};
