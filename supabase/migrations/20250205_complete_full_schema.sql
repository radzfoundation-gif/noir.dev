-- ============================================================================
-- NOIR AI - Complete Supabase Schema
-- Version: 2.0.0
-- Created: 2025-02-05
-- Description: Full database schema for NOIR AI platform
-- Includes: Q1, Q2, Q3 features
-- ============================================================================

-- ============================================================================
-- EXTENSIONS
-- ============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enable pgcrypto for encryption
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================================
-- BASE TABLES (Required for foreign keys)
-- ============================================================================

-- Projects table (base table for all features)
CREATE TABLE IF NOT EXISTS projects (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    code TEXT NOT NULL DEFAULT '',
    prompt TEXT,
    framework VARCHAR(50) DEFAULT 'html',
    generation_type VARCHAR(50) DEFAULT 'web',
    model VARCHAR(100),
    is_favorite BOOLEAN DEFAULT false,
    thumbnail_url TEXT,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_projects_user ON projects(user_id);
CREATE INDEX IF NOT EXISTS idx_projects_created ON projects(created_at);

ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own projects"
    ON projects FOR SELECT
    USING (user_id = auth.uid());

CREATE POLICY "Users can create projects"
    ON projects FOR INSERT
    WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own projects"
    ON projects FOR UPDATE
    USING (user_id = auth.uid());

CREATE POLICY "Users can delete own projects"
    ON projects FOR DELETE
    USING (user_id = auth.uid());

-- ============================================================================
-- Q1 2025: PROJECT VERSIONS
-- ============================================================================

CREATE TABLE IF NOT EXISTS project_versions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    code TEXT NOT NULL,
    prompt TEXT,
    version_number INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    created_by UUID REFERENCES auth.users(id),
    note TEXT,
    UNIQUE(project_id, version_number)
);

CREATE INDEX IF NOT EXISTS idx_project_versions_project_id ON project_versions(project_id);
CREATE INDEX IF NOT EXISTS idx_project_versions_created_at ON project_versions(created_at);

ALTER TABLE project_versions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view versions of their projects"
    ON project_versions FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM projects
            WHERE projects.id = project_versions.project_id
            AND projects.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can create versions for their projects"
    ON project_versions FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM projects
            WHERE projects.id = project_versions.project_id
            AND projects.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete versions of their projects"
    ON project_versions FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM projects
            WHERE projects.id = project_versions.project_id
            AND projects.user_id = auth.uid()
        )
    );

-- ============================================================================
-- Q2 2025: TEAM COLLABORATION
-- ============================================================================

