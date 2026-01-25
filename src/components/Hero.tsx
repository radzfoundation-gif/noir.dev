import { Wand2, Image as ImageIcon, ArrowRight, Clock, ShieldCheck as ShieldIcon } from 'lucide-react';
import { ModelSelector } from './ModelSelector';
import { ImageUpload } from './ImageUpload';
import { FlipWords } from './FlipWords';

interface HeroProps {
    onGenerate: () => void;
    loading: boolean;
    image: string | null;
    setImage: (img: string | null) => void;
    model: string;
    setModel: (m: string) => void;
    prompt: string;
    setPrompt: (p: string) => void;
}

export const Hero: React.FC<HeroProps> = ({
    onGenerate,
    loading,
    image,
    setImage,
    model,
    setModel,
    prompt,
    setPrompt
}) => {
    return (
        <section className="relative pt-32 pb-12 md:pt-40 overflow-hidden">
            {/* Background Gradients */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-lime-500/10 blur-[120px] rounded-full pointer-events-none opacity-30"></div>

            <div className="max-w-4xl mx-auto px-6 relative z-10 text-center">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-lime-500/30 bg-lime-500/10 text-lime-300 text-xs font-semibold tracking-wide mb-8">
                    <Wand2 size={12} />
                    V 2.0 Now Supporting Gemini 3 & Claude 4.5
                </div>

                <h1 className="text-4xl md:text-6xl font-bold text-white tracking-tight mb-6 leading-[1.1]">
                    Turn <FlipWords words={["Screenshots", "Wireframes", "Mockups", "Designs"]} className="text-white" /> into <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-lime-300 to-emerald-300">Clean Code</span>
                </h1>

                <p className="text-lg text-zinc-400 max-w-xl mx-auto mb-10 leading-relaxed font-light">
                    Upload a design mock or screenshot. Our AI architect builds the frontend for you instantly.
                </p>

                {/* Main Input Area */}
                <div className="w-full max-w-2xl mx-auto">
                    <div className="bg-black border border-zinc-800 rounded-xl p-2.5 shadow-lg relative group focus-within:border-lime-500/50 focus-within:shadow-[0_0_10px_rgba(163,230,53,0.05)] transition-all duration-300">

                        {/* Prompt Input */}
                        <div className="relative">
                            <textarea
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                                placeholder="Paste a design screenshot and watch it come to life..."
                                className="w-full bg-transparent text-white text-sm font-light placeholder:text-zinc-600 resize-none h-12 focus:outline-none p-1.5 leading-relaxed"
                            />

                            {/* Image Preview Overlay */}
                            {image && (
                                <div className="absolute top-0 right-0 w-20 h-20 rounded-lg overflow-hidden border border-lime-500/30 group/img shadow-lg shadow-lime-900/20">
                                    <img src={image} alt="Preview" className="w-full h-full object-cover" />
                                    <button
                                        onClick={() => setImage(null)}
                                        className="absolute top-1 right-1 bg-black/50 p-0.5 rounded-full opacity-0 group-hover/img:opacity-100 transition-opacity hover:bg-black/80"
                                    >
                                        <ArrowRight size={10} className="rotate-45 text-white" />
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Bottom Toolbar */}
                        <div className="flex items-center justify-between mt-4 md:mt-6">
                            <div className="flex items-center gap-2">
                                {/* Prompt Builder */}
                                <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-zinc-800 bg-zinc-900/50 hover:bg-zinc-800 hover:border-lime-500/30 text-xs font-medium text-zinc-400 hover:text-white transition-all">
                                    <Wand2 size={12} className="text-lime-400" />
                                    <span>Prompt Builder</span>
                                </button>

                                {/* Model Selector */}
                                <ModelSelector selectedId={model} onSelect={setModel} variant="pill" />

                                <div className="h-4 w-[1px] bg-zinc-800 mx-1"></div>

                                {/* Actions */}
                                <button
                                    className="p-2 text-zinc-500 hover:text-lime-400 transition-colors rounded-full hover:bg-zinc-900"
                                    title="Add Context (@)"
                                >
                                    <span className="text-sm font-bold">@</span>
                                </button>

                                <button
                                    onClick={() => document.getElementById('hero-image-upload')?.click()}
                                    className="p-2 text-zinc-500 hover:text-lime-400 transition-colors rounded-full hover:bg-zinc-900"
                                    title="Attach Image"
                                >
                                    <ImageIcon size={16} strokeWidth={1.5} />
                                </button>

                                {/* Hidden Input */}
                                <div className="hidden">
                                    <ImageUpload onImageSelect={setImage} inputId="hero-image-upload" />
                                </div>
                            </div>

                            {/* Generate Button (Icon Only when small, full when large) */}
                            <button
                                onClick={onGenerate}
                                disabled={(!image && !prompt.trim()) || loading}
                                className="w-8 h-8 md:w-auto md:h-auto md:px-4 md:py-2 rounded-lg md:rounded-full bg-zinc-100 hover:bg-white text-black text-xs font-bold transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-white/5"
                            >
                                <span className="hidden md:inline">Generate</span>
                                <ArrowRight size={14} strokeWidth={2.5} />
                            </button>
                        </div>
                    </div>


                    <div className="mt-3 flex justify-center gap-4 text-[10px] text-zinc-600 font-mono">
                        <span className="flex items-center gap-1">
                            <Clock size={12} /> ~4s latency
                        </span>
                        <span className="flex items-center gap-1">
                            <ShieldIcon size={12} /> Private mode
                        </span>
                    </div>

                    {/* Mac-style Video Demo Embed */}

                    <div className="mt-32 md:mt-48 relative group">




                        {/* Glow Effect specific to video */}
                        <div className="absolute -inset-1 bg-gradient-to-r from-lime-500/20 via-emerald-500/20 to-lime-500/20 rounded-2xl blur-xl opacity-20 group-hover:opacity-40 transition-opacity duration-700"></div>

                        <div className="relative rounded-xl border border-white/10 bg-black/50 backdrop-blur-sm shadow-2xl overflow-hidden">
                            {/* Window Header */}
                            <div className="h-8 bg-zinc-900/80 border-b border-white/5 flex items-center px-4 gap-2">
                                <div className="flex gap-1.5">
                                    <div className="w-2.5 h-2.5 rounded-full bg-[#FF5F57] shadow-sm"></div>
                                    <div className="w-2.5 h-2.5 rounded-full bg-[#FEBC2E] shadow-sm"></div>
                                    <div className="w-2.5 h-2.5 rounded-full bg-[#28C840] shadow-sm"></div>
                                </div>
                                <div className="flex-1 text-center">
                                    <span className="text-[10px] font-medium text-zinc-500">demo_preview.mp4</span>
                                </div>
                                <div className="w-10"></div> {/* Spacer for centering */}
                            </div>

                            {/* Video Placeholder Container */}
                            <div className="aspect-video bg-zinc-900 relative flex items-center justify-center overflow-hidden">
                                {/* Placeholder Content - User will replace source */}
                                <div className="absolute inset-0 flex items-center justify-center bg-zinc-900/50">
                                    <p className="text-zinc-600 text-sm">Demo Video Placeholder</p>
                                </div>
                                <video
                                    className="w-full h-full object-cover opacity-50"
                                    autoPlay
                                    muted
                                    loop
                                    playsInline
                                    poster="https://placehold.co/1920x1080/1a1a1a/333333?text=Demo+Video"
                                >
                                    <source src="" type="video/mp4" />
                                </video>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </section >
    );
};
