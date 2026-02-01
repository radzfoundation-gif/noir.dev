import { supabase } from './supabase';

export interface Project {
    id: string;
    user_id: string;
    name: string;
    code: string;
    generation_type: 'web' | 'app';
    prompt: string | null;
    created_at: string;
    updated_at: string;
}

export type ProjectInsert = Omit<Project, 'id' | 'user_id' | 'created_at' | 'updated_at'>;

export const projectService = {
    async getProjects(): Promise<Project[]> {
        const { data, error } = await supabase
            .from('projects')
            .select('*')
            .order('updated_at', { ascending: false });

        if (error) throw error;
        return data || [];
    },

    async getProject(id: string): Promise<Project | null> {
        const { data, error } = await supabase
            .from('projects')
            .select('*')
            .eq('id', id)
            .single();

        if (error) throw error;
        return data;
    },

    async createProject(project: ProjectInsert): Promise<Project> {
        const { data, error } = await supabase
            .from('projects')
            .insert([project])
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    async updateProject(id: string, updates: Partial<ProjectInsert>): Promise<Project> {
        const { data, error } = await supabase
            .from('projects')
            .update({ ...updates, updated_at: new Date().toISOString() })
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    async deleteProject(id: string): Promise<void> {
        const { error } = await supabase
            .from('projects')
            .delete()
            .eq('id', id);

        if (error) throw error;
    },

    async saveOrUpdate(
        id: string | null,
        project: ProjectInsert
    ): Promise<Project> {
        if (id) {
            return this.updateProject(id, project);
        }
        return this.createProject(project);
    }
};
