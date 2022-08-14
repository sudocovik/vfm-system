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

  describe('Header', () => {
    it('should render "header" slot\'s content under QHeader', () => {
      const headerContent = 'Render me as a child of QHeader'

      cy.mount(MainLayout, {
        slots: {
          header: headerContent
        }
      })

      cy.dataCy('header').contains(headerContent).should('be.visible')
    })

    it('should not be styled (transparent background, text black)', () => {
      ComponentUnderTest.is(MainLayout).mount()

      cy.dataCy('header').as('header')
      cy.get('@header').should('have.backgroundColor', 'transparent')
      cy.get('@header').should('have.color', '#000')
    })
  })
})
