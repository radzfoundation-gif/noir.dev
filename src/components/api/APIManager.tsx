import { useState, useEffect } from 'react';
import { X, Key, Copy, Check, RefreshCw, Trash2, ExternalLink, Webhook, Terminal } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { publicAPIService, type APIKey } from '../../lib/publicAPIService';

interface APIManagerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const APIManager: React.FC<APIManagerProps> = ({
  isOpen,
  onClose,
}) => {
  const [apiKeys, setApiKeys] = useState<APIKey[]>([]);
  const [newKeyName, setNewKeyName] = useState('');
  const [showNewKey, setShowNewKey] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'keys' | 'docs' | 'webhooks'>('keys');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadAPIKeys();
    }
  }, [isOpen]);

  const loadAPIKeys = async () => {
    try {
      const keys = await publicAPIService.getAPIKeys();
      setApiKeys(keys);
    } catch (error) {
      console.error('Failed to load API keys:', error);
    }
  };

  const handleCreateKey = async () => {
    if (!newKeyName.trim()) return;

    setIsLoading(true);
    try {
      const result = await publicAPIService.createAPIKey(newKeyName, ['read', 'write']);
      setShowNewKey(result.key);
      setNewKeyName('');
      await loadAPIKeys();
    } catch (error) {
      console.error('Failed to create key:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRevokeKey = async (keyId: string) => {
    if (!confirm('Are you sure you want to revoke this API key? This action cannot be undone.')) {
      return;
    }

    try {
      await publicAPIService.revokeAPIKey(keyId);
      await loadAPIKeys();
    } catch (error) {
      console.error('Failed to revoke key:', error);
    }
  };

  const copyToClipboard = (text: string, keyId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(keyId);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const sdkExamples = publicAPIService.getSDKExamples();

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
            <div className="bg-[#171717] border border-neutral-800 rounded-2xl shadow-2xl w-full max-w-3xl max-h-[85vh] pointer-events-auto overflow-hidden flex flex-col">
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-lime-500/10 flex items-center justify-center">
                    <Key className="w-5 h-5 text-lime-400" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-white">API & Integrations</h2>
                    <p className="text-sm text-neutral-400">Manage API keys and webhooks</p>
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
                {(['keys', 'docs', 'webhooks'] as const).map((tab) => (
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
                {activeTab === 'keys' && (
                  <div className="space-y-6">
                    {/* New Key Form */}
                    <div className="flex gap-3">
                      <input
                        type="text"
                        value={newKeyName}
                        onChange={(e) => setNewKeyName(e.target.value)}
                        placeholder="Key name (e.g., Production, Development)"
                        className="flex-1 bg-neutral-900 border border-neutral-800 rounded-lg px-4 py-2.5 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-lime-500"
                      />
                      <button
                        onClick={handleCreateKey}
                        disabled={isLoading || !newKeyName.trim()}
                        className="px-4 py-2.5 bg-lime-500 hover:bg-lime-400 disabled:opacity-50 text-black text-sm font-bold rounded-lg transition-colors flex items-center gap-2"
                      >
                        {isLoading ? (
                          <RefreshCw size={16} className="animate-spin" />
                        ) : (
                          <Key size={16} />
                        )}
                        Create Key
                      </button>
                    </div>

                    {/* Show New Key */}
                    {showNewKey && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-4 bg-lime-500/10 border border-lime-500/30 rounded-lg"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-lime-400">New API Key Created</span>
                          <button
                            onClick={() => setShowNewKey(null)}
                            className="text-neutral-500 hover:text-white"
                          >
                            <X size={16} />
                          </button>
                        </div>
                        <p className="text-xs text-neutral-400 mb-3">
                          Copy this key now. You won&apos;t be able to see it again!
                        </p>
                        <div className="flex gap-2">
                          <code className="flex-1 bg-black/30 rounded px-3 py-2 text-sm text-lime-400 font-mono break-all">
                            {showNewKey}
                          </code>
                          <button
                            onClick={() => copyToClipboard(showNewKey, 'new')}
                            className="px-3 py-2 bg-neutral-800 hover:bg-neutral-700 rounded-lg transition-colors"
                          >
                            {copiedKey === 'new' ? <Check size={16} className="text-lime-400" /> : <Copy size={16} />}
                          </button>
                        </div>
                      </motion.div>
                    )}

                    {/* API Keys List */}
                    <div className="space-y-3">
                      {apiKeys.length === 0 ? (
                        <div className="text-center py-8 text-neutral-500">
                          <Key size={48} className="mx-auto mb-4 opacity-30" />
                          <p className="text-sm">No API keys yet</p>
                          <p className="text-xs mt-1">Create your first key to get started</p>
                        </div>
                      ) : (
                        apiKeys.map((key) => (
                          <div
                            key={key.id}
                            className="flex items-center justify-between p-4 bg-neutral-900 rounded-lg border border-neutral-800"
                          >
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <h4 className="text-sm font-medium text-white">{key.name}</h4>
                                <span className="px-2 py-0.5 bg-neutral-800 rounded text-[10px] text-neutral-400">
                                  {key.keyPrefix}...
                                </span>
                              </div>
                              <div className="flex items-center gap-4 mt-1 text-xs text-neutral-500">
                                <span>{key.permissions.join(', ')}</span>
                                <span>•</span>
                                <span>Rate limit: {key.rateLimit}/hour</span>
                                {key.lastUsedAt && (
                                  <>
                                    <span>•</span>
                                    <span>Last used: {new Date(key.lastUsedAt).toLocaleDateString()}</span>
                                  </>
                                )}
                              </div>
                            </div>
                            <button
                              onClick={() => handleRevokeKey(key.id)}
                              className="p-2 text-neutral-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                              title="Revoke key"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}

                {activeTab === 'docs' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-sm font-medium text-white mb-3">SDK Examples</h3>
                      <div className="space-y-3">
                        {Object.entries(sdkExamples).map(([lang, code]) => (
                          <div key={lang} className="bg-neutral-900 rounded-lg border border-neutral-800 overflow-hidden">
                            <div className="flex items-center justify-between px-4 py-2 bg-neutral-800/50 border-b border-neutral-800">
                              <span className="text-xs font-medium text-neutral-300 capitalize">{lang}</span>
                              <button
                                onClick={() => copyToClipboard(code, lang)}
                                className="text-neutral-500 hover:text-lime-400 transition-colors"
                              >
                                {copiedKey === lang ? <Check size={14} /> : <Copy size={14} />}
                              </button>
                            </div>
                            <pre className="p-4 text-xs text-neutral-400 font-mono overflow-x-auto">
                              {code}
                            </pre>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium text-white mb-3">API Reference</h3>
                      <a
                        href="#"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-sm text-lime-400 hover:text-lime-300"
                      >
                        <ExternalLink size={14} />
                        View full documentation
                      </a>
                    </div>
                  </div>
                )}

                {activeTab === 'webhooks' && (
                  <div className="space-y-6">
                    <div className="p-4 bg-neutral-900 rounded-lg border border-neutral-800">
                      <div className="flex items-center gap-3 mb-4">
                        <Webhook size={20} className="text-lime-400" />
                        <div>
                          <h3 className="text-sm font-medium text-white">Webhook Configuration</h3>
                          <p className="text-xs text-neutral-500">Get notified when events occur</p>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <input
                          type="url"
                          placeholder="https://your-app.com/webhook"
                          className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2.5 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-lime-500"
                        />
                        <div className="flex gap-2 flex-wrap">
                          {['project.created', 'project.updated', 'generation.completed'].map((event) => (
                            <label key={event} className="flex items-center gap-2 px-3 py-1.5 bg-neutral-800 rounded-lg text-xs">
                              <input type="checkbox" className="rounded border-neutral-700 bg-neutral-800 text-lime-500" />
                              <span className="text-neutral-300">{event}</span>
                            </label>
                          ))}
                        </div>
                        <button className="w-full px-4 py-2.5 bg-lime-500 hover:bg-lime-400 text-black text-sm font-bold rounded-lg transition-colors">
                          Add Webhook
                        </button>
                      </div>
                    </div>

                    <div className="text-center py-8 text-neutral-500">
                      <Terminal size={48} className="mx-auto mb-4 opacity-30" />
                      <p className="text-sm">No webhooks configured yet</p>
                      <p className="text-xs mt-1">Webhooks allow real-time notifications</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
