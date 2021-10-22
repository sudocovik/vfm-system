import { ProductionStack } from './Stack'

describe('#ProductionStack', () => {
    const forbiddenTypes = [
        { type: 'null', value: null },
        { type: 'undefined', value: undefined },
        { type: 'object', value: {} },
        { type: 'array', value: [] },
        { type: 'integer', value: 1234 },
        { type: 'float', value: 3.14 },
        { type: 'true', value: true },
        { type: 'false', value: false },
        { type: 'bigint', value: 22n ** 53n },
        { type: 'symbol', value: Symbol('test') }
    ]

    forbiddenTypes.forEach(({ type, value }) => {
        it(`should not accept '${type}'`, () => {
            expect.assertions(1)
            try {
                new ProductionStack(value as any)
            }
            catch (e) {
                expect(e).toBeInstanceOf(TypeError)
            }
        })
    })

    it('should accept string', () => {
        expect(new ProductionStack('test').name).toBe('test')
    })
})