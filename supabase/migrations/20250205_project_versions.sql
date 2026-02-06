-- Create project_versions table for version history feature
CREATE TABLE IF NOT EXISTS project_versions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    code TEXT NOT NULL,
    prompt TEXT,
    version_number INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    created_by UUID REFERENCES auth.users(id),
    note TEXT,
    UNIQUE(project_id, version_number)
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_project_versions_project_id ON project_versions(project_id);
CREATE INDEX IF NOT EXISTS idx_project_versions_created_at ON project_versions(created_at);

-- Enable Row Level Security
ALTER TABLE project_versions ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view versions of their projects"
    ON project_versions
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM projects
            WHERE projects.id = project_versions.project_id
            AND projects.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can create versions for their projects"
    ON project_versions
    FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM projects
            WHERE projects.id = project_versions.project_id
            AND projects.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete versions of their projects"
    ON project_versions
    FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM projects
            WHERE projects.id = project_versions.project_id
            AND projects.user_id = auth.uid()
        )
    );

-- Enable realtime
alter publication supabase_realtime add table project_versions;
