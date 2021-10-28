import { LocalClusterManager, LocalClusterIsMissingException, LocalCluster } from '../LocalClusterManager'

class ClusterSpy implements LocalCluster {
    static createdCount: number = 0

    private created: boolean = false

    public started: boolean = false

    public async create(): Promise<void> {
        this.created = true
        ClusterSpy.createdCount ++
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

    public async stop(): Promise<void> {
        this.started = false
    }

    public async kubeconfig(): Promise<string> {
        return '<<imagine-valid-kubeconfig>>'
    }
}

describe('#LocalClusterManager', () => {
    let clusterSpy: ClusterSpy
    let cluster: LocalClusterManager

    beforeEach(() => {
        clusterSpy = new ClusterSpy()
        cluster = new LocalClusterManager(clusterSpy)
    })

    describe('- launch()', () => {
        test('creating existing cluster should be idempotent', async () => {
            expect(ClusterSpy.createdCount).toBe(0)
            await cluster.launch()
            expect(ClusterSpy.createdCount).toBe(1)

            await cluster.launch()
            expect(ClusterSpy.createdCount).toBe(1)
        })

        test('launching non-existent cluster should not try to start it (already started)', async () => {
            expect(clusterSpy.started).toBe(false)
            await cluster.launch()
            expect(clusterSpy.started).toBe(false)
        })

        test('launching existing cluster should only start it', async () => {
            await cluster.launch()
            expect(clusterSpy.started).toBe(false)
            await cluster.launch()
            expect(clusterSpy.started).toBe(true)
        })
    })

    describe('- destroy()', () => {
        test('destroying non-existent cluster should throw exception', async () => {
            await expect(cluster.destroy()).rejects.toBeInstanceOf(LocalClusterIsMissingException)
        })

        test('existing cluster should be destroyable', async () => {
            await cluster.launch()
            expect(await clusterSpy.exists()).toBe(true)

            await cluster.destroy()
            expect(await clusterSpy.exists()).toBe(false)
        })
    })

    describe('- stop()', () => {
        test('stopping a non-running cluster should fail silently', async () => {
            await expect(cluster.stop()).resolves.not.toThrow()
        })

        test('a running cluster should be stoppable', async () => {
            await cluster.launch()
            clusterSpy.started = true
            await cluster.stop()
            expect(clusterSpy.started).toBe(false)
        })
    })

    describe('- kubeconfig()', () => {
        test('getting kubeconfig from non-existent cluster should throw exception', async () => {
            await expect(cluster.kubeconfig()).rejects.toBeInstanceOf(LocalClusterIsMissingException)
        })

        test('existing cluster should return kubeconfig', async () => {
            await cluster.launch()
            expect(await cluster.kubeconfig()).toBe('<<imagine-valid-kubeconfig>>')
        })
    })
})