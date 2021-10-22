export class ProductionStack {
    constructor(public readonly name: string) {
        if (typeof name === 'number')
            throw new TypeError('Stack name should be string, got number')

        if (name === null)
            throw new TypeError('Stack name should be string, got null')

        if (name === undefined)
            throw new TypeError('Stack name should be string, got undefined')

        if (typeof name === 'object')
            throw new TypeError('Stack name should be string, got object')

        if (typeof name === 'boolean')
            throw new TypeError('Stack name should be string, got boolean')

        if (typeof name === 'bigint')
            throw new TypeError('Stack name should be string, got bigint')

        if (typeof name === 'symbol')
            throw new TypeError('Stack name should be string, got symbol')
    }
}
