import { describe, expect, it, jest } from '@jest/globals'
import { Hooks } from 'register-service-worker'

const registrationMock = jest.fn()

jest.mock('register-service-worker', () => ({
  register: registrationMock
}))

describe('ServiceWorker', () => {
  beforeEach(loadServiceWorkerDefinition)

  it('should register a service worker', () => {
    expect(registrationMock).toHaveBeenCalledTimes(1)
  })

  it('should dispatch custom event after updates', () => {
    const dispatchEventSpy = jest.spyOn(document, 'dispatchEvent')

    expect(dispatchEventSpy).not.toHaveBeenCalled()

    simulateServiceWorkerUpdated()

    const event = dispatchEventSpy.mock.calls[0][0] as CustomEvent
    expect(dispatchEventSpy).toHaveBeenCalledTimes(1)
    expect(event).toBeInstanceOf(CustomEvent)
    expect(event.type).toEqual('service-worker-updated')
  })

  it('should expose function for activating updates in event details', () => {
    const dispatchEventSpy = jest.spyOn(document, 'dispatchEvent')

    const { fakePostMessage, fakeServiceWorker } = setupFakeServiceWorker()
    simulateServiceWorkerUpdated(fakeServiceWorker)
    expect(fakePostMessage).not.toHaveBeenCalled()

    const event = dispatchEventSpy.mock.calls[0][0] as CustomEvent
    const eventMethods = event.detail as { activateUpdates: () => void }
    const activateUpdates = eventMethods.activateUpdates

    activateUpdates()
    expect(fakePostMessage).toHaveBeenCalledWith({ type: 'SKIP_WAITING' })
  })
})

function loadServiceWorkerDefinition () {
  // Unfortunately alias doesn't work here
  return import('../../../../src-pwa/register-service-worker')
}

function serviceWorkerHooks () {
  return registrationMock.mock.calls[0][1] as Hooks
}

function simulateServiceWorkerUpdated (fakeRegistration?: Record<string, unknown>) {
  const registration = (fakeRegistration ?? {}) as unknown as ServiceWorkerRegistration
  serviceWorkerHooks().updated?.(registration)
}

function setupFakeServiceWorker () {
  const fakePostMessage = jest.fn()
  const fakeServiceWorker = {
    waiting: {
      postMessage: fakePostMessage
    }
  }
  return { fakePostMessage, fakeServiceWorker }
}
