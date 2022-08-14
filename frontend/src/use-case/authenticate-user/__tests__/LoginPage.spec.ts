import LoginPage from '../LoginPage.vue'
import LoginForm from '../LoginForm.vue'
import { FormState, LoginFormState } from '../LoginFormState'
import LoginFormPasswordInput from '../LoginFormPasswordInput.vue'
import LoginFormSubmitButton from '../LoginFormSubmitButton.vue'
import LoginFormEmailInput from '../LoginFormEmailInput.vue'
import { Event, inAllLanguages } from 'test/support/api'
import { AuthenticationService } from 'src/backend/AuthenticationService'
import { AuthenticationSuccessfulEventName as AuthenticationSuccessful } from '../AuthenticationSuccessfulEvent'
import { SessionCookie } from '../SessionCookie'

describe('LoginPage', () => {
  it('should render form in \'ready\' state upon initial render', () => {
    mountLoginPage()

    formStateShouldBe(LoginFormState.ready())
  })

  it('should notify parent component authentication was successful', () => {
    const { assertOrderOfStateChangesFor } = setupFormStateSpies()
    mountLoginPage()
    simulateCorrectCredentialsSituation()

    typeEmail('correct@example.com')
    typePassword('correct-password')
    submitForm()

    assertOrderOfStateChangesFor(LoginFormState.successful())
    formStateShouldBe(LoginFormState.successful())
    authenticationSuccessfulEventShouldBeFired()
  })

  describe('should set session cookie for one year after successful authentication', () => {
    const cookies = [{
      value: 'initial-cookie-value',
      currentClock: Date.UTC(2022, 0, 15, 11, 23, 44),
      targetExpiry: Date.UTC(2023, 0, 15, 11, 23, 44)
    }, {
      value: 'second-cookie-value',
      currentClock: Date.UTC(2056, 11, 25, 0, 0, 0),
      targetExpiry: Date.UTC(2057, 11, 25, 0, 0, 0)
    }]

    cookies.forEach(({ value, currentClock, targetExpiry }, i) => {
      it(`case ${i + 1}: target expiry = ${new Date(targetExpiry).toDateString()}`, () => {
        cy.clock(currentClock)
        simulateSessionCookieSetByBackend(value)

        mountLoginPage()
        simulateCorrectCredentialsSituation()
        typeEmail('correct@example.com')
        typePassword('correct-password')
        submitForm()

        cy.getCookie(SessionCookie.name)
          .should(sessionCookie => {
            const expectedExpiry = targetExpiry / 1000 // Because cypress converts cookie expiry to seconds
            expect(sessionCookie).to.have.property('value', value)
            expect(sessionCookie).to.have.property('expiry', expectedExpiry)
          })
      })
    })
  })

  inAllLanguages.it('should tell user if email is missing', (t) => {
    mountLoginPage()
    simulateCorrectCredentialsSituation()

    typePassword('irrelevant-password')
    submitForm()

    formStateShouldBe(LoginFormState.failure().withEmailError(t('validation.required')))
    authenticationSuccessfulEventShouldNotBeFired()
    sessionCookieShouldNotBeSet()
  })

  inAllLanguages.it('should tell user if password is missing', (t) => {
    mountLoginPage()
    simulateCorrectCredentialsSituation()

    typeEmail('irrelevant@example.com')
    submitForm()

    formStateShouldBe(LoginFormState.failure().withPasswordError(t('validation.required')))
    authenticationSuccessfulEventShouldNotBeFired()
    sessionCookieShouldNotBeSet()
  })

  inAllLanguages.it('should tell user if email & password are both missing', (t) => {
    mountLoginPage()
    simulateCorrectCredentialsSituation()

    submitForm()

    formStateShouldBe(LoginFormState.failure().withEmailError(t('validation.required')).withPasswordError(t('validation.required')))
    authenticationSuccessfulEventShouldNotBeFired()
    sessionCookieShouldNotBeSet()
  })

  inAllLanguages.it('should notify user credentials are incorrect', (t) => {
    const { assertOrderOfStateChangesFor } = setupFormStateSpies()
    mountLoginPage()
    simulateWrongCredentialsSituation()

    typeEmail('wrong@example.com')
    typePassword('wrong-password')
    submitForm()

    notificationTextShouldBe(t('wrong-email-and-password'))
    assertOrderOfStateChangesFor(LoginFormState.failure())
    formStateShouldBe(LoginFormState.failure())
    authenticationSuccessfulEventShouldNotBeFired()
    sessionCookieShouldNotBeSet()
  })

  inAllLanguages.it('should notify user there are problems with the server', (t) => {
    const { assertOrderOfStateChangesFor } = setupFormStateSpies()
    mountLoginPage()
    simulateServerErrorSituation()

    typeEmail('irrelevant@example.com')
    typePassword('irrelevant-password')
    submitForm()

    notificationTextShouldBe(t('general-server-error'))
    assertOrderOfStateChangesFor(LoginFormState.failure())
    formStateShouldBe(LoginFormState.failure())
    authenticationSuccessfulEventShouldNotBeFired()
    sessionCookieShouldNotBeSet()
  })

  inAllLanguages.it('should notify user there are problems with the network', (t) => {
    const { assertOrderOfStateChangesFor } = setupFormStateSpies()
    mountLoginPage()
    simulateNetworkErrorSituation()

    typeEmail('irrelevant@example.com')
    typePassword('irrelevant-password')
    submitForm()

    notificationTextShouldBe(t('network-error'))
    assertOrderOfStateChangesFor(LoginFormState.failure())
    formStateShouldBe(LoginFormState.failure())
    authenticationSuccessfulEventShouldNotBeFired()
    sessionCookieShouldNotBeSet()
  })

  inAllLanguages.it('should notify user there are problems with the client application', (t) => {
    const { assertOrderOfStateChangesFor } = setupFormStateSpies()
    mountLoginPage()
    simulateApplicationErrorSituation()

    typeEmail('irrelevant@example.com')
    typePassword('irrelevant-password')
    submitForm()

    notificationTextShouldBe(t('general-application-error'))
    assertOrderOfStateChangesFor(LoginFormState.failure())
    formStateShouldBe(LoginFormState.failure())
    authenticationSuccessfulEventShouldNotBeFired()
    sessionCookieShouldNotBeSet()
  })
})

