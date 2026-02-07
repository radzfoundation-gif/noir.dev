import React from 'react';
import { Square } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { GridLoader } from './GridLoader';

interface WorkingIndicatorProps {
    isGenerating: boolean;
    status: string;
    onStop: () => void;
}

export const WorkingIndicator: React.FC<WorkingIndicatorProps> = ({
    isGenerating,
    status,
    onStop
}) => {
    return (
        <AnimatePresence>
            {isGenerating && (
                <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="z-20 w-full"
                >
                    <div className="bg-[#1C1C1C] border-t border-[#333] flex items-center justify-between gap-4 p-3 shadow-2xl w-full">
                        <div className="flex items-center gap-3 flex-1">
                            <div className="relative flex items-center justify-center w-5 h-5">
                                <GridLoader size={18} color="#a3e635" />
                            </div>
                            <span className="text-sm font-medium text-neutral-400 tracking-wide">
                                {status}
                            </span>
                        </div>

                        <button
                            onClick={onStop}
                            className="flex items-center gap-2 px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white rounded-md transition-colors text-xs font-medium border border-neutral-700"
                        >
                            <Square size={8} className="fill-current" />
                            <span>Stop</span>
                        </button>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default WorkingIndicator;
