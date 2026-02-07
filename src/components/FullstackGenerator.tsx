import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Code2, Sparkles, Download, Layout, Server, Database, Globe, Layers, Zap, ChevronRight, X, Check, Monitor, Cpu, Palette, ShoppingCart, Users, User, MessageCircle } from 'lucide-react';

interface FullstackGeneratorProps {
  onGenerate?: (app: any) => void;
}

type GeneratorMode = 'fullstack' | 'frontend' | 'backend-only';

const appTypes = [
  { id: 'saas', name: 'SaaS', icon: Layers, description: 'Full-featured SaaS with auth & billing' },
  { id: 'blog', name: 'Blog', icon: Layout, description: 'CMS with posts & comments' },
  { id: 'ecommerce', name: 'Store', icon: Globe, description: 'Online store with payments' },
  { id: 'dashboard', name: 'Dashboard', icon: Server, description: 'Analytics & admin panel' },
  { id: 'portfolio', name: 'Portfolio', icon: Database, description: 'Personal portfolio site' },
  { id: 'crm', name: 'CRM', icon: Zap, description: 'Customer management system' },
  { id: 'chat', name: 'Chat', icon: MessageCircle, description: 'Real-time messaging app' },
  { id: 'cms', name: 'CMS', icon: Layers, description: 'Headless content management' },
];

const frontendTemplates = [
  { id: 'landing', name: 'Landing Page', icon: Globe, description: 'Marketing landing page' },
  { id: 'admin', name: 'Admin Panel', icon: Server, description: 'Dashboard with sidebar' },
  { id: 'ecommerce-ui', name: 'E-commerce UI', icon: ShoppingCart, description: 'Shop interface' },
  { id: 'blog-ui', name: 'Blog UI', icon: Layout, description: 'Blog interface' },
  { id: 'portfolio-ui', name: 'Portfolio', icon: User, description: 'Personal portfolio' },
  { id: 'social', name: 'Social Feed', icon: Users, description: 'Social media feed' },
];

const frameworks = [
  { id: 'react-vite', name: 'React + Vite', icon: Code2 },
  { id: 'nextjs', name: 'Next.js', icon: Globe },
  { id: 'astro', name: 'Astro', icon: Monitor },
];

const databases = [
  { id: 'postgresql', name: 'PostgreSQL', icon: Database },
  { id: 'mysql', name: 'MySQL', icon: Server },
  { id: 'mongodb', name: 'MongoDB', icon: Layers },
  { id: 'sqlite', name: 'SQLite', icon: Cpu },
  { id: 'none', name: 'None (Static)', icon: Globe },
];

const backendFrameworks = [
  { id: 'express', name: 'Express.js', icon: Cpu },
  { id: 'fastify', name: 'Fastify', icon: Zap },
  { id: 'nestjs', name: 'NestJS', icon: Layers },
];

const uis = [
  { id: 'tailwind', name: 'Tailwind CSS', color: 'bg-cyan-500' },
  { id: 'shadcn', name: 'shadcn/ui', color: 'bg-slate-900' },
  { id: 'daisyui', name: 'DaisyUI', color: 'bg-purple-500' },
];

