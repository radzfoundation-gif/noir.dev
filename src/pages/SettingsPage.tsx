import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { useEffect } from 'react';
import { 
  User, 
  Bell, 
  Shield, 
  CreditCard, 
  Key, 
  Palette, 
  Moon, 
  Sun,
  Globe,
  Save,
  Loader2,
  Check,
  X,
  Trash2,
  Download
} from 'lucide-react';

interface SettingSectionProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  children: React.ReactNode;
}

const SettingSection = ({ icon, title, description, children }: SettingSectionProps) => (
  <div className="bg-white dark:bg-[#121212] border border-slate-200 dark:border-white/10 rounded-xl p-6">
    <div className="flex items-start gap-4 mb-6">
      <div className="p-3 bg-[#25f46a]/10 rounded-lg text-[#25f46a]">
        {icon}
      </div>
      <div>
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">{title}</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">{description}</p>
      </div>
    </div>
    {children}
  </div>
);

export const SettingsPage = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState('profile');
  const [darkMode, setDarkMode] = useState(true);
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    marketing: false
  });
  const [profile, setProfile] = useState({
    name: user?.user_metadata?.name || '',
    email: user?.email || '',
    company: '',
    website: ''
  });
  const [apiKeys, setApiKeys] = useState<{id: string, name: string, key: string, created: string}[]>([]);
  const [loadingApiKeys, setLoadingApiKeys] = useState(false);
  
  // Integrations state
  const [integrations, setIntegrations] = useState<{
    vercel?: { token: string; teamId?: string };
    netlify?: { token: string };
    github?: { token: string };
  }>({});
  const [loadingIntegrations, setLoadingIntegrations] = useState(false);
  const [savingIntegration, setSavingIntegration] = useState<string | null>(null);
  const [integrationMessage, setIntegrationMessage] = useState<string | null>(null);
  const [showTokenInput, setShowTokenInput] = useState<Record<string, boolean>>({});
  const [tempTokens, setTempTokens] = useState<Record<string, string>>({});
  
  const [saving, setSaving] = useState(false);
  const [savedMessage, setSavedMessage] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  // Fetch API keys on mount
  useEffect(() => {
    const fetchApiKeys = async () => {
      if (!user) return;
      
      setLoadingApiKeys(true);
      try {
        const { data, error } = await supabase
          .from('api_keys')
          .select('id, name, key_prefix, created_at')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        
        const formattedKeys = (data || []).map(key => ({
          id: key.id,
          name: key.name,
          key: `${key.key_prefix}****...****`,
          created: new Date(key.created_at).toISOString().split('T')[0]
        }));
        
        setApiKeys(formattedKeys);
      } catch (error) {
        console.error('Failed to fetch API keys:', error);
      } finally {
        setLoadingApiKeys(false);
      }
    };
    
    fetchApiKeys();
    
    // Fetch integrations
    const fetchIntegrations = async () => {
      if (!user) return;
      
      setLoadingIntegrations(true);
      try {
        const { data, error } = await supabase
          .from('integrations')
          .select('*')
          .eq('user_id', user.id)
          .eq('is_active', true);
        
        if (error) throw error;
        
        const integrationMap: typeof integrations = {};
        (data || []).forEach((integration: any) => {
          if (integration.provider === 'vercel') {
            integrationMap.vercel = {
              token: integration.config?.token || '',
              teamId: integration.config?.teamId,
            };
          } else if (integration.provider === 'netlify') {
            integrationMap.netlify = {
              token: integration.config?.token || '',
            };
          } else if (integration.provider === 'github') {
            integrationMap.github = {
              token: integration.config?.token || '',
            };
          }
        });
        
        setIntegrations(integrationMap);
      } catch (error: any) {
        console.error('Failed to fetch integrations:', error);
        // Don't show error to user for fetch - just silently fail
        // The table might not exist yet
        if (error?.code === '42P01') {
          console.warn('Integrations table does not exist. Please run database migrations.');
        }
        setIntegrations({});
      } finally {
        setLoadingIntegrations(false);
      }
    };
    
    fetchIntegrations();
  }, [user]);

  const validateToken = async (provider: 'vercel' | 'netlify' | 'github', token: string): Promise<{ valid: boolean; message: string }> => {
    // Format validation
    if (!token || token.trim().length < 10) {
      return { valid: false, message: 'Token is too short or empty' };
    }

    switch (provider) {
      case 'vercel':
        // Vercel tokens: vercel_ prefix (newer) or plain token (older)
        if (!token.startsWith('vercel_') && token.length < 24) {
          return { valid: false, message: 'Invalid Vercel token format. Token should start with "vercel_" and be at least 24 characters long' };
        }
        break;
      
      case 'netlify':
        // Netlify tokens: nfp_ prefix (newer) or plain token (older)
        if (token.length < 20) {
          return { valid: false, message: 'Invalid Netlify token format. Token should be at least 20 characters' };
        }
        break;
      
      case 'github':
        // GitHub tokens have specific prefixes
        if (!token.startsWith('ghp_') && !token.startsWith('github_pat_')) {
          return { valid: false, message: 'Invalid GitHub token format. Token should start with "ghp_" (classic) or "github_pat_" (fine-grained)' };
        }
        break;
    }

    // Test the token with actual API
    try {
      let response: Response;

      switch (provider) {
        case 'vercel':
          // Test Vercel token by listing projects (more reliable endpoint)
          response = await fetch('https://api.vercel.com/v9/projects?limit=1', {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          break;
        case 'netlify':
          response = await fetch('https://api.netlify.com/api/v1/sites?per_page=1', {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          break;
        case 'github':
          response = await fetch('https://api.github.com/user', {
            headers: { 
              'Authorization': `Bearer ${token}`,
              'Accept': 'application/vnd.github.v3+json'
            }
          });
          break;
        default:
          return { valid: false, message: 'Unknown provider' };
      }
      
      if (!response.ok) {
        if (response.status === 401) {
          return { valid: false, message: `Invalid ${provider} token. Please check your token and try again.` };
        } else if (response.status === 403) {
          return { valid: false, message: `Token valid but insufficient permissions. Please ensure token has required scopes.` };
        } else if (response.status === 400) {
          return { valid: false, message: `Bad request. The token format might be invalid or the API endpoint has changed.` };
        } else {
          return { valid: false, message: `Failed to validate token. ${provider} API returned: ${response.status}` };
        }
      }

      return { valid: true, message: 'Token validated successfully' };
    } catch (error) {
      // If network error, just do basic format validation
      console.warn(`Network error validating ${provider} token:`, error);
      return { valid: true, message: 'Token format looks valid (API validation skipped due to network error)' };
    }
  };

  const handleSaveIntegration = async (provider: 'vercel' | 'netlify' | 'github') => {
    if (!user) return;
    
    const token = tempTokens[provider];
    
    // Pre-validation: check if token is empty
    if (!token || token.trim().length === 0) {
      setIntegrationMessage(`Please enter a ${provider} token`);
      return;
    }
    
    setSavingIntegration(provider);
    setIntegrationMessage(`Validating ${provider} token...`);
    
    try {
      // Validate token format and test with API
      const validation = await validateToken(provider, token);
      
      if (!validation.valid) {
        setIntegrationMessage(validation.message);
        return;
      }
      
      // Check if integration already exists
      const { data: existing, error: fetchError } = await supabase
        .from('integrations')
        .select('id')
        .eq('user_id', user.id)
        .eq('provider', provider)
        .maybeSingle();
      
      // Log error for debugging but don't throw - we'll create new if not found
      if (fetchError && fetchError.code !== 'PGRST116') {
        console.warn('Error checking existing integration:', fetchError);
      }
      
      const config: any = { token };
      if (provider === 'vercel' && tempTokens['vercel-team']) {
        config.teamId = tempTokens['vercel-team'];
      }
      
      if (existing) {
        // Update existing
        const { error } = await supabase
          .from('integrations')
          .update({
            config,
            last_sync_at: new Date().toISOString(),
          })
          .eq('id', existing.id);
        
        if (error) throw error;
      } else {
        // Create new
        const { error } = await supabase
          .from('integrations')
          .insert({
            user_id: user.id,
            provider,
            name: `${provider.charAt(0).toUpperCase() + provider.slice(1)} Integration`,
            config,
            is_active: true,
          });
        
        if (error) throw error;
      }
      
      // Update local state
      setIntegrations(prev => ({
        ...prev,
        [provider]: config,
      }));
      
      // Clear temp token and hide input
      setTempTokens(prev => ({ ...prev, [provider]: '', [`${provider}-team`]: '' }));
      setShowTokenInput(prev => ({ ...prev, [provider]: false }));
      
      setIntegrationMessage(`${provider} token validated and saved successfully!`);
      setTimeout(() => setIntegrationMessage(null), 3000);
    } catch (error: any) {
      console.error(`Failed to save ${provider} integration:`, error);
      
      // Check for specific Supabase errors
      if (error?.code === '42P01') {
        setIntegrationMessage(`Database table not found. Please run the database migrations first.`);
      } else if (error?.code === '42501') {
        setIntegrationMessage(`Permission denied. Please check your database permissions.`);
      } else if (error?.message?.includes('406') || error?.status === 406) {
        setIntegrationMessage(`Database configuration error. Please contact support.`);
      } else {
        setIntegrationMessage(`Failed to save ${provider} token: ${error?.message || 'Unknown error'}. Please try again.`);
      }
    } finally {
      setSavingIntegration(null);
    }
  };

  const handleDeleteIntegration = async (provider: 'vercel' | 'netlify' | 'github') => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from('integrations')
        .delete()
        .eq('user_id', user.id)
        .eq('provider', provider);
      
      if (error) throw error;
      
      setIntegrations(prev => {
        const newState = { ...prev };
        delete newState[provider];
        return newState;
      });
      
      setIntegrationMessage(`${provider} integration removed`);
      setTimeout(() => setIntegrationMessage(null), 3000);
    } catch (error) {
      console.error(`Failed to delete ${provider} integration:`, error);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setSavedMessage(null);
    
    try {
      // Update user profile in Supabase
      const { error } = await supabase.auth.updateUser({
        data: {
          name: profile.name,
          company: profile.company,
          website: profile.website,
        }
      });
      
      if (error) throw error;
      
      // Update profile in profiles table
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({
          id: user?.id,
          full_name: profile.name,
          email: profile.email,
          updated_at: new Date().toISOString(),
        });
      
      if (profileError) throw profileError;
      
      setSavedMessage('Settings saved successfully!');
      setTimeout(() => setSavedMessage(null), 3000);
    } catch (error) {
      console.error('Failed to save settings:', error);
      setSavedMessage('Failed to save settings. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      if (!user) return;
      
      // Delete user data from profiles table
      await supabase.from('profiles').delete().eq('id', user.id);
      
      // Delete user's projects
      await supabase.from('projects').delete().eq('user_id', user.id);
      
      // Delete user's API keys
      await supabase.from('api_keys').delete().eq('user_id', user.id);
      
      // Delete the user account itself
      const { error } = await supabase.auth.admin.deleteUser(user.id);
      
      if (error) {
        // If admin delete fails, just sign out and let user contact support
        console.error('Account deletion error:', error);
        alert('Please contact support@noir.ai to complete account deletion.');
      } else {
        await signOut();
        navigate('/');
      }
    } catch (error) {
      console.error('Account deletion failed:', error);
      alert('Failed to delete account. Please contact support@noir.ai for assistance.');
    } finally {
      setShowDeleteModal(false);
    }
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: <User size={20} /> },
    { id: 'appearance', label: 'Appearance', icon: <Palette size={20} /> },
    { id: 'notifications', label: 'Notifications', icon: <Bell size={20} /> },
    { id: 'integrations', label: 'Integrations', icon: <Globe size={20} /> },
    { id: 'billing', label: 'Billing', icon: <CreditCard size={20} /> },
    { id: 'api', label: 'API Keys', icon: <Key size={20} /> },
    { id: 'security', label: 'Security', icon: <Shield size={20} /> },
  ];

  return (
    <div className="bg-[#f5f8f6] dark:bg-[#0a0a0a] min-h-screen font-display text-slate-900 dark:text-white transition-colors duration-300 dark">
      <style>{`
        .tech-grid {
          background-image: radial-gradient(circle at 1px 1px, #1a2e20 1px, transparent 0);
          background-size: 40px 40px;
        }
      `}</style>
      <div className="relative min-h-screen flex flex-col overflow-x-hidden tech-grid">
        <header className="w-full border-b border-solid border-slate-200 dark:border-white/10 px-6 lg:px-20 py-4 flex items-center justify-between bg-[#f5f8f6]/80 dark:bg-[#0a0a0a]/80 backdrop-blur-md sticky top-0 z-50">
          <Link to="/projects" className="flex items-center gap-3">
            <div className="text-[#25f46a]">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                <path d="M42.4379 44C42.4379 44 36.0744 33.9038 41.1692 24C46.8624 12.9336 42.2078 4 42.2078 4L7.01134 4C7.01134 4 11.6577 12.932 5.96912 23.9969C0.876273 33.9029 7.27094 44 7.27094 44L42.4379 44Z" fill="currentColor"></path>
              </svg>
            </div>
            <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">Noir Code</h2>
          </Link>
          <nav className="hidden md:flex items-center gap-10">
            <Link className="text-sm font-medium hover:text-[#25f46a] transition-colors" to="/how-it-works">How it Works</Link>
            <Link className="text-sm font-medium hover:text-[#25f46a] transition-colors" to="/pricing">Pricing</Link>
          </nav>
          <div className="flex gap-3 items-center">
            <Link to="/projects" className="flex items-center justify-center size-9 rounded-full bg-white/5 border border-white/10 hover:bg-[#25f46a]/20 hover:border-[#25f46a]/50 hover:text-[#25f46a] text-white/80 transition-all" title="My Projects">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
              </svg>
            </Link>
            <button
              onClick={handleLogout}
              className="hidden sm:flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white/80 bg-white/5 border border-white/10 rounded-lg hover:bg-red-500/20 hover:border-red-500/30 hover:text-red-400 transition-all"
            >
              Log out
            </button>
          </div>
        </header>

        <main className="flex-1 flex gap-8 max-w-7xl mx-auto w-full p-6 lg:px-20 py-12">
          <aside className="w-64 flex-shrink-0">
            <nav className="bg-white dark:bg-[#121212] border border-slate-200 dark:border-white/10 rounded-xl p-4 sticky top-24">
              <div className="mb-4 pb-4 border-b border-slate-200 dark:border-white/10">
                <div className="flex items-center gap-3 px-2">
                  <div className="w-10 h-10 rounded-full bg-[#25f46a]/20 flex items-center justify-center text-[#25f46a] font-bold">
                    {profile.name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || 'U'}
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-white text-sm">{profile.name || 'User'}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{user?.email}</p>
                  </div>
                </div>
              </div>
              <ul className="space-y-1">
                {tabs.map((tab) => (
                  <li key={tab.id}>
                    <button
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                        activeTab === tab.id 
                          ? 'bg-[#25f46a]/10 text-[#25f46a] border border-[#25f46a]/20' 
                          : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5'
                      }`}
                    >
                      {tab.icon}
                      {tab.label}
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
          </aside>

          <div className="flex-1 min-w-0">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Settings</h1>
              <p className="text-slate-500 dark:text-slate-400">Manage your account and preferences</p>
            </div>

            {activeTab === 'profile' && (
              <div className="space-y-6">
                <SettingSection
                  icon={<User size={24} />}
                  title="Profile Information"
                  description="Update your personal details"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Full Name</label>
                      <input
                        type="text"
                        value={profile.name}
                        onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-lg border border-slate-200 dark:border-white/20 bg-white dark:bg-[#1a1a1a] text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#25f46a]/50 focus:border-[#25f46a]"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Email Address</label>
                      <input
                        type="email"
                        value={profile.email}
                        disabled
                        className="w-full px-4 py-2.5 rounded-lg border border-slate-200 dark:border-white/20 bg-slate-100 dark:bg-[#1a1a1a] text-slate-500 dark:text-slate-400 cursor-not-allowed"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Company</label>
                      <input
                        type="text"
                        value={profile.company}
                        onChange={(e) => setProfile({ ...profile, company: e.target.value })}
                        placeholder="Your company name"
                        className="w-full px-4 py-2.5 rounded-lg border border-slate-200 dark:border-white/20 bg-white dark:bg-[#1a1a1a] text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#25f46a]/50 focus:border-[#25f46a]"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Website</label>
                      <input
                        type="url"
                        value={profile.website}
                        onChange={(e) => setProfile({ ...profile, website: e.target.value })}
                        placeholder="https://yourwebsite.com"
                        className="w-full px-4 py-2.5 rounded-lg border border-slate-200 dark:border-white/20 bg-white dark:bg-[#1a1a1a] text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#25f46a]/50 focus:border-[#25f46a]"
                      />
                    </div>
                  </div>
                </SettingSection>

                <SettingSection
                  icon={<Globe size={24} />}
                  title="Language & Region"
                  description="Set your preferred language and timezone"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Language</label>
                      <select className="w-full px-4 py-2.5 rounded-lg border border-slate-200 dark:border-white/20 bg-white dark:bg-[#1a1a1a] text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#25f46a]/50 focus:border-[#25f46a]">
                        <option value="en">English</option>
                        <option value="id">Bahasa Indonesia</option>
                        <option value="es">Español</option>
                        <option value="zh">中文</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Timezone</label>
                      <select className="w-full px-4 py-2.5 rounded-lg border border-slate-200 dark:border-white/20 bg-white dark:bg-[#1a1a1a] text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#25f46a]/50 focus:border-[#25f46a]">
                        <option value="UTC">UTC</option>
                        <option value="Asia/Jakarta">Asia/Jakarta (WIB)</option>
                        <option value="Asia/Makassar">Asia/Makassar (WITA)</option>
                        <option value="Asia/Jayapura">Asia/Jayapura (WIT)</option>
                      </select>
                    </div>
                  </div>
                </SettingSection>
              </div>
            )}

            {activeTab === 'appearance' && (
              <div className="space-y-6">
                <SettingSection
                  icon={darkMode ? <Moon size={24} /> : <Sun size={24} />}
                  title="Theme"
                  description="Customize the look and feel"
                >
                  <div className="grid grid-cols-3 gap-4">
                    <button
                      onClick={() => setDarkMode(false)}
                      className={`p-4 rounded-xl border-2 transition-all ${
                        !darkMode 
                          ? 'border-[#25f46a] bg-[#25f46a]/10' 
                          : 'border-slate-200 dark:border-white/10 hover:border-[#25f46a]/50'
                      }`}
                    >
                      <Sun size={32} className="mx-auto mb-2 text-amber-500" />
                      <p className="font-medium text-slate-900 dark:text-white">Light</p>
                    </button>
                    <button
                      onClick={() => setDarkMode(true)}
                      className={`p-4 rounded-xl border-2 transition-all ${
                        darkMode 
                          ? 'border-[#25f46a] bg-[#25f46a]/10' 
                          : 'border-slate-200 dark:border-white/10 hover:border-[#25f46a]/50'
                      }`}
                    >
                      <Moon size={32} className="mx-auto mb-2 text-slate-700" />
                      <p className="font-medium text-slate-900 dark:text-white">Dark</p>
                    </button>
                    <button
                      className="p-4 rounded-xl border-2 border-slate-200 dark:border-white/10 hover:border-[#25f46a]/50 transition-all"
                    >
                      <Palette size={32} className="mx-auto mb-2 text-[#25f46a]" />
                      <p className="font-medium text-slate-900 dark:text-white">System</p>
                    </button>
                  </div>
                </SettingSection>

                <SettingSection
                  icon={<Palette size={24} />}
                  title="Accent Color"
                  description="Choose your preferred accent color"
                >
                  <div className="flex gap-4">
                    {['#25f46a', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'].map((color) => (
                      <button
                        key={color}
                        className="w-12 h-12 rounded-full transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#25f46a]"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </SettingSection>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="space-y-6">
                <SettingSection
                  icon={<Bell size={24} />}
                  title="Email Notifications"
                  description="Choose what emails you receive"
                >
                  <div className="space-y-4">
                    {[
                      { key: 'email', label: 'Project updates', desc: 'Get notified about new features and improvements' },
                      { key: 'marketing', label: 'Marketing emails', desc: 'Receive tips, tricks, and special offers' },
                    ].map((item) => (
                      <div key={item.key} className="flex items-center justify-between py-3 border-b border-slate-200 dark:border-white/10 last:border-0">
                        <div>
                          <p className="font-medium text-slate-900 dark:text-white">{item.label}</p>
                          <p className="text-sm text-slate-500 dark:text-slate-400">{item.desc}</p>
                        </div>
                        <button
                          onClick={() => setNotifications({ ...notifications, [item.key]: !notifications[item.key as keyof typeof notifications] })}
                          className={`w-12 h-6 rounded-full transition-colors relative ${
                            notifications[item.key as keyof typeof notifications] ? 'bg-[#25f46a]' : 'bg-slate-300 dark:bg-slate-600'
                          }`}
                        >
                          <span
                            className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                              notifications[item.key as keyof typeof notifications] ? 'translate-x-7' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </div>
                    ))}
                  </div>
                </SettingSection>
              </div>
            )}

            {activeTab === 'integrations' && (
              <div className="space-y-6">
                {integrationMessage && (
                  <div className={`p-4 rounded-xl ${integrationMessage.includes('success') || integrationMessage.includes('saved') ? 'bg-[#25f46a]/10 border border-[#25f46a]/20 text-[#25f46a]' : 'bg-red-500/10 border border-red-500/20 text-red-500'}`}>
                    {integrationMessage}
                  </div>
                )}

                <SettingSection
                  icon={<Globe size={24} />}
                  title="Deployment Integrations"
                  description="Connect your deployment platforms for one-click publishing"
                >
                  {loadingIntegrations ? (
                    <div className="flex items-center justify-center py-12">
                      <Loader2 size={32} className="animate-spin text-[#25f46a]" />
                    </div>
                  ) : (
                  <div className="space-y-6">
                    {/* Vercel */}
                    <div className="p-4 bg-slate-50 dark:bg-[#1a1a1a] rounded-xl border border-slate-200 dark:border-white/10">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center">
                            <svg className="w-6 h-6 text-white" viewBox="0 0 76 65" fill="none">
                              <path d="M37.5274 0L75.0548 65H0L37.5274 0Z" fill="currentColor"/>
                            </svg>
                          </div>
                          <div>
                            <p className="font-semibold text-slate-900 dark:text-white">Vercel</p>
                            <p className="text-sm text-slate-500 dark:text-slate-400">
                              {integrations.vercel ? 'Connected' : 'Not connected'}
                            </p>
                          </div>
                        </div>
                        {integrations.vercel ? (
                          <button
                            onClick={() => handleDeleteIntegration('vercel')}
                            className="text-red-500 hover:text-red-600 transition-colors"
                          >
                            <Trash2 size={18} />
                          </button>
                        ) : (
                          <button
                            onClick={() => setShowTokenInput(prev => ({ ...prev, vercel: !prev.vercel }))}
                            className="text-sm text-[#25f46a] hover:underline"
                          >
                            {showTokenInput.vercel ? 'Cancel' : 'Connect'}
                          </button>
                        )}
                      </div>
                      
                      {showTokenInput.vercel && !integrations.vercel && (
                        <div className="space-y-3">
                          <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                              Vercel Token
                            </label>
                            <input
                              type="password"
                              value={tempTokens.vercel || ''}
                              onChange={(e) => setTempTokens(prev => ({ ...prev, vercel: e.target.value }))}
                              placeholder="vercel_token_xxxxxxxxxxxxxxxx"
                              className="w-full px-4 py-2.5 rounded-lg border border-slate-200 dark:border-white/20 bg-white dark:bg-[#0a0a0a] text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#25f46a]/50"
                            />
                            <p className="text-xs text-slate-500 mt-1">
                              Token format: starts with "vercel_" (24+ characters). Get it from <a href="https://vercel.com/account/tokens" target="_blank" rel="noopener noreferrer" className="text-[#25f46a] hover:underline">vercel.com/account/tokens</a>
                            </p>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                              Team ID (Optional)
                            </label>
                            <input
                              type="text"
                              value={tempTokens['vercel-team'] || ''}
                              onChange={(e) => setTempTokens(prev => ({ ...prev, 'vercel-team': e.target.value }))}
                              placeholder="team_..."
                              className="w-full px-4 py-2.5 rounded-lg border border-slate-200 dark:border-white/20 bg-white dark:bg-[#0a0a0a] text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#25f46a]/50"
                            />
                          </div>
                          <button
                            onClick={() => handleSaveIntegration('vercel')}
                            disabled={savingIntegration === 'vercel'}
                            className="w-full py-2.5 bg-[#25f46a] text-[#0a0a0a] rounded-lg font-bold hover:brightness-110 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                          >
                            {savingIntegration === 'vercel' ? (
                              <>
                                <Loader2 size={18} className="animate-spin" />
                                Validating...
                              </>
                            ) : (
                              <>
                                <Check size={18} />
                                Save & Validate Vercel Token
                              </>
                            )}
                          </button>
                        </div>
                      )}
                      
                      {integrations.vercel && (
                        <div className="flex items-center gap-2 text-sm text-[#25f46a]">
                          <Check size={16} />
                          <span>Token saved (****{integrations.vercel.token.slice(-4)})</span>
                        </div>
                      )}
                    </div>

                    {/* Netlify */}
                    <div className="p-4 bg-slate-50 dark:bg-[#1a1a1a] rounded-xl border border-slate-200 dark:border-white/10">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-[#00AD9F] rounded-lg flex items-center justify-center">
                            <svg className="w-6 h-6 text-white" viewBox="0 0 40 40" fill="none">
                              <path d="M28.592 15.324L20.812 7.544C20.272 7.004 19.272 7.004 18.732 7.544L10.952 15.324C10.412 15.864 10.412 16.864 10.952 17.404L18.732 25.184C19.272 25.724 20.272 25.724 20.812 25.184L28.592 17.404C29.132 16.864 29.132 15.864 28.592 15.324Z" fill="currentColor"/>
                            </svg>
                          </div>
                          <div>
                            <p className="font-semibold text-slate-900 dark:text-white">Netlify</p>
                            <p className="text-sm text-slate-500 dark:text-slate-400">
                              {integrations.netlify ? 'Connected' : 'Not connected'}
                            </p>
                          </div>
                        </div>
                        {integrations.netlify ? (
                          <button
                            onClick={() => handleDeleteIntegration('netlify')}
                            className="text-red-500 hover:text-red-600 transition-colors"
                          >
                            <Trash2 size={18} />
                          </button>
                        ) : (
                          <button
                            onClick={() => setShowTokenInput(prev => ({ ...prev, netlify: !prev.netlify }))}
                            className="text-sm text-[#25f46a] hover:underline"
                          >
                            {showTokenInput.netlify ? 'Cancel' : 'Connect'}
                          </button>
                        )}
                      </div>
                      
                      {showTokenInput.netlify && !integrations.netlify && (
                        <div className="space-y-3">
                          <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                              Netlify Token
                            </label>
                            <input
                              type="password"
                              value={tempTokens.netlify || ''}
                              onChange={(e) => setTempTokens(prev => ({ ...prev, netlify: e.target.value }))}
                              placeholder="nfp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                              className="w-full px-4 py-2.5 rounded-lg border border-slate-200 dark:border-white/20 bg-white dark:bg-[#0a0a0a] text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#25f46a]/50"
                            />
                            <p className="text-xs text-slate-500 mt-1">
                              Token format: starts with "nfp_" (40+ characters). Get it from <a href="https://app.netlify.com/user/applications/personal" target="_blank" rel="noopener noreferrer" className="text-[#25f46a] hover:underline">netlify.com/user/applications</a>
                            </p>
                          </div>
                          <button
                            onClick={() => handleSaveIntegration('netlify')}
                            disabled={savingIntegration === 'netlify'}
                            className="w-full py-2.5 bg-[#25f46a] text-[#0a0a0a] rounded-lg font-bold hover:brightness-110 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                          >
                            {savingIntegration === 'netlify' ? (
                              <>
                                <Loader2 size={18} className="animate-spin" />
                                Validating...
                              </>
                            ) : (
                              <>
                                <Check size={18} />
                                Save & Validate Netlify Token
                              </>
                            )}
                          </button>
                        </div>
                      )}
                      
                      {integrations.netlify && (
                        <div className="flex items-center gap-2 text-sm text-[#25f46a]">
                          <Check size={16} />
                          <span>Token saved (****{integrations.netlify.token.slice(-4)})</span>
                        </div>
                      )}
                    </div>

                    {/* GitHub */}
                    <div className="p-4 bg-slate-50 dark:bg-[#1a1a1a] rounded-xl border border-slate-200 dark:border-white/10">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-[#181717] rounded-lg flex items-center justify-center border border-slate-700">
                            <svg className="w-6 h-6 text-white" viewBox="0 0 98 96" fill="none">
                              <path fillRule="evenodd" clipRule="evenodd" d="M48.854 0C21.839 0 0 22 0 49.217c0 21.756 13.993 40.172 33.405 46.69 2.427.49 3.316-1.059 3.316-2.362 0-1.141-.08-5.052-.08-9.127-13.59 2.934-16.42-5.867-16.42-5.867-2.184-5.704-5.42-7.17-5.42-7.17-4.448-3.015.324-3.015.324-3.015 4.934.326 7.523 5.052 7.523 5.052 4.367 7.496 11.404 5.378 14.235 4.074.404-3.178 1.699-5.378 3.074-6.6-10.839-1.141-22.243-5.378-22.243-24.283 0-5.378 1.94-9.778 5.014-13.2-.485-1.222-2.184-6.275.486-13.038 0 0 4.125-1.304 13.426 5.052a46.97 46.97 0 0 1 12.214-1.63c4.125 0 8.33.571 12.213 1.63 9.302-6.356 13.427-5.052 13.427-5.052 2.67 6.763.97 11.816.485 13.038 3.155 3.422 5.015 7.822 5.015 13.2 0 18.905-11.404 23.06-22.324 24.283 1.78 1.548 3.316 4.481 3.316 9.126 0 6.6-.08 11.897-.08 13.526 0 1.304.89 2.853 3.316 2.364 19.412-6.52 33.405-24.935 33.405-46.691C97.707 22 75.788 0 48.854 0z" fill="currentColor"/>
                            </svg>
                          </div>
                          <div>
                            <p className="font-semibold text-slate-900 dark:text-white">GitHub Pages</p>
                            <p className="text-sm text-slate-500 dark:text-slate-400">
                              {integrations.github ? 'Connected' : 'Not connected'}
                            </p>
                          </div>
                        </div>
                        {integrations.github ? (
                          <button
                            onClick={() => handleDeleteIntegration('github')}
                            className="text-red-500 hover:text-red-600 transition-colors"
                          >
                            <Trash2 size={18} />
                          </button>
                        ) : (
                          <button
                            onClick={() => setShowTokenInput(prev => ({ ...prev, github: !prev.github }))}
                            className="text-sm text-[#25f46a] hover:underline"
                          >
                            {showTokenInput.github ? 'Cancel' : 'Connect'}
                          </button>
                        )}
                      </div>
                      
                      {showTokenInput.github && !integrations.github && (
                        <div className="space-y-3">
                          <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                              GitHub Token
                            </label>
                            <input
                              type="password"
                              value={tempTokens.github || ''}
                              onChange={(e) => setTempTokens(prev => ({ ...prev, github: e.target.value }))}
                              placeholder="ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                              className="w-full px-4 py-2.5 rounded-lg border border-slate-200 dark:border-white/20 bg-white dark:bg-[#0a0a0a] text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#25f46a]/50"
                            />
                            <p className="text-xs text-slate-500 mt-1">
                              Token format: starts with "ghp_" (36+ characters). Get it from <a href="https://github.com/settings/tokens" target="_blank" rel="noopener noreferrer" className="text-[#25f46a] hover:underline">github.com/settings/tokens</a> (repo scope required)
                            </p>
                          </div>
                          <button
                            onClick={() => handleSaveIntegration('github')}
                            disabled={savingIntegration === 'github'}
                            className="w-full py-2.5 bg-[#25f46a] text-[#0a0a0a] rounded-lg font-bold hover:brightness-110 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                          >
                            {savingIntegration === 'github' ? (
                              <>
                                <Loader2 size={18} className="animate-spin" />
                                Validating...
                              </>
                            ) : (
                              <>
                                <Check size={18} />
                                Save & Validate GitHub Token
                              </>
                            )}
                          </button>
                        </div>
                      )}
                      
                      {integrations.github && (
                        <div className="flex items-center gap-2 text-sm text-[#25f46a]">
                          <Check size={16} />
                          <span>Token saved (****{integrations.github.token.slice(-4)})</span>
                        </div>
                      )}
                    </div>
                  </div>
                  )}
                </SettingSection>
              </div>
            )}

            {activeTab === 'billing' && (
              <div className="space-y-6">
                <SettingSection
                  icon={<CreditCard size={24} />}
                  title="Current Plan"
                  description="Manage your subscription"
                >
                  <div className="bg-gradient-to-r from-[#25f46a]/10 to-transparent dark:from-[#25f46a]/5 rounded-xl p-6 border border-[#25f46a]/20 mb-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Your Plan</p>
                        <p className="text-2xl font-bold text-slate-900 dark:text-white">Pro Plan</p>
                        <p className="text-sm text-slate-500 dark:text-slate-400">Rp 50.000/month • Renews on March 15, 2026</p>
                      </div>
                      <Link
                        to="/pricing"
                        className="px-4 py-2 bg-[#25f46a] text-[#0a0a0a] rounded-lg font-bold hover:brightness-110 transition-all"
                      >
                        Upgrade
                      </Link>
                    </div>
                  </div>
                </SettingSection>

                <SettingSection
                  icon={<CreditCard size={24} />}
                  title="Payment Method"
                  description="Manage your payment details"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-[#1a1a1a] rounded-xl border border-slate-200 dark:border-white/10">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-8 bg-gradient-to-r from-blue-600 to-blue-400 rounded flex items-center justify-center text-white text-xs font-bold">
                          VISA
                        </div>
                        <div>
                          <p className="font-medium text-slate-900 dark:text-white">•••• •••• •••• 4242</p>
                          <p className="text-sm text-slate-500 dark:text-slate-400">Expires 12/26</p>
                        </div>
                      </div>
                      <button className="text-sm text-[#25f46a] hover:underline">Edit</button>
                    </div>
                    <button className="w-full py-3 border-2 border-dashed border-slate-200 dark:border-white/20 rounded-xl text-slate-500 dark:text-slate-400 font-medium hover:border-[#25f46a] hover:text-[#25f46a] transition-all flex items-center justify-center gap-2">
                      <CreditCard size={20} />
                      Add Payment Method
                    </button>
                  </div>
                </SettingSection>

                <SettingSection
                  icon={<Download size={24} />}
                  title="Billing History"
                  description="View and download invoices"
                >
                  <div className="space-y-3">
                    {[
                      { date: 'Feb 15, 2026', amount: 'Rp 50.000', status: 'Paid' },
                      { date: 'Jan 15, 2026', amount: 'Rp 50.000', status: 'Paid' },
                      { date: 'Dec 15, 2025', amount: 'Rp 50.000', status: 'Paid' },
                    ].map((invoice, idx) => (
                      <div key={idx} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-[#1a1a1a] rounded-xl border border-slate-200 dark:border-white/10">
                        <div>
                          <p className="font-medium text-slate-900 dark:text-white">{invoice.date}</p>
                          <p className="text-sm text-slate-500 dark:text-slate-400">{invoice.amount}</p>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="px-3 py-1 bg-[#25f46a]/10 text-[#25f46a] text-xs font-medium rounded-full">
                            {invoice.status}
                          </span>
                          <button className="text-slate-500 hover:text-[#25f46a] transition-colors">
                            <Download size={18} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </SettingSection>
              </div>
            )}

            {activeTab === 'api' && (
              <div className="space-y-6">
                <SettingSection
                  icon={<Key size={24} />}
                  title="API Keys"
                  description="Manage your API keys for programmatic access"
                >
                  <div className="space-y-4 mb-4">
                    {loadingApiKeys ? (
                      <div className="flex items-center justify-center py-8">
                        <Loader2 className="w-6 h-6 animate-spin text-[#25f46a]" />
                      </div>
                    ) : apiKeys.length === 0 ? (
                      <div className="text-center py-8 text-slate-500 dark:text-slate-400">
                        <Key size={48} className="mx-auto mb-4 opacity-30" />
                        <p>No API keys yet. Generate your first key to get started.</p>
                      </div>
                    ) : (
                      apiKeys.map((apiKey) => (
                        <div key={apiKey.id} className="p-4 bg-slate-50 dark:bg-[#1a1a1a] rounded-xl border border-slate-200 dark:border-white/10">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-3">
                              <p className="font-medium text-slate-900 dark:text-white">{apiKey.name}</p>
                              <span className="px-2 py-0.5 bg-[#25f46a]/10 text-[#25f46a] text-xs font-medium rounded-full">
                                Active
                              </span>
                            </div>
                            <button className="text-red-500 hover:text-red-600 transition-colors">
                              <Trash2 size={18} />
                            </button>
                          </div>
                          <p className="text-sm font-mono text-slate-500 dark:text-slate-400">{apiKey.key}</p>
                          <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Created: {apiKey.created}</p>
                        </div>
                      ))
                    )}
                  </div>
                  <button className="w-full py-3 bg-[#25f46a] text-[#0a0a0a] rounded-xl font-bold hover:brightness-110 transition-all flex items-center justify-center gap-2">
                    <Key size={20} />
                    Generate New Key
                  </button>
                </SettingSection>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="space-y-6">
                <SettingSection
                  icon={<Shield size={24} />}
                  title="Password"
                  description="Update your password"
                >
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Current Password</label>
                      <input
                        type="password"
                        placeholder="Enter current password"
                        className="w-full px-4 py-2.5 rounded-lg border border-slate-200 dark:border-white/20 bg-white dark:bg-[#1a1a1a] text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#25f46a]/50 focus:border-[#25f46a]"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">New Password</label>
                      <input
                        type="password"
                        placeholder="Enter new password"
                        className="w-full px-4 py-2.5 rounded-lg border border-slate-200 dark:border-white/20 bg-white dark:bg-[#1a1a1a] text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#25f46a]/50 focus:border-[#25f46a]"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Confirm New Password</label>
                      <input
                        type="password"
                        placeholder="Confirm new password"
                        className="w-full px-4 py-2.5 rounded-lg border border-slate-200 dark:border-white/20 bg-white dark:bg-[#1a1a1a] text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#25f46a]/50 focus:border-[#25f46a]"
                      />
                    </div>
                  </div>
                </SettingSection>

                <SettingSection
                  icon={<Shield size={24} />}
                  title="Two-Factor Authentication"
                  description="Add an extra layer of security"
                >
                  <div className="p-4 bg-slate-50 dark:bg-[#1a1a1a] rounded-xl border border-slate-200 dark:border-white/10">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-slate-900 dark:text-white">Authenticator App</p>
                        <p className="text-sm text-slate-500 dark:text-slate-400">Use an app like Google Authenticator</p>
                      </div>
                      <button className="px-4 py-2 border border-slate-200 dark:border-white/20 rounded-lg font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 transition-all">
                        Enable
                      </button>
                    </div>
                  </div>
                </SettingSection>

                <SettingSection
                  icon={<X size={24} />}
                  title="Delete Account"
                  description="Permanently delete your account and data"
                >
                  <div className="p-4 bg-red-500/5 rounded-xl border border-red-500/20">
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                      Once you delete your account, there is no going back. Please be certain. All your projects and data will be permanently removed.
                    </p>
                    <button
                      onClick={() => setShowDeleteModal(true)}
                      className="px-4 py-2 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition-all flex items-center gap-2"
                    >
                      <Trash2 size={18} />
                      Delete Account
                    </button>
                  </div>
                </SettingSection>
              </div>
            )}

            <div className="mt-8 flex items-center justify-between pt-6 border-t border-slate-200 dark:border-white/10">
              <div className="flex items-center gap-2">
                {savedMessage && (
                  <>
                    <Check size={20} className="text-[#25f46a]" />
                    <span className="text-slate-600 dark:text-slate-400">{savedMessage}</span>
                  </>
                )}
              </div>
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-6 py-2.5 bg-[#25f46a] text-[#0a0a0a] rounded-lg font-bold hover:brightness-110 transition-all shadow-lg shadow-[#25f46a]/20 disabled:opacity-50 flex items-center gap-2"
              >
                {saving ? (
                  <>
                    <Loader2 size={20} className="animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save size={20} />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </div>
        </main>
      </div>

      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-[#1a1a1a] rounded-2xl max-w-md w-full p-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <X className="text-red-500" size={32} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Delete Account?</h3>
              <p className="text-slate-600 dark:text-slate-400 mb-6">
                This action cannot be undone. All your data will be permanently deleted.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 py-3 px-4 rounded-lg border border-slate-200 dark:border-white/20 font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteAccount}
                  className="flex-1 py-3 px-4 rounded-lg bg-red-500 text-white font-bold hover:bg-red-600 transition-all"
                >
                  Delete Account
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
