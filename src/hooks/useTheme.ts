import { useCallback, useState } from 'react'

export type Theme = 'light' | 'dark'

const STORAGE_KEY = 'hairday-theme'

/**
 * Lê o tema aplicado no <html>.
 *
 * O index.html já aplica o tema salvo (ou o padrão escuro) antes da primeira
 * pintura, então aqui só precisamos ler o que está na página — sem "flash".
 */
function readCurrentTheme(): Theme {
  if (typeof document === 'undefined') return 'dark'

  return document.documentElement.classList.contains('dark') ? 'dark' : 'light'
}

/**
 * Guarda a preferência de tema (apenas o tema — os agendamentos continuam
 * em memória, como definido no AGENTS.md).
 */
export function useTheme() {
  const [theme, setTheme] = useState<Theme>(readCurrentTheme)

  const applyTheme = useCallback((nextTheme: Theme) => {
    document.documentElement.classList.toggle('dark', nextTheme === 'dark')

    try {
      window.localStorage.setItem(STORAGE_KEY, nextTheme)
    } catch {
      // Navegador em modo privado: seguimos sem persistir a preferência.
    }
  }, [])

  const toggleTheme = useCallback(() => {
    setTheme((current) => {
      const nextTheme = current === 'dark' ? 'light' : 'dark'
      applyTheme(nextTheme)

      return nextTheme
    })
  }, [applyTheme])

  return { theme, toggleTheme }
}
