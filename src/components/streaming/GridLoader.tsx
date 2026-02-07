import { motion } from 'framer-motion';

export const GridLoader = ({ size = 18, color = "#a3e635" }: { size?: number, color?: string }) => {
    return (
        <div
            style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '1.5px',
                width: size,
                height: size
            }}
        >
            {[...Array(9)].map((_, i) => (
                <motion.div
                    key={i}
                    style={{
                        width: '100%',
                        height: '100%',
                        backgroundColor: color,
                        borderRadius: '1px',
                        opacity: 0.3
                    }}
                    animate={{
                        opacity: [0.3, 1, 0.3]
                    }}
                    transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        delay: i * 0.1, // Stagger effect
                        ease: "easeInOut"
                    }}
                />
            ))}
        </div>
    );
};
