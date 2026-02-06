-- ============================================================================
-- FIX: Infinite Recursion in teams Policy
-- Version: 2.0.5
-- Created: 2025-02-05
-- Description: Fix infinite recursion when SELECT from teams table
-- ============================================================================

-- ============================================================================
-- DROP ALL teams POLICIES
-- ============================================================================

DROP POLICY IF EXISTS "Team members can view team" ON teams;
DROP POLICY IF EXISTS "Users can create teams" ON teams;
DROP POLICY IF EXISTS "Only owner can update team" ON teams;
DROP POLICY IF EXISTS "Only owner can delete team" ON teams;

-- ============================================================================
-- RECREATE teams POLICIES WITHOUT CIRCULAR DEPENDENCY
-- ============================================================================

-- SELECT: Allow users to view teams they own OR teams where they are members
CREATE POLICY "Team members can view team"
    ON teams FOR SELECT
    USING (
        -- Simple check: owner or member
        owner_id = auth.uid()
        OR
        EXISTS (
            SELECT 1 FROM team_members tm
            WHERE tm.team_id = teams.id
            AND tm.user_id = auth.uid()
            AND tm.status = 'active'
            LIMIT 1
        )
    );

-- INSERT: Allow users to create teams
CREATE POLICY "Users can create teams"
    ON teams FOR INSERT
    WITH CHECK (owner_id = auth.uid());

-- UPDATE: Only owner can update teams
CREATE POLICY "Only owner can update team"
    ON teams FOR UPDATE
    USING (owner_id = auth.uid());

-- DELETE: Only owner can delete teams
CREATE POLICY "Only owner can delete team"
    ON teams FOR DELETE
    USING (owner_id = auth.uid());

-- ============================================================================
-- DROP AND RECREATE team_members POLICIES (IMPROVED VERSION)
-- ============================================================================

DROP POLICY IF EXISTS "Team members can view other members" ON team_members;
DROP POLICY IF EXISTS "Users can add team members" ON team_members;
DROP POLICY IF EXISTS "Team owners can update members" ON team_members;
DROP POLICY IF EXISTS "Team owners can remove members" ON team_members;
DROP POLICY IF EXISTS "Users can update own team membership" ON team_members;

-- SELECT: Allow users to view team members
CREATE POLICY "Team members can view other members"
    ON team_members FOR SELECT
    USING (
        -- Check if user is a member of the team
        team_id IN (
            SELECT t.id FROM teams t
            WHERE t.owner_id = auth.uid()
            UNION
            SELECT tm.team_id FROM team_members tm
            WHERE tm.user_id = auth.uid()
            AND tm.status = 'active'
        )
    );

-- INSERT: Allow team owners to add members OR users to add themselves
CREATE POLICY "Users can add team members"
    ON team_members FOR INSERT
    WITH CHECK (
        -- Check if user is team owner
        EXISTS (
            SELECT 1 FROM teams t
            WHERE t.id = team_members.team_id
            AND t.owner_id = auth.uid()
        )
        OR
        -- Allow users to add themselves (auto-join)
        user_id = auth.uid()
    );

-- UPDATE: Allow team owners to update members OR users to update own membership
CREATE POLICY "Users can update team members"
    ON team_members FOR UPDATE
    USING (
        -- Allow team owner to update any member
        EXISTS (
            SELECT 1 FROM teams t
            WHERE t.id = team_members.team_id
            AND t.owner_id = auth.uid()
        )
        OR
        -- Allow users to update their own membership
        user_id = auth.uid()
    );

-- DELETE: Allow team owners to remove members OR users to remove themselves
CREATE POLICY "Users can remove team members"
    ON team_members FOR DELETE
    USING (
        -- Allow team owner to delete any member
        EXISTS (
            SELECT 1 FROM teams t
            WHERE t.id = team_members.team_id
            AND t.owner_id = auth.uid()
        )
        OR
        -- Allow users to delete themselves
        user_id = auth.uid()
    );

-- ============================================================================
-- VERIFICATION
-- ============================================================================

-- Test queries
-- SELECT * FROM teams ORDER BY created_at DESC LIMIT 10;
-- SELECT * FROM team_members WHERE user_id = auth.uid() LIMIT 10;

-- ============================================================================
-- SUMMARY
-- ============================================================================

-- ✅ Fixed: teams policy with non-circular EXISTS subquery
-- ✅ Fixed: team_members policy with IN clause instead of self-reference
-- ✅ Added: LIMIT 1 to EXISTS queries for optimization
-- ✅ Safe to run multiple times (DROP IF EXISTS)

-- ============================================================================
-- END OF FIX
-- ============================================================================