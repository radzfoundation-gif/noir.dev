import React, { useState, useRef } from 'react';
import { ChevronDown } from 'lucide-react';
import { motion } from 'framer-motion';
import { createPortal } from 'react-dom';

import googleLogo from '../assets/models/google.png';
import openaiLogo from '../assets/models/openai.jpg';
import anthropicLogo from '../assets/models/anthropic.jpg';

const MODELS = [
    { id: 'google/gemini-3-pro-preview', name: 'Gemini 3 Pro', logo: googleLogo, badge: 'Intelligence', available: true },
    { id: 'anthropic/claude-opus-4.5', name: 'Opus 4.5', logo: anthropicLogo, badge: 'Elite', available: true },
    { id: 'anthropic/claude-opus-4.6', name: 'Opus 4.6', logo: anthropicLogo, badge: 'Soon', available: false },
    { id: 'openai/gpt-5', name: 'GPT-5', logo: openaiLogo, badge: 'Vision', available: true }
];

const REASONING_LEVELS = ['Low', 'Medium', 'High', 'Max'];

export const ModelSelector = ({ selectedId, onSelect, variant = 'default', align = 'right' }) => {
    const [isOpen, setIsOpen] = useState(false);
    const buttonRef = useRef(null);
    const selectedModel = MODELS.find(m => m.id === selectedId) || MODELS[0];

    const handleClick = () => setIsOpen(!isOpen);
    const handleSelect = (modelId: string) => {
        onSelect(modelId);
        setIsOpen(false);
    };

    const getDropdownStyle = () => {
        if (!buttonRef.current) return {};
        const rect = buttonRef.current.getBoundingClientRect();
        const dropdownWidth = variant === 'compact' ? 180 : 240;
        const dropdownHeight = variant === 'compact' ? 120 : 240;

        let left = rect.right - dropdownWidth;
        if (align === 'left') left = rect.left;

        return {
            position: 'fixed' as const,
            top: rect.top - dropdownHeight - 8,
            left: Math.max(8, Math.min(left, window.innerWidth - dropdownWidth - 8)),
            width: dropdownWidth,
            zIndex: 9999
        };
    };

    const renderLogo = (logo: string) => logo ? <img src={logo} alt="" className="w-full h-full object-contain rounded" /> : null;

    const Dropdown = () => {
        const style = getDropdownStyle();
        const compact = variant === 'compact';

        return (
            <motion.div
                initial={{ opacity: 0, y: -4, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -4, scale: 0.98 }}
                transition={{ duration: 0.15 }}
                style={style}
                className="backdrop-blur-sm bg-neutral-900/95 border border-white/10 rounded-lg shadow-xl overflow-hidden"
            >
                {!compact && (
                    <div className="px-3 py-1.5 border-b border-white/5">
                        <p className="text-[10px] text-neutral-500 uppercase tracking-wider">Models</p>
                    </div>
                )}

                <div className={compact ? 'p-1' : 'p-1.5'}>
                    {MODELS.map((model) => (
                        <button
                            key={model.id}
                            onClick={() => model.available && handleSelect(model.id)}
                            disabled={!model.available}
                            className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-md transition-all ${model.available
                                    ? model.id === selectedId
                                        ? 'bg-lime-500/10 text-lime-400'
                                        : 'hover:bg-white/5 text-neutral-300'
                                    : 'opacity-40 cursor-not-allowed text-neutral-500'
                                }`}
                        >
                            <div className={compact ? 'w-5 h-5' : 'w-6 h-6'}>{renderLogo(model.logo)}</div>
                            <span className="flex-1 text-left text-xs">{model.name}</span>
                            {model.available && model.id === selectedId && <div className="w-1.5 h-1.5 rounded-full bg-lime-400" />}
                            {!model.available && <span className="text-[9px] px-1 rounded bg-white/5 text-neutral-500">Soon</span>}
                        </button>
                    ))}
                </div>

                {!compact && (
                    <div className="px-3 py-2 border-t border-white/5 bg-white/[0.02]">
                        <p className="text-[10px] text-neutral-500 mb-1.5">Reasoning</p>
                        <div className="grid grid-cols-4 gap-1">
                            {REASONING_LEVELS.map((level) => (
                                <button key={level} disabled className="py-1 text-[10px] bg-white/5 text-neutral-500 rounded cursor-not-allowed">
                                    {level}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </motion.div>
        );
    };

    const triggerButton = (
        <button
            ref={buttonRef}
            onClick={handleClick}
            type="button"
            className={`flex items-center gap-1.5 rounded-md transition-all ${variant === 'compact'
                    ? 'px-2 py-1 bg-neutral-800/80 hover:bg-neutral-800'
                    : 'px-2.5 py-1.5 bg-neutral-800/80 hover:bg-neutral-800'
                }`}
        >
            <div className={variant === 'compact' ? 'w-4 h-4' : 'w-5 h-5'}>{renderLogo(selectedModel.logo)}</div>
            <span className={variant === 'compact' ? 'text-[10px] text-neutral-300' : 'text-xs text-neutral-300'}>
                {selectedModel.name.split(' ')[0]}
            </span>
            <ChevronDown size={variant === 'compact' ? 10 : 12} className={`text-neutral-500 ${isOpen ? 'rotate-180' : ''}`} />
        </button>
    );

    return (
        <div className="relative inline-block">
            {triggerButton}
            {isOpen && createPortal(
                <>
                    <div className="fixed inset-0 z-[9998]" onClick={() => setIsOpen(false)} />
                    <Dropdown />
                </>,
                document.body
            )}
        </div>
    );
};
