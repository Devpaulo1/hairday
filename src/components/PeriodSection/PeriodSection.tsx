import type { ReactNode } from 'react'
import type { Appointment, PeriodId } from '../../types/appointment'
import { AppointmentItem } from '../AppointmentItem/AppointmentItem'

type PeriodSectionProps = {
  id: PeriodId
  title: string
  range: string
  icon: ReactNode
  appointments: Appointment[]
}

/**
 * Seção de um período (Manhã, Tarde ou Noite).
 * Quando o período não tem agendamentos, mostra a mensagem padrão.
 */
export function PeriodSection({ id, title, range, icon, appointments }: PeriodSectionProps) {
  return (
    <section
      data-period={id}
      className="rounded-xl border border-line bg-card"
    >
      <header className="flex items-center justify-between gap-3 border-b border-line px-4 py-3">
        <h3 className="flex items-center gap-2 text-sm font-medium text-content-muted">
          <span className="text-accent-soft">{icon}</span>
          {title}
        </h3>
        <span className="text-xs text-content-subtle">{range}</span>
      </header>

      {appointments.length > 0 ? (
        <ul className="divide-y divide-line/70 p-1.5">
          {appointments.map((appointment) => (
            <AppointmentItem key={appointment.id} appointment={appointment} />
          ))}
        </ul>
      ) : (
        <p
          data-testid="empty-period"
          className="px-4 py-6 text-center text-sm text-content-subtle"
        >
          Você ainda não tem agendamentos cadastrados nesse período.
        </p>
      )}
    </section>
  )
}