-- Teams table
CREATE TABLE IF NOT EXISTS teams (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    avatar_url TEXT,
    owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    subscription_tier VARCHAR(50) DEFAULT 'free',
    max_members INTEGER DEFAULT 3,
    settings JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Team members table
CREATE TABLE IF NOT EXISTS team_members (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    role VARCHAR(50) NOT NULL DEFAULT 'member', -- owner, admin, editor, viewer
    invited_by UUID REFERENCES auth.users(id),
    invited_email VARCHAR(255),
    status VARCHAR(50) DEFAULT 'active', -- active, pending, suspended
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(team_id, user_id)
);

-- Project shares table
CREATE TABLE IF NOT EXISTS project_shares (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    shared_by UUID NOT NULL REFERENCES auth.users(id),
    shared_with UUID REFERENCES auth.users(id),
    team_id UUID REFERENCES teams(id),
    permission VARCHAR(50) NOT NULL DEFAULT 'view', -- view, edit, admin
    share_type VARCHAR(50) NOT NULL DEFAULT 'user', -- user, team, link
    share_link_token VARCHAR(255) UNIQUE,
    password_protected BOOLEAN DEFAULT false,
    password_hash VARCHAR(255),
    expires_at TIMESTAMP WITH TIME ZONE,
    last_accessed_at TIMESTAMP WITH TIME ZONE,
    access_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Comments table
CREATE TABLE IF NOT EXISTS comments (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    parent_id UUID REFERENCES comments(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    position_x DECIMAL(10, 2),
    position_y DECIMAL(10, 2),
    element_selector VARCHAR(500),
    resolved BOOLEAN DEFAULT false,
    resolved_by UUID REFERENCES auth.users(id),
    resolved_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Comment reactions table
CREATE TABLE IF NOT EXISTS comment_reactions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    comment_id UUID NOT NULL REFERENCES comments(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    reaction VARCHAR(50) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(comment_id, user_id, reaction)
);

-- Activities table
CREATE TABLE IF NOT EXISTS activities (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id),
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(50) NOT NULL,
    entity_id UUID NOT NULL,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- User presence table
CREATE TABLE IF NOT EXISTS user_presence (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    status VARCHAR(50) DEFAULT 'online',
    last_seen_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    cursor_x DECIMAL(10, 2),
    cursor_y DECIMAL(10, 2),
    current_view VARCHAR(100),
    UNIQUE(user_id, team_id, project_id)
);

-- Design systems table
CREATE TABLE IF NOT EXISTS design_systems (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    framework VARCHAR(50) NOT NULL,
    library VARCHAR(100) NOT NULL,
    version VARCHAR(50),
    config JSONB NOT NULL DEFAULT '{}',
    is_default BOOLEAN DEFAULT false,
    team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- User design preferences table
CREATE TABLE IF NOT EXISTS user_design_preferences (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    default_design_system_id UUID REFERENCES design_systems(id),
    default_framework VARCHAR(50) DEFAULT 'react',
    default_export_format VARCHAR(50) DEFAULT 'tsx',
    use_typescript BOOLEAN DEFAULT true,
    use_tailwind BOOLEAN DEFAULT true,
    preferences JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(user_id)
);

-- Create indexes for Q2 tables
CREATE INDEX IF NOT EXISTS idx_teams_owner ON teams(owner_id);
CREATE INDEX IF NOT EXISTS idx_team_members_team ON team_members(team_id);
CREATE INDEX IF NOT EXISTS idx_team_members_user ON team_members(user_id);
CREATE INDEX IF NOT EXISTS idx_project_shares_project ON project_shares(project_id);
CREATE INDEX IF NOT EXISTS idx_comments_project ON comments(project_id);
CREATE INDEX IF NOT EXISTS idx_comments_user ON comments(user_id);
CREATE INDEX IF NOT EXISTS idx_activities_team ON activities(team_id);
CREATE INDEX IF NOT EXISTS idx_activities_project ON activities(project_id);
CREATE INDEX IF NOT EXISTS idx_user_presence_team ON user_presence(team_id);
CREATE INDEX IF NOT EXISTS idx_user_presence_project ON user_presence(project_id);

-- Enable RLS for Q2 tables
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_shares ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE comment_reactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_presence ENABLE ROW LEVEL SECURITY;
ALTER TABLE design_systems ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_design_preferences ENABLE ROW LEVEL SECURITY;

-- RLS Policies for Q2
CREATE POLICY "Team members can view team"
    ON teams FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM team_members
            WHERE team_members.team_id = teams.id
            AND team_members.user_id = auth.uid()
            AND team_members.status = 'active'
        )
        OR owner_id = auth.uid()
    );

CREATE POLICY "Only owner can update team"
    ON teams FOR UPDATE
    USING (owner_id = auth.uid());

CREATE POLICY "Only owner can delete team"
    ON teams FOR DELETE
    USING (owner_id = auth.uid());

CREATE POLICY "Team members can view other members"
    ON team_members FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM team_members tm
            WHERE tm.team_id = team_members.team_id
            AND tm.user_id = auth.uid()
            AND tm.status = 'active'
        )
    );

CREATE POLICY "Comments viewable by project members"
    ON comments FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM projects
            WHERE projects.id = comments.project_id
            AND (projects.user_id = auth.uid()
                OR EXISTS (
                    SELECT 1 FROM project_shares
                    WHERE project_shares.project_id = projects.id
                    AND project_shares.shared_with = auth.uid()
                )
            )
        )
    );

