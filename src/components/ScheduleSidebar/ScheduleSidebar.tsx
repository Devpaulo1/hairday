import type { ReactNode } from 'react'
import { ScissorsIcon } from '../Icons'

type ScheduleSidebarProps = {
  children: ReactNode
}

/**
 * Painel lateral: identidade HairDay, título e o formulário de agendamento.
 */
export function ScheduleSidebar({ children }: ScheduleSidebarProps) {
  return (
    <aside className="rounded-2xl bg-surface-raised p-6 shadow-[0_18px_40px_-24px_rgba(0,0,0,0.9)] md:p-8">
      <header>
        <p className="flex items-center gap-2 text-lg font-semibold tracking-tight text-accent-soft">
          <ScissorsIcon className="size-5" />
          HairDay
        </p>

        <h1 className="mt-8 text-xl font-semibold text-content-strong md:text-2xl">
          Agende um atendimento
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-content-muted">
          Selecione data, horário e informe o nome do cliente para criar o agendamento
        </p>
      </header>

      {children}
    </aside>
  )
}
