import { describe, expect, it, jest } from '@jest/globals'
import { shortPoll } from '../index'

const originalShortPoll = shortPoll.do

describe('shortPoll', () => {
  afterEach(() => jest.clearAllMocks())
  afterEach(() => (shortPoll.do = originalShortPoll))

  it('should execute action()', async () => {
    const action = jest.fn().mockImplementationOnce(() => (shortPoll.do = jest.fn())) as () => Promise<unknown>

    await shortPoll.do(action, () => Promise.resolve(), 10)

    expect(action).toHaveBeenCalled()
  })

  it('should pass action() result to a resultHandler()', async () => {
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

  it('should wait for resultHandler() to finish before starting sleep()', async () => {
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

  it('should pass delayInMilliseconds to a sleep()', async () => {
    const sleepSpy = shortPoll.sleep = jest.fn()

    const delayInMilliseconds = 150
    const action = () => {
      shortPoll.do = jest.fn()
      return Promise.resolve()
    }
    const resultHandler = () => Promise.resolve()

    await shortPoll.do(action, resultHandler, delayInMilliseconds)
    expect(sleepSpy).toHaveBeenCalledWith(delayInMilliseconds)
  })

  it('should call next poll with the same arguments', async () => {
    const shortPollSpy = jest.fn()

    const delayInMilliseconds = 150
    const action = () => {
      shortPoll.do = shortPollSpy as typeof shortPoll.do
      return Promise.resolve()
    }
    const resultHandler = () => Promise.resolve()

    await shortPoll.do(action, resultHandler, delayInMilliseconds)
    expect(shortPollSpy).toHaveBeenCalledWith(action, resultHandler, delayInMilliseconds)
  })
})
