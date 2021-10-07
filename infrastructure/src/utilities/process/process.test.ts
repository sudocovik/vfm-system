import { SimpleProcess } from './process'
import { CustomProcess } from './index'

class TestProcess extends SimpleProcess {
  public override async run(callback: () => Promise<any>): Promise<void> {
    await callback()
    await this.gracefulShutdownHandler()
  }
}

describe('#process', () => {
  test('run() should bubble up exceptions', async () => {
    await expect(
        new TestProcess().run(async () => { throw new Error })
    ).rejects.toThrow()
  })

  test('should be runnable', () => {
    let hasRun: boolean = false

    new TestProcess().run(async () => { hasRun = true })

    expect(hasRun).toBe(true)
  })

  test('can handle SIGINT', async () => {
    const process: CustomProcess = new TestProcess()
    let hasRun: boolean = false

    process.onGracefulShutdownRequest(async () => { hasRun = true })
    await process.run(async () => {})

    expect(hasRun).toBe(true)
  })
})