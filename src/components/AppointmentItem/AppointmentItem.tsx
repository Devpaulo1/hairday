import { useAppointments } from '../../hooks/useAppointments'
import type { Appointment } from '../../types/appointment'
import { TrashIcon } from '../Icons'

type AppointmentItemProps = {
  appointment: Appointment
}

/**
 * Uma linha da agenda: horário, nome do cliente e o botão de exclusão.
 * A exclusão acontece pelo id, direto no Context API.
 */
export function AppointmentItem({ appointment }: AppointmentItemProps) {
  const { removeAppointment } = useAppointments()

  return (
    <li
      data-testid="appointment-item"
      className="flex items-center gap-3 rounded-md px-2 py-2.5 transition-colors hover:bg-surface-raised"
    >
      <span className="w-12 shrink-0 text-sm font-semibold text-content">{appointment.time}</span>
      <span className="flex-1 truncate text-sm text-content-muted">{appointment.clientName}</span>

      <button
        type="button"
        onClick={() => removeAppointment(appointment.id)}
        aria-label={`Excluir agendamento de ${appointment.clientName}`}
        className="rounded-md p-2 text-accent-soft transition-colors hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
      >
        <TrashIcon className="size-4" />
      </button>
    </li>
  )
}
