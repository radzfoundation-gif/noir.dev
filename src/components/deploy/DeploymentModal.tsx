import React, { useState, useEffect, useRef } from 'react';
import { Rocket, Github, CheckCircle, X, Terminal, Download, Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { deploymentService, type DeployConfig, type DeployPlatform } from '../../lib/deploymentService';

interface DeploymentModalProps {
    isOpen: boolean;
    onClose: () => void;
    code: string;
    projectName: string;
}

export const DeploymentModal: React.FC<DeploymentModalProps> = ({ isOpen, onClose, code, projectName }) => {
    const [step, setStep] = useState<'config' | 'deploying' | 'success' | 'error' | 'name-conflict'>('config');
    const [platform, setPlatform] = useState<DeployPlatform>('vercel');
    const [logs, setLogs] = useState<string[]>([]);
    const [deployedUrl, setDeployedUrl] = useState<string | null>(null);
    const [hasSavedToken, setHasSavedToken] = useState<Record<DeployPlatform, boolean>>({
        vercel: false,
        netlify: false,
        'github-pages': false,
    });
    const [customProjectName, setCustomProjectName] = useState(projectName);
    const [conflictingName, setConflictingName] = useState('');
    const logsEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (isOpen) {
            checkSavedTokens();
            setCustomProjectName(projectName);
        }
    }, [isOpen, projectName]);

    useEffect(() => {
        if (logsEndRef.current) {
            logsEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [logs]);

    const checkSavedTokens = async () => {
        const tokens: Record<DeployPlatform, boolean> = { ...hasSavedToken };

        for (const platform of ['vercel', 'netlify', 'github-pages'] as DeployPlatform[]) {
            const hasToken = await deploymentService.hasSavedToken(platform);
            tokens[platform] = hasToken;
        }

        setHasSavedToken(tokens);
    };

    const handleDeploy = async (nameOverride?: string) => {
        setStep('deploying');
        setLogs([]);
        setDeployedUrl(null);

        try {
            const config: DeployConfig = {
                platform,
                projectName: nameOverride || customProjectName || 'noir-project',
                framework: 'html',
            };

            const generator = deploymentService.deployToPlatform(code, config);

            for await (const log of generator) {
                setLogs(prev => [...prev, `> ${log}`]);

                // Extract URL from success log
                if (log.includes('Live at:')) {
                    const url = log.split('Live at:')[1].trim();
                    setDeployedUrl(url);
                }
            }

            setStep('success');
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';

            // Check if it's a PROJECT_EXISTS error
            if (errorMessage.startsWith('PROJECT_EXISTS:')) {
                const existingName = errorMessage.split(':')[1];
                setConflictingName(existingName);
                setCustomProjectName(existingName + '-' + Date.now().toString().slice(-4));
                setStep('name-conflict');
                return;
            }

            console.error('Deployment failed:', error);
            setLogs(prev => [...prev, `> Error: ${errorMessage}`]);
            setStep('error');
        }
    };

    const handleDownload = () => {
        deploymentService.downloadDeployPackage(code, {
            platform,
            projectName: projectName || 'noir-project',
            framework: 'html'
        });
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                />

                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    className="relative w-full max-w-2xl bg-[#0a0a0a] border border-[#262626] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]"
                >
                    {/* Header */}
                    <div className="p-6 border-b border-[#262626] flex items-center justify-between bg-[#121212]">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-500/10 rounded-lg">
                                <Rocket className="text-blue-500" size={20} />
                            </div>
                            <div>
                                <h2 className="text-lg font-bold text-white">Deploy to Production</h2>
                                <p className="text-xs text-neutral-500">Go live in seconds</p>
                            </div>
                        </div>
                        <button onClick={onClose} className="text-neutral-500 hover:text-white transition-colors">
                            <X size={20} />
                        </button>
                    </div>

                    <div className="p-8 flex-1 overflow-y-auto">
                        {step === 'config' && (
                            <div className="space-y-6">
                                <p className="text-neutral-400 text-sm">Choose your deployment target. Noir will configure the build settings automatically.</p>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <button
                                        onClick={() => setPlatform('vercel')}
                                        className={`p-4 rounded-xl border flex flex-col items-center gap-3 transition-all relative ${platform === 'vercel' ? 'bg-white text-black border-white' : 'bg-[#171717] text-neutral-400 border-[#262626] hover:bg-[#202020]'}`}
                                    >
                                        {hasSavedToken.vercel && (
                                            <span className="absolute top-2 right-2 w-2 h-2 bg-green-500 rounded-full" title="Connected" />
                                        )}
                                        <svg viewBox="0 0 1155 1000" className="w-8 h-8" fill="currentColor">
                                            <path d="M577.344 0L1154.69 1000H0L577.344 0Z" />
                                        </svg>
                                        <span className="font-bold text-sm">Vercel</span>
                                        {!hasSavedToken.vercel && <span className="text-[10px] text-amber-400">Setup required</span>}
                                    </button>

                                    <button
                                        onClick={() => setPlatform('netlify')}
                                        className={`p-4 rounded-xl border flex flex-col items-center gap-3 transition-all relative ${platform === 'netlify' ? 'bg-[#00C7B7] text-black border-[#00C7B7]' : 'bg-[#171717] text-neutral-400 border-[#262626] hover:bg-[#202020]'}`}
                                    >
                                        {hasSavedToken.netlify && (
                                            <span className="absolute top-2 right-2 w-2 h-2 bg-green-500 rounded-full" title="Connected" />
                                        )}
                                        <svg viewBox="0 0 24 24" className="w-8 h-8" fill="currentColor">
                                            <path d="M6.49 19.09h-.02l.02.02v-.02Z" /><path d="M20.25 5.86a2.83 2.83 0 0 0-2.07-2.05A3.89 3.89 0 0 0 16.7 3.5a5.53 5.53 0 0 0-3.32.19 3.16 3.16 0 0 0-1.28.91 3.58 3.58 0 0 0-.57 1.34 2.82 2.82 0 0 0 .34 2.12 3.1 3.1 0 0 0 1.76 1.3 5.56 5.56 0 0 0 3.32-.19 3.87 3.87 0 0 0 2.22-2.19 2.8 2.8 0 0 0 1.08-1.12ZM7.78 18.25l-.01.01.01.01v-.02ZM12.33 13.9a3.56 3.56 0 0 0-1.34-.57 3.13 3.13 0 0 0-2.12.34 2.8 2.8 0 0 0-1.3 1.76 3.88 3.88 0 0 0 .19 3.32A2.8 2.8 0 0 0 9.88 20.8a3.1 3.1 0 0 0 2.19-2.22 3.55 3.55 0 0 0 .26-2.68Z" /><path d="M11.66 9.77a3.59 3.59 0 0 0-.58-1.34 3.13 3.13 0 0 0-1.29-.91 3.88 3.88 0 0 0-3.32-.19A2.8 2.8 0 0 0 4.25 8.4a3.13 3.13 0 0 0-.34 2.12 3.55 3.55 0 0 0 1.91 2.22 2.8 2.8 0 0 0 2.07 2.05 3.92 3.92 0 0 0 1.48.31 5.48 5.48 0 0 0 1.84-.31 3.12 3.12 0 0 0 1.29-.91 3.58 3.58 0 0 0 .57-1.34 2.83 2.83 0 0 0-.34-2.12 3.1 3.1 0 0 0-1.07-1.65Z" />
                                        </svg>
                                        <span className="font-bold text-sm">Netlify</span>
                                        {!hasSavedToken.netlify && <span className="text-[10px] text-amber-400">Setup required</span>}
                                    </button>

                                    <button
                                        onClick={() => setPlatform('github-pages')}
                                        className={`p-4 rounded-xl border flex flex-col items-center gap-3 transition-all relative ${platform === 'github-pages' ? 'bg-[#24292f] text-white border-[#24292f]' : 'bg-[#171717] text-neutral-400 border-[#262626] hover:bg-[#202020]'}`}
                                    >
                                        {hasSavedToken['github-pages'] && (
                                            <span className="absolute top-2 right-2 w-2 h-2 bg-green-500 rounded-full" title="Connected" />
                                        )}
                                        <Github size={32} />
                                        <span className="font-bold text-sm">GitHub Pages</span>
                                        {!hasSavedToken['github-pages'] && <span className="text-[10px] text-amber-400">Setup required</span>}
                                    </button>
                                </div>

                                {!hasSavedToken[platform] && (
                                    <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl">
                                        <p className="text-sm text-amber-400">
                                            You need to connect your {platform === 'github-pages' ? 'GitHub' : platform} account first.
                                            Go to <a href="/settings" target="_blank" rel="noopener noreferrer" className="underline font-semibold">Settings &gt; Integrations</a> to add your API token.
                                        </p>
                                    </div>
                                )}

                                <div className="bg-[#171717] p-4 rounded-xl border border-[#262626]">
                                    <h3 className="text-white text-sm font-semibold mb-2">Build Configuration</h3>
                                    <div className="grid grid-cols-2 gap-4 text-xs text-neutral-400">
                                        <div>
                                            <span className="block text-neutral-500 mb-1">Output Directory</span>
                                            <span className="text-white font-mono bg-black px-2 py-1 rounded">/dist</span>
                                        </div>
                                        <div>
                                            <span className="block text-neutral-500 mb-1">Framework</span>
                                            <span className="text-white font-mono bg-black px-2 py-1 rounded">Static HTML</span>
                                        </div>
                                    </div>
                                </div>

                                <button
                                    onClick={() => handleDeploy()}
                                    disabled={!hasSavedToken[platform]}
                                    className="w-full py-4 bg-primary text-black font-bold text-sm rounded-xl hover:bg-opacity-90 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <Rocket size={18} />
                                    {hasSavedToken[platform] ? 'Start Deployment' : 'Connect Account First'}
                                </button>
                            </div>
                        )}

                        {step === 'deploying' && (
                            <div className="bg-black rounded-xl border border-[#262626] p-4 font-mono text-xs h-[300px] overflow-y-auto custom-scrollbar">
                                <div className="flex items-center gap-2 text-neutral-500 mb-4 pb-2 border-b border-[#262626]">
                                    <Terminal size={14} />
                                    <span>Deployment Logs</span>
                                </div>
                                {logs.map((log, idx) => (
                                    <motion.div
                                        key={idx}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        className="mb-2 text-green-400"
                                    >
                                        {log}
                                    </motion.div>
                                ))}
                                <div ref={logsEndRef} />
                            </div>
                        )}

                        {step === 'name-conflict' && (
                            <div className="space-y-6">
                                <div className="text-center">
                                    <div className="w-16 h-16 bg-amber-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <span className="text-3xl">⚠️</span>
                                    </div>
                                    <h3 className="text-xl font-bold text-white mb-2">Project Name Exists</h3>
                                    <p className="text-neutral-400 text-sm">
                                        A project named <span className="text-amber-400 font-mono">"{conflictingName}"</span> already exists on Vercel.
                                    </p>
                                </div>

                                <div className="bg-[#171717] p-4 rounded-xl border border-[#262626]">
                                    <label className="block text-sm font-semibold text-white mb-2">New Project Name</label>
                                    <input
                                        type="text"
                                        value={customProjectName}
                                        onChange={(e) => setCustomProjectName(e.target.value)}
                                        className="w-full px-4 py-3 bg-black border border-[#262626] rounded-lg text-white font-mono text-sm focus:border-primary focus:outline-none"
                                        placeholder="my-awesome-project"
                                    />
                                    <p className="text-xs text-neutral-500 mt-2">Use lowercase letters, numbers, and hyphens only.</p>
                                </div>

                                <div className="flex gap-3">
                                    <button
                                        onClick={() => setStep('config')}
                                        className="flex-1 py-3 bg-[#171717] text-white font-bold text-sm rounded-xl border border-[#262626] hover:bg-[#202020] transition-all"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={() => handleDeploy(customProjectName)}
                                        disabled={!customProjectName.trim()}
                                        className="flex-1 py-3 bg-primary text-black font-bold text-sm rounded-xl hover:bg-opacity-90 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                                    >
                                        <Rocket size={16} />
                                        Deploy with New Name
                                    </button>
                                </div>
                            </div>
                        )}

                        {step === 'success' && (
                            <div className="text-center py-8">
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6"
                                >
                                    <CheckCircle size={40} className="text-green-500" />
                                </motion.div>
                                <h3 className="text-2xl font-bold text-white mb-2">Deployment Complete!</h3>
                                <p className="text-neutral-400 mb-8 max-w-sm mx-auto">Your project is now live and accessible worldwide.</p>

                                <div className="flex flex-col gap-3 max-w-xs mx-auto">
                                    {deployedUrl ? (
                                        <a
                                            href={deployedUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="w-full py-3 bg-white text-black font-bold text-sm rounded-xl hover:bg-neutral-200 transition-all flex items-center justify-center gap-2"
                                        >
                                            <Globe size={18} />
                                            Visit Live Site
                                        </a>
                                    ) : null}
                                    <button
                                        onClick={handleDownload}
                                        className="w-full py-3 bg-[#171717] text-white font-bold text-sm rounded-xl border border-[#262626] hover:bg-[#202020] transition-all flex items-center justify-center gap-2"
                                    >
                                        <Download size={18} />
                                        Download Package
                                    </button>
                                </div>
                            </div>
                        )}

                        {step === 'error' && (
                            <div className="text-center py-8">
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6"
                                >
                                    <X size={40} className="text-red-500" />
                                </motion.div>
                                <h3 className="text-2xl font-bold text-white mb-2">Deployment Failed</h3>
                                <p className="text-neutral-400 mb-8 max-w-sm mx-auto">Something went wrong during deployment. Check the logs for details.</p>

                                <div className="flex flex-col gap-3 max-w-xs mx-auto">
                                    <button
                                        onClick={() => setStep('config')}
                                        className="w-full py-3 bg-white text-black font-bold text-sm rounded-xl hover:bg-neutral-200 transition-all flex items-center justify-center gap-2"
                                    >
                                        <Rocket size={18} />
                                        Try Again
                                    </button>
                                    <button
                                        onClick={handleDownload}
                                        className="w-full py-3 bg-[#171717] text-white font-bold text-sm rounded-xl border border-[#262626] hover:bg-[#202020] transition-all flex items-center justify-center gap-2"
                                    >
                                        <Download size={18} />
                                        Download Package
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};
