import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

export const FlipWords = ({
    words,
    duration = 3000,
    className,
}: {
    words: string[];
    duration?: number;
    className?: string;
}) => {
    const [currentWord, setCurrentWord] = useState(words[0]);
    const [isAnimating, setIsAnimating] = useState(false);

    // Thanks to the user's request, we want to alternating text.
    // We'll cycle through the words array.

    const startAnimation = useCallback(() => {
        const word = words[words.indexOf(currentWord) + 1] || words[0];
        setCurrentWord(word);
        setIsAnimating(true);
    }, [currentWord, words]);

    useEffect(() => {
        if (!isAnimating) {
            setTimeout(() => {
                startAnimation();
            }, duration);
        }
    }, [isAnimating, duration, startAnimation]);

    return (
        <AnimatePresence
            onExitComplete={() => {
                setIsAnimating(false);
            }}
        >
            <motion.span
                initial={{
                    opacity: 0,
                    y: 10,
                }}
                animate={{
                    opacity: 1,
                    y: 0,
                }}
                exit={{
                    opacity: 0,
                    y: -10,
                    position: "absolute",
                }}
                transition={{
                    duration: 0.4,
                    ease: "easeInOut",
                }}
                key={currentWord}
                className={className}
                style={{ display: "inline-block" }}
            >
                {currentWord}
            </motion.span>
        </AnimatePresence>
    );
};
