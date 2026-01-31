import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import { motion, AnimatePresence } from 'framer-motion';

// --- Types ---
type ViewMode = 'design' | 'editor' | 'preview';
type Viewport = 'desktop' | 'tablet' | 'mobile';
type CanvasTool = 'pan' | 'select' | 'edit';
type RightTool = 'dashboard' | 'layers' | 'widgets' | 'palette' | 'settings' | null;

export const Workbench: React.FC = () => {
    // State
    const [activeView, setActiveView] = useState<ViewMode>('preview');
    const [viewport, setViewport] = useState<Viewport>('desktop');
    const [zoom, setZoom] = useState(1);
    const [prompt, setPrompt] = useState('');
    const [loading, setLoading] = useState(false);

    // UI State
    const [activeTool, setActiveTool] = useState<RightTool>('dashboard');
    const [canvasTool, setCanvasTool] = useState<CanvasTool>('select');
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [showProfileMenu, setShowProfileMenu] = useState(false);

    // Toast Notification
    const [toast, setToast] = useState<{ message: string, type: 'success' | 'info' } | null>(null);

    // Placeholder code state
    const [code] = useState('<!-- Designed with Noir -->\n<div class="h-full flex flex-col items-center justify-center p-10 text-center bg-gradient-to-br from-zinc-900 to-black text-white">\n  <div class="w-20 h-20 bg-lime-500 rounded-2xl mb-6 shadow-[0_0_40px_rgba(132,204,22,0.3)] animate-pulse"></div>\n  <h1 class="text-5xl font-black mb-4 tracking-tight">Hello Future</h1>\n  <p class="text-zinc-400 max-w-md text-lg">Start designing by entering a prompt. Experience the power of Noir AI.</p>\n</div>');

    // Effects
    useEffect(() => {
        if (toast) {
            const timer = setTimeout(() => setToast(null), 3000);
            return () => clearTimeout(timer);
        }
    }, [toast]);

    // Helpers
    const showToast = (message: string, type: 'success' | 'info' = 'info') => {
        setToast({ message, type });
    };

    // Handlers
    const generateCode = () => {
        if (!prompt.trim()) {
            showToast("Please enter a prompt first", "info");
            return;
        }
        setLoading(true);
        // Simulate AI generation
        setTimeout(() => {
            setLoading(false);
            showToast("Design generated successfully", "success");
        }, 2000);
    };

    const handleInputParsers = (type: 'image' | 'link' | 'code') => {
        if (type === 'image') {
            showToast("Image uploader opened", "info");
        } else if (type === 'link') {
            setPrompt(prev => prev + " [Link Text](url)");
        } else if (type === 'code') {
            setPrompt(prev => prev + "\n```\ncode here\n```\n");
        }
    };

    const handleUndoRedo = (action: 'undo' | 'redo') => {
        showToast(`${action === 'undo' ? 'Undo' : 'Redo'} action triggered`, "info");
    };

    return (
        <div className="h-screen flex flex-col overflow-hidden bg-black text-white font-sans selection:bg-primary/30 relative" onClick={() => setShowProfileMenu(false)}>
            {/* Ambient Background Glows */}
            <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] pointer-events-none mix-blend-screen"></div>
            <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[120px] pointer-events-none mix-blend-screen"></div>

            {/* Toast Notification */}
            <AnimatePresence>
                {toast && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="absolute top-20 left-1/2 -translate-x-1/2 z-[100] px-4 py-2 bg-zinc-900 border border-white/10 rounded-full shadow-2xl flex items-center gap-2"
                    >
                        <span className={clsx("material-symbols-outlined text-sm", toast.type === 'success' ? "text-primary" : "text-blue-400")}>
                            {toast.type === 'success' ? 'check_circle' : 'info'}
                        </span>
                        <span className="text-xs font-bold">{toast.message}</span>
                    </motion.div>
                )}
            </AnimatePresence>

            <style>{`
                .dots-grid {
                    background-image: radial-gradient(#222 1px, transparent 1px);
                    background-size: 24px 24px;
                }
                ::-webkit-scrollbar { width: 4px; }
                ::-webkit-scrollbar-track { background: transparent; }
                ::-webkit-scrollbar-thumb { background: #333; border-radius: 10px; }
                ::-webkit-scrollbar-thumb:hover { background: #444; }
                textarea { scrollbar-width: none; -ms-overflow-style: none; }
                textarea::-webkit-scrollbar { display: none; }
            `}</style>

            {/* Header - Glassmorphism */}
            <header className="h-16 flex items-center justify-between px-6 z-50 backdrop-blur-md bg-black/40 border-b border-white/5">
                <div className="flex items-center gap-10">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-gradient-to-br from-primary to-emerald-500 rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
                            <span className="material-symbols-outlined text-black font-bold text-xl">bolt</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="font-black tracking-tight text-lg leading-none">NOIR<span className="text-primary">.AI</span></span>
                            <span className="text-[10px] font-medium text-zinc-500 tracking-widest uppercase mt-0.5">Workbench v2.0</span>
                        </div>
                    </div>

                    {/* View Switcher Pill */}
                    <div className="flex bg-zinc-900/50 p-1 rounded-full border border-white/5 backdrop-blur-sm">
                        {(['preview', 'design', 'editor'] as ViewMode[]).map((mode) => (
                            <button
                                key={mode}
                                onClick={() => { setActiveView(mode); showToast(`Switched to ${mode} mode`); }}
                                className={clsx(
                                    "px-6 py-1.5 text-[11px] font-bold uppercase tracking-widest rounded-full transition-all duration-300",
                                    activeView === mode
                                        ? "bg-primary text-black shadow-[0_0_20px_rgba(50,205,50,0.3)] scale-105"
                                        : "text-zinc-500 hover:text-white hover:bg-white/5"
                                )}
                            >
                                {mode}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="flex items-center gap-6">
                    {/* Viewport Controls */}
                    <div className="flex items-center gap-1 bg-zinc-900/30 p-1 rounded-lg border border-white/5">
                        {(['desktop', 'tablet', 'mobile'] as Viewport[]).map(v => (
                            <button
                                key={v}
                                onClick={() => setViewport(v)}
                                className={clsx(
                                    "p-2 rounded-md transition-all",
                                    viewport === v ? "bg-white/10 text-primary" : "text-zinc-500 hover:text-white"
                                )}
                            >
                                <span className="material-symbols-outlined text-xl">
                                    {v === 'desktop' ? 'desktop_windows' : v === 'tablet' ? 'tablet_mac' : 'smartphone'}
                                </span>
                            </button>
                        ))}
                    </div>

                    {/* Zoom */}
                    <div className="flex items-center gap-3 text-sm font-mono text-zinc-400">
                        <span className="material-symbols-outlined text-lg cursor-pointer hover:text-white" onClick={() => setZoom(z => Math.max(0.2, z - 0.1))}>remove</span>
                        <span className="w-12 text-center text-white">{Math.round(zoom * 100)}%</span>
                        <span className="material-symbols-outlined text-lg cursor-pointer hover:text-white" onClick={() => setZoom(z => z + 0.1)}>add</span>
                    </div>

                    {/* Export Button */}
                    <button onClick={() => showToast("Exporting project...")} className="bg-white text-black px-5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 hover:bg-zinc-200 transition-all shadow-lg shadow-white/5 active:scale-95">
                        <span className="material-symbols-outlined text-lg">download</span>
                        Export
                    </button>
                </div>
            </header>

            <main className="flex-1 flex overflow-hidden relative">
                {/* Left Sidebar - Floating Card Style */}
                <motion.aside
                    initial={{ width: 320 }}
                    animate={{ width: sidebarCollapsed ? 0 : 320 }}
                    className="flex flex-col border-r border-white/5 bg-black/40 backdrop-blur-xl z-40 relative group"
                >
                    <div className="p-5 flex items-center justify-between">
                        <h2 className="text-xs font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-2">
                            <span className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse"></span>
                            AI Architect
                        </h2>
                        <button className="text-zinc-600 hover:text-white transition-colors">
                            <span className="material-symbols-outlined text-lg">tune</span>
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto px-5">
                        {/* Chat History / Context */}
                        <div className="flex flex-col items-center justify-center h-full text-center opacity-40">
                            <div className="w-16 h-16 bg-gradient-to-tr from-zinc-800 to-zinc-900 rounded-2xl flex items-center justify-center mb-4 transform rotate-12">
                                <span className="material-symbols-outlined text-3xl text-zinc-500">auto_awesome</span>
                            </div>
                            <p className="text-sm font-medium text-zinc-500">Design Assistant Ready</p>
                        </div>
                    </div>

                    {/* Prompt Input Area */}
                    <div className="p-5 bg-gradient-to-t from-black via-black to-transparent">
                        <div className="bg-[#0A0A0A] rounded-2xl border border-white/5 p-4 shadow-xl focus-within:border-primary/50 focus-within:shadow-[0_0_30px_rgba(50,205,50,0.1)] transition-all duration-300 group">
                            <textarea
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                                className="w-full bg-transparent border-none focus:ring-0 text-sm text-white placeholder-zinc-600 resize-none font-medium leading-relaxed"
                                placeholder="Describe your dream UI..."
                                rows={3}
                            ></textarea>

                            <div className="flex items-center justify-between mt-4 pt-3 border-t border-white/5">
                                <div className="flex gap-2">
                                    {(['image', 'link', 'code'] as const).map(icon => (
                                        <button
                                            key={icon}
                                            onClick={() => handleInputParsers(icon)}
                                            className="p-1.5 rounded-lg text-zinc-500 hover:text-white hover:bg-white/5 transition-colors"
                                            title={`Insert ${icon}`}
                                        >
                                            <span className="material-symbols-outlined text-lg">{icon}</span>
                                        </button>
                                    ))}
                                </div>
                                <button
                                    onClick={generateCode}
                                    disabled={loading || !prompt.trim()}
                                    className="w-8 h-8 rounded-lg bg-primary text-black flex items-center justify-center hover:scale-110 active:scale-95 transition-all disabled:opacity-50 disabled:hover:scale-100 shadow-[0_0_15px_rgba(50,205,50,0.4)]"
                                >
                                    {loading ? (
                                        <span className="material-symbols-outlined text-lg animate-spin">progress_activity</span>
                                    ) : (
                                        <span className="material-symbols-outlined text-lg font-bold">arrow_upward</span>
                                    )}
                                </button>
                            </div>
                        </div>
                        <p className="text-[10px] text-zinc-600 text-center mt-3 font-medium">
                            Powered by Noir Neural Engine v2.4
                        </p>
                    </div>

                    {/* Collapse Toggle */}
                    <button
                        onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                        className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-12 bg-black border border-white/10 rounded-full flex items-center justify-center cursor-pointer text-zinc-500 hover:text-white z-50 opacity-0 group-hover:opacity-100 transition-all"
                    >
                        <span className="material-symbols-outlined text-sm">chevron_left</span>
                    </button>
                </motion.aside>

                {/* Canvas Area - Infinite Space */}
                <section className="flex-1 relative overflow-hidden dots-grid flex items-center justify-center perspective-[1000px]">
                    <motion.div
                        animate={{ scale: zoom, rotateX: 0 }}
                        transition={{ type: "spring", stiffness: 200, damping: 20 }}
                        className={clsx(
                            "relative shadow-[0_0_100px_rgba(0,0,0,0.5)] transition-all duration-500 bg-black",
                            viewport === 'desktop' ? "w-full h-full" :
                                viewport === 'tablet' ? "w-[768px] h-[1024px] rounded-xl border border-white/10" :
                                    "w-[375px] h-[812px] rounded-[3rem] border-8 border-zinc-900"
                        )}
                    >
                        {activeView === 'editor' ? (
                            <div className="w-full h-full bg-[#050505] p-8 font-mono text-sm overflow-auto text-blue-400 selection:bg-blue-500/20">
                                <pre>{code}</pre>
                            </div>
                        ) : activeView === 'design' ? (
                            <div className="w-full h-full relative group">
                                <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                <iframe
                                    title="design"
                                    className="w-full h-full border-none bg-white"
                                    srcDoc={code}
                                />
                            </div>
                        ) : (
                            <iframe
                                title="preview"
                                className="w-full h-full border-none bg-white"
                                srcDoc={code}
                            />
                        )}
                    </motion.div>

                    {/* Floating Island Controls */}
                    <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-2 p-2 pl-4 pr-2 bg-black/80 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl z-50">
                        <div className="flex items-center gap-4 text-xs font-bold text-zinc-400 mr-4 border-r border-white/10 pr-4">
                            <button onClick={() => handleUndoRedo('undo')} className="flex items-center gap-2 hover:text-white cursor-pointer transition-colors"><span className="material-symbols-outlined text-lg">undo</span> Undo</button>
                            <button onClick={() => handleUndoRedo('redo')} className="flex items-center gap-2 hover:text-white cursor-pointer transition-colors"><span className="material-symbols-outlined text-lg">redo</span> Redo</button>
                        </div>

                        <div className="flex items-center gap-1">
                            {([
                                { id: 'pan', icon: 'pan_tool' },
                                { id: 'select', icon: 'touch_app' },
                                { id: 'edit', icon: 'edit' }
                            ] as const).map((tool) => (
                                <button
                                    key={tool.id}
                                    onClick={() => { setCanvasTool(tool.id as CanvasTool); showToast(`Tool: ${tool.id}`); }}
                                    className={clsx(
                                        "p-3 rounded-xl transition-all hover:bg-white/10",
                                        canvasTool === tool.id ? "text-primary bg-primary/10" : "text-zinc-400 hover:text-white"
                                    )}
                                >
                                    <span className="material-symbols-outlined text-xl">{tool.icon}</span>
                                </button>
                            ))}
                        </div>

                        <button
                            onClick={generateCode}
                            className="ml-2 bg-white text-black px-6 py-3 rounded-xl font-bold text-xs flex items-center gap-2 hover:scale-105 active:scale-95 transition-all shadow-lg hover:shadow-white/20"
                        >
                            <span className="material-symbols-outlined text-lg">auto_fix_high</span>
                            Generate
                        </button>
                    </div>
                </section>

                {/* Right Toolbar - Minimalist */}
                <aside className="w-16 flex flex-col items-center py-6 gap-6 shrink-0 z-40 bg-black/40 backdrop-blur-xl border-l border-white/5 relative">
                    {(['dashboard', 'layers', 'widgets', 'palette', 'settings'] as RightTool[]).map((tool, i) => (
                        <div key={tool || i} className="relative group">
                            {activeTool === tool && (
                                <motion.div
                                    layoutId="activeTab"
                                    className="absolute inset-0 bg-primary/10 rounded-xl"
                                    initial={false}
                                />
                            )}
                            <button
                                onClick={() => { setActiveTool(activeTool === tool ? null : tool); showToast(activeTool === tool ? "Panel Closed" : `${tool} Panel Open`); }}
                                className={clsx(
                                    "p-3 rounded-xl transition-all duration-300 relative z-10",
                                    activeTool === tool ? "text-primary" : "text-zinc-500 hover:text-white"
                                )}
                            >
                                <span className="material-symbols-outlined text-2xl">{tool}</span>
                            </button>
                            {/* Tooltip */}
                            <div className="absolute right-full top-1/2 -translate-y-1/2 mr-3 px-2 py-1 bg-zinc-900 border border-white/10 text-white text-[10px] font-bold uppercase rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                                {tool}
                            </div>
                        </div>
                    ))}

                    <div className="mt-auto relative">
                        <button
                            onClick={(e) => { e.stopPropagation(); setShowProfileMenu(!showProfileMenu); }}
                            className="w-10 h-10 rounded-full bg-gradient-to-br from-zinc-800 to-zinc-900 border border-white/10 flex items-center justify-center hover:border-primary/50 transition-colors"
                        >
                            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="User" className="w-7 h-7" />
                        </button>

                        <AnimatePresence>
                            {showProfileMenu && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95, x: 10 }}
                                    animate={{ opacity: 1, scale: 1, x: 0 }}
                                    exit={{ opacity: 0, scale: 0.95, x: 10 }}
                                    className="absolute bottom-0 right-full mr-4 w-48 bg-zinc-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-50 p-1"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <div className="p-3 border-b border-white/5 mb-1">
                                        <p className="text-sm font-bold text-white">Felix The Cat</p>
                                        <p className="text-xs text-zinc-500">Pro Plan</p>
                                    </div>
                                    <button className="w-full text-left px-3 py-2 text-xs font-bold text-zinc-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors flex items-center gap-2">
                                        <span className="material-symbols-outlined text-base">person</span> Profile
                                    </button>
                                    <button className="w-full text-left px-3 py-2 text-xs font-bold text-zinc-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors flex items-center gap-2">
                                        <span className="material-symbols-outlined text-base">credit_card</span> Billing
                                    </button>
                                    <div className="h-px bg-white/5 my-1"></div>
                                    <button className="w-full text-left px-3 py-2 text-xs font-bold text-red-400 hover:bg-red-500/10 rounded-lg transition-colors flex items-center gap-2">
                                        <span className="material-symbols-outlined text-base">logout</span> Logout
                                    </button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </aside>
            </main>
        </div>
    );
};
