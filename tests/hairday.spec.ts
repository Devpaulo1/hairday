import { expect, test } from '@playwright/test'
import type { Page } from '@playwright/test'

/**
 * Testes end-to-end do HairDay.
 *
 * Cada teste roda em uma página nova, então a lista de agendamentos
 * (que vive em memória, no Context API) começa vazia.
 */

const EMPTY_PERIOD_MESSAGE = 'Você ainda não tem agendamentos cadastrados nesse período.'

/** Cria um agendamento pelo formulário. */
async function createAppointment(
  page: Page,
  { date, time, name }: { date: string; time: string; name: string },
) {
  await page.locator('#appointment-date').fill(date)
  await page.getByRole('button', { name: time, exact: true }).click()
  await page.locator('#client-name').fill(name)
  await page.getByRole('button', { name: 'Agendar', exact: true }).click()
}

/** Lê os agendamentos (horário + nome) de um período da agenda. */
async function readPeriod(page: Page, period: 'morning' | 'afternoon' | 'evening') {
  const section = page.locator(`[data-period="${period}"]`)

  return section.locator('[data-testid="appointment-item"]').evaluateAll((items) =>
    items.map((item) => ({
      time: item.querySelector('span')?.textContent?.trim() ?? '',
      name: item.querySelectorAll('span')[1]?.textContent?.trim() ?? '',
    })),
  )
}

test.beforeEach(async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('heading', { name: 'Agende um atendimento' })).toBeVisible()
})

test('1. A aplicação abre sem erros no console', async ({ page }) => {
  const errors: string[] = []
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(message.text())
  })
  page.on('pageerror', (error) => errors.push(error.message))

  await page.reload()

  await expect(page).toHaveTitle('HairDay - Sua agenda')
  await expect(page.getByRole('heading', { name: 'Sua agenda' })).toBeVisible()
  expect(errors).toEqual([])
})

test('2. O formulário impede o cadastro com campos ausentes', async ({ page }) => {
  await page.getByRole('button', { name: 'Agendar', exact: true }).click()

  await expect(page.getByRole('alert')).toContainText('Preencha')
  await expect(page.getByTestId('appointment-item')).toHaveCount(0)
})

test('2b. O nome preenchido só com espaços é recusado', async ({ page }) => {
  await page.getByRole('button', { name: '10:00', exact: true }).click()
  await page.locator('#client-name').fill('    ')
  await page.getByRole('button', { name: 'Agendar', exact: true }).click()

  await expect(page.getByRole('alert')).toContainText('nome do cliente')
  await expect(page.getByTestId('appointment-item')).toHaveCount(0)
})

test('3. Um cadastro válido aparece na agenda sem recarregar a página', async ({ page }) => {
  // Marca a página para provar que não houve reload.
  await page.evaluate(() => {
    ;(window as unknown as { __naoRecarregou?: boolean }).__naoRecarregou = true
  })

  await createAppointment(page, { date: '2026-11-10', time: '10:00', name: 'Ana Souza' })

  await expect(page.getByTestId('appointment-item')).toHaveCount(1)
  await expect(page.getByTestId('appointment-item')).toContainText('Ana Souza')

  const naoRecarregou = await page.evaluate(
    () => (window as unknown as { __naoRecarregou?: boolean }).__naoRecarregou,
  )
  expect(naoRecarregou).toBe(true)
})

test('4. O agendamento aparece na data correta', async ({ page }) => {
  await createAppointment(page, { date: '2026-11-10', time: '10:00', name: 'Dia 10' })

  // Depois do cadastro a agenda muda sozinha para a data criada.
  await expect(page.locator('#agenda-date')).toHaveValue('2026-11-10')
  await expect(page.getByTestId('appointment-item')).toHaveCount(1)
  await expect(page.getByTestId('appointment-item')).toContainText('Dia 10')

  // Ao criar em outra data, a agenda passa a mostrar aquela data.
  await createAppointment(page, { date: '2026-11-12', time: '14:00', name: 'Dia 12' })
  await expect(page.locator('#agenda-date')).toHaveValue('2026-11-12')
  await expect(page.getByTestId('appointment-item')).toHaveCount(1)
  await expect(page.getByTestId('appointment-item')).toContainText('Dia 12')
})

