import React from 'react';
import { Navbar } from './Navbar';
import { Footer } from './Footer';

interface LayoutProps {
    children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
    return (
        <div className="min-h-screen bg-black text-zinc-300 font-sans selection:bg-lime-500/30 selection:text-lime-200">
            <Navbar />
            <main className="relative z-10 w-full min-h-screen">
                {children}
            </main>
            <Footer />
        </div>
    );
};
