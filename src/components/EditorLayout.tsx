import React from 'react';
import { Settings, History, MessageSquare, Plus, Code2 } from 'lucide-react';
import { NoirLogo } from './NoirLogo';

interface EditorLayoutProps {
    sidebarContent: React.ReactNode;
    sidebarBottom: React.ReactNode;
    workspaceContent: React.ReactNode;
}

export const EditorLayout: React.FC<EditorLayoutProps> = ({ sidebarContent, sidebarBottom, workspaceContent }) => {
    return (
        <div className="flex h-screen w-full overflow-hidden bg-black text-zinc-300">
            {/* Left Sidebar */}
            <aside className="w-[400px] flex flex-col border-r border-zinc-900 bg-black shrink-0 relative z-20">
                {/* Sidebar Header */}
                <div className="h-14 flex items-center justify-between px-4 border-b border-zinc-900">
                    <div className="flex items-center gap-2 text-white font-bold">
                        <NoirLogo className="size-8" />
                        <span>Noir Editor</span>
                    </div>
                    <button className="text-zinc-500 hover:text-white transition-colors">
                        <Settings size={16} />
                    </button>
                </div>

                {/* Sidebar Content (Scrollable) */}
                <div className="flex-1 overflow-y-auto min-h-0 custom-scrollbar">
                    {/* Sample History / Navigation */}
                    <div className="p-4 space-y-6">
                        {/* New Chat Button */}
                        <button className="w-full flex items-center justify-between p-3 rounded-lg bg-zinc-900/50 border border-zinc-800 text-sm font-medium hover:bg-zinc-900 transition-colors group">
                            <span className="flex items-center gap-2">
                                <Plus size={16} className="text-lime-400" /> New Project
                            </span>
                            <span className="bg-zinc-800 text-[10px] px-1.5 py-0.5 rounded text-zinc-400 group-hover:text-zinc-200">Ctrl+N</span>
                        </button>

                        {/* Recent History Section */}
                        <div>
                            <div className="flex items-center gap-2 text-xs font-semibold text-zinc-500 mb-3 uppercase tracking-wider pl-1">
                                <History size={12} /> Recent
                            </div>
                            <div className="space-y-1">
                                <div className="p-2 rounded-md hover:bg-zinc-900 cursor-pointer text-sm text-zinc-300 flex items-center gap-2 transition-colors">
                                    <MessageSquare size={14} className="text-zinc-600" />
                                    Landing Page v1
                                </div>
                                <div className="p-2 rounded-md bg-zinc-900/50 border border-zinc-800 cursor-pointer text-sm text-white flex items-center gap-2 font-medium">
                                    <MessageSquare size={14} className="text-lime-400" />
                                    Waitlist Design
                                </div>
                                <div className="p-2 rounded-md hover:bg-zinc-900 cursor-pointer text-sm text-zinc-300 flex items-center gap-2 transition-colors">
                                    <MessageSquare size={14} className="text-zinc-600" />
                                    Dashboard Auth
                                </div>
                            </div>
                        </div>

                        {/* Specifications List (Dynamic Content Slot) */}
                        <div>
                            <div className="flex items-center gap-2 text-xs font-semibold text-zinc-500 mb-3 uppercase tracking-wider pl-1">
                                <Code2 size={12} /> Specs
                            </div>
                            <div className="space-y-4">{sidebarContent}</div>
                        </div>
                    </div>
                </div>

                {/* Sidebar Bottom (Input) */}
                <div className="p-4 bg-black border-t border-zinc-900 z-10">
                    {sidebarBottom}
                </div>
            </aside>

            {/* Right Workspace */}
            <main className="flex-1 flex flex-col min-w-0 bg-base-100">
                {workspaceContent}
            </main>
        </div>
    );
};