test('5. Trocar a data da agenda mostra apenas os registros daquele dia', async ({ page }) => {
  await createAppointment(page, { date: '2026-11-10', time: '10:00', name: 'Dia 10' })
  await createAppointment(page, { date: '2026-11-12', time: '14:00', name: 'Dia 12' })

  await page.locator('#agenda-date').fill('2026-11-10')
  await expect(page.getByTestId('appointment-item')).toHaveCount(1)
  await expect(page.getByTestId('appointment-item')).toContainText('Dia 10')

  await page.locator('#agenda-date').fill('2026-11-12')
  await expect(page.getByTestId('appointment-item')).toHaveCount(1)
  await expect(page.getByTestId('appointment-item')).toContainText('Dia 12')
})

test('6. Os registros ficam no período correto e em ordem crescente', async ({ page }) => {
  await createAppointment(page, { date: '2026-11-10', time: '21:00', name: 'Noite' })
  await createAppointment(page, { date: '2026-11-10', time: '09:00', name: 'Manha 9' })
  await createAppointment(page, { date: '2026-11-10', time: '13:00', name: 'Tarde 13' })
  await createAppointment(page, { date: '2026-11-10', time: '11:00', name: 'Manha 11' })

  await page.locator('#agenda-date').fill('2026-11-10')

  const manha = await readPeriod(page, 'morning')
  const tarde = await readPeriod(page, 'afternoon')
  const noite = await readPeriod(page, 'evening')

  expect(manha.map((item) => item.time)).toEqual(['09:00', '11:00'])
  expect(manha.map((item) => item.name)).toEqual(['Manha 9', 'Manha 11'])
  expect(tarde.map((item) => item.time)).toEqual(['13:00'])
  expect(noite.map((item) => item.time)).toEqual(['21:00'])
})

test('7. Período vazio mostra exatamente a mensagem exigida', async ({ page }) => {
  await createAppointment(page, { date: '2026-11-10', time: '09:00', name: 'Só manhã' })

  await page.locator('#agenda-date').fill('2026-11-10')

  await expect(page.getByTestId('empty-period')).toHaveCount(2)
  await expect(page.getByTestId('empty-period').first()).toHaveText(EMPTY_PERIOD_MESSAGE)
})

test('8. Excluir remove somente o agendamento selecionado', async ({ page }) => {
  await createAppointment(page, { date: '2026-11-10', time: '09:00', name: 'Bruno Lima' })
  await createAppointment(page, { date: '2026-11-10', time: '11:00', name: 'Diego Alves' })
  await createAppointment(page, { date: '2026-11-10', time: '21:00', name: 'Carla Dias' })

  await page.locator('#agenda-date').fill('2026-11-10')
  await expect(page.getByTestId('appointment-item')).toHaveCount(3)

  await page.getByRole('button', { name: 'Excluir agendamento de Diego Alves' }).click()

  await expect(page.getByTestId('appointment-item')).toHaveCount(2)
  await expect(page.getByTestId('appointment-item').filter({ hasText: 'Diego Alves' })).toHaveCount(0)
  await expect(page.getByTestId('appointment-item').filter({ hasText: 'Bruno Lima' })).toHaveCount(1)
  await expect(page.getByTestId('appointment-item').filter({ hasText: 'Carla Dias' })).toHaveCount(1)
})

test('9. Horário já agendado fica indisponível no formulário', async ({ page }) => {
  await createAppointment(page, { date: '2026-11-10', time: '10:00', name: 'Ana Souza' })

  const chip = page.getByRole('button', { name: '10:00', exact: true })
  await expect(chip).toBeDisabled()
  await expect(chip).toHaveAttribute('title', 'Horário já agendado')

  // Em outra data o mesmo horário volta a ficar disponível.
  await page.locator('#appointment-date').fill('2026-11-11')
  await expect(chip).toBeEnabled()
})

test('10. O layout é responsivo: duas colunas no desktop e uma no mobile', async ({ page }, testInfo) => {
  const main = page.locator('main')

  if (testInfo.project.name === 'desktop') {
    // Duas colunas: formulário (380px) e agenda (restante do espaço).
    const columns = await main.evaluate((element) =>
      getComputedStyle(element).gridTemplateColumns.split(' '),
    )
    expect(columns).toHaveLength(2)
    expect(columns[0]).toBe('380px')
  } else {
    // No mobile os dois blocos ficam empilhados (uma coluna).
    const columns = await main.evaluate(
      (element) => getComputedStyle(element).gridTemplateColumns.split(' ').length,
    )
    expect(columns).toBe(1)

    // E sem rolagem horizontal.
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    )
    expect(overflow).toBeLessThanOrEqual(0)
  }
})
