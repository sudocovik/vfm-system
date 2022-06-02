export const STATES = {
  LOADING: 'loading',
  EMPTY: 'empty',
  ERROR: 'error',
  SUCCESS: 'success'
} as const

type PossibleState = typeof STATES[keyof typeof STATES]

const defaults = {
  state: STATES.LOADING,
  onTransition: (): void => { /* nothing to do by default */ }
}

export class StateMachine {
  private static _initialState = STATES.LOADING
  private static _currentState: PossibleState = this._initialState

  public static onTransition: () => unknown = defaults.onTransition

  public static currentState (): PossibleState {
    return this._currentState
  }

  public static transitionTo (state: PossibleState): void {
    this._currentState = state
    this.onTransition()
  }

  public static reset () {
    this._currentState = defaults.state
    this.onTransition = defaults.onTransition
  }
}
