import React, { useState } from 'react';
import {
    Users, BarChart2, Mail, Settings, Bell, Search, Filter,
    RefreshCcw, MoreHorizontal, ArrowUpRight, CheckCircle,
    ChevronRight, Download, PlusCircle
} from 'lucide-react';

// Mock Data
const MOCK_USERS = [
    { id: 1, name: "John Doe", email: "john.doe@example.com", source: "Twitter Campaign", date: "Oct 24, 2023", time: "10:42 AM", score: 85, status: "pending", initials: "JD", color: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20" },
    { id: 2, name: "Alice Smith", email: "alice.smith@design.io", source: "Organic Search", date: "Oct 24, 2023", time: "09:15 AM", score: 12, status: "invited", initials: "AS", color: "bg-pink-500/10 text-pink-400 border-pink-500/20" },
    { id: 3, name: "Mike K.", email: "mike.k@startup.com", source: "Product Hunt", date: "Oct 23, 2023", time: "06:30 PM", score: 92, status: "waitlisted", initials: "MK", color: "bg-sky-500/10 text-sky-400 border-sky-500/20" },
    { id: 4, name: "Emma L.", email: "emma.l@agency.net", source: "LinkedIn", date: "Oct 23, 2023", time: "04:12 PM", score: 45, status: "pending", initials: "EL", color: "bg-orange-500/10 text-orange-400 border-orange-500/20" },
];

// ... (imports remain the same, kept implicit for replacement if inside the component, but here I'm replacing the component body)

const SubViewHeader = ({ title, subtitle, actions }: any) => (
    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div>
            <h1 className="text-2xl sm:text-3xl text-white font-medium tracking-tight mb-2">{title}</h1>
            <p className="text-sm text-neutral-500">{subtitle}</p>
        </div>
        {actions && <div className="flex items-center gap-3">{actions}</div>}
    </div>
);

export const AdminPage = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [password, setPassword] = useState('');
    const [activeTab, setActiveTab] = useState('waitlist');

    // Simple Auth Protection
    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (password === 'admin123') {
            setIsAuthenticated(true);
        } else {
            alert('Invalid password');
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
                <StatsCard icon={Users} title="Total Waitlist" value="14,203" sub="12%" subColor="text-emerald-500" />
                <StatsCard icon={Mail} title="Pending Invites" value="3,891" sub="approx. 4 days" subColor="text-neutral-500" />
                <StatsCard icon={CheckCircle} title="Conversion Rate" value="42.8%" sub="2.1%" subColor="text-emerald-500" />
            </div>

            <div className="flex flex-col sm:flex-row justify-between gap-4 py-2">
                <div className="relative group w-full sm:w-64">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search size={14} className="text-neutral-600 group-focus-within:text-white transition-colors" />
                    </div>
                    <input type="text" className="block w-full pl-9 pr-3 py-2 border border-neutral-800 rounded bg-black text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-neutral-600 focus:ring-0 transition-colors" placeholder="Search email or name..." />
                </div>

                <div className="flex items-center gap-2">
                    <button className="flex items-center gap-2 px-3 py-2 bg-[#0a0a0a] border border-neutral-800 rounded text-xs text-neutral-300 hover:text-white transition-colors">
                        <Filter size={14} /> Status: All
                    </button>
                    <div className="h-4 w-px bg-neutral-800 mx-1"></div>
                    <button className="p-2 text-neutral-500 hover:text-white transition-colors rounded hover:bg-neutral-900">
                        <RefreshCcw size={14} />
                    </button>
                </div>
            </div>

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
                                <th className="py-3 px-6 text-xs font-medium text-neutral-500 uppercase tracking-wider">Referral Score</th>
                                <th className="py-3 px-6 text-xs font-medium text-neutral-500 uppercase tracking-wider">Status</th>
                                <th className="py-3 px-6 text-xs font-medium text-neutral-500 uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-800">
                            {MOCK_USERS.map((user) => (
                                <tr key={user.id} className="group hover:bg-neutral-900/50 transition-colors">
                                    <td className="py-4 px-6">
                                        <div className="w-4 h-4 border border-neutral-700 rounded bg-transparent flex items-center justify-center cursor-pointer hover:border-neutral-500 group-hover:border-neutral-600"></div>
                                    </td>
                                    <td className="py-4 px-6">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-8 h-8 rounded-full border flex items-center justify-center text-xs font-medium ${user.color}`}>
                                                {user.initials}
                                            </div>
                                            <div>
                                                <div className="text-sm font-medium text-white">{user.email}</div>
                                                <div className="text-xs text-neutral-600">{user.source}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-4 px-6">
                                        <div className="text-sm text-neutral-400">{user.date}</div>
                                        <div className="text-xs text-neutral-600">{user.time}</div>
                                    </td>
                                    <td className="py-4 px-6">
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm font-medium text-white">{user.score}</span>
                                            <div className="w-16 h-1 bg-neutral-800 rounded-full overflow-hidden">
                                                <div className="h-full bg-white" style={{ width: `${user.score}%` }}></div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-4 px-6">
                                        <StatusBadge status={user.status} />
                                    </td>
                                    <td className="py-4 px-6 text-right">
                                        <button className="text-neutral-500 hover:text-white transition-colors">
                                            <MoreHorizontal size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="px-6 py-4 border-t border-neutral-800 flex items-center justify-between">
                    <span className="text-xs text-neutral-500">Showing 1-4 of 14,203</span>
                    <div className="flex items-center gap-2">
                        <button className="px-3 py-1 text-xs font-medium text-neutral-400 hover:text-white bg-transparent border border-neutral-800 hover:border-neutral-700 rounded transition-all disabled:opacity-50">Previous</button>
                        <button className="px-3 py-1 text-xs font-medium text-neutral-400 hover:text-white bg-transparent border border-neutral-800 hover:border-neutral-700 rounded transition-all">Next</button>
                    </div>
                </div>
            </div>
        </div>
    );

    const renderAnalytics = () => (
        <div className="space-y-8 animate-in fade-in duration-500">
            <SubViewHeader title="Analytics" subtitle="Performance metrics and growth data." />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="h-64 bg-[#0a0a0a] border border-neutral-900 rounded-xl p-6 flex items-center justify-center relative overflow-hidden group">
                    {/* Fake Graph */}
                    <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-emerald-500/10 to-transparent"></div>
                    <div className="w-full h-32 flex items-end gap-2 px-4">
                        {[40, 60, 45, 70, 50, 80, 65, 85, 90, 75, 60, 95].map((h, i) => (
                            <div key={i} className="flex-1 bg-neutral-800 hover:bg-emerald-500 transition-colors rounded-t-sm" style={{ height: `${h}%` }}></div>
                        ))}
                    </div>
                    <div className="absolute top-6 left-6">
                        <h3 className="text-sm font-medium text-neutral-400 mb-1">Daily Signups</h3>
                        <p className="text-2xl font-bold text-white">245 <span className="text-xs text-emerald-500 font-normal">+14%</span></p>
                    </div>
                </div>
                <div className="h-64 bg-[#0a0a0a] border border-neutral-900 rounded-xl p-6 flex flex-col justify-center">
                    <h3 className="text-sm font-medium text-neutral-400 mb-6">Traffic Sources</h3>
                    <div className="space-y-4">
                        {[
                            { label: 'Direct', val: 45, color: 'bg-indigo-500' },
                            { label: 'Social', val: 32, color: 'bg-pink-500' },
                            { label: 'Referral', val: 23, color: 'bg-amber-500' }
                        ].map((item) => (
                            <div key={item.label}>
                                <div className="flex justify-between text-xs mb-1">
                                    <span className="text-neutral-300">{item.label}</span>
                                    <span className="text-neutral-500">{item.val}%</span>
                                </div>
                                <div className="w-full h-2 bg-neutral-900 rounded-full overflow-hidden">
                                    <div className={`h-full rounded-full ${item.color}`} style={{ width: `${item.val}%` }}></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );

    const renderCampaigns = () => (
        <div className="space-y-8 animate-in fade-in duration-500">
            <SubViewHeader
                title="Campaigns"
                subtitle="Track marketing campaigns and referral programs."
                actions={
                    <button className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-neutral-200 text-black text-xs font-medium rounded border border-white transition-all">
                        <PlusCircle size={14} /> New Campaign
                    </button>
                }
            />
            <div className="space-y-4">
                {[
                    { name: "Winter Product Hunt Launch", status: "Active", sent: 12500, click: "4.2%", open: "28%" },
                    { name: "Developer Newsletter Q1", status: "Scheduled", sent: 0, click: "-", open: "-" },
                    { name: "Beta User Invite Wave 3", status: "Completed", sent: 5000, click: "12%", open: "65%" }
                ].map((camp, i) => (
                    <div key={i} className="p-4 bg-[#0a0a0a] border border-neutral-900 rounded-lg flex items-center justify-between group hover:border-neutral-700 transition-colors">
                        <div>
                            <h3 className="text-sm font-medium text-white mb-1 group-hover:text-emerald-400 transition-colors">{camp.name}</h3>
                            <div className="flex items-center gap-4 text-xs text-neutral-500">
                                <span className={camp.status === 'Active' ? 'text-emerald-500' : ''}>{camp.status}</span>
                                <span>{camp.sent.toLocaleString()} recipients</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-8 text-right">
                            <div>
                                <div className="text-xs text-neutral-500">Open Rate</div>
                                <div className="text-sm font-medium text-white">{camp.open}</div>
                            </div>
                            <div>
                                <div className="text-xs text-neutral-500">Click Rate</div>
                                <div className="text-sm font-medium text-white">{camp.click}</div>
                            </div>
                            <ChevronRight size={16} className="text-neutral-700" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    const renderSettings = () => (
        <div className="space-y-8 animate-in fade-in duration-500 max-w-2xl">
            <SubViewHeader title="Settings" subtitle="Configure platform preferences." />

            <div className="bg-[#0a0a0a] border border-neutral-900 rounded-xl overflow-hidden divide-y divide-neutral-900">
                <div className="p-6 flex items-center justify-between">
                    <div>
                        <h3 className="text-sm font-medium text-white mb-1">Email Notifications</h3>
                        <p className="text-xs text-neutral-500">Receive daily summaries of new signups.</p>
                    </div>
                    <div className="w-10 h-5 bg-emerald-500/20 rounded-full relative cursor-pointer border border-emerald-500/50">
                        <div className="absolute right-0.5 top-0.5 bottom-0.5 w-4 bg-emerald-500 rounded-full shadow-sm"></div>
                    </div>
                </div>
                <div className="p-6 flex items-center justify-between">
                    <div>
                        <h3 className="text-sm font-medium text-white mb-1">Public Waitlist</h3>
                        <p className="text-xs text-neutral-500">Show exact position to users.</p>
                    </div>
                    <div className="w-10 h-5 bg-neutral-800 rounded-full relative cursor-pointer border border-neutral-700">
                        <div className="absolute left-0.5 top-0.5 bottom-0.5 w-4 bg-neutral-500 rounded-full shadow-sm"></div>
                    </div>
                </div>
                <div className="p-6">
                    <h3 className="text-sm font-medium text-white mb-4">API Configuration</h3>
                    <div className="space-y-3">
                        <div>
                            <label className="text-xs text-neutral-500 block mb-1">Webhook URL</label>
                            <input type="text" className="w-full bg-black border border-neutral-800 rounded px-3 py-2 text-sm text-white focus:border-neutral-600 outline-none" defaultValue="https://api.noir.dev/hooks/waitlist" />
                        </div>
                        <button className="text-xs text-emerald-500 hover:text-emerald-400 font-medium">Generate New Key</button>
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <div className="bg-black text-neutral-400 font-sans antialiased h-screen flex overflow-hidden selection:bg-neutral-800 selection:text-white">

            {/* Sidebar */}
            <aside className="w-64 border-r border-neutral-900 bg-[#0a0a0a] flex-col justify-between hidden md:flex">
                <div>
                    <div className="h-16 flex items-center px-6 border-b border-neutral-900">
                        <span className="text-white font-semibold tracking-tighter text-lg">WAITLST</span>
                    </div>

                    <nav className="p-4 space-y-1">
                        <button onClick={() => setActiveTab('waitlist')} className={`w-full flex items-center gap-3 px-3 py-2 rounded-md transition-colors text-sm font-medium ${activeTab === 'waitlist' ? 'bg-neutral-900 border border-neutral-800 text-white' : 'hover:bg-neutral-900/50 hover:text-neutral-200'}`}>
                            <Users size={18} />
                            Waitlist
                        </button>
                        <button onClick={() => setActiveTab('analytics')} className={`w-full flex items-center gap-3 px-3 py-2 rounded-md transition-colors text-sm font-medium ${activeTab === 'analytics' ? 'bg-neutral-900 border border-neutral-800 text-white' : 'hover:bg-neutral-900/50 hover:text-neutral-200'}`}>
                            <BarChart2 size={18} />
                            Analytics
                        </button>
                        <button onClick={() => setActiveTab('campaigns')} className={`w-full flex items-center gap-3 px-3 py-2 rounded-md transition-colors text-sm font-medium ${activeTab === 'campaigns' ? 'bg-neutral-900 border border-neutral-800 text-white' : 'hover:bg-neutral-900/50 hover:text-neutral-200'}`}>
                            <Mail size={18} />
                            Campaigns
                        </button>
                        <button onClick={() => setActiveTab('settings')} className={`w-full flex items-center gap-3 px-3 py-2 rounded-md transition-colors text-sm font-medium ${activeTab === 'settings' ? 'bg-neutral-900 border border-neutral-800 text-white' : 'hover:bg-neutral-900/50 hover:text-neutral-200'}`}>
                            <Settings size={18} />
                            Settings
                        </button>
                    </nav>
                </div>

                <div className="p-4 border-t border-neutral-900">
                    <div className="flex items-center gap-3 px-3 py-2">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-neutral-700 to-neutral-800 flex items-center justify-center text-xs text-white border border-neutral-700">
                            AD
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xs text-white font-medium">Admin User</span>
                            <span className="text-[10px] text-neutral-500">Pro Plan</span>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col min-w-0 bg-black relative">

                {/* Top Bar */}
                <header className="h-16 border-b border-neutral-900 flex items-center justify-between px-4 sm:px-8 bg-black/50 backdrop-blur-sm sticky top-0 z-20">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-white capitalize">{activeTab}</span>
                            <ChevronRight size={14} className="text-neutral-600" />
                            <span className="text-sm text-neutral-500">Realtime View</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-500/5 border border-emerald-500/20">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                            </span>
                            <span className="text-xs font-medium text-emerald-500 tracking-wide uppercase">Live Updates</span>
                        </div>
                        <div className="h-4 w-px bg-neutral-800"></div>
                        <button className="text-neutral-400 hover:text-white transition-colors">
                            <Bell size={18} />
                        </button>
                    </div>
                </header>

                {/* Content Body */}
                <div className="flex-1 overflow-y-auto p-4 sm:p-8">
                    <div className="max-w-6xl mx-auto">
                        {activeTab === 'waitlist' && renderWaitlist()}
                        {activeTab === 'analytics' && renderAnalytics()}
                        {activeTab === 'campaigns' && renderCampaigns()}
                        {activeTab === 'settings' && renderSettings()}
                    </div>
                </div>
            </main>
        </div>
    );
};

const StatsCard = ({ icon: Icon, title, value, sub, subColor }: any) => (
    <div className="p-5 rounded-lg border border-neutral-900 bg-[#0a0a0a] relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <Icon size={48} />
        </div>
        <p className="text-xs font-medium text-neutral-500 uppercase tracking-wide mb-1">{title}</p>
        <div className="flex items-baseline gap-2">
            <span className="text-2xl font-semibold text-white tracking-tight">{value}</span>
            <span className={`text-xs font-medium flex items-center ${subColor}`}>
                {sub.includes('%') && <ArrowUpRight size={12} className="mr-0.5" />}
                {sub}
            </span>
        </div>
    </div>
);

const StatusBadge = ({ status }: { status: string }) => {
    const styles: any = {
        pending: "bg-amber-500/10 text-amber-500 border-amber-500/20",
        invited: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
        waitlisted: "bg-neutral-800 text-neutral-400 border-neutral-700"
    };

    const colors: any = {
        pending: "bg-amber-500",
        invited: "bg-emerald-500",
        waitlisted: "bg-neutral-400"
    };

    return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${styles[status]}`}>
            <div className={`w-1 h-1 rounded-full ${colors[status]}`}></div>
            {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
    );
};
