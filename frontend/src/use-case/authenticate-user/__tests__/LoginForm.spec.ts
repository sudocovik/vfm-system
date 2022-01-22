import { ComponentUnderTest, Event, Random } from 'test/support/api'
import { LoginFormState } from '../LoginFormState'
import { disabled, hasErrorMessage, loading, noErrorMessage, notDisabled, notLoading, State } from './helpers/api'
import { TestCases } from './helpers/TestCases'
import LoginForm from '../LoginForm.vue'
import LoginFormSubmitButton from '../LoginFormSubmitButton.vue'
import LoginFormEmailInput from '../LoginFormEmailInput.vue'
import LoginFormPasswordInput from '../LoginFormPasswordInput.vue'

/*

ALTERNATIVE API

const failureEmailIsTooShort = State.named('failure-email-is-too-short')
  .for(LoginFormState.failure().withEmailError('Email is too short.'))
  .validate(
    State.expect().email().notDisabled().hasErrorMessage('Email is too short.'),
    State.expect().password().isDisabled().noErrorMessage(),
    State.expect().submitButton().notDisabled().isLoading()
  )

 */

const ready = State.named('ready')
  .for(LoginFormState.ready())
  .with(
    State.expectation()
      .email(notDisabled, noErrorMessage)
      .password(notDisabled, noErrorMessage)
      .submitButton(notDisabled, notLoading)
  )

const inProgress = State.named('in-progress')
  .for(LoginFormState.inProgress())
  .with(
    State.expectation()
      .email(disabled, noErrorMessage)
      .password(disabled, noErrorMessage)
      .submitButton(notDisabled, loading)
  )

const successful = State.named('successful')
  .for(LoginFormState.successful())
  .with(
    State.expectation()
      .email(disabled, noErrorMessage)
      .password(disabled, noErrorMessage)
      .submitButton(disabled, notLoading)
  )

const failure = State.named('failed')
  .for(LoginFormState.failure())
  .with(
    State.expectation()
      .email(notDisabled, noErrorMessage)
      .password(notDisabled, noErrorMessage)
      .submitButton(notDisabled, notLoading)
  )

const failureEmailIsRequired = State.named('failure=email')
  .for(LoginFormState.failure().withEmailError('Email is required.'))
  .with(
    State.expectation()
      .email(notDisabled, hasErrorMessage('Email is required.'))
      .password(notDisabled, noErrorMessage)
      .submitButton(notDisabled, notLoading)
  )

const failureEmailIsTooShort = State.named('failure=email-alternative')
  .for(LoginFormState.failure().withEmailError('Email is too short.'))
  .with(
    State.expectation()
      .email(notDisabled, hasErrorMessage('Email is too short.'))
      .password(notDisabled, noErrorMessage)
      .submitButton(notDisabled, notLoading)
  )

const failurePasswordIsRequired = State.named('failure=password')
  .for(LoginFormState.failure().withPasswordError('Password is required.'))
  .with(
    State.expectation()
      .email(notDisabled, noErrorMessage)
      .password(notDisabled, hasErrorMessage('Password is required.'))
      .submitButton(notDisabled, notLoading)
  )

const failurePasswordIsTooShort = State.named('failure=password-alternative')
  .for(LoginFormState.failure().withPasswordError('Password is too short.'))
  .with(
    State.expectation()
      .email(notDisabled, noErrorMessage)
      .password(notDisabled, hasErrorMessage('Password is too short.'))
      .submitButton(notDisabled, notLoading)
  )

const failureEmailAndPasswordAreRequired = State.named('failure=email-and-password')
  .for(LoginFormState.failure().withEmailError('Email is required.').withPasswordError('Password is required.'))
  .with(
    State.expectation()
      .email(notDisabled, hasErrorMessage('Email is required.'))
      .password(notDisabled, hasErrorMessage('Password is required.'))
      .submitButton(notDisabled, notLoading)
  )

const baseStates = [
  ready,
  inProgress,
  successful,
  failure
]

const ancillaryStates = [
  failureEmailIsRequired,
  failureEmailIsTooShort,
  failurePasswordIsRequired,
  failurePasswordIsTooShort,
  failureEmailAndPasswordAreRequired
]

describe('LoginForm', () => {
  describe('Base states', () => {
    TestCases.for(baseStates).generate()
  })

  describe('Ancillary states', () => {
    TestCases.for(ancillaryStates).generate()
  })

  describe('State transitions', () => {
    TestCases.for(baseStates).generateTransitions()
  })

  describe('Behaviour', () => {
    describe('Authentication request', () => {
      specify('ready=yes', () => {
        ComponentUnderTest.is(LoginForm).withProperties({ state: ready.implementation() }).mount()
        const { email, password } = generateRandomEmailAndPassword()
        fillInputFields(email, password)
        submitButtonClick()
        assertParentWasNotified(email, password)
      })

      specify('in-progress=no', () => {
        ComponentUnderTest.is(LoginForm).withProperties({ state: inProgress.implementation() }).mount()
        submitButtonClick()
        assertParentWasNotNotified()
      })

      specify('successful=no', () => {
        ComponentUnderTest.is(LoginForm).withProperties({ state: successful.implementation() }).mount()
        submitButtonClick()
        assertParentWasNotNotified()
      })

      specify('failure=yes', () => {
        ComponentUnderTest.is(LoginForm).withProperties({ state: failure.implementation() }).mount()
        const { email, password } = generateRandomEmailAndPassword()
        fillInputFields(email, password)
        submitButtonClick()
        assertParentWasNotified(email, password)
      })
    })
  })
})

function generateRandomEmailAndPassword () {
  return {
    email: Random.email(),
    password: Random.string(8)
  }
}

function fillInputFields (email: string, password: string) {
  cy.then(() => {
    const emailInput = Cypress.vueWrapper.findComponent(LoginFormEmailInput)
    const passwordInput = Cypress.vueWrapper.findComponent(LoginFormPasswordInput)

    cy.wrap(emailInput.element).type(email)
    cy.wrap(passwordInput.element).type(password)
  })
}

function submitButtonClick (): void {
  cy.then(() => {
    const submitButton = Cypress.vueWrapper.findComponent(LoginFormSubmitButton)
    cy.wrap(submitButton.element).click({ force: true })
  })
}

function assertParentWasNotified (expectedEmail: string, expectedPassword: string): void {
  Event.named('authenticate').shouldBeFired().once().withData([{
    email: expectedEmail,
    password: expectedPassword
  }])
}

function assertParentWasNotNotified (): void {
  Event.named('authenticate').shouldNotBeFired()
}
