import { describe, expect, it, jest } from '@jest/globals'
import { shortPoll } from '../index'

describe('shortPoll', () => {
  afterEach(() => jest.clearAllMocks())

  it('should execute my action', async () => {
    let hasExecuted = false
    const action = () => {
      hasExecuted = true
      return Promise.resolve()
    }

    await shortPoll.do(action, () => Promise.resolve(), 10)

    expect(hasExecuted).toEqual(true)
  })

  it('should pass action result to a result handler', async () => {
    expect.assertions(1)

    const result = '123456'
    const action = () => Promise.resolve(result)
    const resultHandler = (response: Awaited<ReturnType<typeof action>>) => {
      void expect(response).toEqual(result)
      return Promise.resolve()
    }

    await shortPoll.do(action, resultHandler, 10)
  })

  it('should wait given delayInMilliseconds before next poll', async () => {
    jest.useFakeTimers()
    jest.spyOn(global, 'setTimeout')
    jest.spyOn(shortPoll, 'do')

    const delayInMilliseconds = 150
    const action = () => Promise.resolve()
    const resultHandler = () => Promise.resolve()

    expect(setTimeout).toHaveBeenCalledTimes(0)

    await shortPoll.do(action, resultHandler, delayInMilliseconds)

    expect(setTimeout).toHaveBeenCalledTimes(1)
    expect(setTimeout).toHaveBeenLastCalledWith(expect.any(Function), delayInMilliseconds)
    expect(shortPoll.do).toHaveBeenCalledTimes(1)

    jest.advanceTimersByTime(delayInMilliseconds)
    expect(shortPoll.do).toHaveBeenCalledTimes(2)
  })

  it('should not run next poll before resultHandler has finished executing', async () => {
    const timeoutSpy = jest.spyOn(global, 'setTimeout')
    const resultHandlerSpy = jest.fn()

    const delayInMilliseconds = 150
    const action = () => Promise.resolve()
    const resultHandler = () => Promise.resolve().then(resultHandlerSpy)

    await shortPoll.do(action, resultHandler, delayInMilliseconds)
    expect(resultHandlerSpy.mock.invocationCallOrder[0]).toBeLessThan(timeoutSpy.mock.invocationCallOrder[0])
  })
})
