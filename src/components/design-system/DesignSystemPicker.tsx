import { useState } from 'react';
import { X, Palette, ExternalLink, Check, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { designSystemService, type DesignSystemLibrary } from '../../lib/designSystemService';

interface DesignSystemPickerProps {
  isOpen: boolean;
  onClose: () => void;
  currentLibrary?: DesignSystemLibrary;
  onSelect: (library: DesignSystemLibrary) => void;
}

export const DesignSystemPicker: React.FC<DesignSystemPickerProps> = ({
  isOpen,
  onClose,
  currentLibrary = 'none',
  onSelect,
}) => {
  const [selectedLibrary, setSelectedLibrary] = useState<DesignSystemLibrary>(currentLibrary);
  const [showInstallGuide, setShowInstallGuide] = useState(false);

  const libraries = designSystemService.getAllLibraries();

  const handleSelect = (library: DesignSystemLibrary) => {
    setSelectedLibrary(library);
    onSelect(library);
  };

  const installCommand = designSystemService.getInstallCommand(selectedLibrary);
  const setupInstructions = designSystemService.getSetupInstructions(selectedLibrary);

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
                    <Palette className="w-5 h-5 text-lime-400" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-white">Design System</h2>
                    <p className="text-sm text-neutral-400">Choose a component library</p>
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
              <div className="flex-1 overflow-y-auto p-6">
                <div className="grid grid-cols-2 gap-3 mb-6">
                  {libraries.map((lib) => (
                    <button
                      key={lib.value}
                      onClick={() => handleSelect(lib.value)}
                      className={`flex items-start gap-3 p-4 rounded-xl border text-left transition-all ${
                        selectedLibrary === lib.value
                          ? 'border-lime-500 bg-lime-500/10'
                          : 'border-neutral-800 hover:border-neutral-700 hover:bg-neutral-800/50'
                      }`}
                    >
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 ${
                        selectedLibrary === lib.value
                          ? 'border-lime-500 bg-lime-500'
                          : 'border-neutral-600'
                      }`}>
                        {selectedLibrary === lib.value && <Check size={12} className="text-black" />}
                      </div>
                      
                      <div className="flex-1">
                        <h3 className={`font-medium ${
                          selectedLibrary === lib.value ? 'text-lime-400' : 'text-white'
                        }`}>
                          {lib.label}
                        </h3>
                        <p className="text-xs text-neutral-500 mt-1">{lib.description}</p>
                      </div>
                    </button>
                  ))}
                </div>

                {selectedLibrary !== 'none' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-semibold text-white">Installation</h3>
                      <button
                        onClick={() => setShowInstallGuide(!showInstallGuide)}
                        className="text-xs text-lime-400 hover:text-lime-300 flex items-center gap-1"
                      >
                        {showInstallGuide ? 'Hide' : 'Show'} Guide
                        <ChevronDown size={14} className={`transition-transform ${showInstallGuide ? 'rotate-180' : ''}`} />
                      </button>
                    </div>

                    {showInstallGuide && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="space-y-4"
                      >
                        {/* Install Command */}
                        {installCommand && (
                          <div className="p-4 bg-neutral-900 rounded-lg border border-neutral-800">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-xs text-neutral-400">Install Command</span>
                              <button
                                onClick={() => navigator.clipboard.writeText(installCommand)}
                                className="text-xs text-lime-400 hover:text-lime-300"
                              >
                                Copy
                              </button>
                            </div>
                            <code className="text-sm text-neutral-300 font-mono block overflow-x-auto">
                              {installCommand}
                            </code>
                          </div>
                        )}

                        {/* Setup Instructions */}
                        {setupInstructions && (
                          <div className="p-4 bg-neutral-900 rounded-lg border border-neutral-800">
                            <span className="text-xs text-neutral-400 block mb-2">Setup</span>
                            <pre className="text-sm text-neutral-300 font-mono overflow-x-auto whitespace-pre-wrap">
                              {setupInstructions}
                            </pre>
                          </div>
                        )}

                        {/* Component Preview */}
                        <div className="p-4 bg-neutral-900 rounded-lg border border-neutral-800">
                          <span className="text-xs text-neutral-400 block mb-2">Component Example</span>
                          <pre className="text-sm text-neutral-300 font-mono overflow-x-auto">
                            {designSystemService.getComponentExample(selectedLibrary, 'Button')}
                          </pre>
                        </div>

                        <a
                          href="#"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-sm text-lime-400 hover:text-lime-300"
                        >
                          <ExternalLink size={14} />
                          View Documentation
                        </a>
                      </motion.div>
                    )}
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="flex justify-end gap-3 px-6 py-4 border-t border-neutral-800 bg-neutral-900/30">
                <button
                  onClick={onClose}
                  className="px-4 py-2 text-sm font-medium text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    onSelect(selectedLibrary);
                    onClose();
                  }}
                  className="px-4 py-2 bg-lime-500 hover:bg-lime-400 text-black text-sm font-medium rounded-lg transition-colors"
                >
                  Apply Design System
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
