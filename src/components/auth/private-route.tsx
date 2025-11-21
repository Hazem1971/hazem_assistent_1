import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/use-auth';

export const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  // 1. Check if logged in
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 2. Check subscription status for Dashboard access
  // Note: We allow access to /account even if inactive, but dashboard is restricted
  // based on the prompt requirements.
  const isDashboard = location.pathname.startsWith('/dashboard');
  
  // Allow admin and test users to bypass subscription check
  const isSpecialUser = user.role === 'admin' || user.app_metadata?.provider === 'local';

  if (isDashboard && !isSpecialUser && user.subscription_status !== 'active') {
    return <Navigate to="/choose-plan" replace />;
  }

  return <>{children}</>;
};
