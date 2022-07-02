import { mountCallback } from '@cypress/vue'
import TheNavigation from '../TheNavigation.vue'
import { QDrawer, QIcon, QItem, QLayout } from 'quasar'
import { inAllLanguages } from 'test/support/api'
import { h } from 'vue'

describe('TheNavigation', () => {
  describe('Desktop version', () => {
    beforeEach(mountCallback(h(QLayout, () => h(TheNavigation))))

    it('should render a QDrawer component', () => {
      cy.then(getDrawer)
        .then(drawer => cy.wrap(drawer.element))
        .get('[data-cy="drawer"]')
        .should('be.visible')
    })

    it('should render mini drawer', () => {
      cy.then(getDrawer)
        .then(drawer => drawer.props('mini') as boolean)
        .then(mini => cy.wrap(mini))
        .should('equal', true)
    })

    it('should force desktop behavior', () => {
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
          cy.then(getDrawer)
            .then(getItem(index))
            .should(itemWrapper => {
              cy.wrap(itemWrapper).as('item')
              cy.get('@item').its('element').should('contain.text', t(item.name))
              cy.get('@item').invoke('getComponent', QItem).invoke('props', 'to').should('equal', item.url)
              cy.get('@item').invoke('getComponent', QIcon).invoke('props', 'name').should('equal', item.icon)
            })
        })
      })
    })
  })
})

function getDrawer () {
  return Cypress.vueWrapper.getComponent(QDrawer)
}

function getItem (index: number) {
  return (container: ReturnType<typeof Cypress.vueWrapper.getComponent>) => container.find(`[data-cy="item"]:nth-of-type(${index + 1})`)
}
