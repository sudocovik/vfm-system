/// <reference types="cypress" />

// eslint-disable-next-line @typescript-eslint/no-namespace
namespace Cypress {
  // eslint-disable-next-line no-unused-vars
  interface Chainable {
    /**
     * Custom command to validate page title.
     * No need to manually add generic suffix.
     * @example cy.validateTitle('Login') - Same as cy.title().should('equal', 'Login | Zara Fleet')
     */
    validateTitle(pageTitle: string): void
  }
}

Cypress.Commands.add('validateTitle', (pageTitle: string) => {
  cy.title().should('equal', `${pageTitle} | Zara Fleet`)
})
