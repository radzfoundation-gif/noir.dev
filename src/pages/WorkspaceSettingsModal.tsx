import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import {
  User,
  Gift,
  Tag,
  CreditCard,
  Receipt,
  RefreshCcw,
  HelpCircle,
  X,
  Sun,
  Moon,
  Check
} from 'lucide-react';

interface UserProfile {
  id: string;
  full_name: string;
  email: string;
  created_at: string;
}

interface WorkspaceSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WorkspaceSettingsModal = ({ isOpen, onClose }: WorkspaceSettingsModalProps) => {
  const { user, signOut } = useAuth();
  const [darkMode, setDarkMode] = useState(true);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [saving, setSaving] = useState(false);
  const [savedMessage, setSavedMessage] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState('account');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (error && error.code !== 'PGRST116') {
          console.error('Error fetching profile:', error);
        }

        if (data) {
          setProfile(data);
        } else {
          setProfile({
            id: user.id,
            full_name: user.user_metadata?.name || user.email?.split('@')[0] || '',
            email: user.email || '',
            created_at: user.created_at || new Date().toISOString()
          });
        }
        } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };

    if (isOpen) {
      fetchProfile();
    }
  }, [user, isOpen]);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const handleSave = async () => {
    if (!user || !profile) return;

    setSaving(true);
    setSavedMessage(null);

    try {
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          full_name: profile.full_name,
          email: profile.email,
          updated_at: new Date().toISOString(),
        });

      if (error) throw error;

      setSavedMessage('Settings saved successfully!');
      setTimeout(() => setSavedMessage(null), 3000);
    } catch (error) {
      console.error('Failed to save settings:', error);
      setSavedMessage('Failed to save settings. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    await signOut();
    onClose();
  };

  const handleDeleteAccount = async () => {
    if (!user) return;

    try {
      await supabase.from('profiles').delete().eq('id', user.id);
      await supabase.from('projects').delete().eq('user_id', user.id);
      await supabase.from('api_keys').delete().eq('user_id', user.id);

      const { error } = await supabase.auth.admin.deleteUser(user.id);

      if (error) {
        alert('Please contact support to complete account deletion.');
      } else {
        await signOut();
        onClose();
      }
    } catch (error) {
      console.error('Account deletion failed:', error);
      alert('Failed to delete account. Please contact support.');
    } finally {
      setShowDeleteModal(false);
    }
  };

  const navItems = [
    { id: 'account', label: 'Account', icon: User },
    { id: 'referral', label: 'Referral history', icon: Gift },
    { id: 'promo', label: 'Redeem promo code', icon: Tag },
    { id: 'billing', label: 'Billing', icon: CreditCard },
    { id: 'credits', label: 'Credits balance', icon: Receipt },
    { id: 'autoreload', label: 'Auto reload', icon: RefreshCcw },
    { id: 'support', label: 'Support', icon: HelpCircle },
  ];

  const formatDate = (dateString: string) => {
    if (!dateString) return 'February 8, 2026';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-6xl h-[85vh] bg-white dark:bg-[#121214] rounded-3xl shadow-2xl flex overflow-hidden border border-gray-200 dark:border-[#27272a] relative">
        <button
          className="absolute top-4 right-4 z-20 text-gray-400 hover:text-gray-600 dark:hover:text-white transition-colors"
          onClick={onClose}
        >
          <X size={24} />
        </button>

        <aside className="w-full md:w-72 bg-gray-50 dark:bg-[#121214] border-r border-gray-200 dark:border-[#27272a] flex flex-col p-6 overflow-y-auto">
          <nav className="space-y-1 mb-8">
            {navItems.slice(0, 3).map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={`w-full flex items-center px-4 py-3 rounded-2xl transition-all ${
                  activeSection === item.id
                    ? 'bg-white dark:bg-[#18181b] text-gray-900 dark:text-white shadow-sm ring-1 ring-gray-200 dark:ring-[#27272a]'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-[#18181b] hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <item.icon className="mr-3 text-lg" />
                <span className="font-medium text-sm">{item.label}</span>
              </button>
            ))}
          </nav>

          <div className="h-px bg-gray-200 dark:border-[#27272a] mb-8 mx-2"></div>

          <nav className="space-y-1 mb-8">
            {navItems.slice(3, 6).map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={`w-full flex items-center px-4 py-3 rounded-2xl transition-all ${
                  activeSection === item.id
                    ? 'bg-white dark:bg-[#18181b] text-gray-900 dark:text-white shadow-sm ring-1 ring-gray-200 dark:ring-[#27272a]'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-[#18181b] hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <item.icon className="mr-3 text-lg" />
                <span className="font-medium text-sm">{item.label}</span>
              </button>
            ))}
          </nav>

          <div className="h-px bg-gray-200 dark:border-[#27272a] mb-8 mx-2"></div>

          <nav className="space-y-1">
            <button
              onClick={() => setActiveSection('support')}
              className={`w-full flex items-center px-4 py-3 rounded-2xl transition-all ${
                activeSection === 'support'
                  ? 'bg-white dark:bg-[#18181b] text-gray-900 dark:text-white shadow-sm ring-1 ring-gray-200 dark:ring-[#27272a]'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-[#18181b] hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <HelpCircle className="mr-3 text-lg" />
              <span className="font-medium text-sm">Support</span>
            </button>
          </nav>
        </aside>

        <main className="flex-1 bg-white dark:bg-[#121214] p-8 md:p-12 overflow-y-auto relative">
          <div className="max-w-2xl mx-auto">
            {activeSection === 'account' && (
              <>
                <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">Account</h1>

                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-[120px_1fr] items-center gap-4">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Name</label>
                    <input
                      type="text"
                      value={profile?.full_name || ''}
                      onChange={(e) => setProfile(profile ? { ...profile, full_name: e.target.value } : null)}
                      className="w-full bg-gray-50 dark:bg-[#18181b] border border-gray-200 dark:border-[#27272a] rounded-xl px-4 py-3 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-[#10b981] focus:border-transparent transition-all outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-[120px_1fr] items-center gap-4">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
                    <input
                      type="email"
                      value={profile?.email || ''}
                      onChange={(e) => setProfile(profile ? { ...profile, email: e.target.value } : null)}
                      className="w-full bg-gray-50 dark:bg-[#18181b] border border-gray-200 dark:border-[#27272a] rounded-xl px-4 py-3 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-[#10b981] focus:border-transparent transition-all outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-[120px_1fr] gap-4">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 pt-3">Password</label>
                    <div className="pt-3 text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                      You are signed in with Google. To change your password, please use your Google Account settings.
                    </div>
                  </div>

                  <div className="h-px bg-gray-200 dark:border-[#27272a] my-8"></div>

                  <div className="grid grid-cols-1 md:grid-cols-[160px_1fr] items-center gap-4">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">User ID</label>
                    <div className="text-sm text-gray-500 dark:text-gray-500 font-mono text-right md:text-right w-full">
                      {user?.id}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-[160px_1fr] items-center gap-4">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Account creation date</label>
                    <div className="text-sm text-gray-500 dark:text-gray-500 text-right md:text-right w-full">
                      {formatDate(profile?.created_at || '')}
                    </div>
                  </div>

                  <div className="h-px bg-gray-200 dark:border-[#27272a] my-8"></div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Log out of all devices</span>
                      <button
                        onClick={handleLogout}
                        className="px-5 py-2.5 bg-gray-100 dark:bg-[#18181b] hover:bg-gray-200 dark:hover:bg-zinc-800 text-gray-900 dark:text-white text-sm font-medium rounded-xl transition-colors"
                      >
                        Sign out
                      </button>
                    </div>
                    <div className="flex items-center justify-between pt-2">
                      <div>
                        <div className="text-sm font-medium text-gray-700 dark:text-gray-300">Delete account</div>
                        <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">This action cannot be undone.</div>
                      </div>
                      <button
                        onClick={() => setShowDeleteModal(true)}
                        className="px-5 py-2.5 bg-red-500 hover:bg-red-600 text-white text-sm font-medium rounded-xl transition-colors shadow-lg shadow-red-500/20"
                      >
                        Delete account
                      </button>
                    </div>
                  </div>
                </div>
              </>
            )}

            {activeSection === 'billing' && (
              <>
                <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">Billing</h1>
                <div className="space-y-6">
                  <div className="p-6 bg-gray-50 dark:bg-[#18181b] rounded-xl border border-gray-200 dark:border-[#27272a]">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Billing Management</h3>
                    <p className="text-gray-500 dark:text-gray-400">Manage your subscription and payment methods.</p>
                    <button 
                      onClick={() => setShowUpgradeModal(true)}
                      className="mt-4 px-4 py-2 bg-[#10b981] text-white rounded-lg font-medium hover:bg-[#10b981]/90 transition-colors"
                    >
                      Manage Subscription
                    </button>
                  </div>
                </div>
              </>
            )}

            {activeSection === 'credits' && (
              <>
                <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">Credits Balance</h1>
                <div className="space-y-6">
                  <div className="p-6 bg-gradient-to-r from-[#10b981]/10 to-transparent rounded-xl border border-[#10b981]/20">
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Available Credits</p>
                    <p className="text-4xl font-bold text-gray-900 dark:text-white">1,250</p>
                  </div>
                </div>
              </>
            )}

            {activeSection === 'support' && (
              <>
                <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">Support</h1>
                <div className="space-y-6">
                  <div className="p-6 bg-gray-50 dark:bg-[#18181b] rounded-xl border border-gray-200 dark:border-[#27272a]">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Need Help?</h3>
                    <p className="text-gray-500 dark:text-gray-400 mb-4">Contact our support team for assistance.</p>
                    <a
                      href="mailto:support@noir.ai"
                      className="inline-flex items-center px-4 py-2 bg-[#10b981] text-white rounded-lg font-medium hover:bg-[#10b981]/90 transition-colors"
                    >
                      Contact Support
                    </a>
                  </div>
                </div>
              </>
            )}

            {(activeSection === 'referral' || activeSection === 'promo' || activeSection === 'autoreload') && (
              <>
                <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">
                  {navItems.find(i => i.id === activeSection)?.label}
                </h1>
                <div className="p-6 bg-gray-50 dark:bg-[#18181b] rounded-xl border border-gray-200 dark:border-[#27272a]">
                  <p className="text-gray-500 dark:text-gray-400">This feature is coming soon.</p>
                </div>
              </>
            )}

            {savedMessage && (
              <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 px-6 py-3 bg-[#10b981] text-white rounded-full font-medium shadow-lg">
                {savedMessage}
              </div>
            )}

            <div className="absolute bottom-8 left-0 right-0 flex justify-center pointer-events-none">
              <button
                onClick={handleSave}
                disabled={saving}
                className="pointer-events-auto px-10 py-3 bg-gray-900 dark:bg-[#18181b] border border-gray-700 dark:border-[#27272a] text-white rounded-full font-medium shadow-2xl hover:bg-gray-800 dark:hover:bg-zinc-700 transition-all transform hover:-translate-y-1 disabled:opacity-50"
              >
                {saving ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>
        </main>

        <button
          className="fixed bottom-4 right-4 p-3 bg-white dark:bg-[#18181b] text-gray-900 dark:text-white rounded-full shadow-lg z-50 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          onClick={() => setDarkMode(!darkMode)}
        >
          {darkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </div>

      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-[#18181b] rounded-2xl p-6 max-w-md mx-4">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Delete Account</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              Are you sure you want to delete your account? This action cannot be undone and all your data will be permanently removed.
            </p>
            <div className="flex gap-4 justify-end">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 bg-gray-100 dark:bg-[#27272a] text-gray-900 dark:text-white rounded-lg font-medium hover:bg-gray-200 dark:hover:bg-[#27272a]/80 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                className="px-4 py-2 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {showUpgradeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-[#0A0A0A] rounded-xl max-w-2xl w-full overflow-hidden shadow-2xl relative animate-in zoom-in-95 duration-300 border border-[#27272A]">
            <button
              onClick={() => setShowUpgradeModal(false)}
              className="absolute top-2 right-2 text-gray-400 hover:text-white transition-colors z-10 p-1"
            >
              <X size={18} />
            </button>

            <div className="p-4">
              <div className="text-center mb-4">
                <p className="text-[#00C875] text-[10px] font-medium uppercase tracking-wider mb-1">Exclusive Offer</p>
                <h2 className="text-xl font-bold text-white mb-1">Upgrade to Pro</h2>
                <p className="text-gray-400 text-xs">Unlock unlimited generations with our Pro plan</p>
              </div>

              <div className="flex items-center justify-center gap-2 bg-[#27272A] rounded-full p-0.5 mb-4 w-fit mx-auto">
                <button className="px-3 py-1 bg-[#3F3F46] text-white rounded-full text-[10px] font-medium transition-all shadow-md">Monthly</button>
                <button className="px-3 py-1 text-gray-400 hover:text-gray-200 rounded-full text-[10px] font-medium transition-all">
                  Annual <span className="text-[#00C875] text-[9px] ml-1">(2 months free)</span>
                </button>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="bg-[#18181B] rounded-lg p-3 flex flex-col border border-[#27272A]">
                  <div className="mb-2">
                    <h3 className="text-base font-bold text-white mb-0.5">Plus</h3>
                    <div className="flex items-baseline gap-1">
                      <span className="text-lg font-bold text-white">$20</span>
                      <span className="text-gray-500 text-[10px]">/mo</span>
                    </div>
                  </div>
                  <button className="w-full py-1.5 rounded-lg border border-gray-600 text-white text-xs font-medium hover:bg-gray-800 transition-colors mb-2">
                    Upgrade
                  </button>
                  <div className="flex items-center gap-1 mb-2 text-[10px] text-white/70">
                    <span className="text-[#00C875]">$</span> 20 credits/mo
                  </div>
                  <div className="border-t border-gray-800 my-1"></div>
                  <ul className="space-y-1 flex-1">
                    <li className="flex items-center gap-1 text-gray-400 text-[10px]">
                      <Check size={12} className="text-[#00C875]" />
                      Premium models
                    </li>
                    <li className="flex items-center gap-1 text-gray-400 text-[10px]">
                      <Check size={12} className="text-[#00C875]" />
                      AI apps
                    </li>
                    <li className="flex items-center gap-1 text-gray-600 text-[10px]">
                      − Download code
                    </li>
                  </ul>
                </div>

                <div className="bg-[#18181B] rounded-lg p-3 flex flex-col relative border border-[#00C875]/30">
                  <div className="absolute top-1.5 right-1.5 bg-white/10 text-white text-[8px] font-bold px-1 py-0.5 rounded uppercase tracking-wide border border-white/10">Rec.</div>
                  <div className="mb-2">
                    <h3 className="text-base font-bold text-white mb-0.5">Pro</h3>
                    <div className="flex items-baseline gap-1">
                      <span className="text-lg font-bold text-white">$50</span>
                      <span className="text-gray-500 text-[10px]">/mo</span>
                    </div>
                  </div>
                  <button className="w-full py-1.5 rounded-lg bg-[#00C875] hover:bg-[#00B066] text-white text-xs font-bold transition-all shadow-[0_0_10px_rgba(0,200,117,0.2)] mb-2">
                    Upgrade
                  </button>
                  <div className="flex items-center gap-1 mb-2 text-[10px] text-white/70">
                    <span className="text-[#00C875]">$</span> 55 credits/mo
                  </div>
                  <div className="border-t border-[#00C875]/20 my-1"></div>
                  <ul className="space-y-1 flex-1">
                    <li className="flex items-center gap-1 text-gray-300 text-[10px]">
                      <Check size={12} className="text-[#00C875]" />
                      Premium models
                    </li>
                    <li className="flex items-center gap-1 text-gray-300 text-[10px]">
                      <Check size={12} className="text-[#00C875]" />
                      AI apps
                    </li>
                    <li className="flex items-center gap-1 text-gray-300 text-[10px]">
                      <Check size={12} className="text-[#00C875]" />
                      Download code
                    </li>
                    <li className="flex items-center gap-1 text-gray-300 text-[10px]">
                      <Check size={12} className="text-[#00C875]" />
                      SSH to Cursor
                    </li>
                  </ul>
                </div>

                <div className="bg-[#18181B] rounded-lg p-3 flex flex-col border border-[#27272A]">
                  <div className="mb-2">
                    <h3 className="text-base font-bold text-white mb-0.5">Max</h3>
                    <div className="flex items-baseline gap-1">
                      <span className="text-lg font-bold text-white">$200</span>
                      <span className="text-gray-500 text-[10px]">/mo</span>
                    </div>
                  </div>
                  <button className="w-full py-1.5 rounded-lg border border-gray-600 text-white text-xs font-medium hover:bg-gray-800 transition-colors mb-2">
                    Upgrade
                  </button>
                  <div className="flex items-center gap-1 mb-2 text-[10px] text-white/70">
                    <span className="text-[#00C875]">$</span> 220 credits/mo
                  </div>
                  <div className="border-t border-gray-800 my-1"></div>
                  <ul className="space-y-1 flex-1">
                    <li className="flex items-center gap-1 text-gray-300 text-[10px]">
                      <Check size={12} className="text-[#00C875]" />
                      All Pro features
                    </li>
                    <li className="flex items-center gap-1 text-gray-300 text-[10px]">
                      <Check size={12} className="text-[#00C875]" />
                      Priority support
                    </li>
                    <li className="flex items-center gap-1 text-gray-300 text-[10px]">
                      <Check size={12} className="text-[#00C875]" />
                      Custom integrations
                    </li>
                  </ul>
                </div>
              </div>

              <div className="mt-3 bg-[#18181B] rounded-lg p-3 flex items-center justify-between border border-[#27272A]">
                <div className="flex items-center gap-3">
                  <div>
                    <h3 className="text-sm font-bold text-white">Free</h3>
                  </div>
                  <div className="h-4 w-[1px] bg-gray-700"></div>
                  <div className="flex items-center gap-1 text-[10px] text-gray-300">
                    <span className="text-[#00C875]">$</span> $2.50 total
                  </div>
                </div>
                <span className="text-[10px] font-medium text-white bg-white/10 px-2 py-1 rounded-full">Current</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
