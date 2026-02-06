-- ============================================================================
-- FIX: Add Missing RLS Policies for project_shares
-- Version: 2.0.1
-- Created: 2025-02-05
-- Description: Fix RLS policies to allow INSERT/UPDATE/DELETE on project_shares
-- ============================================================================

-- DROP existing policies (if any)
DROP POLICY IF EXISTS "Users can create project shares" ON project_shares;
DROP POLICY IF EXISTS "Users can update own project shares" ON project_shares;
DROP POLICY IF EXISTS "Users can delete own project shares" ON project_shares;

-- INSERT Policy: Allow project owners to create shares
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

-- UPDATE Policy: Allow project owners to update shares
CREATE POLICY "Users can update own project shares"
    ON project_shares FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM projects
            WHERE projects.id = project_shares.project_id
            AND projects.user_id = auth.uid()
        )
    );

-- DELETE Policy: Allow project owners to delete shares
CREATE POLICY "Users can delete own project shares"
    ON project_shares FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM projects
            WHERE projects.id = project_shares.project_id
            AND projects.user_id = auth.uid()
        )
    );

-- ============================================================================
-- ADD MISSING RLS POLICIES FOR TEAMS
-- ============================================================================

-- INSERT Policy: Users can create teams
DROP POLICY IF EXISTS "Users can create teams" ON teams;
CREATE POLICY "Users can create teams"
    ON teams FOR INSERT
    WITH CHECK (owner_id = auth.uid());

-- INSERT Policy: Team members can be added
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

-- UPDATE Policy: Team owners can update members
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

-- DELETE Policy: Team owners can remove members
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

-- ============================================================================
-- ADD MISSING RLS POLICIES FOR team_members (ALLOW MEMBERS TO JOIN)
-- ============================================================================

-- Allow users to accept invitations (update their own membership)
DROP POLICY IF EXISTS "Users can update own team membership" ON team_members;
CREATE POLICY "Users can update own team membership"
    ON team_members FOR UPDATE
    USING (user_id = auth.uid());

-- ============================================================================
-- TEST VERIFICATION
-- ============================================================================

-- Comment for documentation
COMMENT ON POLICY "Users can create project shares" ON project_shares IS 'Allows project owners to create share links or invite users';

COMMENT ON POLICY "Users can update own project shares" ON project_shares IS 'Allows project owners to update share settings';

COMMENT ON POLICY "Users can delete own project shares" ON project_shares IS 'Allows project owners to revoke shares';

COMMENT ON POLICY "Users can create teams" ON teams IS 'Allows users to create their own teams';

COMMENT ON POLICY "Users can add team members" ON team_members IS 'Allows team owners to invite new members';

COMMENT ON POLICY "Team owners can update members" ON team_members IS 'Allows team owners to change member roles';

COMMENT ON POLICY "Team owners can remove members" ON team_members IS 'Allows team owners to remove team members';

COMMENT ON POLICY "Users can update own team membership" ON team_members IS 'Allows users to accept team invitations';

-- ============================================================================
-- END OF FIX
-- ============================================================================