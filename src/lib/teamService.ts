import { supabase } from './supabase';

export type TeamRole = 'owner' | 'admin' | 'editor' | 'viewer';
export type SharePermission = 'view' | 'edit' | 'admin';
export type MemberStatus = 'active' | 'pending' | 'suspended';

export interface Team {
  id: string;
  name: string;
  slug: string;
  description?: string;
  avatar_url?: string;
  owner_id: string;
  subscription_tier: string;
  max_members: number;
  settings: Record<string, any>;
  created_at: string;
  updated_at: string;
  member_count?: number;
}

export interface TeamMember {
  id: string;
  team_id: string;
  user_id: string;
  role: TeamRole;
  invited_by?: string;
  invited_email?: string;
  status: MemberStatus;
  joined_at?: string;
  created_at: string;
  user?: {
    email: string;
    user_metadata: {
      full_name?: string;
      avatar_url?: string;
    };
  };
}

export interface ProjectShare {
  id: string;
  project_id: string;
  shared_by: string;
  shared_with?: string;
  team_id?: string;
  permission: SharePermission;
  share_type: 'user' | 'team' | 'link';
  share_link_token?: string;
  password_protected: boolean;
  expires_at?: string;
  last_accessed_at?: string;
  access_count: number;
  created_at: string;
}

export interface Comment {
  id: string;
  project_id: string;
  user_id: string;
  parent_id?: string;
  content: string;
  position_x?: number;
  position_y?: number;
  element_selector?: string;
  resolved: boolean;
  resolved_by?: string;
  resolved_at?: string;
  created_at: string;
  updated_at: string;
  user?: {
    email: string;
    user_metadata: {
      full_name?: string;
      avatar_url?: string;
    };
  };
  reactions?: CommentReaction[];
  replies?: Comment[];
}

export interface CommentReaction {
  id: string;
  comment_id: string;
  user_id: string;
  reaction: string;
  created_at: string;
}

export interface Activity {
  id: string;
  team_id?: string;
  project_id?: string;
  user_id: string;
  action: string;
  entity_type: string;
  entity_id: string;
  metadata: Record<string, any>;
  created_at: string;
  user?: {
    email: string;
    user_metadata: {
      full_name?: string;
      avatar_url?: string;
    };
  };
}

