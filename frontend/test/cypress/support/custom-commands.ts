Cypress.Commands.add('validateTitle', (pageTitle: string) => {
  cy.title().should('equal', `${pageTitle} | Zara Fleet`)
})
