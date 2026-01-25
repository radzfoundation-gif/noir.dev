import { useState } from 'react';
import { Upload, Wand2, MessageSquareCode, Download } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';

const STEPS = [
    {
        id: 1,
        title: "Input Vision",
        description: "Describe your idea or paste a screenshot.",
        details: "Capture your requirements naturally. Whether it's a rough sketch on a napkin or a detailed PRD, Noir interprets your intent with high-fidelity understanding.",
        icon: Upload,
        color: "bg-blue-500",
        imageGradient: "from-blue-500/20 to-cyan-500/20"
    },
    {
        id: 2,
        title: "AI Architect",
        description: "Noir generates production-ready code instantly.",
        details: "Our multi-agent system breaks down your request. One agent plans the component structure, another writes the logic, and a third polishes the styles.",
        icon: Wand2,
        color: "bg-purple-500",
        imageGradient: "from-purple-500/20 to-pink-500/20"
    },
    {
        id: 3,
        title: "Refine Context",
        description: "Select snippets to tweak and perfect details.",
        details: "Click any part of the preview to select the underlying code, then give specific instructions like 'fix this padding' or 'use a darker shade'.",
        icon: MessageSquareCode,
        color: "bg-lime-500",
        imageGradient: "from-lime-500/20 to-emerald-500/20"
    },
    {
        id: 4,
        title: "Ship It",
        description: "Export clean React/Tailwind code ready to deploy.",
        details: "Noir exports standard React & Tailwind CSS that drops directly into your existing project—no lock-in, no black boxes.",
        icon: Download,
        color: "bg-orange-500",
        imageGradient: "from-orange-500/20 to-red-500/20"
    }
];

export const HowToUse = () => {
    const [selectedId, setSelectedId] = useState<number | null>(null);

    const handleCardClick = (id: number) => {
        setSelectedId(selectedId === id ? null : id);
    };

    return (
        <section className="py-32 px-6 border-t border-white/5 bg-black relative">
            <div className="max-w-6xl mx-auto">
                <div className="mb-20">
                    <h2 className="text-3xl md:text-5xl font-bold text-white mb-4 tracking-tight">
                        Workflow
                    </h2>
                    <p className="text-zinc-500 max-w-md text-lg font-light">
                        A seamless path from concept to codebase.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-start">
                    {STEPS.map((step) => {
                        const Icon = step.icon;
                        const isSelected = selectedId === step.id;
                        const isDimmed = selectedId !== null && selectedId !== step.id;

                        return (
                            <motion.div
                                key={step.id}
                                layout
                                onClick={() => handleCardClick(step.id)}
                                className={clsx(
                                    "relative rounded-3xl p-6 flex flex-col transition-colors duration-500 ease-out border cursor-pointer overflow-hidden group",
                                    isSelected
                                        ? "bg-zinc-900 border-white/20 shadow-2xl col-span-1 md:col-span-1 z-10"
                                        : "bg-black border-zinc-900/50 hover:bg-zinc-900/30 hover:border-zinc-800",
                                    isDimmed && "opacity-40 blur-[1px] hover:opacity-100 hover:blur-none"
                                )}
                                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            >
                                {/* Active Gradient Background */}
                                {isSelected && (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className={`absolute inset-0 bg-gradient-to-b ${step.imageGradient} opacity-30 pointer-events-none`}
                                    />
                                )}

                                <div className="relative z-10">
                                    {/* Header Part */}
                                    <div className="flex items-start justify-between mb-4">
                                        <div className={clsx(
                                            "w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-300",
                                            isSelected ? "bg-white text-black" : "bg-zinc-900 text-zinc-600 group-hover:text-zinc-400"
                                        )}>
                                            <Icon size={18} strokeWidth={2} />
                                        </div>
                                        <span className="font-mono text-xs font-bold text-zinc-700 select-none">0{step.id}</span>
                                    </div>

                                    <h3 className={clsx(
                                        "text-lg font-bold mb-2 transition-colors duration-300",
                                        isSelected ? "text-white" : "text-zinc-500 group-hover:text-zinc-300"
                                    )}>
                                        {step.title}
                                    </h3>

                                    <p className={clsx(
                                        "text-sm leading-relaxed transition-colors duration-300",
                                        isSelected ? "text-zinc-300" : "text-zinc-700 group-hover:text-zinc-600"
                                    )}>
                                        {step.description}
                                    </p>

                                    {/* Expanded Details */}
                                    <div className="overflow-hidden">
                                        <AnimatePresence>
                                            {isSelected && (
                                                <motion.div
                                                    initial={{ opacity: 0, height: 0, marginTop: 0 }}
                                                    animate={{ opacity: 1, height: 'auto', marginTop: 16 }}
                                                    exit={{ opacity: 0, height: 0, marginTop: 0 }}
                                                    className="origin-top"
                                                >
                                                    <div className="pt-4 border-t border-white/10">
                                                        <p className="text-sm text-zinc-400 leading-relaxed font-light mb-4">
                                                            {step.details}
                                                        </p>

                                                        {/* Mini Visual */}
                                                        <div className="w-full h-24 rounded-lg bg-black/50 border border-white/5 flex items-center justify-center overflow-hidden relative">
                                                            <div className={`absolute inset-0 bg-gradient-to-tr ${step.imageGradient} opacity-20`}></div>
                                                            <Icon size={32} className="text-white/20" />
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};
