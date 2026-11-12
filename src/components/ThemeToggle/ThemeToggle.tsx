import { useTheme } from '../../hooks/useTheme'
import { MoonIcon, SunIcon } from '../Icons'

/**
 * Botão que alterna entre o tema claro e o escuro.
 * O tema aplicado fica na classe `dark` do elemento <html>.
 */
export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()

  const isDark = theme === 'dark'
  const label = isDark ? 'Mudar para o tema claro' : 'Mudar para o tema escuro'

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={label}
      title={label}
      className="rounded-md border border-line bg-surface-inset p-2 text-content-muted transition-colors hover:border-accent hover:text-accent-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
    >
      {isDark ? <SunIcon className="size-4" /> : <MoonIcon className="size-4" />}
    </button>
  )
}
