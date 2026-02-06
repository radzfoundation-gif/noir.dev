import { supabase } from './supabase';

export interface Version {
  id: string;
  project_id: string;
  code: string;
  prompt?: string;
  version_number: number;
  created_at: string;
  created_by?: string;
  note?: string;
}

export interface VersionComparison {
  from: Version;
  to: Version;
  additions: number;
  deletions: number;
  changedLines: string[];
}

class VersionHistoryService {
  async getVersions(projectId: string): Promise<Version[]> {
    const { data, error } = await supabase
      .from('project_versions')
      .select('*')
      .eq('project_id', projectId)
      .order('version_number', { ascending: false });

    if (error) {
      console.error('Error fetching versions:', error);
      throw error;
    }

    return data || [];
  }

  async createVersion(
    projectId: string,
    code: string,
    note?: string,
    prompt?: string
  ): Promise<Version> {
    // Get current version count
    const { count } = await supabase
      .from('project_versions')
      .select('*', { count: 'exact', head: true })
      .eq('project_id', projectId);

    const nextVersion = (count || 0) + 1;

    const { data, error } = await supabase
      .from('project_versions')
      .insert([
        {
          project_id: projectId,
          code,
          prompt,
          version_number: nextVersion,
          note: note || `Version ${nextVersion}`,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error('Error creating version:', error);
      throw error;
    }

    return data;
  }

  async getVersion(versionId: string): Promise<Version | null> {
    const { data, error } = await supabase
      .from('project_versions')
      .select('*')
      .eq('id', versionId)
      .single();

    if (error) {
      console.error('Error fetching version:', error);
      throw error;
    }

    return data;
  }

  async revertToVersion(versionId: string): Promise<Version> {
    const version = await this.getVersion(versionId);
    if (!version) {
      throw new Error('Version not found');
    }

    // Create new version with the reverted code
    return this.createVersion(
      version.project_id,
      version.code,
      `Reverted to version ${version.version_number}`
    );
  }

  async compareVersions(fromId: string, toId: string): Promise<VersionComparison> {
    const [from, to] = await Promise.all([
      this.getVersion(fromId),
      this.getVersion(toId),
    ]);

    if (!from || !to) {
      throw new Error('One or both versions not found');
    }

    const fromLines = from.code.split('\n');
    const toLines = to.code.split('\n');

    let additions = 0;
    let deletions = 0;
    const changedLines: string[] = [];

    // Simple diff calculation
    const maxLines = Math.max(fromLines.length, toLines.length);
    for (let i = 0; i < maxLines; i++) {
      const fromLine = fromLines[i] || '';
      const toLine = toLines[i] || '';

      if (fromLine !== toLine) {
        if (!fromLine && toLine) {
          additions++;
          changedLines.push(`+ ${toLine}`);
        } else if (fromLine && !toLine) {
          deletions++;
          changedLines.push(`- ${fromLine}`);
        } else {
          deletions++;
          additions++;
          changedLines.push(`- ${fromLine}`);
          changedLines.push(`+ ${toLine}`);
        }
      }
    }

    return {
      from,
      to,
      additions,
      deletions,
      changedLines,
    };
  }

  async deleteVersion(versionId: string): Promise<void> {
    const { error } = await supabase
      .from('project_versions')
      .delete()
      .eq('id', versionId);

    if (error) {
      console.error('Error deleting version:', error);
      throw error;
    }
  }

  async autoSaveVersion(projectId: string, code: string, prompt?: string): Promise<void> {
    // Check if there's a version in the last 5 minutes
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString();

    const { data: recentVersion } = await supabase
      .from('project_versions')
      .select('*')
      .eq('project_id', projectId)
      .gte('created_at', fiveMinutesAgo)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (recentVersion) {
      // Update the recent version
      await supabase
        .from('project_versions')
        .update({ code, prompt })
        .eq('id', recentVersion.id);
    } else {
      // Create new auto-save version
      await this.createVersion(projectId, code, 'Auto-saved', prompt);
    }
  }

  formatVersionDate(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;

    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
    });
  }

  getCodeSize(code: string): string {
    const bytes = new Blob([code]).size;
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }
}

export const versionHistoryService = new VersionHistoryService();
