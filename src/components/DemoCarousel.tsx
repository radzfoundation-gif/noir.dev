import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, MessageSquareCode, Smartphone } from 'lucide-react';
import clsx from 'clsx';
import { IPhoneMockup } from './IPhoneMockup';

const DEMO_SLIDES = [
    {
        id: 1,
        title: "Instant Code Generation",
        description: "Transform your ideas or screenshots into production-ready React code in seconds. No more boilerplate.",
        icon: Zap,
        content: (
            <div className="w-full h-full bg-[#1e1e1e] rounded-xl overflow-hidden flex flex-col border border-white/10 shadow-2xl">
                <div className="h-8 bg-[#252526] flex items-center px-4 border-b border-white/5 space-x-2">
                    <div className="flex space-x-1.5">
                        <div className="w-3 h-3 rounded-full bg-[#ff5f56]"></div>
                        <div className="w-3 h-3 rounded-full bg-[#ffbd2e]"></div>
                        <div className="w-3 h-3 rounded-full bg-[#27c93f]"></div>
                    </div>
                </div>
                <div className="p-6 font-mono text-xs text-blue-300">
                    <span className="text-pink-400">export const</span> <span className="text-yellow-300">Hero</span> = () ={'>'} {'{'} <br />
                    &nbsp;&nbsp;<span className="text-pink-400">return</span> (<br />
                    &nbsp;&nbsp;&nbsp;&nbsp;&lt;<span className="text-green-400">section</span> <span className="text-purple-300">className</span>="...<br />
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&lt;<span className="text-green-400">h1</span>&gt;Build Faster&lt;/<span className="text-green-400">h1</span>&gt;<br />
                    &nbsp;&nbsp;&nbsp;&nbsp;&lt;/<span className="text-green-400">section</span>&gt;<br />
                    &nbsp;&nbsp;);<br />
                    {'}'};
                </div>
                <div className="mt-auto p-4 bg-[#252526] border-t border-white/5 flex gap-2">
                    <div className="h-2 w-1/3 bg-white/10 rounded animate-pulse"></div>
                    <div className="h-2 w-1/4 bg-white/10 rounded animate-pulse delay-75"></div>
                </div>
            </div>
        )
    },
    {
        id: 2,
        title: "Context-Aware AI Chat",
        description: "Select code to ask questions. Import HTML snippets directly into the chat for precise modifications.",
        icon: MessageSquareCode,
        content: (
            <div className="w-full h-full bg-[#09090b] rounded-xl overflow-hidden relative flex flex-col items-center justify-center border border-white/10 shadow-2xl p-6">
                <div className="absolute top-4 left-4 right-4 bg-zinc-900 border border-zinc-800 rounded-lg p-3 flex items-center justify-between shadow-lg">
                    <div className="flex items-center gap-2">
                        <div className="px-2 py-0.5 rounded bg-lime-500/10 border border-lime-500/20 text-[10px] text-lime-400 font-mono">
                            @html div.hero
                        </div>
                        <span className="text-xs text-zinc-400">Make the background gradient...</span>
                    </div>
                    <div className="w-6 h-6 rounded-full bg-lime-400 flex items-center justify-center text-black">
                        <Zap size={10} fill="currentColor" />
                    </div>
                </div>
                <div className="mt-12 w-full space-y-2">
                    <div className="w-3/4 h-2 bg-zinc-800 rounded mx-auto"></div>
                    <div className="w-1/2 h-2 bg-zinc-800 rounded mx-auto"></div>
                </div>
            </div>
        )
    },
    {
        id: 3,
        title: "Live Mobile Preview",
        description: "Test your responsiveness instantly with our built-in iPhone 17 Pro Max titanium mockup.",
        icon: Smartphone,
        content: (
            <div className="w-full h-full flex items-center justify-center scale-90">
                <IPhoneMockup className="h-[400px] w-[200px] border-[6px]">
                    <div className="w-full h-full bg-white flex flex-col items-center justify-center p-4 text-center">
                        <div className="w-12 h-12 bg-lime-400 rounded-full mb-4 shadow-xl shadow-lime-200"></div>
                        <h3 className="font-bold text-black text-sm mb-1">Mobile First</h3>
                        <p className="text-[10px] text-gray-500">Perfect on every screen.</p>
                        <button className="mt-4 px-4 py-1.5 bg-black text-white text-[10px] rounded-full font-medium">Get Started</button>
                    </div>
                </IPhoneMockup>
            </div>
        )
    }
];

