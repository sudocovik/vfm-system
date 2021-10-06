import { LocalCluster, LocalClusterIsMissingException, LocalClusterManager } from './local-cluster'

class UnitTestClusterManager implements LocalClusterManager {
    static createdCount: number = 0

    private created: boolean = false

    public started: boolean = false

    public async create(): Promise<void> {
        this.created = true
        UnitTestClusterManager.createdCount ++
    }

    public async destroy(): Promise<void> {
        this.created = false
    }

    public async exists(): Promise<boolean> {
        return this.created === true
    }

    public async start(): Promise<void> {
        this.started = true
    }
}

describe('#local cluster', () => {
    test('creating existing cluster should be idempotent', async () => {
        const runner = new UnitTestClusterManager()
        const cluster = new LocalCluster(runner)

        expect(UnitTestClusterManager.createdCount).toBe(0)
        await cluster.launch()
        expect(UnitTestClusterManager.createdCount).toBe(1)

        await cluster.launch()
        expect(UnitTestClusterManager.createdCount).toBe(1)
    })

    test('destroying non-existent cluster should throw exception', async () => {
        const cluster = new LocalCluster(new UnitTestClusterManager())

        await expect(cluster.destroy()).rejects.toBeInstanceOf(LocalClusterIsMissingException)
    })

    test('existing cluster should be destroyable', async () => {
        const runner = new UnitTestClusterManager()
        const cluster = new LocalCluster(runner)

        await cluster.launch()
        expect(await runner.exists()).toBe(true)

        await cluster.destroy()
        expect(await runner.exists()).toBe(false)
    })

    test('launching non-existent cluster should not try to start it (should be already started)', async () => {
        const runner = new UnitTestClusterManager()
        const cluster = new LocalCluster(runner)

        expect(runner.started).toBe(false)
        await cluster.launch()
        expect(runner.started).toBe(false)
    })

    test('launching existing cluster should only start it', async () => {
        const runner = new UnitTestClusterManager()
        const cluster = new LocalCluster(runner)

        await cluster.launch()
        expect(runner.started).toBe(false)
        await cluster.launch()
        expect(runner.started).toBe(true)
    })
})