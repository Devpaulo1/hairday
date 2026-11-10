import { useCallback, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import type { Appointment } from '../types/appointment'
import { ScheduleContext } from './ScheduleContext'

type ScheduleProviderProps = {
  children: ReactNode
}

/**
 * Provider do contexto de agendamentos.
 * É aqui que a lista vive e onde as ações de criar e remover são definidas.
 */
export function ScheduleProvider({ children }: ScheduleProviderProps) {
  const [appointments, setAppointments] = useState<Appointment[]>([])

  // Cria um agendamento. A lista anterior é preservada (imutabilidade).
  const addAppointment = useCallback((appointment: Appointment) => {
    setAppointments((current) => [...current, appointment])
  }, [])

  // Remove apenas o agendamento cujo id foi informado.
  const removeAppointment = useCallback((id: string) => {
    setAppointments((current) => current.filter((appointment) => appointment.id !== id))
  }, [])

  // useMemo evita recriar o objeto de contexto a cada renderização.
  const value = useMemo(
    () => ({ appointments, addAppointment, removeAppointment }),
    [appointments, addAppointment, removeAppointment],
  )

  // No React 19 o Provider pode ser renderizado direto: <ScheduleContext value={...}>
  return <ScheduleContext value={value}>{children}</ScheduleContext>
}
