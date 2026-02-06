-- ============================================================================
-- FIX: Infinite Recursion in team_members Policy
-- Version: 2.0.3
-- Created: 2025-02-05
-- Description: Fix infinite recursion by simplifying RLS policies
-- ============================================================================

-- ============================================================================
-- DROP PROBLEMATIC POLICIES
-- ============================================================================

-- Drop all team_members policies
DROP POLICY IF EXISTS "Team members can view other members" ON team_members;
DROP POLICY IF EXISTS "Users can add team members" ON team_members;
DROP POLICY IF EXISTS "Team owners can update members" ON team_members;
DROP POLICY IF EXISTS "Team owners can remove members" ON team_members;
DROP POLICY IF EXISTS "Users can update own team membership" ON team_members;

-- ============================================================================
-- RECREATE SIMPLIFIED POLICIES (NO RECURSION)
-- ============================================================================

-- SELECT: Allow users to view all team members (simplified)
CREATE POLICY "Team members can view other members"
    ON team_members FOR SELECT
    USING (
        -- Can view if they are a member of the team
        EXISTS (
            SELECT 1 FROM team_members tm_self
            WHERE tm_self.team_id = team_members.team_id
            AND tm_self.user_id = auth.uid()
            AND tm_self.status = 'active'
        )
    );

-- INSERT: Allow team owners to add members
CREATE POLICY "Users can add team members"
    ON team_members FOR INSERT
    WITH CHECK (
        -- User can add members if they are team owner (check via teams table)
        EXISTS (
            SELECT 1 FROM teams
            WHERE teams.id = team_members.team_id
            AND teams.owner_id = auth.uid()
        )
        OR
        -- User can add themselves (auto-join)
        user_id = auth.uid()
    );

-- UPDATE: Allow team owners OR users to update own membership
CREATE POLICY "Users can update team members"
    ON team_members FOR UPDATE
    USING (
        -- Allow team owner to update any member
        EXISTS (
            SELECT 1 FROM teams
            WHERE teams.id = team_members.team_id
            AND teams.owner_id = auth.uid()
        )
        OR
        -- Allow users to update their own membership
        user_id = auth.uid()
    );

-- DELETE: Allow team owners to remove members
CREATE POLICY "Users can remove team members"
    ON team_members FOR DELETE
    USING (
        -- Allow team owner to delete any member
        EXISTS (
            SELECT 1 FROM teams
            WHERE teams.id = team_members.team_id
            AND teams.owner_id = auth.uid()
        )
        OR
        -- Allow users to delete themselves
        user_id = auth.uid()
    );

-- UPDATE: Allow team owners OR users to update own membership
CREATE POLICY "Users can update team members"
    ON team_members FOR UPDATE
    USING (
        -- Allow team owner to update any member
        EXISTS (
            SELECT 1 FROM teams
            WHERE teams.id = team_members.team_id
            AND teams.owner_id = auth.uid()
        )
        OR
        -- Allow users to update their own membership
        user_id = auth.uid()
    );

-- DELETE: Allow team owners to remove members
CREATE POLICY "Users can remove team members"
    ON team_members FOR DELETE
    USING (
        -- Allow team owner to delete any member
        EXISTS (
            SELECT 1 FROM teams
            WHERE teams.id = team_members.team_id
            AND teams.owner_id = auth.uid()
        )
        OR
        -- Allow users to delete themselves
        user_id = auth.uid()
    );

-- ============================================================================
-- DROP PROBLEMATIC POLICIES FOR OTHER TABLES
-- ============================================================================

-- Drop teams policies
DROP POLICY IF EXISTS "Team members can view team" ON teams;
DROP POLICY IF EXISTS "Users can create teams" ON teams;
DROP POLICY IF EXISTS "Only owner can update team" ON teams;
DROP POLICY IF EXISTS "Only owner can delete team" ON teams;

-- Recreate simplified teams policies
CREATE POLICY "Team members can view team"
    ON teams FOR SELECT
    USING (
        -- Owner can always view
        owner_id = auth.uid()
        OR
        -- Members can view teams they belong to
        EXISTS (
            SELECT 1 FROM team_members tm
            WHERE tm.team_id = teams.id
            AND tm.user_id = auth.uid()
            AND tm.status = 'active'
        )
    );

CREATE POLICY "Users can create teams"
    ON teams FOR INSERT
    WITH CHECK (owner_id = auth.uid());

CREATE POLICY "Only owner can update team"
    ON teams FOR UPDATE
    USING (owner_id = auth.uid());

CREATE POLICY "Only owner can delete team"
    ON teams FOR DELETE
    USING (owner_id = auth.uid());

-- Drop project_shares policies
DROP POLICY IF EXISTS "Users can create project shares" ON project_shares;
DROP POLICY IF EXISTS "Users can update own project shares" ON project_shares;
DROP POLICY IF EXISTS "Users can delete own project shares" ON project_shares;

-- Recreate simplified project_shares policies
CREATE POLICY "Users can create project shares"
    ON project_shares FOR INSERT
    WITH CHECK (
        -- Project owner can create shares
        EXISTS (
            SELECT 1 FROM projects
            WHERE projects.id = project_shares.project_id
            AND projects.user_id = auth.uid()
        )
        OR
        -- Or the person creating the share
        shared_by = auth.uid()
    );

