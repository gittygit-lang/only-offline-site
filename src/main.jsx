import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { OfflineFallbackWrapper } from './offlineFallback.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <OfflineFallbackWrapper>
      <App />
    </OfflineFallbackWrapper>
  </StrictMode>,
)
