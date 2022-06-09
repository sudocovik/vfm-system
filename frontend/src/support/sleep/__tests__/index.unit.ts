/*
  Credits: Brian Adams (https://stackoverflow.com/users/10149510/brian-adams)
  Original implementation: https://stackoverflow.com/a/52686304/5462427
 */

import { describe, expect, jest } from '@jest/globals'
import { sleep } from '../index'

const runAllQueuedCallbacks = () => Promise.resolve()

describe('sleep', () => {
  beforeEach(() => jest.useFakeTimers())
  afterEach(() => jest.useRealTimers())

  it('should pause execution for specified number of milliseconds', async () => {
    const spy = jest.fn()
    const duration = 500
    const delta = 10
    void sleep.now(duration).then(spy)

    jest.advanceTimersByTime(duration - delta)
    await runAllQueuedCallbacks()
    expect(spy).not.toHaveBeenCalled()

    jest.advanceTimersByTime(delta)
    await runAllQueuedCallbacks()
    expect(spy).toHaveBeenCalledTimes(1)
  })
})
