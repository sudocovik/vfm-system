import { defineConfig } from 'cypress'
import { devServer as webpackDevServer } from '@cypress/webpack-dev-server'
import { quasarWebpackConfig } from 'test/cypress/quasar-dev-server'
import DevServerConfig = Cypress.DevServerConfig

const devServer = async (devServerOptions: DevServerConfig) => webpackDevServer({
  ...devServerOptions,
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-call
  webpackConfig: await quasarWebpackConfig(),
  framework: 'vue'
})

export default defineConfig({
  downloadsFolder: 'test/cypress/downloads',
  fixturesFolder: 'test/cypress/fixtures',
  screenshotsFolder: 'test/cypress/screenshots',
  videosFolder: 'test/cypress/videos',
  video: false,
  screenshotOnRunFailure: false,

  e2e: {
    baseUrl: 'http://localhost/',
    specPattern: 'test/cypress/integration/**/*.cy.{js,jsx,ts,tsx}',
    supportFile: 'test/cypress/support/e2e.ts'
  },

  component: {
    supportFile: 'test/cypress/support/component.ts',
    specPattern: 'src/**/*.spec.ts',
    indexHtmlFile: 'test/cypress/support/component-index.html',
    devServer
  }
})
