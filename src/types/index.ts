export type Platform = 'facebook' | 'tiktok' | 'youtube';

export interface GeneratedContent {
  id: string;
  platform: Platform;
  text: string;
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
