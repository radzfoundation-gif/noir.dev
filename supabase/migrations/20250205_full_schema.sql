-- ============================================================================
-- NOIR AI PLATFORM - COMPLETE DATABASE SCHEMA
-- Version: 3.0.0
-- Date: 2025-02-05
-- ============================================================================

-- ============================================================================
-- SECTION 0: CLEANUP (Run ONLY if needed to reset)
-- ============================================================================

-- WARNING: Uncomment these lines ONLY if you want to delete ALL tables
-- DROP TABLE IF EXISTS webhook_deliveries CASCADE;
-- DROP TABLE IF EXISTS webhooks CASCADE;
-- DROP TABLE IF EXISTS integrations CASCADE;
-- DROP TABLE IF EXISTS api_usage_logs CASCADE;
-- DROP TABLE IF EXISTS api_keys CASCADE;
-- DROP TABLE IF EXISTS mobile_app_exports CASCADE;
-- DROP TABLE IF EXISTS database_tables CASCADE;
-- DROP TABLE IF EXISTS database_schemas CASCADE;
-- DROP TABLE IF EXISTS api_endpoints CASCADE;
-- DROP TABLE IF EXISTS backend_templates CASCADE;
-- DROP TABLE IF EXISTS user_design_preferences CASCADE;
-- DROP TABLE IF EXISTS design_systems CASCADE;
-- DROP TABLE IF EXISTS user_presence CASCADE;
-- DROP TABLE IF EXISTS activities CASCADE;
-- DROP TABLE IF EXISTS comment_reactions CASCADE;
-- DROP TABLE IF EXISTS comments CASCADE;
-- DROP TABLE IF EXISTS project_shares CASCADE;
-- DROP TABLE IF EXISTS team_members CASCADE;
-- DROP TABLE IF EXISTS teams CASCADE;
-- DROP TABLE IF EXISTS project_versions CASCADE;
-- DROP TABLE IF EXISTS projects CASCADE;
-- DROP TABLE IF EXISTS profiles CASCADE;

-- ============================================================================
-- SECTION 1: EXTENSIONS
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- SECTION 2: BASE TABLES
-- ============================================================================

-- User Profiles (linked to auth.users)
CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT,
    full_name TEXT,
    avatar_url TEXT,
    bio TEXT,
    website TEXT,
    timezone TEXT DEFAULT 'UTC',
    notification_settings JSONB DEFAULT '{"email": true, "push": true}',
    preferences JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Projects
CREATE TABLE projects (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    code TEXT DEFAULT '',
    prompt TEXT,
    framework VARCHAR(50) DEFAULT 'html',
    generation_type VARCHAR(50) DEFAULT 'web',
    model VARCHAR(100),
    is_favorite BOOLEAN DEFAULT false,
    is_public BOOLEAN DEFAULT false,
    thumbnail_url TEXT,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Project Versions (Q1)
CREATE TABLE project_versions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    code TEXT NOT NULL,
    prompt TEXT,
    version_number INTEGER NOT NULL,
    created_by UUID REFERENCES auth.users(id),
    note TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(project_id, version_number)
);

-- ============================================================================
-- SECTION 3: TEAM COLLABORATION (Q2)
-- ============================================================================

