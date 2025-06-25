import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import { initializeAuth } from './stores/authStore'
import './index.css'

// Initialize authentication state
initializeAuth();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
