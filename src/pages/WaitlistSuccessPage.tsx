import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { NoirLogo } from '../components/NoirLogo';

export const WaitlistSuccessPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { name } = (location.state as { name?: string }) || {};

    const handleShare = async () => {
        const shareData = {
            title: 'Noir - The Future of Autonomous Web Systems',
            text: 'I just joined the waitlist for Noir! Check it out.',
            url: window.location.origin,
        };

        try {
            if (navigator.share) {
                await navigator.share(shareData);
            } else {
                await navigator.clipboard.writeText(window.location.origin);
                alert('Link copied to clipboard!');
            }
        } catch (err) {
            console.error('Error sharing:', err);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="bg-background-dark min-h-screen relative flex flex-col font-sans text-white"
        >
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <motion.div
                    animate={{
                        x: [-30, 30, -30],
                        y: [-20, 20, -20],
                    }}
                    transition={{
                        duration: 10,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                    className="absolute top-[20%] left-[15%] w-72 h-72 bg-primary/20 rounded-full blur-[100px]"
                />
                <motion.div
                    animate={{
                        x: [30, -30, 30],
                        y: [20, -20, 20],
                    }}
                    transition={{
                        duration: 8,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                    className="absolute bottom-[20%] right-[15%] w-96 h-96 bg-primary/10 rounded-full blur-[120px]"
                />
            </div>

            <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 py-12">
                <div className="max-w-[560px] w-full flex flex-col items-center text-center">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-12 flex flex-col items-center gap-3"
                    >
                        <div className="cursor-pointer flex flex-col items-center gap-3" onClick={() => navigate('/')}>
                            <NoirLogo className="size-16" />
                            <h2 className="text-3xl font-bold tracking-tighter">Noir</h2>
                        </div>
                    </motion.div>

                    <div className="bg-[#172336]/70 backdrop-blur-xl border border-white/10 rounded-xl p-8 w-full shadow-2xl relative">
                        <h1 className="text-white tracking-tight text-[40px] font-bold leading-tight pb-3">You're In!</h1>
                        <p className="text-[#8da6ce] text-lg font-normal leading-relaxed mb-8">
                            Welcome to the Noir exclusive preview, <span className="text-primary font-bold">{name || 'Early Adopter'}</span>. Your access has been successfully provisioned.
                        </p>

                        <div className="flex flex-col gap-4 mb-8 text-left bg-black/20 p-5 rounded-lg border border-white/5">
                            <div className="flex justify-between items-center">
                                <div className="flex items-center gap-2">
                                    <span className="material-symbols-outlined text-primary text-xl">verified</span>
                                    <p className="text-white text-base font-semibold">Beta Access Queue</p>
                                </div>
                                <p className="text-primary text-sm font-bold">100%</p>
                            </div>
                            <div className="h-2.5 rounded-full bg-white/10 overflow-hidden">
                                <div className="h-full rounded-full bg-primary shadow-[0_0_15px_rgba(163,230,53,0.6)]" style={{ width: '100%' }}></div>
                            </div>
                            <p className="text-primary text-sm font-medium flex items-center gap-1.5">
                                <span className="material-symbols-outlined text-sm">check_circle</span>
                                Early Access Granted
                            </p>
                        </div>

                        <div className="flex flex-col gap-3 w-full">
                            <button
                                disabled
                                className="group flex items-center justify-center gap-2 rounded-lg h-14 px-6 bg-primary/20 text-primary/50 text-lg font-bold cursor-not-allowed border border-primary/10 transition-all"
                            >
                                <span className="material-symbols-outlined text-xl">lock</span>
                                <span>Explore Noir Preview (Soon)</span>
                            </button>
                            <button
                                onClick={handleShare}
                                className="flex items-center justify-center gap-2 rounded-lg h-14 px-6 bg-white/5 text-white text-lg font-bold transition-all hover:bg-white/10 active:scale-95 border border-white/10"
                            >
                                <span className="material-symbols-outlined font-light">share</span>
                                <span>Share With Friends</span>
                            </button>
                        </div>
                    </div>

                    <div className="mt-8 flex gap-6">
                        <a className="text-white/40 text-xs hover:text-white/60 transition-colors uppercase tracking-widest" href="#">Privacy</a>
                        <a className="text-white/40 text-xs hover:text-white/60 transition-colors uppercase tracking-widest" href="#">Support</a>
                        <a className="text-white/40 text-xs hover:text-white/60 transition-colors uppercase tracking-widest" href="#">X / Twitter</a>
                    </div>
                </div>
            </main>
        </motion.div>
    );
};
