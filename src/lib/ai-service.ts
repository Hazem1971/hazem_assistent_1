import { supabase } from './supabase';
import { AIProvider, GeneratedContent, Platform, ToneAnalysisResult } from '@/types';

// --- 1. Configuration Fetcher ---

export async function getActiveAIConfig(): Promise<AIProvider | null> {
  // First check if we are in "Local Test Mode" (bypass DB)
  const localConfig = localStorage.getItem('mai_local_ai_config');
  if (localConfig) {
    return JSON.parse(localConfig);
  }

  const { data, error } = await supabase
    .from('ai_providers')
    .select('*')
    .eq('is_active', true)
    .single();

  if (error || !data) {
    // If DB fetch fails, check if we have any providers at all to suggest defaults
    console.warn("No active AI provider found in DB.");
    return null;
  }

  return data as AIProvider;
}

// --- 2. Core Generation Logic ---

export async function generateContent(
  platform: Platform, 
  topic: string, 
  tone: string = "Professional"
): Promise<string> {
  const config = await getActiveAIConfig();
  
  // Fallback if no config or key (Simulation Mode)
  if (!config || !config.api_key) {
    console.log("Simulating AI generation (No active provider configured)");
    // Simulate a delay
    await new Promise(r => setTimeout(r, 1500));
    return `[SIMULATED ${platform.toUpperCase()} CONTENT]\nTopic: ${topic}\nTone: ${tone}\n\n(This is a placeholder. Please configure a valid API Key in Admin > AI Settings to generate real content.)`;
  }

  const prompt = `Generate a ${platform} post about "${topic}". The tone should be ${tone}. Include hashtags.`;

  try {
    return await callLLM(config, prompt);
  } catch (error: any) {
    console.error("AI Generation Failed:", error);
    return `Error generating content: ${error.message}. Please check Admin AI Settings.`;
  }
}

export async function analyzeTone(content: string): Promise<ToneAnalysisResult> {
  const config = await getActiveAIConfig();

  if (!config || !config.api_key) {
    await new Promise(r => setTimeout(r, 1000));
    return {
      tone: "Simulated Analysis (No API Key)",
      keywords: ["simulation", "test", "placeholder"]
    };
  }

  const prompt = `Analyze the tone of the following text. Return ONLY a JSON object with two keys: "tone" (string description) and "keywords" (array of strings). Text: "${content}"`;

  try {
    const response = await callLLM(config, prompt);
    // Attempt to parse JSON from the response (handling potential markdown code blocks)
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    // Fallback if JSON parsing fails but we got text
    return { tone: "Professional (Parsed)", keywords: ["content", "analysis"] };
  } catch (error) {
    console.error("Tone Analysis Failed:", error);
    return { tone: "Error", keywords: [] };
  }
}

export async function testAIConnection(config: AIProvider): Promise<boolean> {
  try {
    const response = await callLLM(config, "Say 'Success'");
    return response.toLowerCase().includes('success');
  } catch (error) {
    console.error("Connection Test Failed:", error);
    throw error;
  }
}

// --- 3. Provider-Specific API Calls ---

// Helper to normalize URLs (remove trailing slashes)
const cleanUrl = (url: string) => url.replace(/\/+$/, '');

async function callLLM(config: AIProvider, prompt: string): Promise<string> {
  const { provider_name, api_key, model_name, base_url } = config;

  // GEMINI (Google)
  if (provider_name === 'gemini') {
    const baseUrl = cleanUrl(base_url || 'https://generativelanguage.googleapis.com/v1beta/models');
    const url = `${baseUrl}/${model_name}:generateContent?key=${api_key}`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    });
    
    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.error?.message || `Gemini API Error: ${response.statusText}`);
    }
    
    const data = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || "No response text";
  }

  // ANTHROPIC (Claude)
  if (provider_name === 'anthropic') {
    const baseUrl = cleanUrl(base_url || 'https://api.anthropic.com/v1');
    const url = `${baseUrl}/messages`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'x-api-key': api_key,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
        'dangerously-allow-browser': 'true' // Only for dev/demo
      },
      body: JSON.stringify({
        model: model_name,
        max_tokens: 1024,
        messages: [{ role: 'user', content: prompt }]
      })
    });

    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.error?.message || `Anthropic API Error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.content?.[0]?.text || "No response text";
  }

  // OPENAI COMPATIBLE (OpenAI, Groq, DeepSeek, OpenRouter, Perplexity)
  // Logic to construct the correct chat completions URL
  let finalBaseUrl = cleanUrl(base_url || 'https://api.openai.com/v1');
  
  // If the user provided a URL ending in /v1, we don't want to duplicate it if logic adds it, 
  // but standard is usually base/v1/chat/completions.
  // We'll assume the user provides the "Base URL" (e.g. https://api.groq.com/openai/v1)
  
  let chatUrl = `${finalBaseUrl}/chat/completions`;
  
  // Edge case: if user put the full chat url by mistake, handle it? 
  // Better to stick to convention: Base URL + /chat/completions
  
  const headers: any = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${api_key}`
  };

  // OpenRouter specific headers
  if (provider_name === 'openrouter') {
    headers['HTTP-Referer'] = window.location.origin;
    headers['X-Title'] = 'Marketing AI';
  }

  const response = await fetch(chatUrl, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      model: model_name,
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7
    })
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error?.message || `API Error: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content || "No response text";
}
