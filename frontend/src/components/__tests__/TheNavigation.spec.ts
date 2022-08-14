import TheNavigation from '../TheNavigation.vue'
import { QDrawer, QFooter, QIcon, QItem, QLayout, QRouteTab } from 'quasar'
import { AvailableSlots, getComponentKey, inAllLanguages } from 'test/support/api'
import { h } from 'vue'
import logo from 'src/assets/logo.svg'
import { VueWrapper } from '@vue/test-utils'

type ComponentWrapper = ReturnType<typeof Cypress.vueWrapper.getComponent>

const DESKTOP_SIZE = { width: 600, height: 600 }
const MOBILE_SIZE = { width: 599, height: 500 }

describe('TheNavigation', () => {
  describe('Mobile version', () => {
    beforeEach(useMobileVersion)
    beforeEach(mountNavigation)

    it('should render a QFooter component', () => {
      cy.then(getFooter)
        .then(tabs => cy.wrap(tabs.element))
        .get('[data-cy="tabs"]')
        .should('be.visible')
    })

    describe('Items', () => {
      const footerItems = [
        {
          name: 'vehicles',
          url: '/',
          icon: 'mdi-truck'
        },
        {
          name: 'notifications',
          url: '/notifications',
          icon: 'mdi-bell'
        }
      ]

      footerItems.forEach(tab => {
        inAllLanguages.it(`should render "${tab.name}"`, t => {
          cy.then(getFooter)
            .then(getTab(tab.name))
            .should(tabWrapper => {
              cy.wrap(tabWrapper).as('tab')
              cy.get('@tab').its('element').should('contain.text', t(tab.name))
              cy.get('@tab').invoke('getComponent', QRouteTab).invoke('props', 'to').should('equal', tab.url)
              cy.get('@tab').invoke('getComponent', QIcon).invoke('props', 'name').should('equal', tab.icon)
              expect(getComponentKey(tabWrapper.findComponent(QRouteTab))).to.equal(tab.name)
            })
        })
      })

      const expectedOrder = footerItems.map(item => item.name).join(',')
      it(`should render in specific order: ${expectedOrder}`, () => {
        const actualOrder: string[] = []
        cy.get('[data-cy="footer"] [data-cy^="tab-"]')
          .each($tab => {
            const dataCy = $tab.attr('data-cy') ?? ''
            const name = dataCy.replace('tab-', '')
            actualOrder.push(name)
          })
          .then(() => cy.wrap(actualOrder.join(',')))
          .should('equal', expectedOrder)
      })
    })
  })

  describe('Desktop version', () => {
    beforeEach(() => useDesktopVersion())
    beforeEach(mountNavigation)

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
      useDesktopVersion(150)
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
              expect(getComponentKey(itemWrapper.findComponent(QItem))).to.equal(item.name)
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

  describe('Responsiveness', () => {
    specify('mobile and desktop screen width difference should be 1px', () => {
      useDesktopVersion()

      cy.window()
        .its('innerWidth')
        .then(desktopWidth => {
          useMobileVersion()

          cy.window()
            .its('innerWidth')
            .then(mobileWidth => cy.wrap(desktopWidth - mobileWidth))
            .should('equal', 1)
        })
    })

    specify('mobile -> desktop', () => {
      useMobileVersion()
      mountNavigation()

      footerVisibility().should('equal', true)
      drawerVisibility().should('equal', false)

      useDesktopVersion()

      footerVisibility().should('equal', false)
      drawerVisibility().should('equal', true)
    })

    specify('desktop -> mobile', () => {
      useDesktopVersion()
      mountNavigation()

      footerVisibility().should('equal', false)
      drawerVisibility().should('equal', true)

      useMobileVersion()

      footerVisibility().should('equal', true)
      drawerVisibility().should('equal', false)
    })
  })
})

function mountNavigation () {
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

  cy.mount(h(QLayout, () => h(TheNavigation)), mountingOptions)
}

function useMobileVersion () {
  cy.viewport(MOBILE_SIZE.width, MOBILE_SIZE.height)
}

function useDesktopVersion (height?: number) {
  cy.viewport(DESKTOP_SIZE.width, height ?? DESKTOP_SIZE.height)
}

function getDrawer () {
  return Cypress.vueWrapper.getComponent(QDrawer)
}

function getItem (id: string) {
  return (container: ComponentWrapper) => container.get(`[data-cy="item-${id}"]`) as unknown as VueWrapper<QItem>
}

function getLogo (container: ComponentWrapper) {
  return container.find('[data-cy="logo"]')
}

function getFooter () {
  return Cypress.vueWrapper.getComponent(QFooter)
}

function getTab (id: string) {
  return (container: ComponentWrapper) => container.get(`[data-cy="tab-${id}"]`) as unknown as VueWrapper<QRouteTab>
}

function footerVisibility () {
  return cy.then(getFooter)
    .then(footer => cy.wrap(footer))
    .invoke('props', 'modelValue')
}

function drawerVisibility () {
  return cy.then(getDrawer)
    .then(drawer => cy.wrap(drawer))
    .invoke('props', 'modelValue')
}
