import { useState } from 'react';
import { X, Server, Database, Code, Download, Copy, Check, Terminal } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { backendGeneratorService, type BackendFramework, type DatabaseType, type BackendProject } from '../../lib/backendGeneratorService';

interface BackendGeneratorPanelProps {
  isOpen: boolean;
  onClose: () => void;
  projectName: string;
}

const frameworks: { value: BackendFramework; label: string; icon: string }[] = [
  { value: 'express', label: 'Express.js', icon: '⚡' },
  { value: 'fastify', label: 'Fastify', icon: '🚀' },
  { value: 'nestjs', label: 'NestJS', icon: '🦁' },
  { value: 'django', label: 'Django', icon: '🐍' },
  { value: 'laravel', label: 'Laravel', icon: '🎨' },
];

const databases: { value: DatabaseType; label: string; icon: string }[] = [
  { value: 'postgresql', label: 'PostgreSQL', icon: '🐘' },
  { value: 'mysql', label: 'MySQL', icon: '🐬' },
  { value: 'mongodb', label: 'MongoDB', icon: '🍃' },
  { value: 'supabase', label: 'Supabase', icon: '⚡' },
];

export const BackendGeneratorPanel: React.FC<BackendGeneratorPanelProps> = ({
  isOpen,
  onClose,
  projectName,
}) => {
  const [selectedFramework, setSelectedFramework] = useState<BackendFramework>('express');
  const [selectedDatabase, setSelectedDatabase] = useState<DatabaseType>('postgresql');
  const [includeAuth, setIncludeAuth] = useState(true);
  const [includeCRUD, setIncludeCRUD] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedCode, setGeneratedCode] = useState<Record<string, string> | null>(null);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [copiedFile, setCopiedFile] = useState<string | null>(null);

  const handleGenerate = async () => {
    setIsGenerating(true);

    try {
      // Analyze the current frontend project to suggest backend schema
      const suggestedTables = await backendGeneratorService.analyzeFrontendForSchema(projectName);
      
      const project: BackendProject = {
        name: projectName,
        framework: selectedFramework,
        database: selectedDatabase,
        tables: suggestedTables.length > 0 ? suggestedTables : [
          {
            id: '1',
            name: 'users',
            columns: [
              { name: 'id', type: 'uuid', primary: true },
              { name: 'email', type: 'string', unique: true, nullable: false },
              { name: 'password', type: 'string', nullable: false },
              { name: 'created_at', type: 'timestamp' },
            ],
          }
        ],
        endpoints: [],
        authentication: includeAuth,
        port: 3001,
      };

      const result = await backendGeneratorService.generateBackend(project);
      setGeneratedCode(result.files);
      setSelectedFile(Object.keys(result.files)[0]);
    } catch (error) {
      console.error('Backend generation failed:', error);
      alert('Failed to generate backend. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = (content: string, fileName: string) => {
    navigator.clipboard.writeText(content);
    setCopiedFile(fileName);
    setTimeout(() => setCopiedFile(null), 2000);
  };

  const downloadAll = () => {
    if (!generatedCode) return;

    // Create a zip-like structure (for now, just download main file)
    const content = Object.entries(generatedCode)
      .map(([filename, code]) => `// ${filename}\n${code}`)
      .join('\n\n');

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${projectName}-backend.zip`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
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
            <div className="bg-[#171717] border border-neutral-800 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[85vh] pointer-events-auto overflow-hidden flex flex-col">
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-lime-500/10 flex items-center justify-center">
                    <Server className="w-5 h-5 text-lime-400" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-white">Backend Generator</h2>
                    <p className="text-sm text-neutral-400">Generate full-stack backend code</p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-lg transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-hidden flex">
                {/* Configuration Panel */}
                <div className="w-80 border-r border-neutral-800 p-6 overflow-y-auto">
                  <div className="space-y-6">
                    {/* Framework Selection */}
                    <div>
                      <label className="block text-sm font-medium text-neutral-300 mb-3">
                        Backend Framework
                      </label>
                      <div className="space-y-2">
                        {frameworks.map((fw) => (
                          <button
                            key={fw.value}
                            onClick={() => setSelectedFramework(fw.value)}
                            className={`w-full flex items-center gap-3 p-3 rounded-lg border transition-all ${
                              selectedFramework === fw.value
                                ? 'border-lime-500 bg-lime-500/10 text-lime-400'
                                : 'border-neutral-800 hover:border-neutral-700 text-neutral-300'
                            }`}
                          >
                            <span className="text-xl">{fw.icon}</span>
                            <span className="font-medium">{fw.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Database Selection */}
                    <div>
                      <label className="block text-sm font-medium text-neutral-300 mb-3">
                        Database
                      </label>
                      <div className="space-y-2">
                        {databases.map((db) => (
                          <button
                            key={db.value}
                            onClick={() => setSelectedDatabase(db.value)}
                            className={`w-full flex items-center gap-3 p-3 rounded-lg border transition-all ${
                              selectedDatabase === db.value
                                ? 'border-lime-500 bg-lime-500/10 text-lime-400'
                                : 'border-neutral-800 hover:border-neutral-700 text-neutral-300'
                            }`}
                          >
                            <span className="text-xl">{db.icon}</span>
                            <span className="font-medium">{db.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Options */}
                    <div>
                      <label className="block text-sm font-medium text-neutral-300 mb-3">
                        Features
                      </label>
                      <div className="space-y-2">
                        <label className="flex items-center gap-3 p-3 rounded-lg border border-neutral-800 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={includeAuth}
                            onChange={(e) => setIncludeAuth(e.target.checked)}
                            className="w-4 h-4 rounded border-neutral-700 bg-neutral-800 text-lime-500"
                          />
                          <div>
                            <div className="text-sm text-white">Authentication</div>
                            <div className="text-xs text-neutral-500">JWT auth middleware</div>
                          </div>
                        </label>
                        <label className="flex items-center gap-3 p-3 rounded-lg border border-neutral-800 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={includeCRUD}
                            onChange={(e) => setIncludeCRUD(e.target.checked)}
                            className="w-4 h-4 rounded border-neutral-700 bg-neutral-800 text-lime-500"
                          />
                          <div>
                            <div className="text-sm text-white">CRUD Operations</div>
                            <div className="text-xs text-neutral-500">Auto-generated endpoints</div>
                          </div>
                        </label>
                      </div>
                    </div>

                    {/* Generate Button */}
                    <button
                      onClick={handleGenerate}
                      disabled={isGenerating}
                      className="w-full px-4 py-3 bg-lime-500 hover:bg-lime-400 disabled:opacity-50 text-black text-sm font-bold rounded-lg transition-colors flex items-center justify-center gap-2"
                    >
                      {isGenerating ? (
                        <>
                          <div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <Code size={18} />
                          Generate Backend
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Code Preview */}
                <div className="flex-1 flex flex-col bg-[#0f0f0f]">
                  {generatedCode ? (
                    <>
                      {/* File Tabs */}
                      <div className="flex items-center gap-1 px-4 py-2 border-b border-neutral-800 overflow-x-auto">
                        {Object.keys(generatedCode).map((filename) => (
                          <button
                            key={filename}
                            onClick={() => setSelectedFile(filename)}
                            className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-colors ${
                              selectedFile === filename
                                ? 'bg-lime-500/20 text-lime-400'
                                : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
                            }`}
                          >
                            <Terminal size={12} className="inline mr-1.5" />
                            {filename}
                          </button>
                        ))}
                        <div className="flex-1" />
                        <button
                          onClick={downloadAll}
                          className="p-1.5 text-neutral-400 hover:text-lime-400 transition-colors"
                          title="Download All"
                        >
                          <Download size={16} />
                        </button>
                      </div>

                      {/* Code Display */}
                      <div className="flex-1 overflow-auto p-4">
                        {selectedFile && (
                          <div className="relative">
                            <button
                              onClick={() => copyToClipboard(generatedCode[selectedFile], selectedFile)}
                              className="absolute top-2 right-2 p-2 text-neutral-500 hover:text-lime-400 transition-colors"
                            >
                              {copiedFile === selectedFile ? <Check size={16} /> : <Copy size={16} />}
                            </button>
                            <pre className="text-sm text-neutral-300 font-mono whitespace-pre-wrap">
                              {generatedCode[selectedFile]}
                            </pre>
                          </div>
                        )}
                      </div>
                    </>
                  ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-neutral-500">
                      <Database size={48} className="mb-4 opacity-30" />
                      <p className="text-sm">Configure your backend and click Generate</p>
                      <p className="text-xs mt-1 opacity-60">Full CRUD API with database models</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
