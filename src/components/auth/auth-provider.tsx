import React, { createContext, useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { AuthSession, Profile } from '@/types';
import { AuthError, AuthResponse, GoTrueAdminApi, Session, User, UserAttributes, UserCredentials } from '@supabase/supabase-js';

export const AuthContext = createContext<
  (AuthSession & {
    signIn: (credentials: UserCredentials) => Promise<AuthResponse>;
    signUp: (credentials: UserCredentials) => Promise<AuthResponse>;
    signOut: () => Promise<{ error: AuthError | null }>;
    signInWithGoogle: () => Promise<AuthResponse>;
    updateUser: (attributes: UserAttributes) => Promise<AuthResponse>;
  }) | undefined
>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getSession = async () => {
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
    
    getSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
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

  const value = {
    user,
    loading,
    signIn: (credentials: UserCredentials) => supabase.auth.signInWithPassword(credentials),
    signUp: (credentials: UserCredentials) => supabase.auth.signUp(credentials),
    signOut: () => supabase.auth.signOut(),
    signInWithGoogle: () => supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin
      }
    }),
    updateUser: (attributes: UserAttributes) => supabase.auth.updateUser(attributes),
  };

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
};
