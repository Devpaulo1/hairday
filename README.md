# 💇 HairDay

Aplicação web de agendamento de cortes de cabelo, construída com **React**, **TypeScript**, **Vite** e **Tailwind CSS**, seguindo o protótipo do Figma.

![Interface desktop](docs/screenshots/hairday-desktop.png)

## ✨ Funcionalidades

- **Formulário de agendamento**: data, horário (13 horários fixos do protótipo) e nome do cliente.
- **Validação**: o cadastro só acontece com data, horário e nome preenchidos; o nome é limpo com `trim()`.
- **Agenda por dia**: os agendamentos são filtrados pela data selecionada no cabeçalho.
- **Três períodos**: Manhã (09h-12h), Tarde (13h-18h) e Noite (19h-21h), com ordenação crescente por horário.
- **Exclusão individual**: botão de lixeira com nome acessível (`aria-label="Excluir agendamento de [nome]"`).
- **Estado vazio**: cada período sem registros mostra a mensagem *"Você ainda não tem agendamentos cadastrados nesse período."*
- **Responsivo**: no desktop o formulário fica à esquerda e a agenda à direita; em telas menores os blocos viram uma coluna.

![Interface mobile](docs/screenshots/hairday-mobile.png)

## 🚀 Como executar

```bash
npm install
npm run dev      # servidor de desenvolvimento
npm run build    # build de produção (tsc -b && vite build)
npm run lint     # oxlint
npm run preview  # pré-visualiza o build
```

> **Atenção:** os dados ficam apenas em memória. Ao recarregar a página, a agenda volta a ser vazia.

## 🧠 Conceitos de React e TypeScript usados

| Conceito | Onde aparece | Para que serve |
| --- | --- | --- |
| `useState` | `AppointmentForm`, `App` | Guarda os campos do formulário e a data exibida na agenda |
| `createContext` / `useContext` | `context/ScheduleContext.ts`, `context/ScheduleProvider.tsx` | Compartilhar a lista de agendamentos entre componentes sem "prop drilling" |
| Custom hook | `hooks/useAppointments.ts` | Atalho tipado para consumir o contexto, com erro claro fora do Provider |
| Props tipadas | todos os componentes | Cada componente declara o que recebe (`type`) |
| `map()` | listas de horários e de agendamentos | Renderiza coleções |
| `filter()` | `AppointmentList` | Separos os registros da data selecionada |
| `reduce()` | `groupByPeriod` | Agrupa os agendamentos em Manhã, Tarde e Noite |
| Imutabilidade | `ScheduleProvider` | `setAppointments` sempre cria uma nova lista |

### Onde os dados moram

```
main.tsx
└── ScheduleProvider      ← guarda os agendamentos (useState)
    └── App
        ├── ScheduleSidebar
        │   └── AppointmentForm    ← usa useAppointments() para criar
        └── DateSelector + AppointmentList
            └── PeriodSection
                └── AppointmentItem  ← usa useAppointments() para excluir
```

O formulário **não** guarda a lista de agendamentos: ele apenas envia o novo registro ao contexto. A exclusão acontece direto no item da lista, pelo `id`.

## 🗂️ Estrutura de pastas

```text
src/
  components/
    AppointmentForm/     Formulário de criação
    AppointmentItem/     Linha da agenda (horário, cliente, lixeira)
    AppointmentList/     Lista do dia, agrupada por período
    DateSelector/        Seletor de data da agenda
    PeriodSection/       Seção Manhã / Tarde / Noite
    ScheduleSidebar/     Painel lateral (logo, título, formulário)
    Icons.tsx            Ícones SVG inline (sem biblioteca externa)
  context/
    ScheduleContext.ts   Criação do contexto e do tipo do valor
    ScheduleProvider.tsx Componente que guarda o estado
  hooks/
    useAppointments.ts   Hook para consumir o contexto
  types/
    appointment.ts       Tipo Appointment e PeriodId
  utils/
    appointmentHelpers.ts Períodos, horários, agrupamento, datas e id
  App.tsx
  main.tsx
  index.css              Tokens de design (@theme) e estilos base
```

## 🎨 Tokens de design

As cores foram extraídas do frame "Projeto" do Figma e transformadas em variáveis do Tailwind v4 (`@theme`), o que gera utilitários como `bg-surface` e `text-accent`.

| Token | Valor | Uso |
| --- | --- | --- |
| `surface` | `#19191b` | Fundo da aplicação e cards da agenda |
| `surface-raised` | `#2a292e` | Painel lateral |
| `surface-inset` | `#232325` | Campos de data e cliente |
| `surface-hover` | `#2f2d32` | Botões de horário |
| `line` | `#2e2c31` | Bordas |
| `accent` | `#b8952f` | Botão Agendar |
| `accent-soft` | `#c7a452` | Logo, ícones (calendário, usuário, lixeira, períodos) e horário selecionado |
| `content-strong` | `#ffffff` | Títulos |
| `content` | `#c7c7c9` | Horário do agendamento |
| `content-muted` | `#939395` | Nome do cliente e textos de apoio |
| `content-subtle` | `#6c6c6e` | Faixas de horário e estados vazios |

