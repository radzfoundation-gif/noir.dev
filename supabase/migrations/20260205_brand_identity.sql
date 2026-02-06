-- Migration for Smart Brand Identity
-- Adds JSONB column to store design preferences

DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='projects' AND column_name='brand_identity') THEN
        ALTER TABLE projects ADD COLUMN brand_identity JSONB DEFAULT '{
            "primaryColor": "#bef264",
            "secondaryColor": "#171717",
            "fontFamily": "Inter",
            "borderRadius": "md",
            "styleMode": "glassmorphism"
        }';
    END IF;
END $$;
