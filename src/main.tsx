import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import './i18n'; // Initialize i18next
import { AuthProvider } from './components/auth/auth-provider.tsx';
import { Toaster } from 'react-hot-toast';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider>
      <Toaster position="bottom-center" toastOptions={{
        className: 'bg-background text-foreground border border-border',
      }}/>
      <App />
    </AuthProvider>
  </React.StrictMode>,
)
