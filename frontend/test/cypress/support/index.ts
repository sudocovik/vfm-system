// ***********************************************************
// This example support/index.ts is processed and
// loaded automatically before your e2e test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************
/// <reference types="cypress" />

import './commands'

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Cypress {
    interface Chainable {
      /**
       * Custom command to validate page title.
       * No need to manually add generic suffix.
       * @example cy.validateTitle('Login') - Same as cy.title().should('equal', 'Login | Zara Fleet')
       */
      validateTitle(pageTitle: string): void
    }
  }
}
