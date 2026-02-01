import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const RegisterPage = () => {
    const navigate = useNavigate();
    const { signUp } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        setIsLoading(true);

        const { error: authError } = await signUp(email, password);

        if (authError) {
            setError(authError.message);
            setIsLoading(false);
        } else {
            // Supabase sends a confirmation email by default
            navigate('/login?registered=true');
        }
    };

    return (
        <div className="flex min-h-screen w-full flex-col lg:flex-row bg-[#000000] relative font-display text-white">
            <div className="absolute inset-0 grid-pattern pointer-events-none z-0" style={{
                backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.05) 1px, transparent 0)',
                backgroundSize: '40px 40px'
            }}></div>
            <div className="relative hidden w-full flex-1 lg:flex overflow-hidden z-10 border-r border-[#ffffff]/5">
                <div className="absolute inset-0 code-bg z-10" style={{
                    background: 'linear-gradient(180deg, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.7) 100%)'
                }}></div>
                <div className="h-full w-full bg-center bg-no-repeat bg-cover opacity-10" style={{
                    backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAc8-yc7A_FM_KB-wcrjZYuVNoq2KOM4K3dfW40J-TxpakX6IOJxjUIGSh7YlEvfhbZZqaIyiT5xNBc3asRg7G0tLgLU_7ciSnCHqdWU20JwEaDC27FaRXvybn-A6i-oZ76SkaQeTZYdpKsBEBo4UbVHEWAmoBi1Br8bB3nxNCP1NeGmvaRgEji-OrMXBYDTs8HzV1Z4u7bGfKNtBL2tb_zZ5gJtzfIwS0qzDkL4qVYeBWzVLMKY6P3rPL3QOusGLxWVWBz_SwCpgQ")',
                    filter: 'grayscale(100%) brightness(0.5)'
                }}>
                </div>
                <div className="absolute inset-0 z-10 p-16 flex flex-col justify-center font-mono text-sm text-[#4ade80]/10 pointer-events-none select-none blur-[1px]">
                    <div className="space-y-1">
                        <p>// Welcome to Noir Code</p>
                        <p>const developer = {'{'}</p>
                        <p className="ml-4">status: "new",</p>
                        <p className="ml-4">access: "pending",</p>
                        <p className="ml-4">plan: "starter"</p>
                        <p>{'};'}</p>
                    </div>
                </div>
                <div className="absolute inset-0 z-20 flex flex-col justify-between p-16">
                    <div className="flex items-center gap-3">
                        <div className="size-8 bg-[#4ade80] rounded flex items-center justify-center text-black">
                            <span className="material-symbols-outlined text-[20px] font-bold">code</span>
                        </div>
                        <span className="text-xl font-bold tracking-tight text-white">Noir Code</span>
                    </div>
                    <div>
                        <h1 className="text-5xl font-black leading-tight tracking-tight text-white mb-4">Join the <br /><span className="text-[#4ade80]">Revolution</span></h1>
                        <p className="mt-6 text-lg text-[#a3a3a3] max-w-md">Create your account and start building the future of web development with AI.</p>
                    </div>
                    <div className="text-sm text-[#525252]">
                        © 2026 Noir Code. Engineered for performance.
                    </div>
                </div>
            </div>
            <div className="flex w-full flex-col justify-center bg-[#0a0a0a] lg:w-[540px] xl:w-[600px] px-8 py-12 sm:px-16 lg:px-20 z-10">
                <div className="flex items-center gap-3 lg:hidden mb-12">
                    <div className="size-8 bg-[#4ade80] rounded flex items-center justify-center text-black">
                        <span className="material-symbols-outlined text-[20px] font-bold">code</span>
                    </div>
                    <h2 className="text-white text-xl font-bold">Noir Code</h2>
                </div>
                <div className="mb-10">
                    <h2 className="text-white text-4xl font-black leading-tight tracking-[-0.033em]">Create Account</h2>
                    <p className="text-[#737373] mt-2 text-base font-normal">Get started with your free developer account.</p>
                </div>
                <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
                    {error && (
                        <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                            {error}
                        </div>
                    )}
                    <div className="flex flex-col gap-2">
                        <label className="text-[#d4d4d4] text-sm font-semibold">Email address</label>
                        <input
                            className="form-input w-full rounded-lg border border-[#262626] bg-[#121212] text-white h-14 p-[15px] text-base placeholder:text-[#525252] focus:border-[#4ade80] focus:ring-1 focus:ring-[#4ade80]/20 transition-all outline-none"
                            placeholder="dev@noir.code"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <label className="text-[#d4d4d4] text-sm font-semibold">Password</label>
                        <div className="relative flex w-full items-stretch rounded-lg">
                            <input
                                className="form-input w-full rounded-lg border border-[#262626] bg-[#121212] text-white h-14 p-[15px] pr-12 text-base placeholder:text-[#525252] focus:border-[#4ade80] focus:ring-1 focus:ring-[#4ade80]/20 transition-all outline-none"
                                placeholder="Min. 6 characters"
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <div className="absolute inset-y-0 right-0 flex items-center pr-4">
                                <span
                                    className="material-symbols-outlined text-[#737373] hover:text-[#a3a3a3] cursor-pointer text-[20px] select-none transition-colors"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? 'visibility_off' : 'visibility'}
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col gap-2">
                        <label className="text-[#d4d4d4] text-sm font-semibold">Confirm Password</label>
                        <input
                            className="form-input w-full rounded-lg border border-[#262626] bg-[#121212] text-white h-14 p-[15px] text-base placeholder:text-[#525252] focus:border-[#4ade80] focus:ring-1 focus:ring-[#4ade80]/20 transition-all outline-none"
                            placeholder="Re-enter password"
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button
                        className="flex w-full items-center justify-center rounded-lg h-14 bg-[#4ade80] text-black text-base font-bold tracking-[0.015em] hover:brightness-110 shadow-[0_0_20px_rgba(74,222,128,0.2)] transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-2"
                        type="submit"
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <span className="material-symbols-outlined animate-spin">progress_activity</span>
                        ) : (
                            'Create Account'
                        )}
                    </button>
                </form>
                <p className="mt-10 text-center text-sm font-medium text-[#737373]">
                    Already have an account?
                    <Link className="text-[#4ade80] font-bold hover:underline ml-1" to="/login">Sign in</Link>
                </p>
            </div>
        </div>
    );
};
