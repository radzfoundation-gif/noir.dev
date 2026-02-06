import { useState, useEffect } from 'react';
import { Users, Clock, MousePointer2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { supabase } from '../../lib/supabase';
import { realtimeCollaborationService, type UserPresence } from '../../lib/realtimeCollaborationService';

interface ActiveUsersListProps {
  projectId?: string;
  teamId?: string;
  currentUserId: string;
}

export const ActiveUsersList: React.FC<ActiveUsersListProps> = ({
  projectId,
  teamId,
  currentUserId,
}) => {
  const [activeUsers, setActiveUsers] = useState<UserPresence[]>([]);

  useEffect(() => {
    // Fetch initial active users
    realtimeCollaborationService.getActiveUsers({ projectId, teamId }).then(users => {
      setActiveUsers(users.filter(u => u.user_id !== currentUserId));
    });

    // Subscribe to presence changes
    const unsubscribe = realtimeCollaborationService.onPresenceChange((presences) => {
      setActiveUsers(presences.filter(p => p.user_id !== currentUserId));
    });

    // Subscribe to real-time updates
    realtimeCollaborationService.subscribeToPresence(teamId, projectId);

    return () => {
      unsubscribe();
      realtimeCollaborationService.unsubscribeFromPresence(teamId, projectId);
    };
  }, [projectId, teamId, currentUserId]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online':
        return 'bg-green-500';
      case 'away':
        return 'bg-yellow-500';
      case 'busy':
        return 'bg-red-500';
      default:
        return 'bg-neutral-500';
    }
  };

  if (activeUsers.length === 0) {
    return null;
  }

  return (
    <div className="flex items-center gap-2">
      <div className="flex -space-x-2">
        {activeUsers.slice(0, 5).map((user, index) => (
          <motion.div
            key={user.id}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            className="relative"
            style={{ zIndex: activeUsers.length - index }}
            title={`${user.user?.email || 'Unknown'} - ${user.status}`}
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-lime-500/30 to-lime-600/10 border-2 border-[#171717] flex items-center justify-center">
              <span className="text-xs font-medium text-lime-400">
                {user.user?.email?.charAt(0).toUpperCase() || '?'}
              </span>
            </div>
            <div className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-[#171717] ${getStatusColor(user.status)}`} />
          </motion.div>
        ))}
        {activeUsers.length > 5 && (
          <div className="w-8 h-8 rounded-full bg-neutral-800 border-2 border-[#171717] flex items-center justify-center">
            <span className="text-xs text-neutral-400">+{activeUsers.length - 5}</span>
          </div>
        )}
      </div>
      
      <span className="text-xs text-neutral-500">
        {activeUsers.length} active
      </span>
    </div>
  );
};

interface UserPresenceIndicatorProps {
  userId: string;
  showName?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const UserPresenceIndicator: React.FC<UserPresenceIndicatorProps> = ({
  userId,
  showName = false,
  size = 'md',
}) => {
  const [presence, setPresence] = useState<UserPresence | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPresence = async () => {
      try {
        setLoading(true);
        
        // Fetch user profile
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('id, full_name, email, avatar_url')
          .eq('id', userId)
          .single();
        
        if (profileError) throw profileError;
        
        // Fetch presence status
        const { data: presenceData, error: presenceError } = await supabase
          .from('user_presence')
          .select('*')
          .eq('user_id', userId)
          .single();
        
        if (presenceError && presenceError.code !== 'PGRST116') {
          throw presenceError;
        }
        
        setPresence({
          id: userId,
          user_id: userId,
          user: profile ? {
            email: profile.email,
            user_metadata: {
              full_name: profile.full_name,
              avatar_url: profile.avatar_url,
            }
          } : undefined,
          status: presenceData?.status || 'offline',
          last_seen_at: presenceData?.last_seen_at || new Date().toISOString(),
          project_id: presenceData?.project_id,
          team_id: presenceData?.team_id,
        });
      } catch (error) {
        console.error('Failed to fetch presence:', error);
      } finally {
        setLoading(false);
      }
    };
    
    if (userId) {
      fetchPresence();
    }
  }, [userId]);

  const sizeClasses = {
    sm: 'w-6 h-6 text-[10px]',
    md: 'w-8 h-8 text-xs',
    lg: 'w-10 h-10 text-sm',
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'online':
        return 'bg-green-500';
      case 'away':
        return 'bg-yellow-500';
      case 'busy':
        return 'bg-red-500';
      default:
        return 'bg-neutral-500';
    }
  };

  if (loading) {
    return (
      <div className={`${sizeClasses[size]} rounded-full bg-neutral-800 animate-pulse`} />
    );
  }

  return (
    <div className="flex items-center gap-2">
      <div className={`relative ${sizeClasses[size]} rounded-full bg-gradient-to-br from-lime-500/30 to-lime-600/10 flex items-center justify-center`}>
        <span className="font-medium text-lime-400">
          {presence?.user?.email?.charAt(0).toUpperCase() || '?'}
        </span>
        <div className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-[#171717] ${getStatusColor(presence?.status)}`} />
      </div>
      
      {showName && (
        <span className="text-sm text-neutral-300">
          {presence?.user?.user_metadata?.full_name || presence?.user?.email || 'Unknown'}
        </span>
      )}
    </div>
  );
};

interface ActivityFeedProps {
  projectId?: string;
  teamId?: string;
  limit?: number;
}

export const ActivityFeed: React.FC<ActivityFeedProps> = ({
  projectId,
  teamId,
  limit = 10,
}) => {
  const [activities, setActivities] = useState<any[]>([]);

  useEffect(() => {
    // Fetch recent activities
    const fetchActivities = async () => {
      try {
        const data = await realtimeCollaborationService.getRecentEvents(projectId || '', limit);
        setActivities(data);
      } catch (error) {
        console.error('Failed to fetch activities:', error);
      }
    };

    fetchActivities();
  }, [projectId, teamId, limit]);

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'edit':
        return <Clock size={14} className="text-blue-400" />;
      case 'comment':
        return <Users size={14} className="text-green-400" />;
      case 'cursor_move':
        return <MousePointer2 size={14} className="text-yellow-400" />;
      default:
        return <Clock size={14} className="text-neutral-400" />;
    }
  };

  return (
    <div className="w-64 bg-[#171717] border-l border-neutral-800 p-4">
      <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
        <Clock size={16} className="text-lime-400" />
        Activity Feed
      </h3>

      <div className="space-y-3">
        {activities.length === 0 ? (
          <p className="text-sm text-neutral-500 text-center py-4">No recent activity</p>
        ) : (
          activities.map((activity, index) => (
            <motion.div
              key={activity.id || index}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="flex items-start gap-3 p-2 rounded-lg hover:bg-neutral-800/50 transition-colors"
            >
              <div className="mt-0.5">
                {getActivityIcon(activity.type)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-neutral-300">
                  <span className="font-medium text-white">
                    {activity.user?.email?.split('@')[0] || 'Unknown'}
                  </span>{' '}
                  {activity.action}
                </p>
                <p className="text-[10px] text-neutral-500 mt-0.5">
                  {formatTimeAgo(activity.timestamp || activity.created_at)}
                </p>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};

function formatTimeAgo(timestamp: string): string {
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);

  if (diffSecs < 60) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}
