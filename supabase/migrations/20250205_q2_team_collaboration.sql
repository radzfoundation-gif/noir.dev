-- Q2 2025: Team Collaboration & Design Systems Schema

-- ============================================
-- 1. TEAMS & WORKSPACES
-- ============================================

CREATE TABLE IF NOT EXISTS teams (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
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

CREATE TABLE IF NOT EXISTS team_members (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
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

-- ============================================
-- 2. PROJECT SHARING & PERMISSIONS
-- ============================================

CREATE TABLE IF NOT EXISTS project_shares (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    shared_by UUID NOT NULL REFERENCES auth.users(id),
    shared_with UUID REFERENCES auth.users(id), -- NULL if shared via link
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

-- ============================================
-- 3. COMMENTS & ANNOTATIONS
-- ============================================

CREATE TABLE IF NOT EXISTS comments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    parent_id UUID REFERENCES comments(id) ON DELETE CASCADE, -- for replies
    content TEXT NOT NULL,
    position_x DECIMAL(10, 2), -- for annotations on canvas
    position_y DECIMAL(10, 2),
    element_selector VARCHAR(500), -- CSS selector for element reference
    resolved BOOLEAN DEFAULT false,
    resolved_by UUID REFERENCES auth.users(id),
    resolved_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS comment_reactions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    comment_id UUID NOT NULL REFERENCES comments(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    reaction VARCHAR(50) NOT NULL, -- 👍, ❤️, 🎉, etc
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(comment_id, user_id, reaction)
);

-- ============================================
-- 4. ACTIVITY FEED
-- ============================================

CREATE TABLE IF NOT EXISTS activities (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id),
    action VARCHAR(100) NOT NULL, -- created, updated, deleted, commented, shared
    entity_type VARCHAR(50) NOT NULL, -- project, comment, team, etc
    entity_id UUID NOT NULL,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ============================================
-- 5. REAL-TIME PRESENCE
-- ============================================

CREATE TABLE IF NOT EXISTS user_presence (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    status VARCHAR(50) DEFAULT 'online', -- online, away, busy, offline
    last_seen_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    cursor_x DECIMAL(10, 2),
    cursor_y DECIMAL(10, 2),
    current_view VARCHAR(100), -- which page/section they're viewing
    UNIQUE(user_id, team_id, project_id)
);

-- ============================================
-- 6. DESIGN SYSTEM PRESETS
-- ============================================

CREATE TABLE IF NOT EXISTS design_systems (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    framework VARCHAR(50) NOT NULL, -- react, vue, angular
    library VARCHAR(100) NOT NULL, -- mui, chakra, antd, etc
    version VARCHAR(50),
    config JSONB NOT NULL DEFAULT '{}', -- theme config, component mappings
    is_default BOOLEAN DEFAULT false,
    team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS user_design_preferences (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
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

-- ============================================
-- INDEXES
-- ============================================

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

-- ============================================
-- ENABLE RLS
-- ============================================

ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_shares ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE comment_reactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_presence ENABLE ROW LEVEL SECURITY;
ALTER TABLE design_systems ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_design_preferences ENABLE ROW LEVEL SECURITY;

-- ============================================
-- RLS POLICIES
-- ============================================

-- Teams: Viewable by members
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

-- Teams: Only owner can update/delete
CREATE POLICY "Only owner can update team"
    ON teams FOR UPDATE
    USING (owner_id = auth.uid());

CREATE POLICY "Only owner can delete team"
    ON teams FOR DELETE
    USING (owner_id = auth.uid());

-- Team Members: Viewable by team members
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

-- Comments: Viewable by project collaborators
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

-- Enable realtime for all tables
alter publication supabase_realtime add table teams;
alter publication supabase_realtime add table team_members;
alter publication supabase_realtime add table project_shares;
alter publication supabase_realtime add table comments;
alter publication supabase_realtime add table activities;
alter publication supabase_realtime add table user_presence;
