import { ComponentUnderTest, inAllLanguages } from 'test/support/api'
import TheUpdateNotification from '../TheUpdateNotification.vue'

describe('TheUpdateNotification', () => {
  it('should render nothing when there is no updates', () => {
    ComponentUnderTest.is(TheUpdateNotification).mount()

    cy.then(() => Cypress.vueWrapper.html())
      .then(html => html.replace(/<!--.*?-->/g, ''))
      .should('be.empty')
  })

  describe('when there is updates ready to be installed', () => {
    inAllLanguages.it('should render a meaningful message', t => {
      ComponentUnderTest.is(TheUpdateNotification).mount()

      simulateUpdateAvailable()

      cy.contains(t('update-available')).should('be.visible')
    })

    inAllLanguages.it('should have a button for installing updates', t => {
      ComponentUnderTest.is(TheUpdateNotification).mount()

      simulateUpdateAvailable()

      cy.dataCy('install-updates').contains(t('install')).should('be.visible')
    })

    it('should activate updates when user clicks on the install button', () => {
      ComponentUnderTest.is(TheUpdateNotification).mount()

      const activateUpdates = cy.stub()
      simulateUpdateAvailable(activateUpdates)

      cy.then(() => expect(activateUpdates).not.to.be.called)
        .then(triggerUpdateInstallation)
        .then(() => expect(activateUpdates).to.be.calledOnce)
    })
  })
})

function simulateUpdateAvailable (activateUpdates?: unknown) {
  cy.document()
    .then(doc => {
      doc.dispatchEvent(new CustomEvent('service-worker-updated', {
        detail: {
          activateUpdates: (activateUpdates ?? (() => { /* not required to do anything */ }))
        }
      }))
    })
}

function triggerUpdateInstallation () {
  cy.dataCy('install-updates').click()
}
