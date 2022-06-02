export const STATES = {
  LOADING: 'loading',
  EMPTY: 'empty',
  ERROR: 'error',
  SUCCESS: 'success'
} as const

export class StateMachine {
  private static _currentState = ''

  public static onTransition: () => unknown = () => { /* nothing to do by default */ }

  public static currentState (): string {
    return this._currentState
  }

  public static transitionTo (state: typeof STATES[keyof typeof STATES]): void {
    this._currentState = state
    this.onTransition()
  }
}
