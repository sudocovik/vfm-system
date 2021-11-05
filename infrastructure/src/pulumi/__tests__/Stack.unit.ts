import { EmptyValueError, LocalStack, ProductionStack } from '../Stack'

const errorShouldBeInstanceOfTypeError = (error: Error) => {
    expect(error).toBeInstanceOf(TypeError)
}

const errorShouldBeInstanceOfEmptyValueError = (error: Error) => {
    expect(error).toBeInstanceOf(EmptyValueError)
}

const errorMessageShouldEndWith = (error: Error, substring: string) => {
    const endsWith = (value: string): RegExp => new RegExp(''+ value +'$')

    expect(error.message).toMatch(endsWith(substring))
}

describe('#ProductionStack', () => {
    const instantiateProductionStackWithDefaultResources = (value: any) => new ProductionStack(value as any, async () => {})
    const instantiateProductionStackWithDefaultName = (value: any) => new ProductionStack('test', value as any)

    describe('- constructor()', () => {
        const forbiddenTypes = [
            { type: 'null',      value: null },
            { type: 'undefined', value: undefined },
            { type: 'object',    value: {} },
            { type: 'array',     value: [] },
            { type: 'integer',   value: 1234 },
            { type: 'float',     value: 3.14 },
            { type: 'true',      value: true },
            { type: 'false',     value: false },
            { type: 'bigint',    value: 22n ** 53n },
            { type: 'symbol',    value: Symbol('test') },
            { type: 'function',  value: () => {} },
            { type: 'string',    value: 'test' },
        ]

        forbiddenTypes.filter(({ type }) => type !== 'string').forEach(({ type, value }) => {
            it(`argument 'name' should not accept '${type}'`, () => {
                expect.assertions(2)
                try {
                    instantiateProductionStackWithDefaultResources(value)
                }
                catch (e: any) {
                    const stringRepresentationOfVariableType: string = value === null ? 'null' : typeof value

                    errorShouldBeInstanceOfTypeError(e)
                    errorMessageShouldEndWith(e, stringRepresentationOfVariableType)
                }
            })
        })

        const forbiddenStringValues = [
            { name: 'empty string',                               value: ''},
            { name: 'string with only a single whitespace',       value: ' '},
            { name: 'string with a couple of whitespaces only',   value: '   '},
            { name: 'string with many whitespaces only',          value: '                  '},
            // there are infinite possibilities here but these should be enough
        ]

        forbiddenStringValues.forEach(({ name, value }) => {
            it(`argument 'name' should not accept ${name}`, () => {
                expect.assertions(1)
                try {
                    instantiateProductionStackWithDefaultResources(value)
                }
                catch (e: any) {
                    errorShouldBeInstanceOfEmptyValueError(e)
                }
            })
        })
    })

    describe('- name()', () => {
        it('should return string trimmed of front and back whitespaces', () => {
            const stack = instantiateProductionStackWithDefaultResources('  test  ')

            const stackName = stack.name()

            expect(stackName).toBe('test')
        })
    })

    describe('- resources()', () => {
        it('should return a function', () => {
            const stack = instantiateProductionStackWithDefaultName(() => {})

            const resources = stack.resources()

            expect(typeof resources).toBe('function')
        })

        it('should not implicitly call the function', () => {
            const stack = instantiateProductionStackWithDefaultName(() => {
                throw new Error('This should never happen')
            })

            const resources = stack.resources()

            expect(() => resources).not.toThrow()
        })

        it('should return a function and that function should return false', () => {
            const stack = instantiateProductionStackWithDefaultName(() => false)

            const resources = stack.resources()

            expect(resources()).toBe(false)
        })

        it('should return a function and that function should return true', () => {
            const stack = instantiateProductionStackWithDefaultName(() => true)

            const resources = stack.resources()

            expect(resources()).toBe(true)
        })
    })
})

describe('#LocalStack', () => {
    describe('- name()', () => {
        it('should always return hardcoded value \'local\'', () => {
            const stack = new LocalStack()
            expect(stack.name()).toBe('local')
        })
    })
})