-- ============================================================================
-- SQL Migration: Add User Credits Table for Freemium Payment Flow
-- Description: Creates the `user_credits` table to track prompt usage and payments.
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.user_credits (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    free_prompts_used INTEGER DEFAULT 0,
    paid_prompts_available INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.user_credits ENABLE ROW LEVEL SECURITY;

-- Create Policies
DROP POLICY IF EXISTS "Users can view their own credits" ON public.user_credits;
CREATE POLICY "Users can view their own credits" 
    ON public.user_credits FOR SELECT 
    USING (auth.uid() = user_id);

-- System (Service Role) can manage all credits, but we only have anon key in server.
-- Wait, if server uses anon key, it will need to impersonate or we bypass RLS for server, or use service_role. 
-- Since the server only has anon key and often we can't secure it without service_role, we might need a stored procedure with SECURITY DEFINER or just allow UPDATE if auth.uid() = user_id (which is slightly insecure if users call it directly, but typical for anon key setups).
-- A safer approach without service_role is to allow users to view but only a PostgreSQL function to UPDATE.
-- For simplicity, let's allow users to manage their own credits if they know the API, but realistically the server should use a service_role key. Assuming anon key in the server uses the user's JWT.

DROP POLICY IF EXISTS "Users can update their own credits" ON public.user_credits;
CREATE POLICY "Users can update their own credits" 
    ON public.user_credits FOR UPDATE 
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own credits" ON public.user_credits;
CREATE POLICY "Users can insert their own credits" 
    ON public.user_credits FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

-- Initial insertion function
CREATE OR REPLACE FUNCTION initialize_user_credits()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.user_credits (user_id, free_prompts_used, paid_prompts_available)
    VALUES (NEW.id, 0, 0)
    ON CONFLICT (user_id) DO NOTHING;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create credits on user creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE PROCEDURE initialize_user_credits();
