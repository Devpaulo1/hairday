import type { Appointment, PeriodId } from '../types/appointment'

/**
 * Dados fixos dos períodos: título, faixa de horário exibida
 * no cabeçalho da agenda e os horários disponíveis (do Figma).
 */
export const PERIODS: Array<{
  id: PeriodId
  title: string
  range: string
  times: string[]
}> = [
  {
    id: 'morning',
    title: 'Manhã',
    range: '09h-12h',
    times: ['09:00', '10:00', '11:00', '12:00'],
  },
  {
    id: 'afternoon',
    title: 'Tarde',
    range: '13h-18h',
    times: ['13:00', '14:00', '15:00', '16:00', '17:00', '18:00'],
  },
  {
    id: 'evening',
    title: 'Noite',
    range: '19h-21h',
    times: ['19:00', '20:00', '21:00'],
  },
]

/** Todos os horários disponíveis, do menor para o maior. */
export const AVAILABLE_TIMES = PERIODS.flatMap((period) => period.times)

/**
 * Descobre o período de um horário no formato HH:mm.
 * Como o texto é comparado como número, "09:00" vira 9 e "13:00" vira 13.
 */
export function getPeriodByTime(time: string): PeriodId {
  const hour = Number(time.slice(0, 2))

  if (hour < 13) return 'morning'
  if (hour < 19) return 'afternoon'
  return 'evening'
}

/**
 * Agrupa os agendamentos por período (equivalente a um reduce).
 * Cada agendamento cai em exatamente um período.
 */
export function groupByPeriod(appointments: Appointment[]): Record<PeriodId, Appointment[]> {
  const grouped: Record<PeriodId, Appointment[]> = {
    morning: [],
    afternoon: [],
    evening: [],
  }

  for (const appointment of appointments) {
    grouped[getPeriodByTime(appointment.time)].push(appointment)
  }

  return grouped
}

/** Ordena os agendamentos por horário, do menor para o maior. */
export function sortByTime(appointments: Appointment[]): Appointment[] {
  return [...appointments].sort((a, b) => a.time.localeCompare(b.time))
}

/** Converte uma data em YYYY-MM-DD usando o fuso local do navegador. */
export function toISODate(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

/** Data de hoje no formato YYYY-MM-DD. */
export function todayISO(): string {
  return toISODate(new Date())
}

/** Formata YYYY-MM-DD como DD/MM/YYYY. */
export function formatDateBR(isoDate: string): string {
  const [year, month, day] = isoDate.split('-')

  return `${day}/${month}/${year}`
}

/** Gera um id único para cada agendamento. */
export function createId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID()
  }

  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`
}
