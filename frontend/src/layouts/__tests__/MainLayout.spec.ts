import MainLayout from '../MainLayout.vue'
import { mount } from '@cypress/vue'
import TheHeader from 'components/TheHeader.vue'
import { QBtn, QDrawer } from 'quasar'

describe('MainLayout', () => {
  it('should render header', () => {
    mount(MainLayout)

    cy.then(() => {
      const header = Cypress.vueWrapper.findComponent(TheHeader)
      expect(header.exists()).to.be.equal(true)
    })
  })

  it('hamburger icon should toggle the navigation drawer', () => {
    mount(MainLayout)

    cy.then(() => {
      const initialState = getDrawerState()

      toggleDrawer()
      drawerStateShouldBe(!initialState)

      toggleDrawer()
      drawerStateShouldBe(initialState)
    })
  })
})

function getDrawerState (): boolean {
  const navigationDrawer = Cypress.vueWrapper.findComponent(QDrawer)
  return navigationDrawer.props('modelValue') as boolean
}

function toggleDrawer (): void {
  const ignoreDrawerOverlay = { force: true }
  cy.wrap(Cypress.vueWrapper.findComponent(QBtn).element).click(ignoreDrawerOverlay)
}

function drawerStateShouldBe (expectedState: boolean): void {
  cy.then(() => expect(getDrawerState()).to.be.equal(expectedState))
}
