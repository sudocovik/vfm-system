import { sleep } from 'src/support/sleep'

export type ActionHandler<T = unknown> = () => Promise<T>

export const shortPoll = {
  do: function <T = unknown> (
    action: ActionHandler<T>,
    delayInMilliseconds: number
  ) {
    let shouldExit = false

    const run = async () => {
      if (shouldExit) return

      await action()
      await sleep.now(delayInMilliseconds)
      await run()
    }

    void run()

    return () => (shouldExit = true)
  }
}
