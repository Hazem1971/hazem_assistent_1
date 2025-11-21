import { User } from "@supabase/supabase-js";

export type Platform = 'facebook' | 'tiktok' | 'youtube' | 'instagram' | 'linkedin' | 'twitter';

export interface Profile extends User {
  id: string;
  full_name: string | null;
  company: string | null;
  role: 'admin' | 'user';
  subscription_plan: string | null;
  email?: string;
  created_at: string;
  subscription_status?: 'active' | 'inactive' | 'pending';
  plan_id?: string;
  payment_date?: string;
  app_metadata?: {
    provider?: string;
    providers?: string[];
    [key: string]: any;
  };
  user_metadata?: {
    [key: string]: any;
  };
}

export interface AuthSession {
    user: Profile | null;
    loading: boolean;
}

export interface Plan {
    id: string;
    name: string;
    price: string;
    description: string;
    features: string[];
    created_at: string;
}

export interface SiteContent {
    id?: number;
    content_key: string;
    content_value: any;
    created_at?: string;
}

export interface HeroContent {
    title: string;
    subtitle: string;
}

export interface FeatureContent {
    id: string;
    title: string;
    description: string;
}

export interface TestimonialContent {
    id: string;
    text: string;
    author: string;
    role: string;
}

export interface Coupon {
  id: string;
  code: string;
  discount_type: 'percentage' | 'fixed';
  discount_value: number;
  expires_at?: string | null;
  usage_count: number;
  usage_limit?: number | null;
  is_active: boolean;
  created_at: string;
}

export interface GeneratedContent {
  id: string;
  user_id: string;
  platform: Platform;
  text: string;
  created_at: string;
}

export interface BrandVoice {
  id: string;
  user_id: string;
  name: string;
  tone: string;
  created_at: string;
}

export interface ApiKey {
  id: string;
  user_id: string;
  name: string;
  key: string;
  created_at: string;
  last_used_at: string | null;
}

export interface BillingInvoice {
  id: string;
  user_id: string;
  amount: number;
  invoice_url: string;
  created_at: string;
}

export interface ToneAnalysisResult {
    tone: string;
    keywords: string[];
}

export interface AIProvider {
  id: string;
  provider_name: string;
  api_key: string;
  model_name: string;
  is_active: boolean;
  base_url: string;
  updated_at: string;
}

// --- Campaign System Types ---

export interface Campaign {
  id: string;
  user_id: string;
  client_name: string;
  brand_voice: string;
  target_audience: string;
  goals: string;
  notes: string;
  period: 'week' | 'month' | 'custom';
  start_date: string;
  created_at: string;
  updated_at: string;
}

export interface CampaignPost {
  id: string;
  campaign_id: string;
  platform: Platform;
  post_date: string;
  caption: string;
  media_urls: string[] | null;
  tone: string;
  hashtags: string;
  call_to_action: string;
  created_at: string;
  updated_at: string;
}

export interface AdminStrategy {
  id: string;
  title: string;
  description: string;
  tone: string;
  industry: string;
  example_posts: any[]; // JSONB
  is_active: boolean;
  created_at: string;
}
