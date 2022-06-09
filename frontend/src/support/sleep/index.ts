export const sleep = {
  now: (ms: number) => new Promise(resolve => setTimeout(resolve, ms))
}
