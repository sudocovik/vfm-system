export interface LocalClusterRunner {
    create(): Promise<void>

    exists(): Promise<boolean>

    start(): Promise<void>

    destroy(): Promise<void>
}

export class LocalClusterIsMissingException extends Error {}

export class LocalCluster {
    public constructor(
        public runner: LocalClusterRunner
    ) {}

    public async launch(): Promise<string> {
        if (await this.runner.exists() === false) {
            await this.runner.create()
        }

        return ''
    }

    public async destroy(): Promise<void> {
        if (await this.runner.exists() === false) {
            throw new LocalClusterIsMissingException()
        }

        await this.runner.destroy()
    }
}

