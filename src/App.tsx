import { Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { HomePage } from './pages/home-page';
import { PageLayout } from './components/layout/page-layout';
import { useDirection } from './hooks/use-direction';
import { LoginPage } from './pages/login-page';
import { SignupPage } from './pages/signup-page';

function App() {
  useDirection();

  return (
    <Routes>
      <Route path="/" element={<PageLayout><HomePage /></PageLayout>} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      {/* Add other routes for dashboard here */}
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
