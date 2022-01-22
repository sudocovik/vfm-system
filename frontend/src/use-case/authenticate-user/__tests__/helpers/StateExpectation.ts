import { StateExpectationAttributes, SubmitButtonAttributes, TextFieldAttributes } from './StateExpectationAttributes'

export const disabled = true
export const notDisabled = false
export const noErrorMessage = ''
export const hasErrorMessage = (message: string): string => {
  if (message === noErrorMessage) {
    throw new Error('hasErrorMessage does not accept empty message.')
  }
  return message
}
export const loading = true
export const notLoading = false

export class StateExpectation {
  private emailField: TextFieldAttributes
  private passwordField: TextFieldAttributes
  private _submitButton: SubmitButtonAttributes

  constructor () {
    this.emailField = {
      disabled: undefined,
      error: undefined
    }
    this.passwordField = {
      disabled: undefined,
      error: undefined
    }
    this._submitButton = {
      disabled: undefined,
      loading: undefined
    }
  }

  public email (isDisabled: boolean, errorMessage: string): StateExpectation {
    this.emailField.disabled = isDisabled
    this.emailField.error = errorMessage

    return this
  }

  public password (isDisabled: boolean, errorMessage: string): StateExpectation {
    this.passwordField.disabled = isDisabled
    this.passwordField.error = errorMessage

    return this
  }

  public submitButton (isDisabled: boolean, isLoading: boolean): StateExpectation {
    this._submitButton.disabled = isDisabled
    this._submitButton.loading = isLoading

    return this
  }

  public toAttributes (): StateExpectationAttributes {
    return {
      email: {
        disabled: this.emailField.disabled,
        error: this.emailField.error
      },
      password: {
        disabled: this.passwordField.disabled,
        error: this.passwordField.error
      },
      submit: {
        disabled: this._submitButton.disabled,
        loading: this._submitButton.loading
      }
    }
  }
}
