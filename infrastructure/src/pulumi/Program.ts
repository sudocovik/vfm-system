import { Stack } from './Stack'

export class Program {
    constructor(stack: Stack) {
        if (stack instanceof Stack === false)
            throw new TypeError()
    }
}