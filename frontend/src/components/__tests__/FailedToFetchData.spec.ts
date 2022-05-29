import { ComponentUnderTest, Event, inAllLanguages } from 'test/support/api'
import FailedToFetchData from '../FailedToFetchData.vue'
import { QIcon } from 'quasar'

describe('FailedToFetchData', () => {
  it('should render large icon', () => {
    ComponentUnderTest.is(FailedToFetchData).mount()

    cy.then(() => Cypress.vueWrapper.findComponent(QIcon))
      .then(icon => icon.props('size') as string)
      .then(size => cy.wrap(size))
      .should('equal', '180px')
  })

  inAllLanguages.it('should tell what happened', t => {
    ComponentUnderTest.is(FailedToFetchData).mount()

    cy.dataCy('what-happened').should('have.text', t('failed-to-fetch-data'))
  })

  it('should have a slightly larger text for what-happened section', () => {
    ComponentUnderTest.is(FailedToFetchData).mount()

    cy.dataCy('what-happened').should('have.class', 'text-h5')
  })

  inAllLanguages.it('should have a button allowing user to retry the action', t => {
    ComponentUnderTest.is(FailedToFetchData).mount()

    cy.dataCy('retry').should('be.visible')
      .then($button => $button.text())
      .then(text => text.trim())
      .then(text => cy.wrap(text))
      .should('equal', t('retry'))
  })

  it('should emit \'retry\' event when user clicks on retry button', () => {
    ComponentUnderTest.is(FailedToFetchData).mount()

    const retryEvent = Event.named('retry')
    retryEvent.shouldNotBeFired()

    cy.dataCy('retry').click()

    retryEvent.shouldBeFired().once()
  })
})