class TeamService {
  // Team Management
  async createTeam(name: string, description?: string): Promise<Team> {
    const slug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    
    const { data, error } = await supabase
      .from('teams')
      .insert([
        {
          name,
          slug: `${slug}-${Date.now()}`,
          description,
          max_members: 3, // Free tier default
        },
      ])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async getUserTeams(): Promise<Team[]> {
    const { data: teams, error } = await supabase
      .from('teams')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    // Get member count for each team
    const teamsWithCounts = await Promise.all((teams || []).map(async (team) => {
      const { count } = await supabase
        .from('team_members')
        .select('*', { count: 'exact', head: true })
        .eq('team_id', team.id)
        .eq('status', 'active');

      return {
        ...team,
        member_count: count || 0
      };
    }));

    return teamsWithCounts;
  }

  async getTeamById(teamId: string): Promise<Team | null> {
    const { data, error } = await supabase
      .from('teams')
      .select('*')
      .eq('id', teamId)
      .single();

    if (error) throw error;
    return data;
  }

  async updateTeam(teamId: string, updates: Partial<Team>): Promise<Team> {
    const { data, error } = await supabase
      .from('teams')
      .update(updates)
      .eq('id', teamId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async deleteTeam(teamId: string): Promise<void> {
    const { error } = await supabase
      .from('teams')
      .delete()
      .eq('id', teamId);

    if (error) throw error;
  }

  // Team Members
  async inviteMember(
    teamId: string,
    email: string,
    role: TeamRole = 'editor'
  ): Promise<TeamMember> {
    const { data, error } = await supabase
      .from('team_members')
      .insert([
        {
          team_id: teamId,
          invited_email: email,
          role,
          status: 'pending',
        },
      ])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async getTeamMembers(teamId: string): Promise<TeamMember[]> {
    const { data: members, error } = await supabase
      .from('team_members')
      .select('*')
      .eq('team_id', teamId)
      .order('created_at', { ascending: true });

    if (error) throw error;

    // Get user info separately
    const membersWithUsers = await Promise.all((members || []).map(async (member) => {
      const { data: profile } = await supabase
        .from('profiles')
        .select('email, full_name, avatar_url')
        .eq('id', member.user_id)
        .single();

      return {
        ...member,
        user: {
          email: profile?.email || 'Unknown',
          user_metadata: {
            full_name: profile?.full_name || 'Unknown User',
            avatar_url: profile?.avatar_url || ''
          }
        }
      };
    }));

    return membersWithUsers;
  }

  async updateMemberRole(
    memberId: string,
    role: TeamRole
  ): Promise<TeamMember> {
    const { data, error } = await supabase
      .from('team_members')
      .update({ role })
      .eq('id', memberId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async removeMember(memberId: string): Promise<void> {
    const { error } = await supabase
      .from('team_members')
      .delete()
      .eq('id', memberId);

    if (error) throw error;
  }

  async acceptInvitation(memberId: string): Promise<TeamMember> {
    const { data, error } = await supabase
      .from('team_members')
      .update({
        status: 'active',
        joined_at: new Date().toISOString(),
      })
      .eq('id', memberId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Project Sharing
  async shareProject(
    projectId: string,
    options: {
      shareType: 'user' | 'team' | 'link';
      permission?: SharePermission;
      userId?: string;
      teamId?: string;
      password?: string;
      expiresInDays?: number;
    }
  ): Promise<ProjectShare> {
    // Get current user ID
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error('User not authenticated');
    }

    const shareData: any = {
      project_id: projectId,
      shared_by: user.id,  // REQUIRED: Add the user who is sharing
      share_type: options.shareType,
      permission: options.permission || 'view',
    };

    if (options.shareType === 'user' && options.userId) {
      shareData.shared_with = options.userId;
    } else if (options.shareType === 'team' && options.teamId) {
      shareData.team_id = options.teamId;
    } else if (options.shareType === 'link') {
      shareData.share_link_token = this.generateShareToken();
      if (options.password) {
        shareData.password_protected = true;
        // Note: In production, hash the password
        shareData.password_hash = options.password;
      }
    }

    if (options.expiresInDays) {
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + options.expiresInDays);
      shareData.expires_at = expiresAt.toISOString();
    }

    const { data, error } = await supabase
      .from('project_shares')
      .insert([shareData])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async getProjectShares(projectId: string): Promise<ProjectShare[]> {
    const { data, error } = await supabase
      .from('project_shares')
      .select('*')
      .eq('project_id', projectId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  async revokeShare(shareId: string): Promise<void> {
    const { error } = await supabase
      .from('project_shares')
      .delete()
      .eq('id', shareId);

    if (error) throw error;
  }

  async validateShareLink(token: string, password?: string): Promise<ProjectShare | null> {
    const { data, error } = await supabase
      .from('project_shares')
      .select('*')
      .eq('share_link_token', token)
      .single();

    if (error || !data) return null;

    // Check if expired
    if (data.expires_at && new Date(data.expires_at) < new Date()) {
      return null;
    }

    // Check password
    if (data.password_protected && data.password_hash !== password) {
      return null;
    }

    // Update access count
    await supabase
      .from('project_shares')
      .update({
        access_count: data.access_count + 1,
        last_accessed_at: new Date().toISOString(),
      })
      .eq('id', data.id);

    return data;
  }

  // Comments
  async addComment(
    projectId: string,
    content: string,
    options?: {
      positionX?: number;
      positionY?: number;
      elementSelector?: string;
      parentId?: string;
    }
  ): Promise<Comment> {
    const { data, error } = await supabase
      .from('comments')
      .insert([
        {
          project_id: projectId,
          content,
          position_x: options?.positionX,
          position_y: options?.positionY,
          element_selector: options?.elementSelector,
          parent_id: options?.parentId,
        },
      ])
      .select()
      .single();

    if (error) throw error;

    // Get user info
    const { data: profile } = await supabase
      .from('profiles')
      .select('email, full_name, avatar_url')
      .eq('id', data.user_id)
      .single();

    return {
      ...data,
      user: {
        email: profile?.email || 'Unknown',
        user_metadata: {
          full_name: profile?.full_name || 'Unknown User',
          avatar_url: profile?.avatar_url || ''
        }
      }
    };
  }

  async getProjectComments(projectId: string): Promise<Comment[]> {
    // First, get all comments
    const { data: comments, error } = await supabase
      .from('comments')
      .select('*')
      .eq('project_id', projectId)
      .is('parent_id', null)
      .order('created_at', { ascending: false });

    if (error) throw error;

    // Get user info separately (avoid PostgREST relationship issues)
    const commentsWithUsers = await Promise.all((comments || []).map(async (comment) => {
      // Get user info from auth.users via profiles
      const { data: profile } = await supabase
        .from('profiles')
        .select('email, full_name, avatar_url')
        .eq('id', comment.user_id)
        .single();

      // Get reactions
      const { data: reactions } = await supabase
        .from('comment_reactions')
        .select('*')
        .eq('comment_id', comment.id);

      // Get replies
      const { data: replies } = await supabase
        .from('comments')
        .select('*')
        .eq('parent_id', comment.id)
        .order('created_at', { ascending: true });

      // Get reply user info
      const repliesWithUsers = await Promise.all((replies || []).map(async (reply) => {
        const { data: replyProfile } = await supabase
          .from('profiles')
          .select('email, full_name, avatar_url')
          .eq('id', reply.user_id)
          .single();

        const { data: replyReactions } = await supabase
          .from('comment_reactions')
          .select('*')
          .eq('comment_id', reply.id);

        return {
          ...reply,
          user: {
            email: replyProfile?.email || 'Unknown',
            user_metadata: {
              full_name: replyProfile?.full_name || 'Unknown User',
              avatar_url: replyProfile?.avatar_url || ''
            }
          },
          reactions: replyReactions || []
        };
      }));

      return {
        ...comment,
        user: {
          email: profile?.email || 'Unknown',
          user_metadata: {
            full_name: profile?.full_name || 'Unknown User',
            avatar_url: profile?.avatar_url || ''
          }
        },
        reactions: reactions || [],
        replies: repliesWithUsers
      };
    }));

    return commentsWithUsers;
  }

  async resolveComment(commentId: string): Promise<Comment> {
    const { data, error } = await supabase
      .from('comments')
      .update({
        resolved: true,
        resolved_at: new Date().toISOString(),
      })
      .eq('id', commentId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async deleteComment(commentId: string): Promise<void> {
    const { error } = await supabase
      .from('comments')
      .delete()
      .eq('id', commentId);

    if (error) throw error;
  }

  async addReaction(commentId: string, reaction: string): Promise<CommentReaction> {
    const { data, error } = await supabase
      .from('comment_reactions')
      .insert([
        {
          comment_id: commentId,
          reaction,
        },
      ])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Activity Feed
  async logActivity(
    action: string,
    entityType: string,
    entityId: string,
    options?: {
      teamId?: string;
      projectId?: string;
      metadata?: Record<string, any>;
    }
  ): Promise<Activity> {
    const { data, error } = await supabase
      .from('activities')
      .insert([
        {
          action,
          entity_type: entityType,
          entity_id: entityId,
          team_id: options?.teamId,
          project_id: options?.projectId,
          metadata: options?.metadata || {},
        },
      ])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async getActivities(
    options?: {
      teamId?: string;
      projectId?: string;
      limit?: number;
    }
  ): Promise<Activity[]> {
    let query = supabase
      .from('activities')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(options?.limit || 50);

    if (options?.teamId) {
      query = query.eq('team_id', options.teamId);
    }

    if (options?.projectId) {
      query = query.eq('project_id', options.projectId);
    }

    const { data: activities, error } = await query;

    if (error) throw error;

    // Get user info for each activity
    const activitiesWithUsers = await Promise.all((activities || []).map(async (activity) => {
      const { data: profile } = await supabase
        .from('profiles')
        .select('email, full_name, avatar_url')
        .eq('id', activity.user_id)
        .single();

      return {
        ...activity,
        user: {
          email: profile?.email || 'Unknown',
          user_metadata: {
            full_name: profile?.full_name || 'Unknown User',
            avatar_url: profile?.avatar_url || ''
          }
        }
      };
    }));

    return activitiesWithUsers;
  }

  // Permissions
  async checkProjectPermission(
    projectId: string,
    userId: string
  ): Promise<SharePermission | null> {
    // Check if user is owner
    const { data: project } = await supabase
      .from('projects')
      .select('user_id')
      .eq('id', projectId)
      .single();

    if (project?.user_id === userId) {
      return 'admin';
    }

    // Check project shares
    const { data: share } = await supabase
      .from('project_shares')
      .select('permission')
      .eq('project_id', projectId)
      .eq('shared_with', userId)
      .single();

    return share?.permission || null;
  }

  // Helpers
  private generateShareToken(): string {
    return Math.random().toString(36).substring(2, 15) + 
           Math.random().toString(36).substring(2, 15);
  }

  formatRole(role: TeamRole): string {
    const roleMap: Record<TeamRole, string> = {
      owner: 'Owner',
      admin: 'Admin',
      editor: 'Editor',
      viewer: 'Viewer',
    };
    return roleMap[role] || role;
  }

  getRolePermissions(role: TeamRole): string[] {
    const permissions: Record<TeamRole, string[]> = {
      owner: ['all'],
      admin: ['read', 'write', 'delete', 'invite', 'manage_members'],
      editor: ['read', 'write', 'comment'],
      viewer: ['read', 'comment'],
    };
    return permissions[role] || ['read'];
  }
}

export const teamService = new TeamService();
