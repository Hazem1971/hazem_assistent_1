import React, { createContext, useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { AuthSession, UserProfile } from '@/types';
import { Session } from '@supabase/supabase-js';

export const AuthContext = createContext<
  (AuthSession & {
    signIn: (email: string) => void;
    signOut: () => void;
  }) | undefined
>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // --- Placeholder for Supabase Auth Listener ---
    console.log("Auth Provider: Checking for session (simulation)...");
    const checkSession = async () => {
        setLoading(false);
    };

    checkSession();
    // --- End of Placeholder ---
  }, []);

  const value = {
    user,
    loading,
    signIn: (email: string) => {
      console.log(`Simulating sign-in for ${email}`);
      const role = email === 'admin@marketing.com' ? 'admin' : 'user';
      setUser({ id: 'mock-user-id', email, role });
    },
    signOut: () => {
      console.log("Simulating sign-out.");
      setUser(null);
    },
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
