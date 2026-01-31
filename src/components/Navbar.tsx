import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { LogIn } from 'lucide-react';
import { NoirLogo } from './NoirLogo';
import clsx from 'clsx';

export const Navbar: React.FC = () => {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <nav
            className={clsx(
                "fixed top-0 w-full z-50 transition-all duration-300",
                scrolled
                    ? "border-b border-white/5 bg-black/50 backdrop-blur-md py-3"
                    : "border-transparent bg-transparent py-5"
            )}
        >
            <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
                <div className="flex items-center gap-2 drop-shadow-md">
                    <NoirLogo className="size-10" />
                    <span className="text-lg font-bold tracking-tight text-white leading-none">Noir Code</span>
                </div>

                <div className="hidden md:flex items-center gap-8 text-sm font-medium text-white/90 drop-shadow-md">
                    <Link to="/how-it-works" className="hover:text-lime-400 transition-colors">How it works</Link>
                    <Link to="/pricing" className="hover:text-lime-400 transition-colors">Pricing</Link>
                    <a href="#" className="hover:text-lime-400 transition-colors">Documentation</a>
                </div>

                <div className="flex items-center gap-4">
                    <Link to="/login" className="group relative px-4 py-2 text-sm font-semibold text-black bg-lime-400 rounded-full hover:bg-lime-300 transition-all overflow-hidden shadow-[0_0_20px_rgba(163,230,53,0.3)] hover:shadow-[0_0_30px_rgba(163,230,53,0.5)]">
                        <span className="relative z-10 flex items-center gap-2">
                            Login
                            <LogIn size={16} strokeWidth={2} className="group-hover:translate-x-0.5 transition-transform" />
                        </span>
                    </Link>
                </div>
            </div>
        </nav>
    );
};