export const DemoCarousel = () => {
    const [currentIndex, setCurrentIndex] = useState(0);

    const nextSlide = () => {
        setCurrentIndex((prev) => (prev + 1) % DEMO_SLIDES.length);
    };

    // Auto-advance
    useEffect(() => {
        const timer = setInterval(nextSlide, 5000);
        return () => clearInterval(timer);
    }, []);

    return (
        <section className="py-24 px-6 relative overflow-hidden">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
                        Built for the <span className="text-lime-400">Speed of Thought</span>
                    </h2>
                    <p className="text-zinc-400 max-w-2xl mx-auto text-lg font-light">
                        Experience a workflow that adapts to you. From concept to code in one fluid motion.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-12 items-center">
                    {/* Text Content */}
                    <div className="space-y-4">
                        {DEMO_SLIDES.map((slide, index) => {
                            const Icon = slide.icon;
                            const isActive = index === currentIndex;

                            return (
                                <button
                                    key={slide.id}
                                    onClick={() => setCurrentIndex(index)}
                                    className={clsx(
                                        "w-full text-left p-6 rounded-2xl transition-all duration-300 border group relative overflow-hidden",
                                        isActive
                                            ? "bg-white/5 border-lime-500/30 shadow-[0_0_30px_rgba(163,230,53,0.05)]"
                                            : "bg-transparent border-transparent hover:bg-white/5 hover:border-white/5"
                                    )}
                                >
                                    {isActive && (
                                        <motion.div
                                            layoutId="active-highlight"
                                            className="absolute left-0 top-0 bottom-0 w-1 bg-lime-500"
                                        />
                                    )}
                                    <div className="flex items-center gap-4 mb-2">
                                        <div className={clsx("p-2 rounded-lg transition-colors", isActive ? "bg-lime-500/10 text-lime-400" : "bg-zinc-800 text-zinc-500")}>
                                            <Icon size={20} />
                                        </div>
                                        <h3 className={clsx("text-lg font-bold transition-colors", isActive ? "text-white" : "text-zinc-500")}>
                                            {slide.title}
                                        </h3>
                                    </div>
                                    <p className={clsx("text-sm transition-colors pl-14 leading-relaxed", isActive ? "text-zinc-400" : "text-zinc-600")}>
                                        {slide.description}
                                    </p>
                                </button>
                            );
                        })}
                    </div>

                    {/* Preview Carousel */}
                    <div className="relative h-[500px] w-full bg-[#0a0a0a] rounded-3xl border border-white/5 overflow-hidden flex items-center justify-center p-8 shadow-2xl">
                        {/* Abstract Background */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-lime-900/10 via-black to-zinc-900/50 opacity-50"></div>

                        <AnimatePresence mode="wait">
                            <motion.div
                                key={currentIndex}
                                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 1.05, y: -20 }}
                                transition={{ type: "spring", duration: 0.5, bounce: 0.2 }}
                                className="relative z-10 w-full h-full"
                            >
                                {DEMO_SLIDES[currentIndex].content}
                            </motion.div>
                        </AnimatePresence>

                        {/* Navigation Dots */}
                        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-20">
                            {DEMO_SLIDES.map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => setCurrentIndex(i)}
                                    className={clsx(
                                        "w-2 h-2 rounded-full transition-all duration-300",
                                        i === currentIndex ? "w-6 bg-lime-400" : "bg-zinc-700 hover:bg-zinc-600"
                                    )}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};
