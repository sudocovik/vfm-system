import { CustomProcess } from './index'

export class MultipleGracefulShutdownHandlersPermittedException extends Error {}

export class SimpleProcess implements CustomProcess {
    protected gracefulShutdownHandler: () => Promise<void> | undefined = () => undefined
    protected gracefulShutdownHandlerConfigured: boolean = false

    public async run(callback: () => Promise<void>): Promise<void> {
        process.on('SIGINT', this.gracefulShutdownHandler)
        await callback()
    }

    public onGracefulShutdownRequest(action: () => Promise<void>): void {
        if (this.gracefulShutdownHandlerConfigured)
            throw new MultipleGracefulShutdownHandlersPermittedException('Only one handler for onGracefulShutdownRequest() is allowed')

        this.gracefulShutdownHandler = action
        this.gracefulShutdownHandlerConfigured = true
    }
}

export class InfiniteProcess extends SimpleProcess {
    public override async run(callback: () => Promise<void>): Promise<void> {
        await super.run(callback)
        setInterval(() => {}, 60 * 1000)
    }
}