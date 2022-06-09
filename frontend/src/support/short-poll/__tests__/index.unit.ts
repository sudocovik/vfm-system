import { describe, expect, it, jest } from '@jest/globals'
import { shortPoll } from '../index'

const originalShortPoll = shortPoll.do

describe('shortPoll', () => {
  afterEach(() => jest.clearAllMocks())
  afterEach(() => (shortPoll.do = originalShortPoll))

  it('should execute my action', async () => {
    const action = jest.fn().mockImplementationOnce(() => (shortPoll.do = jest.fn())) as () => Promise<unknown>

    await shortPoll.do(action, () => Promise.resolve(), 10)

    expect(action).toHaveBeenCalled()
  })

  it('should pass action result to a result handler', async () => {
    expect.assertions(1)

    const result = '123456'
    const action = () => {
      shortPoll.do = jest.fn()
      return Promise.resolve(result)
    }
    const resultHandler = (response: Awaited<ReturnType<typeof action>>) => {
      void expect(response).toEqual(result)
      return Promise.resolve()
    }

    await shortPoll.do(action, resultHandler, 10)
  })

  it('should wait for sleep() to finish before running next poll', async () => {
    const sleepSpy = jest.fn()
    const shortPollSpy = jest.fn()

    shortPoll.sleep = () => Promise.resolve().then(sleepSpy)

    const action = () => {
      shortPoll.do = shortPollSpy as () => Promise<void>
      return Promise.resolve()
    }
    const resultHandler = () => Promise.resolve()

    await shortPoll.do(action, resultHandler, 10)
    expect(shortPollSpy.mock.invocationCallOrder[0]).toBeGreaterThan(sleepSpy.mock.invocationCallOrder[0])
  })

  it('should not run next poll before resultHandler has finished executing', async () => {
    const timeoutSpy = shortPoll.sleep = jest.fn()
    const resultHandlerSpy = jest.fn()

    const delayInMilliseconds = 150
    const action = () => {
      shortPoll.do = jest.fn()
      return Promise.resolve()
    }
    const resultHandler = () => Promise.resolve().then(resultHandlerSpy)

    await shortPoll.do(action, resultHandler, delayInMilliseconds)
    expect(resultHandlerSpy.mock.invocationCallOrder[0]).toBeLessThan(timeoutSpy.mock.invocationCallOrder[0])
  })
})
