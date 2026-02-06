import { useState } from 'react';
import { Search, X, Layout, Grid3X3, ChevronRight, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  componentTemplates, 
  componentCategories, 
  getTemplatesByCategory 
} from '../lib/templateService';
import type { ComponentTemplate } from '../lib/templateService';

interface ComponentGalleryProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTemplate: (template: ComponentTemplate) => void;
}

export const ComponentGallery: React.FC<ComponentGalleryProps> = ({ 
  isOpen, 
  onClose, 
  onSelectTemplate 
}) => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTemplates = getTemplatesByCategory(selectedCategory).filter(template =>
    template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    template.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelect = (template: ComponentTemplate) => {
    onSelectTemplate(template);
    onClose();
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
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
            onClick={onClose}
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none p-4"
          >
            <div className="bg-[#171717] border border-neutral-800 rounded-2xl shadow-2xl w-full max-w-5xl max-h-[85vh] pointer-events-auto overflow-hidden flex flex-col">
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800 bg-[#171717]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-lime-500/20 to-lime-600/10 flex items-center justify-center">
                    <Grid3X3 className="w-5 h-5 text-lime-400" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-white">Component Gallery</h2>
                    <p className="text-sm text-neutral-400">{componentTemplates.length}+ pre-designed templates</p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-lg transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Search & Filter Bar */}
              <div className="px-6 py-4 border-b border-neutral-800 bg-[#1a1a1a]">
                <div className="flex flex-col sm:flex-row gap-4">
                  {/* Search */}
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search templates..."
                      className="w-full bg-neutral-900 border border-neutral-800 rounded-lg pl-10 pr-4 py-2.5 text-white placeholder-neutral-500 focus:outline-none focus:border-lime-500 transition-colors"
                    />
                  </div>
                </div>

                {/* Category Pills */}
                <div className="flex gap-2 mt-4 overflow-x-auto no-scrollbar pb-1">
                  {componentCategories.map((category) => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                        selectedCategory === category
                          ? 'bg-lime-500 text-black'
                          : 'bg-neutral-800 text-neutral-400 hover:bg-neutral-700 hover:text-white'
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>

              {/* Templates Grid */}
              <div className="flex-1 overflow-y-auto p-6">
                {filteredTemplates.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-64 text-neutral-500">
                    <Layout size={48} className="mb-4 opacity-30" />
                    <p className="text-lg font-medium">No templates found</p>
                    <p className="text-sm">Try adjusting your search or category</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredTemplates.map((template, index) => (
                      <motion.div
                        key={template.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="group bg-neutral-900 border border-neutral-800 rounded-xl p-4 hover:border-lime-500/50 hover:bg-neutral-800/50 transition-all cursor-pointer"
                        onClick={() => handleSelect(template)}
                      >
                        {/* Preview Placeholder */}
                        <div className="aspect-video bg-gradient-to-br from-neutral-800 to-neutral-900 rounded-lg mb-3 flex items-center justify-center overflow-hidden relative">
                          <div className="absolute inset-0 bg-gradient-to-br from-lime-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                          <span className="text-4xl opacity-30 group-hover:opacity-50 transition-opacity">
                            {template.category === 'Landing Page' && '🚀'}
                            {template.category === 'Dashboard' && '📊'}
                            {template.category === 'E-commerce' && '🛒'}
                            {template.category === 'Authentication' && '🔐'}
                            {template.category === 'Navigation' && '🧭'}
                            {template.category === 'Cards' && '🃏'}
                            {template.category === 'Forms' && '📝'}
                            {template.category === 'Hero' && '⭐'}
                            {template.category === 'Pricing' && '💰'}
                            {template.category === 'Footer' && '🦶'}
                          </span>
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <div className="flex items-center gap-2 text-lime-400 font-medium text-sm">
                              <Sparkles size={16} />
                              Use Template
                            </div>
                          </div>
                        </div>

                        {/* Info */}
                        <div className="space-y-1">
                          <div className="flex items-start justify-between">
                            <h3 className="font-medium text-white group-hover:text-lime-400 transition-colors">
                              {template.name}
                            </h3>
                            <ChevronRight size={16} className="text-neutral-600 group-hover:text-lime-400 transition-colors mt-0.5" />
                          </div>
                          <p className="text-xs text-neutral-500 line-clamp-2">
                            {template.description}
                          </p>
                          <span className="inline-block mt-2 px-2 py-0.5 bg-neutral-800 rounded text-[10px] text-neutral-400">
                            {template.category}
                          </span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="px-6 py-4 border-t border-neutral-800 bg-neutral-900/30 flex items-center justify-between">
                <p className="text-sm text-neutral-500">
                  Showing {filteredTemplates.length} of {componentTemplates.length} templates
                </p>
                <button
                  onClick={onClose}
                  className="px-4 py-2 text-sm font-medium text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-lg transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
