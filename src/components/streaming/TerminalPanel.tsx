import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, X } from 'lucide-react';
import type { TerminalLine } from '../../lib/webContainerService';

interface TerminalPanelProps {
    lines: TerminalLine[];
    isVisible: boolean;
    onClose?: () => void;
    title?: string;
}

export const TerminalPanel: React.FC<TerminalPanelProps> = ({
    lines,
    isVisible,
    onClose,
    title = 'Terminal'
}) => {
    const scrollRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to bottom when new lines are added
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [lines]);

    const getLineColor = (type: TerminalLine['type']) => {
        switch (type) {
            case 'system':
                return 'text-blue-400';
            case 'command':
                return 'text-yellow-400';
            case 'output':
                return 'text-neutral-300';
            case 'success':
                return 'text-lime-400';
            case 'error':
                return 'text-red-400';
            default:
                return 'text-neutral-400';
        }
    };

    const getLinePrefix = (type: TerminalLine['type']) => {
        switch (type) {
            case 'system':
                return '→';
            case 'command':
                return '';
            case 'output':
                return '  ';
            case 'success':
                return '';
            case 'error':
                return '';
            default:
                return '';
        }
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="rounded-lg overflow-hidden border border-neutral-800 bg-[#0D0D0D]"
                >
                    {/* Terminal Header */}
                    <div className="flex items-center justify-between px-3 py-2 bg-neutral-900/80 border-b border-neutral-800">
                        <div className="flex items-center gap-2">
                            {/* Traffic lights */}
                            <div className="flex gap-1.5">
                                <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
                                <div className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
                            </div>
                            <div className="flex items-center gap-1.5 ml-2">
                                <Terminal size={12} className="text-neutral-500" />
                                <span className="text-[10px] font-medium text-neutral-500 uppercase tracking-wider">
                                    {title}
                                </span>
                            </div>
                        </div>
                        {onClose && (
                            <button
                                onClick={onClose}
                                className="p-1 hover:bg-neutral-800 rounded transition-colors"
                            >
                                <X size={12} className="text-neutral-500" />
                            </button>
                        )}
                    </div>

                    {/* Terminal Content */}
                    <div
                        ref={scrollRef}
                        className="p-3 max-h-[300px] overflow-y-auto font-mono text-xs leading-relaxed"
                    >
                        {lines.length === 0 ? (
                            <div className="text-neutral-600 italic">Waiting for commands...</div>
                        ) : (
                            lines.map((line, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, x: -5 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.1 }}
                                    className={`${getLineColor(line.type)} whitespace-pre-wrap break-all`}
                                >
                                    {getLinePrefix(line.type)}{line.text}
                                </motion.div>
                            ))
                        )}

                        {/* Blinking cursor at end */}
                        {lines.length > 0 && (
                            <motion.span
                                animate={{ opacity: [1, 0] }}
                                transition={{ duration: 0.8, repeat: Infinity }}
                                className="inline-block w-2 h-4 bg-lime-400 ml-1"
                            />
                        )}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default TerminalPanel;
