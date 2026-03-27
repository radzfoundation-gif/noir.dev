-- Add metadata and thumbnail_url to projects table
ALTER TABLE projects ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}';
ALTER TABLE projects ADD COLUMN IF NOT EXISTS thumbnail_url TEXT;
