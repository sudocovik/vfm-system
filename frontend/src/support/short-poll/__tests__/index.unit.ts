import { describe, expect, it, jest } from '@jest/globals'
import { ActionHandler, shortPoll } from '../'
import fakeTimers from '@sinonjs/fake-timers'

describe('shortPoll', () => {
  it('should execute action, wait delayInMilliseconds and repeat indefinitely', async () => {
    const clock = fakeTimers.install()
    const delay = 2000
    const action = jest.fn()

    shortPoll.do(action as ActionHandler, delay)

    // by advancing the timer five times assume the function runs indefinitely
    // also validate action() was called immediately without any timers when shortPoll was first called
    // if you move sleep() before action() this test will report less invocation calls than expected
    const initialInvocation = 1
    const totalCycles = 5
    await clock.tickAsync(delay * totalCycles)
    expect(action).toHaveBeenCalledTimes(initialInvocation + totalCycles)

    clock.uninstall()
  })

  it('should be stoppable', async () => {
    const clock = fakeTimers.install()
    const delay = 2000
    const action = jest.fn()

    const stopShortPoll = shortPoll.do(action as ActionHandler, delay)

    await clock.tickAsync(delay)
    stopShortPoll()
    const invocationCountUntilStop = action.mock.calls.length

    await clock.tickAsync(delay)
    expect(action).toHaveBeenCalledTimes(invocationCountUntilStop)

    clock.uninstall()
  })
})
