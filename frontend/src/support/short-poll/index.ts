export const shortPoll = {
  do: async function <T = unknown> (
    action: () => Promise<T>,
    resultHandler: (result: Awaited<Promise<T>>) => Promise<unknown>,
    delayInMilliseconds: number
  ) {
    const result = await action()
    resultHandler(result)
    setTimeout(() => void shortPoll.do(action, resultHandler, delayInMilliseconds), delayInMilliseconds)
  }
}
