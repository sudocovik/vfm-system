import { mount } from '@cypress/vue'
import TheNavigation from '../TheNavigation.vue'
import { QDrawer } from 'quasar'

describe('TheNavigation', () => {
  describe('Desktop version', () => {
    it('should render navigation drawer', () => {
      mountDesktopNavigation()

      cy.dataCy('drawer').should('be.visible')
    })

    it('should be a QDrawer component', () => {
      mountDesktopNavigation()

      cy.then(getDrawer)
        .then(drawer => drawer.attributes('data-cy'))
        .should('equal', 'drawer')
    })
  })
})

function mountDesktopNavigation () {
  mount(TheNavigation, {
    global: {
      renderStubDefaultSlot: true,
      stubs: {
        QDrawer: true
      }
    }
  })
}

function getDrawer () {
  return Cypress.vueWrapper.getComponent(QDrawer)
}
