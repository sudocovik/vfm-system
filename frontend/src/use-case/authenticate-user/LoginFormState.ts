export class LoginFormState {
  public static ready (): Ready {
    return new Ready()
  }

  public static inProgress (): InProgress {
    return new InProgress()
  }

  public static successful (): Successful {
    return new Successful()
  }

  public static failure (): Failure {
    return new Failure()
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

export class Ready extends HappyState implements FormState {
}

export class InProgress extends HappyState implements FormState {
}

export class Successful extends HappyState implements FormState {
}

export class Failure implements FormState {
  private _emailError = ''
  private _passwordError = ''

  public emailError (): string {
    return this._emailError
  }

  withEmailError (message: string): Failure {
    this._emailError = message
    return this
  }

  public passwordError (): string {
    return this._passwordError
  }

  public withPasswordError (message: string): Failure {
    this._passwordError = message
    return this
  }
}
