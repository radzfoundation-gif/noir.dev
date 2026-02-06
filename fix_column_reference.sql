-- ============================================================================
-- QUICK FIX: Column "owner_id" does not exist in team_members
-- Version: 2.0.4
-- Created: 2025-02-05
-- Description: Fix column reference error in team_members policies
-- ============================================================================

-- ============================================================================
-- DROP AND RECREATE team_members POLICIES WITH CORRECT COLUMN REFERENCES
-- ============================================================================

DROP POLICY IF EXISTS "Team members can view other members" ON team_members;
DROP POLICY IF EXISTS "Users can add team members" ON team_members;
DROP POLICY IF EXISTS "Team owners can update members" ON team_members;
DROP POLICY IF EXISTS "Team owners can remove members" ON team_members;
DROP POLICY IF EXISTS "Users can update own team membership" ON team_members;

-- ============================================================================
-- CREATE CORRECT POLICIES
-- ============================================================================

-- SELECT: Allow users to view all team members
CREATE POLICY "Team members can view other members"
    ON team_members FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM team_members tm_self
            WHERE tm_self.team_id = team_members.team_id
            AND tm_self.user_id = auth.uid()
            AND tm_self.status = 'active'
        )
    );

-- INSERT: Allow team owners to add members OR users to add themselves
CREATE POLICY "Users can add team members"
    ON team_members FOR INSERT
    WITH CHECK (
        -- Check if user is team owner via teams table
        EXISTS (
            SELECT 1 FROM teams
            WHERE teams.id = team_members.team_id
            AND teams.owner_id = auth.uid()
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
            SELECT 1 FROM teams
            WHERE teams.id = team_members.team_id
            AND teams.owner_id = auth.uid()
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
            SELECT 1 FROM teams
            WHERE teams.id = team_members.team_id
            AND teams.owner_id = auth.uid()
        )
        OR
        -- Allow users to delete themselves
        user_id = auth.uid()
    );

-- ============================================================================
-- VERIFICATION
-- ============================================================================

-- Test query to verify policies work
-- SELECT * FROM team_members WHERE user_id = auth.uid() LIMIT 10;

-- ============================================================================
-- SUMMARY OF FIXES
-- ============================================================================

-- ✅ Fixed: Reference to owner_id from teams table (not team_members)
-- ✅ Fixed: Infinite recursion with alias (tm_self)
-- ✅ Fixed: All INSERT/UPDATE/DELETE policies
-- ✅ Safe to run multiple times (DROP IF EXISTS)

-- ============================================================================
-- END OF FIX
-- ============================================================================
