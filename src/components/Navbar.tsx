import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogIn, LogOut, User } from 'lucide-react';
import { NoirLogo } from './NoirLogo';
import { useAuth } from '../context/AuthContext';
import clsx from 'clsx';

export const Navbar: React.FC = () => {
    const [scrolled, setScrolled] = useState(false);
    const { user, signOut } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleLogout = async () => {
        await signOut();
        navigate('/');
    };

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
                    <Link to="/editor" className="hover:text-lime-400 transition-colors">Start Building</Link>
                    <Link to="/how-it-works" className="hover:text-lime-400 transition-colors">How it works</Link>
                    <Link to="/pricing" className="hover:text-lime-400 transition-colors">Pricing</Link>
                    {user && <Link to="/projects" className="hover:text-lime-400 transition-colors">My Projects</Link>}
                    <a href="#" className="hover:text-lime-400 transition-colors">Documentation</a>
                </div>

                <div className="flex items-center gap-4">
                    {user ? (
                        <div className="flex items-center gap-3">
                            <Link to="/projects" className="flex items-center justify-center size-9 rounded-full bg-white/5 border border-white/10 hover:bg-lime-500/20 hover:border-lime-500/50 hover:text-lime-400 text-white/80 transition-all" title="My Projects">
                                <User size={18} />
                            </Link>
                            <button
                                onClick={handleLogout}
                                className="group px-4 py-2 text-sm font-semibold text-white/80 bg-white/5 border border-white/10 rounded-full hover:bg-red-500/20 hover:border-red-500/30 hover:text-red-400 transition-all"
                            >
                                <span className="flex items-center gap-2">
                                    Logout
                                    <LogOut size={16} strokeWidth={2} />
                                </span>
                            </button>
                        </div>
                    ) : (
                        <Link to="/login" className="group relative px-4 py-2 text-sm font-semibold text-black bg-lime-400 rounded-full hover:bg-lime-300 transition-all overflow-hidden shadow-[0_0_20px_rgba(163,230,53,0.3)] hover:shadow-[0_0_30px_rgba(163,230,53,0.5)]">
                            <span className="relative z-10 flex items-center gap-2">
                                Login
                                <LogIn size={16} strokeWidth={2} className="group-hover:translate-x-0.5 transition-transform" />
                            </span>
                        </Link>
                    )}
                </div>
            </div>
        </nav>
    );
};

