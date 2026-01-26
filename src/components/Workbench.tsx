import React, { useState, useEffect, useRef } from 'react';

import clsx from 'clsx';
import { motion, AnimatePresence } from 'framer-motion';
import { ModelSelector } from './ModelSelector';

// --- Types ---
type ViewMode = 'design' | 'editor' | 'preview';
type Viewport = 'desktop' | 'tablet' | 'mobile';
// ==========================================
// COMPONENT INTERFACES
// ==========================================

const Header: React.FC<{
    activeView: ViewMode;
    setActiveView: (view: ViewMode) => void;
    viewport: Viewport;
    setViewport: (v: Viewport) => void;
    zoom: number;
    setZoom: (z: number) => void;
}> = ({ activeView, setActiveView, viewport, setViewport, zoom, setZoom }) => (
    <header className="flex items-center justify-between border-b border-white/10 px-6 py-2 bg-background-light dark:bg-background-dark z-50">
        <div className="flex items-center gap-4">
            <div className="flex flex-col">
                <h2 className="text-white text-[12px] font-bold leading-tight tracking-tight uppercase opacity-80">Workbench</h2>
                <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="size-1 rounded-full bg-green-500 animate-pulse"></span>
                    <p className="text-slate-500 text-[9px] font-medium uppercase tracking-widest">Live</p>
                </div>
            </div>
        </div>

        <div className="flex flex-1 justify-center max-w-[320px] mx-8">
            <div className="flex bg-slate-800/50 rounded-lg p-0.5 w-full border border-white/5">
                {(['preview', 'design', 'editor'] as ViewMode[]).map((mode) => (
                    <button
                        key={mode}
                        onClick={() => setActiveView(mode)}
                        className={clsx(
                            "flex-1 text-[10px] font-bold py-1 rounded transition-all capitalize",
                            activeView === mode ? "bg-primary text-white shadow-lg" : "text-slate-500 hover:text-white"
                        )}
                    >
                        {mode}
                    </button>
                ))}
            </div>
        </div>

        <div className="flex items-center gap-3">
            <div className="flex items-center bg-white/5 border border-white/10 rounded-lg p-0.5">
                {(['desktop', 'tablet', 'mobile'] as Viewport[]).map((v) => (
                    <button
                        key={v}
                        onClick={() => setViewport(v)}
                        className={clsx(
                            "p-1 rounded-md hover:bg-white/5 transition-all",
                            viewport === v ? "text-primary bg-white/10" : "text-slate-600 hover:text-slate-300"
                        )}
                        title={v.charAt(0).toUpperCase() + v.slice(1)}
                    >
                        <span className="material-symbols-outlined text-[15px]">{v === 'desktop' ? 'desktop_windows' : v === 'tablet' ? 'tablet_mac' : 'smartphone'}</span>
                    </button>
                ))}
            </div>

            <div className="flex items-center bg-white/5 border border-white/10 rounded-lg p-0.5">
                <button
                    onClick={() => setZoom(Math.max(0.1, zoom - 0.1))}
                    className="p-1 rounded-md hover:bg-white/5 text-slate-600 hover:text-white transition-all"
                    title="Zoom Out"
                >
                    <span className="material-symbols-outlined text-[15px]">remove</span>
                </button>
                <div
                    onClick={() => setZoom(1)}
                    className="px-2 text-[9px] font-mono text-slate-500 cursor-pointer hover:text-white transition-colors min-w-[36px] text-center"
                >
                    {Math.round(zoom * 100)}%
                </div>
                <button
                    onClick={() => setZoom(zoom + 0.1)}
                    className="p-1 rounded-md hover:bg-white/5 text-slate-600 hover:text-white transition-all"
                    title="Zoom In"
                >
                    <span className="material-symbols-outlined text-[15px]">add</span>
                </button>
            </div>

            <div className="flex -space-x-1.5 ml-2">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="size-6 rounded-full border border-background-dark bg-slate-800 flex items-center justify-center text-[8px] bg-cover shadow-sm" style={{ backgroundImage: `url('https://i.pravatar.cc/150?u=${i}')` }}></div>
                ))}
            </div>

            <button className="flex items-center justify-center rounded-lg h-8 px-3 bg-primary text-white text-[11px] font-bold shadow-lg shadow-primary/20 hover:brightness-110 active:scale-95 transition-all ml-1">
                Deploy
            </button>
            <div className="size-8 rounded-full bg-slate-800 flex items-center justify-center ml-1 border border-white/5 hover:border-white/20 transition-colors cursor-pointer">
                <span className="material-symbols-outlined text-white text-[18px]">person</span>
            </div>
        </div>
    </header>
);

