import { mount } from '@cypress/vue'
import AuthenticationManager from '../AuthenticationManager.vue'
import { AuthenticationService } from 'src/backend/AuthenticationService'

describe('AuthenticationManager', () => {
  it('should render #loading slot while checking for authentication status', () => {
    const waitForAuthenticationCheck = simulateUserIsAuthenticated()

    const { loading } = mountAuthenticationManager()
    contentShouldBe(loading)

    waitForAuthenticationCheck()
    contentShouldNotBe(loading)
  })

  it('should render #unauthenticated slot when user is not logged in', () => {
    simulateUserIsNotAuthenticated()
    const { unauthenticated } = mountAuthenticationManager()

    contentShouldBe(unauthenticated)
  })

  it('should render #authenticated slot when user is logged in', () => {
    simulateUserIsAuthenticated()
    const { authenticated } = mountAuthenticationManager()

    contentShouldBe(authenticated)
  })
})

function mountAuthenticationManager () {
  const content = {
    authenticated: 'Authenticated slot rendered',
    unauthenticated: 'Unauthenticated slot rendered',
    loading: 'Loading slot rendered'
  }

  const createSlotContent = (content: string) => ({ render: () => content })
  mount(AuthenticationManager, {
    slots: {
      authenticated: createSlotContent(content.authenticated),
      unauthenticated: createSlotContent(content.unauthenticated),
      loading: createSlotContent(content.loading)
    }
  })

  return content
}

function contentShouldBe (wantedContent: string): void {
  cy.then(() => {
    cy.wrap(Cypress.vueWrapper.element).should('have.text', wantedContent)
  })
}

function contentShouldNotBe (wantedContent: string): void {
  cy.then(() => {
    cy.wrap(Cypress.vueWrapper.element).should('not.have.text', wantedContent)
  })
}

function simulateUserIsNotAuthenticated (): void {
  cy.intercept('GET', AuthenticationService.sessionEndpoint, {
    statusCode: 404
  })
}

function simulateUserIsAuthenticated (): () => void {
  cy.intercept('GET', AuthenticationService.sessionEndpoint, {
    statusCode: 204
  }).as('success')

  return () => void cy.wait('@success')
}
