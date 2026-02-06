import { useState } from 'react';
import { Download, X, Check, FileCode, Package, Layers } from 'lucide-react';
import { exportService } from '../lib/exportService';
import type { ExportFormat, ExportOptions } from '../lib/exportService';
import { motion, AnimatePresence } from 'framer-motion';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  code: string;
  projectName?: string;
}

const frameworks: { value: ExportFormat; label: string; icon: string; description: string }[] = [
  { value: 'html', label: 'HTML', icon: '🌐', description: 'Standard HTML/CSS/JS' },
  { value: 'react', label: 'React', icon: '⚛️', description: 'React + TypeScript' },
  { value: 'vue', label: 'Vue', icon: '🟢', description: 'Vue 3 + TypeScript' },
  { value: 'angular', label: 'Angular', icon: '🅰️', description: 'Angular + TypeScript' },
  { value: 'svelte', label: 'Svelte', icon: '🔥', description: 'Svelte + TypeScript' },
];

export const ExportModal: React.FC<ExportModalProps> = ({ isOpen, onClose, code, projectName }) => {
  const [selectedFormat, setSelectedFormat] = useState<ExportFormat>('react');
  const [componentName, setComponentName] = useState(projectName?.replace(/\s+/g, '') || 'GeneratedComponent');
  const [useTailwind, setUseTailwind] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleExport = () => {
    setIsExporting(true);
    
    setTimeout(() => {
      const options: ExportOptions = {
        format: selectedFormat,
        componentName,
        useTailwind,
        includeTypescript: true,
        useCssModules: false,
      };

      const result = exportService.export(code, options);
      exportService.downloadFiles(result);

      setIsExporting(false);
      setShowSuccess(true);
      
      setTimeout(() => {
        setShowSuccess(false);
        onClose();
      }, 1500);
    }, 500);
  };

  const getFileExtension = (format: ExportFormat): string => {
    switch (format) {
      case 'react': return '.tsx';
      case 'vue': return '.vue';
      case 'angular': return '.ts';
      case 'svelte': return '.svelte';
      default: return '.html';
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            onClick={onClose}
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none"
          >
            <div className="bg-[#171717] border border-neutral-800 rounded-2xl shadow-2xl w-full max-w-lg mx-4 pointer-events-auto overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-lime-500/10 flex items-center justify-center">
                    <Download className="w-5 h-5 text-lime-400" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-white">Export Code</h2>
                    <p className="text-sm text-neutral-400">Choose your preferred framework</p>
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
              <div className="p-6 space-y-6">
                {/* Framework Selection */}
                <div className="space-y-3">
                  <label className="text-sm font-medium text-neutral-300">Select Framework</label>
                  <div className="grid grid-cols-2 gap-3">
                    {frameworks.map((fw) => (
                      <button
                        key={fw.value}
                        onClick={() => setSelectedFormat(fw.value)}
                        className={`flex items-center gap-3 p-4 rounded-xl border transition-all ${
                          selectedFormat === fw.value
                            ? 'border-lime-500 bg-lime-500/10'
                            : 'border-neutral-800 hover:border-neutral-700 hover:bg-neutral-800/50'
                        }`}
                      >
                        <span className="text-2xl">{fw.icon}</span>
                        <div className="text-left">
                          <div className={`font-medium ${
                            selectedFormat === fw.value ? 'text-lime-400' : 'text-white'
                          }`}>
                            {fw.label}
                          </div>
                          <div className="text-xs text-neutral-500">{fw.description}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Component Name */}
                <div className="space-y-3">
                  <label className="text-sm font-medium text-neutral-300">Component Name</label>
                  <div className="relative">
                    <FileCode className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                    <input
                      type="text"
                      value={componentName}
                      onChange={(e) => setComponentName(e.target.value)}
                      className="w-full bg-neutral-900 border border-neutral-800 rounded-lg pl-10 pr-4 py-2.5 text-white placeholder-neutral-500 focus:outline-none focus:border-lime-500 transition-colors"
                      placeholder="GeneratedComponent"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-neutral-500">
                      {getFileExtension(selectedFormat)}
                    </span>
                  </div>
                </div>

                {/* Options */}
                <div className="space-y-3">
                  <label className="text-sm font-medium text-neutral-300">Export Options</label>
                  <label className="flex items-center gap-3 p-3 rounded-lg border border-neutral-800 hover:border-neutral-700 cursor-pointer transition-colors">
                    <input
                      type="checkbox"
                      checked={useTailwind}
                      onChange={(e) => setUseTailwind(e.target.checked)}
                      className="w-4 h-4 rounded border-neutral-700 bg-neutral-800 text-lime-500 focus:ring-lime-500/20"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <Layers className="w-4 h-4 text-lime-400" />
                        <span className="text-sm text-white">Use Tailwind CSS</span>
                      </div>
                      <p className="text-xs text-neutral-500 mt-0.5">
                        Export with Tailwind classes instead of inline styles
                      </p>
                    </div>
                  </label>
                  
                  <div className="flex items-center gap-3 p-3 rounded-lg border border-neutral-800 bg-neutral-900/50">
                    <Package className="w-4 h-4 text-lime-400" />
                    <div className="flex-1">
                      <span className="text-sm text-white">TypeScript Support</span>
                      <p className="text-xs text-neutral-500 mt-0.5">
                        Includes type definitions and interfaces
                      </p>
                    </div>
                    <span className="text-xs text-lime-400 font-medium">Included</span>
                  </div>
                </div>

                {/* Preview */}
                <div className="bg-neutral-900 rounded-lg p-4 border border-neutral-800">
                  <label className="text-xs font-medium text-neutral-500 uppercase tracking-wider mb-2 block">
                    Output Preview
                  </label>
                  <code className="text-xs text-neutral-400 font-mono">
                    {componentName}{getFileExtension(selectedFormat)}
                    {useTailwind && selectedFormat !== 'html' && (
                      <>
                        <br />
                        <span className="text-neutral-600">└── {componentName}.css (if no Tailwind)</span>
                      </>
                    )}
                  </code>
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center gap-3 px-6 py-4 border-t border-neutral-800 bg-neutral-900/30">
                <button
                  onClick={onClose}
                  className="flex-1 px-4 py-2.5 text-sm font-medium text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleExport}
                  disabled={isExporting || !componentName}
                  className="flex-1 px-4 py-2.5 bg-lime-500 hover:bg-lime-400 text-black text-sm font-bold rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isExporting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                      Exporting...
                    </>
                  ) : showSuccess ? (
                    <>
                      <Check size={18} />
                      Exported!
                    </>
                  ) : (
                    <>
                      <Download size={18} />
                      Export Code
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