export default function FullstackGenerator({ onGenerate }: FullstackGeneratorProps) {
  const [mode, setMode] = useState<GeneratorMode>('fullstack');
  const [step, setStep] = useState<'mode' | 'template' | 'configure' | 'prompt' | 'generating' | 'complete'>('mode');
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [config, setConfig] = useState({
    framework: 'react-vite',
    backend: 'express',
    database: 'postgresql',
    ui: 'tailwind',
    auth: true,
    deployment: 'vercel',
  });
  const [prompt, setPrompt] = useState('');
  const [generatedApp, setGeneratedApp] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState('');

  const handleModeSelect = (selectedMode: GeneratorMode) => {
    setMode(selectedMode);
    setStep('template');
  };

  const handleTemplateSelect = (typeId: string) => {
    setSelectedType(typeId);
    setStep('configure');
  };

  const handleGenerate = async () => {
    setIsLoading(true);
    setStep('generating');
    setProgress('Analyzing requirements...');

    try {
      const response = await fetch('/api/generate-fullstack', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          type: selectedType, 
          mode,
          config: mode === 'frontend' ? { framework: config.framework, ui: config.ui } : config
        })
      });

      const result = await response.json();

      if (result.success) {
        setGeneratedApp(result.app);
        setStep('complete');
        onGenerate?.(result.app);
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error('Generation error:', error);
      setStep('configure');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePromptGenerate = async () => {
    if (!prompt.trim()) return;

    setIsLoading(true);
    setStep('generating');
    setProgress('Analyzing your idea...');

    try {
      const response = await fetch('/api/generate-fullstack', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, mode })
      });

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value);
          const lines = chunk.split('\n\n');

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              try {
                const data = JSON.parse(line.slice(6));
                if (data.status) {
                  setProgress(data.message || data.status);
                } else if (data.data) {
                  setGeneratedApp(data.data);
                  setStep('complete');
                }
              } catch (e) {}
            }
          }
        }
      }
    } catch (error) {
      console.error('Generation error:', error);
      setStep('prompt');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = async () => {
    if (!generatedApp) return;

    const { default: JSZip } = await import('jszip');
    const { default: saveAs } = await import('file-saver');

    const zip = new JSZip();

    Object.entries(generatedApp.frontend || {}).forEach(([path, content]) => {
      zip.file(path, content as string);
    });

    if (generatedApp.backend) {
      Object.entries(generatedApp.backend).forEach(([path, content]) => {
        zip.file(`server/${path}`, content as string);
      });
    }

    if (generatedApp.config) {
      zip.file('package.json', generatedApp.config.packageJson);
      zip.file('.env.example', generatedApp.config.envExample);
      zip.file('README.md', generatedApp.config.readme);
      if (generatedApp.config.dockerfile) {
        zip.file('Dockerfile', generatedApp.config.dockerfile);
      }
    }

    if (generatedApp.deployment?.vercel) {
      Object.entries(generatedApp.deployment.vercel).forEach(([path, content]) => {
        zip.file(`.vercel/${path}`, content as string);
      });
    }

    const blob = await zip.generateAsync({ type: 'blob' });
    saveAs(blob, `noir-${mode}-${selectedType || 'app'}-${Date.now()}.zip`);
  };

  const currentTemplates = mode === 'fullstack' ? appTypes : frontendTemplates;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
            <Sparkles className="w-8 h-8 text-purple-400" />
            App Generator
          </h1>
          <p className="text-gray-400">Build complete web applications in seconds</p>
        </header>

        <AnimatePresence mode="wait">
          {step === 'mode' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="grid md:grid-cols-3 gap-6">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleModeSelect('fullstack')}
                  className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-lg border border-purple-500/30 rounded-2xl p-8 text-left hover:bg-purple-500/30 transition-colors"
                >
                  <div className="w-14 h-14 bg-purple-500/20 rounded-xl flex items-center justify-center mb-4">
                    <Layers className="w-8 h-8 text-purple-400" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Full-Stack App</h3>
                  <p className="text-gray-300 mb-4">Frontend + Backend + Database</p>
                  <ul className="text-sm text-gray-400 space-y-1">
                    <li>• React/Vite frontend</li>
                    <li>• Express/Fastify API</li>
                    <li>• PostgreSQL/MongoDB</li>
                    <li>• Authentication</li>
                  </ul>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleModeSelect('frontend')}
                  className="bg-gradient-to-br from-cyan-500/20 to-blue-500/20 backdrop-blur-lg border border-cyan-500/30 rounded-2xl p-8 text-left hover:bg-cyan-500/30 transition-colors"
                >
                  <div className="w-14 h-14 bg-cyan-500/20 rounded-xl flex items-center justify-center mb-4">
                    <Monitor className="w-8 h-8 text-cyan-400" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Frontend Only</h3>
                  <p className="text-gray-300 mb-4">Beautiful UI components</p>
                  <ul className="text-sm text-gray-400 space-y-1">
                    <li>• React + Tailwind</li>
                    <li>• Ready-to-use pages</li>
                    <li>• Responsive design</li>
                    <li>• No backend needed</li>
                  </ul>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleModeSelect('backend-only')}
                  className="bg-gradient-to-br from-orange-500/20 to-red-500/20 backdrop-blur-lg border border-orange-500/30 rounded-2xl p-8 text-left hover:bg-orange-500/30 transition-colors"
                >
                  <div className="w-14 h-14 bg-orange-500/20 rounded-xl flex items-center justify-center mb-4">
                    <Server className="w-8 h-8 text-orange-400" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Backend Only</h3>
                  <p className="text-gray-300 mb-4">REST API + Database</p>
                  <ul className="text-sm text-gray-400 space-y-1">
                    <li>• Express/NestJS API</li>
                    <li>• Full CRUD operations</li>
                    <li>• JWT Authentication</li>
                    <li>• Database models</li>
                  </ul>
                </motion.button>
              </div>

              <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6">
                <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                  <Code2 className="w-5 h-5" />
                  Or describe your app
                </h3>
                <div className="flex gap-4">
                  <input
                    type="text"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder={`I want to build a ${mode === 'fullstack' ? 'full-stack' : mode === 'frontend' ? 'frontend' : 'backend'} app...`}
                    className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                  <button
                    onClick={handlePromptGenerate}
                    disabled={!prompt.trim()}
                    className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-medium flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <Sparkles className="w-5 h-5" />
                    Generate
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {step === 'template' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-8"
            >
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-2xl font-bold text-white capitalize">{mode} Templates</h2>
                  <p className="text-gray-400">
                    {mode === 'fullstack' ? 'Choose a full-stack app type' : mode === 'frontend' ? 'Choose a UI template' : 'Choose a backend template'}
                  </p>
                </div>
                <button
                  onClick={() => setStep('mode')}
                  className="text-gray-400 hover:text-white transition-colors flex items-center gap-2"
                >
                  <ChevronRight className="w-5 h-5 rotate-180" />
                  Back
                </button>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {currentTemplates.map((type) => (
                  <motion.button
                    key={type.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleTemplateSelect(type.id)}
                    className="bg-white/5 border border-white/10 rounded-xl p-6 text-left hover:bg-white/10 transition-colors"
                  >
                    <type.icon className="w-10 h-10 text-purple-400 mb-3" />
                    <h3 className="text-white font-semibold mb-1">{type.name}</h3>
                    <p className="text-sm text-gray-400">{type.description}</p>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}

          {step === 'configure' && selectedType && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-8"
            >
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-2xl font-bold text-white capitalize">{selectedType} Configuration</h2>
                  <p className="text-gray-400">Customize your {mode} settings</p>
                </div>
                <button
                  onClick={() => setStep(mode === 'frontend' ? 'mode' : 'template')}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {mode !== 'backend-only' && (
                  <div className="space-y-6">
                    <div>
                      <label className="text-white font-medium mb-3 block">Frontend Framework</label>
                      <div className="grid grid-cols-1 gap-3">
                        {frameworks.map((fw) => (
                          <button
                            key={fw.id}
                            onClick={() => setConfig({ ...config, framework: fw.id })}
                            className={`p-4 rounded-lg border transition-colors flex items-center gap-3 ${
                              config.framework === fw.id
                                ? 'bg-purple-500/20 border-purple-500 text-white'
                                : 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10'
                            }`}
                          >
                            <fw.icon className="w-5 h-5" />
                            {fw.name}
                          </button>
                        ))}
                      </div>
                    </div>

                    {mode === 'fullstack' && (
                      <div>
                        <label className="text-white font-medium mb-3 block">UI Library</label>
                        <div className="grid grid-cols-1 gap-3">
                          {uis.map((ui) => (
                            <button
                              key={ui.id}
                              onClick={() => setConfig({ ...config, ui: ui.id })}
                              className={`p-4 rounded-lg border transition-colors flex items-center gap-3 ${
                                config.ui === ui.id
                                  ? 'bg-purple-500/20 border-purple-500 text-white'
                                  : 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10'
                              }`}
                            >
                              <div className={`w-5 h-5 rounded ${ui.color}`} />
                              {ui.name}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {mode === 'fullstack' && (
                  <div className="space-y-6">
                    <div>
                      <label className="text-white font-medium mb-3 block">Backend Framework</label>
                      <div className="grid grid-cols-1 gap-3">
                        {backendFrameworks.map((fw) => (
                          <button
                            key={fw.id}
                            onClick={() => setConfig({ ...config, backend: fw.id })}
                            className={`p-4 rounded-lg border transition-colors flex items-center gap-3 ${
                              config.backend === fw.id
                                ? 'bg-purple-500/20 border-purple-500 text-white'
                                : 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10'
                            }`}
                          >
                            <fw.icon className="w-5 h-5" />
                            {fw.name}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="text-white font-medium mb-3 block">Database</label>
                      <div className="grid grid-cols-1 gap-3">
                        {databases.map((db) => (
                          <button
                            key={db.id}
                            onClick={() => setConfig({ ...config, database: db.id })}
                            className={`p-4 rounded-lg border transition-colors flex items-center gap-3 ${
                              config.database === db.id
                                ? 'bg-purple-500/20 border-purple-500 text-white'
                                : 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10'
                            }`}
                          >
                            <db.icon className="w-5 h-5" />
                            {db.name}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {mode === 'backend-only' && (
                  <div className="space-y-6">
                    <div>
                      <label className="text-white font-medium mb-3 block">Backend Framework</label>
                      <div className="grid grid-cols-1 gap-3">
                        {backendFrameworks.map((fw) => (
                          <button
                            key={fw.id}
                            onClick={() => setConfig({ ...config, backend: fw.id })}
                            className={`p-4 rounded-lg border transition-colors flex items-center gap-3 ${
                              config.backend === fw.id
                                ? 'bg-purple-500/20 border-purple-500 text-white'
                                : 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10'
                            }`}
                          >
                            <fw.icon className="w-5 h-5" />
                            {fw.name}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="text-white font-medium mb-3 block">Database</label>
                      <div className="grid grid-cols-1 gap-3">
                        {databases.slice(0, 4).map((db) => (
                          <button
                            key={db.id}
                            onClick={() => setConfig({ ...config, database: db.id })}
                            className={`p-4 rounded-lg border transition-colors flex items-center gap-3 ${
                              config.database === db.id
                                ? 'bg-purple-500/20 border-purple-500 text-white'
                                : 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10'
                            }`}
                          >
                            <db.icon className="w-5 h-5" />
                            {db.name}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                <div className="space-y-6">
                  <div>
                    <label className="text-white font-medium mb-3 block">Features</label>
                    <div className="space-y-3">
                      {mode !== 'frontend-only' && (
                        <label className="flex items-center gap-3 p-4 bg-white/5 rounded-lg cursor-pointer">
                          <input
                            type="checkbox"
                            checked={config.auth}
                            onChange={(e) => setConfig({ ...config, auth: e.target.checked })}
                            className="w-5 h-5 rounded border-white/20 bg-white/5 text-purple-500"
                          />
                          <span className="text-white">Authentication (JWT)</span>
                        </label>
                      )}
                      <div className="flex items-center gap-3 p-4 bg-white/5 rounded-lg">
                        <input
                          type="checkbox"
                          checked
                          readOnly
                          className="w-5 h-5 rounded border-white/20 bg-white/5 text-purple-500"
                        />
                        <span className="text-white">REST API</span>
                      </div>
                      <div className="flex items-center gap-3 p-4 bg-white/5 rounded-lg">
                        <input
                          type="checkbox"
                          checked
                          readOnly
                          className="w-5 h-5 rounded border-white/20 bg-white/5 text-purple-500"
                        />
                        <span className="text-white">Responsive Design</span>
                      </div>
                      {mode !== 'backend-only' && (
                        <div className="flex items-center gap-3 p-4 bg-white/5 rounded-lg">
                          <input
                            type="checkbox"
                            checked
                            readOnly
                            className="w-5 h-5 rounded border-white/20 bg-white/5 text-purple-500"
                          />
                          <span className="text-white">Dark Mode</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {mode === 'fullstack' && (
                    <div>
                      <label className="text-white font-medium mb-3 block">Deployment</label>
                      <select
                        value={config.deployment}
                        onChange={(e) => setConfig({ ...config, deployment: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                      >
                        <option value="vercel">Vercel</option>
                        <option value="netlify">Netlify</option>
                        <option value="railway">Railway</option>
                        <option value="render">Render</option>
                        <option value="none">Manual</option>
                      </select>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-8 flex justify-end gap-4">
                <button
                  onClick={() => setStep(mode === 'frontend' ? 'mode' : 'template')}
                  className="px-6 py-3 text-gray-300 hover:text-white transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={handleGenerate}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-lg font-medium flex items-center gap-2 transition-colors"
                >
                  <Sparkles className="w-5 h-5" />
                  Generate {mode === 'fullstack' ? 'Full-Stack' : mode === 'frontend' ? 'Frontend' : 'Backend'}
                </button>
              </div>
            </motion.div>
          )}

          {step === 'generating' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-12 text-center"
            >
              <div className="w-20 h-20 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-6" />
              <h2 className="text-2xl font-bold text-white mb-2">Generating Your {mode === 'fullstack' ? 'Full-Stack' : mode === 'frontend' ? 'Frontend' : 'Backend'}</h2>
              <p className="text-gray-400 mb-4">{progress}</p>
              <div className="max-w-md mx-auto bg-white/5 rounded-full h-2 overflow-hidden">
                <motion.div
                  className="h-full bg-purple-500"
                  initial={{ width: 0 }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 2 }}
                />
              </div>
            </motion.div>
          )}

          {step === 'complete' && generatedApp && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-8">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
                      <Check className="w-6 h-6 text-green-400" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-white">Generation Complete!</h2>
                      <p className="text-gray-400">Your {mode === 'fullstack' ? 'full-stack' : mode === 'frontend' ? 'frontend' : 'backend'} app is ready</p>
                    </div>
                  </div>
                  <button
                    onClick={handleDownload}
                    className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-medium flex items-center gap-2 transition-colors"
                  >
                    <Download className="w-5 h-5" />
                    Download ZIP
                  </button>
                </div>

                <div className="grid md:grid-cols-3 gap-6 mb-6">
                  <div className="bg-white/5 rounded-xl p-4">
                    <div className="text-gray-400 text-sm mb-1">Frontend Files</div>
                    <div className="text-2xl font-bold text-white">
                      {Object.keys(generatedApp.frontend || {}).length}
                    </div>
                  </div>
                  {generatedApp.backend && (
                    <div className="bg-white/5 rounded-xl p-4">
                      <div className="text-gray-400 text-sm mb-1">Backend Files</div>
                      <div className="text-2xl font-bold text-white">
                        {Object.keys(generatedApp.backend || {}).length}
                      </div>
                    </div>
                  )}
                  <div className="bg-white/5 rounded-xl p-4">
                    <div className="text-gray-400 text-sm mb-1">Config Files</div>
                    <div className="text-2xl font-bold text-white">
                      {Object.keys(generatedApp.config || {}).length}
                    </div>
                  </div>
                </div>

                {generatedApp.frontend && (
                  <div className="bg-white/5 rounded-xl p-6">
                    <h3 className="text-white font-semibold mb-4">Generated Files</h3>
                    <div className="max-h-64 overflow-y-auto space-y-2">
                      {Object.keys(generatedApp.frontend || {}).map((file) => (
                        <div key={file} className="flex items-center gap-2 text-sm">
                          <Code2 className="w-4 h-4 text-purple-400" />
                          <span className="text-gray-300">{file}</span>
                        </div>
                      ))}
                      {generatedApp.backend && Object.keys(generatedApp.backend).map((file) => (
                        <div key={file} className="flex items-center gap-2 text-sm">
                          <Server className="w-4 h-4 text-blue-400" />
                          <span className="text-gray-300">{file}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl p-6 border border-purple-500/30">
                <h3 className="text-white font-semibold mb-2">Next Steps</h3>
                <ol className="text-gray-300 space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="bg-purple-500 text-white text-xs px-2 py-0.5 rounded">1</span>
                    Extract the ZIP file
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="bg-purple-500 text-white text-xs px-2 py-0.5 rounded">2</span>
                    Run <code className="bg-white/10 px-2 py-0.5 rounded text-sm">npm install</code>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="bg-purple-500 text-white text-xs px-2 py-0.5 rounded">3</span>
                    Configure <code className="bg-white/10 px-2 py-0.5 rounded text-sm">.env</code> file
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="bg-purple-500 text-white text-xs px-2 py-0.5 rounded">4</span>
                    Run <code className="bg-white/10 px-2 py-0.5 rounded text-sm">npm run dev</code>
                  </li>
                </ol>
              </div>

              <button
                onClick={() => {
                  setStep('mode');
                  setSelectedType(null);
                  setGeneratedApp(null);
                }}
                className="text-gray-400 hover:text-white transition-colors flex items-center gap-2"
              >
                <ChevronRight className="w-5 h-5 rotate-180" />
                Generate Another App
              </button>
              </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
