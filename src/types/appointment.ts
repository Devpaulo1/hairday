/**
 * Modelo de dados de um agendamento.
 *
 * `date` segue o formato YYYY-MM-DD e `time` o formato HH:mm.
 * Esse formato foi escolhido porque ordena corretamente com
 * comparação de texto (string), sem precisar de objetos Date.
 */
export type Appointment = {
  id: string
  clientName: string
  date: string
  time: string
}

/** Os três períodos do dia usados na agenda. */
export type PeriodId = 'morning' | 'afternoon' | 'evening'
