import { CustomProcess } from './index'

export class SimpleProcess implements CustomProcess {
    protected gracefulShutdownHandler: () => Promise<void> | undefined = () => undefined

    public async run(callback: () => Promise<void>): Promise<void> {
        process.on('SIGINT', this.gracefulShutdownHandler)
        await callback()
    }

    public onGracefulShutdownRequest(action: () => Promise<void>): void {
        this.gracefulShutdownHandler = action
    }
}

export class InfiniteProcess extends SimpleProcess {
    public override async run(callback: () => Promise<void>): Promise<void> {
        await super.run(callback)
        setInterval(() => {}, 60 * 1000)
    }
}