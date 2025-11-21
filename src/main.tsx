import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import './i18n'; 
import { AuthProvider } from './components/auth/auth-provider.tsx';
import { Toaster } from 'react-hot-toast';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './lib/react-query';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Toaster position="bottom-center" toastOptions={{
          className: 'bg-background text-foreground border border-border',
        }}/>
        <App />
      </AuthProvider>
    </QueryClientProvider>
  </React.StrictMode>,
)