> Todos esses valores foram **amostrados pixel a pixel** no frame do Figma e conferidos contra os estilos computados da aplicação (ver tabela de fidelidade abaixo).

## 🔗 Protótipo

[Figma — Plataforma de agendamento (frame "Projeto", node 3-376)](https://www.figma.com/design/hirNhBBECqlfEjOfZk2Bpr/Plataforma-de-agendamento--Community---Copy---c%C3%B3pia-?node-id=3-376)

### Fidelidade com o protótipo

| Elemento | Figma | Implementação | Status |
| --- | --- | --- | --- |
| Cores de fundo, campos, chips e botão | `#19191b`, `#232325`, `#2f2d32`, `#b8952f` | idênticos (verificado nos estilos computados) | ✅ |
| Ícones (calendário, usuário, lixeira, períodos) | dourados | `#c7a452` | ✅ |
| Logo HairDay com tesoura | dourado | idêntico | ✅ |
| Botão AGENDAR (dourado, texto escuro) | `#b8952f` | idêntico | ✅ |
| Horários do protótipo (4 + 6 + 3) | 09:00-12:00, 13:00-18:00, 19:00-21:00 | idênticos | ✅ |
| Faixas dos períodos (`09h-12h`, `13h-18h`, `19h-21h`) | idênticas | idênticas | ✅ |
| Horário selecionado com borda dourada | dourado | idêntico | ✅ |
| Layout duas colunas no desktop | 380px + agenda | `380px 668px` | ✅ |
| Card do período com ícone, título e faixa | idêntico | idêntico | ✅ |
| Linha da agenda: horário, cliente, lixeira | idêntico | idêntico | ✅ |
| Formulário à esquerda, agenda à direita | sim | sim | ✅ |
| Empilhamento em telas pequenas | — | uma coluna | ✅ (adaptação) |
| Chips de horário já ocupados (esmaecidos) | sim | **não implementado** | ❌ desafio opcional |
| Tipografia geométrica do protótipo | fonte do Figma | `system-ui` | ⚠️ aproximação |
| Seta (chevron) no seletor de data | chevron | ícone nativo do navegador | ⚠️ aproximação acessível |

## 🧪 Testes executados

Testes manuais automatizados no navegador (dev server em `http://localhost:5174`):

| # | Verificação | Resultado |
| --- | --- | --- |
| 1 | A aplicação abre sem erros | ✅ console sem erros |
| 2 | Cadastro bloqueado sem nome/data/horário | ✅ mensagem "Preencha a data, o horário, o nome do cliente…" |
| 3 | Cadastro válido aparece na agenda sem recarregar | ✅ lista atualizada na hora |
| 4 | Agendamento aparece na data correta | ✅ filtro por data funciona |
| 5 | Trocar a data da agenda mostra só os registros do dia | ✅ apenas o registro da outra data some |
| 6 | Agendamento no período correto e em ordem crescente | ✅ 09:00 → 11:00 na Manhã |
| 7 | Período vazio mostra a mensagem exigida | ✅ texto exato |
| 8 | Excluir remove somente o item selecionado | ✅ os demais permanecem |
| 9 | Layout desktop e mobile | ✅ `grid-template-columns: 340px 1fr` no desktop; coluna única no mobile |
| 10 | Build e lint | ✅ `npm run build` e `npm run lint` sem erros |

**Limitações dos testes:**

- O **Playwright MCP não está disponível** neste ambiente. Os testes foram executados pela ferramenta de navegador (Chromium integrado), dirigindo o DOM e conferindo o estado renderizado — não há suíte de testes automatizados no repositório.
- A captura de desktop foi feita dentro de um `iframe` de 1400px (a janela do navegador do ambiente tem 912px de largura), por isso as fontes aparecem um pouco menores que o natural.
- Não há teste automatizado de acessibilidade completo; foi verificado manualmente: rótulos associados, `aria-label` na exclusão, `aria-pressed` nos horários, foco visível e navegação por teclado.

## 📚 Consultas ao Context7

| Biblioteca | Temas consultados |
| --- | --- |
| `reactjs/react.dev` | `createContext` + Provider + `useContext`; `useState` e inputs controlados; tipagem de contexto em TypeScript |
| `tailwindlabs/tailwindcss.com` | diretiva `@theme` para criar cores customizadas no Tailwind v4 |

## 📌 Observações do ambiente

- O **Smart App Control** do Windows bloqueia o binário nativo `lightningcss@1.33.0`. Por isso o projeto usa `tailwindcss@4.3.3` com o *override* `lightningcss@1.32.0` (versão liberada). Para voltar à 4.3.5, é preciso que o binário 1.33.0 seja liberado pelo sistema.
- Alterações no `vite.config.ts` exigem **reiniciar** o servidor de desenvolvimento para que o plugin do Tailwind seja aplicado.
