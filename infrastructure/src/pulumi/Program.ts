import { Stack } from './Stack'
import { PulumiStackExecutor, StackExecutor } from './StackExecutor'

export class Program {
    static forStack(stack: Stack): Program {
        return new Program(stack, new PulumiStackExecutor())
    }

    constructor(
        public readonly stack: Stack,
        private readonly stackExecutor: StackExecutor,
    ) {
        if (stack instanceof Stack === false)
            throw new TypeError()
    }

    public async execute(): Promise<void> {
        await this.stackExecutor.select(this.stack)
        await this.stackExecutor.installPlugins()
        await this.stackExecutor.refreshState()
        await this.stackExecutor.deployResources()
    }
}