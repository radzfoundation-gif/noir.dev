import { useState } from 'react';
import { X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { RegisterModal } from './RegisterModal';
import { ForgotPasswordModal } from './ForgotPasswordModal';

interface LoginModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
    const { signIn } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showRegister, setShowRegister] = useState(false);
    const [showForgot, setShowForgot] = useState(false);

    if (!isOpen) return null;

    if (showRegister) {
        return <RegisterModal isOpen={true} onClose={onClose} onSwitchToLogin={() => setShowRegister(false)} />;
    }

    if (showForgot) {
        return <ForgotPasswordModal isOpen={true} onClose={onClose} onSwitchToLogin={() => setShowForgot(false)} />;
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        const { error: authError } = await signIn(email, password);

        if (authError) {
            setError(authError.message);
            setIsLoading(false);
        } else {
            onClose();
        }
    };

    const handleGoogleLogin = async () => {
        setError(null);
        try {
            const { error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: `${window.location.origin}/editor`
                }
            });
            if (error) throw error;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Google login failed');
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
            <div
                className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                onClick={onClose}
            />
            <div className="relative w-full max-w-md mx-4 bg-[#0a0a0a] border border-white/10 rounded-2xl shadow-2xl overflow-hidden animate-fade-in-up">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-zinc-500 hover:text-white transition-colors"
                >
                    <X size={20} />
                </button>

                <div className="p-8">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="size-8 bg-lime-500 rounded flex items-center justify-center text-black">
                            <span className="material-symbols-outlined text-[20px] font-bold">code</span>
                        </div>
                        <span className="text-xl font-bold tracking-tight text-white">Noir Code</span>
                    </div>

                    <h2 className="text-white text-2xl font-bold mb-2">Welcome Back</h2>
                    <p className="text-zinc-400 mb-6">Sign in to access your workspace</p>

                    <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                        {error && (
                            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                                {error}
                            </div>
                        )}

                        <div>
                            <label className="text-zinc-300 text-sm font-medium mb-1.5 block">Email</label>
                            <input
                                className="w-full rounded-lg border border-zinc-700 bg-[#121212] text-white h-11 px-4 text-sm focus:border-lime-500 focus:ring-1 focus:ring-lime-500/20 outline-none transition-all"
                                placeholder="dev@noir.code"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        <div>
                            <label className="text-zinc-300 text-sm font-medium mb-1.5 block">Password</label>
                            <div className="relative">
                                <input
                                    className="w-full rounded-lg border border-zinc-700 bg-[#121212] text-white h-11 px-4 pr-12 text-sm focus:border-lime-500 focus:ring-1 focus:ring-lime-500/20 outline-none transition-all"
                                    placeholder="••••••••"
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300"
                                >
                                    {showPassword ? 'Hide' : 'Show'}
                                </button>
                            </div>
                        </div>

                        <div className="flex items-center justify-between text-sm">
                            <label className="flex items-center gap-2 cursor-pointer text-zinc-400 hover:text-zinc-300">
                                <input className="rounded border-zinc-700 bg-[#121212] text-lime-500 focus:ring-lime-500/20" type="checkbox" />
                                Remember
                            </label>
                            <button type="button" onClick={() => setShowForgot(true)} className="text-zinc-400 hover:text-lime-400 transition-colors">
                                Forgot password?
                            </button>
                        </div>

                        <button
                            className="flex w-full items-center justify-center rounded-lg h-11 bg-lime-500 text-black font-semibold hover:bg-lime-400 transition-all disabled:opacity-50 mt-2"
                            type="submit"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <span className="material-symbols-outlined animate-spin">progress_activity</span>
                            ) : (
                                'Sign In'
                            )}
                        </button>
                    </form>

                    <div className="relative flex items-center py-4 my-4">
                        <div className="flex-grow border-t border-zinc-800"></div>
                        <span className="flex-shrink mx-4 text-xs font-bold text-zinc-600 uppercase">or continue with</span>
                        <div className="flex-grow border-t border-zinc-800"></div>
                    </div>

                    <button
                        className="flex w-full items-center justify-center gap-2 rounded-lg border border-zinc-700 bg-black h-11 text-sm font-medium text-zinc-300 hover:bg-zinc-900 hover:border-zinc-600 transition-colors"
                        type="button"
                        onClick={handleGoogleLogin}
                    >
                        <svg className="size-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path>
                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path>
                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"></path>
                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"></path>
                        </svg>
                        Google
                    </button>

                    <p className="mt-6 text-center text-sm text-zinc-500">
                        Don't have an account?{' '}
                        <button onClick={() => setShowRegister(true)} className="text-lime-400 font-semibold hover:underline">
                            Sign up
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};
