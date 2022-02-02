import { InvalidCredentialsError, NetworkError, UndefinedServerError } from './errors'
import axios, { AxiosError } from 'axios'

export class AuthenticationService {
  public static loginEndpoint = '/api/session'
  public static sessionEndpoint = '/api/session'

  public static async login (email: string, password: string): Promise<void> {
    try {
      const endpoint = AuthenticationService.loginEndpoint
      const data = this.encodeRequestData({ email, password })
      const headers = { 'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8' }

      await axios.post(endpoint, data, { headers })
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

  private static encodeRequestData (data: Record<string, string>): string {
    return Object.keys(data)
      .map((key) => `${key}=${encodeURIComponent(data[key])}`)
      .join('&')
  }

  public static async check (): Promise<boolean | undefined> {
    try {
      await axios.get(AuthenticationService.sessionEndpoint)
      return true
    }
    catch (e) {
      const error = <AxiosError>e
      if (error.response?.status === 404) {
        return false
      }
      else return undefined
    }
  }
}

export { InvalidCredentialsError, NetworkError, UndefinedServerError }
