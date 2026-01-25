import { Link } from 'react-router-dom';
import { Code2, ArrowRight } from 'lucide-react';

export const Navbar: React.FC = () => {
    return (
        <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-black/80 backdrop-blur-xl">
            <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-lime-400 flex items-center justify-center text-black shadow-lg shadow-lime-400/20">
                        <Code2 size={20} strokeWidth={2} />
                    </div>
                    <span className="text-lg font-bold tracking-tight text-white leading-none">Noir Code</span>
                </div>

                <div className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-400">
                    <a href="#" className="hover:text-lime-400 transition-colors">How it works</a>
                    <a href="#" className="hover:text-lime-400 transition-colors">Pricing</a>
                    <a href="#" className="hover:text-lime-400 transition-colors">Documentation</a>
                </div>

                <div className="flex items-center gap-4">
                    <Link to="/waitlist" className="group relative px-4 py-2 text-sm font-semibold text-black bg-lime-400 rounded-full hover:bg-lime-300 transition-all overflow-hidden shadow-[0_0_20px_rgba(163,230,53,0.3)] hover:shadow-[0_0_30px_rgba(163,230,53,0.5)]">
                        <span className="relative z-10 flex items-center gap-2">
                            Join Waitlist
                            <ArrowRight size={16} strokeWidth={2} className="group-hover:translate-x-0.5 transition-transform" />
                        </span>
                    </Link>
                </div>
            </div>
        </nav>
    );
};
