export class LoginFormState {
  public static initialized (): Initialized {
    return new Initialized()
  }

  public static inProgress (): InProgress {
    return new InProgress()
  }

  public static completed (): Completed {
    return new Completed()
  }

  public static failed (): Failed {
    return new Failed()
  }
}

export interface FormState {
  emailError(): string

  passwordError(): string
}

abstract class HappyState {
  public emailError (): string {
    return ''
  }

  public passwordError (): string {
    return ''
  }
}

export class Initialized extends HappyState implements FormState {
}

export class InProgress extends HappyState implements FormState {
}

export class Completed extends HappyState implements FormState {
}

export class Failed implements FormState {
  private _emailError = ''
  private _passwordError = ''

  public emailError (): string {
    return this._emailError
  }

  withEmailError (message: string): Failed {
    this._emailError = message
    return this
  }

  public passwordError (): string {
    return this._passwordError
  }

  public withPasswordError (message: string): Failed {
    this._passwordError = message
    return this
  }
}
