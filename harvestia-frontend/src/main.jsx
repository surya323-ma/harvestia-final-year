import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'react-hot-toast'
import App from './App'
import './index.css'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,   // 5 min
      retry: 2,
      refetchOnWindowFocus: false,
    },
  },
})

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <App />
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#0d1f12',
              color: '#e2ede6',
              border: '1px solid rgba(74,222,128,0.2)',
              borderRadius: '12px',
              fontFamily: 'Plus Jakarta Sans, sans-serif',
              fontSize: '13px',
            },
            success: { iconTheme: { primary: '#4ade80', secondary: '#04100a' } },
            error:   { iconTheme: { primary: '#f87171', secondary: '#04100a' } },
          }}
        />
      </BrowserRouter>
    </QueryClientProvider>
  </React.StrictMode>
)
