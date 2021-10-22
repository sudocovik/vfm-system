import { ProductionStack } from './Stack'

describe('#ProductionStack', () => {
    it('should not accept null', () => {
        expect.assertions(1)
        try {
            new ProductionStack(null as any)
        }
        catch (e) {
            expect(e).toBeInstanceOf(TypeError)
        }
    })

    it('should not accept undefined', () => {
        expect.assertions(1)
        try {
            new ProductionStack(undefined as any)
        }
        catch (e) {
            expect(e).toBeInstanceOf(TypeError)
        }
    })

    it('should not accept object', () => {
        expect.assertions(1)
        try {
            new ProductionStack({} as any)
        }
        catch (e) {
            expect(e).toBeInstanceOf(TypeError)
        }
    })

    it('should not accept array', () => {
        expect.assertions(1)
        try {
            new ProductionStack([] as any)
        }
        catch (e) {
            expect(e).toBeInstanceOf(TypeError)
        }
    })

    it('should not accept integer', () => {
        expect.assertions(1)
        try {
            new ProductionStack( 1234 as any)
        } catch (e) {
            expect(e).toBeInstanceOf(TypeError)
        }
    })

    it('should not accept float', () => {
        expect.assertions(1)
        try {
            new ProductionStack(3.14 as any)
        }
        catch (e) {
            expect(e).toBeInstanceOf(TypeError)
        }
    })

    it('should not accept true', () => {
        expect.assertions(1)
        try {
            new ProductionStack(true as any)
        }
        catch (e) {
            expect(e).toBeInstanceOf(TypeError)
        }
    })

    it('should not accept false', () => {
        expect.assertions(1)
        try {
            new ProductionStack(false as any)
        }
        catch (e) {
            expect(e).toBeInstanceOf(TypeError)
        }
    })

    it('should not accept big integers', () => {
        expect.assertions(1)
        try {
            new ProductionStack(22n ** 53n as any)
        }
        catch (e) {
            expect(e).toBeInstanceOf(TypeError)
        }
    })

    it('should not accept symbols', () => {
        expect.assertions(1)
        try {
            new ProductionStack(Symbol('test') as any)
        }
        catch (e) {
            expect(e).toBeInstanceOf(TypeError)
        }
    })

    it('should accept string', () => {
        expect(new ProductionStack('test').name).toBe('test')
    })
})