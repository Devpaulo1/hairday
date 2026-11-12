# Evidências de utilização do Context7 MCP

Este documento registra as consultas feitas ao **Context7 MCP** durante o desenvolvimento do HairDay,
com os trechos oficiais que orientaram cada decisão de código.

Ferramenta: `context7` (MCP) → `resolve-library-id` + `query-docs`.

---

## 1. React — Context API, `useState` e TypeScript

**Biblioteca resolvida:** `/reactjs/react.dev` (React.dev, documentação oficial — 5038 snippets, reputação High)

### Consulta 1.1

> **Query:** `How to create a context with createContext, provide it with a Provider and consume it with useContext`
> **Language:** TypeScript

**Trechos relevantes retornados:**

> ##### Description
> Wrap your components into a context provider to specify the context value for all components rendered inside.
> Starting in React 19, `<SomeContext>` can be rendered directly as a provider; older versions use `<SomeContext.Provider>`.

> ##### Caveats
> - `useContext()` call in a component is not affected by providers returned from the *same* component. The corresponding `<Context>` **needs to be *above*** the component doing the `useContext()` call.
> - React **automatically re-renders** all the children that use a particular context starting from the provider that receives a different `value`. The previous and the next values are compared with the `Object.is` comparison.

> ##### Type useContext with createContext and custom Hook
> ```tsx
> const ThemeContext = createContext<Theme>("system");
> const useGetTheme = () => useContext(ThemeContext);
> ```

**Como isso virou código:**

| Orientação oficial | Aplicação no HairDay |
| --- | --- |
| No React 19 o Provider pode ser renderizado direto | `src/context/ScheduleProvider.tsx` usa `<ScheduleContext value={value}>` |
| O Provider precisa estar **acima** de quem consome | `src/main.tsx` envolve `<App />` com `<ScheduleProvider>` |
| Criar um hook próprio para consumir | `src/hooks/useAppointments.ts` exporta `useAppointments()` |
| Tipar o contexto com `createContext<T | null>` | `createContext<ScheduleContextValue \| null>(null)` — permite detectar uso fora do Provider |

### Consulta 1.2

> **Query:** `useState hook controlled form inputs and updating state`
> **Language:** TypeScript

**Trechos relevantes retornados:**

> ##### Controlled input with useState, value, and onChange
> ```jsx
> function Form() {
>   const [firstName, setFirstName] = useState(''); // Declare a state variable...
>   return (
>     <input
>       value={firstName} // ...force the input's value to match the state variable...
>       onChange={e => setFirstName(e.target.value)} // ... and update the state variable on any edits!
>     />
>   );
> }
> ```

> ##### Manage form fields with separate state handlers in Form component
> Declare separate state variables and change handlers for each input field within a single component.

**Como isso virou código:**

- `AppointmentForm` usa `useState` **separado** para cada campo (`date`, `selectedTime`, `clientName`, `error`).
- Inputs controlados com `value` + `onChange` em `src/components/AppointmentForm/AppointmentForm.tsx`.
- O `onSubmit` usa `event.preventDefault()` para não recarregar a página.

---

## 2. Tailwind CSS v4 — tokens de cor com `@theme`

**Biblioteca resolvida:** `/tailwindlabs/tailwindcss.com` (Tailwind Labs — 2385 snippets, reputação High)

### Consulta 2.1

> **Query:** `Tailwind v4 @theme directive define custom colors and use them as utility classes`
> **Language:** CSS

**Trechos relevantes retornados:**

> ### Overview > What are theme variables?
> Theme variables are special CSS variables defined using the `@theme` directive that influence which utility classes exist in your project.
> For example, you can add a new color to your project by defining a theme variable like `--color-mint-500`:
> Now you can use utility classes like `bg-mint-500`, `text-mint-500`, or `fill-mint-500` in your HTML:

> ### CSS-first configuration
> The special `@theme` directive tells you to make new utilities and variants available based on those variables, letting you use classes like `3xl:text-neon-lime` in your markup.

> ### Adding custom colors with `@theme`
> ```css
> @theme {
>   --color-midnight: #121063;
>   --color-tahiti: #3ab7bf;
>   --color-bermuda: #78dcca;
> }
> ```

