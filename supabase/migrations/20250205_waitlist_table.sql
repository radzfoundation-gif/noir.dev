-- ============================================================================
-- WAITLIST TABLE
-- Version: 1.0.0
-- Created: 2025-02-05
-- Description: Waitlist for early access to NOIR AI
-- ============================================================================

-- Waitlist table
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

-- Indexes
CREATE INDEX IF NOT EXISTS idx_waitlist_email ON waitlist(email);
CREATE INDEX IF NOT EXISTS idx_waitlist_status ON waitlist(status);
CREATE INDEX IF NOT EXISTS idx_waitlist_created ON waitlist(created_at);

-- Enable RLS
ALTER TABLE waitlist ENABLE ROW LEVEL SECURITY;

-- Policies: Allow anyone to join waitlist
CREATE POLICY "Allow anonymous to join waitlist"
    ON waitlist FOR INSERT
    WITH CHECK (true);

-- Allow authenticated users to view waitlist
CREATE POLICY "Allow authenticated to view waitlist"
    ON waitlist FOR SELECT
    USING (true);

-- Allow delete operations (for admin)
CREATE POLICY "Allow delete on waitlist"
    ON waitlist FOR DELETE
    USING (true);

-- Comment for documentation
COMMENT ON TABLE waitlist IS 'Waitlist for early access signups';

-- ============================================================================
-- END OF WAITLIST MIGRATION
-- ============================================================================
