import { InvalidCredentialsError, NetworkError, UndefinedServerError } from './errors'
import axios, { AxiosError } from 'axios'

export class AuthenticationService {
  public async login (email: string, password: string): Promise<void> {
    try {
      await axios.post('/session', { email, password })
    }
    catch (e) {
      const error = <AxiosError>e

      if (error.response) {
        const { status: statusCode } = error.response
        if (statusCode === 401) {
          throw new InvalidCredentialsError()
        }

        throw new UndefinedServerError()
      }
      else if (error.message === 'Network Error') {
        throw new NetworkError()
      }
      else throw e
    }
  }
}

export { InvalidCredentialsError, NetworkError, UndefinedServerError }