**Como isso virou código:**

- `src/index.css` declara o bloco `@theme` com os tokens extraídos do Figma
  (`--color-surface`, `--color-accent`, `--color-content-muted`…).
- Esses tokens geram as classes `bg-surface`, `text-accent-soft`, `border-line`, `divide-line/70`,
  `text-content-subtle/50` usadas em todos os componentes.
- A tipografia segue o mesmo caminho: `--font-sans: 'Inter', system-ui, ...` → classe `font-sans`.

### Consulta 2.2 (instalação)

> **Query:** `How to install Tailwind CSS v4 in a Vite project using the @tailwindcss/vite plugin`

**Trechos relevantes retornados:**

> ### First-party Vite plugin
> If you're a Vite user, you can now integrate Tailwind using [`@tailwindcss/vite`](https://tailwindcss.com/docs/installation/using-vite) instead of PostCSS:
> Tailwind CSS v4.0 is incredibly fast when used as a PostCSS plugin, but you'll get even better performance using the Vite plugin.

> ```ts
> // vite.config.ts
> import tailwindcss from "@tailwindcss/vite";
> export default defineConfig({ plugins: [tailwindcss()] });
> ```

**Como isso virou código:**

- `vite.config.ts` usa o plugin `@tailwindcss/vite` (mais rápido que PostCSS).
- `src/index.css` inicia com `@import "tailwindcss";`.

### Consulta 2.3 (tema claro/escuro)

> **Query:** `dark mode class variant custom-variant and theming with CSS variables @theme inline dynamic theme switching`
> **Language:** CSS

**Trechos relevantes retornados:**

> ### Configure dark mode with a class selector
> Override the `dark` variant in `app.css` using `@custom-variant` to apply dark styles when a `.dark` class is present on an ancestor element. In HTML, apply the `dark` class to the `html` root tag.
> ```css
> @custom-variant dark (&:where(.dark, .dark *));
> ```

> ### Referencing dynamic CSS variables with `@theme inline`
> Use `@theme inline` when defining theme colors that reference other CSS variables such as dynamic runtime root properties.
> ```css
> :root {
>   --acme-canvas-color: oklch(0.967 0.003 264.542);
> }
> [data-theme="dark"] {
>   --acme-canvas-color: oklch(0.21 0.034 264.665);
> }
> @theme inline {
>   --color-canvas: var(--acme-canvas-color);
> }
> ```

**Como isso virou código:**

- `src/index.css` define os dois temas em `:root` (claro) e `.dark` (escuro) com as variáveis `--app-*`.
- O bloco `@theme inline` espelha essas variáveis para os utilitários (`bg-surface` → `background-color: var(--app-surface)`),
  então **trocar de tema não exige re-renderizar nada em React** — só muda o valor da variável.
- `@custom-variant dark (&:where(.dark, .dark *))` permite usar `dark:` quando necessário.
- `src/hooks/useTheme.ts` alterna a classe `dark` no `<html>` e guarda a preferência em `localStorage`.
- `index.html` aplica o tema salvo **antes da primeira pintura** (script inline), evitando "flash" ao recarregar.

---

## Resumo

| Biblioteca | Consultas | Aplicação |
| --- | --- | --- |
| `/reactjs/react.dev` | Context API (`createContext`, `useContext`, Provider no React 19), `useState` com inputs controlados | `ScheduleContext.ts`, `ScheduleProvider.tsx`, `useAppointments.ts`, `AppointmentForm.tsx` |
| `/tailwindlabs/tailwindcss.com` | Instalação com `@tailwindcss/vite`, diretiva `@theme` para cores e fontes, tema claro/escuro com `@custom-variant dark` + `@theme inline` | `vite.config.ts`, `src/index.css`, `src/hooks/useTheme.ts`, `src/components/ThemeToggle/` |

> **Como reproduzir as consultas:** peça ao agente de IA para consultar o Context7 MCP com as
> perguntas listadas acima, ou consulte diretamente em
> <https://context7.com> usando os ids `/reactjs/react.dev` e `/tailwindlabs/tailwindcss.com`.
