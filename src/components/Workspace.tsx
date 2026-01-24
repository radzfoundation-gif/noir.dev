import { useState } from 'react';
import { Eye, Code, Smartphone, Tablet, Monitor, Download, RotateCw, Copy } from 'lucide-react';
import clsx from 'clsx';

interface WorkspaceProps {
    code: string;
    loading: boolean;
}

export const Workspace: React.FC<WorkspaceProps> = ({ code, loading }) => {
    const [activeView, setActiveView] = useState<'preview' | 'code'>('preview');
    const [viewport, setViewport] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');

    const getViewportWidth = () => {
        switch (viewport) {
            case 'mobile': return '375px';
            case 'tablet': return '768px';
            default: return '100%';
        }
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(code);
    };

    const handleDownload = () => {
        const element = document.createElement("a");
        const file = new Blob([code], { type: 'text/html' });
        element.href = URL.createObjectURL(file);
        element.download = "nexus-output.html";
        document.body.appendChild(element);
        element.click();
    };

    // Simple line number and highlighting simulation
    const renderCode = (text: string) => {
        if (!text) return <div className="text-zinc-500 italic p-4">No code generated yet...</div>;

        return text.split('\n').map((line, i) => (
            <div key={i} className="code-line relative group hover:bg-white/5 px-4">
                <span className="token-plain">{line || ' '}</span>
            </div>
        ));
    };

    return (
        <div className="flex flex-col h-full bg-zinc-950">
            {/* Workspace Toolbar */}
            <div className="h-14 border-b border-white/5 flex items-center justify-between px-4 bg-black/50 backdrop-blur-sm">

                {/* Left: View Toggles */}
                <div className="flex items-center bg-zinc-900 p-1 rounded-lg border border-white/5">
                    <button
                        onClick={() => setActiveView('preview')}
                        className={clsx(
                            "flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-all",
                            activeView === 'preview' ? "bg-zinc-700 text-white shadow-sm" : "text-zinc-400 hover:text-zinc-200"
                        )}
                    >
                        <Eye size={14} /> Preview
                    </button>
                    <button
                        onClick={() => setActiveView('code')}
                        className={clsx(
                            "flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-all",
                            activeView === 'code' ? "bg-zinc-700 text-white shadow-sm" : "text-zinc-400 hover:text-zinc-200"
                        )}
                    >
                        <Code size={14} /> Code
                    </button>
                </div>

                {/* Center: Device Toggles (Only for Preview) */}
                {activeView === 'preview' && (
                    <div className="flex items-center gap-4 text-zinc-500">
                        <button onClick={() => setViewport('mobile')} className={clsx("hover:text-lime-400 transition-colors", viewport === 'mobile' && "text-lime-400")}><Smartphone size={18} /></button>
                        <button onClick={() => setViewport('tablet')} className={clsx("hover:text-lime-400 transition-colors", viewport === 'tablet' && "text-lime-400")}><Tablet size={18} /></button>
                        <button onClick={() => setViewport('desktop')} className={clsx("hover:text-lime-400 transition-colors", viewport === 'desktop' && "text-lime-400")}><Monitor size={18} /></button>
                    </div>
                )}

                {/* Right: Actions */}
                <div className="flex items-center gap-2">
                    <button onClick={handleCopy} className="p-2 text-zinc-400 hover:text-white transition-colors" title="Copy Code">
                        <Copy size={16} />
                    </button>
                    <button onClick={handleDownload} className="flex items-center gap-2 px-3 py-1.5 bg-lime-500 hover:bg-lime-400 text-black text-xs font-bold rounded-lg transition-colors">
                        <Download size={14} /> Export
                    </button>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 overflow-hidden relative flex items-center justify-center bg-zinc-900/50">
                {loading && (
                    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                        <div className="flex flex-col items-center gap-4">
                            <RotateCw className="animate-spin text-lime-400" size={32} />
                            <span className="text-lime-400 font-mono text-sm">Generating application...</span>
                        </div>
                    </div>
                )}

                {activeView === 'preview' ? (
                    <div
                        className="transition-all duration-500 ease-in-out border border-white/5 shadow-2xl bg-white overflow-hidden relative"
                        style={{
                            width: getViewportWidth(),
                            height: viewport === 'desktop' ? '100%' : '85%',
                            borderRadius: viewport === 'desktop' ? '0' : '16px'
                        }}
                    >
                        {code ? (
                            <iframe
                                srcDoc={code}
                                title="Preview"
                                className="w-full h-full border-none"
                                sandbox="allow-scripts allow-modals"
                            />
                        ) : (
                            <div className="flex items-center justify-center h-full bg-zinc-950">
                                <div className="text-center text-zinc-500">
                                    <Monitor size={48} className="mx-auto mb-4 opacity-20" />
                                    <p>Ready to build</p>
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="w-full h-full overflow-auto bg-[#0a0a0a] font-mono text-xs leading-6">
                        {renderCode(code)}
                    </div>
                )}
            </div>
        </div>
    );
};