const SidebarLeft: React.FC<{
    isCollapsed: boolean;
    setIsCollapsed: (c: boolean) => void;
}> = ({ isCollapsed, setIsCollapsed }) => (
    <div className="flex h-full shrink-0">
        {/* Vertical Rail */}
        <div className="w-14 flex flex-col items-center py-4 bg-[#0a0c10] border-r border-white/10 z-30 shrink-0">
            {/* Logo */}
            <div className="size-8 text-primary mb-6 relative group cursor-pointer hover:scale-110 transition-transform duration-300">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-[0_0_8px_rgba(43,140,238,0.5)]">
                    <path d="M12 2L2 12L12 22L22 12L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M12 6L6 12L12 18L18 12L12 6Z" fill="currentColor" fillOpacity="0.2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            </div>

            {/* Rail Toggles */}
            <div className="flex flex-col gap-3">
                {['layers', 'folder', 'search', 'settings'].map((icon, idx) => (
                    <button
                        key={icon}
                        onClick={() => { if (icon === 'layers') setIsCollapsed(!isCollapsed); }}
                        className={clsx("size-9 flex items-center justify-center rounded-lg transition-all group", (idx === 0 && !isCollapsed) ? "bg-primary/10 text-primary border border-primary/20 shadow-[0_0_10px_rgba(43,140,238,0.1)]" : "text-slate-600 hover:text-white hover:bg-white/5")}
                    >
                        <span className="material-symbols-outlined text-[17px]">{icon}</span>
                    </button>
                ))}
            </div>
        </div>

        {/* Hierarchy Pane */}
        <motion.aside
            initial={false}
            animate={{ width: isCollapsed ? 0 : 220 }}
            className="relative border-r border-white/10 flex flex-col glass-panel z-20 overflow-hidden"
        >
            <button
                onClick={() => setIsCollapsed(!isCollapsed)}
                className={clsx(
                    "absolute -right-3 top-1/2 -translate-y-1/2 size-5 rounded-full bg-slate-800 border border-white/10 flex items-center justify-center text-slate-500 hover:text-white z-50 transition-all",
                    isCollapsed ? "-translate-x-1 rotate-180" : ""
                )}
            >
                <span className="material-symbols-outlined text-[14px]">chevron_left</span>
            </button>

            <div className={clsx("flex flex-col h-full w-[220px]", isCollapsed && "opacity-0 invisible")}>
                <div className="p-4 flex flex-col gap-6">
                    <div className="flex flex-col">
                        <h1 className="text-white text-[11px] font-bold uppercase tracking-widest opacity-40">Hierarchy</h1>
                        <p className="text-primary text-[9px] font-mono mt-0.5">V2.4 ENGINE</p>
                    </div>
                    <nav className="flex flex-col gap-0.5">
                        {['Pages', 'Sections', 'Layers', 'Assets', 'Styles'].map((label, i) => {
                            const active = i === 2; // Layers active
                            return (
                                <div key={label} className={clsx("flex items-center gap-2 px-3 py-1.5 rounded-md cursor-pointer transition-all duration-200 group", active ? "bg-primary/10 text-primary shadow-[0_0_10px_rgba(43,140,238,0.1)]" : "text-slate-500 hover:bg-white/5 hover:text-slate-300")}>
                                    <p className={clsx("text-[12px]", active ? "font-bold" : "font-medium")}>{label}</p>
                                    {i === 0 && <span className="ml-auto text-[9px] bg-slate-800 px-1.5 py-0.5 rounded-full text-white/60">4</span>}
                                </div>
                            );
                        })}

                        <div className="ml-3 flex flex-col gap-0.5 border-l border-white/5 pl-3 mt-2">
                            {['Header', 'Hero Section', 'Features'].map((label, j) => {
                                const active = j === 1;
                                return (
                                    <div key={label} className={clsx("flex items-center py-1 text-[11px] cursor-pointer transition-all group", active ? "text-white font-bold" : "text-slate-600 hover:text-slate-300")}>
                                        {active && <span className="size-1 rounded-full bg-primary mr-2"></span>}
                                        {label}
                                    </div>
                                );
                            })}
                        </div>
                    </nav>
                </div>
                <div className="mt-auto p-4">
                    <button className="w-full flex items-center justify-center gap-2 rounded-lg h-9 px-4 bg-white/5 text-slate-400 text-[11px] font-bold hover:bg-white/10 hover:text-white border border-white/5 transition-all">
                        <span className="material-symbols-outlined text-[14px]">add</span>
                        New Page
                    </button>
                </div>
            </div>
        </motion.aside>
    </div>
);

