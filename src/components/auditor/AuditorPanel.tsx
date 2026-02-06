import React from 'react';
import { ShieldCheck, AlertTriangle, Info, CheckCircle2, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { AuditResult } from '../../lib/auditorService';

interface AuditorPanelProps {
    isOpen: boolean;
    onClose: () => void;
    results: AuditResult | null;
}

export const AuditorPanel: React.FC<AuditorPanelProps> = ({ isOpen, onClose, results }) => {
    if (!isOpen) return null;

    const getScoreColor = (score: number) => {
        if (score >= 90) return 'text-primary';
        if (score >= 70) return 'text-yellow-400';
        return 'text-red-500';
    };

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[60] flex items-center justify-end">
                <motion.div 
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }} 
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                />
                
                <motion.div 
                    initial={{ x: '100%' }} 
                    animate={{ x: 0 }} 
                    exit={{ x: '100%' }}
                    transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                    className="relative w-full max-w-md h-full bg-[#0a0a0a] border-l border-[#262626] shadow-2xl flex flex-col"
                >
                    {/* Header */}
                    <div className="p-6 border-b border-[#262626] flex items-center justify-between bg-[#121212]">
                        <div className="flex items-center gap-3">
                            <ShieldCheck className="text-primary" size={24} />
                            <div>
                                <h2 className="text-lg font-bold text-white">Noir Audit</h2>
                                <p className="text-xs text-neutral-500">SEO & Accessibility Report</p>
                            </div>
                        </div>
                        <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-lg transition-colors">
                            <X size={20} className="text-neutral-500" />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
                        {results ? (
                            <>
                                {/* Score Circle */}
                                <div className="flex flex-col items-center justify-center p-8 bg-[#121212] rounded-2xl border border-[#262626]">
                                    <div className="relative w-32 h-32 flex items-center justify-center">
                                        <svg className="w-full h-full transform -rotate-90">
                                            <circle
                                                cx="64" cy="64" r="58"
                                                fill="transparent"
                                                stroke="#1a1a1a"
                                                strokeWidth="8"
                                            />
                                            <motion.circle
                                                cx="64" cy="64" r="58"
                                                fill="transparent"
                                                stroke="currentColor"
                                                strokeWidth="8"
                                                strokeDasharray={364.4}
                                                initial={{ strokeDashoffset: 364.4 }}
                                                animate={{ strokeDashoffset: 364.4 - (364.4 * results.score) / 100 }}
                                                className={getScoreColor(results.score)}
                                            />
                                        </svg>
                                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                                            <span className={`text-4xl font-black ${getScoreColor(results.score)}`}>
                                                {results.score}
                                            </span>
                                            <span className="text-[10px] font-bold text-neutral-500 uppercase">Health Score</span>
                                        </div>
                                    </div>
                                    <div className="mt-6 grid grid-cols-2 gap-4 w-full">
                                        <div className="p-3 bg-black/30 rounded-xl border border-[#262626] text-center">
                                            <p className="text-[10px] text-neutral-500 font-bold uppercase mb-1">Total Tags</p>
                                            <p className="text-white font-mono">{results.metrics.totalTags}</p>
                                        </div>
                                        <div className="p-3 bg-black/30 rounded-xl border border-[#262626] text-center">
                                            <p className="text-[10px] text-neutral-500 font-bold uppercase mb-1">Images</p>
                                            <p className="text-white font-mono">{results.metrics.imageCount}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Issues List */}
                                <div className="space-y-4">
                                    <h3 className="text-xs font-black text-neutral-400 uppercase tracking-[0.2em]">Identified Issues</h3>
                                    {results.issues.length > 0 ? (
                                        results.issues.map((issue, idx) => (
                                            <motion.div 
                                                key={idx}
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: idx * 0.1 }}
                                                className="p-4 bg-[#171717] rounded-xl border border-[#262626] flex gap-4"
                                            >
                                                <div className={`shrink-0 mt-1 ${
                                                    issue.severity === 'high' ? 'text-red-500' : 
                                                    issue.severity === 'medium' ? 'text-yellow-500' : 'text-blue-500'
                                                }`}>
                                                    {issue.severity === 'high' ? <AlertTriangle size={18} /> : <Info size={18} />}
                                                </div>
                                                <div className="space-y-1">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-sm font-bold text-white">{issue.message}</span>
                                                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                                                            issue.type === 'seo' ? 'bg-blue-500/10 text-blue-400' : 
                                                            issue.type === 'accessibility' ? 'bg-purple-500/10 text-purple-400' : 'bg-neutral-500/10 text-neutral-400'
                                                        }`}>
                                                            {issue.type}
                                                        </span>
                                                    </div>
                                                    <p className="text-xs text-neutral-500 leading-relaxed">
                                                        {issue.suggestion}
                                                    </p>
                                                </div>
                                            </motion.div>
                                        ))
                                    ) : (
                                        <div className="p-8 text-center bg-primary/5 rounded-2xl border border-primary/20">
                                            <CheckCircle2 size={40} className="text-primary mx-auto mb-3" />
                                            <h4 className="text-white font-bold">Perfect Score!</h4>
                                            <p className="text-xs text-neutral-500 mt-1">Your code follows all SEO and accessibility best practices.</p>
                                        </div>
                                    )}
                                </div>
                            </>
                        ) : (
                            <div className="flex items-center justify-center h-full">
                                <p className="text-neutral-500">Generating audit report...</p>
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="p-4 bg-[#121212] border-t border-[#262626]">
                        <button 
                            onClick={onClose}
                            className="w-full py-3 bg-neutral-800 hover:bg-neutral-700 text-white text-sm font-bold rounded-xl transition-colors"
                        >
                            Got it
                        </button>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};
