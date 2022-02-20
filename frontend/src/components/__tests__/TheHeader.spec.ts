import TheHeader from '../TheHeader.vue'
import { QHeader } from 'quasar'
import { mount } from '@cypress/vue'
import FakeLayout from './FakeLayout.vue'

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
})

function mountHeader (): void {
  mount(FakeLayout, {
    slots: {
      default: TheHeader
    }
  })
}
