import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
  Moon,
  Sun
} from 'lucide-react';

interface UserProfile {
  id: string;
  full_name: string;
  email: string;
  created_at: string;
}

export const WorkspaceSettings = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(true);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedMessage, setSavedMessage] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState('account');
  const [showDeleteModal, setShowDeleteModal] = useState(false);

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
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user]);

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
    navigate('/');
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
        navigate('/');
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-[#0f0f11] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#10b981]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-[#0f0f11] flex items-center justify-center p-4 font-['Inter',sans-serif]">
      <div className="w-full max-w-6xl h-[85vh] bg-white dark:bg-[#121214] rounded-3xl shadow-2xl flex overflow-hidden border border-gray-200 dark:border-[#27272a] relative">
        <button
          className="absolute top-4 right-4 z-20 text-gray-400 hover:text-gray-600 dark:hover:text-white transition-colors"
          onClick={() => navigate(-1)}
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
                    <button className="mt-4 px-4 py-2 bg-[#10b981] text-white rounded-lg font-medium hover:bg-[#10b981]/90 transition-colors">
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
      </div>

      <button
        className="fixed bottom-4 right-4 p-3 bg-white dark:bg-[#18181b] text-gray-900 dark:text-white rounded-full shadow-lg z-50 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        onClick={() => setDarkMode(!darkMode)}
      >
        {darkMode ? <Sun size={20} /> : <Moon size={20} />}
      </button>

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
    </div>
  );
};
