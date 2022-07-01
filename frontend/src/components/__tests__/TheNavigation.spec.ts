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

    it('should render mini drawer', () => {
      mountDesktopNavigation()

      cy.then(getDrawer)
        .then(drawer => drawer.props('mini') as boolean)
        .then(mini => cy.wrap(mini))
        .should('equal', true)
    })

    it('should force desktop behavior', () => {
      mountDesktopNavigation()

      cy.then(getDrawer)
        .then(drawer => drawer.props('behavior') as string)
        .then(behavior => cy.wrap(behavior))
        .should('equal', 'desktop')
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
