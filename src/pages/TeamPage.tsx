import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Users, Plus, Settings, Crown, User, MoreVertical, Shield } from 'lucide-react';
import { teamService, type Team, type TeamMember, type TeamRole } from '../lib/teamService';
import { useAuth } from '../context/AuthContext';
import { TeamSettingsModal } from '../components/team/TeamSettingsModal';

const roleColors: Record<TeamRole, string> = {
    owner: 'text-yellow-400',
    admin: 'text-blue-400',
    editor: 'text-green-400',
    viewer: 'text-neutral-400',
};

const roleLabels: Record<TeamRole, string> = {
    owner: 'Owner',
    admin: 'Admin',
    editor: 'Editor',
    viewer: 'Viewer',
};

export function TeamPage() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [teams, setTeams] = useState<Team[]>([]);
    const [currentTeamId, setCurrentTeamId] = useState<string | undefined>();
    const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadUserTeams();
    }, []);

    const loadUserTeams = async () => {
        try {
            const userTeams = await teamService.getUserTeams();
            setTeams(userTeams);
            if (userTeams.length > 0 && !currentTeamId) {
                const firstTeam = userTeams[0];
                setCurrentTeamId(firstTeam.id);
                const members = await teamService.getTeamMembers(firstTeam.id);
                setTeamMembers(members);
            }
        } catch (err) {
            console.error('Failed to load teams:', err);
        } finally {
            setLoading(false);
        }
    };

    const currentTeam = teams.find(t => t.id === currentTeamId);
    const currentMembers = teamMembers;

    if (loading) {
        return (
            <div className="min-h-screen bg-neutral-950 flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-lime-400 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-neutral-950">
            <div className="max-w-5xl mx-auto px-6 py-8">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-neutral-400 hover:text-white mb-8 transition-colors"
                >
                    <ArrowLeft size={18} />
                    Back
                </button>

                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-white mb-2">Teams</h1>
                        <p className="text-neutral-400">Manage your teams and collaborate with others</p>
                    </div>
                    <button
                        onClick={() => {}}
                        className="flex items-center gap-2 px-4 py-2 bg-lime-400 hover:bg-lime-300 text-black font-medium rounded-lg transition-colors"
                    >
                        <Plus size={18} />
                        Create Team
                    </button>
                </div>

                {teams.length === 0 ? (
                    <div className="bg-neutral-900/50 border border-neutral-800 rounded-2xl p-12 text-center">
                        <div className="w-16 h-16 bg-neutral-800 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Users size={32} className="text-neutral-500" />
                        </div>
                        <h2 className="text-xl font-semibold text-white mb-2">No teams yet</h2>
                        <p className="text-neutral-400 mb-6">Create a team to start collaborating with others</p>
                        <button
                            onClick={() => {}}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-lime-400 hover:bg-lime-300 text-black font-medium rounded-lg transition-colors"
                        >
                            <Plus size={18} />
                            Create Your First Team
                        </button>
                    </div>
                ) : (
                    <div className="grid lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2 space-y-6">
                            {currentTeam && (
                                <div className="bg-neutral-900/50 border border-neutral-800 rounded-2xl overflow-hidden">
                                    <div className="p-6 border-b border-neutral-800">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-4">
                                                <div className="w-14 h-14 rounded-xl bg-lime-500/20 flex items-center justify-center">
                                                    {currentTeam.avatar_url ? (
                                                        <img
                                                            src={currentTeam.avatar_url}
                                                            alt={currentTeam.name}
                                                            className="w-full h-full rounded-xl object-cover"
                                                        />
                                                    ) : (
                                                        <Users size={28} className="text-lime-400" />
                                                    )}
                                                </div>
                                                <div>
                                                    <h2 className="text-xl font-semibold text-white">{currentTeam.name}</h2>
                                                    <p className="text-neutral-400 text-sm">{currentTeam.description || 'No description'}</p>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => setIsSettingsOpen(true)}
                                                className="p-2 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-lg transition-colors"
                                            >
                                                <Settings size={20} />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="p-4">
                                        <div className="flex items-center justify-between mb-4 px-2">
                                            <h3 className="text-sm font-medium text-neutral-400 uppercase tracking-wider">
                                                Members ({currentMembers.length})
                                            </h3>
                                            <button
                                                onClick={() => setIsSettingsOpen(true)}
                                                className="text-sm text-lime-400 hover:text-lime-300 flex items-center gap-1"
                                            >
                                                <Plus size={14} />
                                                Invite
                                            </button>
                                        </div>
                                        <div className="space-y-2">
                                            {currentMembers.map((member) => (
                                                <div
                                                    key={member.id}
                                                    className="flex items-center justify-between p-3 rounded-xl hover:bg-neutral-800/50 transition-colors"
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-full bg-neutral-800 flex items-center justify-center overflow-hidden">
                                                            {member.user?.avatar_url ? (
                                                                <img
                                                                    src={member.user.avatar_url}
                                                                    alt={member.user?.name || member.email}
                                                                    className="w-full h-full object-cover"
                                                                />
                                                            ) : (
                                                                <User size={18} className="text-neutral-500" />
                                                            )}
                                                        </div>
                                                        <div>
                                                            <p className="text-white font-medium">
                                                                {member.user?.name || 'Unknown'}
                                                            </p>
                                                            <p className="text-neutral-500 text-sm">{member.email}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-3">
                                                        <span className={`text-xs px-2 py-1 rounded-full bg-neutral-800 ${roleColors[member.role]}`}>
                                                            {roleLabels[member.role]}
                                                        </span>
                                                        {member.role === 'owner' && (
                                                            <Crown size={14} className="text-yellow-400" />
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="space-y-6">
                            <div className="bg-neutral-900/50 border border-neutral-800 rounded-2xl p-6">
                                <h3 className="text-lg font-semibold text-white mb-4">All Teams</h3>
                                <div className="space-y-2">
                                    {teams.map((team) => (
                                        <button
                                            key={team.id}
                                            onClick={() => {
                                                setCurrentTeamId(team.id);
                                                teamService.getTeamMembers(team.id).then(setTeamMembers);
                                            }}
                                            className={`w-full flex items-center gap-3 p-3 rounded-xl transition-colors ${
                                                team.id === currentTeamId
                                                    ? 'bg-lime-500/10 border border-lime-500/30'
                                                    : 'hover:bg-neutral-800'
                                            }`}
                                        >
                                            <div className="w-10 h-10 rounded-lg bg-neutral-800 flex items-center justify-center flex-shrink-0">
                                                {team.avatar_url ? (
                                                    <img
                                                        src={team.avatar_url}
                                                        alt={team.name}
                                                        className="w-full h-full rounded-lg object-cover"
                                                    />
                                                ) : (
                                                    <Users size={18} className="text-neutral-400" />
                                                )}
                                            </div>
                                            <div className="flex-1 text-left">
                                                <p className={`font-medium ${team.id === currentTeamId ? 'text-lime-400' : 'text-white'}`}>
                                                    {team.name}
                                                </p>
                                                <p className="text-xs text-neutral-500">{team.member_count} members</p>
                                            </div>
                                            {team.id === currentTeamId && (
                                                <Shield size={16} className="text-lime-400" />
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {currentTeam && (
                <TeamSettingsModal
                    isOpen={isSettingsOpen}
                    onClose={() => setIsSettingsOpen(false)}
                    team={currentTeam}
                    members={teamMembers}
                    onUpdate={() => {
                        loadUserTeams();
                        if (currentTeamId) {
                            teamService.getTeamMembers(currentTeamId).then(setTeamMembers);
                        }
                    }}
                />
            )}
        </div>
    );
}
