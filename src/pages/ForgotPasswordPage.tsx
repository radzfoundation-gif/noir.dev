import { Link } from 'react-router-dom';

export const ForgotPasswordPage = () => {
    return (
        <div className="relative flex min-h-screen w-full items-center justify-center bg-[#000000] px-6 py-12 font-display">
            <div className="absolute inset-0 grid-pattern pointer-events-none z-0" style={{
                backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.05) 1px, transparent 0)',
                backgroundSize: '40px 40px'
            }}></div>
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#4ade80]/5 blur-[120px] rounded-full pointer-events-none"></div>
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#4ade80]/5 blur-[120px] rounded-full pointer-events-none"></div>
            <div className="relative z-10 w-full max-w-[480px]">
                <div className="flex flex-col items-center mb-12">
                    <div className="size-12 bg-[#4ade80] rounded-xl flex items-center justify-center text-black mb-4 shadow-[0_0_20px_rgba(74,222,128,0.3)]">
                        <span className="material-symbols-outlined text-[28px] font-bold">code</span>
                    </div>
                    <h1 className="text-2xl font-bold tracking-tight text-white">Noir Code</h1>
                </div>
                <div className="bg-[#0a0a0a] border border-[#262626] rounded-2xl p-8 sm:p-10 shadow-2xl">
                    <div className="mb-8">
                        <h2 className="text-white text-3xl font-black leading-tight tracking-[-0.033em]">Recover Password</h2>
                        <p className="text-[#737373] mt-2 text-base font-normal">Enter your email to receive a reset link.</p>
                    </div>
                    <form className="flex flex-col gap-6" onSubmit={(e) => e.preventDefault()}>
                        <div className="flex flex-col gap-2">
                            <label className="text-[#d4d4d4] text-sm font-semibold">Email address</label>
                            <div className="relative group">
                                <input className="form-input w-full rounded-lg border border-[#262626] bg-[#121212] text-white h-14 pl-4 pr-12 text-base placeholder:text-[#525252] focus:border-[#4ade80] focus:ring-1 focus:ring-[#4ade80]/20 transition-all outline-none" placeholder="dev@noir.code" required type="email" />
                                <div className="absolute inset-y-0 right-0 flex items-center pr-4 text-[#525252]">
                                    <span className="material-symbols-outlined text-[20px]">mail</span>
                                </div>
                            </div>
                        </div>
                        <button className="flex w-full items-center justify-center rounded-lg h-14 bg-[#4ade80] text-black text-base font-bold tracking-[0.015em] hover:brightness-110 shadow-[0_0_20px_rgba(74,222,128,0.2)] active:scale-[0.98] transition-all" type="submit">
                            Send Reset Link
                        </button>
                    </form>
                    <div className="mt-8 pt-6 border-t border-[#262626]/50 text-center">
                        <Link className="inline-flex items-center gap-2 text-sm font-semibold text-[#a3a3a3] hover:text-[#4ade80] transition-colors group" to="/login">
                            <span className="material-symbols-outlined text-[18px] transition-transform group-hover:-translate-x-1">chevron_left</span>
                            Back to Sign In
                        </Link>
                    </div>
                </div>
                <div className="mt-12 text-center text-xs font-mono text-[#525252] uppercase tracking-widest">
                    System Version 2.0.4 // Security Protocol Active
                </div>
            </div>
        </div>
    );
};
