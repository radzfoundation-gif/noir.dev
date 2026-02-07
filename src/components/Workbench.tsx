import { useState, useEffect, useRef } from 'react';
import { useLocation, useSearchParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { createPortal } from 'react-dom';
import { ChatInput } from './ChatInput';
import { Copy, Key, Trash2, Plus, FileCode, RefreshCw, Download, Undo, Redo, Camera, Save, LayoutGrid, History, Smartphone, MessageSquare, Palette, Server, KeyRound, Rocket, ShieldCheck, Sparkles, Zap, ChevronDown, Monitor, Tablet, Play, Layers, ZoomIn, ZoomOut, Maximize } from 'lucide-react';
import { toPng } from 'html-to-image';
import { projectService } from '../lib/projectService';
import { useAuth } from '../context/AuthContext';
import Editor from 'react-simple-code-editor';
import Prism from 'prismjs';
import 'prismjs/components/prism-markup';
import 'prismjs/components/prism-css';
import 'prismjs/themes/prism-tomorrow.css';
import { ExportModal } from './ExportModal';
import { ComponentGallery } from './ComponentGallery';
import { VersionHistoryModal } from './VersionHistoryModal';
import { ToolbarDropdown } from './ToolbarDropdown';
import type { ComponentTemplate } from '../lib/templateService';
import { TeamSettingsModal } from './team/TeamSettingsModal';
import { ShareProjectModal } from './team/ShareProjectModal';
import { CommentThread } from './comments/CommentThread';
import { ResponsiveTestingPanel } from './responsive/ResponsiveTestingPanel';
import { DesignSystemPicker } from './design-system/DesignSystemPicker';
import { ActiveUsersList } from './presence/PresenceComponents';
import { BackendGeneratorPanel } from './backend/BackendGeneratorPanel';
import { MobileExportModal } from './mobile/MobileExportModal';
import { APIManager } from './api/APIManager';
import { teamService, type Team, type TeamMember, type Comment } from '../lib/teamService';
import { BrandSettingsModal } from './brand/BrandSettingsModal';
import { brandService, defaultBrandIdentity, type BrandIdentity } from '../lib/brandService';
import { AuditorPanel } from './auditor/AuditorPanel';
import { type AuditResult } from '../lib/auditorService';
import { DeploymentModal } from './deploy/DeploymentModal';
import type { DesignSystemLibrary } from '../lib/designSystemService';
import StreamingSteps from './streaming/StreamingSteps';
import WorkingIndicator from './streaming/WorkingIndicator';
import { fullstackGeneratorService } from '../lib/fullstackGeneratorService';

type ViewMode = 'Preview' | 'Code' | 'Integrations' | 'APIs';
type Device = 'mobile' | 'desktop' | 'tablet';

// Device Mockup Component
const DeviceMockup = ({ device, code, zoom, onScaleChange }: { device: Device; code: string; zoom: number | 'fit'; onScaleChange?: (scale: number) => void }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [scale, setScale] = useState(1);

    // Fixed dimensions for devices
    const deviceConfig = {
        mobile: { width: 375, height: 812, radius: 40, border: 12 },
        tablet: { width: 768, height: 1024, radius: 24, border: 14 },
        desktop: { width: 1280, height: 800, radius: 8, border: 0 }, // Fixed desktop size
    };

    const [mockupSize, setMockupSize] = useState({ width: deviceConfig[device].width, height: deviceConfig[device].height });

    const config = deviceConfig[device];

    useEffect(() => {
        const handleResize = () => {
            if (!containerRef.current) return;

            const containerWidth = containerRef.current.clientWidth;
            const containerHeight = containerRef.current.clientHeight;
            const padding = 40; // Space around the device

            const availableWidth = Math.max(0, containerWidth - padding);
            const availableHeight = Math.max(0, containerHeight - padding);

            let targetWidth = config.width;
            let targetHeight = config.height;

            // For desktop, allow it to be dynamic/responsive but min 1280x800
            if (device === 'desktop') {
                targetWidth = Math.max(availableWidth, 1280);
                targetHeight = Math.max(availableHeight, 800);
            }

            setMockupSize({ width: targetWidth, height: targetHeight });

            const scaleX = availableWidth / targetWidth;
            const scaleY = availableHeight / targetHeight;

            let newScale = 1;
            if (zoom === 'fit') {
                newScale = Math.min(scaleX, scaleY);
            } else {
                newScale = zoom;
            }

            setScale(newScale);
            if (onScaleChange) onScaleChange(newScale);
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [device, config, zoom]);

    return (
        <div
            ref={containerRef}
            className="w-full h-full flex items-center justify-center overflow-hidden"
        >
            <div
                className="relative bg-neutral-900 shadow-2xl transition-all duration-300 origin-center"
                style={{
                    width: mockupSize.width,
                    height: mockupSize.height,
                    borderRadius: config.radius,
                    border: `${config.border}px solid #1a1a1a`,
                    transform: `scale(${scale})`,
                }}
            >
                {/* Device Frame Details */}
                {device === 'mobile' && (
                    <>
                        {/* Notch */}
                        <div
                            className="absolute top-0 left-1/2 -translate-x-1/2 bg-neutral-900 rounded-b-2xl z-20"
                            style={{ width: 120, height: 28 }}
                        />
                        {/* Side Buttons */}
                        <div className="absolute bg-neutral-800 rounded-l" style={{ left: -2, top: 120, width: 2, height: 30 }} />
                        <div className="absolute bg-neutral-800 rounded-l" style={{ left: -2, top: 160, width: 2, height: 60 }} />
                        <div className="absolute bg-neutral-800 rounded-r" style={{ right: -2, top: 140, width: 2, height: 80 }} />
                    </>
                )}

                {device === 'tablet' && (
                    <>
                        {/* Camera */}
                        <div className="absolute left-1/2 -translate-x-1/2 bg-neutral-800 rounded-full z-20" style={{ top: 12, width: 8, height: 8 }} />
                        {/* Side Buttons */}
                        <div className="absolute bg-neutral-800 rounded-l" style={{ left: -2, top: 100, width: 2, height: 40 }} />
                        <div className="absolute bg-neutral-800 rounded-r" style={{ right: -2, top: 100, width: 2, height: 40 }} />
                    </>
                )}

                {/* Screen */}
                <div
                    className="w-full h-full bg-white overflow-hidden"
                    style={{
                        borderRadius: device === 'mobile' ? 28 : device === 'tablet' ? 8 : 4,
                    }}
                >
                    <iframe
                        srcDoc={code}
                        className="w-full h-full border-0 block"
                        title="Preview"
                        sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
                    />
                </div>
            </div>
        </div>
    );
};

// Quick action templates like Vibecode
const quickActions = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutGrid },
    { id: 'landing', label: 'Landing Page', icon: Sparkles },
    { id: 'auth', label: 'Auth Page', icon: Key },
    { id: 'ecommerce', label: 'E-commerce', icon: Zap },
    { id: 'blog', label: 'Blog', icon: FileCode },
];

export const Workbench = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [generationType, setGenerationType] = useState<'web' | 'app'>(location.state?.generationType || 'web');
    const [buildMode, setBuildMode] = useState<'frontend' | 'fullstack'>('frontend');
    const [showConfigDropdown, setShowConfigDropdown] = useState(false);
    const [activeTab, setActiveTab] = useState<ViewMode>('Preview');

    // Helper function to get dropdown position
    const getDropdownPosition = (elementId: string) => {
        const element = document.getElementById(elementId);
        if (!element) return { top: 60, left: 200 };
        const rect = element.getBoundingClientRect();
        return {
            top: rect.bottom + 8,
            left: rect.left
        };
    };
    const [device, setDevice] = useState<Device>(
        location.state?.generationType === 'web' ? 'desktop' : 'mobile'
    );
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [toast, setToast] = useState<{ message: string; show: boolean }>({ message: '', show: false });
    const [searchParams] = useSearchParams();
    const [projectId, setProjectId] = useState<string | null>(searchParams.get('project'));
    const [isSaving, setIsSaving] = useState(false);
    const { user } = useAuth();
    const [model, setModel] = useState(location.state?.model || 'anthropic/claude-opus-4.5');
    const [prompt, setPrompt] = useState(location.state?.prompt || '');
    const [image, setImage] = useState<string | null>(location.state?.image || null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [context, setContext] = useState<string | null>(null);
    const [streamingMessage, setStreamingMessage] = useState<string>('');
    const [thinking, setThinking] = useState<string>('');
    const [analysis, setAnalysis] = useState<string>('');
    const [currentPrompt, setCurrentPrompt] = useState<string>('');
    const [currentImage, setCurrentImage] = useState<string | null>(null);
    const [generatedSteps, setGeneratedSteps] = useState<{ title: string; desc: string }[]>([]);
    const [isCodeVisible, setIsCodeVisible] = useState(true);
    const [framework, setFramework] = useState<'html' | 'react' | 'astro'>(location.state?.framework || 'html');

    // Modal States
    const [isExportModalOpen, setIsExportModalOpen] = useState(false);
    const [isGalleryOpen, setIsGalleryOpen] = useState(false);
    const [isVersionHistoryOpen, setIsVersionHistoryOpen] = useState(false);
    const [isBrandModalOpen, setIsBrandModalOpen] = useState(false);

    // Team & Collaboration
    const [teams, setTeams] = useState<Team[]>([]);
    const [currentTeamId, _setCurrentTeamId] = useState<string | undefined>();
    const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
    const [isTeamSettingsOpen, setIsTeamSettingsOpen] = useState(false);
    const [isShareModalOpen, setIsShareModalOpen] = useState(false);
    const [comments, setComments] = useState<Comment[]>([]);
    const [showComments, setShowComments] = useState(false);
    const [selectedDesignSystem, setSelectedDesignSystem] = useState<DesignSystemLibrary>('none');
    const [isDesignSystemPickerOpen, setIsDesignSystemPickerOpen] = useState(false);
    const [isResponsivePanelOpen, setIsResponsivePanelOpen] = useState(false);
    const [brandIdentity, setBrandIdentity] = useState<BrandIdentity>(defaultBrandIdentity);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const abortControllerRef = useRef<AbortController | null>(null);

    // AI Auditor State
    const [isAuditorOpen, setIsAuditorOpen] = useState(false);
    const [auditResults] = useState<AuditResult | null>(null);
    const [isDeployModalOpen, setIsDeployModalOpen] = useState(false);

    // Backend & Mobile
    const [isBackendPanelOpen, setIsBackendPanelOpen] = useState(false);
    const [isMobileExportOpen, setIsMobileExportOpen] = useState(false);
    const [isAPIManagerOpen, setIsAPIManagerOpen] = useState(false);

    // History State
    const [history, setHistory] = useState<string[]>([]);
    const [historyIndex, setHistoryIndex] = useState(0);
    const [isRefreshing, setIsRefreshing] = useState(false);

    useEffect(() => {
        if (isGenerating || thinking || analysis || streamingMessage || generatedSteps.length > 0) {
            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
        }
    }, [isGenerating, thinking, analysis, streamingMessage, generatedSteps]);

    const runAudit = async () => {
        setIsAuditorOpen(true);
    };


    const [code, setCode] = useState<string>('');
    const [zoom, setZoom] = useState<number | 'fit'>('fit');
    const [currentScale, setCurrentScale] = useState(1); // For display
    // Load project
    useEffect(() => {
        if (projectId && user) {
            loadProject(projectId);
            loadProjectComments(projectId);
            brandService.getBrandIdentity(projectId).then(setBrandIdentity);
        }
    }, [projectId, user]);

    useEffect(() => {
        if (user) {
            loadUserTeams();
        }
    }, [user]);

    // Auto-generate on mount when navigating from LandingPage with autoGenerate flag
    const hasAutoGenerated = useRef(false);
    useEffect(() => {
        console.log('[DEBUG] Auto-generate useEffect triggered');
        console.log('[DEBUG] location.state?.autoGenerate:', location.state?.autoGenerate);
        console.log('[DEBUG] hasAutoGenerated.current:', hasAutoGenerated.current);
        console.log('[DEBUG] isGenerating:', isGenerating);

        if (location.state?.autoGenerate && !hasAutoGenerated.current && !isGenerating) {
            console.log('[DEBUG] ✅ Auto-generate conditions met, triggering handleGenerate in 100ms');
            hasAutoGenerated.current = true;
            // Small timeout to ensure component is fully mounted
            const timer = setTimeout(() => {
                console.log('[DEBUG] ✅ Auto-generate timer fired, calling handleGenerate');
                handleGenerate();
            }, 100);
            return () => clearTimeout(timer);
        } else {
            console.log('[DEBUG] ℹ️ Auto-generate conditions NOT met');
        }
    }, [location.state?.autoGenerate]);

    const loadUserTeams = async () => {
        try {
            const userTeams = await teamService.getUserTeams();
            setTeams(userTeams);
        } catch (err) {
            console.error('Failed to load teams:', err);
        }
    };

    const loadProjectComments = async (id: string) => {
        try {
            const projectComments = await teamService.getProjectComments(id);
            setComments(projectComments);
        } catch (err) {
            console.error('Failed to load comments:', err);
        }
    };

    const handleAddComment = async (content: string, parentId?: string) => {
        if (!projectId || !user) return;
        try {
            await teamService.addComment(projectId, content, { parentId });
            loadProjectComments(projectId);
            showToast('Comment added');
        } catch (err) {
            console.error('Failed to add comment:', err);
            showToast('Failed to add comment');
        }
    };

    const handleResolveComment = async (commentId: string) => {
        try {
            await teamService.resolveComment(commentId);
            if (projectId) loadProjectComments(projectId);
            showToast('Comment resolved');
        } catch (err) {
            console.error('Failed to resolve comment:', err);
        }
    };

    const handleDeleteComment = async (commentId: string) => {
        try {
            await teamService.deleteComment(commentId);
            if (projectId) loadProjectComments(projectId);
            showToast('Comment deleted');
        } catch (err) {
            console.error('Failed to delete comment:', err);
        }
    };

    const ensureTailwindCDN = (htmlCode: string): string => {
        if (!htmlCode || htmlCode.includes('tailwindcss') || htmlCode.includes('tailwind.css')) {
            return htmlCode;
        }
        const hasTailwindClasses = /class="[^"]*(?:flex|grid|text-|bg-|p-\d|m-\d|rounded|shadow|border|w-|h-|gap-|space-|items-|justify-)[^"]*"/.test(htmlCode);
        if (!hasTailwindClasses) return htmlCode;

        let result = htmlCode;
        const tailwindCDN = '<script src="https://cdn.tailwindcss.com"></script>';
        if (result.includes('</head>')) {
            result = result.replace('</head>', `${tailwindCDN}\n</head>`);
        } else if (result.includes('<head>')) {
            result = result.replace('<head>', `<head>\n${tailwindCDN}`);
        }
        return result;
    };

    const loadProject = async (id: string) => {
        try {
            const project = await projectService.getProject(id);
            if (project) {
                const enhancedCode = ensureTailwindCDN(project.code);
                setCode(enhancedCode);
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

    const updateCode = (newCode: string) => {
        const newHistory = history.slice(0, historyIndex + 1);
        newHistory.push(newCode);
        setHistory(newHistory.slice(-20));
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

    const handleZoomIn = () => {
        setZoom(prev => {
            if (prev === 'fit') return Math.min(currentScale + 0.1, 2);
            return Math.min((prev as number) + 0.1, 2);
        });
    };

    const handleZoomOut = () => {
        setZoom(prev => {
            if (prev === 'fit') return Math.max(currentScale - 0.1, 0.1);
            return Math.max((prev as number) - 0.1, 0.1);
        });
    };

    const extractContent = (tag: string) => {
        const regex = new RegExp(`<${tag}.*?>(.*?)</${tag}>`, 's');
        const match = code.match(regex);
        return match ? match[1] : null;
    };

    const previewAppName = extractContent('title') || "NOIR App";

    const showToast = (message: string) => {
        setToast({ message, show: true });
        setTimeout(() => setToast({ message: '', show: false }), 3000);
    };

    const handleStop = () => {
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
            abortControllerRef.current = null;
        }
        setIsGenerating(false);
        showToast('Generation stopped');
    };

    const handleGenerate = async () => {
        console.log('[DEBUG] ====== handleGenerate CALLED ======');
        console.log('[DEBUG] prompt state:', prompt);
        console.log('[DEBUG] location.state?.prompt:', location.state?.prompt);
        console.log('[DEBUG] image:', image ? 'HAS IMAGE' : 'NO IMAGE');
        console.log('[DEBUG] model:', model);
        console.log('[DEBUG] isGenerating:', isGenerating);
        console.log('[DEBUG] location.state?.autoGenerate:', location.state?.autoGenerate);

        const promptToUse = prompt || location.state?.prompt || '';
        console.log('[DEBUG] promptToUse:', promptToUse);

        if (!promptToUse.trim() && !image) {
            console.log('[DEBUG] ❌ EARLY RETURN: No prompt or image provided');
            return;
        }

        console.log('[DEBUG] ✅ Starting generation process...');
        setIsGenerating(true);
        abortControllerRef.current = new AbortController();
        setActiveTab('Preview');
        setCurrentPrompt(promptToUse);
        const imageToSend = image;
        setCurrentImage(imageToSend);
        setCurrentImage(imageToSend);
        setPrompt('');
        setImage(null);
        setZoom('fit');
        setStreamingMessage('');
        setThinking('');
        setAnalysis('');
        setGeneratedSteps([]);
        setIsCodeVisible(false);

        let accumulatedStream = '';
        let accumulatedCode = '';
        let accumulatedThinking = '';

        try {
            const apiUrl = import.meta.env.VITE_API_URL || '';
            console.log('[DEBUG] API URL:', apiUrl || '(relative)');

            if (buildMode === 'fullstack') {
                const spec = await fullstackGeneratorService.generateFromPrompt(promptToUse, model);
                console.log('[DEBUG] Generated Spec:', spec);
                // Further logic for fullstack generation would go here
            }

            let fullPrompt = promptToUse;
            const systemPrompt = brandService.generateSystemPrompt(brandIdentity);
            fullPrompt = `${systemPrompt}\n\nUser Request: ${promptToUse}`;

            if (context) {
                fullPrompt = `Context:\n${context}\n\n${fullPrompt}`;
            }
            if (generationType === 'app') {
                fullPrompt += '\n\nGenerate a mobile app UI with iOS-style design.';
            } else {
                fullPrompt += '\n\nGenerate a modern, responsive web page.';
            }
            if (imageToSend) {
                fullPrompt += '\n\nCRITICAL INSTRUCTION: First, perform a deep visual analysis of the attached screen. Describe the layout, colors, typography, and components in detail. Wrap this analysis in `/// ANALYSIS /// ... /// END ANALYSIS ///` tags. Then, implement the Functional Web Interface using HTML and Tailwind CSS. DO NOT just draw the screenshot as a static SVG or Image. Build the actual interactive DOM elements (buttons, inputs, cards, grids). Make it 100% PIXEL PERFECT to the reference layout.';
            }

            console.log('[DEBUG] Making fetch request to:', `${apiUrl}/api/generate`);
            console.log('[DEBUG] Request body:', { model, hasImage: !!imageToSend, framework, promptLength: fullPrompt.length });

            const response = await fetch(`${apiUrl}/api/generate`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                signal: abortControllerRef.current?.signal,
                body: JSON.stringify({
                    prompt: fullPrompt,
                    model: model,
                    image: imageToSend,
                    history: [],
                    framework: framework
                })
            });

            console.log('[DEBUG] Response status:', response.status);
            console.log('[DEBUG] Response ok:', response.ok);

            if (!response.ok) {
                console.log('[DEBUG] ❌ Response not OK, throwing error');
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const reader = response.body?.getReader();
            const decoder = new TextDecoder();
            if (!reader) {
                console.log('[DEBUG] ❌ No response body reader');
                throw new Error('No response body');
            }

            console.log('[DEBUG] ✅ Starting stream reading...');
            let chunkCount = 0;

            while (true) {
                const { done, value } = await reader.read();
                if (done) {
                    console.log('[DEBUG] ✅ Stream reading DONE');
                    break;
                }
                chunkCount++;
                const chunk = decoder.decode(value, { stream: true });
                const lines = chunk.split('\n');

                if (chunkCount <= 3 || chunkCount % 10 === 0) {
                    console.log(`[DEBUG] Chunk #${chunkCount}, lines: ${lines.length}, chunk length: ${chunk.length}`);
                }

                for (const line of lines) {
                    if (line.startsWith('data: ')) {
                        const data = line.slice(6);
                        if (data === '[DONE]') {
                            console.log('[DEBUG] Received [DONE] signal');
                            break;
                        }
                        try {
                            const parsed = JSON.parse(data);
                            if (parsed.thinking) {
                                accumulatedThinking += parsed.thinking;
                                setThinking(accumulatedThinking);
                            }
                            if (parsed.content) {
                                accumulatedStream += parsed.content;
                                if (accumulatedStream.includes('/// THINKING ///')) {
                                    const thinkingPart = accumulatedStream.split('/// THINKING ///')[1]?.split('/// STEP')[0]?.split('/// ANALYSIS')[0]?.split('/// CODE')[0] || '';
                                    if (thinkingPart) setThinking(thinkingPart.trim());
                                }
                                if (accumulatedStream.includes('/// ANALYSIS ///')) {
                                    const analysisPart = accumulatedStream.split('/// ANALYSIS ///')[1]?.split('/// END ANALYSIS ///')[0] || '';
                                    if (analysisPart) setAnalysis(analysisPart.trim());
                                }
                                const stepRegex = /\/\/\/ STEP: ([\d].*?) \/\/\/([\s\S]*?)(?=(\/\/\/ STEP:|$|\/\/\/ CODE \/\/\/))/g;
                                const newSteps = [];
                                let match;
                                while ((match = stepRegex.exec(accumulatedStream)) !== null) {
                                    newSteps.push({ title: match[1].trim(), desc: match[2].trim() });
                                }
                                if (newSteps.length > 0) setGeneratedSteps(newSteps);
                                if (accumulatedStream.includes('/// CODE ///')) {
                                    setIsCodeVisible(true);
                                    const parts = accumulatedStream.split('/// CODE ///');
                                    let codePart = parts[1] || '';
                                    if (codePart.includes('```html')) {
                                        codePart = codePart.replace(/```html\n?/g, '').replace(/```\n?/g, '');
                                    }
                                    codePart = codePart.replace(/(\s*\/\/\/ END CODE \/\/\/|\s*\/\/\/ END CODE)/g, '');
                                    accumulatedCode = codePart;
                                    setCode(accumulatedCode);
                                    setStreamingMessage(accumulatedCode);
                                }
                            }
                            if (parsed.error) {
                                console.error('[DEBUG] ❌ Stream error from server:', parsed.error);
                                showToast(`Error: ${parsed.error}`);
                            }
                        } catch { }
                    }
                }
            }

            console.log('[DEBUG] Total chunks received:', chunkCount);
            console.log('[DEBUG] Accumulated stream length:', accumulatedStream.length);
            console.log('[DEBUG] Accumulated code length:', accumulatedCode.length);

            let cleanCode = accumulatedCode;
            if (cleanCode.includes('```html')) cleanCode = cleanCode.replace(/```html\n?/g, '').replace(/```\n?/g, '');
            if (cleanCode.includes('```')) cleanCode = cleanCode.replace(/```[a-z]*\n?/g, '').replace(/```\n?/g, '');
            cleanCode = cleanCode.replace(/(\s*\/\/\/ END CODE \/\/\/|\s*\/\/\/ END CODE)/g, '').trim();
            cleanCode = ensureTailwindCDN(cleanCode);

            console.log('[DEBUG] Clean code length:', cleanCode.length);

            if (cleanCode) {
                console.log('[DEBUG] ✅ Code generated successfully, updating...');
                updateCode(cleanCode);
                setStreamingMessage(cleanCode);
                showToast("Code generated successfully!");
                setIsRefreshing(true);
                setTimeout(() => setIsRefreshing(false), 800);
            } else {
                console.log('[DEBUG] ⚠️ No clean code generated');
            }
            setPrompt('');
            setImage(null);
            setContext(null);
        } catch (error) {
            console.error('[DEBUG] ❌ Generation error:', error);
            console.error('[DEBUG] Error type:', error instanceof Error ? error.constructor.name : typeof error);
            console.error('[DEBUG] Error message:', error instanceof Error ? error.message : String(error));
            showToast(`Generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
            setStreamingMessage('');
            setCurrentPrompt('');
        } finally {
            console.log('[DEBUG] ====== handleGenerate FINISHED ======');
            setIsGenerating(false);
        }
    };

    const handleAddToChat = () => {
        const selection = window.getSelection()?.toString();
        if (selection && selection.trim().length > 0) {
            setPrompt((prev: string) => prev ? `${prev}\n\nSelected code:\n${selection}` : `Selected code:\n${selection}`);
            showToast("Selection added to prompt");
        } else {
            setPrompt((prev: string) => prev ? `${prev}\n\nCurrent code:\n${code}` : `Current code:\n${code}`);
            showToast("Code added to prompt");
        }
        setSidebarOpen(true);
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
                    console.error('Screenshot error:', err);
                    showToast("Failed to take screenshot");
                });
        }
    };

    const handleTemplateSelect = (template: ComponentTemplate) => {
        setPrompt(template.prompt);
        showToast(`Template "${template.name}" selected`);
        setTimeout(() => handleGenerate(), 100);
    };

    const handleRevertCode = (revertedCode: string) => {
        setCode(revertedCode);
        showToast("Code reverted successfully");
    };

    // Integrations data
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

    const handleQuickAction = (actionId: string) => {
        const actionPrompts: Record<string, string> = {
            dashboard: 'Create a modern analytics dashboard with charts, stats cards, and sidebar navigation',
            landing: 'Create a beautiful landing page with hero section, features, testimonials, and CTA',
            auth: 'Create an authentication page with login and signup forms, modern design',
            ecommerce: 'Create an e-commerce product page with image gallery, pricing, and add to cart',
            blog: 'Create a blog post page with article content, author info, and related posts'
        };
        setPrompt(actionPrompts[actionId] || '');
        setTimeout(() => handleGenerate(), 100);
    };

    return (
        <div className="h-screen bg-black text-white font-sans overflow-hidden">
            {/* Toast Notification */}
            <AnimatePresence>
                {toast.show && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] px-4 py-2 bg-neutral-900 border border-neutral-800 rounded-full shadow-xl flex items-center gap-2"
                    >
                        <Sparkles size={14} className="text-lime-400" />
                        <span className="text-xs font-medium">{toast.message}</span>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Header - Vibecode Style */}
            <header className="h-14 bg-black/80 backdrop-blur-xl border-b border-white/5 sticky top-0 z-50">
                <div className="h-full flex items-center justify-between px-4">
                    {/* Left: Logo & Project Info */}
                    <div className="flex items-center gap-4">
                        <a href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                            <div className="w-7 h-7 bg-gradient-to-br from-lime-400 to-lime-600 rounded-lg flex items-center justify-center">
                                <Sparkles size={14} className="text-black" />
                            </div>
                            <span className="font-semibold text-lg">NOIR</span>
                        </a>

                        <div className="h-5 w-px bg-white/10" />

                        <div className="flex items-center gap-2">
                            <span className="text-sm text-neutral-400 hover:text-white cursor-pointer transition-colors">
                                {previewAppName}
                            </span>
                            <ChevronDown size={14} className="text-neutral-600" />
                        </div>

                        {/* Combined Platform & Build Mode Dropdown */}
                        <div className="relative ml-2" id="config-dropdown">
                            <button
                                onClick={() => setShowConfigDropdown(!showConfigDropdown)}
                                className="flex items-center gap-2 px-3 py-1.5 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 hover:border-neutral-700 rounded-xl text-xs font-medium transition-all"
                            >
                                <div className="flex items-center gap-1.5">
                                    {generationType === 'web' ? <Monitor size={14} className="text-neutral-400" /> : <Smartphone size={14} className="text-neutral-400" />}
                                    <span className="text-neutral-300">{generationType === 'web' ? 'Web' : 'App'}</span>
                                </div>
                                <div className="w-px h-3 bg-neutral-700" />
                                <div className="flex items-center gap-1.5">
                                    {buildMode === 'frontend' ? <Palette size={14} className="text-lime-400" /> : <Layers size={14} className="text-purple-400" />}
                                    <span className={buildMode === 'frontend' ? 'text-lime-400' : 'text-purple-400'}>{buildMode === 'frontend' ? 'Frontend' : 'Fullstack'}</span>
                                </div>
                                <ChevronDown size={12} className={`text-neutral-500 transition-transform ml-1 ${showConfigDropdown ? 'rotate-180' : ''}`} />
                            </button>

                            {showConfigDropdown && createPortal(
                                <>
                                    <div
                                        className="fixed inset-0 z-[9998]"
                                        onClick={() => setShowConfigDropdown(false)}
                                    />
                                    <motion.div
                                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                                        style={{
                                            position: 'fixed',
                                            ...getDropdownPosition('config-dropdown'),
                                            zIndex: 9999
                                        }}
                                        className="w-[200px] bg-neutral-900 border border-neutral-700 rounded-xl shadow-2xl overflow-hidden"
                                    >
                                        {/* Platform Section */}
                                        <div className="px-3 py-2 text-[10px] font-bold text-neutral-500 uppercase tracking-wider">
                                            Platform
                                        </div>
                                        <div className="pb-2">
                                            <button
                                                onClick={() => {
                                                    setGenerationType('web');
                                                    setDevice('desktop');
                                                }}
                                                className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors hover:bg-neutral-800 ${generationType === 'web' ? 'bg-white/5 text-white' : 'text-neutral-400'
                                                    }`}
                                            >
                                                <Monitor size={16} className={generationType === 'web' ? 'text-white' : 'text-neutral-500'} />
                                                <span className="text-sm">Web</span>
                                                {generationType === 'web' && <div className="ml-auto w-2 h-2 rounded-full bg-white" />}
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setGenerationType('app');
                                                    setDevice('mobile');
                                                }}
                                                className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors hover:bg-neutral-800 ${generationType === 'app' ? 'bg-white/5 text-white' : 'text-neutral-400'
                                                    }`}
                                            >
                                                <Smartphone size={16} className={generationType === 'app' ? 'text-white' : 'text-neutral-500'} />
                                                <span className="text-sm">App</span>
                                                {generationType === 'app' && <div className="ml-auto w-2 h-2 rounded-full bg-white" />}
                                            </button>
                                        </div>

                                        <div className="border-t border-neutral-800" />

                                        {/* Build Mode Section */}
                                        <div className="px-3 py-2 text-[10px] font-bold text-neutral-500 uppercase tracking-wider">
                                            Build Mode
                                        </div>
                                        <div className="pb-2">
                                            <button
                                                onClick={() => setBuildMode('frontend')}
                                                className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors hover:bg-neutral-800 ${buildMode === 'frontend' ? 'bg-lime-500/10 text-lime-400' : 'text-neutral-400'
                                                    }`}
                                            >
                                                <Palette size={16} className={buildMode === 'frontend' ? 'text-lime-400' : 'text-neutral-500'} />
                                                <span className="text-sm">Frontend</span>
                                                {buildMode === 'frontend' && <div className="ml-auto w-2 h-2 rounded-full bg-lime-400" />}
                                            </button>
                                            <button
                                                onClick={() => setBuildMode('fullstack')}
                                                className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors hover:bg-neutral-800 ${buildMode === 'fullstack' ? 'bg-purple-500/10 text-purple-400' : 'text-neutral-400'
                                                    }`}
                                            >
                                                <Layers size={16} className={buildMode === 'fullstack' ? 'text-purple-400' : 'text-neutral-500'} />
                                                <span className="text-sm">Fullstack</span>
                                                {buildMode === 'fullstack' && <div className="ml-auto w-2 h-2 rounded-full bg-purple-400" />}
                                            </button>
                                        </div>
                                    </motion.div>
                                </>,
                                document.body
                            )}
                        </div>
                    </div>

                    {/* Center: View Tabs */}
                    <nav className="hidden md:flex items-center bg-neutral-900/50 rounded-lg p-1">
                        {(['Preview', 'Code', 'Integrations', 'APIs'] as ViewMode[]).map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`px-4 py-1.5 text-xs font-medium rounded-md transition-all ${activeTab === tab
                                    ? 'bg-lime-400 text-black'
                                    : 'text-neutral-400 hover:text-white'
                                    }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </nav>

                    {/* Right: Actions */}
                    <div className="flex items-center gap-2">
                        {/* Active Users */}
                        {user && projectId && (
                            <ActiveUsersList
                                projectId={projectId}
                                teamId={currentTeamId}
                                currentUserId={user.id}
                            />
                        )}

                        {/* Undo/Redo */}
                        <div className="hidden sm:flex items-center gap-0.5 bg-neutral-900 rounded-lg p-0.5">
                            <button
                                onClick={handleUndo}
                                disabled={historyIndex <= 0}
                                className="p-1.5 text-neutral-400 hover:text-white hover:bg-white/10 rounded transition-colors disabled:opacity-30"
                                title="Undo"
                            >
                                <Undo size={14} />
                            </button>
                            <button
                                onClick={handleRedo}
                                disabled={historyIndex >= history.length - 1}
                                className="p-1.5 text-neutral-400 hover:text-white hover:bg-white/10 rounded transition-colors disabled:opacity-30"
                                title="Redo"
                            >
                                <Redo size={14} />
                            </button>
                        </div>

                        {/* Tools Dropdown */}
                        <ToolbarDropdown
                            label="Tools"
                            icon={<LayoutGrid size={14} />}
                            items={[
                                { id: 'templates', label: 'Templates', icon: <LayoutGrid size={14} />, onClick: () => setIsGalleryOpen(true) },
                                { id: 'history', label: 'Version History', icon: <History size={14} />, onClick: () => setIsVersionHistoryOpen(true) },
                                { id: 'brand', label: 'Brand Identity', icon: <Palette size={14} />, onClick: () => setIsBrandModalOpen(true) },
                                { id: 'audit', label: 'Run Audit', icon: <ShieldCheck size={14} />, onClick: runAudit },
                                { id: 'deploy', label: 'Deploy', icon: <Rocket size={14} className="text-blue-500" />, onClick: () => setIsDeployModalOpen(true) },
                                ...(user ? [
                                    { id: 'responsive', label: 'Responsive Testing', icon: <Smartphone size={14} />, onClick: () => setIsResponsivePanelOpen(true) },
                                    { id: 'comments', label: showComments ? 'Hide Comments' : 'Comments', icon: <MessageSquare size={14} />, onClick: () => setShowComments(!showComments) },
                                ] : []),
                            ]}
                        />

                        {/* Save Button */}
                        <button
                            onClick={handleSaveProject}
                            disabled={isSaving}
                            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-neutral-900 hover:bg-neutral-800 text-white rounded-lg transition-colors"
                        >
                            <Save size={14} />
                            {isSaving ? 'Saving...' : 'Save'}
                        </button>

                        {/* Export Dropdown */}
                        <ToolbarDropdown
                            label="Export"
                            icon={<Download size={14} />}
                            variant="primary"
                            items={[
                                { id: 'export-code', label: 'Export Code', icon: <Download size={14} />, onClick: () => setIsExportModalOpen(true) },
                                { id: 'design-system', label: 'Design System', icon: <Palette size={14} />, onClick: () => setIsDesignSystemPickerOpen(true) },
                                { id: 'separator-1', label: '', icon: null, onClick: () => { }, disabled: true },
                                { id: 'backend', label: 'Backend Generator', icon: <Server size={14} />, onClick: () => setIsBackendPanelOpen(true) },
                                { id: 'mobile', label: 'Export to Mobile', icon: <Smartphone size={14} />, onClick: () => setIsMobileExportOpen(true) },
                                { id: 'api', label: 'API & Webhooks', icon: <KeyRound size={14} />, onClick: () => setIsAPIManagerOpen(true) },
                            ]}
                        />

                        {/* Upgrade Button */}
                        <button
                            onClick={() => navigate('/pricing')}
                            className="px-3 py-1.5 text-xs font-medium bg-lime-400 hover:bg-lime-300 text-black rounded-lg transition-colors"
                        >
                            Upgrade
                        </button>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <div className="flex h-[calc(100vh-56px)]">
                {/* Sidebar - Clean Style with Gradient */}
                <aside className={`${sidebarOpen ? 'w-[400px]' : 'w-0'} bg-neutral-950 border-r border-white/5 flex flex-col transition-all duration-300 overflow-hidden relative`}>
                    {/* Gradient Background Effects */}
                    <div className="absolute inset-0 overflow-hidden pointer-events-none">
                        {/* Primary gradient orbs */}
                        <div className="absolute -top-20 -left-20 w-[300px] h-[300px] bg-purple-500/10 rounded-full blur-[80px]" />
                        <div className="absolute top-1/4 -right-20 w-[250px] h-[250px] bg-blue-500/8 rounded-full blur-[60px]" />
                        <div className="absolute bottom-1/3 -left-10 w-[200px] h-[200px] bg-indigo-500/10 rounded-full blur-[70px]" />

                        {/* Lime accent */}
                        <div className="absolute bottom-1/4 right-0 w-[150px] h-[150px] bg-lime-400/10 rounded-full blur-[50px] animate-pulse" style={{ animationDuration: '4s' }} />

                        {/* Cyan accent */}
                        <div className="absolute top-2/3 right-1/4 w-[180px] h-[180px] bg-cyan-500/8 rounded-full blur-[60px]" />

                        {/* Bottom gradient fade */}
                        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-neutral-950 via-neutral-950/80 to-transparent" />

                        {/* Subtle mesh overlay */}
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-neutral-900/20 to-neutral-950/40" />
                    </div>

                    {/* Scrollable Content - Stream Output */}
                    <div className="flex-1 overflow-y-auto custom-scrollbar relative z-10 pb-24">
                        {/* Sidebar Header */}
                        <div className="p-4 border-b border-white/5">
                            <h3 className="text-sm font-medium text-white">Chat</h3>
                            <p className="text-xs text-neutral-500 mt-0.5">Build with AI</p>
                        </div>

                        {/* User Input */}
                        {(currentPrompt || currentImage) && (
                            <div className="p-4">
                                <div className="flex gap-3">
                                    <div className="w-6 h-6 rounded-full bg-transparent flex items-center justify-center flex-shrink-0 mt-0.5">
                                        <span className="text-[10px] text-neutral-400">You</span>
                                    </div>
                                    <div className="flex-1">
                                        {currentPrompt && (
                                            <p className="text-sm text-neutral-300">{currentPrompt}</p>
                                        )}
                                        {currentImage && (
                                            <img src={currentImage} alt="Reference" className="mt-2 w-full max-w-[200px] rounded-lg border border-neutral-800" />
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Success */}
                        {streamingMessage && !isGenerating && (
                            <div className="p-4">
                                <div className="flex gap-3">
                                    <div className="w-6 h-6 rounded bg-lime-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                                        <Sparkles size={12} className="text-black" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm text-white">Done! Your app is ready.</p>
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>



                    {/* Chat Input */}

                    {/* Streaming Output Area - FIXED above input */}
                    {isGenerating && (
                        <div className="flex-shrink-0 flex flex-col">
                            <div className="max-h-[300px] overflow-y-auto custom-scrollbar">
                                <StreamingSteps
                                    analysis={analysis}
                                    thinking={thinking}
                                    steps={generatedSteps}
                                    isGenerating={isGenerating}
                                    isCodeVisible={isCodeVisible}
                                    currentImage={currentImage}
                                    currentPrompt={currentPrompt}
                                />
                            </div>

                            <WorkingIndicator
                                isGenerating={isGenerating}
                                status={
                                    isCodeVisible ? "Writing code" :
                                        thinking ? "Thinking" :
                                            analysis ? "Analyzing" :
                                                "Starting"
                                }
                                onStop={handleStop}
                            />
                        </div>
                    )}

                    {/* Chat Input - Fixed at Bottom with Gradient */}
                    <div className="flex-shrink-0 p-4 bg-gradient-to-t from-neutral-950 via-neutral-950/95 to-neutral-900/90 border-t border-white/5 relative">
                        {/* Gradient accent for chat input area */}
                        <div className="absolute inset-0 overflow-hidden pointer-events-none">
                            <div className="absolute bottom-0 left-1/4 w-[200px] h-[100px] bg-lime-400/5 rounded-full blur-[40px]" />
                            <div className="absolute bottom-0 right-1/4 w-[150px] h-[80px] bg-purple-500/5 rounded-full blur-[30px]" />
                        </div>
                        <div className="relative z-10">
                            <ChatInput
                                onGenerate={handleGenerate}
                                onStop={handleStop}
                                loading={isGenerating}
                                image={image}
                                setImage={setImage}
                                model={model}
                                setModel={setModel}
                                prompt={prompt}
                                setPrompt={setPrompt}
                                context={context}
                                onClearContext={() => setContext(null)}
                                framework={framework}
                                setFramework={setFramework}
                            />
                        </div>
                    </div>
                </aside>

                {/* Main Preview Area */}
                <main className="flex-1 bg-black flex flex-col relative overflow-hidden">
                    {activeTab === 'Preview' && (
                        <>
                            {/* Toolbar */}
                            <div className="h-12 border-b border-white/5 flex items-center justify-between px-4 bg-neutral-950/50 backdrop-blur">
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => setSidebarOpen(!sidebarOpen)}
                                        className="p-2 text-neutral-500 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                                        title="Toggle Sidebar"
                                    >
                                        <LayoutGrid size={16} />
                                    </button>

                                    <div className="h-4 w-px bg-white/10" />

                                    {/* Device Selector */}
                                    <div className="flex items-center bg-neutral-900 rounded-lg p-0.5">
                                        <button
                                            onClick={() => setDevice('mobile')}
                                            className={`p-1.5 rounded transition-colors ${device === 'mobile' ? 'bg-white/10 text-white' : 'text-neutral-500 hover:text-neutral-300'}`}
                                            title="Mobile"
                                        >
                                            <Smartphone size={14} />
                                        </button>
                                        <button
                                            onClick={() => setDevice('tablet')}
                                            className={`p-1.5 rounded transition-colors ${device === 'tablet' ? 'bg-white/10 text-white' : 'text-neutral-500 hover:text-neutral-300'}`}
                                            title="Tablet"
                                        >
                                            <Tablet size={14} />
                                        </button>
                                        <button
                                            onClick={() => setDevice('desktop')}
                                            className={`p-1.5 rounded transition-colors ${device === 'desktop' ? 'bg-white/10 text-white' : 'text-neutral-500 hover:text-neutral-300'}`}
                                            title="Desktop"
                                        >
                                            <Monitor size={14} />
                                        </button>
                                    </div>

                                    <div className="h-4 w-px bg-white/10" />

                                    {/* Zoom Controls */}
                                    <div className="flex items-center bg-neutral-900 rounded-lg p-0.5">
                                        <button
                                            onClick={handleZoomOut}
                                            className="p-1.5 text-neutral-500 hover:text-white hover:bg-white/10 rounded transition-colors"
                                            title="Zoom Out"
                                        >
                                            <ZoomOut size={14} />
                                        </button>
                                        <button
                                            onClick={() => setZoom('fit')}
                                            className="px-2 py-0.5 text-xs font-medium text-neutral-400 hover:text-white min-w-[50px] text-center"
                                            title="Reset to Fit"
                                        >
                                            {zoom === 'fit' ? 'Fit' : `${Math.round(currentScale * 100)}%`}
                                        </button>
                                        <button
                                            onClick={handleZoomIn}
                                            className="p-1.5 text-neutral-500 hover:text-white hover:bg-white/10 rounded transition-colors"
                                            title="Zoom In"
                                        >
                                            <ZoomIn size={14} />
                                        </button>
                                        {zoom !== 'fit' && (
                                            <button
                                                onClick={() => setZoom('fit')}
                                                className="p-1.5 text-neutral-500 hover:text-white hover:bg-white/10 rounded transition-colors"
                                                title="Fit to Screen"
                                            >
                                                <Maximize size={14} />
                                            </button>
                                        )}
                                    </div>

                                    <div className="h-4 w-px bg-white/10" />

                                    <button
                                        onClick={handleScreenshot}
                                        className="p-2 text-neutral-500 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                                        title="Screenshot"
                                    >
                                        <Camera size={16} />
                                    </button>
                                </div>

                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => setIsDeployModalOpen(true)}
                                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-lime-400 hover:bg-lime-300 text-black rounded-lg transition-colors"
                                    >
                                        <Play size={12} fill="currentColor" />
                                        Deploy
                                    </button>
                                </div>
                            </div>

                            {/* Preview Canvas */}
                            <div
                                className="flex-1 flex flex-col overflow-hidden bg-black relative"
                                id="preview-container"
                            >
                                {!code ? (
                                    /* Vibecode Style Hero Canvas with Gradient Background */
                                    <div className="flex-1 flex flex-col items-center justify-center p-8 overflow-auto relative">
                                        {/* Gradient Background Effects */}
                                        <div className="absolute inset-0 overflow-hidden">
                                            {/* Primary gradient orbs */}
                                            <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-purple-500/20 rounded-full blur-[120px] animate-pulse" />
                                            <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-blue-500/15 rounded-full blur-[100px]" />
                                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-500/10 rounded-full blur-[150px]" />

                                            {/* Secondary gradient orbs */}
                                            <div className="absolute top-0 right-1/3 w-[400px] h-[400px] bg-cyan-500/10 rounded-full blur-[80px]" />
                                            <div className="absolute bottom-0 left-1/3 w-[350px] h-[350px] bg-violet-500/15 rounded-full blur-[90px]" />

                                            {/* Lime accent */}
                                            <div className="absolute top-1/3 right-1/4 w-[300px] h-[300px] bg-lime-400/10 rounded-full blur-[100px] animate-pulse" style={{ animationDuration: '4s' }} />

                                            {/* Mesh gradient overlay */}
                                            <div className="absolute inset-0 bg-gradient-to-br from-black/50 via-transparent to-black/50" />
                                            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-neutral-900/30 via-transparent to-transparent" />
                                        </div>

                                        <div className="text-center max-w-2xl mx-auto relative z-10">
                                            <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-white via-neutral-200 to-neutral-400 bg-clip-text text-transparent">
                                                {isGenerating ? 'Building your app...' : 'Bring your ideas to life.'}
                                            </h2>
                                            <p className="text-lg text-neutral-400 mb-8">
                                                {isGenerating ? 'Analyzing requirements and generating code...' : 'Describe what you want to build and watch it come to life.'}
                                            </p>

                                            {/* Quick Actions */}
                                            {!isGenerating && (
                                                <div className="flex flex-wrap justify-center gap-3">
                                                    {quickActions.map((action) => {
                                                        const Icon = action.icon;
                                                        return (
                                                            <button
                                                                key={action.id}
                                                                onClick={() => handleQuickAction(action.id)}
                                                                className="flex items-center gap-2 px-4 py-2 bg-neutral-900/80 backdrop-blur-sm hover:bg-neutral-800/90 border border-neutral-800 hover:border-neutral-600 rounded-full text-sm text-neutral-300 hover:text-white transition-all shadow-lg shadow-black/20"
                                                            >
                                                                <Icon size={14} />
                                                                {action.label}
                                                            </button>
                                                        );
                                                    })}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ) : isRefreshing ? (
                                    <div className="flex-1 flex items-center justify-center relative">
                                        {/* Subtle gradient for loading state */}
                                        <div className="absolute inset-0 overflow-hidden">
                                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-lime-500/5 rounded-full blur-[100px]" />
                                        </div>
                                        <div className="flex flex-col items-center relative z-10">
                                            <RefreshCw className="text-lime-400 animate-spin mb-3" size={32} />
                                            <p className="text-neutral-500 text-sm">Refreshing Preview...</p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex-1 flex items-center justify-center p-4 md:p-8 overflow-auto relative">
                                        {/* Preview gradient background */}
                                        <div className="absolute inset-0 overflow-hidden">
                                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-gradient-to-br from-purple-500/5 via-blue-500/5 to-cyan-500/5 rounded-full blur-[120px]" />
                                            <div className="absolute inset-0 bg-gradient-to-br from-black via-neutral-950/95 to-black" />
                                        </div>
                                        <div className="relative z-10 w-full h-full">
                                            <DeviceMockup
                                                device={device}
                                                code={code}
                                                zoom={zoom}
                                                onScaleChange={setCurrentScale}
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>
                        </>
                    )}

                    {activeTab === 'Code' && (
                        <div className="flex-1 overflow-auto p-6 relative">
                            {/* Subtle gradient background for code view */}
                            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[100px]" />
                                <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-purple-500/5 rounded-full blur-[80px]" />
                                <div className="absolute inset-0 bg-gradient-to-b from-black via-neutral-950/50 to-black" />
                            </div>
                            <div className="max-w-5xl mx-auto relative z-10">
                                <div className="bg-neutral-900 rounded-xl border border-neutral-800 overflow-hidden">
                                    <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-800">
                                        <div className="flex items-center gap-3">
                                            <div className="flex gap-1.5">
                                                <div className="w-3 h-3 rounded-full bg-red-500" />
                                                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                                                <div className="w-3 h-3 rounded-full bg-green-500" />
                                            </div>
                                            <span className="text-xs text-neutral-400 font-mono">index.html</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={handleAddToChat}
                                                className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-lg transition-colors"
                                            >
                                                <FileCode size={14} />
                                                Add to Chat
                                            </button>
                                            <button
                                                onClick={() => {
                                                    navigator.clipboard.writeText(code);
                                                    showToast('Code copied!');
                                                }}
                                                className="p-1.5 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-lg transition-colors"
                                            >
                                                <Copy size={14} />
                                            </button>
                                        </div>
                                    </div>
                                    <div className="h-[calc(100vh-220px)] overflow-auto">
                                        <Editor
                                            value={code}
                                            onValueChange={code => updateCode(code)}
                                            highlight={code => Prism.highlight(code, Prism.languages.markup, 'markup')}
                                            padding={24}
                                            className="font-mono text-sm"
                                            style={{
                                                fontFamily: '"JetBrains Mono", monospace',
                                                backgroundColor: 'transparent',
                                                color: '#e4e4e7'
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'Integrations' && (
                        <div className="flex-1 overflow-auto p-8 relative">
                            {/* Gradient background for Integrations */}
                            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                                <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-indigo-500/5 rounded-full blur-[120px]" />
                                <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-[100px]" />
                                <div className="absolute inset-0 bg-gradient-to-br from-black via-neutral-950/80 to-black" />
                            </div>
                            <div className="max-w-5xl mx-auto relative z-10">
                                <h1 className="text-2xl font-semibold mb-2">Integrations</h1>
                                <p className="text-neutral-500 mb-8">Connect your favorite tools to NOIR.</p>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {integrations.map((app) => (
                                        <div key={app.name} className="p-4 bg-neutral-900 border border-neutral-800 rounded-xl hover:border-neutral-700 transition-colors flex items-center gap-4">
                                            <div className="w-12 h-12 bg-white rounded-lg p-2 flex items-center justify-center shrink-0">
                                                <img src={app.icon} alt={app.name} className="w-full h-full object-contain" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h3 className="font-medium text-white">{app.name}</h3>
                                                <p className="text-xs text-neutral-500">{app.connected ? 'Connected' : 'Not connected'}</p>
                                            </div>
                                            <button
                                                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${app.connected
                                                    ? 'bg-neutral-800 text-neutral-400 hover:text-white'
                                                    : 'bg-lime-400 text-black hover:bg-lime-300'
                                                    }`}
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
                        <div className="flex-1 overflow-auto p-8 relative">
                            {/* Gradient background for APIs */}
                            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                                <div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-cyan-500/5 rounded-full blur-[100px]" />
                                <div className="absolute bottom-1/4 left-0 w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-[80px]" />
                                <div className="absolute inset-0 bg-gradient-to-br from-black via-neutral-950/80 to-black" />
                            </div>
                            <div className="max-w-4xl mx-auto relative z-10">
                                <div className="flex items-center justify-between mb-8">
                                    <div>
                                        <h1 className="text-2xl font-semibold mb-1">API Keys</h1>
                                        <p className="text-neutral-500">Manage your API keys and access tokens.</p>
                                    </div>
                                    <button className="flex items-center gap-2 px-4 py-2 bg-lime-400 text-black rounded-lg font-medium hover:bg-lime-300 transition-colors">
                                        <Plus size={16} />
                                        Create Key
                                    </button>
                                </div>

                                <div className="bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden">
                                    <table className="w-full text-left">
                                        <thead>
                                            <tr className="border-b border-neutral-800">
                                                <th className="p-4 text-xs font-medium text-neutral-500 uppercase">Name</th>
                                                <th className="p-4 text-xs font-medium text-neutral-500 uppercase">Key</th>
                                                <th className="p-4 text-xs font-medium text-neutral-500 uppercase">Created</th>
                                                <th className="p-4 text-xs font-medium text-neutral-500 uppercase">Last Used</th>
                                                <th className="p-4 text-xs font-medium text-neutral-500 uppercase"></th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-neutral-800">
                                            {apiKeys.map((key) => (
                                                <tr key={key.key} className="hover:bg-neutral-800/50 transition-colors">
                                                    <td className="p-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-8 h-8 rounded-lg bg-neutral-800 flex items-center justify-center text-neutral-400">
                                                                <Key size={14} />
                                                            </div>
                                                            <span className="font-medium text-white">{key.name}</span>
                                                        </div>
                                                    </td>
                                                    <td className="p-4 font-mono text-xs text-neutral-500">{key.key}</td>
                                                    <td className="p-4 text-sm text-neutral-500">{key.created}</td>
                                                    <td className="p-4 text-sm text-neutral-500">{key.lastUsed}</td>
                                                    <td className="p-4">
                                                        <button className="p-2 text-neutral-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors">
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

                {/* Comments Sidebar */}
                {
                    showComments && user && projectId && (
                        <div className="w-[320px] bg-neutral-950 border-l border-white/5 flex flex-col">
                            <div className="p-4 border-b border-white/5">
                                <h3 className="font-medium text-white">Comments</h3>
                            </div>
                            <div className="flex-1 overflow-auto">
                                <CommentThread
                                    comments={comments}
                                    currentUserId={user.id}
                                    onAddComment={handleAddComment}
                                    onResolve={handleResolveComment}
                                    onDelete={handleDeleteComment}
                                />
                            </div>
                        </div>
                    )
                }
            </div >

            {/* Modals */}
            < ExportModal isOpen={isExportModalOpen} onClose={() => setIsExportModalOpen(false)} code={code} projectName={previewAppName} />
            <ComponentGallery isOpen={isGalleryOpen} onClose={() => setIsGalleryOpen(false)} onSelectTemplate={handleTemplateSelect} />
            <VersionHistoryModal isOpen={isVersionHistoryOpen} onClose={() => setIsVersionHistoryOpen(false)} projectId={projectId || ''} currentCode={code} onRevert={handleRevertCode} />
            <ResponsiveTestingPanel isOpen={isResponsivePanelOpen} onClose={() => setIsResponsivePanelOpen(false)} previewContent={code} />

            {
                user && projectId && (
                    <ShareProjectModal isOpen={isShareModalOpen} onClose={() => setIsShareModalOpen(false)} projectId={projectId} projectName={previewAppName} />
                )
            }

            <DesignSystemPicker isOpen={isDesignSystemPickerOpen} onClose={() => setIsDesignSystemPickerOpen(false)} currentLibrary={selectedDesignSystem} onSelect={(library) => { setSelectedDesignSystem(library); showToast(`Design system: ${library}`); }} />

            {
                currentTeamId && (
                    <TeamSettingsModal isOpen={isTeamSettingsOpen} onClose={() => setIsTeamSettingsOpen(false)} team={teams.find(t => t.id === currentTeamId)!} members={teamMembers} onUpdate={() => { if (currentTeamId) teamService.getTeamMembers(currentTeamId).then(setTeamMembers); }} />
                )
            }

            <BackendGeneratorPanel isOpen={isBackendPanelOpen} onClose={() => setIsBackendPanelOpen(false)} projectName={previewAppName} />
            <MobileExportModal isOpen={isMobileExportOpen} onClose={() => setIsMobileExportOpen(false)} htmlContent={code} projectName={previewAppName} />
            <APIManager isOpen={isAPIManagerOpen} onClose={() => setIsAPIManagerOpen(false)} />
            <BrandSettingsModal isOpen={isBrandModalOpen} onClose={() => setIsBrandModalOpen(false)} projectId={projectId} currentIdentity={brandIdentity} onSave={setBrandIdentity} />
            <AuditorPanel isOpen={isAuditorOpen} onClose={() => setIsAuditorOpen(false)} results={auditResults} />
            <DeploymentModal isOpen={isDeployModalOpen} onClose={() => setIsDeployModalOpen(false)} code={code} projectName={previewAppName} />
        </div >
    );
};
