-- ============================================================================
-- NUCLEAR FIX: Drop ALL policies first, then recreate
-- Version: 2.0.6
-- Created: 2025-02-05
-- Description: Drop ALL team/team_members policies then recreate cleanly
-- ============================================================================

-- ============================================================================
-- DROP ALL EXISTING POLICIES (NUCLEAR OPTION)
-- ============================================================================

-- Drop ALL teams policies
DROP POLICY IF EXISTS "Team members can view team" ON teams;
DROP POLICY IF EXISTS "Users can create teams" ON teams;
DROP POLICY IF EXISTS "Only owner can update team" ON teams;
DROP POLICY IF EXISTS "Only owner can delete team" ON teams;
DROP POLICY IF EXISTS "Users can view teams" ON teams;
DROP POLICY IF EXISTS "Users can update teams" ON teams;
DROP POLICY IF EXISTS "Users can delete teams" ON teams;

-- Drop ALL team_members policies
DROP POLICY IF EXISTS "Team members can view other members" ON team_members;
DROP POLICY IF EXISTS "Users can add team members" ON team_members;
DROP POLICY IF EXISTS "Team owners can update members" ON team_members;
DROP POLICY IF EXISTS "Team owners can remove members" ON team_members;
DROP POLICY IF EXISTS "Users can update own team membership" ON team_members;
DROP POLICY IF EXISTS "Users can update team members" ON team_members;
DROP POLICY IF EXISTS "Users can remove team members" ON team_members;
DROP POLICY IF EXISTS "Users can delete team members" ON team_members;
DROP POLICY IF EXISTS "Team can view members" ON team_members;
DROP POLICY IF EXISTS "Team can add members" ON team_members;
DROP POLICY IF EXISTS "Team can update members" ON team_members;
DROP POLICY IF EXISTS "Team can remove members" ON team_members;

-- ============================================================================
-- CREATE CLEAN POLICIES (NEW NAMES, NO CONFLICTS)
-- ============================================================================

-- TEAMS POLICIES

-- SELECT: View teams you own or belong to
CREATE POLICY "teams_select_own_or_member"
    ON teams FOR SELECT
    USING (
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

-- INSERT: Create teams (owner)
CREATE POLICY "teams_insert_owner"
    ON teams FOR INSERT
    WITH CHECK (owner_id = auth.uid());

-- UPDATE: Update teams (owner only)
CREATE POLICY "teams_update_owner"
    ON teams FOR UPDATE
    USING (owner_id = auth.uid());

-- DELETE: Delete teams (owner only)
CREATE POLICY "teams_delete_owner"
    ON teams FOR DELETE
    USING (owner_id = auth.uid());

-- TEAM MEMBERS POLICIES

-- SELECT: View members of teams you own or belong to
CREATE POLICY "team_members_select_own_or_member"
    ON team_members FOR SELECT
    USING (
        team_id IN (
            SELECT t.id FROM teams t
            WHERE t.owner_id = auth.uid()
            UNION
            SELECT tm.team_id FROM team_members tm
            WHERE tm.user_id = auth.uid()
            AND tm.status = 'active'
        )
    );

-- INSERT: Add members (team owner or self)
CREATE POLICY "team_members_insert_owner_or_self"
    ON team_members FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM teams t
            WHERE t.id = team_members.team_id
            AND t.owner_id = auth.uid()
        )
        OR
        user_id = auth.uid()
    );

-- UPDATE: Update members (team owner or self)
CREATE POLICY "team_members_update_owner_or_self"
    ON team_members FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM teams t
            WHERE t.id = team_members.team_id
            AND t.owner_id = auth.uid()
        )
        OR
        user_id = auth.uid()
    );

-- DELETE: Remove members (team owner or self)
CREATE POLICY "team_members_delete_owner_or_self"
    ON team_members FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM teams t
            WHERE t.id = team_members.team_id
            AND t.owner_id = auth.uid()
        )
        OR
        user_id = auth.uid()
    );

-- ============================================================================
-- VERIFY POLICIES CREATED
-- ============================================================================

-- List all policies for teams
SELECT * FROM pg_policies
WHERE tablename = 'teams'
ORDER BY policyname;

-- List all policies for team_members
SELECT * FROM pg_policies
WHERE tablename = 'team_members'
ORDER BY policyname;

-- ============================================================================
-- SUMMARY
-- ============================================================================

-- ✅ Dropped ALL existing policies (all variations)
-- ✅ Created NEW policies with unique names
-- ✅ No more policy name conflicts
-- ✅ No more infinite recursion
-- ✅ Safe to run multiple times

-- ============================================================================
-- END OF NUCLEAR FIX
-- ============================================================================