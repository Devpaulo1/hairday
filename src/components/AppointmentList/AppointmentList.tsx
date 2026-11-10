import { useAppointments } from '../../hooks/useAppointments'
import { PERIODS, groupByPeriod, sortByTime } from '../../utils/appointmentHelpers'
import { CloudSunIcon, MoonIcon, SunIcon } from '../Icons'
import { PeriodSection } from '../PeriodSection/PeriodSection'

const PERIOD_ICONS = {
  morning: SunIcon,
  afternoon: CloudSunIcon,
  evening: MoonIcon,
}

type AppointmentListProps = {
  date: string
}

/**
 * Lista os agendamentos da data selecionada, agrupados por período.
 *
 * filter() separa os registros do dia e groupByPeriod() (reduce)
 * distribui cada um em Manhã, Tarde ou Noite.
 */
export function AppointmentList({ date }: AppointmentListProps) {
  const { appointments } = useAppointments()

  const dailyAppointments = appointments.filter((appointment) => appointment.date === date)
  const grouped = groupByPeriod(dailyAppointments)

  return (
    <div className="mt-6 flex flex-col gap-4">
      {PERIODS.map((period) => {
        const Icon = PERIOD_ICONS[period.id]

        return (
          <PeriodSection
            key={period.id}
            title={period.title}
            range={period.range}
            icon={<Icon className="size-4" />}
            appointments={sortByTime(grouped[period.id])}
          />
        )
      })}
    </div>
  )
}
