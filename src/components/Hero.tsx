import { Wand2, Clock, ShieldCheck as ShieldIcon, Globe, User, ShoppingCart, LayoutDashboard, MessageSquare, CheckSquare, Activity, Smartphone } from 'lucide-react';
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
    framework: 'html' | 'react' | 'astro';
    setFramework: (f: 'html' | 'react' | 'astro') => void;
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
    setGenerationType,
    framework,
    setFramework
}) => {
    const chipClass = "flex items-center gap-2 px-5 py-2.5 rounded-full border border-white/20 bg-black/40 backdrop-blur-md hover:bg-black/60 hover:border-lime-500 transition-all text-xs font-semibold text-white shadow-lg hover:shadow-[0_0_15px_rgba(132,204,22,0.3)] hover:-translate-y-0.5 active:scale-95";

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

                {/* App/Web Toggle with Smooth Animation */}
                <div className="flex justify-center mb-6">
                    <div className="relative p-1 bg-white/5 backdrop-blur-md border border-white/10 rounded-full flex items-center">
                        {/* Animated Sliding Background */}
                        <div
                            className={`absolute h-[calc(100%-8px)] w-[calc(50%-4px)] bg-white rounded-full shadow-lg shadow-white/20 transition-all duration-300 ease-out ${generationType === 'web' ? 'left-1' : 'left-[calc(50%+2px)]'
                                }`}
                        />
                        <button
                            onClick={() => setGenerationType('web')}
                            className={`relative z-10 px-6 py-2 rounded-full text-sm font-medium transition-colors duration-300 ${generationType === 'web' ? 'text-black' : 'text-neutral-400 hover:text-white'
                                }`}
                        >
                            <span className="flex items-center gap-2">
                                <span className="material-symbols-outlined text-sm">language</span>
                                Web
                            </span>
                        </button>
                        <button
                            onClick={() => setGenerationType('app')}
                            className={`relative z-10 px-6 py-2 rounded-full text-sm font-medium transition-colors duration-300 ${generationType === 'app' ? 'text-black' : 'text-neutral-400 hover:text-white'
                                }`}
                        >
                            <span className="flex items-center gap-2">
                                <span className="material-symbols-outlined text-sm">smartphone</span>
                                Mobile App
                            </span>
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
                        framework={framework}
                        setFramework={setFramework}
                    />


                    <div className="mt-3 flex justify-center gap-4 text-[10px] text-zinc-600 font-mono">
                        <span className="flex items-center gap-1">
                            <Clock size={12} /> ~4s latency
                        </span>
                        <span className="flex items-center gap-1">
                            <ShieldIcon size={12} /> Private mode
                        </span>
                    </div>
                </div>

                {/* Suggestions Chips */}
                <div className="mt-12 max-w-3xl mx-auto">
                    <p className="text-zinc-400 text-xs font-medium mb-4 uppercase tracking-wider">
                        {generationType === 'web' ? 'Website Ideas' : 'App Concepts'}
                    </p>
                    <div className="flex flex-wrap justify-center gap-3">
                        {generationType === 'web' ? (
                            <>
                                <button onClick={() => setPrompt("Create a high-converting SaaS landing page with a sticky transparent navbar, hero section with glowing gradient text and floating elements, feature grid with hover effects using framer-motion, interactive pricing toggle, and a minimal footer. Use a dark theme with zinc-900 background and lime-500 accents.")} className={chipClass}>
                                    <Globe size={14} /> SaaS Landing Page
                                </button>
                                <button onClick={() => setPrompt("Design a minimalist portfolio for a developer. Include a large typographic hero, a masonry grid for projects with modal previews, an 'About Me' section with a timeline of experience, and a contact form with floating labels. Use a clean, monochromatic color scheme.")} className={chipClass}>
                                    <User size={14} /> Portfolio
                                </button>
                                <button onClick={() => setPrompt("Build a premium product page for a luxury sneaker brand. Features: Full-screen image gallery with zoom, size selector with stock indicators, sticky 'Add to Cart' bar, customer reviews with star ratings, and a 'Related Products' carousel.")} className={chipClass}>
                                    <ShoppingCart size={14} /> E-commerce
                                </button>
                                <button onClick={() => setPrompt("Create a comprehensive admin dashboard layout. Sidebar navigation with collapsible groups, top header with search, and a main grid containing a revenue chart, recent activity list, and key metric cards with percentage growth indicators.")} className={chipClass}>
                                    <LayoutDashboard size={14} /> Dashboard
                                </button>
                            </>
                        ) : (
                            <>
                                <button onClick={() => setPrompt("Design a modern social media feed screen. Top stories bar with circular avatars, infinite scroll feed with image posts, like/comment/share actions, and a bottom tab bar with glassmorphism effect. Use animations for heart interactions.")} className={chipClass}>
                                    <Smartphone size={14} /> Social Feed
                                </button>
                                <button onClick={() => setPrompt("Create a productivity app interface. Header with date and progress ring, draggable task list with priority badges (High/Med/Low), swipe-to-delete gestures, and a floating action button (FAB) for adding tasks.")} className={chipClass}>
                                    <CheckSquare size={14} /> Task Manager
                                </button>
                                <button onClick={() => setPrompt("Build a fitness tracking dashboard for mobile. Display a central circular progress ring for daily steps, a weekly activity bar chart, and a list of recent workouts with icons. Include a bottom navigation.")} className={chipClass}>
                                    <Activity size={14} /> Fitness Tracker
                                </button>
                                <button onClick={() => setPrompt("Design a clean chat conversation screen. Header with user online status, message bubbles (green for sent, gray for received) with timestamps, support for image attachments, and a bottom input field with emoji picker.")} className={chipClass}>
                                    <MessageSquare size={14} /> Chat App
                                </button>
                            </>
                        )}
                    </div>
                </div>

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
        </section>
    );
};
