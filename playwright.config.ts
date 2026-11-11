import { defineConfig, devices } from '@playwright/test'

/**
 * Configuração dos testes end-to-end.
 *
 * O canal `chrome` usa o Google Chrome já instalado na máquina, o que
 * dispensa o download de navegadores adicionais (e evita o bloqueio do
 * Smart App Control do Windows sobre binários recém-baixados).
 */
export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: 0,
  reporter: [['list'], ['html', { outputFolder: 'docs/playwright-report', open: 'never' }]],

  use: {
    baseURL: 'http://localhost:4174',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    locale: 'pt-BR',
  },

  projects: [
    {
      name: 'desktop',
      use: { ...devices['Desktop Chrome'], channel: 'chrome', viewport: { width: 1280, height: 1000 } },
    },
    {
      name: 'mobile',
      use: { ...devices['Pixel 7'], channel: 'chrome' },
    },
  ],

  // Sobe o servidor de desenvolvimento automaticamente para os testes.
  webServer: {
    command: 'npm run dev -- --port 4174 --strictPort',
    url: 'http://localhost:4174',
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
  },
})
