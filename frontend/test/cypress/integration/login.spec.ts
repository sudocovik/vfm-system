describe('Login', () => {
  it('should have a valid title', () => {
    cy.visit('/login')

    cy.validateTitle('Login')
  })
})