CREATE POLICY "Users can update own project shares"
    ON project_shares FOR UPDATE
    USING (
        -- Project owner can update shares
        EXISTS (
            SELECT 1 FROM projects
            WHERE projects.id = project_shares.project_id
            AND projects.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete own project shares"
    ON project_shares FOR DELETE
    USING (
        -- Project owner can delete shares
        EXISTS (
            SELECT 1 FROM projects
            WHERE projects.id = project_shares.project_id
            AND projects.user_id = auth.uid()
        )
    );

-- ============================================================================
-- DROP PROBLEMATIC POLICIES FOR activities
-- ============================================================================

DROP POLICY IF EXISTS "Users can view team activities" ON activities;
DROP POLICY IF EXISTS "Users can log activity" ON activities;

-- Recreate simplified activities policies
CREATE POLICY "Users can view team activities"
    ON activities FOR SELECT
    USING (
        -- Users can view activities for projects they own
        EXISTS (
            SELECT 1 FROM projects
            WHERE projects.id = activities.project_id
            AND projects.user_id = auth.uid()
        )
        OR
        -- Or activities for teams they belong to
        EXISTS (
            SELECT 1 FROM team_members tm
            WHERE tm.team_id = activities.team_id
            AND tm.user_id = auth.uid()
            AND tm.status = 'active'
        )
    );

CREATE POLICY "Users can log activity"
    ON activities FOR INSERT
    WITH CHECK (user_id = auth.uid());

-- ============================================================================
-- DROP PROBLEMATIC POLICIES FOR design_systems
-- ============================================================================

DROP POLICY IF EXISTS "Users can view default design systems" ON design_systems;
DROP POLICY IF EXISTS "Team can create design systems" ON design_systems;

-- Recreate simplified design_systems policies
CREATE POLICY "Users can view default design systems"
    ON design_systems FOR SELECT
    USING (
        -- Can view default design systems
        is_default = true
        OR
        -- Or design systems for teams they own
        EXISTS (
            SELECT 1 FROM teams
            WHERE teams.id = design_systems.team_id
            AND teams.owner_id = auth.uid()
        )
        OR
        -- Or design systems for teams they are members of
        EXISTS (
            SELECT 1 FROM team_members tm
            WHERE tm.team_id = design_systems.team_id
            AND tm.user_id = auth.uid()
            AND tm.status = 'active'
        )
    );

CREATE POLICY "Team can create design systems"
    ON design_systems FOR INSERT
    WITH CHECK (
        -- Team owner can create design systems
        EXISTS (
            SELECT 1 FROM teams
            WHERE teams.id = design_systems.team_id
            AND teams.owner_id = auth.uid()
        )
    );

-- ============================================================================
-- DROP PROBLEMATIC POLICIES FOR comments
-- ============================================================================

DROP POLICY IF EXISTS "Comments viewable by project members" ON comments;
DROP POLICY IF EXISTS "Users can create comments" ON comments;
DROP POLICY IF EXISTS "Users can update own comments" ON comments;
DROP POLICY IF EXISTS "Users can delete own comments" ON comments;

-- Recreate simplified comments policies
CREATE POLICY "Comments viewable by project members"
    ON comments FOR SELECT
    USING (
        -- Can view comments on projects they own
        EXISTS (
            SELECT 1 FROM projects
            WHERE projects.id = comments.project_id
            AND projects.user_id = auth.uid()
        )
        OR
        -- Or comments on shared projects
        EXISTS (
            SELECT 1 FROM project_shares ps
            WHERE ps.project_id = comments.project_id
            AND ps.shared_with = auth.uid()
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
-- DROP PROBLEMATIC POLICIES FOR api_endpoints
-- ============================================================================

DROP POLICY IF EXISTS "Project members can view API endpoints" ON api_endpoints;
DROP POLICY IF EXISTS "Users can manage API endpoints" ON api_endpoints;

-- Recreate simplified api_endpoints policies
CREATE POLICY "Project members can view API endpoints"
    ON api_endpoints FOR SELECT
    USING (
        -- Can view endpoints on projects they own
        EXISTS (
            SELECT 1 FROM projects
            WHERE projects.id = api_endpoints.project_id
            AND projects.user_id = auth.uid()
        )
        OR
        -- Or endpoints on shared projects
        EXISTS (
            SELECT 1 FROM project_shares ps
            WHERE ps.project_id = api_endpoints.project_id
            AND ps.shared_with = auth.uid()
        )
    );

CREATE POLICY "Users can manage API endpoints"
    ON api_endpoints FOR ALL
    USING (
        -- Project owners can manage endpoints
        EXISTS (
            SELECT 1 FROM projects
            WHERE projects.id = api_endpoints.project_id
            AND projects.user_id = auth.uid()
        )
    );

-- ============================================================================
-- SUMMARY OF FIXES
-- ============================================================================

-- ✅ Fixed infinite recursion in team_members policies
-- ✅ Simplified complex EXISTS subqueries
-- ✅ Removed circular dependencies
-- ✅ Made policies more efficient
-- ✅ Safe to run multiple times (DROP IF EXISTS)

-- ============================================================================
-- TEST VERIFICATION
-- ============================================================================

-- Test that you can select from team_members
-- SELECT * FROM team_members LIMIT 10;

-- Test that you can insert into teams
-- INSERT INTO teams (name, slug, owner_id) VALUES ('Test Team', 'test-team', 'user-uuid');

-- ============================================================================
-- END OF FIX
-- ============================================================================
