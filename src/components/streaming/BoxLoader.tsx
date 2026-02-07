import { motion } from 'framer-motion';

export const BoxLoader = ({ size = 18, color = "#a3e635" }: { size?: number, color?: string }) => {
    return (
        <motion.div
            style={{
                width: size,
                height: size,
                border: `2px solid ${color}`,
                borderRadius: 3,
                background: 'transparent'
            }}
            animate={{
                rotate: [0, 90, 180, 270, 360],
                scale: [1, 0.8, 1, 0.8, 1],
                borderColor: [color, "#ffffff", color],
            }}
            transition={{
                duration: 3,
                ease: "easeInOut",
                repeat: Infinity,
                repeatDelay: 0
            }}
        />
    );
};
