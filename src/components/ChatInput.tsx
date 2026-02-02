import React, { useState } from 'react';
import { Wand2, Image as ImageIcon, ArrowUp, X, FileCode, ArrowRight, Code2, Atom, Rocket } from 'lucide-react';
import clsx from 'clsx';
import { ModelSelector } from './ModelSelector';
import { ImageUpload } from './ImageUpload';
import { FigmaImport } from './FigmaImport';
import { AnimatePresence, motion } from 'framer-motion';

const FrameworkDropdown = ({ framework, setFramework }: { framework: 'html' | 'react' | 'astro', setFramework: (f: 'html' | 'react' | 'astro') => void }) => {
    const [isOpen, setIsOpen] = useState(false);

    const frameworks = [
        { id: 'html', label: 'HTML', icon: Code2, color: 'text-orange-400' },
        { id: 'react', label: 'React', icon: Atom, color: 'text-cyan-400' },
        { id: 'astro', label: 'Astro', icon: Rocket, color: 'text-purple-400' },
    ];

    const current = frameworks.find(f => f.id === framework) || frameworks[0];
    const Icon = current.icon;

    return (
        <div className="relative ml-2">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-zinc-900/80 border border-zinc-800 hover:border-lime-500/30 hover:bg-zinc-800 transition-all group"
            >
                <Icon size={12} className={current.color} />
                <span className="text-[10px] font-bold text-zinc-300 group-hover:text-white">{current.label}</span>
                <span className="material-symbols-outlined text-[10px] text-zinc-500 group-hover:text-zinc-300 transition-colors">expand_more</span>
            </button>

            <AnimatePresence>
                {isOpen && (
                    <>
                        <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 5 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 5 }}
                            transition={{ duration: 0.1 }}
                            className="absolute bottom-full left-0 mb-2 w-32 bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl overflow-hidden z-50 p-1"
                        >
                            {frameworks.map((fw) => {
                                const FwIcon = fw.icon;
                                const isSelected = framework === fw.id;
                                return (
                                    <button
                                        key={fw.id}
                                        onClick={() => {
                                            setFramework(fw.id as any);
                                            setIsOpen(false);
                                        }}
                                        className={clsx(
                                            "w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-[10px] font-medium transition-all text-left",
                                            isSelected ? "bg-white/10 text-white" : "text-zinc-400 hover:text-white hover:bg-white/5"
                                        )}
                                    >
                                        <FwIcon size={12} className={isSelected ? fw.color : "text-zinc-500"} />
                                        {fw.label}
                                        {isSelected && <div className="ml-auto w-1 h-1 rounded-full bg-lime-500" />}
                                    </button>
                                );
                            })}
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
};

interface ChatInputProps {
    onGenerate: () => void;
    loading: boolean;
    image: string | null;
    setImage: (img: string | null) => void;
    model: string;
    setModel: (m: string) => void;
    prompt: string;
    setPrompt: (p: string) => void;
    context?: string | null;
    onClearContext?: () => void;
    onEnhancePrompt?: () => void;
    onMention?: () => void;
    variant?: 'hero' | 'sidebar';
    framework?: 'html' | 'react' | 'astro';
    setFramework?: (f: 'html' | 'react' | 'astro') => void;
}

export const ChatInput: React.FC<ChatInputProps> = ({
    onGenerate,
    loading,
    image,
    setImage,
    model,
    setModel,
    prompt,
    setPrompt,
    context,
    onClearContext,
    onEnhancePrompt,
    onMention,
    variant = 'sidebar',
    framework,
    setFramework
}) => {
    const [showContext, setShowContext] = useState(false);

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            if (prompt.trim() || image) onGenerate();
        }
    };

    return (
        <div className="w-full relative">
            {/* Context Viewer Overlay */}
            <AnimatePresence>
                {showContext && context && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute bottom-[calc(100%+8px)] left-0 w-full bg-zinc-900 border border-zinc-700/50 rounded-lg shadow-2xl z-50 overflow-hidden"
                    >
                        <div className="flex items-center justify-between px-3 py-2 bg-zinc-900 border-b border-zinc-800">
                            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">CODE CONTEXT</span>
                            <button onClick={() => setShowContext(false)} className="text-zinc-500 hover:text-white">
                                <X size={12} />
                            </button>
                        </div>
                        <div className="max-h-[300px] overflow-auto p-3 bg-black/50">
                            <pre className="text-[10px] font-mono text-zinc-300 whitespace-pre-wrap">{context}</pre>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Input Container */}
            <div className={clsx(
                "border border-zinc-800 rounded-xl transition-all duration-300 relative group",
                variant === 'hero'
                    ? "bg-black/60 backdrop-blur-md p-2.5 shadow-lg focus-within:border-lime-500/50 focus-within:shadow-[0_0_10px_rgba(163,230,53,0.05)]"
                    : "bg-zinc-900/50 p-1.5 focus-within:border-lime-500/30"
            )}>

                {/* Active Context Badge */}
                {context && (
                    <div className="flex items-center gap-2 mb-2 px-1">
                        <button
                            onClick={() => setShowContext(!showContext)}
                            className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-lime-500/10 border border-lime-500/20 hover:bg-lime-500/20 transition-all group/badge max-w-full"
                        >
                            <FileCode size={12} className="text-lime-400 flex-shrink-0" />
                            <span className="text-[11px] font-medium text-lime-100 truncate">
                                {context.substring(0, 40).replace(/\n/g, ' ')}...
                            </span>
                        </button>
                        <button
                            onClick={() => onClearContext && onClearContext()}
                            className="text-zinc-600 hover:text-red-400 transition-colors p-1 rounded hover:bg-white/5"
                            title="Remove Context"
                        >
                            <X size={12} />
                        </button>
                    </div>
                )}

                {/* Prompt Input */}
                <div className="relative">
                    <textarea
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Describe your design or paste a screenshot..."
                        className="w-full bg-transparent text-white text-sm font-light placeholder:text-zinc-600 resize-none h-12 focus:outline-none p-1.5 leading-relaxed overflow-y-auto custom-scrollbar"
                        spellCheck={false}
                        autoComplete="off"
                    />

                    {/* Image Preview Overlay */}
                    {image && (
                        <div className="absolute top-0 right-0 w-10 h-10 rounded-lg overflow-hidden border border-lime-500/30 group/img shadow-lg shadow-lime-900/20">
                            <img src={image} alt="Preview" className="w-full h-full object-cover" />
                            <button
                                onClick={() => setImage(null)}
                                className="absolute top-0.5 right-0.5 bg-black/50 p-0.5 rounded-full opacity-0 group-hover/img:opacity-100 transition-opacity hover:bg-black/80"
                            >
                                <ArrowRight size={8} className="rotate-45 text-white" />
                            </button>
                        </div>
                    )}
                </div>

                {/* Bottom Toolbar */}
                <div className="flex items-center justify-between mt-2 px-0.5">
                    <div className="flex items-center gap-1.5">
                        {/* Prompt Builder/Enhancer */}
                        {onEnhancePrompt && (
                            <button
                                onClick={onEnhancePrompt}
                                disabled={loading || !prompt.trim()}
                                className={clsx(
                                    "flex items-center gap-1 px-2 py-1 rounded-full border border-zinc-800 bg-zinc-900/50 hover:bg-zinc-800 hover:border-lime-500/30 text-[10px] font-medium text-zinc-400 hover:text-white transition-all disabled:opacity-30",
                                    variant === 'sidebar' && "p-1.5 min-w-[28px] justify-center"
                                )}
                                title="Enhance Prompt"
                            >
                                <Wand2 size={12} className="text-lime-400" />
                                {variant !== 'sidebar' && <span className="hidden md:inline">Enhance</span>}
                            </button>
                        )}

                        {/* Mention Button */}
                        {onMention && (
                            <button
                                onClick={onMention}
                                className="p-1.5 text-zinc-500 hover:text-lime-400 transition-colors rounded-full hover:bg-zinc-900"
                                title="Add Context"
                            >
                                <span className="text-[14px] font-bold">@</span>
                            </button>
                        )}

                        {/* Model Selector */}
                        <ModelSelector
                            selectedId={model}
                            onSelect={setModel}
                            variant="pill"
                            iconOnly={variant === 'sidebar'}
                            align={variant === 'sidebar' ? 'left' : 'right'}
                        />

                        {/* Framework Selector (Hero Only) */}
                        {variant === 'hero' && setFramework && framework && (
                            <FrameworkDropdown framework={framework} setFramework={setFramework} />
                        )}

                        <div className="h-3 w-[1px] bg-zinc-800 mx-0.5"></div>

                        <FigmaImport onImageImport={(url) => setImage(url)} />

                        <button
                            onClick={() => document.getElementById('chat-image-upload')?.click()}
                            className="p-1.5 text-zinc-500 hover:text-lime-400 transition-colors rounded-full hover:bg-zinc-900"
                            title="Attach Image"
                        >
                            <ImageIcon size={14} strokeWidth={1.5} />
                        </button>

                        {/* Hidden Input */}
                        <div className="hidden">
                            <ImageUpload onImageSelect={setImage} inputId="chat-image-upload" />
                        </div>
                    </div>

                    {/* Generate Button */}
                    <button
                        onClick={() => onGenerate()}
                        disabled={(!image && !prompt.trim()) || loading}
                        className="p-1.5 rounded-lg bg-lime-400 hover:bg-lime-300 text-black transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_10px_rgba(163,230,53,0.2)] flex items-center justify-center min-w-[32px] min-h-[32px] relative z-50"
                    >
                        {loading ? (
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            >
                                <ArrowUp size={14} className="opacity-50" />
                            </motion.div>
                        ) : (
                            <ArrowUp size={14} strokeWidth={2.5} />
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};