function typePassword (wantedPassword: string): void {
  cy.then(() => {
    const passwordInput = Cypress.vueWrapper.findComponent(LoginFormPasswordInput)
    cy.wrap(passwordInput.element).type(wantedPassword)
  })
}

function typeEmail (wantedEmail: string): void {
  cy.then(() => {
    const emailInput = Cypress.vueWrapper.findComponent(LoginFormEmailInput)
    cy.wrap(emailInput.element).type(wantedEmail)
  })
}

function submitForm (): void {
  cy.then(() => {
    const submitButton = Cypress.vueWrapper.findComponent(LoginFormSubmitButton)
    cy.wrap(submitButton.element).click()
  })
}

function mountLoginPage (): void {
  cy.mount(LoginPage, {
    global: {
      renderStubDefaultSlot: true,
      stubs: {
        CenteredLayout: true
      }
    }
  })
}

function formStateShouldBe (expectedState: FormState): void {
  cy.then(() => {
    const loginForm = Cypress.vueWrapper.findComponent(LoginForm)
    const currentState = <FormState>loginForm.props('state')

    expect(currentState.constructor.name).to.be.equal(expectedState.constructor.name)
    expect(currentState.emailError()).to.be.equal(expectedState.emailError())
    expect(currentState.passwordError()).to.be.equal(expectedState.passwordError())
  })
}

function notificationTextShouldBe (wantedText: string): void {
  cy.get('body').should('contain.text', wantedText)
}

function authenticationSuccessfulEventShouldBeFired (): void {
  Event.named(AuthenticationSuccessful).shouldBeFired().once()
}

function authenticationSuccessfulEventShouldNotBeFired (): void {
  Event.named(AuthenticationSuccessful).shouldNotBeFired()
}

function simulateCorrectCredentialsSituation (): void {
  cy.intercept('POST', AuthenticationService.loginEndpoint, {
    statusCode: 200
  })
}

function simulateWrongCredentialsSituation (): void {
  cy.intercept('POST', AuthenticationService.loginEndpoint, {
    statusCode: 401
  })
}

function simulateServerErrorSituation (): void {
  cy.intercept('POST', AuthenticationService.loginEndpoint, {
    statusCode: 500
  })
}

function simulateNetworkErrorSituation (): void {
  cy.intercept('POST', AuthenticationService.loginEndpoint, {
    forceNetworkError: true
  })
}

function simulateApplicationErrorSituation (): void {
  cy.stub(AuthenticationService, 'login', () => {
    throw new Error()
  })
}

function setupFormStateSpies () {
  const ready = cy.spy(LoginFormState, 'ready').as('ready')
  const inProgress = cy.spy(LoginFormState, 'inProgress').as('in-progress')
  const successful = cy.spy(LoginFormState, 'successful').as('successful')
  const failure = cy.spy(LoginFormState, 'failure').as('failure')

  return {
    assertOrderOfStateChangesFor: (state: FormState): void => {
      cy.then(() => {
        expect(inProgress).to.be.calledAfter(ready)

        const finalState = state instanceof LoginFormState.successful().constructor
          ? successful
          : failure
        expect(finalState).to.be.calledAfter(inProgress)
      })
    }
  }
}

function simulateSessionCookieSetByBackend (value: string) {
  const expireCookieAfterBrowserWindowCloses = { expiry: Date.now() }
  cy.setCookie(SessionCookie.name, value, expireCookieAfterBrowserWindowCloses)
}

function sessionCookieShouldNotBeSet () {
  cy.getCookie(SessionCookie.name).should('not.exist')
}
