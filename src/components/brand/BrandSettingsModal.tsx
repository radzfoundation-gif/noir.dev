import React, { useState, useEffect } from 'react';
import { X, Save, Palette, Type, Layout } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { brandService, defaultBrandIdentity, type BrandIdentity } from '../../lib/brandService';

interface BrandSettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
    projectId: string | null;
    currentIdentity?: BrandIdentity;
    onSave: (identity: BrandIdentity) => void;
}

export const BrandSettingsModal: React.FC<BrandSettingsModalProps> = ({ 
    isOpen, onClose, projectId, currentIdentity, onSave 
}) => {
    const [identity, setIdentity] = useState<BrandIdentity>(currentIdentity || defaultBrandIdentity);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (currentIdentity) setIdentity(currentIdentity);
    }, [currentIdentity]);

    const handleSave = async () => {
        if (!projectId) return;
        setIsSaving(true);
        try {
            await brandService.updateBrandIdentity(projectId, identity);
            onSave(identity);
            onClose();
        } catch (error) {
            console.error("Failed to save brand identity", error);
        } finally {
            setIsSaving(false);
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                <motion.div 
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }} 
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                />
                
                <motion.div 
                    initial={{ scale: 0.95, opacity: 0 }} 
                    animate={{ scale: 1, opacity: 1 }} 
                    exit={{ scale: 0.95, opacity: 0 }}
                    className="relative w-full max-w-2xl bg-[#121212] border border-[#262626] rounded-xl shadow-2xl overflow-hidden"
                >
                    {/* Header */}
                    <div className="flex items-center justify-between px-6 py-4 border-b border-[#262626] bg-[#0a0a0a]">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-primary/10 rounded-lg">
                                <Palette size={20} className="text-primary" />
                            </div>
                            <div>
                                <h2 className="text-lg font-bold text-white">Brand Identity</h2>
                                <p className="text-xs text-neutral-400">Define your project's visual DNA</p>
                            </div>
                        </div>
                        <button onClick={onClose} className="text-neutral-500 hover:text-white transition-colors">
                            <X size={20} />
                        </button>
                    </div>

                    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8 max-h-[70vh] overflow-y-auto custom-scrollbar">
                        
                        {/* Left Column: Controls */}
                        <div className="space-y-6">
                            
                            {/* Colors */}
                            <div className="space-y-3">
                                <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Color Palette</label>
                                <div className="grid grid-cols-1 gap-3">
                                    <div className="flex items-center gap-3 bg-[#171717] p-2 rounded-lg border border-[#262626]">
                                        <input 
                                            type="color" 
                                            value={identity.primaryColor}
                                            onChange={(e) => setIdentity({...identity, primaryColor: e.target.value})}
                                            className="w-10 h-10 rounded bg-transparent border-none cursor-pointer"
                                        />
                                        <div className="flex-1">
                                            <p className="text-sm font-medium text-white">Primary Color</p>
                                            <p className="text-xs text-neutral-500">Buttons, Links, Highlights</p>
                                        </div>
                                        <span className="text-xs font-mono text-neutral-400">{identity.primaryColor}</span>
                                    </div>
                                    <div className="flex items-center gap-3 bg-[#171717] p-2 rounded-lg border border-[#262626]">
                                        <input 
                                            type="color" 
                                            value={identity.backgroundColor}
                                            onChange={(e) => setIdentity({...identity, backgroundColor: e.target.value})}
                                            className="w-10 h-10 rounded bg-transparent border-none cursor-pointer"
                                        />
                                        <div className="flex-1">
                                            <p className="text-sm font-medium text-white">Background</p>
                                            <p className="text-xs text-neutral-500">Page Background</p>
                                        </div>
                                        <span className="text-xs font-mono text-neutral-400">{identity.backgroundColor}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Typography */}
                            <div className="space-y-3">
                                <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider flex items-center gap-2">
                                    <Type size={14} /> Typography
                                </label>
                                <select 
                                    value={identity.fontFamily}
                                    onChange={(e) => setIdentity({...identity, fontFamily: e.target.value})}
                                    className="w-full bg-[#171717] text-white text-sm border border-[#262626] rounded-lg p-3 outline-none focus:border-primary transition-colors"
                                >
                                    <option value="Inter">Inter (Clean)</option>
                                    <option value="Roboto">Roboto (Android-like)</option>
                                    <option value="Playfair Display">Playfair Display (Serif)</option>
                                    <option value="Space Grotesk">Space Grotesk (Modern)</option>
                                    <option value="Fira Code">Fira Code (Monospace)</option>
                                </select>
                            </div>

                            {/* Radius */}
                            <div className="space-y-3">
                                <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider flex items-center gap-2">
                                    <Layout size={14} /> Border Radius
                                </label>
                                <div className="grid grid-cols-5 gap-2">
                                    {(['none', 'sm', 'md', 'lg', 'full'] as const).map((r) => (
                                        <button
                                            key={r}
                                            onClick={() => setIdentity({...identity, borderRadius: r})}
                                            className={`p-2 rounded-lg border text-xs font-medium transition-all ${identity.borderRadius === r ? 'bg-primary text-black border-primary' : 'bg-[#171717] text-neutral-400 border-[#262626] hover:border-neutral-600'}`}
                                        >
                                            {r}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            
                            {/* Visual Style */}
                             <div className="space-y-3">
                                <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Visual Style</label>
                                <div className="grid grid-cols-2 gap-3">
                                    {(['minimal', 'glassmorphism', 'brutalism', 'corporate'] as const).map((style) => (
                                        <button
                                            key={style}
                                            onClick={() => setIdentity({...identity, styleMode: style})}
                                            className={`p-3 rounded-lg border text-left transition-all ${identity.styleMode === style ? 'bg-primary/10 border-primary text-white' : 'bg-[#171717] border-[#262626] text-neutral-400 hover:border-neutral-600'}`}
                                        >
                                            <span className="block text-sm font-semibold capitalize mb-1">{style}</span>
                                            <span className="block text-[10px] opacity-70">
                                                {style === 'minimal' && 'Simple & Clean'}
                                                {style === 'glassmorphism' && 'Blur & Transparency'}
                                                {style === 'brutalism' && 'Bold & Raw'}
                                                {style === 'corporate' && 'Professional'}
                                            </span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Right Column: Live Preview */}
                        <div className="bg-[#0a0a0a] rounded-xl border border-[#262626] overflow-hidden flex flex-col">
                            <div className="p-3 border-b border-[#262626] bg-[#121212] flex items-center justify-between">
                                <span className="text-xs font-mono text-neutral-500">Preview</span>
                                <div className="flex gap-1.5">
                                    <div className="w-2.5 h-2.5 rounded-full bg-red-500/20"></div>
                                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/20"></div>
                                    <div className="w-2.5 h-2.5 rounded-full bg-green-500/20"></div>
                                </div>
                            </div>
                            <div 
                                className="flex-1 p-6 flex flex-col items-center justify-center gap-6"
                                style={{ 
                                    backgroundColor: identity.backgroundColor,
                                    fontFamily: identity.fontFamily 
                                }}
                            >
                                {/* Card Preview */}
                                <div 
                                    className="w-full max-w-xs p-5 relative overflow-hidden transition-all duration-300"
                                    style={{
                                        backgroundColor: identity.styleMode === 'glassmorphism' ? 'rgba(255,255,255,0.05)' : identity.styleMode === 'brutalism' ? '#fff' : '#1e1e1e',
                                        backdropFilter: identity.styleMode === 'glassmorphism' ? 'blur(10px)' : 'none',
                                        border: identity.styleMode === 'brutalism' ? '2px solid black' : '1px solid rgba(255,255,255,0.1)',
                                        boxShadow: identity.styleMode === 'brutalism' ? '4px 4px 0px 0px #000' : 'none',
                                        borderRadius: identity.borderRadius === 'full' ? '24px' : identity.borderRadius === 'lg' ? '16px' : identity.borderRadius === 'md' ? '8px' : identity.borderRadius === 'sm' ? '4px' : '0px',
                                        color: identity.styleMode === 'brutalism' ? '#000' : '#fff'
                                    }}
                                >
                                    <div className="h-2 w-16 mb-4 rounded-full" style={{ backgroundColor: identity.primaryColor }}></div>
                                    <h3 className="text-lg font-bold mb-2">Hello World</h3>
                                    <p className="text-sm opacity-70 mb-4">This is how your components will look.</p>
                                    
                                    <button 
                                        className="w-full py-2 px-4 text-sm font-semibold transition-transform active:scale-95"
                                        style={{
                                            backgroundColor: identity.primaryColor,
                                            color: identity.styleMode === 'brutalism' ? '#000' : '#000',
                                            borderRadius: identity.borderRadius === 'full' ? '9999px' : identity.borderRadius === 'lg' ? '8px' : identity.borderRadius === 'md' ? '6px' : identity.borderRadius === 'sm' ? '4px' : '0px',
                                            boxShadow: identity.styleMode === 'brutalism' ? '2px 2px 0px 0px #000' : 'none',
                                            border: identity.styleMode === 'brutalism' ? '1px solid black' : 'none'
                                        }}
                                    >
                                        Click Me
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="p-4 border-t border-[#262626] bg-[#0a0a0a] flex justify-end gap-3">
                        <button 
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium text-neutral-400 hover:text-white transition-colors"
                        >
                            Cancel
                        </button>
                        <button 
                            onClick={handleSave}
                            disabled={!projectId || isSaving}
                            className="flex items-center gap-2 px-6 py-2 bg-primary text-black text-sm font-bold rounded-lg hover:bg-opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSaving ? <span className="animate-spin">⌛</span> : <Save size={16} />}
                            Save Identity
                        </button>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};
