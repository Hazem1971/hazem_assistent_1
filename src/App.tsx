import { Suspense } from 'react';
import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';
import { HomePage } from './pages/home-page';
import { PageLayout } from './components/layout/page-layout';
import { useDirection } from './hooks/use-direction';
import { LoginPage } from './pages/login-page';
import { SignupPage } from './pages/signup-page';
import { DashboardPage } from './pages/dashboard/dashboard-page';
import { PrivateRoute } from './components/auth/private-route';
import { AdminRoute } from './components/auth/admin-route';
import { AdminLayout } from './components/admin/layout/AdminLayout';
import AdminDashboardPage from './pages/admin/dashboard';
import AdminUsersPage from './pages/admin/users';
import AdminContentPage from './pages/admin/content';
import AdminBillingPage from './pages/admin/billing';
import AdminAiSettingsPage from './pages/admin/ai-settings';
import AdminSystemPage from './pages/admin/system';
import AdminSiteContentPage from './pages/admin/site-content';
import AdminMarketingPage from './pages/admin/marketing';

function App() {
  useDirection();

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<PageLayout><HomePage /></PageLayout>} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      
      {/* User Protected Routes */}
      <Route 
        path="/dashboard" 
        element={
          <PrivateRoute>
            <DashboardPage />
          </PrivateRoute>
        } 
      />

      {/* Admin Protected Routes */}
      <Route 
        path="/admin"
        element={
          <AdminRoute>
            <AdminLayout>
              <Outlet />
            </AdminLayout>
          </AdminRoute>
        }
      >
        <Route index element={<AdminDashboardPage />} />
        <Route path="users" element={<AdminUsersPage />} />
        <Route path="content" element={<AdminContentPage />} />
        <Route path="billing" element={<AdminBillingPage />} />
        <Route path="ai-settings" element={<AdminAiSettingsPage />} />
        <Route path="system" element={<AdminSystemPage />} />
        <Route path="site-content" element={<AdminSiteContentPage />} />
        <Route path="marketing" element={<AdminMarketingPage />} />
      </Route>
    </Routes>
  );
}

function WrappedApp() {
  return (
    <BrowserRouter>
      <Suspense fallback={
        <div className="flex h-screen w-full items-center justify-center bg-background">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      }>
        <App />
      </Suspense>
    </BrowserRouter>
  );
}

export default WrappedApp;