const CanvasArea: React.FC<{
    code: string;
    loading: boolean;
    activeView: ViewMode;
    setCode: (c: string) => void;
    textareaRef: React.RefObject<HTMLTextAreaElement | null>;
    onSelect: () => void;
    viewport: Viewport;
    zoom: number;
    isPanning: boolean;
    setIsPanning: (p: boolean) => void;
}> = ({ code, loading, activeView, setCode, textareaRef, onSelect, viewport, zoom, isPanning, setIsPanning }) => (
    <section className={clsx(
        "flex-1 bg-[#0a0c10] relative flex flex-col items-center justify-center overflow-hidden",
        (viewport !== 'desktop' || activeView === 'editor') ? "p-8" : "p-0"
    )}>
        <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: "radial-gradient(#2b8cee 0.5px, transparent 0.5px)", backgroundSize: "24px 24px" }}></div>

        <div className="flex-1 w-full h-full relative overflow-hidden flex flex-col pointer-events-auto">
            {activeView === 'editor' ? (
                <div className="flex-1 flex flex-col bg-[#0a0c10]">
                    <div className="h-8 bg-[#1e2227] border-b border-white/5 flex items-center justify-between px-4 shrink-0">
                        <div className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-[13px] text-[#569cd6]">code</span>
                            <span className="text-[10px] font-mono text-slate-500 uppercase">index.html</span>
                        </div>
                    </div>
                    <div className="flex-1 flex overflow-hidden relative">
                        <div className="w-10 bg-[#0a0c10] border-r border-white/5 py-4 flex flex-col items-center text-[9px] font-mono text-slate-700 select-none space-y-0.5 overflow-hidden">
                            {Array.from({ length: 50 }).map((_, i) => (
                                <div key={i} className="h-6 flex items-center">{i + 1}</div>
                            ))}
                        </div>
                        <div className="flex-1 relative overflow-auto custom-scrollbar">
                            <textarea
                                ref={textareaRef}
                                value={code}
                                onChange={(e) => setCode(e.target.value)}
                                onSelect={onSelect}
                                className="absolute inset-0 bg-transparent text-slate-300 caret-primary font-mono text-[12px] leading-6 resize-none focus:outline-none p-6 selection:bg-primary/20"
                                spellCheck={false}
                            />
                        </div>
                    </div>
                </div>
            ) : (
                <motion.div
                    animate={{ scale: zoom }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    className={clsx(
                        "flex-1 flex items-center justify-center w-full h-full relative",
                        isPanning ? "cursor-grab active:cursor-grabbing" : "cursor-default"
                    )}
                >
                    <div className={clsx(
                        "bg-white transition-all duration-500 flex flex-col overflow-hidden relative",
                        viewport === 'desktop' ? "w-full h-full shadow-none rounded-none" :
                            viewport === 'tablet' ? "w-[768px] h-[800px] rounded-xl shadow-2xl border border-white/10" :
                                "w-[375px] h-[780px] rounded-2xl shadow-2xl border border-white/10"
                    )}>
                        {viewport !== 'desktop' && (
                            <div className="h-8 bg-slate-100 border-b border-slate-200 flex items-center px-4 gap-4 shrink-0">
                                <div className="flex gap-1">
                                    <div className="size-2 rounded-full bg-slate-300"></div>
                                    <div className="size-2 rounded-full bg-slate-300"></div>
                                    <div className="size-2 rounded-full bg-slate-300"></div>
                                </div>
                                <div className="flex-1 bg-white border border-slate-200 rounded-md h-5 px-3 flex items-center">
                                    <div className="text-[8px] text-slate-400 font-mono w-full text-center truncate">localhost:3000/preview</div>
                                </div>
                            </div>
                        )}

                        <div className="flex-1 relative">
                            <iframe
                                srcDoc={activeView === 'design' ? code + `
                                    <style>
                                        .noir-hover { outline: 2px solid #2b8cee !important; cursor: pointer !important; }
                                        .noir-selected { outline: 3px solid #2b8cee !important; outline-offset: -3px !important; background: rgba(43,140,238,0.1) !important; }
                                    </style>
                                    <script>
                                        document.body.addEventListener('mouseover', (e) => {
                                            const all = document.querySelectorAll('.noir-hover');
                                            all.forEach(el => el.classList.remove('noir-hover'));
                                            e.target.classList.add('noir-hover');
                                        });
                                        document.body.addEventListener('click', (e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            const all = document.querySelectorAll('.noir-selected');
                                            all.forEach(el => el.classList.remove('noir-selected'));
                                            e.target.classList.add('noir-selected');
                                            window.parent.postMessage({ 
                                                type: 'ELEMENT_SELECTED', 
                                                tagName: e.target.tagName,
                                                id: e.target.id,
                                                className: e.target.className,
                                                text: e.target.innerText.substring(0, 30) 
                                            }, '*');
                                        });
                                    </script>
                                ` : code}
                                className="w-full h-full border-none"
                                title="Preview"
                                sandbox="allow-scripts"
                            />

                            {loading && (
                                <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-black/40 backdrop-blur-sm z-30">
                                    <div className="size-10 rounded-full border-2 border-primary border-t-transparent animate-spin"></div>
                                    <p className="text-primary font-bold text-[11px] tracking-widest uppercase">Rendering</p>
                                </div>
                            )}
                        </div>
                    </div>
                </motion.div>
            )}
        </div>

        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-0.5 bg-slate-900/90 backdrop-blur-xl border border-white/5 rounded-full p-1 z-40 shadow-2xl scale-85">
            <button className="p-2 hover:bg-white/5 rounded-full text-slate-600 hover:text-white transition-colors"><span className="material-symbols-outlined text-[15px]">undo</span></button>
            <button className="p-2 hover:bg-white/5 rounded-full text-slate-600 hover:text-white transition-colors"><span className="material-symbols-outlined text-[15px]">redo</span></button>
            <div className="w-[1px] h-4 bg-white/10 mx-1"></div>
            <button
                onClick={() => setIsPanning(!isPanning)}
                className={clsx(
                    "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold transition-all",
                    isPanning ? "bg-primary text-white" : "text-slate-500 hover:text-white hover:bg-white/5"
                )}
            >
                <span className="material-symbols-outlined text-[15px]">{isPanning ? 'pan_tool_alt' : 'pan_tool'}</span>
                Pan
            </button>
            <div className="w-[1px] h-4 bg-white/10 mx-1"></div>
            {['format_paint', 'add_box'].map((icon) => (
                <button key={icon} className="p-2.5 hover:bg-white/5 rounded-full text-slate-500 hover:text-white transition-colors">
                    <span className="material-symbols-outlined text-[15px]">{icon}</span>
                </button>
            ))}
            <button className="flex items-center gap-1.5 px-4 py-1.5 bg-primary/90 text-white rounded-full text-[10px] font-black shadow-lg shadow-primary/20 hover:brightness-110 ml-1 uppercase tracking-tighter">
                <span className="material-symbols-outlined text-[15px]">bolt</span> Quick Action
            </button>
        </div>
    </section>
);

const SidebarRight: React.FC<{
    prompt: string;
    setPrompt: (p: string) => void;
    loading: boolean;
    generateCode: () => void;
    code: string;
    context: string | null;
    setContext: (c: string | null) => void;
    model: string;
    setModel: (m: string) => void;
}> = ({ prompt, setPrompt, loading, generateCode, code, context, setContext, model, setModel }) => (
    <aside className="w-[280px] border-l border-white/10 flex flex-col glass-panel z-20">
        <div className="p-3 border-b border-white/5 flex items-center justify-between bg-slate-900/40">
            <div className="flex items-center gap-3">
                <div className="size-5 rounded-md bg-primary/10 flex items-center justify-center border border-primary/20">
                    <span className="material-symbols-outlined text-[13px] text-primary">psychology</span>
                </div>
                <span className="text-[11px] font-bold text-white uppercase tracking-widest opacity-80">AI Navigator</span>
            </div>
            <button className="p-1 hover:bg-white/5 rounded transition-all"><span className="material-symbols-outlined text-[16px] text-slate-600">more_vert</span></button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 custom-scrollbar bg-slate-900/20">
            {context && (
                <div className="bg-primary/5 border border-primary/10 rounded-lg p-3 relative group animate-in fade-in slide-in-from-top-1">
                    <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[9px] font-bold text-primary uppercase tracking-tighter flex items-center gap-1">
                            <span className="material-symbols-outlined text-[11px]">attachment</span>
                            Context
                        </span>
                        <button onClick={() => setContext(null)} className="text-slate-600 hover:text-white transition-colors"><span className="material-symbols-outlined text-[12px]">close</span></button>
                    </div>
                    <p className="text-[10px] text-slate-500 line-clamp-2 font-mono leading-relaxed">{context}</p>
                </div>
            )}

            {!loading && !code && !context && (
                <div className="h-full flex items-center justify-center opacity-20"><span className="material-symbols-outlined text-[48px]">smart_toy</span></div>
            )}

            {loading && (
                <div className="space-y-4">
                    <div className="bg-primary/10 text-white p-3 rounded-xl rounded-tr-none text-[11px] border border-primary/20 max-w-[90%] self-end ml-auto">{prompt}</div>
                    <div className="flex items-start gap-2">
                        <div className="size-5 rounded-full bg-primary flex items-center justify-center shrink-0 mt-0.5"><span className="material-symbols-outlined text-[11px] text-white">bolt</span></div>
                        <div className="bg-slate-800/40 text-slate-400 p-3 rounded-xl rounded-tl-none text-[10px] border border-white/5 flex-1 leading-relaxed">Processing your request to enhance the component aesthetics...</div>
                    </div>
                </div>
            )}
        </div>

        <div className="p-3 bg-background-dark/80 mt-auto border-t border-white/5">
            <div className="bg-slate-800/20 border border-white/5 rounded-xl p-2 relative group focus-within:border-primary/30 transition-all duration-300">
                <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); generateCode(); } }}
                    className="w-full bg-transparent text-[11px] text-white placeholder:text-slate-600 resize-none h-14 focus:outline-none p-1 custom-scrollbar"
                    placeholder="Ask AI to design..."
                />
                <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/5">
                    <div className="flex gap-1">
                        <ModelSelector selectedId={model} onSelect={setModel} variant="pill" />
                        <button className="p-1.5 text-slate-600 hover:text-white transition-colors" title="Attach Image"><span className="material-symbols-outlined text-[15px]">image</span></button>
                    </div>
                    <button
                        onClick={generateCode}
                        disabled={loading || !prompt.trim()}
                        className="size-7 bg-primary text-white rounded-lg flex items-center justify-center hover:brightness-110 transition-all disabled:opacity-30 shadow-lg shadow-primary/20"
                    >
                        <span className="material-symbols-outlined text-[16px]">{loading ? 'sync' : 'north'}</span>
                    </button>
                </div>
            </div>
        </div>
    </aside>
);

