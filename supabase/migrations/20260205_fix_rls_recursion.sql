-- Fix RLS infinite recursion in team_members
-- Run this in Supabase SQL Editor

-- Drop existing problematic policies
DROP POLICY IF EXISTS "Team members can view other members" ON team_members;
DROP POLICY IF EXISTS "Team members can view team" ON teams;

-- Simplified RLS for teams
CREATE POLICY "Users can view their own teams"
    ON teams FOR SELECT
    USING (
        owner_id = auth.uid()
        OR EXISTS (
            SELECT 1 FROM team_members
            WHERE team_members.team_id = teams.id
            AND team_members.user_id = auth.uid()
            AND team_members.status = 'active'
        )
    );

-- Simplified RLS for team_members
CREATE POLICY "Users can view their team memberships"
    ON team_members FOR SELECT
    USING (
        user_id = auth.uid()
        OR EXISTS (
            SELECT 1 FROM team_members tm
            WHERE tm.team_id = team_members.team_id
            AND tm.user_id = auth.uid()
            AND tm.status = 'active'
        )
    );

CREATE POLICY "Users can insert their own membership"
    ON team_members FOR INSERT
    WITH CHECK (user_id = auth.uid());

CREATE POLICY "Team owners can update members"
    ON team_members FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM teams
            WHERE teams.id = team_members.team_id
            AND teams.owner_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete own membership"
    ON team_members FOR DELETE
    USING (user_id = auth.uid());

SELECT 'RLS policies fixed successfully' as status;
