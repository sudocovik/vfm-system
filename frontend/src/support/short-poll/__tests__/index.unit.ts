import { describe, expect, it, jest } from '@jest/globals'
import { ActionHandler, ResultHandler, shortPoll } from '../index'

const originalShortPoll = shortPoll.do
const originalSleep = shortPoll.sleep

describe('shortPoll', () => {
  afterEach(() => jest.clearAllMocks())
  afterEach(resetShortPoll)
  afterEach(() => (shortPoll.sleep = originalSleep))

  it('should execute action()', async () => {
    const action = jest.fn(stubShortPoll) as unknown as () => Promise<unknown>
    const { poll } = shortPollFactory({ action })

    await poll()

    expect(action).toHaveBeenCalled()
  })

  it('should pass action() result to a resultHandler()', async () => {
    const result = '123456'
    let resultFromHandler = ''
    const action = () => {
      stubShortPoll()
      return Promise.resolve(result)
    }
    const resultHandler = ((response: Awaited<ReturnType<typeof action>>) => {
      resultFromHandler = response
      return Promise.resolve()
    }) as ResultHandler

    const { poll } = shortPollFactory({ action, resultHandler })
    await poll()

    expect(resultFromHandler).toEqual(result)
  })

  it('should wait for resultHandler() to finish before starting sleep()', async () => {
    const sleepSpy = shortPoll.sleep = jest.fn()
    const resultHandlerSpy = jest.fn()
    const resultHandler = () => Promise.resolve().then(resultHandlerSpy)

    const { poll } = shortPollFactory({ resultHandler })
    await poll()

    expect(resultHandlerSpy.mock.invocationCallOrder[0]).toBeLessThan(sleepSpy.mock.invocationCallOrder[0])
  })

  it('should wait for sleep() to finish before running next poll', async () => {
    const sleepSpy = jest.fn()
    shortPoll.sleep = () => Promise.resolve().then(sleepSpy)

    const { poll, shortPollSpy } = shortPollFactory()
    await poll()

    expect(shortPollSpy.mock.invocationCallOrder[0]).toBeGreaterThan(sleepSpy.mock.invocationCallOrder[0])
  })

  it('should pass delayInMilliseconds to a sleep()', async () => {
    const sleepSpy = shortPoll.sleep = jest.fn()
    const delayInMilliseconds = 150

    const { poll } = shortPollFactory({ delayInMilliseconds })
    await poll()

    expect(sleepSpy).toHaveBeenCalledWith(delayInMilliseconds)
  })

  it('should call next poll with the same arguments', async () => {
    const { poll, action, resultHandler, delayInMilliseconds, shortPollSpy } = shortPollFactory()
    await poll()

    expect(shortPollSpy).toHaveBeenCalledWith(action, resultHandler, delayInMilliseconds)
  })
})

function stubShortPoll () {
  shortPoll.do = jest.fn()
}

function resetShortPoll () {
  shortPoll.do = originalShortPoll
}

type ShortPollArguments<T = unknown> = {
  action?: ActionHandler<T>,
  resultHandler?: ResultHandler<T>,
  delayInMilliseconds?: number
}

function shortPollFactory (args?: ShortPollArguments) {
  const shortPollSpy = jest.fn()

  const defaults = {
    action: () => {
      shortPoll.do = shortPollSpy as () => Promise<void>
      return Promise.resolve()
    },
    resultHandler: () => Promise.resolve(),
    delayInMilliseconds: 0
  }

  const { action, resultHandler, delayInMilliseconds } = { ...defaults, ...args }

  const factory = () => shortPoll.do(action, resultHandler, delayInMilliseconds)

  return {
    poll: factory,
    action,
    resultHandler,
    delayInMilliseconds,
    shortPollSpy
  }
}
