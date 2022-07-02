import { ComponentUnderTest } from 'test/support/api'
import MainLayout from '../MainLayout.vue'

describe('MainLayout', () => {
  it('should render navigation', () => {
    ComponentUnderTest.is(MainLayout).mount()

    cy.dataCy('navigation').should('be.visible')
  })
})
