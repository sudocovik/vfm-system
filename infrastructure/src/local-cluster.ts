export interface LocalClusterRunner {
    create(): Promise<void>

    exists(): Promise<boolean>

    start(): Promise<void>

    destroy(): Promise<void>
}

export class LocalCluster {
    public constructor(
        public runner: LocalClusterRunner
    ) {}

    public async launch(): Promise<string> {
        await this.runner.create()
        return ''
    }
}