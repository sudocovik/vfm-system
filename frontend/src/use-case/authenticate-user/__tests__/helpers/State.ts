import { FormState } from '../../LoginFormState'
import { StateExpectation } from './StateExpectation'
import { StateValidation } from './StateValidation'
import { StateExpectationAttributes } from './StateExpectationAttributes'

export class State {
  private readonly _name: string
  private readonly _implementation: FormState
  private readonly _expectation: StateExpectation

  private constructor (name: string, implementation: FormState, expectation: StateExpectation) {
    this._name = name
    this._implementation = implementation
    this._expectation = expectation
  }

  public static named (by: string) {
    return {
      for: (implementation: FormState) => ({
        with: (expectation: StateExpectation) => {
          return new State(by, implementation, expectation)
        }
      })
    }
  }

  public static expectation (): StateExpectation {
    return new StateExpectation()
  }

  public name (): string {
    return this._name
  }

  public implementation (): FormState {
    return this._implementation
  }

  public validateImplementation (): void {
    StateValidation.validate(this._expectation)
  }

  public expectations (): StateExpectationAttributes {
    return this._expectation.toAttributes()
  }
}
