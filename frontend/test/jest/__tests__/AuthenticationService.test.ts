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
