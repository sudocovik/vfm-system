export interface LocalClusterRunner {
    create(): Promise<void>

    exists(): Promise<boolean>

    start(): Promise<void>

    destroy(): Promise<void>
}

export class LocalClusterIsMissingException extends Error {}

export class LocalCluster {
    public constructor(
        public cluster: LocalClusterRunner
    ) {}

    public async launch(): Promise<string> {
        if (await this.cluster.exists() === false) {
            await this.cluster.create()
        }

        return ''
    }

    public async destroy(): Promise<void> {
        if (await this.cluster.exists() === false) {
            throw new LocalClusterIsMissingException()
        }

        await this.cluster.destroy()
    }
}