-- Teams
CREATE TABLE teams (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    avatar_url TEXT,
    owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    subscription_tier VARCHAR(50) DEFAULT 'free',
    max_members INTEGER DEFAULT 3,
    settings JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Team Members
CREATE TABLE team_members (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    role VARCHAR(50) DEFAULT 'member',
    invited_by UUID REFERENCES auth.users(id),
    invited_email TEXT,
    status VARCHAR(50) DEFAULT 'active',
    joined_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(team_id, user_id)
);

-- Project Shares
CREATE TABLE project_shares (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    shared_by UUID NOT NULL REFERENCES auth.users(id),
    shared_with UUID REFERENCES auth.users(id),
    team_id UUID REFERENCES teams(id),
    permission VARCHAR(50) DEFAULT 'view',
    share_type VARCHAR(50) DEFAULT 'user',
    share_link_token TEXT,
    password_protected BOOLEAN DEFAULT false,
    password_hash TEXT,
    expires_at TIMESTAMPTZ,
    last_accessed_at TIMESTAMPTZ,
    access_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- SECTION 4: COMMENTS & ACTIVITY (Q2)
-- ============================================================================

-- Comments
CREATE TABLE comments (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    parent_id UUID REFERENCES comments(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    position_x DECIMAL(10, 2),
    position_y DECIMAL(10, 2),
    element_selector TEXT,
    resolved BOOLEAN DEFAULT false,
    resolved_by UUID REFERENCES auth.users(id),
    resolved_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Comment Reactions
CREATE TABLE comment_reactions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    comment_id UUID NOT NULL REFERENCES comments(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    reaction VARCHAR(50) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(comment_id, user_id, reaction)
);

-- Activity Feed
CREATE TABLE activities (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(50) NOT NULL,
    entity_id UUID NOT NULL,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- SECTION 5: DESIGN SYSTEMS (Q2)
-- ============================================================================

-- Design Systems
CREATE TABLE design_systems (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    framework VARCHAR(50) NOT NULL,
    library VARCHAR(100) NOT NULL,
    version VARCHAR(50),
    config JSONB DEFAULT '{}',
    is_default BOOLEAN DEFAULT false,
    team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- User Design Preferences
CREATE TABLE user_design_preferences (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    default_design_system_id UUID REFERENCES design_systems(id),
    default_framework VARCHAR(50) DEFAULT 'react',
    default_export_format VARCHAR(50) DEFAULT 'tsx',
    use_typescript BOOLEAN DEFAULT true,
    use_tailwind BOOLEAN DEFAULT true,
    preferences JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id)
);

-- ============================================================================
-- SECTION 6: REAL-TIME PRESENCE (Q2)
-- ============================================================================

-- User Presence
CREATE TABLE user_presence (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    status VARCHAR(50) DEFAULT 'online',
    last_seen_at TIMESTAMPTZ DEFAULT NOW(),
    cursor_x DECIMAL(10, 2),
    cursor_y DECIMAL(10, 2),
    current_view VARCHAR(100),
    UNIQUE(user_id, team_id, project_id)
);

-- ============================================================================
-- SECTION 7: API & BACKEND (Q3)
-- ============================================================================

-- API Endpoints
CREATE TABLE api_endpoints (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    path VARCHAR(500) NOT NULL,
    method VARCHAR(10) CHECK (method IN ('GET', 'POST', 'PUT', 'PATCH', 'DELETE')),
    description TEXT,
    request_schema JSONB DEFAULT '{}',
    response_schema JSONB DEFAULT '{}',
    authentication VARCHAR(50) DEFAULT 'none',
    rate_limit INTEGER DEFAULT 100,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Database Schemas
CREATE TABLE database_schemas (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50) DEFAULT 'postgresql',
    tables JSONB DEFAULT '[]',
    relationships JSONB DEFAULT '[]',
    migrations JSONB DEFAULT '[]',
    is_generated BOOLEAN DEFAULT false,
    generated_sql TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Database Tables
CREATE TABLE database_tables (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    schema_id UUID NOT NULL REFERENCES database_schemas(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    columns JSONB DEFAULT '[]',
    indexes JSONB DEFAULT '[]',
    constraints JSONB DEFAULT '[]',
    row_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- API Keys
CREATE TABLE api_keys (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    key_hash TEXT NOT NULL,
    key_prefix TEXT NOT NULL,
    permissions JSONB DEFAULT '["read"]',
    rate_limit INTEGER DEFAULT 1000,
    last_used_at TIMESTAMPTZ,
    expires_at TIMESTAMPTZ,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- API Usage Logs
CREATE TABLE api_usage_logs (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    api_key_id UUID REFERENCES api_keys(id) ON DELETE SET NULL,
    endpoint_id UUID REFERENCES api_endpoints(id) ON DELETE SET NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    method VARCHAR(10) NOT NULL,
    path TEXT NOT NULL,
    status_code INTEGER,
    response_time_ms INTEGER,
    ip_address INET,
    user_agent TEXT,
    request_body JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Backend Templates
CREATE TABLE backend_templates (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    framework VARCHAR(50) NOT NULL,
    language VARCHAR(50) NOT NULL,
    template_code TEXT NOT NULL,
    dependencies JSONB DEFAULT '[]',
    dev_dependencies JSONB DEFAULT '[]',
    config_files JSONB DEFAULT '{}',
    is_default BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Mobile App Exports
CREATE TABLE mobile_app_exports (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    platform VARCHAR(50) NOT NULL,
    framework VARCHAR(50) NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',
    export_url TEXT,
    file_size BIGINT,
    build_logs TEXT,
    config JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ
);

-- Webhooks
CREATE TABLE webhooks (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    url TEXT NOT NULL,
    secret TEXT,
    events JSONB DEFAULT '[]',
    is_active BOOLEAN DEFAULT true,
    last_triggered_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Webhook Deliveries
CREATE TABLE webhook_deliveries (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    webhook_id UUID NOT NULL REFERENCES webhooks(id) ON DELETE CASCADE,
    event_type VARCHAR(100) NOT NULL,
    payload JSONB NOT NULL,
    response_status INTEGER,
    response_body TEXT,
    delivery_status VARCHAR(50) DEFAULT 'pending',
    retry_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Integrations
CREATE TABLE integrations (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    provider VARCHAR(100) NOT NULL,
    name VARCHAR(255) NOT NULL,
    config JSONB DEFAULT '{}',
    credentials_encrypted TEXT,
    is_active BOOLEAN DEFAULT true,
    last_sync_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- SECTION 8: INDEXES
-- ============================================================================

-- Base Tables
CREATE INDEX idx_projects_user ON projects(user_id);
CREATE INDEX idx_projects_created ON projects(created_at);

-- Q1
CREATE INDEX idx_project_versions_project ON project_versions(project_id);
CREATE INDEX idx_project_versions_created ON project_versions(created_at);

-- Q2
CREATE INDEX idx_teams_owner ON teams(owner_id);
CREATE INDEX idx_team_members_team ON team_members(team_id);
CREATE INDEX idx_team_members_user ON team_members(user_id);
CREATE INDEX idx_project_shares_project ON project_shares(project_id);
CREATE INDEX idx_comments_project ON comments(project_id);
CREATE INDEX idx_comments_user ON comments(user_id);
CREATE INDEX idx_activities_team ON activities(team_id);
CREATE INDEX idx_activities_project ON activities(project_id);
CREATE INDEX idx_user_presence_team ON user_presence(team_id);
CREATE INDEX idx_user_presence_project ON user_presence(project_id);

-- Q3
CREATE INDEX idx_api_endpoints_project ON api_endpoints(project_id);
CREATE INDEX idx_database_schemas_project ON database_schemas(project_id);
CREATE INDEX idx_api_keys_user ON api_keys(user_id);
CREATE INDEX idx_api_usage_keys ON api_usage_logs(api_key_id);
CREATE INDEX idx_api_usage_created ON api_usage_logs(created_at);
CREATE INDEX idx_webhooks_project ON webhooks(project_id);
CREATE INDEX idx_webhook_deliveries_webhook ON webhook_deliveries(webhook_id);

-- ============================================================================
-- SECTION 9: ROW LEVEL SECURITY (RLS)
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_shares ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE comment_reactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE design_systems ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_design_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_presence ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_endpoints ENABLE ROW LEVEL SECURITY;
ALTER TABLE database_schemas ENABLE ROW LEVEL SECURITY;
ALTER TABLE database_tables ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_usage_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE backend_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE mobile_app_exports ENABLE ROW LEVEL SECURITY;
ALTER TABLE webhooks ENABLE ROW LEVEL SECURITY;
ALTER TABLE webhook_deliveries ENABLE ROW LEVEL SECURITY;
ALTER TABLE integrations ENABLE ROW LEVEL SECURITY;

-- Profiles Policies
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (id = auth.uid());
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (id = auth.uid());
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (id = auth.uid());

-- Projects Policies
CREATE POLICY "Users can view own projects" ON projects FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can create projects" ON projects FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users can update own projects" ON projects FOR UPDATE USING (user_id = auth.uid());
CREATE POLICY "Users can delete own projects" ON projects FOR DELETE USING (user_id = auth.uid());

-- Project Versions Policies
CREATE POLICY "Users can view versions" ON project_versions FOR SELECT USING (
    EXISTS (SELECT 1 FROM projects WHERE projects.id = project_versions.project_id AND projects.user_id = auth.uid())
);

-- Teams Policies
CREATE POLICY "Team members can view team" ON teams FOR SELECT USING (
    EXISTS (SELECT 1 FROM team_members WHERE team_members.team_id = teams.id AND team_members.user_id = auth.uid() AND team_members.status = 'active')
    OR owner_id = auth.uid()
);
CREATE POLICY "Owners can update team" ON teams FOR UPDATE USING (owner_id = auth.uid());

-- Team Members Policies
CREATE POLICY "Team members can view members" ON team_members FOR SELECT USING (
    EXISTS (SELECT 1 FROM team_members tm WHERE tm.team_id = team_members.team_id AND tm.user_id = auth.uid())
);

-- Comments Policies
CREATE POLICY "Users can view comments" ON comments FOR SELECT USING (
    EXISTS (SELECT 1 FROM projects WHERE projects.id = comments.project_id AND projects.user_id = auth.uid())
);
CREATE POLICY "Users can create comments" ON comments FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users can update own comments" ON comments FOR UPDATE USING (user_id = auth.uid());
CREATE POLICY "Users can delete own comments" ON comments FOR DELETE USING (user_id = auth.uid());

-- API Keys Policies
CREATE POLICY "Users can manage API keys" ON api_keys FOR ALL USING (user_id = auth.uid());

-- ============================================================================
-- SECTION 10: HELPER FUNCTIONS
-- ============================================================================

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Generate team slug
CREATE OR REPLACE FUNCTION generate_team_slug(input_name TEXT)
RETURNS TEXT AS $$
DECLARE
    base_slug TEXT;
    new_slug TEXT;
    counter INTEGER := 0;
BEGIN
    base_slug := lower(regexp_replace(input_name, '[^a-zA-Z0-9]+', '-', 'g'));
    new_slug := base_slug;
    WHILE EXISTS (SELECT 1 FROM teams WHERE slug = new_slug) LOOP
        counter := counter + 1;
        new_slug := base_slug || '-' || counter;
    END LOOP;
    RETURN new_slug;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- SECTION 11: TRIGGERS
-- ============================================================================

CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_teams_updated_at BEFORE UPDATE ON teams
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_comments_updated_at BEFORE UPDATE ON comments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_design_systems_updated_at BEFORE UPDATE ON design_systems
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_prefs_updated_at BEFORE UPDATE ON user_design_preferences
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_api_endpoints_updated_at BEFORE UPDATE ON api_endpoints
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_db_schemas_updated_at BEFORE UPDATE ON database_schemas
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_db_tables_updated_at BEFORE UPDATE ON database_tables
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Auto-create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name, avatar_url)
    VALUES (
        NEW.id,
        NEW.email,
        NEW.raw_user_meta_data->>'full_name',
        NEW.raw_user_meta_data->>'avatar_url'
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================================
-- SECTION 12: SEED DATA (Optional)
-- ============================================================================

-- Backend Templates
INSERT INTO backend_templates (name, framework, language, template_code, dependencies, is_default) VALUES
('Express.js + TypeScript', 'express', 'typescript', 'import express from ''express'';
import cors from ''cors'';
import dotenv from ''dotenv'';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get(''/api/health'', (req, res) => {
    res.json({ status: ''ok'', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));', '["express", "cors", "dotenv"]', true),
('FastAPI + Python', 'fastapi', 'python', 'from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/health")
async def health_check():
    return {"status": "ok", "timestamp": datetime.now().isoformat()}', '["fastapi", "uvicorn"]', false),
('NestJS + TypeScript', 'nestjs', 'typescript', '@Controller()
export class AppController {
  @Get(''health'')
  getHealth(): string {
    return ''OK'';
  }
}', '["@nestjs/core", "@nestjs/common"]', false);

-- Design Systems
INSERT INTO design_systems (name, slug, framework, library, config, is_default) VALUES
('Material-UI (React)', 'mui-react', 'react', 'mui', '{"theme": {"palette": {"primary": {"main": "#1976d2"}}}}', true),
('Chakra UI (React)', 'chakra-react', 'react', 'chakra', '{"theme": {"config": {"initialColorMode": "light"}}}', false),
('Tailwind CSS', 'tailwind-css', 'react', 'tailwind', '{"plugins": ["@tailwindcss/forms", "@tailwindcss/typography"]}', false),
('Ant Design', 'antd-react', 'react', 'antd', '{"theme": {"token": {"colorPrimary": "#1890ff"}}}', false),
('Shadcn UI', 'shadcn-react', 'react', 'shadcn', '{"baseColor": "slate"}', false);

-- ============================================================================
-- SECTION 13: REALTIME (Optional)
-- ============================================================================

DO $$
DECLARE
    tbl TEXT;
BEGIN
    FOR tbl IN 
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name IN ('projects', 'comments', 'activities', 'user_presence', 'project_versions', 'api_keys', 'webhooks')
    LOOP
        EXECUTE format('ALTER PUBLICATION supabase_realtime ADD TABLE %I', tbl);
    END LOOP;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- ============================================================================
-- SECTION 14: VERIFICATION
-- ============================================================================

-- List all created tables
SELECT 
    table_name,
    (SELECT COUNT(*) FROM information_schema.columns WHERE table_name = t.table_name) AS column_count
FROM information_schema.tables t
WHERE table_schema = 'public' 
AND table_name NOT LIKE 'pg_%'
AND table_name NOT LIKE 'sql_%'
ORDER BY table_name;

-- ============================================================================
-- SCHEMA COMPLETE!
-- ============================================================================
-- Total Tables: 25
-- Features:
--   Q1: Projects, Project Versions
--   Q2: Teams, Comments, Design Systems, Presence
--   Q3: API Endpoints, Database Schemas, API Keys, Webhooks, Mobile Exports
-- ============================================================================
