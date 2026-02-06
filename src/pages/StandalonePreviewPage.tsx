
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import type { Project } from '../lib/projectService';

export const StandalonePreviewPage = () => {
    const { projectId } = useParams();
    const [project, setProject] = useState<Project | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchProject = async () => {
            if (!projectId) return;
            try {
                const { data, error } = await supabase
                    .from('projects')
                    .select('*')
                    .eq('id', projectId)
                    .single();

                if (error) throw error;
                if (!data) throw new Error('Project not found');

                setProject(data);
            } catch (err: any) {
                console.error('Error fetching project:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchProject();
    }, [projectId]);

    if (loading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="animate-spin w-8 h-8 border-4 border-lime-500 border-t-transparent rounded-full"></div>
            </div>
        );
    }

    if (error || !project) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center text-red-500">
                <p>Error: {error || 'Project not found'}</p>
            </div>
        );
    }

    return (
        <div className="w-screen h-screen bg-white m-0 p-0 overflow-hidden">
            <iframe
                srcDoc={project.code}
                className="w-full h-full border-none"
                title={project.name}
                sandbox="allow-scripts allow-modals allow-forms allow-popups allow-same-origin allow-top-navigation-by-user-activation allow-downloads-without-user-activation"
            />
        </div>
    );
};
