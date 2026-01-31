import React from 'react';
import { Link } from 'react-router-dom';

export const RegisterPage = () => {
    return (
        <div className="flex min-h-screen w-full flex-col lg:flex-row bg-[#000000] relative font-display text-white">
            <div className="absolute inset-0 grid-pattern pointer-events-none z-0" style={{
                backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.05) 1px, transparent 0)',
                backgroundSize: '40px 40px'
            }}></div>
            <div className="relative hidden w-full flex-1 lg:flex overflow-hidden z-10 border-r border-[#ffffff]/5">
                <div className="absolute inset-0 code-bg z-10" style={{
                    background: 'linear-gradient(180deg, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.5) 100%)'
                }}></div>
                <div className="h-full w-full bg-center bg-no-repeat bg-cover opacity-10" style={{
                    backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAc8-yc7A_FM_KB-wcrjZYuVNoq2KOM4K3dfW40J-TxpakX6IOJxjUIGSh7YlEvfhbZZqaIyiT5xNBc3asRg7G0tLgLU_7ciSnCHqdWU20JwEaDC27FaRXvybn-A6i-oZ76SkaQeTZYdpKsBEBo4UbVHEWAmoBi1Br8bB3nxNCP1NeGmvaRgEji-OrMXBYDTs8HzV1Z4u7bGfKNtBL2tb_zZ5gJtzfIwS0qzDkL4qVYeBWzVLMKY6P3rPL3QOusGLxWVWBz_SwCpgQ")',
                    filter: 'grayscale(100%) brightness(0.5)'
                }}>
                </div>
                <div className="absolute inset-0 z-10 p-16 flex flex-col justify-center font-mono text-sm text-[#4ade80]/20 pointer-events-none select-none blur-[1px]">
                    <div className="space-y-1">
                        <p>const noirCode = {'{'}</p>
                        <p className="ml-4">version: "2.0.4",</p>
                        <p className="ml-4">theme: "noir",</p>
                        <p className="ml-4">mode: "ultra-dark",</p>
                        <p className="ml-4">components: [</p>
                        <p className="ml-8">"AI_Architect",</p>
                        <p className="ml-8">"Neural_Frontend",</p>
                        <p className="ml-8">"Clean_Output"</p>
                        <p className="ml-4">]</p>
                        <p>{'};'}</p>
                        <p className="mt-4">export default noirCode;</p>
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
                        <h1 className="text-5xl font-black leading-tight tracking-tight text-white mb-4">Turn Screens into <br /><span className="text-[#4ade80]">Clean Code</span></h1>
                        <p className="mt-6 text-lg text-[#a3a3a3] max-w-md">Join the elite community of developers building high-performance interfaces with AI precision.</p>
                    </div>
                    <div className="text-sm text-[#525252]">
                        © 2024 Noir Code. Engineered for performance.
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
                    <h2 className="text-white text-4xl font-black leading-tight tracking-[-0.033em]">Join the Core</h2>
                    <p className="text-[#737373] mt-2 text-base font-normal">Initialize your developer profile today.</p>
                </div>
                <form className="flex flex-col gap-5" onSubmit={(e) => e.preventDefault()}>
                    <div className="flex flex-col gap-2">
                        <label className="text-[#d4d4d4] text-sm font-semibold">Full Name</label>
                        <input className="form-input w-full rounded-lg border border-[#262626] bg-[#121212] text-white h-12 p-[15px] text-base placeholder:text-[#525252] focus:border-[#4ade80] focus:ring-1 focus:ring-[#4ade80]/20 transition-all outline-none" placeholder="John Doe" type="text" />
                    </div>
                    <div className="flex flex-col gap-2">
                        <label className="text-[#d4d4d4] text-sm font-semibold">Work Email</label>
                        <input className="form-input w-full rounded-lg border border-[#262626] bg-[#121212] text-white h-12 p-[15px] text-base placeholder:text-[#525252] focus:border-[#4ade80] focus:ring-1 focus:ring-[#4ade80]/20 transition-all outline-none" placeholder="dev@noir.code" type="email" />
                    </div>
                    <div className="flex flex-col gap-2">
                        <label className="text-[#d4d4d4] text-sm font-semibold">Create Password</label>
                        <div className="relative flex w-full items-stretch rounded-lg">
                            <input className="form-input w-full rounded-lg border border-[#262626] bg-[#121212] text-white h-12 p-[15px] pr-12 text-base placeholder:text-[#525252] focus:border-[#4ade80] focus:ring-1 focus:ring-[#4ade80]/20 transition-all outline-none" placeholder="••••••••" type="password" />
                            <div className="absolute inset-y-0 right-0 flex items-center pr-4">
                                <span className="material-symbols-outlined text-[#737373] hover:text-[#a3a3a3] cursor-pointer text-[20px] select-none transition-colors">visibility</span>
                            </div>
                        </div>
                        <div className="mt-2 space-y-1.5">
                            <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-wider text-[#737373]">
                                <span>Entropy Level</span>
                                <span className="text-[#4ade80]">Strong</span>
                            </div>
                            <div className="h-1 w-full rounded-full bg-[#262626] overflow-hidden">
                                <div className="h-full bg-[#4ade80] w-2/3"></div>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-start gap-3 mt-2">
                        <input className="form-checkbox mt-1 h-4 w-4 rounded border-[#262626] bg-[#121212] text-[#4ade80] focus:ring-[#4ade80]/20 cursor-pointer" id="terms" type="checkbox" />
                        <label className="text-xs leading-relaxed text-[#737373] cursor-pointer" htmlFor="terms">
                            By signing up, you agree to our <a className="text-[#d4d4d4] hover:text-[#4ade80] underline" href="#">Terms of Service</a> and <a className="text-[#d4d4d4] hover:text-[#4ade80] underline" href="#">Privacy Policy</a>.
                        </label>
                    </div>
                    <button className="flex w-full items-center justify-center rounded-lg h-14 bg-[#4ade80] text-black text-base font-bold tracking-[0.015em] hover:brightness-110 shadow-[0_0_20px_rgba(74,222,128,0.2)] transition-all mt-2" type="submit">
                        Create Account
                    </button>
                    <div className="relative flex items-center py-4">
                        <div className="flex-grow border-t border-[#262626]"></div>
                        <span className="flex-shrink mx-4 text-[10px] font-bold text-[#525252] uppercase tracking-[0.2em]">Quick Auth</span>
                        <div className="flex-grow border-t border-[#262626]"></div>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3">
                        <button className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-[#262626] bg-black h-12 px-4 text-sm font-semibold text-[#d4d4d4] hover:bg-[#171717] hover:border-[#404040] transition-colors" type="button">
                            <svg className="size-5" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path>
                                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path>
                                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"></path>
                                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"></path>
                            </svg>
                            Google
                        </button>
                        <button className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-[#262626] bg-black h-12 px-4 text-sm font-semibold text-[#d4d4d4] hover:bg-[#171717] hover:border-[#404040] transition-colors" type="button">
                            <svg className="size-5" fill="white" viewBox="0 0 24 24">
                                <path d="M17.05 20.28c-.96.95-2.21 1.72-3.72 1.72-1.47 0-2.31-.84-3.69-.84-1.39 0-2.45.81-3.67.81-1.38 0-2.6-.72-3.57-1.68C.49 18.36 0 16.51 0 14.08c0-3.35 2.15-5.18 4.2-5.18 1.11 0 2.02.43 2.9.43.76 0 1.57-.45 2.86-.45 1.22 0 2.21.46 3.12 1.48-1.55 1.05-2.05 3.01-2.05 4.35 0 2.05 1.06 3.75 2.45 4.7-.27.81-.72 1.54-1.43 2.22l7-11.35zM12.03 7.25c-.02-2.23 1.83-4.11 4.04-4.25.02.16.03.32.03.49 0 2.11-1.89 4.11-4.07 3.76z"></path>
                            </svg>
                            Apple
                        </button>
                    </div>
                    <p className="mt-10 text-center text-sm font-medium text-[#737373]">
                        Already have an account?
                        <Link className="text-[#4ade80] font-bold hover:underline ml-1" to="/login">Sign In</Link>
                    </p>
                </form>
            </div>
        </div>
    );
};
