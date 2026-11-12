import { useState } from 'react'
import type { FormEvent } from 'react'
import { useAppointments } from '../../hooks/useAppointments'
import { PERIODS, createId, todayISO } from '../../utils/appointmentHelpers'
import { CalendarIcon, InfoIcon, UserIcon } from '../Icons'

type AppointmentFormProps = {
  /** Avisa qual data foi criada para a agenda trocar a data exibida. */
  onAppointmentCreated: (date: string) => void
}

/**
 * Formulário de criação de agendamento.
 *
 * Os campos usam useState (estado local do formulário).
 * A lista de agendamentos NÃO fica aqui: ela vive no Context API.
 */
export function AppointmentForm({ onAppointmentCreated }: AppointmentFormProps) {
  const { appointments, addAppointment } = useAppointments()

  const [date, setDate] = useState(todayISO())
  const [selectedTime, setSelectedTime] = useState('')
  const [clientName, setClientName] = useState('')
  const [error, setError] = useState('')

  /**
   * Descobre se um horário já está ocupado na data informada.
   * É o que faz o chip aparecer apagado, como no protótipo do Figma.
   */
  function isTimeBooked(targetDate: string, time: string) {
    return appointments.some(
      (appointment) => appointment.date === targetDate && appointment.time === time,
    )
  }

  function handleDateChange(nextDate: string) {
    setDate(nextDate)

    // Se o horário escolhido já estiver ocupado na nova data, limpamos a seleção.
    if (selectedTime && isTimeBooked(nextDate, selectedTime)) {
      setSelectedTime('')
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    // Impede o recarregamento da página ao enviar o formulário.
    event.preventDefault()

    const name = clientName.trim()
    const missing: string[] = []

    if (!date) missing.push('a data')
    if (!selectedTime) missing.push('o horário')
    if (!name) missing.push('o nome do cliente')

    if (missing.length > 0) {
      setError(`Preencha ${missing.join(', ')} para criar o agendamento.`)
      return
    }

    // Trava extra: mesmo que o chip esteja marcado, o horário ocupado não entra.
    if (isTimeBooked(date, selectedTime)) {
      setError('Este horário já está agendado. Escolha outro horário.')
      return
    }

    setError('')
    addAppointment({ id: createId(), clientName: name, date, time: selectedTime })

    // A agenda passa a mostrar a data do agendamento recém-criado.
    onAppointmentCreated(date)

    // Limpamos os campos que podem ser preenchidos de novo.
    setClientName('')
    setSelectedTime('')
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-6" noValidate>
      <div>
        <label htmlFor="appointment-date" className="block text-sm font-medium text-content-strong">
          Data
        </label>
        <div className="relative mt-2">
          <CalendarIcon className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-accent-soft" />
          <input
            id="appointment-date"
            type="date"
            value={date}
            onChange={(event) => handleDateChange(event.target.value)}
            className="w-full rounded-md border border-line bg-surface-inset py-2.5 pl-10 pr-3 text-sm text-content transition-colors focus-visible:border-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          />
        </div>
      </div>

      <fieldset>
        <legend className="text-sm font-medium text-content-strong">Horários</legend>
        <p className="mt-1 text-xs text-content-subtle">
          Horários já agendados na data selecionada ficam indisponíveis.
        </p>

        {PERIODS.map((period) => (
          <div key={period.id} className="mt-4">
            <p className="text-xs font-medium uppercase tracking-wide text-content-muted">
              {period.title}
            </p>
            <div className="mt-2 grid grid-cols-4 gap-2">
              {period.times.map((time) => {
                const isBooked = isTimeBooked(date, time)
                const isSelected = selectedTime === time

                return (
                  <button
                    key={time}
                    type="button"
                    onClick={() => setSelectedTime(time)}
                    disabled={isBooked}
                    aria-pressed={isSelected}
                    title={isBooked ? 'Horário já agendado' : undefined}
                    className={`rounded-md border px-2 py-2 text-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
                      isBooked
                        ? 'cursor-not-allowed border-line/50 bg-surface-hover/40 text-content-subtle/50'
                        : isSelected
                          ? 'border-accent bg-surface-hover text-accent-soft'
                          : 'border-line bg-surface-hover text-content-muted hover:border-content-subtle hover:text-content'
                    }`}
                  >
                    {time}
                  </button>
                )
              })}
            </div>
          </div>
        ))}
      </fieldset>

      <div>
        <label htmlFor="client-name" className="block text-sm font-medium text-content-strong">
          Cliente
        </label>
        <div className="relative mt-2">
          <UserIcon className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-accent-soft" />
          <input
            id="client-name"
            type="text"
            value={clientName}
            onChange={(event) => setClientName(event.target.value)}
            placeholder="Nome do cliente"
            className="w-full rounded-md border border-line bg-surface-inset py-2.5 pl-10 pr-3 text-sm text-content placeholder:text-content-subtle transition-colors focus-visible:border-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          />
        </div>
      </div>

      {error && (
        <p
          role="alert"
          className="flex items-start gap-2 rounded-md border border-danger/40 bg-danger/10 p-3 text-sm text-danger"
        >
          <InfoIcon className="mt-0.5 size-4 shrink-0" />
          {error}
        </p>
      )}

      <button
        type="submit"
        className="w-full rounded-md bg-accent px-4 py-3 text-sm font-semibold uppercase tracking-wide text-on-accent transition-colors hover:bg-accent-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
      >
        Agendar
      </button>
    </form>
  )
}
