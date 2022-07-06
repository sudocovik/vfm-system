import { ComponentUnderTest } from 'test/support/api'
import MainLayout from '../MainLayout.vue'
import TheNavigation from 'components/TheNavigation.vue'

describe('MainLayout', () => {
  it('should render navigation', () => {
    ComponentUnderTest.is(MainLayout).mount()

    cy.then(() => Cypress.vueWrapper.getComponent(TheNavigation))
      .then(component => component.element)
      .then(element => cy.wrap(element))
      .should('be.visible')
  })
})
