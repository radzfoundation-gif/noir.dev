import { useState, useEffect } from 'react';
import { useLocation, useSearchParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChatInput } from './ChatInput';
import { Copy, Key, Trash2, Plus, FileCode, RefreshCw, Download, Undo, Redo, Camera, Save } from 'lucide-react';
import { toPng } from 'html-to-image';
import { projectService } from '../lib/projectService';
import { useAuth } from '../context/AuthContext';
import Editor from 'react-simple-code-editor';
import Prism from 'prismjs';
import 'prismjs/components/prism-markup';
import 'prismjs/components/prism-css';
import 'prismjs/themes/prism-tomorrow.css';

type ViewMode = 'Preview' | 'Code' | 'Integrations' | 'APIs';
type Device = 'iPhone 17 Pro' | 'Desktop' | 'Tablet';

export const Workbench = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [generationType, setGenerationType] = useState<'web' | 'app'>(location.state?.generationType || 'web');

    // Auto-set device based on initial generation type
    const [activeTab, setActiveTab] = useState<ViewMode>('Preview');
    const [device, setDevice] = useState<Device>(
        location.state?.generationType === 'web' ? 'Desktop' : 'iPhone 17 Pro'
    );
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [toast, setToast] = useState<{ message: string; show: boolean }>({ message: '', show: false });
    const [showDeviceMenu, setShowDeviceMenu] = useState(false);
    const [searchParams] = useSearchParams();
    const [projectId, setProjectId] = useState<string | null>(searchParams.get('project'));
    const [isSaving, setIsSaving] = useState(false);
    const { user } = useAuth();

    // Chat State
    // const location = useLocation(); // Moved up
    const [model, setModel] = useState(location.state?.model || 'gemini/gemini-2.5-flash-lite');
    const [prompt, setPrompt] = useState(location.state?.prompt || '');
    const [image, setImage] = useState<string | null>(location.state?.image || null);
    // const [generationType, setGenerationType] ... // Moved up
    const [isGenerating, setIsGenerating] = useState(false);
    const [context, setContext] = useState<string | null>(null);
    const [streamingMessage, setStreamingMessage] = useState<string>('');
    const [currentPrompt, setCurrentPrompt] = useState<string>('');
    // Hierarchy State
    const [generatedSteps, setGeneratedSteps] = useState<{ title: string; desc: string }[]>([]);
    const [isCodeVisible, setIsCodeVisible] = useState(true);
    // Framework State
    const [framework, setFramework] = useState<'html' | 'react' | 'astro'>(location.state?.framework || 'html');

    // Auto-generate if triggered from Landing Page
    useEffect(() => {
        if (location.state?.autoGenerate && prompt) {
            handleGenerate();
        }
    }, []);

    // Load project if projectId is set
    useEffect(() => {
        if (projectId && user) {
            loadProject(projectId);
        }
    }, [projectId, user]);

    const loadProject = async (id: string) => {
        try {
            const project = await projectService.getProject(id);
            if (project) {
                setCode(project.code);
                if (project.prompt) setPrompt(project.prompt);
                showToast(`Loaded: ${project.name}`);
            }
        } catch (err) {
            console.error('Failed to load project:', err);
            showToast('Failed to load project');
        }
    };

    const handleSaveProject = async () => {
        if (!user) {
            showToast('Please login to save projects');
            return;
        }

        setIsSaving(true);
        try {
            const project = await projectService.saveOrUpdate(projectId, {
                name: previewAppName || 'Untitled Project',
                code,
                generation_type: generationType,
                prompt: prompt || null
            });

            setProjectId(project.id);
            showToast(projectId ? 'Project saved!' : 'Project created!');
        } catch (err) {
            console.error('Failed to save project:', err);
            showToast('Failed to save project');
        } finally {
            setIsSaving(false);
        }
    };

    // Code & Preview State
    // Code & Preview State
    const defaultWebCode = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Hello Universe</title>
    <style>
        body { font-family: 'Inter', sans-serif; display: flex; justify-content: center; align-items: center; min-height: 100vh; margin: 0; background-color: #f3f4f6; }
        .card { background: white; padding: 2.5rem; border-radius: 1rem; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1); max-width: 400px; text-align: center; }
        h1 { color: #111827; margin-bottom: 0.75rem; font-size: 1.8rem; letter-spacing: -0.025em; }
        p { color: #6b7280; line-height: 1.6; }
    </style>
</head>
<body>
    <div class="card">
        <h1>Hello Universe</h1>
        <p>This is a generated HTML5 component. Not a React component anymore.</p>
    </div>
</body>
</html>`;

    const defaultAppCode = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Mobile App</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; margin: 0; background-color: #fff; display: flex; flex-direction: column; height: 100vh; }
        header { background-color: #f8f8f8; padding: 16px; border-bottom: 1px solid #e5e5e5; display: flex; justify-content: center; align-items: center; padding-top: 50px; }
        h1 { font-size: 17px; font-weight: 600; margin: 0; color: #000; }
        main { flex: 1; padding: 20px; display: flex; flex-direction: column; align-items: center; justify-content: center; }
        .button { background-color: #007AFF; color: white; padding: 12px 24px; border-radius: 12px; font-weight: 600; text-decoration: none; margin-top: 20px; }
    </style>
</head>
<body>
    <header>
        <h1>Home</h1>
    </header>
    <main>
        <p>Welcome to your new iOS-style app.</p>
        <a href="#" class="button">Get Started</a>
    </main>
</body>
</html>`;

    const [code, setCode] = useState(location.state?.generationType === 'app' ? defaultAppCode : defaultWebCode);
    const [history, setHistory] = useState<string[]>([code]);
    const [historyIndex, setHistoryIndex] = useState(0);
    const [isRefreshing, setIsRefreshing] = useState(false);

    const updateCode = (newCode: string) => {
        // Remove future history when editing after undo
        const newHistory = history.slice(0, historyIndex + 1);
        newHistory.push(newCode);
        setHistory(newHistory.slice(-20)); // Keep last 20 edits
        setHistoryIndex(newHistory.length - 1);
        setCode(newCode);
    };

    const handleUndo = () => {
        if (historyIndex > 0) {
            setHistoryIndex(historyIndex - 1);
            setCode(history[historyIndex - 1]);
            showToast('Undo');
        }
    };

    const handleRedo = () => {
        if (historyIndex < history.length - 1) {
            setHistoryIndex(historyIndex + 1);
            setCode(history[historyIndex + 1]);
            showToast('Redo');
        }
    };

    // Live Preview Extraction
    const extractContent = (tag: string) => {
        const regex = new RegExp(`<${tag}.*?>(.*?)<\/${tag}>`, 's');
        const match = code.match(regex);
        return match ? match[1] : null;
    };

    const previewAppName = extractContent('title') || "Noir App";

    const showToast = (message: string) => {
        setToast({ message, show: true });
        setTimeout(() => setToast({ message: '', show: false }), 3000);
    };

    const handleGenerate = async () => {
        if (!prompt.trim() && !image) return;

        setIsGenerating(true);
        setCurrentPrompt(prompt);
        setPrompt('');
        setStreamingMessage('');
        setGeneratedSteps([]);
        setIsCodeVisible(false); // Hide code/preview initially
        // setRawStream(''); removed
        let accumulatedStream = '';
        let accumulatedCode = '';

        try {
            const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';

            // Build the prompt with context and generation type
            let fullPrompt = prompt;
            if (context) {
                fullPrompt = `Context:\n${context}\n\nUser Request:\n${prompt}`;
            }
            if (generationType === 'app') {
                fullPrompt += '\n\nGenerate a mobile app UI with iOS-style design.';
            } else {
                fullPrompt += '\n\nGenerate a modern, responsive web page.';
            }

            // Enhance prompt for cloning if image is provided
            if (image) {
                fullPrompt += '\n\nCRITICAL INSTRUCTION: Clone the design in the attached image EXACTLY. Make it 100% PIXEL PERFECT to the provided image. Match colors, spacing, typography, and layout precisely. Use Tailwind CSS to replicate the visual style completely.';
            }

            const response = await fetch(`${apiUrl}/api/generate`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    prompt: fullPrompt,
                    model: model,
                    image: image, // Send the image data
                    history: [],
                    framework: framework
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const reader = response.body?.getReader();
            const decoder = new TextDecoder();

            if (!reader) {
                throw new Error('No response body');
            }

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                const chunk = decoder.decode(value, { stream: true });
                const lines = chunk.split('\n');

                for (const line of lines) {
                    if (line.startsWith('data: ')) {
                        const data = line.slice(6);
                        if (data === '[DONE]') {
                            break;
                        }
                        try {
                            const parsed = JSON.parse(data);
                            if (parsed.content) {
                                accumulatedStream += parsed.content;
                                // setRawStream removed

                                // Parse Steps
                                const stepRegex = /\/\/\/ STEP: (.*?) \/\/\/([\s\S]*?)(?=(\/\/\/ STEP:|$|\/\/\/ CODE \/\/\/))/g;
                                const newSteps = [];
                                let match;
                                while ((match = stepRegex.exec(accumulatedStream)) !== null) {
                                    newSteps.push({ title: match[1].trim(), desc: match[2].trim() });
                                }
                                if (newSteps.length > 0) {
                                    setGeneratedSteps(newSteps);
                                }

                                // Check for Code Start
                                if (accumulatedStream.includes('/// CODE ///')) {
                                    setIsCodeVisible(true);
                                    const parts = accumulatedStream.split('/// CODE ///');
                                    let codePart = parts[1];

                                    // Clean code part
                                    if (codePart.includes('```html')) {
                                        codePart = codePart.replace(/```html\n?/g, '').replace(/```\n?/g, '');
                                    }
                                    accumulatedCode = codePart;
                                    setCode(accumulatedCode);
                                    setStreamingMessage(accumulatedCode); // Only for text view?
                                }
                            }
                            if (parsed.error) {
                                console.error('Stream error:', parsed.error);
                                showToast(`Error: ${parsed.error}`);
                            }
                        } catch {
                            // Skip non-JSON lines
                        }
                    }
                }
            }

            // Clean up the accumulated code (remove markdown code blocks if present)
            let cleanCode = accumulatedCode;
            if (cleanCode.includes('```html')) {
                cleanCode = cleanCode.replace(/```html\n?/g, '').replace(/```\n?/g, '');
            }
            if (cleanCode.includes('```')) {
                cleanCode = cleanCode.replace(/```[a-z]*\n?/g, '').replace(/```\n?/g, '');
            }
            cleanCode = cleanCode.trim();

            if (cleanCode) {
                updateCode(cleanCode);
                setStreamingMessage(cleanCode);
                showToast("Code generated successfully!");
                setIsRefreshing(true);
                setTimeout(() => setIsRefreshing(false), 800);
            }

            setPrompt('');
            setImage(null);
            setContext(null);

        } catch (error) {
            console.error('Generation error:', error);
            showToast(`Generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
            setStreamingMessage('');
            setCurrentPrompt('');
        } finally {
            setIsGenerating(false);
        }
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
                        <span className="hover:text-white cursor-pointer transition-colors" onClick={() => showToast("Project settings")}>{previewAppName}</span>
                        <span className="mx-2 text-neutral-700">/</span>
                        <button
                            className="text-neutral-300 hover:text-white hover:bg-neutral-800 px-2 py-0.5 rounded transition-colors"
                            onClick={() => setGenerationType(prev => prev === 'app' ? 'web' : 'app')}
                            title="Click to switch mode"
                        >
                            {generationType === 'app' ? 'Mobile App' : 'Web App'}
                        </button>
                        <button className="ml-2 text-neutral-600 hover:text-primary transition-colors" onClick={() => showToast("Settings opened")}>
                            <span className="material-symbols-outlined text-base">settings</span>
                        </button>

                        {/* Framework Selector */}
                        <div className="relative ml-4 pl-4 border-l border-neutral-800">
                            <select
                                value={framework}
                                onChange={(e) => setFramework(e.target.value as any)}
                                className="bg-transparent text-xs font-medium text-neutral-400 hover:text-white focus:outline-none cursor-pointer appearance-none pr-4"
                            >
                                <option value="html">HTML</option>
                                <option value="react">React</option>
                                <option value="astro">Astro</option>
                            </select>
                            <span className="material-symbols-outlined absolute right-0 top-1/2 -translate-y-1/2 text-sm text-neutral-500 pointer-events-none">expand_more</span>
                        </div>
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
                    {/* Undo/Redo Buttons */}
                    <div className="flex items-center gap-1 border border-neutral-700 rounded-lg p-0.5">
                        <button
                            className="p-1.5 text-neutral-400 hover:text-white hover:bg-white/10 rounded transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                            onClick={handleUndo}
                            disabled={historyIndex <= 0}
                            title="Undo"
                        >
                            <Undo size={16} />
                        </button>
                        <button
                            className="p-1.5 text-neutral-400 hover:text-white hover:bg-white/10 rounded transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                            onClick={handleRedo}
                            disabled={historyIndex >= history.length - 1}
                            title="Redo"
                        >
                            <Redo size={16} />
                        </button>
                    </div>
                    <button
                        className="flex items-center gap-2 px-3 py-1.5 text-xs font-bold text-white border border-neutral-700 rounded-lg hover:bg-white/10 transition-colors uppercase tracking-wider disabled:opacity-50"
                        onClick={handleSaveProject}
                        disabled={isSaving}
                    >
                        {isSaving ? (
                            <span className="material-symbols-outlined text-sm animate-spin">progress_activity</span>
                        ) : (
                            <Save size={14} strokeWidth={2} />
                        )}
                        {projectId ? 'Save' : 'Save Project'}
                    </button>
                    <button className="flex items-center gap-2 px-3 py-1.5 text-xs font-bold text-primary border border-primary rounded-lg hover:bg-primary/10 transition-colors uppercase tracking-wider" onClick={() => navigate('/pricing')}>
                        <span className="material-symbols-outlined text-sm">workspace_premium</span>
                        Upgrade
                    </button>
                    <button className="flex items-center gap-2 px-4 py-1.5 text-xs font-black bg-primary text-noir-black rounded-lg hover:bg-opacity-90 transition-colors uppercase tracking-wider" onClick={handleDownload}>
                        <Download size={16} strokeWidth={3} />
                        Export
                    </button>
                </div>
            </header>

            <div className="flex h-[calc(100vh-3.5rem)] overflow-hidden">
                {/* Sidebar */}
                <aside className={`w-[400px] border-r border-neutral-800 flex flex-col bg-noir-black transition-all ${sidebarOpen ? 'translate-x-0' : '-translate-x-full absolute z-40 h-full'}`}>
                    {/* Scrollable Content */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-6 no-scrollbar">
                        <div className="space-y-4">
                            <div className="flex gap-3">
                                <div className="w-8 h-8 rounded-full bg-neutral-900 flex items-center justify-center flex-shrink-0 border border-neutral-800">
                                    <span className="material-symbols-outlined text-sm text-primary">auto_awesome</span>
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-semibold text-neutral-200 mb-2">Noir Assistant</p>

                                    {/* Show current prompt being processed */}
                                    {currentPrompt && (
                                        <div className="mb-3 p-2 bg-lime-500/10 border border-lime-500/20 rounded-lg">
                                            <p className="text-xs text-lime-400 font-medium mb-1">Your Prompt:</p>
                                            <p className="text-sm text-neutral-300">{currentPrompt}</p>
                                        </div>
                                    )}

                                    {/* Show streaming message or default */}
                                    {isGenerating ? (
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2 text-sm text-primary">
                                                <span className="material-symbols-outlined text-sm animate-spin">progress_activity</span>
                                                <span>Generating code...</span>
                                            </div>
                                            {streamingMessage && (
                                                <div className="p-2 bg-neutral-900 rounded-lg border border-neutral-800 max-h-[200px] overflow-y-auto">
                                                    <pre className="text-[10px] font-mono text-neutral-400 whitespace-pre-wrap">{streamingMessage.slice(-500)}...</pre>
                                                </div>
                                            )}
                                        </div>
                                    ) : streamingMessage ? (
                                        <div className="p-2 bg-neutral-900 rounded-lg border border-neutral-800">
                                            <p className="text-xs text-green-400 font-medium mb-1">✓ Code Generated Successfully</p>
                                            <p className="text-xs text-neutral-500">{code.length} characters generated</p>
                                        </div>
                                    ) : (
                                        <ul className="space-y-3 text-sm text-neutral-400 list-disc pl-4 leading-relaxed">
                                            <li>Type a prompt below to generate <span className="text-neutral-200">HTML/CSS code</span></li>
                                            <li>Select a model from the dropdown</li>
                                            <li>Press Enter or click the arrow to generate</li>
                                        </ul>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Chat Input Area - Fixed at Bottom */}
                    <div className="p-4 border-t border-neutral-800 bg-noir-black flex-shrink-0">
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
                                ) : code ? (
                                    <div className={`${currentDeviceClass[device]} device-mockup overflow-hidden transition-all duration-500 relative ${device === 'iPhone 17 Pro' ? 'notch' : ''}`}>
                                        <iframe
                                            srcDoc={code}
                                            className={`w-full h-full border-0 bg-white transition-opacity duration-300 ${!isCodeVisible && isGenerating ? 'opacity-10' : 'opacity-100'}`}
                                            title="Preview"
                                            sandbox="allow-scripts allow-same-origin"
                                        />

                                        {!isCodeVisible && isGenerating && (
                                            <div className="absolute inset-0 z-20 bg-noir-black/95 backdrop-blur-sm flex items-center justify-center p-8">
                                                <div className="w-full max-w-sm">
                                                    <div className="flex items-center gap-4 mb-8">
                                                        <div className="relative">
                                                            <div className="absolute inset-0 bg-lime-500 blur-xl opacity-20 animate-pulse"></div>
                                                            <RefreshCw className="relative text-lime-400 animate-spin" size={28} />
                                                        </div>
                                                        <div>
                                                            <h3 className="text-white font-bold text-base tracking-tight">AI Architect</h3>
                                                            <p className="text-neutral-500 text-xs mt-0.5">Building your solution...</p>
                                                        </div>
                                                    </div>

                                                    <div className="space-y-0 relative">
                                                        {/* Connector Line */}
                                                        <div className="absolute left-[9px] top-2 bottom-6 w-px bg-neutral-800"></div>

                                                        {generatedSteps.map((step, idx) => (
                                                            <motion.div
                                                                key={idx}
                                                                initial={{ opacity: 0, x: -10 }}
                                                                animate={{ opacity: 1, x: 0 }}
                                                                className="relative pl-8 pb-6"
                                                            >
                                                                <div className={`absolute left-0 top-1.5 w-[19px] h-[19px] rounded-full border-[3px] z-10 ${idx === generatedSteps.length - 1 ? 'border-lime-500 bg-noir-black shadow-[0_0_15px_rgba(132,204,22,0.4)]' : 'border-neutral-800 bg-neutral-900'}`}></div>
                                                                <h4 className={`text-sm font-semibold transition-colors ${idx === generatedSteps.length - 1 ? 'text-white' : 'text-neutral-500'}`}>{step.title}</h4>
                                                                <p className="text-xs text-neutral-600 mt-1 leading-relaxed line-clamp-2">{step.desc}</p>
                                                            </motion.div>
                                                        ))}

                                                        {generatedSteps.length === 0 && (
                                                            <div className="pl-8 text-neutral-600 text-sm italic animate-pulse">Analyzing requirements...</div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div className={`${currentDeviceClass[device]} device-mockup flex flex-col items-center justify-center text-center px-8 transition-all duration-500 ${device === 'iPhone 17 Pro' ? 'notch' : ''}`}>
                                        <div className="p-6 bg-neutral-900 rounded-2xl border border-neutral-800 w-full max-w-[280px]">
                                            <span className="material-symbols-outlined text-4xl text-neutral-600 mb-4">code</span>
                                            <h1 className="text-lg font-bold text-neutral-400 mb-2">No Preview Yet</h1>
                                            <p className="text-sm text-neutral-500 leading-relaxed">Enter a prompt and generate code to see the preview here.</p>
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
                                        <span className="ml-3 text-xs text-neutral-400 font-mono">index.html</span>
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
                                {/* Editable Code Area with Syntax Highlighting */}
                                <div className="w-full h-[400px] border border-neutral-800 rounded-lg overflow-auto bg-[#1d1d1d] relative custom-scrollbar">
                                    <Editor
                                        value={code}
                                        onValueChange={code => updateCode(code)}
                                        highlight={code => Prism.highlight(code, Prism.languages.markup, 'markup')}
                                        padding={20}
                                        className="font-mono min-h-full"
                                        style={{
                                            fontFamily: '"Fira Code", monospace',
                                            fontSize: 14,
                                            backgroundColor: 'transparent',
                                            color: '#f8f8f2'
                                        }}
                                    />
                                </div>
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
