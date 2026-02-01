import { Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { Project } from '../lib/projectService';

interface RecentProjectsProps {
    projects: Project[];
}

export const RecentProjects: React.FC<RecentProjectsProps> = ({ projects }) => {
    const navigate = useNavigate();

    return (
        <section className="py-12 px-6">
            <div className="max-w-7xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl font-bold text-white tracking-tight">Recent Projects</h2>
                    <button
                        onClick={() => navigate('/editor')}
                        className="flex items-center gap-2 px-4 py-2 bg-lime-500 text-black font-semibold rounded-full hover:bg-lime-400 transition-colors text-xs"
                    >
                        <Plus size={16} />
                        New Project
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {/* Create New Card */}
                    <button
                        onClick={() => navigate('/editor')}
                        className="group flex flex-col items-center justify-center p-6 rounded-xl border-2 border-dashed border-white/20 hover:border-lime-500/50 hover:bg-white/5 transition-all duration-300 cursor-pointer h-full min-h-[160px]"
                    >
                        <div className="p-3 rounded-full bg-white/10 group-hover:bg-lime-500/20 mb-3 transition-colors">
                            <Plus className="text-white/60 group-hover:text-lime-400 transition-colors" size={24} />
                        </div>
                        <span className="text-sm font-medium text-white/60 group-hover:text-white transition-colors">Create New Project</span>
                    </button>

                    {/* Recent Projects */}
                    {projects.map(project => (
                        <button
                            key={project.id}
                            onClick={() => navigate(`/editor?project=${project.id}`)}
                            className="group relative p-5 rounded-xl border border-lime-500/20 bg-black/50 backdrop-blur-sm hover:border-lime-500/60 hover:shadow-[0_0_20px_-5px_rgba(132,204,22,0.3)] transition-all duration-300 cursor-pointer text-left overflow-hidden h-full flex flex-col"
                        >
                            <div className="flex items-center justify-between mb-4 w-full">
                                <span className={`text-[10px] px-2 py-0.5 rounded border ${project.generation_type === 'app'
                                        ? 'border-blue-500/30 text-blue-400 bg-blue-500/10'
                                        : 'border-emerald-500/30 text-emerald-400 bg-emerald-500/10'
                                    }`}>
                                    {project.generation_type === 'app' ? 'APP' : 'WEB'}
                                </span>
                                <span className="text-[10px] text-zinc-500 font-mono">
                                    {new Date(project.updated_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                </span>
                            </div>
                            <h3 className="text-lime-100 font-bold text-base truncate w-full group-hover:text-lime-300 transition-colors mb-1">
                                {project.name || 'Untitled Project'}
                            </h3>
                            <p className="text-zinc-500 text-xs truncate w-full opacity-60">
                                {project.prompt || 'No prompt'}
                            </p>
                        </button>
                    ))}
                </div>
            </div>
        </section>
    );
};
