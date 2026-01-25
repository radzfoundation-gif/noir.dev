import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export const ModernLoader = () => {
    const [step, setStep] = useState(0);
    const steps = [
        "Initializing Noir Code...",
        "Analyzing Design Requirements...",
        "Synthesizing Component Structure...",
        "Applying Modern Aesthetics...",
        "Finalizing UI Polish..."
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            setStep((prev) => (prev < steps.length - 1 ? prev + 1 : prev));
        }, 800);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/80 backdrop-blur-md">
            <div className="relative w-24 h-24 mb-8">
                {/* Central Core */}
                <motion.div
                    className="absolute inset-0 bg-lime-500/20 rounded-full blur-xl"
                    animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity }}
                />

                {/* Spinning Rings */}
                <motion.div
                    className="absolute inset-0 border-2 border-lime-500/30 rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                />
                <motion.div
                    className="absolute inset-2 border-2 border-lime-400/40 rounded-full border-t-transparent border-l-transparent"
                    animate={{ rotate: -360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                />

                {/* Inner Pulse */}
                <div className="absolute inset-0 flex items-center justify-center">
                    <motion.div
                        className="w-3 h-3 bg-lime-400 rounded-full box-shadow-lg shadow-lime-500/50"
                        animate={{ scale: [1, 1.5, 1] }}
                        transition={{ duration: 1, repeat: Infinity }}
                    />
                </div>
            </div>

            {/* Steps Text */}
            <div className="h-8 relative overflow-hidden flex flex-col items-center">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={step}
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -20, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="text-lime-400 font-mono text-sm tracking-wider font-semibold"
                    >
                        {steps[step]}
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Progress Bar */}
            <div className="w-64 h-1 bg-zinc-800 rounded-full mt-6 overflow-hidden relative">
                <motion.div
                    className="absolute top-0 left-0 h-full bg-lime-500 box-shadow-[0_0_10px_rgba(132,204,22,0.5)]"
                    initial={{ width: "0%" }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 4, ease: "easeInOut" }}
                />
            </div>

            <p className="mt-4 text-[10px] text-zinc-500 font-mono">ESTIMATED TIME: ~3.2s</p>
        </div>
    );
};
