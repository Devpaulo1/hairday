import { createContext } from 'react'
import type { Appointment } from '../types/appointment'

/**
 * O que o Provider entrega para a aplicação:
 * a lista de agendamentos e as ações de criar e remover.
 */
export type ScheduleContextValue = {
  appointments: Appointment[]
  addAppointment: (appointment: Appointment) => void
  removeAppointment: (id: string) => void
}

/**
 * O contexto em si não guarda dados: ele apenas descreve o "tipo" de
 * informação que será compartilhada. Os dados ficam no ScheduleProvider.
 *
 * Ele fica em um arquivo separado do Provider para não atrapalhar
 * o Fast Refresh do React (regra only-export-components do lint).
 */
export const ScheduleContext = createContext<ScheduleContextValue | null>(null)
