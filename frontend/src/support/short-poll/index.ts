export type ActionHandler<T = unknown> = () => Promise<T>
export type ResultHandler<T = unknown> = (result: Awaited<Promise<T>>) => Promise<unknown>

export const shortPoll = {
  sleep: (ms: number) => new Promise(resolve => setTimeout(resolve, ms)),
  do: async function <T = unknown> (
    action: ActionHandler<T>,
    resultHandler: ResultHandler<T>,
    delayInMilliseconds: number
  ) {
    const result = await action()
    await resultHandler(result)
    await shortPoll.sleep(delayInMilliseconds)
    await shortPoll.do(action, resultHandler, delayInMilliseconds)
    // |-- this await has not been covered by unit tests but eslint fails if it's missing
  }
}
