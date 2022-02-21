import { mount } from '@cypress/vue'
import { QHeader } from 'quasar'
import TheHeaderWrapper from './TheHeaderWrapper.vue'
import { Event } from 'test/support/api'
import { MenuToggleEventName as MenuToggle } from '../MenuToggleEvent'
import HamburgerIcon from '../HamburgerIcon.vue'

describe('TheHeader', () => {
  it('should mount', () => {
    mountHeader()
  })

  it('should utilize q-header component to render header', () => {
    mountHeader()

    cy.then(() => {
      const qHeader = Cypress.vueWrapper.findComponent(QHeader)
      expect(qHeader.exists()).to.be.equal(true)
    })
  })

  it('should notify parent menu toggle was requested', () => {
    mountHeader()
    Event.named(MenuToggle).shouldNotBeFired()

    clickOnMenuToggleIcon()

    Event.named(MenuToggle).shouldBeFired().once()
  })
})

function mountHeader (): void {
  mount(TheHeaderWrapper)
}

function clickOnMenuToggleIcon (): void {
  cy.then(() => {
    const menuToggleIcon = Cypress.vueWrapper.findComponent(HamburgerIcon)
    cy.wrap(menuToggleIcon.element).click()
  })
}
