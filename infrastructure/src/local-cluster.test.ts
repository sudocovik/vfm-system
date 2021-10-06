import { LocalCluster, LocalClusterIsMissingException, LocalClusterRunner } from './local-cluster'

class UnitTestCluster implements LocalClusterRunner {
    static createdCount: number = 0

    private created: boolean = false

    public async create(): Promise<void> {
        this.created = true
        UnitTestCluster.createdCount ++
    }

    public async destroy(): Promise<void> {
    }

    public async exists(): Promise<boolean> {
        return this.created
    }

    public async start(): Promise<void> {
    }
}

describe('#local cluster', () => {
    test('creating existing cluster should be idempotent', async () => {
        const runner = new UnitTestCluster()
        const cluster: LocalCluster = new LocalCluster(runner)

        expect(UnitTestCluster.createdCount).toBe(0)
        await cluster.launch()
        expect(UnitTestCluster.createdCount).toBe(1)

        await cluster.launch()
        expect(UnitTestCluster.createdCount).toBe(1)
    })

    test('destroying non-existent cluster should throw exception', async () => {
        const cluster: LocalCluster = new LocalCluster(new UnitTestCluster())

        await expect(cluster.destroy()).rejects.toBeInstanceOf(LocalClusterIsMissingException)
    })
})