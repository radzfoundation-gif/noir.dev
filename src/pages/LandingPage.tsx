import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { Hero } from '../components/Hero';
import { DemoCarousel } from '../components/DemoCarousel';
import { HowToUse } from '../components/HowToUse';
import { motion } from 'framer-motion';

export const LandingPage = () => {
    const navigate = useNavigate();
    const [image, setImage] = useState<string | null>(null);
    const [model, setModel] = useState('google/gemini-2.0-flash-exp');
    const [prompt, setPrompt] = useState('');
    const [loading, setLoading] = useState(false);

    const handleGenerate = () => {
        setLoading(true);
        // Navigate immediately, passing state
        setTimeout(() => {
            navigate('/editor', {
                state: {
                    prompt,
                    image,
                    model,
                    autoGenerate: true // Flag to trigger generation on load
                }
            });
        }, 100);
    };

    return (
        <Layout>
            <div className="min-h-screen w-full bg-black relative overflow-hidden">
                <div
                    className="absolute inset-0 z-0 pointer-events-none"
                    style={{
                        background: `
                linear-gradient(
                  90deg, 
                  transparent 0%,
                  transparent 30%,
                  rgba(138, 43, 226, 0.4) 50%,
                  transparent 70%,
                  transparent 100%
                ),
                linear-gradient(
                  to bottom,
                  #1a1a2e 0%,
                  #2d1b69 50%,
                  #0f0f23 100%
                )
              `,
                        backgroundImage: `
                repeating-linear-gradient(
                  90deg,
                  transparent 0px,
                  transparent 79px,
                  rgba(255, 255, 255, 0.05) 80px,
                  rgba(255, 255, 255, 0.05) 81px
                )
              `,
                    }}
                />
                <motion.div
                    className="relative z-10"
                    initial={{ opacity: 0, y: 20, filter: 'blur(10px)' }}
                    animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                >
                    <Hero
                        onGenerate={handleGenerate}
                        loading={loading}
                        image={image}
                        setImage={setImage}
                        model={model}
                        setModel={setModel}
                        prompt={prompt}
                        setPrompt={setPrompt}
                    />
                    <DemoCarousel />
                    <HowToUse />
                </motion.div>
            </div>
        </Layout>
    );
};
