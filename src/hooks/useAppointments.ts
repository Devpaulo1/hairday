import { useContext } from 'react'
import { ScheduleContext } from '../context/ScheduleContext'

/**
 * Atalho para consumir o contexto de agendamentos.
 * Se o hook for usado fora do ScheduleProvider, mostramos um erro claro.
 */
export function useAppointments() {
  const context = useContext(ScheduleContext)

  if (context === null) {
    throw new Error('useAppointments precisa ser usado dentro de um ScheduleProvider')
  }

  return context
}
