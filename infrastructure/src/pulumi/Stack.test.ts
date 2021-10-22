import { EmptyValueError, LocalStack, ProductionStack } from './Stack'

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
        { type: 'symbol',    value: Symbol('test') }
    ]

    forbiddenTypes.forEach(({ type, value }) => {
        it(`should not accept '${type}'`, () => {
            expect.assertions(2)
            try {
                new ProductionStack(value as any)
            }
            catch (e) {
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
        it(`should not accept ${name}`, () => {
            expect.assertions(1)
            try {
                new ProductionStack(value)
            }
            catch (e) {
                errorShouldBeInstanceOfEmptyValueError(e)
            }
        })
    })

    it('should trim all front and back whitespaces', () => {
        expect(new ProductionStack('  test  ').name).toBe('test')
    })

    it('should accept string', () => {
        expect(new ProductionStack('test').name).toBe('test')
    })
})

describe('#LocalStack', () => {
    it('should always return hardcoded value \'local\'', () => {
        expect(new LocalStack().name).toBe('local')
    })
})