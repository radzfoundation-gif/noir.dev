import { useState, useEffect } from 'react';
import { History, X, RotateCcw, Trash2, ChevronLeft, Clock, FileCode } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { versionHistoryService } from '../lib/versionHistoryService';
import type { Version } from '../lib/versionHistoryService';
// import { useAuth } from '../context/AuthContext'; // Unused for now

interface VersionHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
  currentCode: string;
  onRevert: (code: string) => void;
}

export const VersionHistoryModal: React.FC<VersionHistoryModalProps> = ({
  isOpen,
  onClose,
  projectId,
  currentCode,
  onRevert,
}) => {
  const [versions, setVersions] = useState<Version[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedVersion, setSelectedVersion] = useState<Version | null>(null);
  const [isReverting, setIsReverting] = useState(false);

  useEffect(() => {
    if (isOpen && projectId) {
      loadVersions();
    }
  }, [isOpen, projectId]);

  const loadVersions = async () => {
    try {
      setLoading(true);
      const data = await versionHistoryService.getVersions(projectId);
      setVersions(data);
    } catch (error) {
      console.error('Failed to load versions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRevert = async (version: Version) => {
    if (!confirm(`Revert to version ${version.version_number}?`)) return;

    try {
      setIsReverting(true);
      await versionHistoryService.revertToVersion(version.id);
      onRevert(version.code);
      onClose();
    } catch (error) {
      console.error('Failed to revert:', error);
      alert('Failed to revert version');
    } finally {
      setIsReverting(false);
    }
  };

  const handleDelete = async (version: Version, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm(`Delete version ${version.version_number}?`)) return;

    try {
      await versionHistoryService.deleteVersion(version.id);
      setVersions(versions.filter(v => v.id !== version.id));
    } catch (error) {
      console.error('Failed to delete version:', error);
    }
  };

  const formatDate = (dateString: string) => {
    return versionHistoryService.formatVersionDate(dateString);
  };

  const getCodeSize = (code: string) => {
    return versionHistoryService.getCodeSize(code);
  };

  const handleSaveVersion = async () => {
    try {
      await versionHistoryService.createVersion(projectId, currentCode, 'Manual save');
      await loadVersions();
    } catch (error) {
      console.error('Failed to save version:', error);
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
            className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none p-4"
          >
            <div className="bg-[#171717] border border-neutral-800 rounded-2xl shadow-2xl w-full max-w-3xl max-h-[80vh] pointer-events-auto overflow-hidden flex flex-col">
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-lime-500/10 flex items-center justify-center">
                    <History className="w-5 h-5 text-lime-400" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-white">Version History</h2>
                    <p className="text-sm text-neutral-400">
                      {versions.length} saved version{versions.length !== 1 ? 's' : ''}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleSaveVersion}
                    className="px-3 py-1.5 text-xs font-medium text-lime-400 hover:bg-lime-500/10 rounded-lg transition-colors"
                  >
                    Save Current
                  </button>
                  <button
                    onClick={onClose}
                    className="p-2 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-lg transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-hidden flex">
                {/* Version List */}
                <div className="w-80 border-r border-neutral-800 overflow-y-auto">
                  {loading ? (
                    <div className="flex items-center justify-center h-32">
                      <div className="w-6 h-6 border-2 border-lime-500/20 border-t-lime-500 rounded-full animate-spin" />
                    </div>
                  ) : versions.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-64 text-neutral-500 p-6 text-center">
                      <Clock size={48} className="mb-4 opacity-30" />
                      <p className="text-sm">No versions yet</p>
                      <p className="text-xs mt-1">Save your first version to track changes</p>
                    </div>
                  ) : (
                    <div className="divide-y divide-neutral-800">
                      {versions.map((version, index) => (
                        <button
                          key={version.id}
                          onClick={() => setSelectedVersion(version)}
                          className={`w-full text-left p-4 hover:bg-neutral-800/50 transition-colors ${
                            selectedVersion?.id === version.id ? 'bg-lime-500/10 border-l-2 border-lime-500' : ''
                          }`}
                        >
                          <div className="flex items-start justify-between">
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-medium text-white">
                                  Version {version.version_number}
                                </span>
                                {index === 0 && (
                                  <span className="px-1.5 py-0.5 bg-lime-500/20 text-lime-400 text-[10px] rounded">
                                    Latest
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-neutral-500 mt-1">
                                {formatDate(version.created_at)}
                              </p>
                            </div>
                            <div className="flex items-center gap-1">
                              <span className="text-xs text-neutral-600">
                                {getCodeSize(version.code)}
                              </span>
                            </div>
                          </div>
                          {version.note && (
                            <p className="text-xs text-neutral-400 mt-2 line-clamp-1">
                              {version.note}
                            </p>
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Version Detail */}
                <div className="flex-1 bg-neutral-900/30 overflow-y-auto">
                  {selectedVersion ? (
                    <div className="p-6 space-y-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-lg font-medium text-white">
                            Version {selectedVersion.version_number}
                          </h3>
                          <p className="text-sm text-neutral-400">
                            {formatDate(selectedVersion.created_at)}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleRevert(selectedVersion)}
                            disabled={isReverting}
                            className="flex items-center gap-2 px-3 py-1.5 bg-lime-500 hover:bg-lime-400 text-black text-sm font-medium rounded-lg transition-colors disabled:opacity-50"
                          >
                            <RotateCcw size={14} />
                            Revert
                          </button>
                          <button
                            onClick={(e) => handleDelete(selectedVersion, e)}
                            className="p-1.5 text-neutral-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>

                      {selectedVersion.note && (
                        <div className="bg-neutral-800/50 rounded-lg p-3">
                          <p className="text-sm text-neutral-300">{selectedVersion.note}</p>
                        </div>
                      )}

                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm text-neutral-400">
                          <FileCode size={16} />
                          <span>Code Preview</span>
                          <span className="text-xs text-neutral-600">
                            ({getCodeSize(selectedVersion.code)})
                          </span>
                        </div>
                        <div className="bg-[#1e1e1e] border border-neutral-800 rounded-lg overflow-hidden">
                          <div className="bg-[#252526] px-3 py-2 border-b border-neutral-800 flex items-center gap-2">
                            <div className="flex gap-1.5">
                              <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
                              <div className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
                              <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
                            </div>
                            <span className="ml-2 text-xs text-neutral-500">index.html</span>
                          </div>
                          <div className="p-4 max-h-64 overflow-y-auto">
                            <pre className="text-xs text-neutral-400 font-mono whitespace-pre-wrap">
                              {selectedVersion.code.slice(0, 2000)}
                              {selectedVersion.code.length > 2000 && (
                                <span className="text-neutral-600">... (truncated)</span>
                              )}
                            </pre>
                          </div>
                        </div>
                      </div>

                      {selectedVersion.prompt && (
                        <div className="space-y-2">
                          <span className="text-sm text-neutral-400">Generated from prompt:</span>
                          <p className="text-sm text-neutral-300 bg-neutral-800/50 rounded-lg p-3">
                            {selectedVersion.prompt}
                          </p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full text-neutral-500 p-6 text-center">
                      <ChevronLeft size={48} className="mb-4 opacity-30" />
                      <p className="text-sm">Select a version to view details</p>
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
