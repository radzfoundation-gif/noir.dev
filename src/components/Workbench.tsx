import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChatInput } from './ChatInput';
import { Copy, Key, Trash2, Plus, FileCode, RefreshCw, Download, Undo, Camera } from 'lucide-react';
import { toPng } from 'html-to-image';

type ViewMode = 'Preview' | 'Code' | 'Integrations' | 'APIs';
type Device = 'iPhone 17 Pro' | 'Desktop' | 'Tablet';

export const Workbench = () => {
    const [activeTab, setActiveTab] = useState<ViewMode>('Preview');
    const [device, setDevice] = useState<Device>('iPhone 17 Pro');
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [toast, setToast] = useState<{ message: string; show: boolean }>({ message: '', show: false });
    const [showDeviceMenu, setShowDeviceMenu] = useState(false);

    // Chat State
    const [model, setModel] = useState('google/gemini-2.0-flash-exp');
    const [prompt, setPrompt] = useState('');
    const [image, setImage] = useState<string | null>(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [context, setContext] = useState<string | null>(null);

    // Code & Preview State
    const [code, setCode] = useState(`export const GeneratedComponent = () => {\n  return (\n    <div className="p-4 bg-white rounded-lg shadow-md">\n      <h1 className="text-2xl font-bold text-neutral-800">Hello World</h1>\n      <p className="mt-2 text-gray-600">This is a generated component.</p>\n    </div>\n  );\n};`);
    const [history, setHistory] = useState<string[]>([code]);
    const [isRefreshing, setIsRefreshing] = useState(false);

    const updateCode = (newCode: string) => {
        setCode(newCode);
        setHistory(prev => [...prev.slice(-10), newCode]); // Keep last 10 edits
    };

    // Live Preview Extraction
    const extractContent = (tag: string) => {
        const regex = new RegExp(`<${tag}.*?>(.*?)<\/${tag}>`, 's');
        const match = code.match(regex);
        return match ? match[1] : null;
    };

    const previewTitle = extractContent('h1') || "Untitled Component";
    const previewDesc = extractContent('p') || "No description available.";

    const showToast = (message: string) => {
        setToast({ message, show: true });
        setTimeout(() => setToast({ message: '', show: false }), 3000);
    };

    const handleGenerate = () => {
        setIsGenerating(true);
        setTimeout(() => {
            setIsGenerating(false);
            setPrompt('');
            setImage(null);
            setContext(null); // Clear context after use

            // Simulate Code Update
            const newCode = code.includes('// AI Optimized')
                ? code
                : code.replace('export const GeneratedComponent', '// AI Optimized\nexport const GeneratedComponent');

            if (newCode !== code) {
                updateCode(newCode);
                showToast("Code updated successfully");
                // Trigger Preview Refresh
                setIsRefreshing(true);
                setTimeout(() => setIsRefreshing(false), 800);
            } else {
                showToast("AI Assistant responded");
            }

        }, 2000);
    };

    const handleAddToChat = () => {
        const selection = window.getSelection()?.toString();
        if (selection && selection.trim().length > 0) {
            setContext(selection);
            showToast("Selection added to chat context");
        } else {
            setContext(code);
            showToast("Code added to chat context");
        }
        setSidebarOpen(true);
    };

    const handleDownload = () => {
        const blob = new Blob([code], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'noir-code-export.html';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        showToast("HTML file downloaded");
    };

    const handleUndo = () => {
        if (history.length > 1) {
            const previousCode = history[history.length - 2];
            setCode(previousCode);
            setHistory(prev => prev.slice(0, -1));
            showToast("Undo successful");
        } else {
            showToast("Nothing to undo");
        }
    };

    const handleScreenshot = () => {
        const node = document.getElementById('preview-container');
        if (node) {
            toPng(node)
                .then((dataUrl) => {
                    const link = document.createElement('a');
                    link.download = 'noir-preview.png';
                    link.href = dataUrl;
                    link.click();
                    showToast("Screenshot saved");
                })
                .catch((err) => {
                    console.error('oops, something went wrong!', err);
                    showToast("Failed to take screenshot");
                });
        }
    };

    const currentDeviceClass = {
        'iPhone 17 Pro': 'w-[320px] h-[650px] rounded-[40px] border-[12px] border-[#262626]',
        'Desktop': 'w-full h-full rounded-none border-none',
        'Tablet': 'w-[768px] h-[1024px] rounded-[20px] border-[12px] border-[#262626]'
    };

    // Placeholder Data

    const integrations = [
        { name: 'OpenAI', icon: 'https://upload.wikimedia.org/wikipedia/commons/4/4d/OpenAI_Logo.svg', connected: true },
        { name: 'Google Gemini', icon: 'https://upload.wikimedia.org/wikipedia/commons/8/8a/Google_Gemini_logo.svg', connected: true },
        { name: 'Anthropic', icon: 'https://upload.wikimedia.org/wikipedia/commons/7/78/Anthropic_logo.svg', connected: false },
        { name: 'Vercel', icon: 'https://assets.vercel.com/image/upload/v1588805858/repositories/vercel/logo.png', connected: true },
        { name: 'Supabase', icon: 'https://seeklogo.com/images/S/supabase-logo-DCC676FFE2-seeklogo.com.png', connected: false },
        { name: 'Stripe', icon: 'https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg', connected: false },
    ];

    const apiKeys = [
        { name: 'Production Key', key: 'sk-prod_...9s2A', created: '2 days ago', lastUsed: 'Just now' },
        { name: 'Development Key', key: 'sk-dev_...8xL1', created: '1 week ago', lastUsed: '5 hours ago' },
    ];

    return (
        <div className="h-full dark bg-noir-black text-neutral-100 font-sans relative">
            <style>{`
        :root {
            --primary: #bef264;
            --bg-deep: #0a0a0a;
            --bg-surface: #171717;
            --bg-border: #262626;
        }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        .device-mockup {
            transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
            position: relative;
            background: #ffffff;
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
            overflow: hidden;
        }
        .notch::before {
            content: '';
            position: absolute;
            top: 0;
            left: 50%;
            transform: translateX(-50%);
            width: 120px;
            height: 25px;
            background: #262626;
            border-bottom-left-radius: 15px;
            border-bottom-right-radius: 15px;
            z-index: 10;
        }
      `}</style>

            {/* Toast Notification */}
            <AnimatePresence>
                {toast.show && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="absolute top-20 left-1/2 -translate-x-1/2 z-[100] px-4 py-2 bg-[#262626] border border-white/10 rounded-full shadow-xl flex items-center gap-2"
                    >
                        <span className="material-symbols-outlined text-sm text-primary">check_circle</span>
                        <span className="text-xs font-bold">{toast.message}</span>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Header */}
            <header className="h-14 bg-noir-black border-b border-neutral-800 flex items-center justify-between px-4 z-50">
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary text-2xl fill-1">terminal</span>
                        <span className="text-white font-bold tracking-tight text-lg">Noir <span className="text-neutral-400 font-normal">Code</span></span>
                    </div>
                    <div className="flex items-center text-sm font-medium text-neutral-500 ml-4 border-l border-neutral-800 pl-4">
                        <span className="hover:text-white cursor-pointer transition-colors" onClick={() => showToast("Project settings")}>Fokasu</span>
                        <span className="mx-2 text-neutral-700">/</span>
                        <span className="text-neutral-300">Mobile App</span>
                        <button className="ml-2 text-neutral-600 hover:text-primary transition-colors" onClick={() => showToast("Settings opened")}>
                            <span className="material-symbols-outlined text-base">settings</span>
                        </button>
                    </div>
                </div>
                <nav className="flex items-center bg-neutral-900 rounded-lg p-1 border border-neutral-800">
                    {(['Preview', 'Code', 'Integrations', 'APIs'] as ViewMode[]).map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-4 py-1.5 text-xs font-bold rounded-md transition-all ${activeTab === tab ? 'bg-primary text-noir-black shadow-sm' : 'text-neutral-400 hover:text-white'}`}
                        >
                            {tab}
                        </button>
                    ))}
                </nav>
                <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 px-3 py-1.5 text-xs font-bold text-primary border border-primary rounded-lg hover:bg-primary/10 transition-colors uppercase tracking-wider" onClick={() => showToast("Upgrade plan feature")}>
                        <span className="material-symbols-outlined text-sm">workspace_premium</span>
                        Upgrade
                    </button>
                    <button className="flex items-center gap-2 px-4 py-1.5 text-xs font-black bg-primary text-noir-black rounded-lg hover:bg-opacity-90 transition-colors uppercase tracking-wider" onClick={handleDownload}>
                        <Download size={16} strokeWidth={3} />
                        Download HTML
                    </button>
                </div>
            </header>

            <div className="flex h-[calc(100vh-3.5rem)] overflow-hidden">
                {/* Sidebar */}
                <aside className={`w-[400px] border-r border-neutral-800 flex flex-col bg-noir-black transition-all ${sidebarOpen ? 'translate-x-0' : '-translate-x-full absolute z-40 h-full'}`}>
                    <div className="flex-1 overflow-y-auto p-4 space-y-6 no-scrollbar">
                        <div className="space-y-4">
                            <div className="flex gap-3">
                                <div className="w-8 h-8 rounded-full bg-neutral-900 flex items-center justify-center flex-shrink-0 border border-neutral-800">
                                    <span className="material-symbols-outlined text-sm text-primary">auto_awesome</span>
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-semibold text-neutral-200 mb-2">Noir Assistant</p>
                                    <ul className="space-y-3 text-sm text-neutral-400 list-disc pl-4 leading-relaxed">
                                        <li>Implemented <span className="text-neutral-200">AI Coach Chat</span> with multi-provider support.</li>
                                        <li>Added <span className="text-neutral-200">Analytics Dashboard</span> featuring interactive charts.</li>
                                        <li>Created <span className="text-neutral-200">Dashboard Home</span> with productivity scoring.</li>
                                    </ul>
                                </div>
                            </div>
                            <button
                                className="w-full flex items-center justify-between p-3 rounded-xl border border-neutral-800 bg-neutral-900/50 hover:bg-neutral-900 hover:border-neutral-700 transition-colors"
                                onClick={() => showToast("Files panel toggled")}
                            >
                                <span className="text-sm font-medium text-neutral-300">Files (17)</span>
                                <span className="material-symbols-outlined text-lg text-neutral-500">chevron_right</span>
                            </button>
                            <div className="flex gap-2">
                                <button className="flex-1 flex items-center justify-center gap-2 py-2 px-3 bg-neutral-900 border border-neutral-800 rounded-lg text-xs font-medium text-neutral-300 hover:text-primary transition-colors" onClick={() => showToast("Showing Code Diff")}>
                                    <span className="material-symbols-outlined text-sm">compare_arrows</span>
                                    Code diff
                                </button>
                                <button className="flex-1 flex items-center justify-center gap-2 py-2 px-3 bg-neutral-900 border border-neutral-800 rounded-lg text-xs font-medium text-neutral-600 cursor-not-allowed">
                                    <span className="material-symbols-outlined text-sm">history</span>
                                    Rollback
                                </button>
                            </div>
                        </div>

                        {/* Error State */}
                        <div className="p-4 rounded-xl bg-red-950/20 border border-red-900/30">
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2 text-red-500">
                                    <span className="material-symbols-outlined text-lg">error</span>
                                    <span className="text-sm font-bold uppercase tracking-tight">Error found in code</span>
                                </div>
                                <button className="text-xs font-medium text-red-400 hover:underline">1 issue <span className="material-symbols-outlined align-middle text-sm">chevron_right</span></button>
                            </div>
                            <p className="text-xs text-red-400/80 leading-relaxed">
                                Deployment stalled. The current preview is outdated. Please resolve the compilation error.
                            </p>
                        </div>
                    </div>

                    {/* Chat Input Area */}
                    <div className="p-4 border-t border-neutral-800 bg-noir-black">
                        <ChatInput
                            onGenerate={handleGenerate}
                            loading={isGenerating}
                            image={image}
                            setImage={setImage}
                            model={model}
                            setModel={setModel}
                            prompt={prompt}
                            setPrompt={setPrompt}
                            context={context}
                            onClearContext={() => setContext(null)}
                            variant="sidebar"
                        />
                    </div>
                </aside>

                {/* Main Content Areas */}
                <main className="flex-1 bg-noir-gray flex flex-col relative overflow-hidden">
                    {activeTab === 'Preview' && (
                        <>
                            <div className="h-12 border-b border-neutral-800 flex items-center justify-between px-4 bg-noir-black/80 backdrop-blur-md relative z-30">
                                <div className="flex-1 max-w-lg">
                                    <div className="bg-neutral-900 border border-neutral-800 px-3 py-1 rounded-md flex items-center gap-2 cursor-pointer hover:border-neutral-700" onClick={() => showToast("URL copied")}>
                                        <span className="text-xs text-neutral-600">https://</span>
                                        <span className="text-xs text-neutral-400 font-mono flex-1">preview.noircode.app/fokasu-v2</span>
                                        <span className="material-symbols-outlined text-sm text-neutral-600">keyboard_arrow_down</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-1 ml-4">
                                    <button className="p-1.5 hover:bg-neutral-800 rounded-md text-neutral-500 transition-colors" onClick={() => setSidebarOpen(!sidebarOpen)} title="Toggle Sidebar">
                                        <span className="material-symbols-outlined text-lg">view_sidebar</span>
                                    </button>
                                    <div className="w-px h-4 bg-neutral-800 mx-1"></div>
                                    <button className="p-1.5 hover:bg-neutral-800 rounded-md text-neutral-500 transition-colors" onClick={handleScreenshot} title="Screenshot">
                                        <Camera size={18} />
                                    </button>
                                    <button className="p-1.5 hover:bg-neutral-800 rounded-md text-neutral-500 transition-colors" onClick={handleUndo} title="Undo">
                                        <Undo size={18} />
                                    </button>

                                    <div className="relative ml-2">
                                        <button
                                            onClick={() => setShowDeviceMenu(!showDeviceMenu)}
                                            className="flex items-center gap-2 px-3 py-1 text-xs font-medium text-neutral-400 hover:text-white bg-neutral-900 rounded-md border border-neutral-800 transition-colors"
                                        >
                                            <span className="material-symbols-outlined text-base">
                                                {device === 'Desktop' ? 'desktop_windows' : device === 'Tablet' ? 'tablet_mac' : 'smartphone'}
                                            </span>
                                            {device}
                                            <span className="material-symbols-outlined text-base">expand_more</span>
                                        </button>
                                        {showDeviceMenu && (
                                            <>
                                                <div className="fixed inset-0 z-40" onClick={() => setShowDeviceMenu(false)}></div>
                                                <div className="absolute right-0 top-full mt-1 w-32 bg-neutral-900 border border-neutral-800 rounded-lg shadow-xl overflow-hidden z-50">
                                                    {(['iPhone 17 Pro', 'Desktop', 'Tablet'] as Device[]).map(d => (
                                                        <button
                                                            key={d}
                                                            onClick={() => { setDevice(d); setShowDeviceMenu(false); }}
                                                            className="w-full text-left px-3 py-2 text-xs text-neutral-400 hover:text-white hover:bg-neutral-800"
                                                        >
                                                            {d}
                                                        </button>
                                                    ))}
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="flex-1 flex items-center justify-center overflow-auto p-8 no-scrollbar bg-noir-black relative" id="preview-container">
                                {isRefreshing ? (
                                    <div className="flex flex-col items-center justify-center animate-pulse">
                                        <RefreshCw className="text-primary animate-spin mb-2" size={40} />
                                        <p className="text-neutral-400 text-sm">Refreshing Preview...</p>
                                    </div>
                                ) : (
                                    <div className={`${currentDeviceClass[device]} device-mockup flex flex-col items-center justify-center text-center px-8 transition-all duration-500 ${device === 'iPhone 17 Pro' ? 'notch' : ''}`}>
                                        <div className="p-6 bg-white rounded-2xl shadow-sm border border-neutral-100 w-full max-w-[280px]">
                                            <h1 className="text-2xl font-bold text-neutral-800 mb-2">{previewTitle}</h1>
                                            <p className="text-sm text-neutral-500 leading-relaxed">{previewDesc}</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </>
                    )}

                    {activeTab === 'Code' && (
                        <div className="flex-1 p-6 overflow-auto">
                            <div className="max-w-4xl mx-auto bg-[#1e1e1e] rounded-xl border border-neutral-800 overflow-hidden shadow-2xl">
                                <div className="bg-[#252526] px-4 py-2 flex items-center justify-between border-b border-neutral-800">
                                    <div className="flex items-center gap-2">
                                        <div className="flex gap-1.5">
                                            <div className="w-3 h-3 rounded-full bg-red-500"></div>
                                            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                                            <div className="w-3 h-3 rounded-full bg-green-500"></div>
                                        </div>
                                        <span className="ml-3 text-xs text-neutral-400 font-mono">GeneratedComponent.tsx</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button
                                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium text-neutral-300 hover:bg-neutral-700 hover:text-white transition-colors"
                                            onClick={handleAddToChat}
                                        >
                                            <FileCode size={16} />
                                            Add to Chat
                                        </button>
                                        <button className="p-1.5 hover:bg-neutral-700 rounded text-neutral-400 hover:text-white transition-colors" onClick={() => showToast("Code Copied!")}>
                                            <Copy size={14} />
                                        </button>
                                    </div>
                                </div>
                                {/* Editable Code Area */}
                                <textarea
                                    className="w-full h-[400px] bg-transparent text-sm font-mono text-neutral-300 p-4 resize-none focus:outline-none"
                                    value={code}
                                    onChange={(e) => updateCode(e.target.value)}
                                    spellCheck={false}
                                />
                            </div>
                        </div>
                    )}

                    {activeTab === 'Integrations' && (
                        <div className="flex-1 p-8 overflow-auto">
                            <div className="max-w-5xl mx-auto">
                                <h1 className="text-2xl font-bold text-white mb-2">Integrations</h1>
                                <p className="text-neutral-400 mb-8">Connect your favorite tools to Noir Code.</p>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {integrations.map((app) => (
                                        <div key={app.name} className="p-4 bg-neutral-900/50 border border-neutral-800 rounded-xl hover:border-neutral-700 transition-colors flex items-center gap-4">
                                            <div className="w-12 h-12 bg-white rounded-lg p-2 flex items-center justify-center shrink-0">
                                                <img src={app.icon} alt={app.name} className="w-full h-full object-contain" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h3 className="font-semibold text-neutral-200">{app.name}</h3>
                                                <p className="text-xs text-neutral-500">{app.connected ? 'Active' : 'Not Connected'}</p>
                                            </div>
                                            <button
                                                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${app.connected ? 'bg-neutral-800 text-neutral-400' : 'bg-primary text-black hover:bg-opacity-90'}`}
                                                onClick={() => showToast(app.connected ? `Disconnected ${app.name}` : `Connected to ${app.name}`)}
                                            >
                                                {app.connected ? 'Manage' : 'Connect'}
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'APIs' && (
                        <div className="flex-1 p-8 overflow-auto">
                            <div className="max-w-4xl mx-auto">
                                <div className="flex items-center justify-between mb-8">
                                    <div>
                                        <h1 className="text-2xl font-bold text-white mb-2">API Keys</h1>
                                        <p className="text-neutral-400">Manage your API keys and access tokens.</p>
                                    </div>
                                    <button className="flex items-center gap-2 px-4 py-2 bg-primary text-black rounded-lg font-bold hover:bg-opacity-90 transition-colors" onClick={() => showToast("Created New Key")}>
                                        <Plus size={16} />
                                        Create New Key
                                    </button>
                                </div>

                                <div className="bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="border-b border-neutral-800">
                                                <th className="p-4 text-xs font-medium text-neutral-500 uppercase tracking-wider">Name</th>
                                                <th className="p-4 text-xs font-medium text-neutral-500 uppercase tracking-wider">Key</th>
                                                <th className="p-4 text-xs font-medium text-neutral-500 uppercase tracking-wider">Created</th>
                                                <th className="p-4 text-xs font-medium text-neutral-500 uppercase tracking-wider">Last Used</th>
                                                <th className="p-4 text-xs font-medium text-neutral-500 uppercase tracking-wider">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-neutral-800">
                                            {apiKeys.map((key) => (
                                                <tr key={key.key} className="group hover:bg-neutral-800/50 transition-colors">
                                                    <td className="p-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-8 h-8 rounded-lg bg-neutral-800 flex items-center justify-center text-neutral-400">
                                                                <Key size={14} />
                                                            </div>
                                                            <span className="font-medium text-neutral-200">{key.name}</span>
                                                        </div>
                                                    </td>
                                                    <td className="p-4 font-mono text-xs text-neutral-400">{key.key}</td>
                                                    <td className="p-4 text-sm text-neutral-500">{key.created}</td>
                                                    <td className="p-4 text-sm text-neutral-500">{key.lastUsed}</td>
                                                    <td className="p-4">
                                                        <button className="p-2 text-neutral-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors" onClick={() => showToast("Revoked Key")}>
                                                            <Trash2 size={14} />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}
                </main>
            </div >
        </div >
    );
};
