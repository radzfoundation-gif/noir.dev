import { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface DropdownItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  shortcut?: string;
}

interface ToolbarDropdownProps {
  label: string;
  icon?: React.ReactNode;
  items: DropdownItem[];
  variant?: 'default' | 'primary' | 'secondary';
}

export const ToolbarDropdown: React.FC<ToolbarDropdownProps> = ({
  label,
  icon,
  items,
  variant = 'default',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const baseClasses = 'flex items-center gap-2 px-3 py-1.5 text-xs font-bold rounded-xl transition-all uppercase tracking-wider relative overflow-hidden';
  
  const variantClasses = {
    default: 'bg-neutral-900/80 backdrop-blur-sm border border-neutral-800 hover:border-neutral-600 text-neutral-300 hover:text-white hover:bg-neutral-800/90 hover:shadow-[0_0_20px_rgba(255,255,255,0.05)]',
    primary: 'bg-gradient-to-r from-lime-400 to-lime-300 text-black hover:from-lime-300 hover:to-lime-200 border border-lime-400/50 shadow-[0_0_15px_rgba(163,230,53,0.3)] hover:shadow-[0_0_20px_rgba(163,230,53,0.5)]',
    secondary: 'bg-neutral-900/80 backdrop-blur-sm border border-lime-500/30 text-lime-400 hover:bg-lime-500/10 hover:border-lime-500/50 hover:shadow-[0_0_15px_rgba(163,230,53,0.15)]',
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`${baseClasses} ${variantClasses[variant]}`}
      >
        {icon && <span className="flex-shrink-0">{icon}</span>}
        <span>{label}</span>  
        <ChevronDown 
          size={14} 
          className={`transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />
            
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
              className="absolute top-full right-0 mt-2 w-64 bg-neutral-900/95 backdrop-blur-xl border border-neutral-700/50 rounded-2xl shadow-[0_25px_50px_-12px_rgba(0,0,0,0.8)] z-50 overflow-hidden"
            >
              {/* Gradient Background */}
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-20 -right-20 w-[200px] h-[200px] bg-purple-500/10 rounded-full blur-[60px]" />
                <div className="absolute -bottom-20 -left-20 w-[180px] h-[180px] bg-blue-500/10 rounded-full blur-[50px]" />
                <div className="absolute inset-0 bg-gradient-to-b from-neutral-800/20 to-transparent" />
              </div>

              <div className="relative z-10 py-2">
                {items.map((item, index) => (
                  item.label === '' && item.disabled ? (
                    <div key={item.id} className="my-2 mx-4 border-t border-neutral-800/50" />
                  ) : (
                    <motion.button
                      key={item.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.03 }}
                      onClick={() => {
                        item.onClick();
                        setIsOpen(false);
                      }}
                      disabled={item.disabled}
                      className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-all mx-2 w-[calc(100%-16px)] rounded-xl ${
                        item.disabled
                          ? 'opacity-50 cursor-not-allowed text-neutral-500'
                          : 'hover:bg-gradient-to-r hover:from-neutral-800/80 hover:to-neutral-800/40 text-neutral-300 hover:text-white group'
                      }`}
                    >
                      {item.icon && (
                        <span className="flex-shrink-0 w-5 h-5 flex items-center justify-center rounded-lg bg-neutral-800/50 group-hover:bg-neutral-700/50 transition-colors">
                          {item.icon}
                        </span>
                      )}
                      <span className="flex-1 text-sm font-medium">{item.label}</span>
                      {item.shortcut && (
                        <span className="text-[10px] text-neutral-600 bg-neutral-800/50 px-2 py-0.5 rounded-md">
                          {item.shortcut}
                        </span>
                      )}
                    </motion.button>
                  )
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};
