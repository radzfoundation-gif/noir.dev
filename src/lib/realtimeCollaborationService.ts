import { supabase } from './supabase';

export interface UserPresence {
  id: string;
  user_id: string;
  team_id?: string;
  project_id?: string;
  status: 'online' | 'away' | 'busy' | 'offline';
  last_seen_at: string;
  cursor_x?: number;
  cursor_y?: number;
  current_view?: string;
  user?: {
    email: string;
    user_metadata: {
      full_name?: string;
      avatar_url?: string;
    };
  };
}

export interface CollaborationEvent {
  type: 'cursor_move' | 'selection' | 'edit' | 'comment' | 'presence';
  user_id: string;
  project_id?: string;
  timestamp: number;
  data: any;
}

export interface ConflictResolution {
  original: string;
  incoming: string;
  merged: string;
  conflicts: Array<{
    line: number;
    original: string;
    incoming: string;
  }>;
}

class RealtimeCollaborationService {
  private channels: Map<string, any> = new Map();
  private presenceCallbacks: Set<(presences: UserPresence[]) => void> = new Set();
  private eventCallbacks: Set<(event: CollaborationEvent) => void> = new Set();
  private heartbeatInterval: ReturnType<typeof setInterval> | null = null;

  // Initialize presence tracking
  async initializePresence(
    userId: string,
    options?: {
      teamId?: string;
      projectId?: string;
      view?: string;
    }
  ): Promise<void> {
    // Clear existing presence
    await this.clearPresence(userId);

    // Set initial presence
    const { error } = await supabase
      .from('user_presence')
      .upsert({
        user_id: userId,
        team_id: options?.teamId,
        project_id: options?.projectId,
        status: 'online',
        current_view: options?.view,
        last_seen_at: new Date().toISOString(),
      }, {
        onConflict: 'user_id,team_id,project_id',
      });

    if (error) throw error;

    // Start heartbeat
    this.startHeartbeat(userId);

    // Subscribe to presence changes
    this.subscribeToPresence(options?.teamId, options?.projectId);
  }

  // Update presence status
  async updateStatus(
    userId: string,
    status: 'online' | 'away' | 'busy' | 'offline'
  ): Promise<void> {
    const { error } = await supabase
      .from('user_presence')
      .update({
        status,
        last_seen_at: new Date().toISOString(),
      })
      .eq('user_id', userId);

    if (error) throw error;
  }

  // Update cursor position
  async updateCursor(
    userId: string,
    x: number,
    y: number
  ): Promise<void> {
    const { error } = await supabase
      .from('user_presence')
      .update({
        cursor_x: x,
        cursor_y: y,
        last_seen_at: new Date().toISOString(),
      })
      .eq('user_id', userId);

    if (error) throw error;
  }

  // Update current view
  async updateView(userId: string, view: string): Promise<void> {
    const { error } = await supabase
      .from('user_presence')
      .update({
        current_view: view,
        last_seen_at: new Date().toISOString(),
      })
      .eq('user_id', userId);

    if (error) throw error;
  }

  // Clear presence
  async clearPresence(userId: string): Promise<void> {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }

    const { error } = await supabase
      .from('user_presence')
      .delete()
      .eq('user_id', userId);

