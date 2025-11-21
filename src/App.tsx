import { Suspense } from 'react';
import { BrowserRouter, Routes, Route, Outlet, Navigate } from 'react-router-dom';
import { HomePage } from './pages/home-page';
import { PageLayout } from './components/layout/page-layout';
import { useDirection } from './hooks/use-direction';
import { LoginPage } from './pages/login-page';
import { SignupPage } from './pages/signup-page';
import { ChoosePlanPage } from './pages/choose-plan-page';
import { PaymentPage } from './pages/payment-page';
import { AdminLoginPage } from './pages/admin-login-page';
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
import AdminStrategiesPage from './pages/admin/strategies';
import AccountPage from './pages/account-page';
import { CampaignListPage } from './pages/dashboard/campaigns/campaign-list';
import { CampaignEditorPage } from './pages/dashboard/campaigns/campaign-editor';

function App() {
  useDirection();

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<PageLayout><HomePage /></PageLayout>} />
      <Route path="/login" element={<LoginPage />} />
      
      {/* New Flow Routes */}
      <Route path="/choose-plan" element={<ChoosePlanPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/payment" element={<PaymentPage />} />
      
      <Route path="/admin-login" element={<AdminLoginPage />} />
      
      {/* User Protected Routes */}
      <Route 
        path="/dashboard" 
        element={
          <PrivateRoute>
            <DashboardPage />
          </PrivateRoute>
        } 
      />
      <Route 
        path="/dashboard/campaigns" 
        element={
          <PrivateRoute>
            <div className="container mx-auto py-8 px-4">
              <CampaignListPage />
            </div>
          </PrivateRoute>
        } 
      />
      <Route 
        path="/dashboard/campaigns/:id" 
        element={
          <PrivateRoute>
            <div className="container mx-auto py-8 px-4">
              <CampaignEditorPage />
            </div>
          </PrivateRoute>
        } 
      />
      <Route 
        path="/account" 
        element={
          <PrivateRoute>
            <AccountPage />
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
        <Route path="strategies" element={<AdminStrategiesPage />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" />} />
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
