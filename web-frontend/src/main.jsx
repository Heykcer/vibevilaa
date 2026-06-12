import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import ErrorBoundary from './components/Common/ErrorBoundary.jsx'

// Prevent global unhandled errors from crashing the application natively
window.addEventListener('error', (event) => {
  console.error('[Global Error Caught]:', event.error);
  event.preventDefault(); // Suppress crash
});

window.addEventListener('unhandledrejection', (event) => {
  console.error('[Unhandled Promise Rejection]:', event.reason);
  event.preventDefault(); // Suppress crash
});

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
)
