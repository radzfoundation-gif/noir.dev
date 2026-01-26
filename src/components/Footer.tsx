import React from 'react';
import { NoirLogo } from './NoirLogo';

export const Footer: React.FC = () => {
    return (
        <footer className="border-t border-white/5 bg-black pt-16 pb-8 mt-12">
            <div className="max-w-7xl mx-auto px-6">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="flex items-center gap-2">
                        <NoirLogo className="size-8" />
                        <span className="text-sm font-bold text-white tracking-tight">Noir Code</span>
                        <span className="text-xs text-zinc-600 ml-2">© 2026</span>
                    </div>
                    <div className="flex gap-6 text-xs text-zinc-500">
                        <a href="#" className="hover:text-lime-400 transition-colors">Privacy</a>
                        <a href="#" className="hover:text-lime-400 transition-colors">Terms</a>
                        <a href="#" className="hover:text-lime-400 transition-colors">Status</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};
