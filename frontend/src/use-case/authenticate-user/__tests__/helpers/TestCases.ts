import { State } from './State'
import { ComponentUnderTest } from 'test/support/api'
import LoginForm from '../../LoginForm.vue'
import { disabled, noErrorMessage } from './StateExpectation'

export class TestCases {
  private availableStates: State[] = []

  private constructor (states: State[]) {
    this.availableStates = states
  }

  public static for (states: State[]): TestCases {
    return new TestCases(states)
  }

  public generate (): void {
    this.availableStates.forEach(state => {
      specify(TestName.for(state), () => TestCases.mountComponentAndTestState(state))
    })
  }

  public generateTransitions (): void {
    this.availableStates.forEach(initialState => {
      this.availableStates.filter(toKeep => toKeep !== initialState).forEach(targetState => {
        specify(`${initialState.name()} -> ${targetState.name()}`, () => {
          TestCases.mountComponentAndTestState(initialState)

          ComponentUnderTest.changeProperties({ state: targetState.implementation() })
          targetState.validateImplementation()
        })
      })
    })
  }

  private static mountComponentAndTestState (state: State): void {
    ComponentUnderTest.is(LoginForm).withProperties({ state: state.implementation() }).mount()
    state.validateImplementation()
  }
}

class TestName {
  public static for (state: State): string {
    return `${state.name().toUpperCase()}
    ${TestName.generateExpectedState(state)}
    `
  }

  private static generateExpectedState (state: State): string {
    const expectations = state.expectations()
    const { email, password, submit } = expectations

    return `email[disabled=${email.disabled === disabled ? 'yes' : 'no'}, error=${email.error === noErrorMessage ? 'no' : `"${String(email.error)}"`}]
password[disabled=${password.disabled === disabled ? 'yes' : 'no'}, error=${password.error === noErrorMessage ? 'no' : `"${String(password.error)}"`}]
submit[disabled=${submit.disabled === disabled ? 'yes' : 'no'}, loading=${submit.loading === disabled ? 'yes' : 'no'}]`
  }
}
