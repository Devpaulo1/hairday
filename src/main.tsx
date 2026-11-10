import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { ScheduleProvider } from './context/ScheduleProvider.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* O Provider envolve a aplicação: é ele que guarda os agendamentos. */}
    <ScheduleProvider>
      <App />
    </ScheduleProvider>
  </StrictMode>,
)
