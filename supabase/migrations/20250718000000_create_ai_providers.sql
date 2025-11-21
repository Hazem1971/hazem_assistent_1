-- Create AI Providers table
CREATE TABLE IF NOT EXISTS public.ai_providers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  provider_name TEXT UNIQUE NOT NULL,
  api_key TEXT,
  model_name TEXT DEFAULT 'gemini-1.5-flash',
  is_active BOOLEAN DEFAULT false,
  base_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default providers
INSERT INTO public.ai_providers (provider_name, model_name, is_active, base_url) VALUES 
('gemini', 'gemini-1.5-flash', true, 'https://generativelanguage.googleapis.com/v1beta/models'),
('openai', 'gpt-4o', false, 'https://api.openai.com/v1'),
('anthropic', 'claude-3-sonnet-20240229', false, 'https://api.anthropic.com/v1'),
('openrouter', 'google/gemini-pro-1.5', false, 'https://openrouter.ai/api/v1'),
('groq', 'llama3-70b-8192', false, 'https://api.groq.com/openai/v1'),
('deepseek', 'deepseek-coder', false, 'https://api.deepseek.com/v1'),
('perplexity', 'llama-3-sonar-large-32k-online', false, 'https://api.perplexity.ai')
ON CONFLICT (provider_name) DO NOTHING;

-- Enable RLS
ALTER TABLE public.ai_providers ENABLE ROW LEVEL SECURITY;

-- Create Policy: Only admins can view/edit
CREATE POLICY "Admins can manage AI providers" ON public.ai_providers
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Function to set a single provider as active
CREATE OR REPLACE FUNCTION set_active_ai_provider(provider_id UUID)
RETURNS VOID AS $$
BEGIN
  -- Set all to false
  UPDATE public.ai_providers SET is_active = false;
  
  -- Set selected to true
  UPDATE public.ai_providers SET is_active = true WHERE id = provider_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
