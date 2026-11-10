import { useState } from 'react'
import { AppointmentForm } from './components/AppointmentForm'
import { AppointmentList } from './components/AppointmentList'
import { DateSelector } from './components/DateSelector'
import { ScheduleSidebar } from './components/ScheduleSidebar'
import { todayISO } from './utils/appointmentHelpers'

/**
 * Composição da aplicação: formulário à esquerda e agenda à direita
 * no desktop. Em telas menores os dois blocos viram uma coluna.
 */
function App() {
  // A data que a agenda está exibindo.
  const [selectedDate, setSelectedDate] = useState(todayISO())

  return (
    <div className="min-h-screen bg-surface">
      <main className="mx-auto grid w-full max-w-6xl items-start gap-6 px-4 py-6 md:px-8 md:py-10 lg:grid-cols-[380px_minmax(0,1fr)] lg:gap-10">
        <ScheduleSidebar>
          <AppointmentForm onAppointmentCreated={setSelectedDate} />
        </ScheduleSidebar>

        <section aria-label="Sua agenda">
          <DateSelector date={selectedDate} onDateChange={setSelectedDate} />
          <AppointmentList date={selectedDate} />
        </section>
      </main>
    </div>
  )
}

export default App
