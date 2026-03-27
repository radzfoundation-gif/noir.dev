import React, { useRef } from 'react';
import { Image as ImageIcon, ArrowUp, X, FileCode } from 'lucide-react';
import { ModelSelector } from './ModelSelector';
import { FigmaImport } from './FigmaImport';

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
    currentTask?: number;
    totalTasks?: number;
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
    currentTask,
    totalTasks
}) => {
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            if (prompt.trim() || image) onGenerate();
        }
    };

    const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setPrompt(e.target.value);
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
        }
    };

    return (
        <div className="w-full relative">
            <div className="absolute -inset-1 overflow-hidden rounded-2xl opacity-60">
                <div className="absolute -top-10 -right-10 w-[200px] h-[200px] bg-lime-400/10 rounded-full blur-[60px] animate-pulse" style={{ animationDuration: '3s' }} />
                <div className="absolute -bottom-10 -left-10 w-[180px] h-[180px] bg-purple-500/10 rounded-full blur-[50px]" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-blue-500/5 rounded-full blur-[80px]" />
            </div>

            <div className="relative bg-neutral-900/90 backdrop-blur-sm border border-neutral-800 rounded-2xl overflow-hidden focus-within:border-lime-500/50 focus-within:ring-1 focus-within:ring-lime-500/30 focus-within:shadow-[0_0_20px_rgba(163,230,53,0.15)] transition-all z-10">

                {context && (
                    <div className="flex items-center gap-2 px-4 pt-3 pb-2">
                        <div className="flex items-center gap-2 px-2.5 py-1 bg-lime-500/10 border border-lime-500/20 rounded-lg">
                            <FileCode size={12} className="text-lime-400" />
                            <span className="text-[11px] text-lime-200 truncate max-w-[200px]">
                                {context.substring(0, 35)}...
                            </span>
                        </div>
                        <button
                            onClick={() => onClearContext && onClearContext()}
                            className="p-1 text-neutral-500 hover:text-red-400 transition-colors"
                        >
                            <X size={12} />
                        </button>
                    </div>
                )}

                <div className="px-4 pb-2 relative">
                    <div className="absolute inset-x-4 inset-y-0 bg-gradient-to-b from-transparent via-transparent to-neutral-800/20 pointer-events-none rounded-lg" />
                    <textarea
                        ref={textareaRef}
                        value={prompt}
                        onChange={handleTextareaChange}
                        onKeyDown={handleKeyDown}
                        placeholder="Describe what you want to build..."
                        className="relative w-full bg-transparent text-white text-sm placeholder:text-neutral-500 resize-none min-h-[44px] max-h-[200px] focus:outline-none py-2 z-10"
                        rows={1}
                        spellCheck={false}
                    />
                </div>

                {image && (
                    <div className="px-4 pb-3">
                        <div className="relative inline-block">
                            <img
                                src={image}
                                alt="Upload"
                                className="h-16 w-auto rounded-lg border border-neutral-700 object-cover"
                            />
                            <button
                                onClick={() => setImage(null)}
                                className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-neutral-800 border border-neutral-700 rounded-full flex items-center justify-center text-neutral-400 hover:text-white hover:bg-red-500/20 hover:border-red-500/50 transition-colors"
                            >
                                <X size={10} />
                            </button>
                        </div>
                    </div>
                )}

                <div className="flex items-center justify-between px-3 py-2 border-t border-neutral-800/50 bg-gradient-to-r from-neutral-900/80 via-neutral-900/60 to-neutral-900/80 backdrop-blur-sm relative overflow-hidden">
                    <div className="absolute inset-0 overflow-hidden pointer-events-none">
                        <div className="absolute left-0 bottom-0 w-[100px] h-[30px] bg-lime-400/5 rounded-full blur-[20px]" />
                        <div className="absolute right-0 bottom-0 w-[80px] h-[20px] bg-purple-500/5 rounded-full blur-[15px]" />
                    </div>
                    <div className="flex items-center gap-1">
                        <ModelSelector
                            selectedId={model}
                            onSelect={setModel}
                            variant="compact"
                        />

                        <div className="w-px h-4 bg-neutral-800 mx-1" />

                        <FigmaImport onImageImport={(url) => setImage(url)} />

                        <button
                            onClick={() => document.getElementById('chat-image-upload')?.click()}
                            className="p-1.5 text-neutral-500 hover:text-lime-400 hover:bg-neutral-800 rounded-lg transition-colors"
                            title="Upload Image"
                        >
                            <ImageIcon size={16} />
                        </button>
                        <input
                            id="chat-image-upload"
                            type="file"
                            className="hidden"
                            accept="image/*"
                            onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file && file.type.startsWith('image/')) {
                                    const reader = new FileReader();
                                    reader.onloadend = () => setImage(reader.result as string);
                                    reader.readAsDataURL(file);
                                }
                                e.target.value = '';
                            }}
                        />
                    </div>

                    {loading && currentTask && currentTask > 0 ? (
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-neutral-800 rounded-lg border border-neutral-700">
                            <div className="flex items-center gap-1.5">
                                <div className="w-1.5 h-1.5 rounded-full bg-lime-400 animate-pulse" />
                                <span className="text-xs font-medium text-neutral-300">
                                    {totalTasks && totalTasks > 0 ? `Task ${currentTask}/${totalTasks}` : `Task ${currentTask}`}
                                </span>
                            </div>
                        </div>
                    ) : (
                        <button
                            onClick={onGenerate}
                            disabled={!image && !prompt.trim()}
                            className="relative flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-gradient-to-r from-lime-400 to-lime-300 hover:from-lime-300 hover:to-lime-200 disabled:opacity-40 disabled:cursor-not-allowed text-black shadow-[0_0_15px_rgba(163,230,53,0.3)] rounded-lg transition-all"
                        >
                            <ArrowUp size={14} />
                            <span>Generate</span>
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};