// ==========================================
// MAIN WORKBENCH COMPONENT
// ==========================================

export const Workbench: React.FC = () => {

    // Editor Logic State
    const [model, setModel] = useState('google/gemini-2.0-flash-exp');
    const [prompt, setPrompt] = useState('');
    const [code, setCode] = useState(`<html lang="en" class="dark"><head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Noir Code | The Future of Development</title>
    <!-- Tailwind CSS -->
    <script src="https://cdn.tailwindcss.com"></script>
    <!-- Iconify -->
    <script src="https://code.iconify.design/iconify-icon/1.0.7/iconify-icon.min.js"></script>
    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&amp;family=JetBrains+Mono:wght@400;500&amp;display=swap" rel="stylesheet">

    <style>
        body {
            font-family: 'Inter', sans-serif;
            background-color: #050505;
        }
        .font-mono {
            font-family: 'JetBrains Mono', monospace;
        }
        
        /* Subtle Grid Background */
        .bg-grid {
            background-size: 40px 40px;
            background-image: linear-gradient(to right, rgba(255, 255, 255, 0.02) 1px, transparent 1px),
                              linear-gradient(to bottom, rgba(255, 255, 255, 0.02) 1px, transparent 1px);
            mask-image: linear-gradient(to bottom, black 40%, transparent 100%);
            -webkit-mask-image: linear-gradient(to bottom, black 40%, transparent 100%);
        }

        /* Glow effects */
        .glow-text {
            text-shadow: 0 0 20px rgba(255, 255, 255, 0.1);
        }
    </style>
</head>
<body class="text-neutral-400 selection:bg-indigo-500/30 selection:text-indigo-200 overflow-x-hidden">

    <!-- Navbar -->
    <nav class="fixed top-0 w-full z-50 border-b border-white/5 bg-[#050505]/80 backdrop-blur-md">
        <div class="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
            <div class="flex items-center gap-2">
                <div class="w-6 h-6 rounded bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                    <span class="text-white font-bold text-xs leading-none">N</span>
                </div>
                <span class="text-white font-medium tracking-tight text-sm">Noir Code</span>
            </div>

            <div class="hidden md:flex items-center gap-6">
                <a href="#" class="text-sm hover:text-white transition-colors">Features</a>
                <a href="#" class="text-sm hover:text-white transition-colors">SDK</a>
                <a href="#" class="text-sm hover:text-white transition-colors">Pricing</a>
                <a href="#" class="text-sm hover:text-white transition-colors">Changelog</a>
            </div>

            <div class="flex items-center gap-3">
                <a href="#" class="text-sm text-neutral-400 hover:text-white transition-colors hidden sm:block">Log in</a>
                <a href="#" class="text-xs font-medium bg-white text-black px-3 py-1.5 rounded-full hover:bg-neutral-200 transition-colors">
                    Get Access
                </a>
            </div>
        </div>
    </nav>

    <!-- Hero Section -->
    <header class="relative pt-32 pb-20 lg:pt-40 lg:pb-32 px-6 overflow-hidden">
        <!-- Background Effects -->
        <div class="absolute inset-0 z-0 bg-grid pointer-events-none"></div>
        <div class="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-indigo-500/10 blur-[100px] rounded-full pointer-events-none"></div>

        <div class="relative z-10 max-w-4xl mx-auto text-center flex flex-col items-center">
            
            <!-- Badge -->
            <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-indigo-500/20 bg-indigo-500/5 mb-8 animate-fade-in-up">
                <span class="relative flex h-2 w-2">
                  <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                  <span class="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                </span>
                <span class="text-xs font-medium text-indigo-300">v2.0 Public Beta is live</span>
            </div>

            <!-- Headline -->
            <h1 class="text-4xl md:text-6xl lg:text-7xl font-semibold text-white tracking-tight mb-6 leading-[1.1]">
                Backend logic, <br>
                <span class="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 via-purple-300 to-indigo-300">handled instantly.</span>
            </h1>

            <!-- Subheadline -->
            <p class="text-base md:text-lg text-neutral-500 max-w-xl mx-auto mb-10 leading-relaxed">
                Noir Code provides the infrastructure for modern applications. Deploy serverless functions, manage databases, and scale effortlessly with a single command.
            </p>

            <!-- CTA Input Group -->
            <div class="flex flex-col sm:flex-row items-center gap-3 w-full max-w-md mx-auto">
                <div class="relative w-full">
                    <iconify-icon icon="solar:letter-linear" class="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" width="18"></iconify-icon>
                    <input type="email" placeholder="Enter your work email..." class="w-full bg-neutral-900/50 border border-neutral-800 text-sm text-white pl-10 pr-4 py-2.5 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all placeholder:text-neutral-600">
                </div>
                <button class="w-full sm:w-auto whitespace-nowrap px-5 py-2.5 text-sm font-medium text-white bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 rounded-lg transition-all shadow-lg shadow-indigo-500/5 flex items-center justify-center gap-2 group">
                    Join Waitlist
                    <iconify-icon icon="solar:arrow-right-linear" class="group-hover:translate-x-0.5 transition-transform"></iconify-icon>
                </button>
            </div>
            
            <p class="mt-4 text-xs text-neutral-600">No credit card required. 14-day free trial on approval.</p>
        </div>
    </header>

    <!-- Visual / Code Demo -->
    <section class="px-4 pb-24 relative z-10">
        <div class="max-w-5xl mx-auto">
            <!-- Glass container -->
            <div class="rounded-xl border border-neutral-800 bg-[#0A0A0A] shadow-2xl shadow-indigo-900/10 overflow-hidden relative group">
                <!-- Glowing border effect -->
                <div class="absolute -inset-px bg-gradient-to-r from-transparent via-indigo-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>

                <!-- Window Header -->
                <div class="h-10 border-b border-neutral-800 bg-neutral-900/50 flex items-center px-4 justify-between">
                    <div class="flex items-center gap-2">
                        <div class="w-2.5 h-2.5 rounded-full bg-red-500/20 border border-red-500/50"></div>
                        <div class="w-2.5 h-2.5 rounded-full bg-yellow-500/20 border border-yellow-500/50"></div>
                        <div class="w-2.5 h-2.5 rounded-full bg-green-500/20 border border-green-500/50"></div>
                    </div>
                    <div class="text-[10px] text-neutral-500 font-mono">api/routes/edge.ts</div>
                    <div class="w-10"></div> <!-- spacer -->
                </div>

                <!-- Split View -->
                <div class="grid md:grid-cols-2">
                    <!-- Code Editor -->
                    <div class="p-6 font-mono text-xs md:text-sm leading-relaxed overflow-x-auto border-r border-neutral-800/50 bg-[#080808]">
                        <div class="flex">
                            <div class="text-neutral-700 select-none text-right pr-4 space-y-1">
                                <div>1</div><div>2</div><div>3</div><div>4</div><div>5</div><div>6</div><div>7</div><div>8</div><div>9</div><div>10</div>
                            </div>
                            <div class="text-neutral-300 space-y-1 whitespace-pre">
<div><span class="text-purple-400">import</span> { Noir, Edge } <span class="text-purple-400">from</span> <span class="text-green-400">'@noir/sdk'</span>;</div>
<div></div>
<div><span class="text-neutral-500">// Initialize Edge Runtime</span></div>
<div><span class="text-purple-400">const</span> client = <span class="text-purple-400">new</span> Noir({ 
<div>  region: <span class="text-green-400">'us-east-1'</span>,</div>
<div>  cache: <span class="text-blue-400">true</span></div>
<div>});</div>
<div></div>
<div><span class="text-purple-400">export default async function</span> handler(req) {</div>
<div>  <span class="text-purple-400">const</span> data = <span class="text-purple-400">await</span> client.db.query(<span class="text-green-400">'users'</span>);</div>
<div>  <span class="text-purple-400">return</span> Response.json({ data });</div>
<div>}</div>
                            </div>
                        </div>
                    </div>

                    <!-- Visual Output/Dashboard Preview -->
                    <div class="p-6 bg-[#050505] relative flex flex-col justify-center">
                        <div class="absolute inset-0 bg-indigo-500/5 pointer-events-none"></div>
                        
                        <div class="space-y-4">
                            <div class="flex items-center justify-between text-xs text-neutral-400 uppercase tracking-wider font-medium mb-2">
                                <span>Real-time Logs</span>
                                <div class="flex items-center gap-1 text-green-400"><div class="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div> Connected</div>
                            </div>

                            <!-- Log Item 1 -->
                            <div class="p-3 rounded border border-green-500/20 bg-green-500/5 flex gap-3 items-center">
                                <iconify-icon icon="solar:check-circle-linear" class="text-green-400" width="16"></iconify-icon>
                                <div>
                                    <div class="text-xs text-green-200">Function invoked successfully</div>
                                    <div class="text-[10px] text-green-500/70 font-mono">24ms execution time</div>
                                </div>
                            </div>

                            <!-- Log Item 2 -->
                            <div class="p-3 rounded border border-neutral-800 bg-neutral-900/50 flex gap-3 items-center opacity-60">
                                <iconify-icon icon="solar:server-square-linear" class="text-neutral-400" width="16"></iconify-icon>
                                <div>
                                    <div class="text-xs text-neutral-300">Cold boot started</div>
                                    <div class="text-[10px] text-neutral-600 font-mono">us-east-1 region</div>
                                </div>
                            </div>
                            
                            <!-- Stat Cards inside preview -->
                            <div class="grid grid-cols-2 gap-3 mt-4">
                                <div class="p-3 rounded border border-neutral-800 bg-neutral-900/30 text-center">
                                    <div class="text-[10px] text-neutral-500 uppercase">Latency</div>
                                    <div class="text-lg font-medium text-white">24ms</div>
                                </div>
                                <div class="p-3 rounded border border-neutral-800 bg-neutral-900/30 text-center">
                                    <div class="text-[10px] text-neutral-500 uppercase">Requests</div>
                                    <div class="text-lg font-medium text-white">1.2k/s</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Social Proof -->
    <section class="py-10 border-y border-neutral-900 bg-neutral-950/30">
        <div class="max-w-6xl mx-auto px-6 text-center">
            <p class="text-sm text-neutral-500 mb-8">Trusted by developers at innovative companies</p>
            <div class="flex flex-wrap justify-center gap-8 md:gap-16 opacity-40 grayscale hover:grayscale-0 transition-all duration-500">
                <!-- Using Iconify as placeholder logos for style -->
                <div class="flex items-center gap-2 text-white"><iconify-icon icon="simple-icons:vercel" width="24"></iconify-icon> <span class="font-semibold tracking-tight">Vercel</span></div>
                <div class="flex items-center gap-2 text-white"><iconify-icon icon="simple-icons:stripe" width="24"></iconify-icon> <span class="font-semibold tracking-tight">Stripe</span></div>
                <div class="flex items-center gap-2 text-white"><iconify-icon icon="simple-icons:github" width="24"></iconify-icon> <span class="font-semibold tracking-tight">GitHub</span></div>
                <div class="flex items-center gap-2 text-white"><iconify-icon icon="simple-icons:notion" width="24"></iconify-icon> <span class="font-semibold tracking-tight">Notion</span></div>
                <div class="flex items-center gap-2 text-white"><iconify-icon icon="simple-icons:linear" width="24"></iconify-icon> <span class="font-semibold tracking-tight">Linear</span></div>
            </div>
        </div>
    </section>

    <!-- Features Grid -->
    <section class="py-24 px-6 relative">
        <div class="max-w-6xl mx-auto">
            <div class="text-center max-w-2xl mx-auto mb-16">
                <h2 class="text-3xl md:text-4xl font-semibold text-white tracking-tight mb-4">Everything you need to ship</h2>
                <p class="text-neutral-500">Stop worrying about infrastructure. Noir Code gives you the primitives to build scalable backends in minutes.</p>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                <!-- Feature 1 -->
                <div class="group p-8 rounded-2xl bg-neutral-900/20 border border-neutral-800 hover:bg-neutral-900/40 hover:border-neutral-700 transition-all duration-300">
                    <div class="w-10 h-10 rounded-lg bg-neutral-900 border border-neutral-800 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                        <iconify-icon icon="solar:bolt-circle-linear" class="text-indigo-400" width="24"></iconify-icon>
                    </div>
                    <h3 class="text-lg font-medium text-white mb-2">Instant Deploy</h3>
                    <p class="text-sm text-neutral-500 leading-relaxed">Push your code to git and we handle the rest. Automatic builds, previews, and production rollouts.</p>
                </div>

                <!-- Feature 2 -->
                <div class="group p-8 rounded-2xl bg-neutral-900/20 border border-neutral-800 hover:bg-neutral-900/40 hover:border-neutral-700 transition-all duration-300">
                    <div class="w-10 h-10 rounded-lg bg-neutral-900 border border-neutral-800 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                        <iconify-icon icon="solar:shield-keyhole-linear" class="text-purple-400" width="24"></iconify-icon>
                    </div>
                    <h3 class="text-lg font-medium text-white mb-2">Edge Security</h3>
                    <p class="text-sm text-neutral-500 leading-relaxed">Enterprise-grade security by default. DDOS protection, SSL, and custom firewalls included.</p>
                </div>

                <!-- Feature 3 -->
                <div class="group p-8 rounded-2xl bg-neutral-900/20 border border-neutral-800 hover:bg-neutral-900/40 hover:border-neutral-700 transition-all duration-300">
                    <div class="w-10 h-10 rounded-lg bg-neutral-900 border border-neutral-800 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                        <iconify-icon icon="solar:database-linear" class="text-blue-400" width="24"></iconify-icon>
                    </div>
                    <h3 class="text-lg font-medium text-white mb-2">Global Data</h3>
                    <p class="text-sm text-neutral-500 leading-relaxed">Replicate your data across 35+ regions instantly. Low latency for users anywhere in the world.</p>
                </div>
            </div>
        </div>
    </section>

    <!-- Bento Grid / Details -->
    <section class="py-12 px-6 pb-32">
        <div class="max-w-6xl mx-auto">
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 grid-rows-2 h-auto md:h-[600px]">
                
                <!-- Large Card Left -->
                <div class="lg:col-span-2 row-span-2 rounded-2xl border border-neutral-800 bg-[#0A0A0A] overflow-hidden relative group">
                    <div class="p-8 relative z-10">
                        <h3 class="text-xl font-medium text-white mb-2">Real-time Analytics</h3>
                        <p class="text-sm text-neutral-500 max-w-xs">Monitor your usage, errors, and performance with pixel-perfect precision.</p>
                    </div>
                    <!-- Abstract Chart Visual -->
                    <div class="absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-indigo-900/20 to-transparent"></div>
                    <div class="absolute bottom-0 left-8 right-8 h-48 border-t border-l border-r border-neutral-800 bg-neutral-900/50 rounded-t-xl overflow-hidden flex items-end justify-between px-4 pb-0">
                         <!-- CSS Bars -->
                         <div class="w-8 bg-indigo-500/20 h-[40%] rounded-t mx-1 group-hover:bg-indigo-500/40 transition-colors"></div>
                         <div class="w-8 bg-indigo-500/40 h-[70%] rounded-t mx-1 group-hover:bg-indigo-500/60 transition-colors"></div>
                         <div class="w-8 bg-indigo-500/30 h-[50%] rounded-t mx-1 group-hover:bg-indigo-500/50 transition-colors"></div>
                         <div class="w-8 bg-indigo-500/60 h-[85%] rounded-t mx-1 group-hover:bg-indigo-500/80 transition-colors"></div>
                         <div class="w-8 bg-indigo-500/20 h-[45%] rounded-t mx-1 group-hover:bg-indigo-500/40 transition-colors"></div>
                         <div class="w-8 bg-indigo-500/40 h-[60%] rounded-t mx-1 group-hover:bg-indigo-500/60 transition-colors"></div>
                    </div>
                </div>

                <!-- Small Card Top Right -->
                <div class="rounded-2xl border border-neutral-800 bg-[#0A0A0A] p-8 flex flex-col justify-between hover:border-neutral-700 transition-colors">
                    <div>
                        <div class="w-8 h-8 rounded bg-neutral-900 flex items-center justify-center mb-4">
                            <iconify-icon icon="solar:command-linear" class="text-white"></iconify-icon>
                        </div>
                        <h3 class="text-base font-medium text-white">CLI First</h3>
                    </div>
                    <p class="text-sm text-neutral-500 mt-2">Control everything from your terminal. No UI required.</p>
                </div>

                <!-- Small Card Bottom Right -->
                <div class="rounded-2xl border border-neutral-800 bg-[#0A0A0A] p-8 flex flex-col justify-between hover:border-neutral-700 transition-colors">
                    <div>
                        <div class="w-8 h-8 rounded bg-neutral-900 flex items-center justify-center mb-4">
                            <iconify-icon icon="solar:users-group-rounded-linear" class="text-white"></iconify-icon>
                        </div>
                        <h3 class="text-base font-medium text-white">Collaborative</h3>
                    </div>
                    <p class="text-sm text-neutral-500 mt-2">Built for teams. Comments, branch previews, and role management.</p>
                </div>
            </div>
        </div>
    </section>

    <!-- Footer -->
    <footer class="border-t border-neutral-900 bg-[#050505] pt-16 pb-12 px-6">
        <div class="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-16">
            <div class="col-span-2 lg:col-span-2">
                <div class="flex items-center gap-2 mb-4">
                    <div class="w-6 h-6 rounded bg-neutral-800 flex items-center justify-center">
                        <span class="text-white font-bold text-xs leading-none">N</span>
                    </div>
                    <span class="text-white font-medium tracking-tight text-sm">Noir Code</span>
                </div>
                <p class="text-sm text-neutral-500 max-w-xs mb-6">
                    Designed for developers who care about details. Built in San Francisco.
                </p>
                <div class="flex gap-4">
                    <a href="#" class="text-neutral-500 hover:text-white transition-colors"><iconify-icon icon="simple-icons:twitter" width="16"></iconify-icon></a>
                    <a href="#" class="text-neutral-500 hover:text-white transition-colors"><iconify-icon icon="simple-icons:github" width="16"></iconify-icon></a>
                    <a href="#" class="text-neutral-500 hover:text-white transition-colors"><iconify-icon icon="simple-icons:discord" width="16"></iconify-icon></a>
                </div>
            </div>
            
            <div>
                <h4 class="text-xs font-semibold text-white uppercase tracking-wider mb-4">Product</h4>
                <ul class="space-y-3 text-sm text-neutral-500">
                    <li><a href="#" class="hover:text-indigo-400 transition-colors">Features</a></li>
                    <li><a href="#" class="hover:text-indigo-400 transition-colors">Integrations</a></li>
                    <li><a href="#" class="hover:text-indigo-400 transition-colors">Pricing</a></li>
                    <li><a href="#" class="hover:text-indigo-400 transition-colors">Changelog</a></li>
                </ul>
            </div>

            <div>
                <h4 class="text-xs font-semibold text-white uppercase tracking-wider mb-4">Resources</h4>
                <ul class="space-y-3 text-sm text-neutral-500">
                    <li><a href="#" class="hover:text-indigo-400 transition-colors">Documentation</a></li>
                    <li><a href="#" class="hover:text-indigo-400 transition-colors">API Reference</a></li>
                    <li><a href="#" class="hover:text-indigo-400 transition-colors">Community</a></li>
                    <li><a href="#" class="hover:text-indigo-400 transition-colors">Help Center</a></li>
                </ul>
            </div>

            <div>
                <h4 class="text-xs font-semibold text-white uppercase tracking-wider mb-4">Company</h4>
                <ul class="space-y-3 text-sm text-neutral-500">
                    <li><a href="#" class="hover:text-indigo-400 transition-colors">About</a></li>
                    <li><a href="#" class="hover:text-indigo-400 transition-colors">Blog</a></li>
                    <li><a href="#" class="hover:text-indigo-400 transition-colors">Careers</a></li>
                    <li><a href="#" class="hover:text-indigo-400 transition-colors">Contact</a></li>
                </ul>
            </div>
        </div>
        
        <div class="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between pt-8 border-t border-neutral-900 gap-4">
            <p class="text-xs text-neutral-600">© 2024 Noir Code Inc. All rights reserved.</p>
            <div class="flex items-center gap-1">
                <div class="w-2 h-2 rounded-full bg-green-500"></div>
                <span class="text-xs text-neutral-500">All systems normal</span>
            </div>
        </div>
    </footer>


</body></html>`);
    const [loading, setLoading] = useState(false);
    const [context, setContext] = useState<string | null>(null);

    // Context & Selection State
    const [selectedText, setSelectedText] = useState('');
    const [selectedElement, setSelectedElement] = useState<any>(null);

    // View State
    const [activeView, setActiveView] = useState<ViewMode>('design');
    const [viewport, setViewport] = useState<Viewport>('desktop');
    const [zoom, setZoom] = useState(1);
    const [isPanning, setIsPanning] = useState(false);
    const [isHierarchyCollapsed, setIsHierarchyCollapsed] = useState(false);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        const handleMessage = (e: MessageEvent) => {
            if (e.data.type === 'ELEMENT_SELECTED') {
                setSelectedElement(e.data);
                setSelectedText(''); // Clear text selection if element is selected
            }
        };
        window.addEventListener('message', handleMessage);
        return () => window.removeEventListener('message', handleMessage);
    }, []);

    const generateCode = () => {
        if (loading || !prompt.trim()) return;
        setLoading(true);
        setTimeout(() => setLoading(false), 1500);
    };

    const handleTextSelect = () => {
        if (textareaRef.current) {
            const start = textareaRef.current.selectionStart;
            const end = textareaRef.current.selectionEnd;
            if (start !== end) {
                const text = textareaRef.current.value.substring(start, end);
                setSelectedText(text);
                setSelectedElement(null);
            } else {
                setSelectedText('');
            }
        }
    };

    const handleImportToChat = () => {
        if (selectedText) {
            setContext(`Selection: "${selectedText.substring(0, 50)}${selectedText.length > 50 ? '...' : ''}"`);
            setSelectedText('');
        } else if (selectedElement) {
            const info = `${selectedElement.tagName}${selectedElement.id ? '#' + selectedElement.id : ''}`;
            setContext(`Element: ${info} ("${selectedElement.text}...")`);
            setSelectedElement(null);
        }
    };

    return (
        <div className="bg-background-dark text-slate-300 overflow-hidden h-screen flex flex-col font-display">
            <Header
                activeView={activeView}
                setActiveView={setActiveView}
                viewport={viewport}
                setViewport={setViewport}
                zoom={zoom}
                setZoom={setZoom}
            />

            <main className="flex flex-1 overflow-hidden relative border-t border-white/5">
                <SidebarLeft
                    isCollapsed={isHierarchyCollapsed}
                    setIsCollapsed={setIsHierarchyCollapsed}
                />

                <CanvasArea
                    code={code}
                    loading={loading}
                    activeView={activeView}
                    setCode={setCode}
                    textareaRef={textareaRef}
                    onSelect={handleTextSelect}
                    viewport={viewport}
                    zoom={zoom}
                    isPanning={isPanning}
                    setIsPanning={setIsPanning}
                />

                <AnimatePresence>
                    {(selectedText || selectedElement) && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="absolute bottom-24 left-1/2 -translate-x-1/2 z-[100] flex flex-col items-center gap-2"
                        >
                            <div className="flex bg-slate-900/95 backdrop-blur-xl border border-white/10 rounded-full px-1.5 py-1.5 shadow-2xl items-center gap-1">
                                <div className="px-3 py-1.5 text-[10px] text-white font-bold border-r border-white/5 mr-1 flex items-center gap-2 uppercase tracking-widest opacity-80">
                                    <span className="material-symbols-outlined text-[14px] text-primary">
                                        {selectedElement ? 'ads_click' : 'text_fields'}
                                    </span>
                                    {selectedElement ? `${selectedElement.tagName}` : 'Selection'}
                                </div>
                                <button
                                    onClick={handleImportToChat}
                                    className="flex items-center gap-1.5 bg-primary text-white px-4 py-1.5 rounded-full font-black shadow-lg hover:brightness-110 active:scale-95 transition-all text-[9px] uppercase tracking-tighter"
                                >
                                    <span className="material-symbols-outlined text-[13px]">add</span>
                                    Add to Context
                                </button>
                                <button
                                    onClick={() => { setSelectedText(''); setSelectedElement(null); }}
                                    className="p-1.5 hover:bg-white/10 rounded-full text-slate-600 hover:text-white transition-colors"
                                >
                                    <span className="material-symbols-outlined text-[14px]">close</span>
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <SidebarRight
                    prompt={prompt}
                    setPrompt={setPrompt}
                    loading={loading}
                    generateCode={generateCode}
                    code={code}
                    context={context}
                    setContext={setContext}
                    model={model}
                    setModel={setModel}
                />
            </main>

            <footer className="h-6 border-t border-white/5 bg-black flex items-center justify-between px-4 z-50">
                <div className="flex items-center gap-4 text-[8px] text-slate-600 uppercase font-black tracking-widest">
                    <div className="flex items-center gap-1.5"><span className="material-symbols-outlined text-[10px] text-green-500">cloud_check</span> CLOUD SYNC</div>
                    <div className="flex items-center gap-1.5"><span className="material-symbols-outlined text-[10px] text-primary">dns</span> US-EAST (PROD)</div>
                </div>
                <div className="text-[8px] text-slate-700 font-mono">NOIR ENGINE V2.4.0 (BETA)</div>
            </footer>
        </div>
    );
};
