const stringRepresentationOfVariableType = (value: any) => {
    // typeof null returns 'object' so null has to be given special treatment...
    if (value === null) return 'null'
    return typeof value
}

export class ProductionStack {
    constructor(public readonly name: string) {
        if (typeof name !== 'string')
            throw new TypeError('Stack name should be string, got ' + stringRepresentationOfVariableType(name))
    }
}
