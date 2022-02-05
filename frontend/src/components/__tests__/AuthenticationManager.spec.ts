import { ComponentUnderTest } from 'test/support/api'
import AuthenticationManagerWrapper from './AuthenticationManagerWrapper.vue'
import { AuthenticationService } from 'src/backend/AuthenticationService'

const PossibleSlots = {
  Loading: 'div#loading',
  Authenticated: 'div#authenticated',
  Unauthenticated: 'div#unauthenticated'
}

describe('AuthenticationManager', () => {
  it('should render #loading slot while checking for authentication status', () => {
    const waitForAuthenticationCheck = simulateUserIsAuthenticated()

    ComponentUnderTest.is(AuthenticationManagerWrapper).mount()
    activeSlotShouldBe(PossibleSlots.Loading)

    waitForAuthenticationCheck()
    activeSlotShouldNotBe(PossibleSlots.Loading)
  })

  it('should render #unauthenticated slot when user is not logged in', () => {
    const waitForAuthenticationCheck = simulateUserIsNotAuthenticated()

    ComponentUnderTest.is(AuthenticationManagerWrapper).mount()
    waitForAuthenticationCheck()

    activeSlotShouldBe(PossibleSlots.Unauthenticated)
  })

  it('should render #authenticated slot when user is logged in', () => {
    const waitForAuthenticationCheck = simulateUserIsAuthenticated()

    ComponentUnderTest.is(AuthenticationManagerWrapper).mount()
    waitForAuthenticationCheck()

    activeSlotShouldBe(PossibleSlots.Authenticated)
  })

  it('should let #unauthenticated slot programmatically switch to #authenticated slot', () => {
    const waitForAuthenticationCheck = simulateUserIsNotAuthenticated()

    ComponentUnderTest.is(AuthenticationManagerWrapper).mount()
    waitForAuthenticationCheck()
    activeSlotShouldBe(PossibleSlots.Unauthenticated)

    programmaticallySwitchToAuthenticatedSlot()
    activeSlotShouldBe(PossibleSlots.Authenticated)
  })

  it('should let #authenticated slot programmatically switch to #unauthenticated slot', () => {
    const waitForAuthenticationCheck = simulateUserIsAuthenticated()

    ComponentUnderTest.is(AuthenticationManagerWrapper).mount()
    waitForAuthenticationCheck()
    activeSlotShouldBe(PossibleSlots.Authenticated)

    programmaticallySwitchToUnauthenticatedSlot()
    activeSlotShouldBe(PossibleSlots.Unauthenticated)
  })
})

function simulateUserIsNotAuthenticated (): () => void {
  cy.intercept('GET', AuthenticationService.sessionEndpoint, {
    statusCode: 404
  }).as('failure')

  return () => void cy.wait('@failure')
}

function simulateUserIsAuthenticated (): () => void {
  cy.intercept('GET', AuthenticationService.sessionEndpoint, {
    statusCode: 204
  }).as('success')

  return () => void cy.wait('@success')
}

function activeSlotShouldBe (wantedSlot: string): void {
  Object.values(PossibleSlots).forEach(slot => {
    cy.get(slot).should(
      slot === wantedSlot ? 'exist' : 'not.exist'
    )
  })
}

function activeSlotShouldNotBe (wantedSlot: string): void {
  cy.get(wantedSlot).should('not.exist')
}

function programmaticallySwitchToAuthenticatedSlot (): void {
  cy.get(PossibleSlots.Unauthenticated).dblclick()
}

function programmaticallySwitchToUnauthenticatedSlot (): void {
  cy.get(PossibleSlots.Authenticated).dblclick()
}
