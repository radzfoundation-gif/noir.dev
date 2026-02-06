import { useState } from 'react';
import { X, Smartphone, Tablet, Code, Download, Check, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { mobileExportService, type MobilePlatform, type MobileExportConfig } from '../../lib/mobileExportService';

interface MobileExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  htmlContent: string;
  projectName: string;
}

const platforms: { value: MobilePlatform; label: string; icon: string; description: string }[] = [
  { value: 'react-native', label: 'React Native', icon: '⚛️', description: 'Build native apps with React' },
  { value: 'flutter', label: 'Flutter', icon: '🦋', description: 'Google\'s UI toolkit' },
  { value: 'ios', label: 'iOS Native', icon: '🍎', description: 'SwiftUI for iOS' },
  { value: 'android', label: 'Android Native', icon: '🤖', description: 'Jetpack Compose' },
];

export const MobileExportModal: React.FC<MobileExportModalProps> = ({
  isOpen,
  onClose,
  htmlContent,
  projectName,
}) => {
  const [selectedPlatform, setSelectedPlatform] = useState<MobilePlatform>('react-native');
  const [selectedFramework, setSelectedFramework] = useState<'react-native-cli' | 'expo'>('expo');
  const [includeNavigation, setIncludeNavigation] = useState(true);
  const [includeStateManagement, setIncludeStateManagement] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  const [exportStatus, setExportStatus] = useState<'idle' | 'generating' | 'completed' | 'error'>('idle');
  const [buildInstructions, setBuildInstructions] = useState<string[]>([]);

  const handleExport = async () => {
    setIsExporting(true);
    setExportStatus('generating');

    const config: MobileExportConfig = {
      platform: selectedPlatform,
      framework: selectedFramework as any,
      includeNavigation,
      includeStateManagement,
      apiIntegration: true,
      authentication: true,
    };

    try {
      const result = await mobileExportService.exportToMobile(htmlContent, config, projectName);
      setBuildInstructions(result.instructions);
      setExportStatus('completed');
    } catch (error) {
      console.error('Mobile export failed:', error);
      setExportStatus('error');
    } finally {
      setIsExporting(false);
    }
  };

  const getEstimatedSize = () => mobileExportService.estimateBuildSize(selectedPlatform);

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
            <div className="bg-[#171717] border border-neutral-800 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] pointer-events-auto overflow-hidden flex flex-col">
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-lime-500/10 flex items-center justify-center">
                    <Smartphone className="w-5 h-5 text-lime-400" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-white">Export to Mobile</h2>
                    <p className="text-sm text-neutral-400">Convert your design to a mobile app</p>
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
                {exportStatus === 'completed' ? (
                  <div className="space-y-6">
                    <div className="text-center">
                      <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4">
                        <Check size={32} className="text-green-400" />
                      </div>
                      <h3 className="text-xl font-semibold text-white mb-2">Export Complete!</h3>
                      <p className="text-neutral-400">Your mobile app project is ready</p>
                    </div>

                    <div className="bg-neutral-900 rounded-lg p-4 border border-neutral-800">
                      <h4 className="text-sm font-medium text-white mb-3">Build Instructions</h4>
                      <div className="space-y-2">
                        {buildInstructions.map((step, index) => (
                          <div key={index} className="flex items-start gap-3">
                            <span className="text-lime-400 text-sm font-medium">{index + 1}.</span>
                            <code className="text-sm text-neutral-300 font-mono">{step}</code>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <button
                        onClick={() => setExportStatus('idle')}
                        className="flex-1 px-4 py-2.5 text-sm font-medium text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-lg transition-colors"
                      >
                        Back to Config
                      </button>
                      <button className="flex-1 px-4 py-2.5 bg-lime-500 hover:bg-lime-400 text-black text-sm font-bold rounded-lg transition-colors flex items-center justify-center gap-2">
                        <Download size={16} />
                        Download {projectName}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* Platform Selection */}
                    <div>
                      <label className="block text-sm font-medium text-neutral-300 mb-3">
                        Select Platform
                      </label>
                      <div className="grid grid-cols-2 gap-3">
                        {platforms.map((platform) => (
                          <button
                            key={platform.value}
                            onClick={() => setSelectedPlatform(platform.value)}
                            className={`flex items-start gap-3 p-4 rounded-xl border text-left transition-all ${
                              selectedPlatform === platform.value
                                ? 'border-lime-500 bg-lime-500/10'
                                : 'border-neutral-800 hover:border-neutral-700'
                            }`}
                          >
                            <span className="text-2xl">{platform.icon}</span>
                            <div>
                              <div className={`font-medium ${
                                selectedPlatform === platform.value ? 'text-lime-400' : 'text-white'
                              }`}>
                                {platform.label}
                              </div>
                              <div className="text-xs text-neutral-500 mt-0.5">
                                {platform.description}
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Framework Options */}
                    {selectedPlatform === 'react-native' && (
                      <div>
                        <label className="block text-sm font-medium text-neutral-300 mb-3">
                          Framework Variant
                        </label>
                        <div className="flex gap-3">
                          <button
                            onClick={() => setSelectedFramework('expo')}
                            className={`flex-1 px-4 py-3 rounded-lg border text-sm font-medium transition-colors ${
                              selectedFramework === 'expo'
                                ? 'border-lime-500 bg-lime-500/10 text-lime-400'
                                : 'border-neutral-800 text-neutral-400 hover:border-neutral-700'
                            }`}
                          >
                            Expo (Recommended)
                          </button>
                          <button
                            onClick={() => setSelectedFramework('react-native-cli')}
                            className={`flex-1 px-4 py-3 rounded-lg border text-sm font-medium transition-colors ${
                              selectedFramework === 'react-native-cli'
                                ? 'border-lime-500 bg-lime-500/10 text-lime-400'
                                : 'border-neutral-800 text-neutral-400 hover:border-neutral-700'
                            }`}
                          >
                            React Native CLI
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Features */}
                    <div>
                      <label className="block text-sm font-medium text-neutral-300 mb-3">
                        Include Features
                      </label>
                      <div className="space-y-2">
                        <label className="flex items-center gap-3 p-3 rounded-lg border border-neutral-800 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={includeNavigation}
                            onChange={(e) => setIncludeNavigation(e.target.checked)}
                            className="w-4 h-4 rounded border-neutral-700 bg-neutral-800 text-lime-500"
                          />
                          <div className="flex-1">
                            <div className="text-sm text-white">Navigation Setup</div>
                            <div className="text-xs text-neutral-500">React Navigation / Flutter Navigator</div>
                          </div>
                          <ChevronRight size={16} className="text-neutral-600" />
                        </label>
                        <label className="flex items-center gap-3 p-3 rounded-lg border border-neutral-800 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={includeStateManagement}
                            onChange={(e) => setIncludeStateManagement(e.target.checked)}
                            className="w-4 h-4 rounded border-neutral-700 bg-neutral-800 text-lime-500"
                          />
                          <div className="flex-1">
                            <div className="text-sm text-white">State Management</div>
                            <div className="text-xs text-neutral-500">Redux / Provider / BLoC</div>
                          </div>
                          <ChevronRight size={16} className="text-neutral-600" />
                        </label>
                      </div>
                    </div>

                    {/* Estimated Size */}
                    <div className="p-4 bg-neutral-900 rounded-lg border border-neutral-800">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Tablet size={16} className="text-neutral-500" />
                          <span className="text-sm text-neutral-400">Estimated App Size</span>
                        </div>
                        <span className="text-sm font-medium text-white">{getEstimatedSize()}</span>
                      </div>
                    </div>

                    {exportStatus === 'error' && (
                      <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                        <p className="text-sm text-red-400">Failed to generate mobile app. Please try again.</p>
                      </div>
                    )}

                    {/* Export Button */}
                    <button
                      onClick={handleExport}
                      disabled={isExporting}
                      className="w-full px-4 py-3 bg-lime-500 hover:bg-lime-400 disabled:opacity-50 text-black text-sm font-bold rounded-lg transition-colors flex items-center justify-center gap-2"
                    >
                      {isExporting ? (
                        <>
                          <div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                          Generating Mobile App...
                        </>
                      ) : (
                        <>
                          <Code size={18} />
                          Generate Mobile App
                        </>
                      )}
                    </button>
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
