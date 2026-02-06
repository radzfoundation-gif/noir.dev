-- ============================================================================
-- FIX: Projects Table 500 Error
-- Version: 1.0.0
-- Created: 2026-02-05
-- Description: Fix RLS policies causing 500 error on projects table
-- ============================================================================

-- ============================================================================
-- STEP 1: DROP ALL EXISTING PROJECTS POLICIES
-- ============================================================================

DROP POLICY IF EXISTS "Users can view own projects" ON projects;
DROP POLICY IF EXISTS "Users can create projects" ON projects;
DROP POLICY IF EXISTS "Users can update own projects" ON projects;
DROP POLICY IF EXISTS "Users can delete own projects" ON projects;
DROP POLICY IF EXISTS "Access projects by user_id or team" ON projects;
DROP POLICY IF EXISTS "projects_select_own" ON projects;
DROP POLICY IF EXISTS "projects_insert_own" ON projects;
DROP POLICY IF EXISTS "projects_update_own" ON projects;
DROP POLICY IF EXISTS "projects_delete_own" ON projects;

-- ============================================================================
-- STEP 2: DROP ALL TEAM-RELATED POLICIES (CAUSE OF RECURSION)
-- ============================================================================

-- Drop ALL teams policies (including new names)
DROP POLICY IF EXISTS "Team members can view team" ON teams;
DROP POLICY IF EXISTS "Users can create teams" ON teams;
DROP POLICY IF EXISTS "Only owner can update team" ON teams;
DROP POLICY IF EXISTS "Only owner can delete team" ON teams;
DROP POLICY IF EXISTS "Users can view their own teams" ON teams;
DROP POLICY IF EXISTS "teams_select_own_or_member" ON teams;
DROP POLICY IF EXISTS "teams_insert_owner" ON teams;
DROP POLICY IF EXISTS "teams_update_owner" ON teams;
DROP POLICY IF EXISTS "teams_delete_owner" ON teams;
DROP POLICY IF EXISTS "teams_select_owner" ON teams;

-- Drop ALL team_members policies
DROP POLICY IF EXISTS "Team members can view other members" ON team_members;
DROP POLICY IF EXISTS "Users can add team members" ON team_members;
DROP POLICY IF EXISTS "Team owners can update members" ON team_members;
DROP POLICY IF EXISTS "Team owners can remove members" ON team_members;
DROP POLICY IF EXISTS "Users can update team members" ON team_members;
DROP POLICY IF EXISTS "Users can remove team members" ON team_members;
DROP POLICY IF EXISTS "Users can view their team memberships" ON team_members;
DROP POLICY IF EXISTS "Users can insert their own membership" ON team_members;
DROP POLICY IF EXISTS "Users can delete own membership" ON team_members;
DROP POLICY IF EXISTS "team_members_select_own_or_member" ON team_members;
DROP POLICY IF EXISTS "team_members_insert_owner_or_self" ON team_members;
DROP POLICY IF EXISTS "team_members_update_owner_or_self" ON team_members;
DROP POLICY IF EXISTS "team_members_delete_owner_or_self" ON team_members;
DROP POLICY IF EXISTS "team_members_select_self" ON team_members;
DROP POLICY IF EXISTS "team_members_insert_self" ON team_members;
DROP POLICY IF EXISTS "team_members_update_self" ON team_members;
DROP POLICY IF EXISTS "team_members_delete_self" ON team_members;

-- ============================================================================
-- STEP 3: CREATE SIMPLE PROJECTS POLICIES (NO TEAM DEPENDENCY)
-- ============================================================================

-- SELECT: Users can view their own projects
CREATE POLICY "projects_select_own"
    ON projects FOR SELECT
    USING (user_id = auth.uid());

-- INSERT: Users can create projects
CREATE POLICY "projects_insert_own"
    ON projects FOR INSERT
    WITH CHECK (user_id = auth.uid());

-- UPDATE: Users can update their own projects
CREATE POLICY "projects_update_own"
    ON projects FOR UPDATE
    USING (user_id = auth.uid());

-- DELETE: Users can delete their own projects
CREATE POLICY "projects_delete_own"
    ON projects FOR DELETE
    USING (user_id = auth.uid());

-- ============================================================================
-- STEP 4: CREATE SIMPLE TEAMS POLICIES (NO RECURSION)
-- ============================================================================

-- SELECT: Users can view teams they own
CREATE POLICY "teams_select_owner"
    ON teams FOR SELECT
    USING (owner_id = auth.uid());

-- INSERT: Users can create teams
CREATE POLICY "teams_insert_owner"
    ON teams FOR INSERT
    WITH CHECK (owner_id = auth.uid());

