import { Wand2, Clock, ShieldCheck as ShieldIcon } from 'lucide-react';
import { ChatInput } from './ChatInput';
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
    generationType: 'web' | 'app';
    setGenerationType: (t: 'web' | 'app') => void;
}

export const Hero: React.FC<HeroProps> = ({
    onGenerate,
    loading,
    image,
    setImage,
    model,
    setModel,
    prompt,
    setPrompt,
    generationType,
    setGenerationType
}) => {
    return (
        <section className="relative pt-20 pb-12 md:pt-28 overflow-hidden">
            {/* Background Gradients */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-lime-500/10 blur-[120px] rounded-full pointer-events-none opacity-30"></div>

            <div className="max-w-4xl mx-auto px-6 relative z-10 text-center">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-lime-500/30 bg-lime-500/10 text-lime-300 text-xs font-semibold tracking-wide mb-8">
                    <Wand2 size={12} />
                    V 2.0 Now Supporting Gemini 3 & Claude 4.5
                </div>

                <h1 className="text-4xl md:text-6xl font-bold text-white tracking-tight mb-6 leading-[1.1] drop-shadow-md">
                    Turn <FlipWords words={["Screenshots", "Wireframes", "Mockups", "Designs"]} className="text-white drop-shadow-md" /> into <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-lime-300 to-emerald-300 drop-shadow-sm">Clean Code</span>
                </h1>

                <p className="text-lg text-zinc-200/90 max-w-xl mx-auto mb-10 leading-relaxed font-light drop-shadow">
                    Upload a design mock or screenshot. Our AI architect builds the frontend for you instantly.
                </p>

                {/* App/Web Toggle */}
                <div className="flex justify-center mb-6">
                    <div className="p-1 bg-white/5 backdrop-blur-md border border-white/10 rounded-full flex items-center gap-1">
                        <button
                            onClick={() => setGenerationType('web')}
                            className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${generationType === 'web' ? 'bg-white text-black shadow-lg shadow-white/10' : 'text-neutral-400 hover:text-white'}`}
                        >
                            Web App
                        </button>
                        <button
                            onClick={() => setGenerationType('app')}
                            className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${generationType === 'app' ? 'bg-white text-black shadow-lg shadow-white/10' : 'text-neutral-400 hover:text-white'}`}
                        >
                            Mobile App
                        </button>
                    </div>
                </div>

                <div className="w-full max-w-2xl mx-auto">
                    <ChatInput
                        onGenerate={onGenerate}
                        loading={loading}
                        image={image}
                        setImage={setImage}
                        model={model}
                        setModel={setModel}
                        prompt={prompt}
                        setPrompt={setPrompt}
                        variant="hero"
                    />


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
                                <iframe
                                    src="https://drive.google.com/file/d/12UDZVp9ize7lQY6zXGzOYOCK0Rjf6tva/preview"
                                    className="w-full h-full"
                                    allow="autoplay"
                                    title="Demo Video"
                                ></iframe>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </section >
    );
};
