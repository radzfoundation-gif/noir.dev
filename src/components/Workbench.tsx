import { useState } from 'react';
import { Eye, Copy, Download, Code, Palette, PenSquare, LockKeyhole, RotateCw } from 'lucide-react';
import clsx from 'clsx';

interface WorkbenchProps {
    code: string;
    loading: boolean;
}

export const Workbench: React.FC<WorkbenchProps> = ({ code, loading }) => {
    const [activeTab, setActiveTab] = useState<'html' | 'css'>('html');

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
        if (!text) return <div className="text-zinc-500 italic">No code generated yet...</div>;

        return text.split('\n').map((line, i) => (
            <div key={i} className="code-line relative group hover:bg-white/5">
                <span className="token-plain">{line || ' '}</span>
            </div>
        ));
    };

    return (
        <section className="py-8 px-4 md:px-6 h-auto">
            <div className="max-w-7xl mx-auto">
                {/* Workbench Header */}
                <div className="flex flex-col md:flex-row items-center justify-between mb-4 gap-4">
                    <div className="flex items-center gap-3">
                        <h2 className="text-sm font-medium text-white">Workbench</h2>
                        <div className="h-4 w-[1px] bg-white/10"></div>
                        <span className="text-xs text-zinc-500 font-mono">landing-page-v1.html</span>
                        <span className={clsx(
                            "px-2 py-0.5 rounded text-[10px] border transition-all",
                            code ? "bg-lime-500/10 text-lime-400 border-lime-500/20" : "bg-zinc-500/10 text-zinc-500 border-zinc-500/20"
                        )}>
                            {loading ? 'Generating...' : code ? 'Generated' : 'Idle'}
                        </span>
                    </div>

                    <div className="flex items-center gap-2">
                        <button className="px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-xs font-medium border border-white/5 transition-colors flex items-center gap-2">
                            <Eye size={14} /> Preview
                        </button>
                        <button
                            onClick={handleCopy}
                            className="px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-xs font-medium border border-white/5 transition-colors flex items-center gap-2"
                        >
                            <Copy size={14} /> Copy
                        </button>
                        <button
                            onClick={handleDownload}
                            className="px-3 py-1.5 rounded-lg bg-lime-500 hover:bg-lime-400 text-black text-xs font-semibold transition-colors flex items-center gap-2 shadow-lg shadow-lime-900/20"
                        >
                            <Download size={14} /> Download
                        </button>
                    </div>
                </div>

                {/* Workbench Container */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 border border-white/10 rounded-xl overflow-hidden bg-black shadow-2xl h-[600px]">

                    {/* Code Editor Column */}
                    <div className="flex flex-col border-b lg:border-b-0 lg:border-r border-white/5 relative">
                        {/* Editor Tabs */}
                        <div className="flex items-center px-4 border-b border-white/5 bg-zinc-950/50">
                            <button
                                onClick={() => setActiveTab('html')}
                                className={clsx(
                                    "px-4 py-3 text-xs flex items-center gap-2 transition-colors border-b-2 font-medium",
                                    activeTab === 'html' ? "text-lime-400 border-lime-500 bg-white/[0.02]" : "text-zinc-500 hover:text-zinc-300 border-transparent"
                                )}
                            >
                                <Code size={14} /> index.html
                            </button>
                            <button
                                onClick={() => setActiveTab('css')}
                                className={clsx(
                                    "px-4 py-3 text-xs flex items-center gap-2 transition-colors border-b-2 font-medium",
                                    activeTab === 'css' ? "text-lime-400 border-lime-500 bg-white/[0.02]" : "text-zinc-500 hover:text-zinc-300 border-transparent"
                                )}
                            >
                                <Palette size={14} /> styles.css
                            </button>
                        </div>

                        {/* Editor Content */}
                        <div className="flex-1 overflow-y-auto font-mono text-[11px] p-4 leading-6 bg-[#0a0a0a]">
                            <div className="line-numbers text-zinc-600">
                                {renderCode(code)}
                            </div>
                        </div>

                        {/* Floating Edit Action (Visual only for now) */}
                        <div className="absolute bottom-6 right-6">
                            <button className="bg-lime-500 hover:bg-lime-400 text-black rounded-full w-12 h-12 flex items-center justify-center shadow-lg transition-transform hover:scale-105 shadow-lime-500/20">
                                <PenSquare size={24} strokeWidth={1.5} />
                            </button>
                        </div>
                    </div>

                    {/* Preview Column */}
                    <div className="bg-white relative flex flex-col">
                        {/* Browser Bar */}
                        <div className="h-10 bg-zinc-100 border-b border-zinc-200 flex items-center px-4 gap-2">
                            <div className="flex gap-1.5">
                                <div className="w-2.5 h-2.5 rounded-full bg-zinc-300"></div>
                                <div className="w-2.5 h-2.5 rounded-full bg-zinc-300"></div>
                                <div className="w-2.5 h-2.5 rounded-full bg-zinc-300"></div>
                            </div>
                            <div className="flex-1 text-center">
                                <div className="bg-white rounded-md mx-auto w-1/2 h-6 flex items-center justify-center text-[10px] text-zinc-400 border border-zinc-200 shadow-sm">
                                    <LockKeyhole size={10} className="mr-1" /> localhost:3000
                                </div>
                            </div>
                            <RotateCw size={14} className="text-zinc-400 cursor-pointer hover:text-zinc-600" />
                        </div>

                        {/* Rendered Content */}
                        <div className="flex-1 bg-zinc-50 overflow-y-auto">
                            {code ? (
                                <iframe
                                    srcDoc={code}
                                    title="Preview"
                                    className="w-full h-full border-none"
                                    sandbox="allow-scripts allow-modals"
                                />
                            ) : (
                                <div className="flex items-center justify-center h-full">
                                    <div className="text-center">
                                        <div className="w-16 h-16 bg-zinc-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                                            <Code size={30} className="text-zinc-400" />
                                        </div>
                                        <p className="text-zinc-400 text-sm">Preview will appear here</p>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Resizer Handle (Visual) */}
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 bg-black rounded-full border border-white/10 flex items-center justify-center cursor-col-resize z-10 lg:flex hidden">
                            <Code size={12} className="text-white" />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};
