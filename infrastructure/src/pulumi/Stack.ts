const stringRepresentationOfVariableType = (value: any) => {
    // typeof null returns 'object' so null has to be given special treatment...
    if (value === null) return 'null'
    return typeof value
}

export interface Stack {
    name(): string
}

export class EmptyValueError extends Error {}

export class ProductionStack implements Stack {
    private readonly _name: string

    constructor(name: string) {
        if (typeof name !== 'string')
            throw new TypeError('Stack name should be string, got ' + stringRepresentationOfVariableType(name))

        name = name.trim()

        if (name === '')
            throw new EmptyValueError('Stack name should not be empty string')

        this._name = name
    }

    public name(): string {
        return this._name
    }
}

export class LocalStack implements Stack {
    public name(): string {
        return 'local'
    }
}
