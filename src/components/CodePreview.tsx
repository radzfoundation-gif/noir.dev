import React, { useState } from 'react';
import { Copy, Eye, Code, Check } from 'lucide-react';
import { motion } from 'framer-motion';
import clsx from 'clsx';

interface CodePreviewProps {
    code: string;
}

export const CodePreview: React.FC<CodePreviewProps> = ({ code }) => {
    const [mode, setMode] = useState<'preview' | 'code'>('preview');
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="w-full h-full min-h-[500px] flex flex-col bg-surface/50 border border-white/10 rounded-xl overflow-hidden backdrop-blur-sm">
            {/* Toolbar */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-black/20">
                <div className="flex bg-black/40 rounded-lg p-1 border border-white/5">
                    <button
                        onClick={() => setMode('preview')}
                        className={clsx(
                            "flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all",
                            mode === 'preview' ? "bg-white/10 text-white shadow-sm" : "text-gray-400 hover:text-white"
                        )}
                    >
                        <Eye className="w-4 h-4" />
                        Preview
                    </button>
                    <button
                        onClick={() => setMode('code')}
                        className={clsx(
                            "flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all",
                            mode === 'code' ? "bg-white/10 text-white shadow-sm" : "text-gray-400 hover:text-white"
                        )}
                    >
                        <Code className="w-4 h-4" />
                        Code
                    </button>
                </div>

                <button
                    onClick={handleCopy}
                    className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                >
                    {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                    {copied ? 'Copied!' : 'Copy Code'}
                </button>
            </div>

            {/* Content */}
            <div className="flex-1 relative">
                {mode === 'preview' ? (
                    <iframe
                        srcDoc={code}
                        title="Preview"
                        className="w-full h-full bg-white"
                        sandbox="allow-scripts allow-modals"
                    />
                ) : (
                    <div className="w-full h-full overflow-auto p-4 bg-[#1e1e1e] font-mono text-sm text-gray-300">
                        <pre className="whitespace-pre-wrap">{code}</pre>
                    </div>
                )}
            </div>
        </div>
    );
};
