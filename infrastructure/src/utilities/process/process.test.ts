import { MultipleGracefulShutdownHandlersPermittedException, SimpleProcess } from './process'
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

describe('#CustomProcess', () => {
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

    it('should do nothing if no callback is given', async () => {
      const process: CustomProcess = new TestProcess()

      await expect(process.run(async () => {})).resolves.not.toThrow()
    })

    it('should throw on multiple calls of onGracefulShutdown', async () => {
      const process: CustomProcess = new TestProcess()

      try {
        process.onGracefulShutdownRequest(async () => {})
        process.onGracefulShutdownRequest(async () => {})
      }
      catch (e) {
        expect(e).toBeInstanceOf(MultipleGracefulShutdownHandlersPermittedException)
      }

      expect.assertions(1)
    })
  })
})