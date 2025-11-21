import { User } from "@supabase/supabase-js";

export type Platform = 'facebook' | 'tiktok' | 'youtube';

export interface Profile extends User {
  id: string;
  full_name: string | null;
  company: string | null;
  role: 'admin' | 'user';
  subscription_plan: string | null;
  email?: string;
  created_at: string; // Explicitly defined to match table column
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
