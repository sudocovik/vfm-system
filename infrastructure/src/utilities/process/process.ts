import { CustomProcess } from './index'

export class SimpleProcess implements CustomProcess {
    public async run(callback: () => Promise<void>): Promise<void> {
        await callback()
    }
}

export class InfiniteProcess extends SimpleProcess {
    public override async run(callback: () => Promise<void>): Promise<void> {
        await super.run(callback)
        setInterval(() => {}, 60 * 1000)
    }
}