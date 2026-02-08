import { useState } from 'react';
import { X, Mail, ArrowLeft } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface ForgotPasswordModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSwitchToLogin: () => void;
}

export const ForgotPasswordModal: React.FC<ForgotPasswordModalProps> = ({ isOpen, onClose, onSwitchToLogin }) => {
    const [email, setEmail] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${window.location.origin}/reset-password`
        });

        if (resetError) {
            setError(resetError.message);
            setIsLoading(false);
        } else {
            setSuccess(true);
            setIsLoading(false);
        }
    };

    if (success) {
        return (
            <div className="fixed inset-0 z-[100] flex items-center justify-center">
                <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
                <div className="relative w-full max-w-md mx-4 bg-[#0a0a0a] border border-white/10 rounded-2xl shadow-2xl p-8 text-center animate-fade-in-up">
                    <button onClick={onClose} className="absolute top-4 right-4 text-zinc-500 hover:text-white">
                        <X size={20} />
                    </button>
                    <div className="w-16 h-16 bg-lime-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Mail className="size-8 text-lime-400" />
                    </div>
                    <h2 className="text-white text-2xl font-bold mb-2">Check Your Email</h2>
                    <p className="text-zinc-400 mb-6">We've sent a password reset link to <span className="text-white">{email}</span></p>
                    <button onClick={onClose} className="w-full py-3 bg-lime-500 text-black font-semibold rounded-lg hover:bg-lime-400">
                        Close
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
            <div className="relative w-full max-w-md mx-4 bg-[#0a0a0a] border border-white/10 rounded-2xl shadow-2xl overflow-hidden animate-fade-in-up">
                <button onClick={onClose} className="absolute top-4 right-4 text-zinc-500 hover:text-white transition-colors">
                    <X size={20} />
                </button>

                <div className="p-8">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="size-8 bg-lime-500 rounded flex items-center justify-center text-black">
                            <span className="material-symbols-outlined text-[20px] font-bold">code</span>
                        </div>
                        <span className="text-xl font-bold tracking-tight text-white">Noir Code</span>
                    </div>

                    <h2 className="text-white text-2xl font-bold mb-2">Reset Password</h2>
                    <p className="text-zinc-400 mb-6">Enter your email and we'll send you a reset link</p>

                    <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                        {error && (
                            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                                {error}
                            </div>
                        )}

                        <div>
                            <label className="text-zinc-300 text-sm font-medium mb-1.5 block">Email</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-zinc-500" />
                                <input
                                    className="w-full rounded-lg border border-zinc-700 bg-[#121212] text-white h-11 pl-11 pr-4 text-sm focus:border-lime-500 outline-none transition-all"
                                    placeholder="dev@noir.code"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <button
                            className="flex w-full items-center justify-center rounded-lg h-11 bg-lime-500 text-black font-semibold hover:bg-lime-400 transition-all disabled:opacity-50 mt-2"
                            type="submit"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <span className="material-symbols-outlined animate-spin">progress_activity</span>
                            ) : (
                                'Send Reset Link'
                            )}
                        </button>
                    </form>

                    <p className="mt-6 text-center text-sm text-zinc-500">
                        Remember your password?{' '}
                        <button onClick={onSwitchToLogin} className="text-lime-400 font-semibold hover:underline flex items-center justify-center gap-1 mx-auto mt-2">
                            <ArrowLeft size={14} /> Sign in
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};
