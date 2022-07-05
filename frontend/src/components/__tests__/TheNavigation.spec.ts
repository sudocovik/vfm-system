import { mountCallback } from '@cypress/vue'
import TheNavigation from '../TheNavigation.vue'
import { QDrawer, QIcon, QItem, QLayout } from 'quasar'
import { AvailableSlots, inAllLanguages } from 'test/support/api'
import { h } from 'vue'
import logo from 'src/assets/logo.svg'

const DESKTOP_SIZE = { width: 601, height: 600 }
// const MOBILE_SIZE = { width: 600, height: 500 }

const mountingOptions = {
  global: {
    stubs: {
      QTooltip: {
        render ({ $slots }: AvailableSlots) {
          return h('div', { style: 'display: none' }, $slots.default())
        }
      }
    },
    renderStubDefaultSlot: true
  }
}

describe('TheNavigation', () => {
  describe('Desktop version', () => {
    beforeEach(() => cy.viewport(DESKTOP_SIZE.width, DESKTOP_SIZE.height))
    beforeEach(mountCallback(h(QLayout, () => h(TheNavigation)), mountingOptions))

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

    it('should be scrollable if content is too long', () => {
      cy.viewport(DESKTOP_SIZE.width, 150)
      cy.dataCy('scrollable-area').get('.q-scrollarea__container').as('scrollable')
      cy.dataCy('logo').as('logo')
      cy.dataCy('item-logout').as('logout')

      cy.get('@logo').should('be.visible')
      cy.get('@logout').should('not.be.visible')

      cy.get('@scrollable').scrollTo('bottom')

      cy.get('@logo').should('be.visible')
      cy.get('@logout').should('be.visible')
    })

    specify('QDrawer should have a flex nowrap property to prevent layout issues', () => {
      cy.dataCy('drawer').should('have.css', 'flex-wrap', 'nowrap')
    })

    describe('Logo', () => {
      it('should render official SVG logo', () => {
        cy.then(getDrawer)
          .then(getLogo)
          .get('img')
          .should('have.attr', 'src', logo)
      })

      it('should be 32x36 in size', () => {
        cy.then(getDrawer)
          .then(getLogo)
          .get('img')
          .as('logo')

        cy.get('@logo').should('have.attr', 'width', '32')
        cy.get('@logo').should('have.attr', 'height', '36')
      })
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

type ComponentWrapper = ReturnType<typeof Cypress.vueWrapper.getComponent>

function getDrawer () {
  return Cypress.vueWrapper.getComponent(QDrawer)
}

function getItem (id: string) {
  return (container: ComponentWrapper) => container.find(`[data-cy="item-${id}"]`)
}

function getLogo (container: ComponentWrapper) {
  return container.find('[data-cy="logo"]')
}
