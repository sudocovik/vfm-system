import LoginPage from '../LoginPage.vue'
import { mount } from '@cypress/vue'
import LoginForm from '../LoginForm.vue'
import { FormState, LoginFormState } from '../LoginFormState'
import LoginFormPasswordInput from '../LoginFormPasswordInput.vue'
import LoginFormSubmitButton from '../LoginFormSubmitButton.vue'
import LoginFormEmailInput from '../LoginFormEmailInput.vue'
import { inAllLanguages } from 'test/support/api'

describe('LoginPage', () => {
  it('should render form in \'ready\' state upon initial render', () => {
    mountLoginPage()

    formStateShouldBe(LoginFormState.ready())
  })

  inAllLanguages.it('should be in \'failed\' state if email is missing', (t) => {
    mountLoginPage()
    typePassword('irrelevant-password')
    submitButtonClick()
    formStateShouldBe(LoginFormState.failure().withEmailError(t('validation.required')))
  })

  inAllLanguages.it('should be in \'failed\' state if password is missing', (t) => {
    mountLoginPage()
    typeEmail('irrelevant@example.com')
    submitButtonClick()
    formStateShouldBe(LoginFormState.failure().withPasswordError(t('validation.required')))
  })

  inAllLanguages.it('should be in \'failed\' state if email & password are both missing', (t) => {
    mountLoginPage()
    submitButtonClick()
    formStateShouldBe(LoginFormState.failure().withEmailError(t('validation.required')).withPasswordError(t('validation.required')))
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

function submitButtonClick (): void {
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
