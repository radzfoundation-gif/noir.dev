import { useState, useEffect } from 'react';
import { X, Smartphone, RotateCw, Eye, Grid } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { responsiveTestingService, type Breakpoint, type DeviceFrame, breakpoints, deviceFrames } from '../../lib/responsiveTestingService';

interface ResponsiveTestingPanelProps {
  isOpen: boolean;
  onClose: () => void;
  previewContent: string;
}

export const ResponsiveTestingPanel: React.FC<ResponsiveTestingPanelProps> = ({
  isOpen,
  onClose,
  previewContent,
}) => {
  const [selectedBreakpoint, setSelectedBreakpoint] = useState<Breakpoint>(breakpoints[5]); // Desktop
  const [selectedDevice, setSelectedDevice] = useState<DeviceFrame | null>(null);
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>('landscape');
  const [showGrid, setShowGrid] = useState(false);
  const [accessibilityResults, setAccessibilityResults] = useState<any[]>([]);
  const [performanceMetrics, setPerformanceMetrics] = useState<any>(null);

  useEffect(() => {
    if (isOpen && previewContent) {
      // Run accessibility checks
      const results = responsiveTestingService.checkAccessibility(previewContent);
      setAccessibilityResults(results);

      // Simulate performance metrics
      responsiveTestingService.measurePerformance(previewContent).then(metrics => {
        setPerformanceMetrics(metrics);
      });
    }
  }, [isOpen, previewContent]);

  const handleRotate = () => {
    setOrientation(prev => prev === 'portrait' ? 'landscape' : 'portrait');
  };

  const getDisplayDimensions = () => {
    const width = orientation === 'landscape' ? selectedBreakpoint.width : selectedBreakpoint.height;
    const height = orientation === 'landscape' ? selectedBreakpoint.height : selectedBreakpoint.width;
    return { width, height };
  };

  const dimensions = getDisplayDimensions();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
            onClick={onClose}
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-4 bg-[#0a0a0a] rounded-2xl border border-neutral-800 z-50 overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800 bg-[#171717]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-lime-500/10 flex items-center justify-center">
                  <Smartphone className="w-5 h-5 text-lime-400" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-white">Responsive Testing</h2>
                  <p className="text-sm text-neutral-400">
                    {dimensions.width} × {dimensions.height}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowGrid(!showGrid)}
                  className={`p-2 rounded-lg transition-colors ${showGrid ? 'bg-lime-500/20 text-lime-400' : 'text-neutral-400 hover:text-white hover:bg-neutral-800'}`}
                  title="Toggle Grid"
                >
                  <Grid size={18} />
                </button>
                <button
                  onClick={handleRotate}
                  className="p-2 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-lg transition-colors"
                  title="Rotate Device"
                >
                  <RotateCw size={18} />
                </button>
                <button
                  onClick={onClose}
                  className="p-2 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-lg transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Toolbar */}
            <div className="flex items-center gap-2 px-6 py-3 border-b border-neutral-800 bg-[#1a1a1a] overflow-x-auto">
              {breakpoints.map((bp) => (
                <button
                  key={bp.name}
                  onClick={() => {
                    setSelectedBreakpoint(bp);
                    setSelectedDevice(null);
                  }}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                    selectedBreakpoint.name === bp.name && !selectedDevice
                      ? 'bg-lime-500 text-black'
                      : 'bg-neutral-800 text-neutral-400 hover:bg-neutral-700 hover:text-white'
                  }`}
                >
                  <span>{bp.icon}</span>
                  <span>{bp.name}</span>
                </button>
              ))}

              <div className="w-px h-6 bg-neutral-800 mx-2" />

              {deviceFrames.map((device) => (
                <button
                  key={device.name}
                  onClick={() => {
                    setSelectedDevice(device);
                    setSelectedBreakpoint({
                      name: device.name,
                      width: device.width,
                      height: device.height,
                      icon: device.type === 'phone' ? '📱' : device.type === 'tablet' ? '📟' : '💻',
                    });
                  }}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                    selectedDevice?.name === device.name
                      ? 'bg-lime-500 text-black'
                      : 'bg-neutral-800 text-neutral-400 hover:bg-neutral-700 hover:text-white'
                  }`}
                >
                  {device.name}
                </button>
              ))}
            </div>

            {/* Main Content */}
            <div className="flex-1 flex overflow-hidden">
              {/* Preview Area */}
              <div className="flex-1 bg-[#0a0a0a] relative overflow-auto flex items-center justify-center p-8">
                {showGrid && (
                  <div 
                    className="absolute inset-0 pointer-events-none opacity-20"
                    style={{
                      backgroundImage: `
                        linear-gradient(to right, #333 1px, transparent 1px),
                        linear-gradient(to bottom, #333 1px, transparent 1px)
                      `,
                      backgroundSize: '50px 50px',
                    }}
                  />
                )}

                <motion.div
                  layout
                  className="relative bg-white rounded-lg overflow-hidden shadow-2xl"
                  style={{
                    width: dimensions.width,
                    height: dimensions.height,
                    maxWidth: '100%',
                    maxHeight: '100%',
                  }}
                >
                  {selectedDevice && (
                    <div
                      className="absolute -inset-3 rounded-[32px] pointer-events-none"
                      style={{ backgroundColor: selectedDevice.frameColor }}
                    >
                      {selectedDevice.notch && (
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-black rounded-b-2xl" />
                      )}
                    </div>
                  )}
                  
                  <iframe
                    srcDoc={previewContent}
                    className="w-full h-full border-0"
                    title="Responsive Preview"
                    sandbox="allow-scripts"
                  />
                </motion.div>
              </div>

              {/* Sidebar - Metrics */}
              <div className="w-80 border-l border-neutral-800 bg-[#171717] overflow-y-auto">
                {/* Accessibility Report */}
                <div className="p-4 border-b border-neutral-800">
                  <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                    <Eye size={16} className="text-lime-400" />
                    Accessibility
                  </h3>
                  
                  {accessibilityResults.length === 0 ? (
                    <div className="flex items-center gap-2 p-3 bg-green-500/10 rounded-lg border border-green-500/20">
                      <div className="w-2 h-2 rounded-full bg-green-500" />
                      <span className="text-sm text-green-400">All checks passed!</span>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {accessibilityResults.slice(0, 5).map((result, idx) => (
                        <div
                          key={idx}
                          className={`p-2 rounded-lg text-xs ${
                            result.severity === 'error'
                              ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                              : result.severity === 'warning'
                              ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'
                              : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                          }`}
                        >
                          {result.message}
                        </div>
                      ))}
                      {accessibilityResults.length > 5 && (
                        <p className="text-xs text-neutral-500 text-center">
                          +{accessibilityResults.length - 5} more issues
                        </p>
                      )}
                    </div>
                  )}
                </div>

                {/* Performance Metrics */}
                {performanceMetrics && (
                  <div className="p-4 border-b border-neutral-800">
                    <h3 className="text-sm font-semibold text-white mb-3">Performance</h3>
                    
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-neutral-400">Load Time</span>
                          <span className="text-white">{performanceMetrics.loadTime}s</span>
                        </div>
                        <div className="h-1.5 bg-neutral-800 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-lime-500 rounded-full"
                            style={{ width: `${Math.min(performanceMetrics.loadTime * 10, 100)}%` }}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="p-2 bg-neutral-900 rounded-lg">
                          <p className="text-xs text-neutral-500">Requests</p>
                          <p className="text-lg font-semibold text-white">{performanceMetrics.totalRequests}</p>
                        </div>
                        <div className="p-2 bg-neutral-900 rounded-lg">
                          <p className="text-xs text-neutral-500">Size</p>
                          <p className="text-lg font-semibold text-white">
                            {(performanceMetrics.totalSize / 1024).toFixed(0)}KB
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Device Info */}
                <div className="p-4">
                  <h3 className="text-sm font-semibold text-white mb-3">Device Info</h3>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-neutral-400">Viewport</span>
                      <span className="text-white">{dimensions.width} × {dimensions.height}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-400">Orientation</span>
                      <span className="text-white capitalize">{orientation}</span>
                    </div>
                    {selectedDevice && (
                      <div className="flex justify-between">
                        <span className="text-neutral-400">Device</span>
                        <span className="text-white">{selectedDevice.name}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
