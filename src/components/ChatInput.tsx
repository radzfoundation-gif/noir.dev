import React, { useState } from 'react';
import { Wand2, Image as ImageIcon, ArrowUp, X, FileCode, ArrowRight } from 'lucide-react';
import { ModelSelector } from './ModelSelector';
import { ImageUpload } from './ImageUpload';
import { AnimatePresence, motion } from 'framer-motion';

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
    onClearContext
}) => {
    const [showContext, setShowContext] = useState(false);

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

            <div className="bg-black border border-zinc-800 rounded-xl p-2.5 shadow-lg relative group focus-within:border-lime-500/50 focus-within:shadow-[0_0_10px_rgba(163,230,53,0.05)] transition-all duration-300">

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
                        placeholder="Describe your app or paste a screenshot..."
                        className="w-full bg-transparent text-white text-sm font-light placeholder:text-zinc-600 resize-none h-12 focus:outline-none p-1.5 leading-relaxed"
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
                <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center gap-2">
                        {/* Prompt Builder */}
                        <button className="flex items-center gap-1.5 px-2 py-1 rounded-full border border-zinc-800 bg-zinc-900/50 hover:bg-zinc-800 hover:border-lime-500/30 text-[10px] font-medium text-zinc-400 hover:text-white transition-all">
                            <Wand2 size={10} className="text-lime-400" />
                            <span className="hidden md:inline">Prompt</span>
                        </button>

                        {/* Model Selector */}
                        <ModelSelector selectedId={model} onSelect={setModel} variant="pill" />

                        <div className="h-3 w-[1px] bg-zinc-800 mx-0.5"></div>

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
                        onClick={onGenerate}
                        disabled={!image && !prompt.trim() || loading}
                        className="p-1.5 rounded-lg bg-lime-400 hover:bg-lime-300 text-black transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_10px_rgba(163,230,53,0.2)]"
                    >
                        <ArrowUp size={14} strokeWidth={2.5} />
                    </button>
                </div>
            </div>
        </div>
    );
};
