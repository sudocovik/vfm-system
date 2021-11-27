describe('Login', () => {
  it('should have a valid title', () => {
    cy.visit('/login')

    cy.title().should('match', /^Login/)
  })
})
