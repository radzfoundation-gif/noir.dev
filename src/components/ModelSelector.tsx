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
}

export const ModelSelector: React.FC<ModelSelectorProps> = ({ selectedId, onSelect, variant = 'default' }) => {
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
                    className="flex items-center gap-2 px-2 md:px-3 py-1.5 rounded-full bg-zinc-900 border border-zinc-800 text-xs text-zinc-300 hover:text-white hover:border-lime-500/50 cursor-pointer transition-all min-w-0 md:min-w-[140px] justify-between"
                >
                    <div className="flex items-center gap-2">
                        <div className="w-3.5 h-3.5 flex items-center justify-center overflow-hidden">
                            {renderLogo(selectedModel.logo, "w-full h-full")}
                        </div>
                        <span className="font-medium whitespace-nowrap hidden md:inline">{selectedModel.name}</span>
                    </div>
                    <ChevronDown size={12} className={clsx("text-zinc-500 transition-transform flex-shrink-0", isOpen && "rotate-180")} />
                </div>

                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            initial={{ opacity: 0, y: 8, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 8, scale: 0.95 }}
                            className="absolute bottom-12 left-0 w-[220px] bg-white text-black rounded-xl shadow-2xl overflow-hidden z-50 py-1 border border-zinc-200 origin-bottom-left"
                        >
                            <div className="px-3 py-1.5 text-[10px] font-bold text-zinc-400 uppercase tracking-wider bg-zinc-50/50 border-b border-zinc-100 mb-1">
                                HTML GENERATION
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
                                            "w-full flex items-center justify-between px-2 py-1.5 rounded-lg hover:bg-zinc-100 transition-colors group",
                                            model.id === selectedId && "bg-zinc-50"
                                        )}
                                    >
                                        <div className="flex items-center gap-2">
                                            <div className="w-4 h-4 flex items-center justify-center">
                                                {renderLogo(model.logo, "w-full h-full")}
                                            </div>
                                            <span className="text-xs font-medium text-zinc-800 group-hover:text-black">
                                                {model.name}
                                            </span>
                                        </div>

                                        {model.badge && (
                                            <span className="px-1.5 py-0.5 rounded-full bg-zinc-100 text-[9px] font-medium text-zinc-500 border border-zinc-200 whitespace-nowrap">
                                                {model.badge}
                                            </span>
                                        )}
                                    </button>
                                ))}
                            </div>

                            <div className="h-px bg-zinc-100 mx-2 my-1"></div>
                            <button className="w-full text-left px-3 py-1.5 text-xs font-medium text-zinc-400 hover:text-black transition-colors flex items-center gap-2">
                                <ChevronDown size={12} />
                                Show more
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
