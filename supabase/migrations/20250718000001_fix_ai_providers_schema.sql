-- FIX: Drop the table first to ensure we remove any incorrect schema versions
DROP TABLE IF EXISTS public.ai_providers;

-- 1. Create the table with the correct columns
CREATE TABLE public.ai_providers (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  provider_name text UNIQUE NOT NULL,      -- This was missing in your DB
  api_key text,
  model_name text DEFAULT 'gemini-1.5-flash',
  is_active boolean DEFAULT false,
  base_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 2. Enable RLS
ALTER TABLE public.ai_providers ENABLE ROW LEVEL SECURITY;

-- 3. Create Policy (Allow admins to do everything)
CREATE POLICY "Admins can manage AI providers" ON public.ai_providers
  FOR ALL
  USING (
    exists (
      select 1 from profiles
      where profiles.id = auth.uid()
      and profiles.role IN ('admin', 'superadmin')
    )
  );

-- 4. Create the Helper Function for the "Active" toggle
CREATE OR REPLACE FUNCTION set_active_ai_provider(provider_id uuid)
RETURNS void AS $$
BEGIN
  -- Set all providers to inactive
  UPDATE public.ai_providers SET is_active = false;
  
  -- Set the selected provider to active
  UPDATE public.ai_providers SET is_active = true WHERE id = provider_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. Insert Default Providers (Safe Insert)
INSERT INTO public.ai_providers (provider_name, model_name, is_active, base_url) VALUES 
('gemini', 'gemini-1.5-flash', true, 'https://generativelanguage.googleapis.com/v1beta/models'),
('anthropic', 'claude-3-sonnet-20240229', false, 'https://api.anthropic.com/v1/messages'),
('openrouter', 'google/gemini-2.0-flash-exp:free', false, 'https://openrouter.ai/api/v1'),
('groq', 'llama3-70b-8192', false, 'https://api.groq.com/openai/v1'),
('deepseek', 'deepseek-coder', false, 'https://api.deepseek.com/v1'),
('perplexity', 'llama-3-sonar-large-32k-online', false, 'https://api.perplexity.ai')
ON CONFLICT (provider_name) DO NOTHING;
