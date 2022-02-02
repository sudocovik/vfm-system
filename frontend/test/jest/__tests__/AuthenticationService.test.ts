import { describe, expect, it } from '@jest/globals'
import {
  AuthenticationService,
  InvalidCredentialsError,
  NetworkError,
  UndefinedServerError
} from 'src/backend/AuthenticationService'
import MockAdapter from 'axios-mock-adapter'
import axios from 'axios'
import { CustomError } from 'ts-custom-error'

describe('AuthenticationService', () => {
  describe('login()', () => {
    it('should clearly articulate something is wrong in the application', () => {
      simulateApplicationErrorSituation()

      return expect(AuthenticationService.login('', '')).rejects.toBeInstanceOf(RandomApplicationError)
    })

    it('should clearly articulate something is wrong with the network', () => {
      simulateNetworkErrorSituation()

      return expect(AuthenticationService.login('', '')).rejects.toBeInstanceOf(NetworkError)
    })

    it('should clearly articulate something is wrong with the server', () => {
      simulateServerErrorSituation()

      return expect(AuthenticationService.login('', '')).rejects.toBeInstanceOf(UndefinedServerError)
    })

    it('should clearly articulate given credentials are incorrect', () => {
      simulateWrongCredentialsSituation()

      return expect(AuthenticationService.login('invalid@example.com', 'invalid-password'))
        .rejects.toBeInstanceOf(InvalidCredentialsError)
    })

    it('should exit successfully given correct credentials', () => {
      simulateCorrectCredentialsSituation()

      return expect(AuthenticationService.login('valid@example.com', 'valid-password'))
        .resolves.toBeUndefined()
    })

    it('should send request data as application/x-www-form-urlencoded type', async () => {
      let contentType = ''
      let data = ''

      const mock = new MockAdapter(axios)
      mock.onPost(AuthenticationService.loginEndpoint).reply(config => {
        contentType = config.headers ? config.headers['Content-Type'] : ''
        data = <string>config.data

        return [200]
      })
      await AuthenticationService.login('irrelevant@example.com', 'valid-password')
      expect(contentType).toEqual('application/x-www-form-urlencoded; charset=utf-8')
      expect(data).toEqual('email=irrelevant%40example.com&password=valid-password')
    })
  })

  describe('check()', () => {
    it('should return true when user is authenticated', () => {
      const mock = new MockAdapter(axios)
      mock.onGet(AuthenticationService.sessionEndpoint).replyOnce(204)

      return expect(AuthenticationService.check()).resolves.toEqual(true)
    })

    it('should return false when user is not authenticated', () => {
      const mock = new MockAdapter(axios)
      mock.onGet(AuthenticationService.sessionEndpoint).replyOnce(404)

      return expect(AuthenticationService.check()).resolves.toEqual(false)
    })

    it('should return undefined if error occurs', () => {
      const mock = new MockAdapter(axios)
      mock.onGet(AuthenticationService.sessionEndpoint).replyOnce(() => {
        throw new Error()
      })

      return expect(AuthenticationService.check()).resolves.toEqual(undefined)
    })
  })
})

class RandomApplicationError extends CustomError {
}

function simulateApplicationErrorSituation (): void {
  const mock = new MockAdapter(axios)
  mock.onPost(AuthenticationService.loginEndpoint).reply(() => {
    throw new RandomApplicationError()
  })
}

function simulateNetworkErrorSituation (): void {
  const mock = new MockAdapter(axios)
  mock.onPost(AuthenticationService.loginEndpoint).networkErrorOnce()
}

function simulateServerErrorSituation (): void {
  const mock = new MockAdapter(axios)
  mock.onPost(AuthenticationService.loginEndpoint).replyOnce(500)
}

function simulateWrongCredentialsSituation (): void {
  const mock = new MockAdapter(axios)
  mock.onPost(AuthenticationService.loginEndpoint).replyOnce(401)
}

function simulateCorrectCredentialsSituation (): void {
  const mock = new MockAdapter(axios)
  mock.onPost(AuthenticationService.loginEndpoint).replyOnce(200)
}
