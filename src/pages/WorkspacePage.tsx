import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { projectService, type Project } from '../lib/projectService';
import { useAuth } from '../context/AuthContext';
import { WorkspaceSettingsModal } from './WorkspaceSettingsModal';

export const WorkspacePage = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [showNewAppModal, setShowNewAppModal] = useState(false);
    const [showSettingsModal, setShowSettingsModal] = useState(false);
    const [projects, setProjects] = useState<Project[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filterType, setFilterType] = useState<'all' | 'web' | 'app'>('all');

    useEffect(() => {
        if (user) {
            fetchProjects();
        }
    }, [user]);

    const fetchProjects = async () => {
        setIsLoading(true);
        try {
            const data = await projectService.getProjects();
            setProjects(data);
        } catch (error) {
            console.error('Error fetching projects:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCreateApp = (type: 'web' | 'app') => {
        // Set a default prompt for new projects from workspace
        const defaultPrompt = type === 'web' 
            ? "Create a modern landing page for a creative agency with a glassmorphism navbar, hero section with 3D elements, and a smooth scrolling experience."
            : "Design a mobile fitness tracker app with a clean interface, activity rings for daily goals, and a minimalist dashboard.";
            
        navigate('/editor', { 
            state: { 
                generationType: type,
                prompt: defaultPrompt,
                autoGenerate: true
            } 
        });
    };

    const filteredProjects = projects.filter(p => {
        if (filterType === 'all') return true;
        // Assuming project might have a type or we can infer it
        return (p.metadata as any)?.generationType === filterType;
    });

    return (
        <div className="bg-[#f0fdf4] dark:bg-[#050505] text-gray-900 dark:text-gray-100 h-screen flex overflow-hidden font-sans antialiased transition-colors duration-200 selection:bg-green-500 selection:text-white relative">
            {/* Background Blurs */}
            <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-green-500/10 rounded-full blur-[120px]"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-green-600/10 rounded-full blur-[100px]"></div>
                <div className="absolute top-[40%] left-[40%] w-[20%] h-[20%] bg-emerald-500/5 rounded-full blur-[80px]"></div>
            </div>

            <aside className="w-72 relative z-20 m-4 ml-4 mb-4 flex flex-col flex-shrink-0 h-[calc(100vh-2rem)] rounded-[2.5rem] bg-white/80 dark:bg-[#0a0a0a]/80 backdrop-blur-xl border border-white/20 dark:border-white/5 shadow-xl overflow-hidden">
                <div className="p-6 flex items-center h-20 pl-8">
                    <span className="text-2xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-emerald-600">Noircode</span>
                </div>
                
                <div className="px-4 py-2 flex-1 overflow-y-auto">
                    <div className="mb-6 relative">
                        <button 
                            onClick={() => setShowNewAppModal(true)}
                            className="w-full bg-white dark:bg-zinc-900/50 border border-gray-100 dark:border-white/5 hover:bg-gray-50 dark:hover:bg-zinc-800/80 text-left px-4 py-3 rounded-full flex items-center justify-between group transition-all shadow-sm hover:shadow-md hover:scale-[1.02]"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center">
                                    <span className="material-symbols-outlined text-green-500 text-sm">add</span>
                                </div>
                                <span className="text-sm font-medium">New app</span>
                            </div>
                            <span className="material-symbols-outlined text-gray-400 text-lg">expand_more</span>
                        </button>
                    </div>

                    <nav className="space-y-2">
                        <a className="flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-full bg-green-500/10 text-green-700 dark:text-green-400 shadow-inner" href="#">
                            <span className="material-symbols-outlined text-[20px]">book</span>
                            Workspaces
                        </a>
                        <a className="flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-full text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white transition-all hover:pl-5" href="#">
                            <span className="material-symbols-outlined text-[20px]">rocket_launch</span>
                            Deployments
                        </a>
                        <div className="pt-4 pb-2">
                            <div className="h-px bg-gradient-to-r from-transparent via-gray-200 dark:via-zinc-800 to-transparent mx-4"></div>
                        </div>
                        <button 
                            onClick={() => setShowSettingsModal(true)}
                            className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-full text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white transition-all hover:pl-5"
                        >
                            <span className="material-symbols-outlined text-[20px]">settings</span>
                            Settings
                        </button>
                    </nav>
                </div>

                <div className="p-4 space-y-3 mt-auto">
                    <a className="flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium rounded-full bg-gray-100 dark:bg-white/5 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-white/10 transition-colors border border-transparent hover:border-gray-300 dark:hover:border-zinc-700" href="#">
                        <span className="material-symbols-outlined text-[18px]">smartphone</span>
                        Get app
                    </a>
                    
                    <div className="bg-gradient-to-b from-gray-50 to-gray-100 dark:from-zinc-900 dark:to-black rounded-[1.5rem] p-5 border border-white/10 relative overflow-hidden group">
                        <div className="absolute -right-4 -top-4 w-16 h-16 bg-green-500/20 rounded-full blur-xl group-hover:bg-green-500/30 transition-colors"></div>
                        <div className="flex items-start justify-between mb-2 relative z-10">
                            <div className="flex items-center gap-2 text-sm font-semibold">
                                <span className="material-symbols-outlined text-lg text-green-500">card_giftcard</span>
                                Refer friends
                            </div>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-4 leading-relaxed relative z-10">
                            Get free credits for both of you!
                        </p>
                        <button className="w-full py-2 px-3 bg-white dark:bg-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-700 text-xs font-semibold rounded-full text-gray-800 dark:text-gray-200 transition-transform active:scale-95 shadow-sm border border-gray-200 dark:border-zinc-700 relative z-10">
                            Copy link
                        </button>
                    </div>

                    <button className="w-full flex items-center justify-between px-2 py-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/5 transition-colors group border border-transparent hover:border-gray-200 dark:hover:border-white/10">
                        <div className="flex items-center gap-3 pl-1">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-green-400 to-emerald-600 shadow-lg ring-2 ring-white dark:ring-black"></div>
                            <div className="text-sm font-medium text-gray-700 dark:text-gray-200">{user?.email?.split('@')[0] || 'User'}</div>
                        </div>
                        <div className="w-8 h-8 rounded-full bg-white dark:bg-zinc-800 flex items-center justify-center mr-1 shadow-sm group-hover:bg-green-500 group-hover:text-white transition-colors">
                            <span className="material-symbols-outlined text-sm">chevron_right</span>
                        </div>
                    </button>
                </div>
            </aside>

            <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative z-10">
                <header className="px-8 py-8 flex items-center justify-between flex-shrink-0">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">Workspaces</h1>
                    <div className="flex items-center gap-4">
                        <button 
                            onClick={() => setShowNewAppModal(true)}
                            className="flex items-center gap-2 bg-white dark:bg-white text-gray-900 px-6 py-2.5 rounded-full font-semibold text-sm shadow-lg shadow-green-900/5 hover:shadow-green-900/10 hover:scale-105 transition-all"
                        >
                            <span className="material-symbols-outlined text-xl">add_circle</span>
                            Create
                            <span className="material-symbols-outlined text-xl text-gray-400 ml-1">expand_more</span>
                        </button>
                    </div>
                </header>

                <div className="px-8 pb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="relative w-full sm:w-96 group">
                        <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <span className="material-symbols-outlined text-gray-400 group-focus-within:text-green-500 transition-colors">search</span>
                        </span>
                        <input className="block w-full pl-11 pr-4 py-3 border-none rounded-full leading-5 bg-white dark:bg-white/5 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500/50 sm:text-sm transition-all shadow-sm hover:shadow-md" placeholder="Search projects..." type="text"/>
                    </div>
                    
                    <div className="flex items-center gap-4 self-end sm:self-auto bg-white/50 dark:bg-white/5 p-1.5 rounded-full backdrop-blur-sm border border-white/20">
                        <div className="flex items-center px-2 gap-4 text-sm font-medium text-gray-500 dark:text-gray-400">
                            <button 
                                onClick={() => setFilterType('all')}
                                className={`px-3 py-1.5 rounded-full transition-all hover:shadow-sm ${filterType === 'all' ? 'bg-white dark:bg-white/10 text-gray-900 dark:text-white shadow-sm ring-1 ring-black/5' : 'hover:bg-white dark:hover:bg-white/10 hover:text-gray-900 dark:hover:text-white'}`}
                            >
                                All
                            </button>
                            <button 
                                onClick={() => setFilterType('web')}
                                className={`px-3 py-1.5 rounded-full transition-all hover:shadow-sm ${filterType === 'web' ? 'bg-white dark:bg-white/10 text-gray-900 dark:text-white shadow-sm ring-1 ring-black/5' : 'hover:bg-white dark:hover:bg-white/10 hover:text-gray-900 dark:hover:text-white'}`}
                            >
                                Web
                            </button>
                            <button 
                                onClick={() => setFilterType('app')}
                                className={`px-3 py-1.5 rounded-full transition-all hover:shadow-sm ${filterType === 'app' ? 'bg-white dark:bg-white/10 text-gray-900 dark:text-white shadow-sm ring-1 ring-black/5' : 'hover:bg-white dark:hover:bg-white/10 hover:text-gray-900 dark:hover:text-white'}`}
                            >
                                Mobile
                            </button>
                        </div>
                        <div className="h-4 w-px bg-gray-300 dark:bg-white/10"></div>
                        <div className="flex gap-1">
                            <button className="p-2 rounded-full bg-white dark:bg-zinc-700 shadow-sm text-green-600 dark:text-green-400 ring-1 ring-black/5">
                                <span className="material-symbols-outlined text-lg block">grid_view</span>
                            </button>
                            <button className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-white/10 text-gray-500 dark:text-gray-400 transition-colors">
                                <span className="material-symbols-outlined text-lg block">view_list</span>
                            </button>
                        </div>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto px-8 pb-8">
                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center h-64 gap-4 text-gray-500">
                            <span className="material-symbols-outlined animate-spin text-4xl text-green-500">progress_activity</span>
                            <p className="font-medium animate-pulse">Syncing with database...</p>
                        </div>
                    ) : filteredProjects.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-64 gap-4 text-gray-500 bg-white/30 dark:bg-white/5 rounded-[3rem] border border-dashed border-gray-300 dark:border-white/10">
                            <span className="material-symbols-outlined text-5xl">folder_open</span>
                            <div className="text-center">
                                <p className="text-lg font-bold text-gray-900 dark:text-white">No projects found</p>
                                <p className="text-sm">Start by creating a new web or mobile app.</p>
                            </div>
                            <button 
                                onClick={() => setShowNewAppModal(true)}
                                className="mt-2 bg-green-500 text-black px-6 py-2 rounded-full font-bold text-sm hover:bg-green-400 transition-all shadow-lg shadow-green-500/20"
                            >
                                Create First Project
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                            {filteredProjects.map((project) => (
                                <div 
                                    key={project.id}
                                    onClick={() => navigate(`/editor?project=${project.id}`)}
                                    className="group relative flex flex-col gap-4 p-3 rounded-[2rem] hover:bg-white/40 dark:hover:bg-white/5 transition-all duration-300 cursor-pointer"
                                >
                                    <div className="relative aspect-[4/3] rounded-[1.5rem] overflow-hidden bg-zinc-800 dark:bg-zinc-900 shadow-lg group-hover:shadow-green-500/20 group-hover:-translate-y-1 transition-all duration-300 border border-white/5">
                                        <div className="absolute inset-0 bg-gradient-to-br from-green-500/20 to-emerald-700/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            {project.thumbnail_url ? (
                                                <img src={project.thumbnail_url} alt={project.name} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="flex flex-col items-center gap-2 opacity-30 group-hover:opacity-60 transition-opacity">
                                                    <span className="material-symbols-outlined text-5xl text-gray-400">
                                                        {(project.metadata as any)?.generationType === 'app' ? 'smartphone' : 'language'}
                                                    </span>
                                                    <span className="text-[10px] uppercase font-bold tracking-widest text-gray-400">Preview</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex items-start justify-between px-2">
                                        <div>
                                            <div className="flex items-center gap-2 mb-1.5">
                                                <h3 className="font-bold text-gray-900 dark:text-gray-100 text-base line-clamp-1">{project.name}</h3>
                                                <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full tracking-wide border ${
                                                    (project.metadata as any)?.generationType === 'app'
                                                    ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800'
                                                    : 'bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-white/5'
                                                }`}>
                                                    {(project.metadata as any)?.generationType === 'app' ? 'Mobile' : 'Web'}
                                                </span>
                                            </div>
                                            <p className="text-xs text-gray-500 dark:text-gray-500 font-medium pl-0.5">
                                                Updated {new Date(project.updated_at).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>

            {/* New App Modal */}
            {showNewAppModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="bg-white dark:bg-[#121212] w-full max-w-md rounded-[2.5rem] p-8 shadow-2xl border border-white/10 animate-in fade-in zoom-in duration-300">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold">New Project</h2>
                            <button onClick={() => setShowNewAppModal(false)} className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>
                        <p className="text-gray-500 dark:text-gray-400 mb-8">Choose the platform you want to build for.</p>
                        
                        <div className="grid grid-cols-2 gap-4">
                            <button 
                                onClick={() => handleCreateApp('web')}
                                className="flex flex-col items-center gap-4 p-6 rounded-3xl border border-gray-100 dark:border-white/5 bg-gray-50 dark:bg-white/5 hover:bg-green-500/10 hover:border-green-500/50 transition-all group"
                            >
                                <div className="w-16 h-16 rounded-2xl bg-white dark:bg-zinc-800 flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                                    <span className="material-symbols-outlined text-3xl text-green-500">language</span>
                                </div>
                                <span className="font-bold">Web App</span>
                            </button>

                            <button 
                                onClick={() => handleCreateApp('app')}
                                className="flex flex-col items-center gap-4 p-6 rounded-3xl border border-gray-100 dark:border-white/5 bg-gray-50 dark:bg-white/5 hover:bg-green-500/10 hover:border-green-500/50 transition-all group"
                            >
                                <div className="w-16 h-16 rounded-2xl bg-white dark:bg-zinc-800 flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                                    <span className="material-symbols-outlined text-3xl text-green-500">smartphone</span>
                                </div>
                                <span className="font-bold">Mobile App</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <WorkspaceSettingsModal
                isOpen={showSettingsModal}
                onClose={() => setShowSettingsModal(false)}
            />
        </div>
    );
};
