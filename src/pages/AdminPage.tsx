import { useState, useEffect, useCallback } from 'react';
import { io } from 'socket.io-client';
import { motion } from 'framer-motion';
import {
    Users, BarChart2, Mail, MoreHorizontal, CheckCircle,
    Download, PlusCircle, Trash2
} from 'lucide-react';
import { NoirLogo } from '../components/NoirLogo';

const SubViewHeader = ({ title, subtitle, actions }: any) => (
    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div>
            <h1 className="text-2xl sm:text-3xl text-white font-medium tracking-tight mb-2">{title}</h1>
            <p className="text-sm text-neutral-500">{subtitle}</p>
        </div>
        {actions && <div className="flex items-center gap-3">{actions}</div>}
    </div>
);

const API_URL = import.meta.env.VITE_API_URL || '';

export const AdminPage = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [password, setPassword] = useState('');
    const [activeTab, setActiveTab] = useState('waitlist');
    const [users, setUsers] = useState<any[]>([]);
    const [stats, setStats] = useState({ total: 0, pending: 0, invited: 0 });

    const fetchData = useCallback(async () => {
        try {
            const [uRes, sRes] = await Promise.all([
                fetch(`${API_URL}/api/waitlist/users`),
                fetch(`${API_URL}/api/waitlist/stats`)
            ]);
            setUsers(await uRes.json());
            setStats(await sRes.json());
        } catch (err) { console.error("Fetch Data Error:", err); }
    }, []); // No dependencies, as setUsers and setStats are stable

    useEffect(() => {
        if (!isAuthenticated) return;

        fetchData();

        // Socket.io only works in development (Vercel doesn't support persistent WebSocket connections)
        let socket: ReturnType<typeof io> | null = null;
        if (import.meta.env.DEV && API_URL) {
            socket = io(API_URL);
            socket.on('waitlistUpdated', () => {
                console.log("Real-time Update Received via Socket");
                fetchData();
            });
        }

        return () => { socket?.disconnect(); };
    }, [isAuthenticated, fetchData]);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (password === 'admin123') {
            setIsAuthenticated(true);
        } else {
            alert('Invalid password');
        }
    };

    const handleDeleteUser = async (id: string, email: string) => {
        if (!window.confirm(`Hapus user ${email} dari waitlist?`)) return;

        try {
            const res = await fetch(`${API_URL}/api/waitlist/users/${id}`, {
                method: 'DELETE'
            });
            if (res.ok) {
                // We could rely purely on the socket event,
                // but updating local state immediately feels faster
                setUsers(prev => prev.filter(u => u.id !== id));
                fetchData(); // Sync everything
            }
        } catch (err) {
            console.error("Delete failed", err);
        }
    };

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center p-4">
                <div className="w-full max-w-sm bg-zinc-900 border border-zinc-800 rounded-xl p-8 shadow-2xl">
                    <h2 className="text-xl font-bold text-white mb-6 text-center">Admin Access</h2>
                    <form onSubmit={handleLogin} className="space-y-4">
                        <div>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter admin password"
                                className="w-full bg-black border border-zinc-800 rounded-lg px-4 py-3 text-white focus:border-lime-500 focus:outline-none transition-colors"
                            />
                        </div>
                        <button type="submit" className="w-full bg-white text-black font-bold py-3 rounded-lg hover:bg-zinc-200 transition-colors">
                            Login
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    const renderWaitlist = () => (
        <div className="space-y-8 animate-in fade-in duration-500">
            <SubViewHeader
                title="Waitlist Status"
                subtitle="Manage incoming requests and invitations."
                actions={
                    <>
                        <button className="flex items-center gap-2 px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-medium rounded border border-neutral-800 transition-all">
                            <Download size={14} /> Export CSV
                        </button>
                        <button className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-neutral-200 text-black text-xs font-medium rounded border border-white transition-all">
                            <PlusCircle size={14} /> Invite Users
                        </button>
                    </>
                }
            />

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <StatsCard icon={Users} title="Total Waitlist" value={stats.total.toLocaleString()} sub="+100%" subColor="text-emerald-500" />
                <StatsCard icon={Mail} title="Pending Invites" value={stats.pending.toLocaleString()} sub="approx. 4 days" subColor="text-neutral-500" />
                <StatsCard icon={CheckCircle} title="Conversion Rate" value={`${((stats.invited / (stats.total || 1)) * 100).toFixed(1)}%`} sub="Real" subColor="text-emerald-500" />
            </div>

            {/* List and other components as they were... */}
            <div className="border border-neutral-800 rounded-lg overflow-hidden bg-[#0a0a0a]/50">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-neutral-800 bg-neutral-900/50">
                                <th className="py-3 px-6 w-10">
                                    <div className="w-4 h-4 border border-neutral-700 rounded bg-transparent flex items-center justify-center cursor-pointer hover:border-neutral-500"></div>
                                </th>
                                <th className="py-3 px-6 text-xs font-medium text-neutral-500 uppercase tracking-wider">User</th>
                                <th className="py-3 px-6 text-xs font-medium text-neutral-500 uppercase tracking-wider">Date Joined</th>
                                <th className="py-3 px-6 text-xs font-medium text-neutral-500 uppercase tracking-wider">Status</th>
                                <th className="py-3 px-6 text-xs font-medium text-neutral-500 uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-800">
                            {users.map((user) => (
                                <tr key={user.id} className="group hover:bg-neutral-900/50 transition-colors">
                                    <td className="py-4 px-6">
                                        <div className="w-4 h-4 border border-neutral-700 rounded bg-transparent flex items-center justify-center cursor-pointer hover:border-neutral-500 group-hover:border-neutral-600"></div>
                                    </td>
                                    <td className="py-4 px-6">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-8 h-8 rounded-full border flex items-center justify-center text-xs font-bold bg-indigo-500/10 text-indigo-400 border-indigo-500/20`}>
                                                {(user.name || 'A').charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <div className="text-sm font-medium text-white">{user.email}</div>
                                                <div className="text-xs text-neutral-600 truncate max-w-[150px]">{user.source}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-4 px-6">
                                        <div className="text-sm text-neutral-400">{user.date}</div>
                                        <div className="text-xs text-neutral-600">{user.time}</div>
                                    </td>
                                    <td className="py-4 px-6">
                                        <StatusBadge status={user.status} />
                                    </td>
                                    <td className="py-4 px-6 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={() => handleDeleteUser(user.id, user.email)}
                                                className="p-2 text-neutral-500 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
                                                title="Delete User"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                            <button className="p-2 text-neutral-500 hover:text-white hover:bg-neutral-800 rounded-lg transition-all">
                                                <MoreHorizontal size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );

    const renderAnalytics = () => (
        <div className="space-y-8 animate-in fade-in duration-500">
            <SubViewHeader title="Analytics" subtitle="Performance metrics and growth data." />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="h-64 bg-[#0a0a0a] border border-neutral-900 rounded-xl p-6 flex items-center justify-center relative overflow-hidden group">
                    <div className="absolute top-6 left-6">
                        <h3 className="text-sm font-medium text-neutral-400 mb-1">Daily Signups</h3>
                        <p className="text-2xl font-bold text-white">245 <span className="text-xs text-emerald-500 font-normal">+14%</span></p>
                    </div>
                </div>
            </div>
        </div>
    );

    const renderCampaigns = () => (
        <div className="space-y-8 animate-in fade-in duration-500">
            <SubViewHeader title="Campaigns" subtitle="Track marketing campaigns and referral programs." />
            <p>No active campaigns.</p>
        </div>
    );

    const renderSettings = () => (
        <div className="space-y-8 animate-in fade-in duration-500 max-w-2xl">
            <SubViewHeader title="Settings" subtitle="Configure platform preferences." />
            <p>Admin settings here.</p>
        </div>
    );

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-black text-neutral-400 font-sans antialiased h-screen flex overflow-hidden selection:bg-neutral-800 selection:text-white"
        >
            <aside className="fixed inset-y-0 left-0 z-40 w-64 border-r border-neutral-900 bg-[#0a0a0a] flex flex-col justify-between transition-transform duration-300 md:translate-x-0 md:static -translate-x-full md:translate-x-0">
                <div>
                    <div className="h-16 flex items-center justify-between px-6 border-b border-neutral-900">
                        <div className="flex items-center gap-2">
                            <NoirLogo className="size-6" />
                            <span className="text-white font-semibold tracking-tighter text-lg">WAITLST</span>
                        </div>
                    </div>
                    <nav className="p-4 space-y-1">
                        <button onClick={() => setActiveTab('waitlist')} className={`w-full flex items-center gap-3 px-3 py-2 rounded-md transition-colors text-sm font-medium ${activeTab === 'waitlist' ? 'bg-neutral-900 text-white' : 'hover:bg-neutral-900/50'}`}>
                            <Users size={18} /> Waitlist
                        </button>
                        <button onClick={() => setActiveTab('analytics')} className={`w-full flex items-center gap-3 px-3 py-2 rounded-md transition-colors text-sm font-medium ${activeTab === 'analytics' ? 'bg-neutral-900 text-white' : 'hover:bg-neutral-900/50'}`}>
                            <BarChart2 size={18} /> Analytics
                        </button>
                    </nav>
                </div>
            </aside>
            <main className="flex-1 flex flex-col min-w-0 bg-black relative">
                <header className="h-16 border-b border-neutral-900 flex items-center justify-between px-8 bg-black/50 backdrop-blur-sm sticky top-0 z-20">
                    <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-white capitalize">{activeTab}</span>
                    </div>
                </header>
                <div className="flex-1 overflow-y-auto p-8">
                    <div className="max-w-6xl mx-auto">
                        {activeTab === 'waitlist' && renderWaitlist()}
                        {activeTab === 'analytics' && renderAnalytics()}
                        {activeTab === 'campaigns' && renderCampaigns()}
                        {activeTab === 'settings' && renderSettings()}
                    </div>
                </div>
            </main>
        </motion.div>
    );
};

const StatsCard = ({ title, value }: any) => (
    <div className="p-5 rounded-lg border border-neutral-900 bg-[#0a0a0a] relative overflow-hidden group">
        <p className="text-xs font-medium text-neutral-500 uppercase tracking-wide mb-1">{title}</p>
        <div className="flex items-baseline gap-2">
            <span className="text-2xl font-semibold text-white tracking-tight">{value}</span>
        </div>
    </div>
);

const StatusBadge = ({ status }: { status: string }) => {
    return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border`}>
            {status}
        </span>
    );
};
