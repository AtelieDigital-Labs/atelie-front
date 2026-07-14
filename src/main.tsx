import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import App from './App.tsx'
import './global.css'

import { ThemeProvider } from './providers/theme-provider.tsx'
import { AuthProvider } from './providers/authProvider.tsx'
import { QueryProvider } from './providers/QueryProvider.tsx'
import { GoogleOAuthProvider } from '@react-oauth/google'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryProvider>
      <ThemeProvider>
        <AuthProvider>

          <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
            <App />
          </GoogleOAuthProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryProvider>
  </StrictMode>,
)
