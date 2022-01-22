export interface TextFieldAttributes {
  disabled: boolean | undefined
  error: string | undefined
}

export interface SubmitButtonAttributes {
  disabled: boolean | undefined
  loading: boolean | undefined
}

export interface StateExpectationAttributes {
  email: TextFieldAttributes,
  password: TextFieldAttributes,
  submit: SubmitButtonAttributes
}
