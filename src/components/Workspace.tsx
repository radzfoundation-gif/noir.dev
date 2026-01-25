import { useState, useRef } from 'react';
import { Eye, Code, Smartphone, Tablet, Monitor, Download, Copy, Plus } from 'lucide-react';
import clsx from 'clsx';
import { ModernLoader } from './ModernLoader';
import { IPhoneMockup } from './IPhoneMockup';
import { motion, AnimatePresence } from 'framer-motion';

interface WorkspaceProps {
    code: string;
    loading: boolean;
    onChange: (code: string) => void;
    onAddToChat: (text: string) => void;
}

export const Workspace: React.FC<WorkspaceProps> = ({ code, loading, onChange, onAddToChat }) => {
    const [activeView, setActiveView] = useState<'preview' | 'code'>('preview');
    const [viewport, setViewport] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
    const [selectedText, setSelectedText] = useState('');
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const getViewportWidth = () => {
        switch (viewport) {
            case 'mobile': return '100%'; // Handled by Mockup
            case 'tablet': return '768px';
            default: return '100%';
        }
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(code);
    };

    const handleDownload = () => {
        const element = document.createElement("a");
        const file = new Blob([code], { type: 'text/html' });
        element.href = URL.createObjectURL(file);
        element.download = "noir-output.html";
        document.body.appendChild(element);
        element.click();
    };

    const handleTextSelect = () => {
        if (textareaRef.current) {
            const start = textareaRef.current.selectionStart;
            const end = textareaRef.current.selectionEnd;
            if (start !== end) {
                const text = textareaRef.current.value.substring(start, end);
                setSelectedText(text);
            } else {
                setSelectedText('');
            }
        }
    };

    const handleImportToChat = () => {
        if (selectedText) {
            onAddToChat(selectedText);
            setSelectedText('');
        }
    };

    const renderPreviewContent = () => {
        if (!code) {
            return (
                <div className="flex items-center justify-center h-full bg-zinc-950">
                    <div className="text-center text-zinc-500">
                        <Monitor size={48} className="mx-auto mb-4 opacity-20" />
                        <p>Ready to build</p>
                    </div>
                </div>
            );
        }

        const iframe = (
            <iframe
                srcDoc={code}
                title="Preview"
                className="w-full h-full border-none bg-white"
                sandbox="allow-scripts allow-modals"
            />
        );

        return (
            <div className="w-full h-full flex items-center justify-center p-4 overflow-hidden">
                <AnimatePresence mode="wait">
                    {viewport === 'mobile' ? (
                        <motion.div
                            key="mobile"
                            initial={{ opacity: 0, scale: 0.9, rotateY: 15 }}
                            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                            exit={{ opacity: 0, scale: 0.9, rotateY: -15 }}
                            transition={{ type: "spring", stiffness: 260, damping: 20 }}
                            className="perspective-1000"
                        >
                            <IPhoneMockup className="shadow-2xl">
                                {iframe}
                            </IPhoneMockup>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="standard"
                            initial={{ opacity: 0, width: getViewportWidth(), height: '85%' }}
                            animate={{
                                opacity: 1,
                                width: getViewportWidth(),
                                height: viewport === 'desktop' ? '100%' : '85%',
                                borderRadius: viewport === 'desktop' ? 0 : 16
                            }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ type: "spring", stiffness: 200, damping: 25 }}
                            className="overflow-hidden relative shadow-2xl bg-white border border-white/5"
                        >
                            {iframe}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        );
    };

    return (
        <div className="flex flex-col h-full bg-zinc-950 relative">
            {/* Workspace Toolbar */}
            <div className="h-14 border-b border-white/5 flex items-center justify-between px-4 bg-black/50 backdrop-blur-sm z-20 relative">

                {/* Left: View Toggles */}
                <div className="flex items-center bg-zinc-900 p-1 rounded-lg border border-white/5">
                    <button
                        onClick={() => setActiveView('preview')}
                        className={clsx(
                            "flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-all",
                            activeView === 'preview' ? "bg-zinc-700 text-white shadow-sm" : "text-zinc-400 hover:text-zinc-200"
                        )}
                    >
                        <Eye size={14} /> Preview
                    </button>
                    <button
                        onClick={() => setActiveView('code')}
                        className={clsx(
                            "flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-all",
                            activeView === 'code' ? "bg-zinc-700 text-white shadow-sm" : "text-zinc-400 hover:text-zinc-200"
                        )}
                    >
                        <Code size={14} /> Code
                    </button>
                </div>

                {/* Center: Device Toggles (Only for Preview) */}
                {activeView === 'preview' && (
                    <div className="flex items-center gap-4 text-zinc-500">
                        <button onClick={() => setViewport('mobile')} className={clsx("hover:text-lime-400 transition-colors flex items-center gap-1", viewport === 'mobile' && "text-lime-400")}>
                            <Smartphone size={18} />
                            {viewport === 'mobile' && <span className="text-[10px] font-bold">17 Pro Max</span>}
                        </button>
                        <button onClick={() => setViewport('tablet')} className={clsx("hover:text-lime-400 transition-colors", viewport === 'tablet' && "text-lime-400")}><Tablet size={18} /></button>
                        <button onClick={() => setViewport('desktop')} className={clsx("hover:text-lime-400 transition-colors", viewport === 'desktop' && "text-lime-400")}><Monitor size={18} /></button>
                    </div>
                )}

                {/* Right: Actions */}
                <div className="flex items-center gap-2">
                    <button onClick={handleCopy} className="p-2 text-zinc-400 hover:text-white transition-colors" title="Copy Code">
                        <Copy size={16} />
                    </button>
                    <button onClick={handleDownload} className="flex items-center gap-2 px-3 py-1.5 bg-lime-500 hover:bg-lime-400 text-black text-xs font-bold rounded-lg transition-colors">
                        <Download size={14} /> Export
                    </button>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 overflow-hidden relative flex items-center justify-center bg-zinc-900/50">
                {loading && <ModernLoader />}

                {activeView === 'preview' ? renderPreviewContent() : (
                    <div className="w-full h-full bg-[#0a0a0a]">
                        <textarea
                            ref={textareaRef}
                            value={code}
                            onChange={(e) => onChange(e.target.value)}
                            onSelect={handleTextSelect}
                            className="w-full h-full bg-transparent text-zinc-300 font-mono text-xs p-6 resize-none focus:outline-none leading-relaxed"
                            spellCheck={false}
                            placeholder="// Code will appear here..."
                        />
                    </div>
                )}
            </div>

            {/* Import Selection Button */}
            {selectedText && (
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 animate-in fade-in slide-in-from-bottom-2">
                    <button
                        onClick={handleImportToChat}
                        className="flex items-center gap-2 bg-lime-400 hover:bg-lime-300 text-black px-4 py-2 rounded-full font-bold shadow-lg shadow-lime-900/40 transition-all hover:scale-105"
                    >
                        <Plus size={16} strokeWidth={2.5} />
                        Import Selection to Chat
                    </button>
                </div>
            )}
        </div>
    );
};
