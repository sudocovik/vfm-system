import { Stack } from './Stack'

export class Program {
    constructor(stack: Stack) {
        if(stack === null)
            throw new TypeError()

        if(typeof stack === 'undefined')
            throw new TypeError()

        if(Array.isArray(stack))
            throw new TypeError()

        if(!isNaN(parseInt(stack as any)))
            throw new TypeError()

        if(typeof stack === 'boolean')
            throw new TypeError()

        if(typeof stack === 'function')
            throw new TypeError()

        if(typeof stack === 'string')
            throw new TypeError()

        if (typeof stack === 'object' && !(stack instanceof Stack))
            throw new TypeError()
    }
}