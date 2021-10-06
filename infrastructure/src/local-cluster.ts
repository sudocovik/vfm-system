export interface LocalClusterManager {
    create(): Promise<void>

    exists(): Promise<boolean>

    start(): Promise<void>

    destroy(): Promise<void>
}

export class LocalClusterIsMissingException extends Error {}

export class LocalCluster {
    public constructor(
        private cluster: LocalClusterManager
    ) {}

    public async launch(): Promise<void> {
        if (await this.cluster.exists() === false) {
            await this.cluster.create()
        }
    }

    public async destroy(): Promise<void> {
        if (await this.cluster.exists() === false) {
            throw new LocalClusterIsMissingException()
        }

        await this.cluster.destroy()
    }
}

