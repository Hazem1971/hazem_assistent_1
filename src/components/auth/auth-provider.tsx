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
    // This simulates checking for an existing session on app load.
    // Once Supabase is connected, this will be replaced with `supabase.auth.onAuthStateChange`.
    console.log("Auth Provider: Checking for session (simulation)...");
    const checkSession = async () => {
        // In a real app, you would use:
        // const { data: { session } } = await supabase.auth.getSession();
        // if (session) {
        //     setUser({ id: session.user.id, email: session.user.email! });
        // }
        setLoading(false);
    };

    checkSession();
    // --- End of Placeholder ---
  }, []);

  const value = {
    user,
    loading,
    signIn: (email: string) => {
      // This is a mock sign-in for demonstration purposes.
      // It does not perform real authentication.
      console.log(`Simulating sign-in for ${email}`);
      setUser({ id: 'mock-user-id', email });
    },
    signOut: () => {
      // This is a mock sign-out.
      console.log("Simulating sign-out.");
      setUser(null);
    },
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
