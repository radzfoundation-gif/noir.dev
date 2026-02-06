import { useState } from 'react';
import { ChevronDown, Plus, Users, Settings } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Team } from '../../lib/teamService';

interface TeamSwitcherProps {
  currentTeamId?: string;
  teams: Team[];
  onTeamChange: (teamId: string) => void;
  onCreateTeam: () => void;
  onManageTeam?: (teamId: string) => void;
}

export const TeamSwitcher: React.FC<TeamSwitcherProps> = ({
  currentTeamId,
  teams,
  onTeamChange,
  onCreateTeam,
  onManageTeam,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  
  const currentTeam = teams.find(t => t.id === currentTeamId);
  
  const handleSelect = (teamId: string) => {
    onTeamChange(teamId);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-neutral-800 transition-colors w-full"
      >
        <div className="w-8 h-8 rounded-lg bg-lime-500/20 flex items-center justify-center flex-shrink-0">
          {currentTeam?.avatar_url ? (
            <img 
              src={currentTeam.avatar_url} 
              alt={currentTeam.name}
              className="w-full h-full rounded-lg object-cover"
            />
          ) : (
            <Users size={16} className="text-lime-400" />
          )}
        </div>
        
        <div className="flex-1 text-left min-w-0">
          <p className="text-sm font-medium text-white truncate">
            {currentTeam?.name || 'Personal'}
          </p>
          <p className="text-xs text-neutral-500">
            {currentTeam?.member_count || 1} member{currentTeam?.member_count !== 1 ? 's' : ''}
          </p>
        </div>
        
        <ChevronDown 
          size={16} 
          className={`text-neutral-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
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
              className="absolute top-full left-0 right-0 mt-2 bg-[#1a1a1a] border border-neutral-800 rounded-xl shadow-xl z-50 overflow-hidden"
            >
              <div className="p-2">
                <p className="px-3 py-2 text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Teams
                </p>
                
                {teams.map((team) => (
                  <button
                    key={team.id}
                    onClick={() => handleSelect(team.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                      team.id === currentTeamId
                        ? 'bg-lime-500/10 text-lime-400'
                        : 'hover:bg-neutral-800 text-neutral-300'
                    }`}
                  >
                    <div className="w-8 h-8 rounded-lg bg-neutral-800 flex items-center justify-center flex-shrink-0">
                      {team.avatar_url ? (
                        <img 
                          src={team.avatar_url} 
                          alt={team.name}
                          className="w-full h-full rounded-lg object-cover"
                        />
                      ) : (
                        <Users size={14} />
                      )}
                    </div>
                    
                    <div className="flex-1 text-left">
                      <p className="text-sm font-medium">{team.name}</p>
                      <p className="text-xs text-neutral-500">
                        {team.member_count} members
                      </p>
                    </div>
                    
                    {team.id === currentTeamId && (
                      <div className="w-2 h-2 rounded-full bg-lime-500" />
                    )}
                  </button>
                ))}
                
                <div className="border-t border-neutral-800 my-2" />
                
                <button
                  onClick={() => {
                    onCreateTeam();
                    setIsOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-neutral-800 text-neutral-300 transition-colors"
                >
                  <div className="w-8 h-8 rounded-lg bg-neutral-800 flex items-center justify-center">
                    <Plus size={14} />
                  </div>
                  <span className="text-sm">Create Team</span>
                </button>
                
                {currentTeam && onManageTeam && (
                  <button
                    onClick={() => {
                      onManageTeam(currentTeam.id);
                      setIsOpen(false);
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-neutral-800 text-neutral-300 transition-colors"
                  >
                    <div className="w-8 h-8 rounded-lg bg-neutral-800 flex items-center justify-center">
                      <Settings size={14} />
                    </div>
                    <span className="text-sm">Team Settings</span>
                  </button>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};
