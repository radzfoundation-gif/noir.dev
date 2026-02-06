import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { projectService } from '../lib/projectService';
import type { Project } from '../lib/projectService';
import { Layout } from '../components/Layout';
import { Hero } from '../components/Hero';
import { Testimonials } from '../components/Testimonials';
import { RecentProjects } from '../components/RecentProjects';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
// ... rest of imports


export const LandingPage = () => {
    // ... existing hook logic ... 
    const navigate = useNavigate();
    const { user } = useAuth();
    const [image, setImage] = useState<string | null>(null);
    const [model, setModel] = useState('google/gemini-3-pro-preview');
    const [prompt, setPrompt] = useState('');
    const [loading, setLoading] = useState(false);
    const [generationType, setGenerationType] = useState<'web' | 'app'>('web');
    const [framework, setFramework] = useState<'html' | 'react' | 'astro'>('html');
    const [recentProjects, setRecentProjects] = useState<Project[]>([]);

    // Fetch recent projects if user is logged in
    useEffect(() => {
        if (user) {
            projectService.getProjects()
                .then(projects => setRecentProjects(projects.slice(0, 3)))
                .catch(console.error);
        }
    }, [user]);

    const handleGenerate = () => {
        // Require login before generating
        if (!user) {
            // Save prompt data to restore after login
            sessionStorage.setItem('pendingGeneration', JSON.stringify({
                prompt,
                image,
                model,
                generationType
            }));
            navigate('/login');
            return;
        }

        setLoading(true);
        // Navigate immediately, passing state
        // Navigate immediately, passing state
        navigate('/editor', {
            state: {
                prompt,
                image,
                model,
                generationType,
                framework,
                autoGenerate: true // Flag to trigger generation on load
            }
        });
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
                        generationType={generationType}
                        setGenerationType={setGenerationType}

                        // Pass framework props
                        framework={framework}
                        setFramework={setFramework}
                    />
                </motion.div>
            </div>

            {/* Subsequent Sections (with Second Background) */}
            <div
                className="relative w-full min-h-screen flex items-center"
                style={{
                    backgroundImage: user ? `url('/recent-bg.png')` : `url('/landing-bg-2.png')`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat'
                }}
            >
                <div className="absolute inset-0 bg-black/40 pointer-events-none" /> {/* Optional overlay for readability */}
                <div className="relative z-10 w-full">
                    {user ? <RecentProjects projects={recentProjects} /> : <Testimonials />}
                </div>
            </div>
        </Layout>
    );
};
