import { mount } from '@cypress/vue'
import TheNavigation from '../TheNavigation.vue'
import { QDrawer, QIcon } from 'quasar'
import { inAllLanguages } from 'test/support/api'

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

    describe('Items', () => {
      const drawerItems = [
        {
          name: 'vehicles',
          url: '/',
          icon: 'mdi-truck'
        },
        {
          name: 'trailers',
          url: '/trailers',
          icon: 'mdi-truck-trailer'
        },
        {
          name: 'drivers',
          url: '/drivers',
          icon: 'mdi-account-tie-hat'
        },
        {
          name: 'services',
          url: '/services',
          icon: 'mdi-hammer-wrench'
        },
        {
          name: 'notifications',
          url: '/notifications',
          icon: 'mdi-bell'
        },
        {
          name: 'settings',
          url: '/settings',
          icon: 'mdi-cog'
        },
        {
          name: 'logout',
          url: '/logout',
          icon: 'mdi-power'
        }
      ]

      drawerItems.forEach((item, index) => {
        inAllLanguages.it(`should render "${item.name}" at position ${index + 1}`, t => {
          mountDesktopNavigation()

          cy.then(getDrawer)
            .then(getItem(index))
            .should(itemWrapper => {
              cy.wrap(itemWrapper).as('item')
              cy.get('@item').its('element').should('contain.text', t(item.name))
              cy.get('@item').its('element').get(`a[href="${item.url}"]`).should('exist')
              cy.get('@item').invoke('findComponent', QIcon).invoke('props', 'name').should('equal', item.icon)
            })
        })
      })
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

function getItem (index: number) {
  return (container: ReturnType<typeof Cypress.vueWrapper.getComponent>) => container.find(`[data-cy="item"]:nth-of-type(${index + 1})`)
}
