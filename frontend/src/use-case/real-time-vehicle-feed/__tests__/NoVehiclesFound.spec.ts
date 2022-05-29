import { ComponentUnderTest, inAllLanguages } from 'test/support/api'
import NoVehiclesFound from '../NoVehiclesFound.vue'
import { QIcon } from 'quasar'

describe('NoVehiclesFound', () => {
  it('should render large icon', () => {
    ComponentUnderTest.is(NoVehiclesFound).mount()

    cy.then(() => Cypress.vueWrapper.findComponent(QIcon))
      .then(icon => icon.props('size') as string)
      .then(size => cy.wrap(size))
      .should('equal', '180px')
  })

  it('should have an element describing current state', () => {
    ComponentUnderTest.is(NoVehiclesFound).mount()

    cy.dataCy('current-state').should('be.visible')
  })

  it('should have an element describing what the next steps are', () => {
    ComponentUnderTest.is(NoVehiclesFound).mount()

    cy.dataCy('next-steps').should('be.visible')
  })

  it('should have a slightly larger text for current state description', () => {
    ComponentUnderTest.is(NoVehiclesFound).mount()

    cy.dataCy('current-state').should('have.class', 'text-h5')
  })

  inAllLanguages.it('should render message describing what is the problem', t => {
    ComponentUnderTest.is(NoVehiclesFound).mount()

    cy.dataCy('current-state').should('have.text', t('ordering-gps-trackers'))
    cy.dataCy('next-steps').should('have.text', t('gps-ordering-notification'))
  })
})