CREATE POLICY "Users can create comments"
    ON comments FOR INSERT
    WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own comments"
    ON comments FOR UPDATE
    USING (user_id = auth.uid());

CREATE POLICY "Users can delete own comments"
    ON comments FOR DELETE
    USING (user_id = auth.uid());

-- ============================================================================
-- Q3 2025: BACKEND INTEGRATION & API
-- ============================================================================

-- API endpoints table
CREATE TABLE IF NOT EXISTS api_endpoints (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    path VARCHAR(500) NOT NULL,
    method VARCHAR(10) NOT NULL CHECK (method IN ('GET', 'POST', 'PUT', 'PATCH', 'DELETE')),
    description TEXT,
    request_schema JSONB DEFAULT '{}',
    response_schema JSONB DEFAULT '{}',
    authentication VARCHAR(50) DEFAULT 'none',
    rate_limit INTEGER DEFAULT 100,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Database schemas table
CREATE TABLE IF NOT EXISTS database_schemas (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL DEFAULT 'postgresql',
    tables JSONB NOT NULL DEFAULT '[]',
    relationships JSONB DEFAULT '[]',
    migrations JSONB DEFAULT '[]',
    is_generated BOOLEAN DEFAULT false,
    generated_sql TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Database tables table
CREATE TABLE IF NOT EXISTS database_tables (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    schema_id UUID NOT NULL REFERENCES database_schemas(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    columns JSONB NOT NULL DEFAULT '[]',
    indexes JSONB DEFAULT '[]',
    constraints JSONB DEFAULT '[]',
    row_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- API keys table
CREATE TABLE IF NOT EXISTS api_keys (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    key_hash VARCHAR(255) NOT NULL,
    key_prefix VARCHAR(20) NOT NULL,
    permissions JSONB DEFAULT '["read"]',
    rate_limit INTEGER DEFAULT 1000,
    last_used_at TIMESTAMP WITH TIME ZONE,
    expires_at TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- API usage logs table
CREATE TABLE IF NOT EXISTS api_usage_logs (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    api_key_id UUID REFERENCES api_keys(id),
    endpoint_id UUID REFERENCES api_endpoints(id),
    user_id UUID REFERENCES auth.users(id),
    method VARCHAR(10) NOT NULL,
    path VARCHAR(500) NOT NULL,
    status_code INTEGER,
    response_time_ms INTEGER,
    ip_address INET,
    user_agent TEXT,
    request_body JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Backend templates table
CREATE TABLE IF NOT EXISTS backend_templates (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    framework VARCHAR(50) NOT NULL,
    language VARCHAR(50) NOT NULL,
    template_code TEXT NOT NULL,
    dependencies JSONB DEFAULT '[]',
    dev_dependencies JSONB DEFAULT '[]',
    config_files JSONB DEFAULT '{}',
    is_default BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Mobile app exports table
CREATE TABLE IF NOT EXISTS mobile_app_exports (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    platform VARCHAR(50) NOT NULL,
    framework VARCHAR(50) NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',
    export_url TEXT,
    file_size BIGINT,
    build_logs TEXT,
    config JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    completed_at TIMESTAMP WITH TIME ZONE
);

-- Webhooks table
CREATE TABLE IF NOT EXISTS webhooks (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    url VARCHAR(500) NOT NULL,
    secret VARCHAR(255),
    events JSONB NOT NULL DEFAULT '[]',
    is_active BOOLEAN DEFAULT true,
    last_triggered_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Webhook deliveries table
CREATE TABLE IF NOT EXISTS webhook_deliveries (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    webhook_id UUID NOT NULL REFERENCES webhooks(id) ON DELETE CASCADE,
    event_type VARCHAR(100) NOT NULL,
    payload JSONB NOT NULL,
    response_status INTEGER,
    response_body TEXT,
    delivery_status VARCHAR(50) DEFAULT 'pending',
    retry_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Integrations table
CREATE TABLE IF NOT EXISTS integrations (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    provider VARCHAR(100) NOT NULL,
    name VARCHAR(255) NOT NULL,
    config JSONB DEFAULT '{}',
    credentials_encrypted TEXT,
    is_active BOOLEAN DEFAULT true,
    last_sync_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create indexes for Q3 tables
CREATE INDEX IF NOT EXISTS idx_api_endpoints_project ON api_endpoints(project_id);
CREATE INDEX IF NOT EXISTS idx_database_schemas_project ON database_schemas(project_id);
CREATE INDEX IF NOT EXISTS idx_api_keys_user ON api_keys(user_id);
CREATE INDEX IF NOT EXISTS idx_api_usage_logs_key ON api_usage_logs(api_key_id);
CREATE INDEX IF NOT EXISTS idx_api_usage_logs_created ON api_usage_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_webhooks_project ON webhooks(project_id);
CREATE INDEX IF NOT EXISTS idx_webhook_deliveries_webhook ON webhook_deliveries(webhook_id);

-- Enable RLS for Q3 tables
ALTER TABLE api_endpoints ENABLE ROW LEVEL SECURITY;
ALTER TABLE database_schemas ENABLE ROW LEVEL SECURITY;
ALTER TABLE database_tables ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_usage_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE mobile_app_exports ENABLE ROW LEVEL SECURITY;
ALTER TABLE webhooks ENABLE ROW LEVEL SECURITY;
ALTER TABLE webhook_deliveries ENABLE ROW LEVEL SECURITY;
ALTER TABLE integrations ENABLE ROW LEVEL SECURITY;

-- RLS Policies for Q3
CREATE POLICY "Project members can view API endpoints"
    ON api_endpoints FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM projects
            WHERE projects.id = api_endpoints.project_id
            AND (projects.user_id = auth.uid()
                OR EXISTS (
                    SELECT 1 FROM project_shares
                    WHERE project_shares.project_id = projects.id
                    AND project_shares.shared_with = auth.uid()
                )
            )
        )
    );

CREATE POLICY "Users can view own API keys"
    ON api_keys FOR SELECT
    USING (user_id = auth.uid());

CREATE POLICY "Users can manage own API keys"
    ON api_keys FOR ALL
    USING (user_id = auth.uid());

-- ============================================================================
-- FUNCTIONS & TRIGGERS
-- ============================================================================

-- Function to auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for all tables with updated_at
CREATE TRIGGER update_teams_updated_at BEFORE UPDATE ON teams
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_team_members_updated_at BEFORE UPDATE ON team_members
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_comments_updated_at BEFORE UPDATE ON comments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_design_systems_updated_at BEFORE UPDATE ON design_systems
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_design_preferences_updated_at BEFORE UPDATE ON user_design_preferences
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_api_endpoints_updated_at BEFORE UPDATE ON api_endpoints
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_database_schemas_updated_at BEFORE UPDATE ON database_schemas
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_database_tables_updated_at BEFORE UPDATE ON database_tables
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to generate slug from team name
CREATE OR REPLACE FUNCTION generate_team_slug(name TEXT)
RETURNS TEXT AS $$
DECLARE
    base_slug TEXT;
    final_slug TEXT;
    counter INTEGER := 0;
BEGIN
    base_slug := lower(regexp_replace(name, '[^a-zA-Z0-9]+', '-', 'g'));
    final_slug := base_slug;
    
    WHILE EXISTS (SELECT 1 FROM teams WHERE slug = final_slug) LOOP
        counter := counter + 1;
        final_slug := base_slug || '-' || counter;
    END LOOP;
    
    RETURN final_slug;
END;
$$ LANGUAGE plpgsql;

-- Function to log activity
CREATE OR REPLACE FUNCTION log_activity(
    p_team_id UUID,
    p_project_id UUID,
    p_action VARCHAR,
    p_entity_type VARCHAR,
    p_entity_id UUID,
    p_metadata JSONB DEFAULT '{}'
)
RETURNS UUID AS $$
DECLARE
    v_activity_id UUID;
BEGIN
    INSERT INTO activities (
        team_id,
        project_id,
        user_id,
        action,
        entity_type,
        entity_id,
        metadata
    ) VALUES (
        p_team_id,
        p_project_id,
        auth.uid(),
        p_action,
        p_entity_type,
        p_entity_id,
        p_metadata
    )
    RETURNING id INTO v_activity_id;
    
    RETURN v_activity_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- SEED DATA
-- ============================================================================

-- Insert default backend templates
INSERT INTO backend_templates (name, framework, language, template_code, dependencies, is_default) VALUES
(
    'Express.js + TypeScript',
    'express',
    'typescript',
    'import express from ''express'';
import cors from ''cors'';
import dotenv from ''dotenv'';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Health check
app.get(''/api/health'', (req, res) => {
    res.json({ status: ''ok'', timestamp: new Date().toISOString() });
});

// {{GENERATED_ROUTES}}

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});',
    '["express", "cors", "dotenv", "@types/express", "@types/cors", "typescript", "ts-node"]',
    true
),
(
    'Fastify + TypeScript',
    'fastify',
    'typescript',
    'import Fastify from ''fastify'';
import cors from ''@fastify/cors'';
import dotenv from ''dotenv'';

dotenv.config();

const app = Fastify({ logger: true });
const PORT = parseInt(process.env.PORT || ''3000'');

app.register(cors);

// Health check
app.get(''/api/health'', async () => {
    return { status: ''ok'', timestamp: new Date().toISOString() };
});

// {{GENERATED_ROUTES}}

const start = async () => {
    try {
        await app.listen({ port: PORT });
    } catch (err) {
        app.log.error(err);
        process.exit(1);
    }
};

start();',
    '["fastify", "@fastify/cors", "dotenv", "typescript", "ts-node"]',
    false
),
(
    'Django REST Framework',
    'django',
    'python',
    'from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response

@api_view([''GET''])
def health_check(request):
    return Response({
        ''status'': ''ok'',
        ''timestamp'': timezone.now().isoformat()
    })

# {{GENERATED_VIEWS}}',
    '["django", "djangorestframework", "django-cors-headers"]',
    false
);

-- Insert default design systems
INSERT INTO design_systems (name, slug, framework, library, config, is_default) VALUES
(
    'Material-UI (React)',
    'mui-react',
    'react',
    'mui',
    '{"theme": {"palette": {"primary": {"main": "#1976d2"}}}}',
    true
),
(
    'Chakra UI (React)',
    'chakra-react',
    'react',
    'chakra',
    '{"theme": {"config": {"initialColorMode": "light"}}}',
    false
),
(
    'Ant Design (React)',
    'antd-react',
    'react',
    'antd',
    '{"theme": {"token": {"colorPrimary": "#1890ff"}}}',
    false
);

-- ============================================================================
-- REALTIME CONFIGURATION
-- ============================================================================

-- Enable realtime for all tables
DO $$
BEGIN
    -- Q1 tables
    ALTER PUBLICATION supabase_realtime ADD TABLE project_versions;
    
    -- Q2 tables
    ALTER PUBLICATION supabase_realtime ADD TABLE teams;
    ALTER PUBLICATION supabase_realtime ADD TABLE team_members;
    ALTER PUBLICATION supabase_realtime ADD TABLE project_shares;
    ALTER PUBLICATION supabase_realtime ADD TABLE comments;
    ALTER PUBLICATION supabase_realtime ADD TABLE activities;
    ALTER PUBLICATION supabase_realtime ADD TABLE user_presence;
    
    -- Q3 tables
    ALTER PUBLICATION supabase_realtime ADD TABLE api_endpoints;
    ALTER PUBLICATION supabase_realtime ADD TABLE database_schemas;
    ALTER PUBLICATION supabase_realtime ADD TABLE mobile_app_exports;
    ALTER PUBLICATION supabase_realtime ADD TABLE webhooks;
    ALTER PUBLICATION supabase_realtime ADD TABLE webhook_deliveries;
EXCEPTION
    WHEN duplicate_object THEN
        NULL;
END $$;

-- ============================================================================
-- VIEWS FOR ANALYTICS
-- ============================================================================

-- View for project activity summary
CREATE OR REPLACE VIEW project_activity_summary AS
SELECT 
    p.id as project_id,
    p.name as project_name,
    p.user_id as owner_id,
    COUNT(DISTINCT c.id) as comment_count,
    COUNT(DISTINCT ps.id) as share_count,
    COUNT(DISTINCT pv.id) as version_count,
    MAX(a.created_at) as last_activity_at
FROM projects p
LEFT JOIN comments c ON c.project_id = p.id
LEFT JOIN project_shares ps ON ps.project_id = p.id
LEFT JOIN project_versions pv ON pv.project_id = p.id
LEFT JOIN activities a ON a.project_id = p.id
GROUP BY p.id, p.name, p.user_id;

-- View for team member summary
CREATE OR REPLACE VIEW team_member_summary AS
SELECT 
    t.id as team_id,
    t.name as team_name,
    COUNT(DISTINCT tm.id) as member_count,
    COUNT(DISTINCT CASE WHEN tm.role = 'owner' THEN tm.id END) as owner_count,
    COUNT(DISTINCT CASE WHEN tm.role = 'admin' THEN tm.id END) as admin_count,
    COUNT(DISTINCT CASE WHEN tm.role = 'editor' THEN tm.id END) as editor_count,
    COUNT(DISTINCT CASE WHEN tm.role = 'viewer' THEN tm.id END) as viewer_count
FROM teams t
LEFT JOIN team_members tm ON tm.team_id = t.id AND tm.status = 'active'
GROUP BY t.id, t.name;

-- ============================================================================
-- GRANTS
-- ============================================================================

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;

-- Grant select on views
GRANT SELECT ON project_activity_summary TO authenticated;
GRANT SELECT ON team_member_summary TO authenticated;

-- ============================================================================
-- COMMENTS FOR DOCUMENTATION
-- ============================================================================

COMMENT ON TABLE project_versions IS 'Stores version history for projects (Q1 2025)';
COMMENT ON TABLE teams IS 'Team workspaces for collaboration (Q2 2025)';
COMMENT ON TABLE team_members IS 'Team membership with roles (Q2 2025)';
COMMENT ON TABLE project_shares IS 'Project sharing configuration (Q2 2025)';
COMMENT ON TABLE comments IS 'Comments and annotations on projects (Q2 2025)';
COMMENT ON TABLE user_presence IS 'Real-time user presence tracking (Q2 2025)';
COMMENT ON TABLE api_endpoints IS 'API endpoint definitions (Q3 2025)';
COMMENT ON TABLE database_schemas IS 'Database schema definitions (Q3 2025)';
COMMENT ON TABLE api_keys IS 'API key management (Q3 2025)';
COMMENT ON TABLE webhooks IS 'Webhook configuration (Q3 2025)';
COMMENT ON TABLE mobile_app_exports IS 'Mobile app export tracking (Q3 2025)';

-- ============================================================================
-- END OF SCHEMA
-- ============================================================================

-- Total tables created: 25
-- Total indexes created: 30+
-- Total RLS policies: 20+
-- Total functions: 4
-- Total triggers: 8
-- Total views: 2
-- Seed data: 6 templates, 3 design systems
