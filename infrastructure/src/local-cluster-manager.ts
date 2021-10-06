export interface LocalCluster {
    create(): Promise<void>

    destroy(): Promise<void>

    exists(): Promise<boolean>

    start(): Promise<void>

    stop(): Promise<void>

    kubeconfig(): Promise<string>
}

export class LocalClusterIsMissingException extends Error {}

export class LocalClusterManager {
    public constructor(
        private cluster: LocalCluster
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

    public async kubeconfig(): Promise<string> {
        if (await this.cluster.exists() === false) {
            throw new LocalClusterIsMissingException()
        }

        return await this.cluster.kubeconfig()
    }
}

