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
    private readonly _resources: () => any

    constructor(name: string, resources: () => any) {
        if (typeof name !== 'string')
            throw new TypeError('Stack name should be string, got ' + stringRepresentationOfVariableType(name))

        name = name.trim()

        if (name === '')
            throw new EmptyValueError('Stack name should not be empty string')

        if (typeof resources !== 'function')
            throw new TypeError('Stack resources should be function, got ' + stringRepresentationOfVariableType(resources))

        this._name = name
        this._resources = resources
    }

    public name(): string {
        return this._name
    }

    public resources(): () => any {
        return this._resources
    }
}

export class LocalStack implements Stack {
    public name(): string {
        return 'local'
    }
}
