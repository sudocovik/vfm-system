import { Program } from '../Program'

const errorShouldBeInstanceOfTypeError = (error: Error) => {
    expect(error).toBeInstanceOf(TypeError)
}

describe('#Program', () => {
    describe('- constructor()', () => {
        const forbiddenTypes = [
            { type: 'null',      value: null },
            { type: 'undefined', value: undefined },
            { type: 'array',     value: [] },
            { type: 'integer',   value: 1234 },
            { type: 'float',     value: 3.14 },
            { type: 'true',      value: true },
            { type: 'false',     value: false },
            { type: 'bigint',    value: 22n ** 53n },
            { type: 'symbol',    value: Symbol('test') },
            { type: 'function',  value: () => {} },
            { type: 'string',    value: 'test' },
            { type: 'object',    value: {} }
        ]

        forbiddenTypes.forEach(({ type, value }) => {
            it(`argument 'stack' should not accept '${type}'`, () => {
                expect.assertions(1)
                try {
                    new Program(value as any)
                }
                catch (e: any) {
                    errorShouldBeInstanceOfTypeError(e)
                }
            })
        })
    })
})
