import { mount } from '@cypress/vue'
import TheNavigation from '../TheNavigation.vue'

describe('TheNavigation', () => {
  describe('Desktop version', () => {
    it('should render navigation drawer', () => {
      mountDesktopNavigation()

      cy.then(getDrawer)
        .then(drawer => cy.wrap(drawer.element))
        .should('be.visible')
    })
  })
})

function mountDesktopNavigation () {
  mount(TheNavigation)
}

function getDrawer () {
  return Cypress.vueWrapper.findComponent('[data-cy="drawer"]')
}
