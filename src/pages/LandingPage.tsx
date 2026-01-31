import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { Hero } from '../components/Hero';
import { Testimonials } from '../components/Testimonials';
import { HowToUse } from '../components/HowToUse';
import { motion } from 'framer-motion';

export const LandingPage = () => {
    // ... existing hook logic ... 
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
            {/* Hero Section with Green/Vintage Background */}
            <div className="relative w-full h-screen overflow-hidden">
                <div
                    className="absolute inset-0 z-0 pointer-events-none"
                    style={{
                        backgroundImage: `url('/landing-bg.png')`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat',
                        opacity: 0.8
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
                </motion.div>
            </div>

            {/* Subsequent Sections (with Second Background) */}
            <div
                className="relative w-full min-h-screen flex items-center"
                style={{
                    backgroundImage: `url('/landing-bg-2.png')`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat'
                }}
            >
                <div className="absolute inset-0 bg-black/40 pointer-events-none" /> {/* Optional overlay for readability */}
                <div className="relative z-10 w-full">
                    <Testimonials />
                </div>
            </div>
        </Layout>
    );
};
