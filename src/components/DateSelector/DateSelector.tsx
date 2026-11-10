import { CalendarIcon } from '../Icons'

type DateSelectorProps = {
  date: string
  onDateChange: (date: string) => void
}

/**
 * Cabeçalho da agenda: título, texto de apoio e o seletor da data exibida.
 */
export function DateSelector({ date, onDateChange }: DateSelectorProps) {
  return (
    <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <h2 className="text-xl font-semibold text-content-strong md:text-2xl">Sua agenda</h2>
        <p className="mt-2 text-sm text-content-muted">
          Consulte os seus cortes de cabelo agendados por dia
        </p>
      </div>

      <div className="relative sm:w-48">
        <label htmlFor="agenda-date" className="sr-only">
          Data exibida na agenda
        </label>
        <CalendarIcon className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-accent-soft" />
        <input
          id="agenda-date"
          type="date"
          value={date}
          onChange={(event) => onDateChange(event.target.value)}
          className="w-full rounded-md border border-line bg-surface py-2.5 pl-10 pr-3 text-sm text-content transition-colors focus-visible:border-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        />
      </div>
    </header>
  )
}
