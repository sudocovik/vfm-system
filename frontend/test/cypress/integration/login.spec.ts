import { t } from 'boot/i18n'

describe('Login', () => {
  it('should have a valid title', () => {
    cy.visit('/login')

    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    cy.validateTitle(t('login'))
  })
})