    if (error) throw error;
  }

  // Get active users in team/project
  async getActiveUsers(
    options?: {
      teamId?: string;
      projectId?: string;
    }
  ): Promise<UserPresence[]> {
    let query = supabase
      .from('user_presence')
      .select('*')
      .eq('status', 'online')
      .gt('last_seen_at', new Date(Date.now() - 5 * 60 * 1000).toISOString());

    if (options?.teamId) {
      query = query.eq('team_id', options.teamId);
    }

    if (options?.projectId) {
      query = query.eq('project_id', options.projectId);
    }

    const { data: presences, error } = await query;

    if (error) throw error;

    // Get user info separately to avoid relationship issues
    const presencesWithUsers = await Promise.all((presences || []).map(async (presence) => {
      const { data: profile } = await supabase
        .from('profiles')
        .select('email, full_name, avatar_url')
        .eq('id', presence.user_id)
        .single();

      return {
        ...presence,
        user: {
          email: profile?.email || 'Unknown',
          user_metadata: {
            full_name: profile?.full_name || 'Unknown User',
            avatar_url: profile?.avatar_url || ''
          }
        }
      };
    }));

    return presencesWithUsers;
  }

  // Subscribe to presence changes
  subscribeToPresence(teamId?: string, projectId?: string): void {
    const channelName = `presence:${teamId || 'global'}:${projectId || 'global'}`;
    
    if (this.channels.has(channelName)) return;

    const channel = supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'user_presence',
        },
        (payload) => {
          this.handlePresenceChange(payload);
        }
      )
      .subscribe();

    this.channels.set(channelName, channel);
  }

  // Unsubscribe from presence
  unsubscribeFromPresence(teamId?: string, projectId?: string): void {
    const channelName = `presence:${teamId || 'global'}:${projectId || 'global'}`;
    const channel = this.channels.get(channelName);
    
    if (channel) {
      channel.unsubscribe();
      this.channels.delete(channelName);
    }
  }

  // Broadcast event to collaborators
  async broadcastEvent(
    event: Omit<CollaborationEvent, 'timestamp'>
  ): Promise<void> {
    const fullEvent: CollaborationEvent = {
      ...event,
      timestamp: Date.now(),
    };

    // Store event for replay
    const { error } = await supabase
      .from('collaboration_events')
      .insert([fullEvent]);

    if (error) throw error;

    // Notify local subscribers
    this.eventCallbacks.forEach(callback => callback(fullEvent));
  }

  // Subscribe to collaboration events
  onEvent(callback: (event: CollaborationEvent) => void): () => void {
    this.eventCallbacks.add(callback);
    
    return () => {
      this.eventCallbacks.delete(callback);
    };
  }

  // Subscribe to presence changes
  onPresenceChange(callback: (presences: UserPresence[]) => void): () => void {
    this.presenceCallbacks.add(callback);
    
    return () => {
      this.presenceCallbacks.delete(callback);
    };
  }

  // Conflict resolution
  resolveConflicts(
    originalCode: string,
    incomingCode: string,
    baseCode: string
  ): ConflictResolution {
    const originalLines = originalCode.split('\n');
    const incomingLines = incomingCode.split('\n');
    const baseLines = baseCode.split('\n');

    const conflicts: Array<{ line: number; original: string; incoming: string }> = [];
    const mergedLines: string[] = [];

    // Simple three-way merge
    let i = 0, j = 0, k = 0;

    while (i < originalLines.length || j < incomingLines.length) {
      const originalLine = originalLines[i];
      const incomingLine = incomingLines[j];
      const baseLine = baseLines[k];

      if (originalLine === incomingLine) {
        // No conflict
        mergedLines.push(originalLine);
        i++;
        j++;
        if (originalLine === baseLine) k++;
      } else if (originalLine === baseLine) {
        // Incoming changed, accept incoming
        mergedLines.push(incomingLine);
        j++;
        k++;
      } else if (incomingLine === baseLine) {
        // Original changed, keep original
        mergedLines.push(originalLine);
        i++;
        k++;
      } else {
        // Conflict
        conflicts.push({
          line: mergedLines.length + 1,
          original: originalLine,
          incoming: incomingLine,
        });
        mergedLines.push(`<<<<<<< Original`);
        mergedLines.push(originalLine);
        mergedLines.push(`=======`);
        mergedLines.push(incomingLine);
        mergedLines.push(`>>>>>>> Incoming`);
        i++;
        j++;
      }
    }

    return {
      original: originalCode,
      incoming: incomingCode,
      merged: mergedLines.join('\n'),
      conflicts,
    };
  }

  // Get recent events
  async getRecentEvents(
    projectId: string,
    limit: number = 50
  ): Promise<CollaborationEvent[]> {
    const { data, error } = await supabase
      .from('collaboration_events')
      .select('*')
      .eq('project_id', projectId)
      .order('timestamp', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data || [];
  }

  // Undo/Redo stack per user
  private undoStacks: Map<string, string[]> = new Map();
  private redoStacks: Map<string, string[]> = new Map();

  pushToUndoStack(userId: string, code: string): void {
    const stack = this.undoStacks.get(userId) || [];
    stack.push(code);
    // Limit stack size
    if (stack.length > 50) stack.shift();
    this.undoStacks.set(userId, stack);
    // Clear redo stack on new action
    this.redoStacks.delete(userId);
  }

  undo(userId: string): string | null {
    const undoStack = this.undoStacks.get(userId);
    if (!undoStack || undoStack.length === 0) return null;

    const current = undoStack.pop();
    const previous = undoStack[undoStack.length - 1];

    // Push to redo stack
    const redoStack = this.redoStacks.get(userId) || [];
    redoStack.push(current!);
    this.redoStacks.set(userId, redoStack);

    return previous || null;
  }

  redo(userId: string): string | null {
    const redoStack = this.redoStacks.get(userId);
    if (!redoStack || redoStack.length === 0) return null;

    const code = redoStack.pop();
    
    // Push back to undo stack
    const undoStack = this.undoStacks.get(userId) || [];
    undoStack.push(code!);
    this.undoStacks.set(userId, undoStack);

    return code || null;
  }

  canUndo(userId: string): boolean {
    const stack = this.undoStacks.get(userId);
    return !!stack && stack.length > 1;
  }

  canRedo(userId: string): boolean {
    const stack = this.redoStacks.get(userId);
    return !!stack && stack.length > 0;
  }

  // Private methods
  private handlePresenceChange(_payload: any): void {
    // Fetch updated presence list
    this.getActiveUsers().then(presences => {
      this.presenceCallbacks.forEach(callback => callback(presences));
    });
  }

  private startHeartbeat(userId: string): void {
    this.heartbeatInterval = setInterval(async () => {
      await supabase
        .from('user_presence')
        .update({ last_seen_at: new Date().toISOString() })
        .eq('user_id', userId);
    }, 30000); // Every 30 seconds
  }

  // Cleanup
  cleanup(): void {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
    }

    this.channels.forEach(channel => channel.unsubscribe());
    this.channels.clear();
    this.presenceCallbacks.clear();
    this.eventCallbacks.clear();
    this.undoStacks.clear();
    this.redoStacks.clear();
  }
}

export const realtimeCollaborationService = new RealtimeCollaborationService();
