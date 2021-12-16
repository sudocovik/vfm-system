import { t } from 'boot/i18n'

describe('Login', () => {
  it('should have a valid title', () => {
    cy.visit('/login')

    cy.validateTitle(t('login'))
  })
})
