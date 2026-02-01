import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { projectService } from '../lib/projectService';
import type { Project } from '../lib/projectService';
import { Layout } from '../components/Layout';
import { Plus, Trash2, Globe, Smartphone, Clock, FileCode } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const ProjectsPage = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [projects, setProjects] = useState<Project[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    useEffect(() => {
        if (user) {
            loadProjects();
        }
    }, [user]);

    const loadProjects = async () => {
        try {
            setIsLoading(true);
            const data = await projectService.getProjects();
            setProjects(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load projects');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this project?')) return;

        setDeletingId(id);
        try {
            await projectService.deleteProject(id);
            setProjects(prev => prev.filter(p => p.id !== id));
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to delete project');
        } finally {
            setDeletingId(null);
        }
    };

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <Layout>
            <div className="min-h-screen bg-black pt-24 pb-16 px-6">
                <div className="max-w-6xl mx-auto">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h1 className="text-3xl font-bold text-white">My Projects</h1>
                            <p className="text-white/60 mt-1">Manage your saved projects</p>
                        </div>
                        <Link
                            to="/editor"
                            className="flex items-center gap-2 px-4 py-2.5 bg-lime-400 text-black font-semibold rounded-lg hover:bg-lime-300 transition-colors"
                        >
                            <Plus size={18} />
                            New Project
                        </Link>
                    </div>

                    {/* Error */}
                    {error && (
                        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400">
                            {error}
                        </div>
                    )}

                    {/* Loading */}
                    {isLoading ? (
                        <div className="flex items-center justify-center py-20">
                            <span className="material-symbols-outlined text-4xl text-lime-400 animate-spin">progress_activity</span>
                        </div>
                    ) : projects.length === 0 ? (
                        /* Empty State */
                        <div className="text-center py-20">
                            <FileCode size={64} className="mx-auto text-white/20 mb-4" />
                            <h3 className="text-xl font-semibold text-white mb-2">No projects yet</h3>
                            <p className="text-white/60 mb-6">Start by creating your first project</p>
                            <Link
                                to="/editor"
                                className="inline-flex items-center gap-2 px-6 py-3 bg-lime-400 text-black font-semibold rounded-lg hover:bg-lime-300 transition-colors"
                            >
                                <Plus size={18} />
                                Create Project
                            </Link>
                        </div>
                    ) : (
                        /* Projects Grid */
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            <AnimatePresence>
                                {projects.map((project) => (
                                    <motion.div
                                        key={project.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.9 }}
                                        className="group bg-white/5 border border-white/10 rounded-xl overflow-hidden hover:border-lime-400/50 transition-all"
                                    >
                                        {/* Preview */}
                                        <div
                                            className="h-40 bg-white/5 relative cursor-pointer"
                                            onClick={() => navigate(`/editor?project=${project.id}`)}
                                        >
                                            <iframe
                                                srcDoc={project.code}
                                                className="w-full h-full pointer-events-none"
                                                title={project.name}
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-4">
                                                <span className="text-white text-sm font-medium">Click to edit</span>
                                            </div>
                                        </div>

                                        {/* Info */}
                                        <div className="p-4">
                                            <div className="flex items-start justify-between mb-2">
                                                <h3 className="font-semibold text-white truncate flex-1">{project.name}</h3>
                                                <span className={`ml-2 px-2 py-0.5 text-xs font-medium rounded ${project.generation_type === 'app'
                                                        ? 'bg-purple-500/20 text-purple-400'
                                                        : 'bg-blue-500/20 text-blue-400'
                                                    }`}>
                                                    {project.generation_type === 'app' ? (
                                                        <span className="flex items-center gap-1"><Smartphone size={12} /> App</span>
                                                    ) : (
                                                        <span className="flex items-center gap-1"><Globe size={12} /> Web</span>
                                                    )}
                                                </span>
                                            </div>

                                            {project.prompt && (
                                                <p className="text-white/50 text-sm truncate mb-3">{project.prompt}</p>
                                            )}

                                            <div className="flex items-center justify-between">
                                                <span className="flex items-center gap-1 text-xs text-white/40">
                                                    <Clock size={12} />
                                                    {formatDate(project.updated_at)}
                                                </span>
                                                <button
                                                    onClick={() => handleDelete(project.id)}
                                                    disabled={deletingId === project.id}
                                                    className="p-1.5 text-white/40 hover:text-red-400 hover:bg-red-500/10 rounded transition-colors disabled:opacity-50"
                                                >
                                                    {deletingId === project.id ? (
                                                        <span className="material-symbols-outlined text-sm animate-spin">progress_activity</span>
                                                    ) : (
                                                        <Trash2 size={16} />
                                                    )}
                                                </button>
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
