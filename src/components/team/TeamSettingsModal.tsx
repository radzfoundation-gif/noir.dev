import { useState } from 'react';
import { X, Users, Mail, UserPlus, Crown, Shield, Edit3, Eye, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { teamService, type Team, type TeamMember, type TeamRole } from '../../lib/teamService';
import { useAuth } from '../../context/AuthContext';

interface TeamSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  team: Team;
  members: TeamMember[];
  onUpdate: () => void;
}

const roleIcons: Record<TeamRole, React.ReactNode> = {
  owner: <Crown size={14} className="text-yellow-500" />,
  admin: <Shield size={14} className="text-blue-500" />,
  editor: <Edit3 size={14} className="text-green-500" />,
  viewer: <Eye size={14} className="text-gray-500" />,
};

const roleColors: Record<TeamRole, string> = {
  owner: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  admin: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  editor: 'bg-green-500/20 text-green-400 border-green-500/30',
  viewer: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
};

export const TeamSettingsModal: React.FC<TeamSettingsModalProps> = ({
  isOpen,
  onClose,
  team,
  members,
  onUpdate,
}) => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'general' | 'members'>('general');
  const [isInviting, setIsInviting] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<TeamRole>('editor');
  const [isLoading, setIsLoading] = useState(false);

  const currentUserMember = members.find(m => m.user_id === user?.id);
  const canManage = currentUserMember?.role === 'owner' || currentUserMember?.role === 'admin';

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail) return;

    setIsLoading(true);
    try {
      await teamService.inviteMember(team.id, inviteEmail, inviteRole);
      setInviteEmail('');
      setIsInviting(false);
      onUpdate();
    } catch (error) {
      console.error('Failed to invite:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveMember = async (memberId: string) => {
    if (!confirm('Are you sure you want to remove this member?')) return;

    try {
      await teamService.removeMember(memberId);
      onUpdate();
    } catch (error) {
      console.error('Failed to remove:', error);
    }
  };



  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            onClick={onClose}
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none p-4"
          >
            <div className="bg-[#171717] border border-neutral-800 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[80vh] pointer-events-auto overflow-hidden flex flex-col">
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-lime-500/10 flex items-center justify-center">
                    <Users className="w-5 h-5 text-lime-400" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-white">Team Settings</h2>
                    <p className="text-sm text-neutral-400">{team.name}</p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-lg transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Tabs */}
              <div className="flex border-b border-neutral-800">
                {(['general', 'members'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`flex-1 px-6 py-3 text-sm font-medium transition-colors ${
                      activeTab === tab
                        ? 'text-lime-400 border-b-2 border-lime-400'
                        : 'text-neutral-400 hover:text-white'
                    }`}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-6">
                {activeTab === 'general' && (
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-neutral-300 mb-2">
                        Team Name
                      </label>
                      <input
                        type="text"
                        defaultValue={team.name}
                        className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-lime-500"
                        disabled={!canManage}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-neutral-300 mb-2">
                        Description
                      </label>
                      <textarea
                        defaultValue={team.description}
                        rows={3}
                        className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-lime-500 resize-none"
                        disabled={!canManage}
                      />
                    </div>

                    <div className="p-4 bg-neutral-900 rounded-lg border border-neutral-800">
                      <h4 className="text-sm font-medium text-white mb-2">Team Plan</h4>
                      <p className="text-sm text-neutral-400">
                        Current: <span className="text-lime-400 capitalize">{team.subscription_tier}</span>
                      </p>
                      <p className="text-sm text-neutral-500 mt-1">
                        {members.length} / {team.max_members} members
                      </p>
                    </div>
                  </div>
                )}

                {activeTab === 'members' && (
                  <div className="space-y-4">
                    {canManage && (
                      <div className="flex justify-between items-center">
                        <p className="text-sm text-neutral-400">
                          {members.length} member{members.length !== 1 ? 's' : ''}
                        </p>
                        <button
                          onClick={() => setIsInviting(true)}
                          className="flex items-center gap-2 px-4 py-2 bg-lime-500 hover:bg-lime-400 text-black text-sm font-medium rounded-lg transition-colors"
                        >
                          <UserPlus size={16} />
                          Invite Member
                        </button>
                      </div>
                    )}

                    {isInviting && (
                      <form onSubmit={handleInvite} className="p-4 bg-neutral-900 rounded-lg border border-neutral-800 space-y-3">
                        <div>
                          <label className="block text-xs font-medium text-neutral-400 mb-1">
                            Email Address
                          </label>
                          <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                            <input
                              type="email"
                              value={inviteEmail}
                              onChange={(e) => setInviteEmail(e.target.value)}
                              placeholder="colleague@company.com"
                              className="w-full bg-neutral-800 border border-neutral-700 rounded-lg pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-lime-500"
                              required
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-medium text-neutral-400 mb-1">
                            Role
                          </label>
                          <select
                            value={inviteRole}
                            onChange={(e) => setInviteRole(e.target.value as TeamRole)}
                            className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-lime-500"
                          >
                            <option value="admin">Admin - Can manage team settings</option>
                            <option value="editor">Editor - Can edit projects</option>
                            <option value="viewer">Viewer - View only</option>
                          </select>
                        </div>

                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => setIsInviting(false)}
                            className="flex-1 px-4 py-2 text-sm text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-lg transition-colors"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            disabled={isLoading}
                            className="flex-1 px-4 py-2 bg-lime-500 hover:bg-lime-400 text-black text-sm font-medium rounded-lg transition-colors disabled:opacity-50"
                          >
                            {isLoading ? 'Sending...' : 'Send Invite'}
                          </button>
                        </div>
                      </form>
                    )}

                    <div className="space-y-2">
                      {members.map((member) => (
                        <div
                          key={member.id}
                          className="flex items-center gap-3 p-3 bg-neutral-900 rounded-lg border border-neutral-800"
                        >
                          <div className="w-10 h-10 rounded-full bg-neutral-800 flex items-center justify-center flex-shrink-0">
                            {member.user?.user_metadata?.avatar_url ? (
                              <img
                                src={member.user.user_metadata.avatar_url}
                                alt={member.user.user_metadata.full_name}
                                className="w-full h-full rounded-full object-cover"
                              />
                            ) : (
                              <Users size={18} className="text-neutral-500" />
                            )}
                          </div>

                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-white truncate">
                              {member.user?.user_metadata?.full_name || member.invited_email || 'Unknown'}
                            </p>
                            <p className="text-xs text-neutral-500 truncate">
                              {member.user?.email || 'Pending invitation'}
                            </p>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${roleColors[member.role]}`}>
                              {roleIcons[member.role]}
                              <span className="capitalize">{member.role}</span>
                            </span>

                            {canManage && member.user_id !== user?.id && (
                              <button
                                onClick={() => handleRemoveMember(member.id)}
                                className="p-1.5 text-neutral-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                                title="Remove member"
                              >
                                <Trash2 size={16} />
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="flex justify-end gap-3 px-6 py-4 border-t border-neutral-800 bg-neutral-900/30">
                <button
                  onClick={onClose}
                  className="px-4 py-2 text-sm font-medium text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-lg transition-colors"
                >
                  Close
                </button>
                {activeTab === 'general' && canManage && (
                  <button
                    className="px-4 py-2 bg-lime-500 hover:bg-lime-400 text-black text-sm font-medium rounded-lg transition-colors"
                  >
                    Save Changes
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
