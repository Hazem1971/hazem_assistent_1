import { Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { HomePage } from './pages/home-page';
import { PageLayout } from './components/layout/page-layout';
import { useDirection } from './hooks/use-direction';

function App() {
  useDirection();

  return (
    <PageLayout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        {/* Add other routes for login, signup, dashboard here */}
      </Routes>
    </PageLayout>
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
