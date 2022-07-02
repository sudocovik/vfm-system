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

      drawerItems.forEach(item => {
        inAllLanguages.it(`should render "${item.name}"`, t => {
          cy.then(getDrawer)
            .then(getItem(item.name))
            .should(itemWrapper => {
              cy.wrap(itemWrapper).as('item')
              cy.get('@item').its('element').should('contain.text', t(item.name))
              cy.get('@item').invoke('getComponent', QItem).invoke('props', 'to').should('equal', item.url)
              cy.get('@item').invoke('getComponent', QIcon).invoke('props', 'name').should('equal', item.icon)
            })
        })
      })

      const expectedOrder = drawerItems.map(item => item.name).join(',')
      it(`should render in specific order: ${expectedOrder}`, () => {
        const actualOrder: string[] = []
        cy.get('[data-cy="drawer"] [data-cy^="item-"]')
          .each($item => {
            const dataCy = $item.attr('data-cy') ?? ''
            const name = dataCy.replace('item-', '')
            actualOrder.push(name)
          })
          .then(() => cy.wrap(actualOrder.join(',')))
          .should('equal', expectedOrder)
      })
    })
  })
})

function getDrawer () {
  return Cypress.vueWrapper.getComponent(QDrawer)
}

function getItem (id: string) {
  return (container: ReturnType<typeof Cypress.vueWrapper.getComponent>) => container.find(`[data-cy="item-${id}"]`)
}
