export interface LocalClusterManager {
    create(): Promise<void>

    exists(): Promise<boolean>

    start(): Promise<void>

    stop(): Promise<void>

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
            return
        }

        await this.cluster.start()
    }

    public async destroy(): Promise<void> {
        if (await this.cluster.exists() === false) {
            throw new LocalClusterIsMissingException()
        }

        await this.cluster.destroy()
    }

    public async stop(): Promise<void> {
        await this.cluster.stop()
    }
}

