import { SimpleProcess } from './process'
import { CustomProcess } from './index'

class TestProcess extends SimpleProcess {
  public override async run(callback: () => Promise<any>): Promise<void> {
    await callback()
    await this.simulateGracefulShutdown()
  }

  private async simulateGracefulShutdown(): Promise<void> {
    await this.gracefulShutdownHandler()
  }
}

describe('#process', () => {
  describe('main functionality', () => {
    it('should execute callback passed as argument', () => {
      let hasRun: boolean = false

      new TestProcess().run(async () => { hasRun = true })

      expect(hasRun).toBe(true)
    })

    it('should bubble up exceptions', async () => {
      await expect(
          new TestProcess().run(async () => { throw new Error })
      ).rejects.toThrow()
    })
  })

  describe('graceful shutdown handling', () => {
    it('should execute callback passed as argument', async () => {
      const process: CustomProcess = new TestProcess()
      let hasRun: boolean = false

      process.onGracefulShutdownRequest(async () => { hasRun = true })
      await process.run(async () => {})

      expect(hasRun).toBe(true)
    })

    // can handle undefined handler

    // throws on multiple invocations of onGracefulShutdown
  })
})