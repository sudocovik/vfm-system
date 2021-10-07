import { SimpleProcess } from './process'

describe('#process', () => {
  test('run() should bubble up exceptions', async () => {
    await expect(
        new SimpleProcess().run(async () => { throw new Error })
    ).rejects.toThrow()
  })

  test('should be runnable', () => {
    let hasRun: boolean = false

    new SimpleProcess().run(async () => { hasRun = true })

    expect(hasRun).toBe(true)
  })
})