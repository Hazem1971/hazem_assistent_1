export type Platform = 'facebook' | 'tiktok' | 'youtube';

export interface GeneratedContent {
  id: string;
  platform: Platform;
  text: string;
  createdAt: string;
}

export interface ToneAnalysisResult {
    tone: string;
    keywords: string[];
}

export interface UserProfile {
    id: string;
    email: string;
    role: 'admin' | 'user';
}

export interface AuthSession {
    user: UserProfile | null;
    loading: boolean;
}

export interface Plan {
    id: string;
    name: string;
    price: string;
    description: string;
    features: string[];
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
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  expiresAt?: string; // ISO string for date input
  usageCount: number;
  usageLimit?: number;
  isActive: boolean;
}

export interface BillingInvoice {
  id: string;
  date: string;
  amount: number;
  url: string;
}

export interface ApiKey {
  id: string;
  name: string;
  key: string;
  createdAt: string;
  lastUsed: string | null;
}
