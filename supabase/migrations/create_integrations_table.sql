-- RUN THIS IN SUPABASE SQL EDITOR IF YOU GET DATABASE ERRORS
-- This will create the integrations table for deployment tokens

-- Create integrations table
CREATE TABLE IF NOT EXISTS integrations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    provider VARCHAR(100) NOT NULL,
    name VARCHAR(255) NOT NULL,
    config JSONB DEFAULT '{}',
    credentials_encrypted TEXT,
    is_active BOOLEAN DEFAULT true,
    last_sync_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE integrations ENABLE ROW LEVEL SECURITY;

-- Create RLS policy
DROP POLICY IF EXISTS "Users can manage own integrations" ON integrations;
CREATE POLICY "Users can manage own integrations"
    ON integrations FOR ALL
    USING (user_id = auth.uid());

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_integrations_user ON integrations(user_id);
CREATE INDEX IF NOT EXISTS idx_integrations_provider ON integrations(provider);

-- Create updated_at trigger function (if not exists)
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger
DROP TRIGGER IF EXISTS update_integrations_modtime ON integrations;
CREATE TRIGGER update_integrations_modtime 
    BEFORE UPDATE ON integrations 
    FOR EACH ROW 
    EXECUTE PROCEDURE update_modified_column();

SELECT 'Integrations table created successfully!' as status;
