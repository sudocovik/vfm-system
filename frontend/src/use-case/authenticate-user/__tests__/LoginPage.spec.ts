import LoginPage from '../LoginPage.vue'
import { mount } from '@cypress/vue'
import LoginForm from '../LoginForm.vue'
import { FormState, LoginFormState } from '../LoginFormState'
import LoginFormPasswordInput from '../LoginFormPasswordInput.vue'
import LoginFormSubmitButton from '../LoginFormSubmitButton.vue'
import LoginFormEmailInput from '../LoginFormEmailInput.vue'
import { Event, inAllLanguages } from 'test/support/api'
import { AuthenticationService } from 'src/backend/AuthenticationService'
import { AuthenticationSuccessfulEventName as AuthenticationSuccessful } from '../AuthenticationSuccessfulEvent'

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

  inAllLanguages.it('should tell user if email is missing', (t) => {
    mountLoginPage()
    simulateCorrectCredentialsSituation()

    typePassword('irrelevant-password')
    submitForm()

    formStateShouldBe(LoginFormState.failure().withEmailError(t('validation.required')))
    authenticationSuccessfulEventShouldNotBeFired()
  })

  inAllLanguages.it('should tell user if password is missing', (t) => {
    mountLoginPage()
    simulateCorrectCredentialsSituation()

    typeEmail('irrelevant@example.com')
    submitForm()

    formStateShouldBe(LoginFormState.failure().withPasswordError(t('validation.required')))
    authenticationSuccessfulEventShouldNotBeFired()
  })

  inAllLanguages.it('should tell user if email & password are both missing', (t) => {
    mountLoginPage()
    simulateCorrectCredentialsSituation()

    submitForm()

    formStateShouldBe(LoginFormState.failure().withEmailError(t('validation.required')).withPasswordError(t('validation.required')))
    authenticationSuccessfulEventShouldNotBeFired()
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
  mount(LoginPage, {
    global: {
      renderStubDefaultSlot: true,
      stubs: {
        QPage: true
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
  cy.intercept('POST', '/session', {
    statusCode: 200
  })
}

function simulateWrongCredentialsSituation (): void {
  cy.intercept('POST', '/session', {
    statusCode: 401
  })
}

function simulateServerErrorSituation (): void {
  cy.intercept('POST', '/session', {
    statusCode: 500
  })
}

function simulateNetworkErrorSituation (): void {
  cy.intercept('POST', '/session', {
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
