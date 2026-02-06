# 🗄️ Setup Database Supabase untuk NOIR AI

Panduan lengkap untuk setup database Supabase untuk proyek NOIR AI.

---

## 📋 Prasyarat

- [x] Akun Supabase (gratis di [supabase.com](https://supabase.com))
- [x] Project Supabase sudah dibuat

---

## 🚀 Cara Setup (3 Langkah Mudah)

### Langkah 1: Buat Project Supabase

1. Login ke [Supabase Dashboard](https://app.supabase.com)
2. Klik **"New Project"**
3. Isi form:
   - **Name:** `noir-ai`
   - **Database Password:** (buat password kuat, simpan!)
   - **Region:** Pilih terdekat (Singapore)
   - **Plan:** Free tier
4. Klik **"Create new project"**
5. Tunggu 1-2 menit hingga project siap

---

### Langkah 2: Copy & Run SQL Script

1. Di Supabase Dashboard, klik **"SQL Editor"** di sidebar kiri
2. Klik tombol **"New Query"**
3. **Copy seluruh SQL script di bawah ini**
4. **Paste** ke SQL Editor
5. Klik tombol **"Run"** (atau tekan `Ctrl + Enter`)

---

## 📝 SQL Script Lengkap

Copy ini dan paste ke SQL Editor:

```sql
-- ============================================================================
-- NOIR AI - Complete Supabase Schema
-- ============================================================================

-- Enable Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================================
-- BASE TABLES
-- ============================================================================

-- Projects table
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

-- Project versions
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
-- TEAM COLLABORATION TABLES
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
    role VARCHAR(50) NOT NULL DEFAULT 'member',
    invited_by UUID REFERENCES auth.users(id),
    invited_email VARCHAR(255),
    status VARCHAR(50) DEFAULT 'active',
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
    permission VARCHAR(50) NOT NULL DEFAULT 'view',
    share_type VARCHAR(50) NOT NULL DEFAULT 'user',
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

-- Comment reactions
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

-- ============================================================================
-- Q3 TABLES (Backend Integration & API)
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

-- ============================================================================
-- WAITLIST TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS waitlist (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(255),
    email VARCHAR(255) UNIQUE NOT NULL,
    date VARCHAR(50),
    time VARCHAR(50),
    status VARCHAR(50) DEFAULT 'pending',
    score INTEGER,
    source VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_waitlist_email ON waitlist(email);
CREATE INDEX IF NOT EXISTS idx_waitlist_status ON waitlist(status);
CREATE INDEX IF NOT EXISTS idx_waitlist_created ON waitlist(created_at);

ALTER TABLE waitlist ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow anonymous to join waitlist"
    ON waitlist FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Allow authenticated to view waitlist"
    ON waitlist FOR SELECT
    USING (true);

CREATE POLICY "Allow delete on waitlist"
    ON waitlist FOR DELETE
    USING (true);

-- ============================================================================
-- INDEXES
-- ============================================================================

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
CREATE INDEX IF NOT EXISTS idx_api_endpoints_project ON api_endpoints(project_id);
CREATE INDEX IF NOT EXISTS idx_database_schemas_project ON database_schemas(project_id);
CREATE INDEX IF NOT EXISTS idx_api_keys_user ON api_keys(user_id);
CREATE INDEX IF NOT EXISTS idx_api_usage_logs_key ON api_usage_logs(api_key_id);
CREATE INDEX IF NOT EXISTS idx_api_usage_logs_created ON api_usage_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_webhooks_project ON webhooks(project_id);
CREATE INDEX IF NOT EXISTS idx_webhook_deliveries_webhook ON webhook_deliveries(webhook_id);

-- ============================================================================
-- ENABLE RLS
-- ============================================================================

ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_shares ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE comment_reactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_presence ENABLE ROW LEVEL SECURITY;
ALTER TABLE design_systems ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_design_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_endpoints ENABLE ROW LEVEL SECURITY;
ALTER TABLE database_schemas ENABLE ROW LEVEL SECURITY;
ALTER TABLE database_tables ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_usage_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE mobile_app_exports ENABLE ROW LEVEL SECURITY;
ALTER TABLE webhooks ENABLE ROW LEVEL SECURITY;
ALTER TABLE webhook_deliveries ENABLE ROW LEVEL SECURITY;
ALTER TABLE integrations ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- RLS POLICIES
-- ============================================================================

-- Teams policies
DROP POLICY IF EXISTS "Team members can view team" ON teams;
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

DROP POLICY IF EXISTS "Users can create teams" ON teams;
CREATE POLICY "Users can create teams"
    ON teams FOR INSERT
    WITH CHECK (owner_id = auth.uid());

DROP POLICY IF EXISTS "Only owner can update team" ON teams;
CREATE POLICY "Only owner can update team"
    ON teams FOR UPDATE
    USING (owner_id = auth.uid());

DROP POLICY IF EXISTS "Only owner can delete team" ON teams;
CREATE POLICY "Only owner can delete team"
    ON teams FOR DELETE
    USING (owner_id = auth.uid());

-- Team members policies
DROP POLICY IF EXISTS "Team members can view other members" ON team_members;
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

DROP POLICY IF EXISTS "Users can add team members" ON team_members;
CREATE POLICY "Users can add team members"
    ON team_members FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM teams
            WHERE teams.id = team_members.team_id
            AND teams.owner_id = auth.uid()
        )
    );

DROP POLICY IF EXISTS "Team owners can update members" ON team_members;
CREATE POLICY "Team owners can update members"
    ON team_members FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM teams
            WHERE teams.id = team_members.team_id
            AND teams.owner_id = auth.uid()
        )
    );

DROP POLICY IF EXISTS "Team owners can remove members" ON team_members;
CREATE POLICY "Team owners can remove members"
    ON team_members FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM teams
            WHERE teams.id = team_members.team_id
            AND teams.owner_id = auth.uid()
        )
    );

DROP POLICY IF EXISTS "Users can update own team membership" ON team_members;
CREATE POLICY "Users can update own team membership"
    ON team_members FOR UPDATE
    USING (user_id = auth.uid());

-- Project shares policies
DROP POLICY IF EXISTS "Users can create project shares" ON project_shares;
CREATE POLICY "Users can create project shares"
    ON project_shares FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM projects
            WHERE projects.id = project_shares.project_id
            AND projects.user_id = auth.uid()
        )
        OR
        shared_by = auth.uid()
    );

DROP POLICY IF EXISTS "Users can update own project shares" ON project_shares;
CREATE POLICY "Users can update own project shares"
    ON project_shares FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM projects
            WHERE projects.id = project_shares.project_id
            AND projects.user_id = auth.uid()
        )
    );

DROP POLICY IF EXISTS "Users can delete own project shares" ON project_shares;
CREATE POLICY "Users can delete own project shares"
    ON project_shares FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM projects
            WHERE projects.id = project_shares.project_id
            AND projects.user_id = auth.uid()
        )
    );

-- Comments policies
DROP POLICY IF EXISTS "Comments viewable by project members" ON comments;
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

DROP POLICY IF EXISTS "Users can create comments" ON comments;
CREATE POLICY "Users can create comments"
    ON comments FOR INSERT
    WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can update own comments" ON comments;
CREATE POLICY "Users can update own comments"
    ON comments FOR UPDATE
    USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can delete own comments" ON comments;
CREATE POLICY "Users can delete own comments"
    ON comments FOR DELETE
    USING (user_id = auth.uid());

-- Comment reactions policies
DROP POLICY IF EXISTS "Users can view reactions" ON comment_reactions;
CREATE POLICY "Users can view reactions"
    ON comment_reactions FOR SELECT
    USING (true);

DROP POLICY IF EXISTS "Users can create reactions" ON comment_reactions;
CREATE POLICY "Users can create reactions"
    ON comment_reactions FOR INSERT
    WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can delete own reactions" ON comment_reactions;
CREATE POLICY "Users can delete own reactions"
    ON comment_reactions FOR DELETE
    USING (user_id = auth.uid());

-- Activities policies
DROP POLICY IF EXISTS "Users can view team activities" ON activities;
CREATE POLICY "Users can view team activities"
    ON activities FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM team_members
            WHERE team_members.team_id = activities.team_id
            AND team_members.user_id = auth.uid()
        )
    );

DROP POLICY IF EXISTS "Users can log activity" ON activities;
CREATE POLICY "Users can log activity"
    ON activities FOR INSERT
    WITH CHECK (user_id = auth.uid());

-- User presence policies
DROP POLICY IF EXISTS "Users can view presence" ON user_presence;
CREATE POLICY "Users can view presence"
    ON user_presence FOR SELECT
    USING (true);

DROP POLICY IF EXISTS "Users can insert own presence" ON user_presence;
CREATE POLICY "Users can insert own presence"
    ON user_presence FOR INSERT
    WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can update own presence" ON user_presence;
CREATE POLICY "Users can update own presence"
    ON user_presence FOR UPDATE
    USING (user_id = auth.uid());

-- Design systems policies
DROP POLICY IF EXISTS "Users can view default design systems" ON design_systems;
CREATE POLICY "Users can view default design systems"
    ON design_systems FOR SELECT
    USING (is_default = true
        OR EXISTS (
            SELECT 1 FROM team_members
            WHERE team_members.team_id = design_systems.team_id
            AND team_members.user_id = auth.uid()
        )
    );

DROP POLICY IF EXISTS "Team can create design systems" ON design_systems;
CREATE POLICY "Team can create design systems"
    ON design_systems FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM teams
            WHERE teams.id = design_systems.team_id
            AND teams.owner_id = auth.uid()
        )
    );

-- User design preferences policies
DROP POLICY IF EXISTS "Users can view own preferences" ON user_design_preferences;
CREATE POLICY "Users can view own preferences"
    ON user_design_preferences FOR SELECT
    USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can create own preferences" ON user_design_preferences;
CREATE POLICY "Users can create own preferences"
    ON user_design_preferences FOR INSERT
    WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can update own preferences" ON user_design_preferences;
CREATE POLICY "Users can update own preferences"
    ON user_design_preferences FOR UPDATE
    USING (user_id = auth.uid());

-- API endpoints policies
DROP POLICY IF EXISTS "Project members can view API endpoints" ON api_endpoints;
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

DROP POLICY IF EXISTS "Users can manage API endpoints" ON api_endpoints;
CREATE POLICY "Users can manage API endpoints"
    ON api_endpoints FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM projects
            WHERE projects.id = api_endpoints.project_id
            AND projects.user_id = auth.uid()
        )
    );

-- API keys policies
DROP POLICY IF EXISTS "Users can view own API keys" ON api_keys;
CREATE POLICY "Users can view own API keys"
    ON api_keys FOR SELECT
    USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can manage own API keys" ON api_keys;
CREATE POLICY "Users can manage own API keys"
    ON api_keys FOR ALL
    USING (user_id = auth.uid());

-- Webhooks policies
DROP POLICY IF EXISTS "Users can view own webhooks" ON webhooks;
CREATE POLICY "Users can view own webhooks"
    ON webhooks FOR SELECT
    USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can manage own webhooks" ON webhooks;
CREATE POLICY "Users can manage own webhooks"
    ON webhooks FOR ALL
    USING (user_id = auth.uid());

-- Integrations policies
DROP POLICY IF EXISTS "Users can view own integrations" ON integrations;
CREATE POLICY "Users can view own integrations"
    ON integrations FOR SELECT
    USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can manage own integrations" ON integrations;
CREATE POLICY "Users can manage own integrations"
    ON integrations FOR ALL
    USING (user_id = auth.uid());

-- ============================================================================
-- FUNCTIONS & TRIGGERS
-- ============================================================================

DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Drop existing triggers
DROP TRIGGER IF EXISTS update_teams_updated_at ON teams;
DROP TRIGGER IF EXISTS update_team_members_updated_at ON team_members;
DROP TRIGGER IF EXISTS update_comments_updated_at ON comments;
DROP TRIGGER IF EXISTS update_design_systems_updated_at ON design_systems;
DROP TRIGGER IF EXISTS update_user_design_preferences_updated_at ON user_design_preferences;
DROP TRIGGER IF EXISTS update_api_endpoints_updated_at ON api_endpoints;
DROP TRIGGER IF EXISTS update_database_schemas_updated_at ON database_schemas;
DROP TRIGGER IF EXISTS update_database_tables_updated_at ON database_tables;

-- Create triggers
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

app.get(''/api/health'', (req, res) => {
    res.json({ status: ''ok'', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});',
    '["express", "cors", "dotenv", "@types/express", "@types/cors", "typescript", "ts-node"]',
    true
)
ON CONFLICT DO NOTHING;

-- Insert default design systems
INSERT INTO design_systems (name, slug, framework, library, config, is_default) VALUES
(
    'Material-UI (React)',
    'mui-react',
    'react',
    'mui',
    '{"theme": {"palette": {"primary": {"main": "#1976d2"}}}}',
    true
)
ON CONFLICT DO NOTHING;

-- ============================================================================
-- REALTIME CONFIGURATION
-- ============================================================================

DO $$
BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE project_versions;
    ALTER PUBLICATION supabase_realtime ADD TABLE teams;
    ALTER PUBLICATION supabase_realtime ADD TABLE team_members;
    ALTER PUBLICATION supabase_realtime ADD TABLE project_shares;
    ALTER PUBLICATION supabase_realtime ADD TABLE comments;
    ALTER PUBLICATION supabase_realtime ADD TABLE activities;
    ALTER PUBLICATION supabase_realtime ADD TABLE user_presence;
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
-- GRANTS
-- ============================================================================

GRANT USAGE ON SCHEMA public TO anon, authenticated;
```

---

### Langkah 3: Copy Environment Variables

1. Di Supabase Dashboard, klik **"Settings"** → **"API"**
2. Copy nilai berikut:

**Required Values:**
- **Project URL:** `https://xxx.supabase.co`
- **anon/public Key:** `eyJxxx...` (yang panjang)

3. Buka file `.env` di root project Anda
4. Update dengan nilai dari Supabase:

```env
# Supabase Configuration
SUPABASE_URL=your-project-url-here
SUPABASE_ANON_KEY=your-anon-key-here
VITE_SUPABASE_URL=your-project-url-here
VITE_SUPABASE_ANON_KEY=your-anon-key-here

# Other API Keys
SUMOPOD_API_KEY=your-sumopod-key
RESEND_API_KEY=your-resend-key
```

---

## ✅ Verifikasi Setup

Setelah menjalankan SQL script, cek di Supabase Dashboard:

1. Klik **"Table Editor"**
2. Pastikan semua tabel ini ada:
   - ✅ `projects`
   - ✅ `project_versions`
   - ✅ `teams`
   - ✅ `team_members`
   - ✅ `project_shares`
   - ✅ `comments`
   - ✅ `activities`
   - ✅ `waitlist`
   - Dan lainnya...

3. Klik **"Authentication"** → **"Providers"**
4. Pastikan **Email** provider sudah aktif

---

## 🐛 Troubleshooting

### Error: "new row violates row-level security policy"

**Solusi:**
- Pastikan sudah menjalankan full SQL script di atas
- Pastikan user sudah login di frontend sebelum mencoba create data

### Error: "permission denied for table"

**Solusi:**
- Check apakah RLS sudah di-enable
- Pastikan policies sudah dibuat untuk semua tabel

### Error: "relation does not exist"

**Solusi:**
- Pastikan SQL script sudah dijalankan sampai selesai
- Check di SQL Editor apakah ada error message

---

## 📊 Database Schema Summary

| Kategori | Tabel | Jumlah |
|----------|-------|--------|
| Base | `projects` | 1 |
| Q1 | `project_versions` | 1 |
| Q2 | `teams`, `team_members`, `project_shares`, `comments`, `comment_reactions`, `activities`, `user_presence`, `design_systems`, `user_design_preferences` | 9 |
| Q3 | `api_endpoints`, `database_schemas`, `database_tables`, `api_keys`, `api_usage_logs`, `backend_templates`, `mobile_app_exports`, `webhooks`, `webhook_deliveries`, `integrations` | 10 |
| Other | `waitlist` | 1 |
| **Total** | | **21** |

---

## 🔗 Useful Links

- [Supabase Dashboard](https://app.supabase.com)
- [Supabase Auth Docs](https://supabase.com/docs/guides/auth)
- [Supabase RLS Docs](https://supabase.com/docs/guides/auth/row-level-security)
- [Supabase Realtime Docs](https://supabase.com/docs/guides/realtime)

---

## 💡 Tips

1. **Backup Database:** Secara export schema dari SQL Editor sebelum mengubah apapun
2. **Test Policies:** Gunakan Supabase Auth untuk test apakah RLS policies bekerja dengan benar
3. **Monitor Logs:** Cek **Database Logs** di Supabase Dashboard untuk troubleshooting

---

**Dokumentasi ini dibuat untuk mempermudah setup database NOIR AI.**
