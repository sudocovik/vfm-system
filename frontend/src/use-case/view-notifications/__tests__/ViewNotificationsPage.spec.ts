import { inAllLanguages } from 'test/support/api'
import ViewNotificationsPage from '../ViewNotificationsPage.vue'
import routes from 'src/router/routes'
import { QIcon, QPage } from 'quasar'

describe('ViewNotificationsPage', () => {
  it('should be visible on /notifications route', () => {
    cy.then(async () => {
      const route = routes.find(route => route.path === '/notifications')

      if (!route) throw new Error('Route for view notifications not found')

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      expect((await route.component()).default).to.equal(ViewNotificationsPage)
    })
  })

  inAllLanguages.it('should have a title', (t) => {
    mountViewNotificationsPage()

    cy.validateTitle(t('notifications'))
  })

  it('should be a page', () => {
    mountViewNotificationsPage()

    cy.then(() => Cypress.vueWrapper.findComponent(QPage))
      .then(component => component.exists())
      .then(exists => cy.wrap(exists))
      .should('equal', true)
  })

  it('should render large icon', () => {
    mountViewNotificationsPage()

    cy.then(() => Cypress.vueWrapper.findComponent(QIcon))
      .then(icon => icon.props('size') as string)
      .then(size => cy.wrap(size))
      .should('equal', '150px')
  })

  inAllLanguages.it('should render a message', t => {
    mountViewNotificationsPage()

    cy.contains(t('no-notifications')).should('be.visible')
  })
})

function mountViewNotificationsPage () {
  cy.mount(ViewNotificationsPage, {
    global: {
      renderStubDefaultSlot: true,
      stubs: {
        QPage: true
      }
    }
  })
}
