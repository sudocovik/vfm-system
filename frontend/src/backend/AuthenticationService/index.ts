import { InvalidCredentialsError, NetworkError, UndefinedServerError } from './errors'
import axios, { AxiosError } from 'axios'

export class AuthenticationService {
  public async login (email: string, password: string): Promise<void> {
    try {
      await axios.post('/session', { email, password })
    }
    catch (e) {
      const error = <AxiosError>e

      if (Object.prototype.hasOwnProperty.call(error, 'response')) {
        if (error.response?.status === 401) {
          throw new InvalidCredentialsError()
        }

        throw new UndefinedServerError()
      }
      else if (error.message === 'Network Error') {
        throw new NetworkError()
      }
    }
  }
}

export { InvalidCredentialsError, NetworkError, UndefinedServerError }
