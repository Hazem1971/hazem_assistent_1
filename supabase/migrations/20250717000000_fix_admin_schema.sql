/*
  # Fix Admin Schema Issues
  
  ## Query Description:
  1. Creates missing `site_content` table for CMS functionality.
  2. Adds missing `created_at` columns to `plans` and `coupons` tables.
  3. Adds `email` column to `profiles` table to support admin user views.
  4. Backfills `profiles.email` from `auth.users`.
  
  ## Metadata:
  - Schema-Category: "Structural"
  - Impact-Level: "Medium"
  - Requires-Backup: false
  - Reversible: true
  
  ## Structure Details:
  - New Table: public.site_content
  - Modified Table: public.plans (add created_at)
  - Modified Table: public.coupons (add created_at)
  - Modified Table: public.profiles (add email)
*/

-- 1. Create site_content table
CREATE TABLE IF NOT EXISTS public.site_content (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    content_key TEXT NOT NULL UNIQUE,
    content_value JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;

-- Policies for site_content
CREATE POLICY "Allow public read access" ON public.site_content FOR SELECT USING (true);

CREATE POLICY "Allow admin full access" ON public.site_content FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
  )
);

-- 2. Add created_at to plans
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'plans' AND column_name = 'created_at') THEN
        ALTER TABLE public.plans ADD COLUMN created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL;
    END IF;
END $$;

-- 3. Add created_at to coupons
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'coupons' AND column_name = 'created_at') THEN
        ALTER TABLE public.coupons ADD COLUMN created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL;
    END IF;
END $$;

-- 4. Add email to profiles and backfill
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'email') THEN
        ALTER TABLE public.profiles ADD COLUMN email TEXT;
    END IF;
END $$;

-- Backfill email from auth.users (Safe operation, updates only matching IDs)
UPDATE public.profiles
SET email = au.email
FROM auth.users au
WHERE public.profiles.id = au.id
AND public.profiles.email IS NULL;

-- 5. Ensure new users get their email in profiles (Update existing handle_new_user function if possible, or create a sync trigger)
-- This block attempts to create a specific trigger for email syncing to be safe and not overwrite existing complex triggers
CREATE OR REPLACE FUNCTION public.sync_user_email()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.profiles
  SET email = NEW.email
  WHERE id = NEW.id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop trigger if exists to avoid duplication errors during re-runs
DROP TRIGGER IF EXISTS on_auth_user_email_update ON auth.users;

-- Create trigger on auth.users to sync email changes
CREATE TRIGGER on_auth_user_email_update
AFTER UPDATE OF email ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.sync_user_email();

-- Note: For INSERTs, usually the `handle_new_user` trigger handles it. 
-- We will attempt to update the profile immediately after insert as well just in case the main trigger missed it.
DROP TRIGGER IF EXISTS on_auth_user_created_email ON auth.users;
CREATE TRIGGER on_auth_user_created_email
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.sync_user_email();
