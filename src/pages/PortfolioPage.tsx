import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase'; // Direct access for public data
import { Layout } from '../components/Layout';
import { Globe, Smartphone, Clock, FileCode, Copy, ExternalLink, Code2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Project } from '../lib/projectService';

export const PortfolioPage = () => {
    const { userId } = useParams();
    const navigate = useNavigate();
    const [projects, setProjects] = useState<Project[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [portfolioOwner, setPortfolioOwner] = useState<{ email: string } | null>(null);



    useEffect(() => {
        if (userId) {
            loadPortfolio();
        }
    }, [userId]);

    const loadPortfolio = async () => {
        try {
            setIsLoading(true);

            // Fetch Projects
            const { data, error } = await supabase
                .from('projects')
                .select('*')
                .eq('user_id', userId)
                .order('updated_at', { ascending: false });

            if (error) throw error;
            setProjects(data || []);

            // Try to fetch owner specific info (optional, might be blocked by RLS)
            // For now just show "User's Portfolio" or try to get username if available

        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load portfolio');
        } finally {
            setIsLoading(false);
        }
    };

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    return (
        <Layout>
            <div className="min-h-screen bg-black pt-24 pb-16 px-6">
                <div className="max-w-6xl mx-auto">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-12 border-b border-white/10 pb-8">
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <span className="bg-lime-400 text-black text-xs font-bold px-2 py-0.5 rounded uppercase tracking-wider">Public Portfolio</span>
                            </div>
                            <h1 className="text-4xl font-bold text-white mb-2">Project Showcase</h1>
                            <p className="text-white/60">Explore projects created with Noir AI</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <a
                                href="/login"
                                className="px-4 py-2 border border-white/20 hover:bg-white/10 text-white rounded-lg transition-colors text-sm font-medium"
                            >
                                Create Your Own
                            </a>
                        </div>
                    </div>

                    {/* Error */}
                    {error && (
                        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400">
                            {error} <br />
                            <span className="text-xs opacity-70">(Note: Admin may need to enable Public Access in database settings)</span>
                        </div>
                    )}

                    {/* Loading */}
                    {isLoading ? (
                        <div className="flex items-center justify-center py-20">
                            <span className="material-symbols-outlined text-4xl text-lime-400 animate-spin">progress_activity</span>
                        </div>
                    ) : projects.length === 0 ? (
                        /* Empty State */
                        <div className="text-center py-20 bg-white/5 rounded-2xl border border-white/10">
                            <FileCode size={48} className="mx-auto text-white/20 mb-4" />
                            <h3 className="text-xl font-semibold text-white mb-2">No projects found</h3>
                            <p className="text-white/60">This user hasn't published any projects yet.</p>
                        </div>
                    ) : (
                        /* Projects Grid */
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <AnimatePresence>
                                {projects.map((project, idx) => (
                                    <motion.div
                                        key={project.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: idx * 0.1 }}
                                        className="group bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden hover:border-lime-400/50 transition-all flex flex-col h-full cursor-pointer hover:shadow-2xl hover:shadow-lime-900/10"
                                        onClick={() => window.open(`/preview/${project.id}`, '_blank')}
                                    >
                                        {/* Preview */}
                                        <div className="h-48 bg-black relative overflow-hidden">
                                            <iframe
                                                srcDoc={project.code}
                                                className="w-[200%] h-[200%] scale-50 origin-top-left pointer-events-none opacity-80 group-hover:opacity-100 transition-opacity"
                                                title={project.name}
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60"></div>

                                            <div className="absolute top-3 right-3">
                                                <span className={`px-2 py-1 text-[10px] font-bold uppercase rounded shadow-lg backdrop-blur-md ${project.generation_type === 'app'
                                                    ? 'bg-purple-500/90 text-white'
                                                    : 'bg-blue-500/90 text-white'
                                                    }`}>
                                                    {project.generation_type === 'app' ? 'App' : 'Web'}
                                                </span>
                                            </div>

                                            {/* Hover Overlay */}
                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                <span className="bg-white/10 backdrop-blur text-white px-4 py-2 rounded-full font-medium border border-white/20 transform scale-95 group-hover:scale-100 transition-transform">
                                                    Click to Preview
                                                </span>
                                            </div>
                                        </div>

                                        {/* Info */}
                                        <div className="p-5 flex-1 flex flex-col">
                                            <div className="flex-1">
                                                <h3 className="font-bold text-lg text-white mb-1 group-hover:text-lime-400 transition-colors">{project.name}</h3>
                                                {project.prompt && (
                                                    <p className="text-white/50 text-xs line-clamp-3 leading-relaxed mb-4">{project.prompt}</p>
                                                )}
                                            </div>

                                            <div className="pt-4 border-t border-white/5 flex items-center justify-between mt-auto">
                                                <span className="flex items-center gap-1.5 text-xs text-white/30">
                                                    <Clock size={12} />
                                                    {formatDate(project.updated_at)}
                                                </span>

                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            navigator.clipboard.writeText(project.code || '');
                                                            alert('Code copied to clipboard!');
                                                        }}
                                                        className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-white/60 hover:text-white transition-colors"
                                                        title="Copy Code"
                                                    >
                                                        <Code2 size={16} />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    )}
                </div>
            </div>


        </Layout>
    );
};
