// ***********************************************************
// This example support/unit.ts is processed and
// loaded automatically before your unit test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'component.supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

import './commands'
import './assertions/colors'

import { Cookies, Dialog, Notify, Quasar } from 'quasar'
import { mount } from 'cypress/vue'
// Change this if you have a different entrypoint for the main scss.
import 'src/css/app.sass'
// Quasar styles
import 'quasar/src/css/index.sass'

// ICON SETS
// If you use multiple or different icon-sets then the default, be sure to import them here.
import 'quasar/dist/icon-set/mdi-v6.umd.prod'
import '@quasar/extras/mdi-v6/mdi-v6.css'

import { i18n } from 'src/boot/i18n'
import { MountingOptions } from 'cypress/vue/dist/@vue/test-utils'

type MountParams = Parameters<typeof mount>
type OptionsParam = MountParams[1]

Cypress.Commands.add('mount', (component, options: MountingOptions<unknown> = {}) => {
  options.global = options.global || {}
  options.global.stubs = options.global.stubs || {}
  options.global.components = options.global.components || {}
  options.global.plugins = options.global.plugins || []
  options.global.mocks = options.global.mocks || {}

  options.global.plugins.unshift([Quasar, { plugins: { Notify, Dialog, Cookies } }])
  options.global.plugins.push(i18n)

  return mount(component, options)
})

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Cypress {
    interface Chainable {
      /**
       * Helper mount function for Vue Components
       * @param component Vue Component or JSX Element to mount
       * @param options Options passed to Vue Test Utils
       */
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      mount(component: any, options?: OptionsParam): Chainable<any>
    }
  }
}
