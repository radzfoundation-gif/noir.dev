import React, { useState } from 'react';
import { ChevronDown, Cpu } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';

// Import Logo Assets
import googleLogo from '../assets/models/google.png';
import openaiLogo from '../assets/models/openai.jpg';
import anthropicLogo from '../assets/models/anthropic.jpg';

export interface Model {
    id: string;
    name: string;
    logo: string;
    description: string;
    premium?: boolean;
}

const MODELS: Model[] = [
    { id: 'anthropic/claude-3.5-sonnet', name: 'Claude Sonnet 4.5', logo: anthropicLogo, description: 'Fast and intelligent' },
    { id: 'anthropic/claude-3-opus', name: 'Claude Opus 4.5', logo: anthropicLogo, description: 'Maximum reasoning', premium: true },
    { id: 'google/gemini-2.0-flash-exp', name: 'Gemini 3 Flash', logo: googleLogo, description: 'Ultra-fast multimodal' },
    { id: 'google/gemini-1.5-pro', name: 'Gemini 3 Pro', logo: googleLogo, description: 'Complex reasoning', premium: true },
    // Added OpenAI as a placeholder since an icon was provided, though not in original list
    { id: 'openai/gpt-5-turbo', name: 'GPT-5 Turbo', logo: openaiLogo, description: 'Reasoning model', premium: true },
];

interface ModelSelectorProps {
    selectedId: string;
    onSelect: (id: string) => void;
    variant?: 'default' | 'minimal' | 'pill';
}

export const ModelSelector: React.FC<ModelSelectorProps> = ({ selectedId, onSelect, variant = 'default' }) => {
    const [isOpen, setIsOpen] = useState(false);
    const selectedModel = MODELS.find(m => m.id === selectedId) || MODELS[0];

    const renderLogo = (logo: string, className?: string) => (
        <img src={logo} alt="Model Logo" className={clsx("object-contain rounded-sm", className)} />
    );

    if (variant === 'pill') {
        return (
            <div className="relative group/dropdown">
                <div
                    onClick={() => setIsOpen(!isOpen)}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-800 border border-zinc-700 text-xs text-zinc-300 hover:text-white hover:border-lime-500/50 cursor-pointer transition-all"
                >
                    <div className="w-3.5 h-3.5 flex items-center justify-center overflow-hidden">
                        {renderLogo(selectedModel.logo, "w-full h-full")}
                    </div>
                    <span className="font-medium">{selectedModel.name}</span>
                    <ChevronDown size={12} className={clsx("text-zinc-500 transition-transform", isOpen && "rotate-180")} />
                </div>

                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 8 }}
                            className="absolute bottom-10 left-0 w-56 bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl overflow-hidden z-50 p-1"
                        >
                            {MODELS.map((model) => (
                                <button
                                    key={model.id}
                                    onClick={() => {
                                        onSelect(model.id);
                                        setIsOpen(false);
                                    }}
                                    className={clsx(
                                        "w-full flex items-center gap-3 p-2.5 rounded-lg transition-colors text-left",
                                        model.id === selectedId ? "bg-white/5" : "hover:bg-white/5"
                                    )}
                                >
                                    <div className={clsx("p-1.5 rounded-lg w-7 h-7 flex items-center justify-center", model.premium ? "bg-lime-500/10" : "bg-zinc-800")}>
                                        {renderLogo(model.logo, "w-4 h-4")}
                                    </div>
                                    <div className="text-xs font-medium text-white">{model.name}</div>
                                </button>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        )
    }

    if (variant === 'minimal') {
        return (
            <div className="relative group/dropdown">
                <div
                    onClick={() => setIsOpen(!isOpen)}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-900 border border-white/10 text-xs text-zinc-300 hover:text-white hover:border-lime-500/50 cursor-pointer transition-all"
                >
                    <div className="w-3.5 h-3.5 flex items-center justify-center overflow-hidden">
                        {renderLogo(selectedModel.logo, "w-full h-full")}
                    </div>
                    <span className="font-medium">{selectedModel.name}</span>
                    <ChevronDown size={14} className={clsx("text-zinc-500 transition-transform", isOpen && "rotate-180")} />
                </div>

                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 8 }}
                            className="absolute bottom-10 left-0 w-64 bg-zinc-900 border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50 p-1"
                        >
                            {MODELS.map((model) => (
                                <button
                                    key={model.id}
                                    onClick={() => {
                                        onSelect(model.id);
                                        setIsOpen(false);
                                    }}
                                    className={clsx(
                                        "w-full flex items-center gap-3 p-3 rounded-lg transition-colors text-left",
                                        model.id === selectedId ? "bg-white/10" : "hover:bg-white/5"
                                    )}
                                >
                                    <div className={clsx("p-1.5 rounded-lg w-8 h-8 flex items-center justify-center", model.premium ? "bg-gradient-to-r from-lime-500/20 to-emerald-500/20" : "bg-zinc-800")}>
                                        {renderLogo(model.logo, "w-5 h-5")}
                                    </div>
                                    <div>
                                        <div className="text-sm font-medium text-white">{model.name}</div>
                                        <div className="text-xs text-zinc-400">{model.description}</div>
                                    </div>
                                </button>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        );
    }
    return null;
};