-- UPDATE: Team owners can update
CREATE POLICY "teams_update_owner"
    ON teams FOR UPDATE
    USING (owner_id = auth.uid());

-- DELETE: Team owners can delete
CREATE POLICY "teams_delete_owner"
    ON teams FOR DELETE
    USING (owner_id = auth.uid());

-- ============================================================================
-- STEP 5: CREATE SIMPLE TEAM_MEMBERS POLICIES (NO RECURSION)
-- ============================================================================

-- SELECT: Users can view their own memberships
CREATE POLICY "team_members_select_self"
    ON team_members FOR SELECT
    USING (user_id = auth.uid());

-- INSERT: Users can add themselves or team owner can add
CREATE POLICY "team_members_insert_self"
    ON team_members FOR INSERT
    WITH CHECK (
        user_id = auth.uid()
        OR
        EXISTS (
            SELECT 1 FROM teams t
            WHERE t.id = team_members.team_id
            AND t.owner_id = auth.uid()
        )
    );

-- UPDATE: Users can update their own membership
CREATE POLICY "team_members_update_self"
    ON team_members FOR UPDATE
    USING (
        user_id = auth.uid()
        OR
        EXISTS (
            SELECT 1 FROM teams t
            WHERE t.id = team_members.team_id
            AND t.owner_id = auth.uid()
        )
    );

-- DELETE: Users can delete their own membership
CREATE POLICY "team_members_delete_self"
    ON team_members FOR DELETE
    USING (
        user_id = auth.uid()
        OR
        EXISTS (
            SELECT 1 FROM teams t
            WHERE t.id = team_members.team_id
            AND t.owner_id = auth.uid()
        )
    );

-- ============================================================================
-- STEP 6: VERIFY TABLES HAVE RLS ENABLED
-- ============================================================================

ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- STEP 7: VERIFY FIX
-- ============================================================================

-- List all policies
SELECT tablename, policyname, cmd
FROM pg_policies
WHERE tablename IN ('projects', 'teams', 'team_members')
ORDER BY tablename, policyname;

-- ============================================================================
-- STEP 8: FIX PROJECT_SHARES POLICIES (403 Forbidden Fix)
-- ============================================================================

-- Drop all existing project_shares policies
DROP POLICY IF EXISTS "Users can create project shares" ON project_shares;
DROP POLICY IF EXISTS "Users can view project shares" ON project_shares;
DROP POLICY IF EXISTS "Users can update own project shares" ON project_shares;
DROP POLICY IF EXISTS "Users can delete own project shares" ON project_shares;
DROP POLICY IF EXISTS "project_shares_select" ON project_shares;
DROP POLICY IF EXISTS "project_shares_insert" ON project_shares;
DROP POLICY IF EXISTS "project_shares_update" ON project_shares;
DROP POLICY IF EXISTS "project_shares_delete" ON project_shares;

-- Enable RLS
ALTER TABLE project_shares ENABLE ROW LEVEL SECURITY;

-- SELECT: Users can view shares for their projects or shares given to them
CREATE POLICY "project_shares_select"
    ON project_shares FOR SELECT
    USING (
        shared_by = auth.uid()
        OR shared_with = auth.uid()
        OR EXISTS (
            SELECT 1 FROM projects
            WHERE projects.id = project_shares.project_id
            AND projects.user_id = auth.uid()
        )
    );

-- INSERT: Users can create shares for their own projects
CREATE POLICY "project_shares_insert"
    ON project_shares FOR INSERT
    WITH CHECK (
        shared_by = auth.uid()
        OR EXISTS (
            SELECT 1 FROM projects
            WHERE projects.id = project_shares.project_id
            AND projects.user_id = auth.uid()
        )
    );

-- UPDATE: Project owners can update shares
CREATE POLICY "project_shares_update"
    ON project_shares FOR UPDATE
    USING (
        shared_by = auth.uid()
        OR EXISTS (
            SELECT 1 FROM projects
            WHERE projects.id = project_shares.project_id
            AND projects.user_id = auth.uid()
        )
    );

-- DELETE: Project owners can delete shares
CREATE POLICY "project_shares_delete"
    ON project_shares FOR DELETE
    USING (
        shared_by = auth.uid()
        OR EXISTS (
            SELECT 1 FROM projects
            WHERE projects.id = project_shares.project_id
            AND projects.user_id = auth.uid()
        )
    );

-- ============================================================================
-- SUCCESS MESSAGE
-- ============================================================================

SELECT '✅ All policies fixed! Projects and shares should work now.' as status;
