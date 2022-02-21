import MainLayout from '../MainLayout.vue'
import { mount } from '@cypress/vue'
import TheHeader from 'components/TheHeader.vue'

describe('MainLayout', () => {
  it('should render header', () => {
    mount(MainLayout)

    cy.then(() => {
      const header = Cypress.vueWrapper.findComponent(TheHeader)
      expect(header.exists()).to.be.equal(true)
    })
  })
})
