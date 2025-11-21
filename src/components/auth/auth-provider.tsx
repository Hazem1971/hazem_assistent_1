import React, { createContext, useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { AuthSession, Profile } from '@/types';
import { 
  AuthError, 
  AuthResponse, 
  UserAttributes, 
  SignInWithPasswordCredentials,
  SignUpWithPasswordCredentials
} from '@supabase/supabase-js';

// Hardcoded Super Admin Profile
const SUPER_ADMIN_PROFILE: Profile = {
  id: 'super-admin-local-id',
  email: 'hazemadmin',
  role: 'admin',
  full_name: 'Super Admin',
  company: 'System Administrator',
  subscription_plan: 'Enterprise',
  app_metadata: { provider: 'local', providers: ['local'] },
  user_metadata: {},
  aud: 'authenticated',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  phone: '',
  confirmed_at: new Date().toISOString(),
  last_sign_in_at: new Date().toISOString(),
} as unknown as Profile;

// Hardcoded Test User Profile
const TEST_USER_PROFILE: Profile = {
  id: 'test-user-local-id',
  email: 'test@local.com',
  role: 'user',
  full_name: 'Test User',
  company: 'Demo Corp',
  subscription_plan: 'Free',
  app_metadata: { provider: 'local', providers: ['local'] },
  user_metadata: {},
  aud: 'authenticated',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  phone: '',
  confirmed_at: new Date().toISOString(),
  last_sign_in_at: new Date().toISOString(),
} as unknown as Profile;

export const AuthContext = createContext<
  (AuthSession & {
    signIn: (credentials: SignInWithPasswordCredentials) => Promise<AuthResponse>;
    signUp: (credentials: SignUpWithPasswordCredentials) => Promise<AuthResponse>;
    signOut: () => Promise<{ error: AuthError | null }>;
    signInWithGoogle: () => Promise<AuthResponse>;
    updateUser: (attributes: UserAttributes) => Promise<AuthResponse>;
    signInAsTestUser: () => Promise<void>;
  }) | undefined
>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      // Check for local super admin session
      const isSuperAdmin = localStorage.getItem('mai_super_admin');
      if (isSuperAdmin === 'true') {
        setUser(SUPER_ADMIN_PROFILE);
        setLoading(false);
        return;
      }

      // Check for local test user session
      const isTestUser = localStorage.getItem('mai_test_user');
      if (isTestUser === 'true') {
        setUser(TEST_USER_PROFILE);
        setLoading(false);
        return;
      }

      // Check Supabase session
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();
        setUser(profile ? { ...session.user, ...profile } as Profile : null);
      }
      setLoading(false);
    };
    
    initAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        // If we are logged in as local user, ignore supabase state changes
        if (localStorage.getItem('mai_super_admin') === 'true' || localStorage.getItem('mai_test_user') === 'true') {
            return;
        }

        if (session) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();
          setUser(profile ? { ...session.user, ...profile } as Profile : null);
        } else {
          setUser(null);
        }
        setLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (credentials: SignInWithPasswordCredentials): Promise<AuthResponse> => {
    // Check for Super Admin Credentials
    if (credentials.email === 'hazemadmin' && credentials.password === 'Hazemvipxtur123@#') {
      localStorage.setItem('mai_super_admin', 'true');
      setUser(SUPER_ADMIN_PROFILE);
      return {
        data: { 
          user: SUPER_ADMIN_PROFILE, 
          session: { 
            access_token: 'mock-token', 
            refresh_token: 'mock-refresh', 
            expires_in: 3600, 
            token_type: 'bearer', 
            user: SUPER_ADMIN_PROFILE 
          } 
        },
        error: null
      };
    }

    return supabase.auth.signInWithPassword(credentials);
  };

  const signInAsTestUser = async () => {
    localStorage.setItem('mai_test_user', 'true');
    setUser(TEST_USER_PROFILE);
  };

  const signOut = async () => {
    if (localStorage.getItem('mai_super_admin') === 'true') {
      localStorage.removeItem('mai_super_admin');
      setUser(null);
      return { error: null };
    }
    if (localStorage.getItem('mai_test_user') === 'true') {
      localStorage.removeItem('mai_test_user');
      setUser(null);
      return { error: null };
    }
    return supabase.auth.signOut();
  };

  const value = {
    user,
    loading,
    signIn,
    signUp: (credentials: SignUpWithPasswordCredentials) => supabase.auth.signUp(credentials),
    signOut,
    signInWithGoogle: () => supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin
      }
    }),
    updateUser: (attributes: UserAttributes) => supabase.auth.updateUser(attributes),
    signInAsTestUser,
  };

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
};
