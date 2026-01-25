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
            <motion.div
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
        </Layout>
    );
};
