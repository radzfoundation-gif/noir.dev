import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Lock, Eye, Loader2, AlertCircle, Code2 } from 'lucide-react';
import { teamService } from '../lib/teamService';
import { supabase } from '../lib/supabase';

interface SharedProject {
    id: string;
    name: string;
    code: string;
    framework: string;
}

export const SharedProjectPage = () => {
    const { token } = useParams<{ token: string }>();
    const [project, setProject] = useState<SharedProject | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [requiresPassword, setRequiresPassword] = useState(false);
    const [password, setPassword] = useState('');
    const [verifying, setVerifying] = useState(false);

    useEffect(() => {
        if (token) {
            checkShareLink(token);
        }
    }, [token]);

    const checkShareLink = async (shareToken: string) => {
        try {
            // First check if link exists and is valid
            const { data: share, error: shareError } = await supabase
                .from('project_shares')
                .select('*')
                .eq('share_link_token', shareToken)
                .single();

            if (shareError || !share) {
                setError('This share link is invalid or has expired.');
                setLoading(false);
                return;
            }

            // Check expiration
            if (share.expires_at && new Date(share.expires_at) < new Date()) {
                setError('This share link has expired.');
                setLoading(false);
                return;
            }

            // Check if password protected
            if (share.password_protected) {
                setRequiresPassword(true);
                setLoading(false);
                return;
            }

            // Load project
            await loadProject(share.project_id);
        } catch (err) {
            console.error('Error checking share link:', err);
            setError('Failed to load shared project.');
            setLoading(false);
        }
    };

    const loadProject = async (projectId: string) => {
        try {
            const { data: projectData, error: projectError } = await supabase
                .from('projects')
                .select('id, name, code, framework')
                .eq('id', projectId)
                .single();

            if (projectError) throw projectError;

            // Helper function to ensure Tailwind CDN is included
            const ensureTailwindCDN = (htmlCode: string): string => {
                if (!htmlCode || htmlCode.includes('tailwindcss') || htmlCode.includes('tailwind.css')) {
                    return htmlCode;
                }

                const hasTailwindClasses = /class="[^"]*(?:flex|grid|text-|bg-|p-\d|m-\d|rounded|shadow|border|w-|h-|gap-|space-|items-|justify-)[^"]*"/.test(htmlCode);
                if (!hasTailwindClasses) {
                    return htmlCode;
                }

                let result = htmlCode;
                const tailwindCDN = '<script src="https://cdn.tailwindcss.com"></script>';
                const googleFonts = '<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">';

                if (result.includes('</head>')) {
                    result = result.replace('</head>', `${tailwindCDN}\n${googleFonts}\n</head>`);
                } else if (result.includes('<head>')) {
                    result = result.replace('<head>', `<head>\n${tailwindCDN}\n${googleFonts}`);
                } else if (result.includes('<!DOCTYPE html>') || result.includes('<html')) {
                    result = result.replace(/(<html[^>]*>)/i, `$1\n<head>${tailwindCDN}${googleFonts}</head>`);
                }

                return result;
            };

            // Ensure Tailwind CDN is included for proper rendering
            const enhancedCode = ensureTailwindCDN(projectData.code);
            setProject({
                ...projectData,
                code: enhancedCode
            });
            setLoading(false);

            // Update access count - fetch current count first then increment
            if (token) {
                const { data: shareData } = await supabase
                    .from('project_shares')
                    .select('access_count')
                    .eq('share_link_token', token)
                    .single();

                if (shareData) {
                    await supabase
                        .from('project_shares')
                        .update({
                            access_count: (shareData.access_count || 0) + 1,
                            last_accessed_at: new Date().toISOString()
                        })
                        .eq('share_link_token', token);
                }
            }
        } catch (err) {
            console.error('Error loading project:', err);
            setError('Failed to load project.');
            setLoading(false);
        }
    };

    const handlePasswordSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!token) return;

        setVerifying(true);
        try {
            const share = await teamService.validateShareLink(token, password);
            if (share) {
                await loadProject(share.project_id);
                setRequiresPassword(false);
            } else {
                setError('Invalid password.');
            }
        } catch (err) {
            setError('Failed to verify password.');
        } finally {
            setVerifying(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="w-12 h-12 text-lime-400 animate-spin mx-auto mb-4" />
                    <p className="text-neutral-400">Loading shared project...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4">
                <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-8 max-w-md w-full text-center">
                    <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-4">
                        <AlertCircle className="w-8 h-8 text-red-400" />
                    </div>
                    <h1 className="text-xl font-semibold text-white mb-2">Access Denied</h1>
                    <p className="text-neutral-400">{error}</p>
                </div>
            </div>
        );
    }

    if (requiresPassword) {
        return (
            <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4">
                <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-8 max-w-md w-full">
                    <div className="text-center mb-6">
                        <div className="w-16 h-16 rounded-full bg-lime-500/10 flex items-center justify-center mx-auto mb-4">
                            <Lock className="w-8 h-8 text-lime-400" />
                        </div>
                        <h1 className="text-xl font-semibold text-white mb-2">Password Protected</h1>
                        <p className="text-neutral-400">Enter the password to view this project.</p>
                    </div>

                    <form onSubmit={handlePasswordSubmit} className="space-y-4">
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter password"
                            className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-lime-500"
                            required
                        />
                        <button
                            type="submit"
                            disabled={verifying}
                            className="w-full bg-lime-500 hover:bg-lime-400 text-black font-medium py-3 rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {verifying ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Verifying...
                                </>
                            ) : (
                                <>
                                    <Eye className="w-4 h-4" />
                                    View Project
                                </>
                            )}
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    if (!project) {
        return (
            <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
                <div className="text-neutral-400">Project not found.</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0a0a0a]">
            {/* Header */}
            <header className="border-b border-neutral-800 bg-neutral-900/50 backdrop-blur-sm sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-lime-500/10 flex items-center justify-center">
                            <Code2 className="w-4 h-4 text-lime-400" />
                        </div>
                        <div>
                            <h1 className="text-white font-medium">{project.name}</h1>
                            <p className="text-xs text-neutral-500">Shared Project • {project.framework.toUpperCase()}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-neutral-400">
                        <Eye className="w-4 h-4" />
                        View Only
                    </div>
                </div>
            </header>

            {/* Preview */}
            <div className="h-[calc(100vh-60px)]">
                <iframe
                    srcDoc={project.code}
                    className="w-full h-full border-0 bg-white"
                    title={project.name}
                />
            </div>
        </div>
    );
};
