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

  const baseClasses = 'flex items-center gap-2 px-3 py-1.5 text-xs font-bold rounded-lg transition-all uppercase tracking-wider';
  
  const variantClasses = {
    default: 'text-neutral-300 border border-neutral-700 hover:bg-white/10 hover:text-white',
    primary: 'bg-primary text-noir-black hover:bg-opacity-90 border border-primary',
    secondary: 'text-primary border border-primary hover:bg-primary/10',
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
              transition={{ duration: 0.15 }}
              className="absolute top-full right-0 mt-2 w-56 bg-[#1a1a1a] border border-neutral-800 rounded-xl shadow-2xl z-50 overflow-hidden"
            >
              <div className="py-1">
                {items.map((item) => (
                  item.label === '' && item.disabled ? (
                    <div key={item.id} className="my-1 border-t border-neutral-800" />
                  ) : (
                    <button
                      key={item.id}
                      onClick={() => {
                        item.onClick();
                        setIsOpen(false);
                      }}
                      disabled={item.disabled}
                      className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors ${
                        item.disabled
                          ? 'opacity-50 cursor-not-allowed text-neutral-500'
                          : 'hover:bg-neutral-800 text-neutral-300 hover:text-white'
                      }`}
                    >
                      {item.icon && (
                        <span className="flex-shrink-0 w-5 flex justify-center">
                          {item.icon}
                        </span>
                      )}
                      <span className="flex-1 text-sm font-medium">{item.label}</span>
                      {item.shortcut && (
                        <span className="text-xs text-neutral-600">{item.shortcut}</span>
                      )}
                    </button>
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
