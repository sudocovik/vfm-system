import { Program } from '../Program'
import { Stack } from '../Stack'
import { StackExecutor } from '../StackExecutor'

const noResources = async () => { /* empty because test's do not need resources */ }

const errorShouldBeInstanceOfTypeError = (error: Error) => {
  expect(error).toBeInstanceOf(TypeError)
}

type FactoryArguments = {
    stack?: Stack,
    executor?: StackExecutor
}

const factory = ({ stack, executor }: FactoryArguments = {}) => {
  return new Program(
    stack ?? new Stack('testing', noResources),
    executor ?? new FakeStackExecutor()
  )
}

class FakeStackExecutor implements StackExecutor {
    public stackSelected = false
    public pluginsInstalled = false
    public stateRefreshed = false
    public deployedResources = false

    public async select (): Promise<void> {
      this.stackSelected = true
    }

    public async installPlugins (): Promise<void> {
      this.pluginsInstalled = true
    }

    public async refreshState (): Promise<void> {
      this.stateRefreshed = true
    }

    public async deployResources (): Promise<void> {
      this.deployedResources = true
    }
}

describe('#Program', () => {
  describe('- constructor()', () => {
    const forbiddenTypes = [
      { type: 'null', value: null },
      { type: 'undefined', value: undefined },
      { type: 'array', value: [] },
      { type: 'integer', value: 1234 },
      { type: 'float', value: 3.14 },
      { type: 'true', value: true },
      { type: 'false', value: false },
      { type: 'bigint', value: 22n ** 53n },
      { type: 'symbol', value: Symbol('test') },
      { type: 'function', value: () => { /* empty because the test does nothing with function body */ } },
      { type: 'string', value: 'test' },
      { type: 'object', value: {} }
    ]

    forbiddenTypes.forEach(({ type, value }) => {
      it(`argument 'stack' should not accept '${type}'`, () => {
        expect.assertions(1)
        try {
          new Program(value as never, new FakeStackExecutor())
        } catch (e: unknown) {
          const error = <Error>e
          errorShouldBeInstanceOfTypeError(error)
        }
      })
    })

    it('argument \'stack\' should only accept Stack type', () => {
      expect(() => factory()).not.toThrow()
    })
  })

  describe('- execute()', () => {
    it('should select the stack', async () => {
      const executor = new FakeStackExecutor()
      const program = factory({ executor })

      expect(executor.stackSelected).toBe(false)
      await program.execute()
      expect(executor.stackSelected).toBe(true)
    })

    it('should install plugins', async () => {
      const executor = new FakeStackExecutor()
      const program = factory({ executor })

      expect(executor.pluginsInstalled).toBe(false)
      await program.execute()
      expect(executor.pluginsInstalled).toBe(true)
    })

    it('should refresh the state', async () => {
      const executor = new FakeStackExecutor()
      const program = factory({ executor })

      expect(executor.stateRefreshed).toBe(false)
      await program.execute()
      expect(executor.stateRefreshed).toBe(true)
    })

    it('should deploy resources', async () => {
      const executor = new FakeStackExecutor()
      const program = factory({ executor })

      expect(executor.deployedResources).toBe(false)
      await program.execute()
      expect(executor.deployedResources).toBe(true)
    })
  })
})
