import { useState } from 'react';
import { X, Link, Lock, Users, Globe, Copy, Check, Mail } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { teamService, type SharePermission } from '../../lib/teamService';
import { useAuth } from '../../context/AuthContext';

interface ShareProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
  projectName: string;
}

export const ShareProjectModal: React.FC<ShareProjectModalProps> = ({
  isOpen,
  onClose,
  projectId,
  projectName,
}) => {
  const { user: _user } = useAuth();
  const [shareType, setShareType] = useState<'link' | 'email'>('link');
  const [permission, setPermission] = useState<SharePermission>('view');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [requirePassword, setRequirePassword] = useState(false);
  const [expiresInDays, setExpiresInDays] = useState<number | null>(null);
  const [shareLink, setShareLink] = useState<string>('');
  const [isCopied, setIsCopied] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateLink = async () => {
    setIsGenerating(true);
    try {
      const share = await teamService.shareProject(projectId, {
        shareType: 'link',
        permission,
        password: requirePassword ? password : undefined,
        expiresInDays: expiresInDays || undefined,
      });

      if (share.share_link_token) {
        const baseUrl = window.location.origin;
        setShareLink(`${baseUrl}/share/${share.share_link_token}`);
      }
    } catch (error) {
      console.error('Failed to generate link:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleShareByEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    try {
      await teamService.shareProject(projectId, {
        shareType: 'user',
        permission,
      });
      setEmail('');
      alert('Invitation sent!');
    } catch (error) {
      console.error('Failed to share:', error);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareLink);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
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
            <div className="bg-[#171717] border border-neutral-800 rounded-2xl shadow-2xl w-full max-w-md pointer-events-auto">
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-lime-500/10 flex items-center justify-center">
                    <Users className="w-5 h-5 text-lime-400" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-white">Share Project</h2>
                    <p className="text-sm text-neutral-400 truncate max-w-[200px]">{projectName}</p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-lg transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Share Type Tabs */}
              <div className="flex border-b border-neutral-800">
                <button
                  onClick={() => setShareType('link')}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium transition-colors ${
                    shareType === 'link'
                      ? 'text-lime-400 border-b-2 border-lime-400'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  <Link size={16} />
                  Share Link
                </button>
                <button
                  onClick={() => setShareType('email')}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium transition-colors ${
                    shareType === 'email'
                      ? 'text-lime-400 border-b-2 border-lime-400'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  <Mail size={16} />
                  Invite by Email
                </button>
              </div>

              {/* Content */}
              <div className="p-6 space-y-6">
                {/* Permission Selector */}
                <div>
                  <label className="block text-sm font-medium text-neutral-300 mb-2">
                    Permission Level
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['view', 'edit', 'admin'] as SharePermission[]).map((perm) => (
                      <button
                        key={perm}
                        onClick={() => setPermission(perm)}
                        className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                          permission === perm
                            ? 'bg-lime-500 text-black'
                            : 'bg-neutral-800 text-neutral-400 hover:bg-neutral-700'
                        }`}
                      >
                        {perm.charAt(0).toUpperCase() + perm.slice(1)}
                      </button>
                    ))}
                  </div>
                  <p className="mt-2 text-xs text-neutral-500">
                    {permission === 'view' && 'Can view and comment on the project'}
                    {permission === 'edit' && 'Can make changes to the project'}
                    {permission === 'admin' && 'Full access including sharing and deletion'}
                  </p>
                </div>

                {shareType === 'link' ? (
                  <>
                    {/* Link Options */}
                    <div className="space-y-3">
                      <label className="flex items-center gap-3 p-3 bg-neutral-900 rounded-lg border border-neutral-800 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={requirePassword}
                          onChange={(e) => setRequirePassword(e.target.checked)}
                          className="w-4 h-4 rounded border-neutral-700 bg-neutral-800 text-lime-500"
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <Lock size={16} className="text-neutral-400" />
                            <span className="text-sm text-white">Password Protection</span>
                          </div>
                          <p className="text-xs text-neutral-500 mt-0.5">Require password to access</p>
                        </div>
                      </label>

                      {requirePassword && (
                        <input
                          type="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="Enter password"
                          className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-lime-500"
                        />
                      )}

                      <div>
                        <label className="block text-xs font-medium text-neutral-400 mb-1.5">
                          Link Expiration
                        </label>
                        <select
                          value={expiresInDays || ''}
                          onChange={(e) => setExpiresInDays(e.target.value ? parseInt(e.target.value) : null)}
                          className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-lime-500"
                        >
                          <option value="">Never expires</option>
                          <option value="1">1 day</option>
                          <option value="7">7 days</option>
                          <option value="30">30 days</option>
                        </select>
                      </div>
                    </div>

                    {/* Generated Link */}
                    {shareLink ? (
                      <div className="p-4 bg-neutral-900 rounded-lg border border-neutral-800">
                        <label className="block text-xs font-medium text-neutral-400 mb-2">
                          Share Link
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={shareLink}
                            readOnly
                            className="flex-1 bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2 text-sm text-neutral-400"
                          />
                          <button
                            onClick={copyToClipboard}
                            className="px-3 py-2 bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg transition-colors"
                          >
                            {isCopied ? <Check size={18} className="text-lime-400" /> : <Copy size={18} />}
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={handleGenerateLink}
                        disabled={isGenerating}
                        className="w-full px-4 py-2.5 bg-lime-500 hover:bg-lime-400 text-black text-sm font-medium rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                      >
                        {isGenerating ? (
                          <>
                            <div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                            Generating...
                          </>
                        ) : (
                          <>
                            <Globe size={18} />
                            Generate Share Link
                          </>
                        )}
                      </button>
                    )}
                  </>
                ) : (
                  /* Email Invite */
                  <form onSubmit={handleShareByEmail} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-neutral-300 mb-2">
                        Email Address
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="colleague@company.com"
                          className="w-full bg-neutral-800 border border-neutral-700 rounded-lg pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-lime-500"
                          required
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full px-4 py-2.5 bg-lime-500 hover:bg-lime-400 text-black text-sm font-medium rounded-lg transition-colors"
                    >
                      Send Invitation
                    </button>
                  </form>
                )}
              </div>

              {/* Footer */}
              <div className="px-6 py-4 border-t border-neutral-800 bg-neutral-900/30">
                <p className="text-xs text-neutral-500 text-center">
                  Shared projects are subject to your team&apos;s security policies
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
