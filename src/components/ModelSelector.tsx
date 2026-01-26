import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';

// Import Logo Assets
import googleLogo from '../assets/models/google.png';
import openaiLogo from '../assets/models/openai.jpg';
import anthropicLogo from '../assets/models/anthropic.jpg';

export type ModelCategory = 'HTML GENERATION'; // Removed IMAGE GENERATION

export interface Model {
    id: string;
    name: string;
    logo?: string;
    category: ModelCategory;
    badge?: string;
    description?: string; // Kept for backward compatibility
    premium?: boolean;    // Kept for backward compatibility
}

const MODELS: Model[] = [
    {
        id: 'google/gemini-2.0-pro-exp',
        name: 'Gemini 3 Pro',
        logo: googleLogo,
        category: 'HTML GENERATION',
        badge: 'Best For UI'
    },
    {
        id: 'google/gemini-2.0-flash-exp',
        name: 'Gemini 3 Flash',
        logo: googleLogo,
        category: 'HTML GENERATION',
        badge: 'Quick iterations'
    },
    {
        id: 'openai/gpt-5.2',
        name: 'GPT-5.2',
        logo: openaiLogo,
        category: 'HTML GENERATION',
        badge: 'Fastest'
    },
    // Adding Claude models back as they are valid "text/html" models and we have the logo
    {
        id: 'anthropic/claude-3.5-sonnet',
        name: 'Claude 3.5 Sonnet',
        logo: anthropicLogo,
        category: 'HTML GENERATION',
        badge: 'Smartest'
    }
];

interface ModelSelectorProps {
    selectedId: string;
    onSelect: (id: string) => void;
    variant?: 'default' | 'minimal' | 'pill';
    iconOnly?: boolean;
}

export const ModelSelector: React.FC<ModelSelectorProps> = ({ selectedId, onSelect, variant = 'default', iconOnly = false }) => {
    const [isOpen, setIsOpen] = useState(false);
    const selectedModel = MODELS.find(m => m.id === selectedId) || MODELS[0];

    // Helper for rendering logos
    const renderLogo = (logo: string | undefined, className?: string) => (
        logo ? <img src={logo} alt="Model Logo" className={clsx("object-contain rounded-sm", className)} /> : null
    );

    if (variant === 'pill') {
        return (
            <div className="relative group/dropdown">
                <div
                    onClick={() => setIsOpen(!isOpen)}
                    className={clsx(
                        "flex items-center gap-2 rounded-full bg-zinc-900 border border-zinc-800 text-xs text-zinc-300 hover:text-white hover:border-lime-500/50 cursor-pointer transition-all justify-between",
                        iconOnly ? "p-1.5 size-8 ring-1 ring-white/5" : "px-2 md:px-3 py-1.5 min-w-0 md:min-w-[140px]"
                    )}
                >
                    <div className="flex items-center gap-2 mx-auto">
                        <div className={clsx("flex items-center justify-center overflow-hidden", iconOnly ? "w-5 h-5 scale-110" : "w-3.5 h-3.5")}>
                            {renderLogo(selectedModel.logo, "w-full h-full")}
                        </div>
                        {!iconOnly && <span className="font-medium whitespace-nowrap hidden md:inline">{selectedModel.name}</span>}
                    </div>
                    {!iconOnly && <ChevronDown size={12} className={clsx("text-zinc-500 transition-transform flex-shrink-0", isOpen && "rotate-180")} />}
                </div>

                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                            className="absolute bottom-[calc(100%+8px)] right-0 w-[240px] bg-slate-900 text-white rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.5)] overflow-hidden z-[100] py-1 border border-white/10 origin-bottom-right"
                        >
                            <div className="px-3 py-2 text-[10px] font-bold text-slate-500 uppercase tracking-wider bg-white/5 border-b border-white/5 mb-1">
                                AI Architecture Models
                            </div>

                            <div className="space-y-0.5 p-1">
                                {MODELS.map((model) => (
                                    <button
                                        key={model.id}
                                        onClick={() => {
                                            onSelect(model.id);
                                            setIsOpen(false);
                                        }}
                                        className={clsx(
                                            "w-full flex items-center justify-between px-2 py-2 rounded-lg hover:bg-white/5 transition-colors group",
                                            model.id === selectedId && "bg-primary/10 border border-primary/20"
                                        )}
                                    >
                                        <div className="flex items-center gap-2">
                                            <div className="w-4 h-4 flex items-center justify-center grayscale group-hover:grayscale-0 transition-all">
                                                {renderLogo(model.logo, "w-full h-full")}
                                            </div>
                                            <span className={clsx("text-xs font-medium transition-colors", model.id === selectedId ? "text-primary" : "text-slate-300 group-hover:text-white")}>
                                                {model.name}
                                            </span>
                                        </div>

                                        {model.badge && (
                                            <span className="px-1.5 py-0.5 rounded-full bg-slate-800 text-[9px] font-medium text-slate-500 border border-white/5 whitespace-nowrap group-hover:text-slate-300">
                                                {model.badge}
                                            </span>
                                        )}
                                    </button>
                                ))}
                            </div>

                            <div className="h-px bg-white/5 mx-2 my-1"></div>
                            <button className="w-full text-left px-3 py-1.5 text-xs font-medium text-slate-500 hover:text-white transition-colors flex items-center gap-2">
                                <span className="material-symbols-outlined text-sm">settings</span>
                                Advanced Settings
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        );
    }

    // Fallback/Minimal (Simplified for now to prevent breaking, but focused on pill usage)
    return null;
};
